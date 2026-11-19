import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  addMissingContact,
  buildContactRequest,
  buildLetterRequest,
  buildResumeRequest,
  DEFAULT_VARIANT,
  type PromptVariant,
  cleanAttachments,
  contactFromText,
  contactGaps,
  MAX_ATTACH_B64_TOTAL,
  RESUME_MODEL,
  MAX_NOTES_CHARS,
  MAX_POSTING_CHARS,
  MAX_RESUME_CHARS,
  parseContactResponse,
  parseLetterResponse,
  parseResumeResponse,
  type TailorInput,
} from "@/lib/resume-tailor";
import { DEFAULT_MONTHLY_CAP, FREE_PER_EMAIL, getKv, purchasedTotal, refund, reserve, withTimeout, type Reservation } from "@/lib/resume-limits";
import { claimRefund, finishBuildMark, startBuildMark, validBuildId, type BuildMark } from "@/lib/resume-builds";
import { isLiveHost } from "@/lib/coaching-recipients";
import { keywordCoverage } from "@/lib/resume-ats";
import { resumeToPlainText } from "@/lib/resume-files";

// Rewrites a person's resume for one job posting (see lib/resume-tailor.ts). The resume and posting
// are sent to Anthropic to be rewritten and are not logged or stored here. Free use is limited per
// email address and per month (lib/resume-limits.ts). Without CLAUDE_API_KEY it answers 503.

export const dynamic = "force-dynamic";

// Deliberately not named ANTHROPIC_API_KEY: Netlify's AI Gateway can inject its own variables with that
// name, and its keys do not work against Anthropic directly. This one is set by hand in Netlify.
const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
// Where the "new resume built" alerts go. Set NOTIFY_EMAIL in Netlify to change it without a code change.
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "techjourneyinfo@gmail.com";
// "How did you find us" is required. Keep this list in step with the dropdown in components/resume/ResumeBuilder.tsx.
const SOURCES = new Set(["YouTube", "Instagram or TikTok", "Google search", "A friend or family member", "Career day or an event", "Other"]);
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const MONTHLY_CAP = Number(process.env.RESUME_MONTHLY_CAP) || DEFAULT_MONTHLY_CAP;
// The owner (for testing) can bypass the free limits and pick the model by sending a secret code that
// matches RESUME_OWNER_CODE in Netlify. It is a secret on purpose: an email address would be guessable.
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";
const OWNER_MODELS = new Set(["claude-sonnet-5-5", "claude-haiku-5-5"]);

function isOwner(code: unknown) {
  if (!OWNER_CODE || typeof code !== "string") return false;
  const a = Buffer.from(code);
  const b = Buffer.from(OWNER_CODE);
  return a.length === b.length && timingSafeEqual(a, b);
}

// A small, best-effort limit per visitor against bots. Each server instance keeps its own count.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

// Tells Juston someone used the tool. Never includes the resume itself.
async function notify(live: boolean, email: string, jobTitle: string, source: string, withLetter: boolean) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: `${live ? "" : "[TEST] "}New resume built${withLetter ? " + cover letter" : ""}: ${jobTitle || "job"}`,
        html: `<p>${escapeHtml(email)} built a resume for "${escapeHtml(jobTitle)}".</p><p>Found us via: ${escapeHtml(source || "not given")}</p>`,
      }),
    });
  } catch (err) {
    console.error("resume-tailor notify failed", err);
  }
}


// Asks Claude for the resume. A failed try (a busy service, or a reply that skipped the tool call) is
// retried (up to three tries in all) on the fast model, which is very reliable at this, so people rarely
// see an error. A busy or rate-limited service is given the pause it asks for between tries.
// What went wrong is logged without any of their words.
// Netlify's edge cuts off a request that has been quiet for about 30 seconds, even though the function itself may run
// to 60. A first draft takes 15 to 20 seconds, so a second full pass cannot fit and made some builds time out.
// The repair pass is therefore only attempted when the first draft came back this fast, which is rare. It can be
// turned back on once the reply is streamed (so the connection is never quiet).
const REPAIR_ONLY_IF_FASTER_THAN_MS = 9000;
const FALLBACK_MODEL = "claude-haiku-5-5";
const MAX_ATTEMPTS = 3;

// Runs one request (the resume or the cover letter) with the tries described above. `build` makes the request
// for a model, and `parse` turns the reply into a result, or null when it was not usable.
async function askClaude<T>(
  label: string,
  build: (model: string) => unknown,
  parse: (data: unknown) => T | null,
  model: string,
  budgetMs = 55000,
  state: { badFile?: boolean } = {}
): Promise<T | null> {
  const started = Date.now();
  let pauseMs = 800;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // Stay inside the host's time limit: each try gets only what is left of a 55 second budget.
    const left = budgetMs - (Date.now() - started);
    if (attempt > 1 && left < 9000) break;
    const payload = JSON.stringify(build(attempt === 1 ? model : FALLBACK_MODEL));
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(Math.min(40000, left)),
      });
      if (!res.ok) {
        const detail = (await res.text().catch(() => "")).slice(0, 300);
        console.error(`${label} attempt ${attempt}: Claude answered ${res.status} ${detail}`);
        // A bad request will not get better. When the reply names a file, tell the person the file is the problem.
        if (res.status === 400 && /pdf|document|image|media|base64|file/i.test(detail)) state.badFile = true;
        if (res.status !== 429 && res.status < 500) return null;
        const asked = Number(res.headers.get("retry-after"));
        pauseMs = Math.min(Math.max(Number.isFinite(asked) ? asked * 1000 : 0, 800 * attempt), 4000);
      } else {
        const data = await res.json();
        const parsed = parse(data);
        if (parsed) return parsed;
        const content = (data as { content?: { type?: string }[] })?.content;
        const kinds = Array.isArray(content) ? content.map((c) => c?.type).join(",") : "none";
        console.error(`${label} attempt ${attempt}: no usable tool call (stop_reason ${(data as { stop_reason?: string })?.stop_reason}, blocks ${kinds})`);
      }
    } catch (err) {
      console.error(`${label} attempt ${attempt} failed`, err instanceof Error ? err.message : err);
    }
    await new Promise((resolve) => setTimeout(resolve, pauseMs));
    pauseMs = 800 * attempt;
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  // Only the site's own pages may call this.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const email = text(body.email);
  const resumeText = text(body.resumeText);
  const postingText = text(body.postingText);
  const source = text(body.source);
  const notes = text(body.notes);
  const wantsLetter = body.coverLetter === true && body.general !== true;
  const hiringManager = text(body.hiringManager).slice(0, 120);
  const fromScratch = body.fromScratch === true;
  // A general resume: no posting, just the kind of role the person is aiming for.
  const general = body.general === true;
  const targetRole = text(body.targetRole).replace(/\s+/g, " ").slice(0, 120);
  const matchDesign = body.matchDesign === true && !fromScratch;
  const resumeFiles = cleanAttachments(body.resumeFiles);
  const postingFiles = cleanAttachments(body.postingFiles);

  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!SOURCES.has(source)) return NextResponse.json({ error: "source" }, { status: 400 });
  if (!resumeFiles || !postingFiles) return NextResponse.json({ error: "files" }, { status: 400 });
  // Either pasted text or at least one file is needed for each of the two.
  if (resumeText.length < 150 && resumeFiles.length === 0) return NextResponse.json({ error: "resume-short" }, { status: 400 });
  if (general) {
    if (targetRole.length < 3) return NextResponse.json({ error: "target-short" }, { status: 400 });
  } else if (postingText.length < 80 && postingFiles.length === 0) return NextResponse.json({ error: "posting-short" }, { status: 400 });
  if (resumeText.length > MAX_RESUME_CHARS || postingText.length > MAX_POSTING_CHARS || notes.length > MAX_NOTES_CHARS) {
    return NextResponse.json({ error: "too-long" }, { status: 413 });
  }
  const attachedSize = [...resumeFiles, ...postingFiles].reduce((n, f) => n + f.data.length, 0);
  if (attachedSize > MAX_ATTACH_B64_TOTAL) return NextResponse.json({ error: "too-big" }, { status: 413 });

  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
  const unlimited = isOwner(body.ownerCode);
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!unlimited && tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });


  const model = unlimited && typeof body.model === "string" && OWNER_MODELS.has(body.model) ? body.model : MODEL;
  // Only the owner can try the newer formatting rules; visitors always get the default version.
  const variant: PromptVariant = unlimited && (body.promptVariant === "v2" || body.promptVariant === "v3" || body.promptVariant === "v3b" || body.promptVariant === "v3c" || body.promptVariant === "baseline") ? body.promptVariant : DEFAULT_VARIANT;

  // The usage counters live in Netlify Blobs. If that storage is slow or down, the person should still get their
  // resume: we log it loudly and let the build through uncounted, instead of making them wait for a timeout.
  let kv: Awaited<ReturnType<typeof getKv>> | null = null;
  let reservation: Reservation;
  let counted = true;
  try {
    kv = await withTimeout(getKv(live), 5000, "open usage store");
    reservation = await withTimeout(reserve(kv, email, { unlimited, monthlyCap: MONTHLY_CAP }), 10000, "reserve a build");
  } catch (err) {
    console.error("resume-tailor: usage counters unavailable, building without counting", err instanceof Error ? err.message : err);
    counted = false;
    reservation = { ok: true, used: 0, unlimited: false, paid: false, credits: 0 };
  }
  if (!reservation.ok) {
    return NextResponse.json({ error: reservation.reason }, { status: 429 });
  }

  const paidBuild = reservation.paid;

  // A small record of this build, so that if the page never gets the answer (a timeout, a dropped connection) the
  // build can be given back, and so a build is never given back twice (see lib/resume-builds.ts).
  const buildId = body.buildId;
  let mark: BuildMark | null = null;
  if (counted && kv && !unlimited && validBuildId(buildId)) {
    mark = await withTimeout(startBuildMark(kv, buildId, email, paidBuild), 5000, "record the build").catch(() => null);
  }
  const giveBack = async () => {
    if (!counted || !kv) return;
    try {
      // Whoever moves the record to "refunded" first does the refund, so it can only happen once.
      if (mark && !(await withTimeout(claimRefund(kv, mark), 5000, "claim the refund"))) return;
      await withTimeout(refund(kv, email, { unlimited, paid: paidBuild }), 8000, "give a build back");
    } catch {
      /* the build is not counted twice either way: a failure here is logged by the caller's own error path */
    }
  };

  try {
    // The resume and the cover letter are written by two requests at the same time. A letter is a different job,
    // and asking for both in one answer often left the letter missing or half-written.
    const base: TailorInput = { general, targetRole, resumeText, resumeFiles, postingText: general ? "" : postingText, postingFiles: general ? [] : postingFiles, notes, coverLetter: false, hiringManager, fromScratch, matchDesign: matchDesign && resumeFiles.length > 0 };
    const startedAll = Date.now();
    const fileState: { badFile?: boolean } = {};
    const [firstParsed, letterResult] = await Promise.all([
      askClaude("resume-tailor", (m) => buildResumeRequest(base, m, [], variant), (d) => parseResumeResponse(d, general), model, 55000, fileState),
      wantsLetter ? askClaude("resume-letter", (m) => buildLetterRequest(base, m), parseLetterResponse, model) : Promise.resolve(null),
    ]);
    let parsed = firstParsed;
    if (!parsed) {
      await giveBack();
      if (fileState.badFile) {
        return NextResponse.json({ error: "problem", message: "We couldn't read one of your files. Try saving it again as a PDF or picture, or paste the text instead. Nothing was counted." }, { status: 422 });
      }
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    // The contact line is checked before anything else: an email and a phone number are what a recruiter needs.
    // Pasted text is searched in plain code. For files, a small fast question reads the contact details off them.
    // Both steps are bonuses and fail soft, and the second only runs while there is time left before the host's limit.
    if (parsed.ok && !fromScratch) {
      try {
        const doc = parsed.result.resume;
        let gaps = contactGaps(doc.contact);
        if (gaps.email || gaps.phone) {
          if (resumeText) doc.contact = addMissingContact(doc.contact, contactFromText(resumeText, doc.contact));
          gaps = contactGaps(doc.contact);
          const used = Date.now() - startedAll;
          if ((gaps.email || gaps.phone) && resumeFiles.length > 0 && used < 22000) {
            const found = await askClaude("resume-contact", () => buildContactRequest(base), parseContactResponse, model, Math.min(9500, 27000 - used));
            if (found) {
              doc.contact = addMissingContact(doc.contact, found);
              console.log("resume-tailor: contact filled in by a second look", { items: found.length });
            }
          }
        }
      } catch (err) {
        console.error("resume-tailor: contact check failed, keeping the draft", err instanceof Error ? err.message : err);
      }
    }

    // A draw can come back with too little of the posting's own wording. When that happens and there is time, one
    // more pass names the missed phrases. The better of the two drafts is kept, and a draft that dropped jobs is not.
    if (parsed.ok && !fromScratch && !general && parsed.result.postingKeywords.length >= 6) {
     try {
      const first = keywordCoverage(resumeToPlainText(parsed.result.resume), parsed.result.postingKeywords);
      const total = parsed.result.postingKeywords.length;
      const elapsed = Date.now() - startedAll;
      if (first.found.length / total < 0.65 && first.missing.length >= 3 && elapsed < REPAIR_ONLY_IF_FASTER_THAN_MS) {
        const missing = first.missing.slice(0, 8);
        const second = await askClaude("resume-repair", (m) => buildResumeRequest(base, m, missing, variant), parseResumeResponse, model, 54000 - elapsed);
        if (second && second.ok) {
          const after = keywordCoverage(resumeToPlainText(second.result.resume), second.result.postingKeywords);
          const better = after.found.length / Math.max(1, second.result.postingKeywords.length) > first.found.length / total;
          const keptJobs = second.result.resume.experience.length >= parsed.result.resume.experience.length;
          console.log("resume-tailor: repair pass", { before: `${first.found.length}/${total}`, after: `${after.found.length}/${second.result.postingKeywords.length}`, used: better && keptJobs });
          if (better && keptJobs) parsed = second;
        }
      }
     } catch (err) {
      // The repair is a bonus: if anything goes wrong in it, the first draft is used as it is.
      console.error("resume-tailor: repair pass failed, keeping the first draft", err instanceof Error ? err.message : err);
     }
    }
    if (!parsed.ok) {
      await giveBack();
      return NextResponse.json({ error: "problem", message: parsed.problem }, { status: 422 });
    }
    const letter = letterResult && letterResult.ok ? letterResult.letter : null;
    if (letter) parsed.result.coverLetter = letter;
    const letterFailed = wantsLetter && !letter;
    // Owner test builds (the comparison scripts run dozens at a time) must not email the owner: each email counts against the
    // daily Resend allowance that visitors' receipts and resume copies share.
    if (!unlimited) await notify(live, email, parsed.result.postingTitle, source, Boolean(letter));
    if (mark && kv) await withTimeout(finishBuildMark(kv, mark), 5000, "finish the build record").catch(() => {});

    // "Free build 2 of 2" or "Paid build 3 of 15", for the page and the email. Never worth failing a finished build over.
    let usage: { kind: "free" | "paid"; number: number; of: number | null; left: number } | null = null;
    if (!unlimited && counted && kv) {
      try {
        if (reservation.paid) {
          const bought = await withTimeout(purchasedTotal(kv, email), 5000, "read purchases");
          usage = { kind: "paid", number: bought ? Math.max(1, bought - reservation.credits) : 0, of: bought, left: reservation.credits };
        } else {
          usage = { kind: "free", number: reservation.used, of: FREE_PER_EMAIL, left: Math.max(0, FREE_PER_EMAIL - reservation.used) + reservation.credits };
        }
      } catch {
        usage = null;
      }
    }
    return NextResponse.json({
      ok: true,
      usage,
      result: parsed.result,
      letterFailed,
      // Free builds left, plus any paid builds they bought.
      remaining: unlimited || !counted ? null : reservation.paid ? reservation.credits : Math.max(0, FREE_PER_EMAIL - reservation.used) + reservation.credits,
    });
  } catch {
    await giveBack();
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
