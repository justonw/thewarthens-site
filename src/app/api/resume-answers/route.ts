import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_MODEL, cleanText, parseDoc, type ResumeDoc } from "@/lib/resume-tailor";
import {
  ANSWERS_PER_EMAIL_PER_MONTH,
  ANSWERS_PER_MONTH,
  MAX_EXTRA_CHARS,
  MAX_LIMIT,
  MAX_QUESTION_CHARS,
  MIN_LIMIT,
  buildAnswerRequest,
  buildVerifyRequest,
  parseVerifyResponse,
  repairInstruction,
  type Unsupported,
  inventedNumbers,
  isAnswerTweak,
  isPersonalQuestion,
  parseAnswerResponse,
  plainAnswer,
  type AnswerInput,
  type AnswerResult,
} from "@/lib/answers";
import { getKv, bumpCounter, monthKey, emailKey } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// "Answers": a draft answer to one application question, in the person's first-person voice, built only from their resume,
// the true stories they told us, and the job posting. A draft that uses a number nobody gave us is refused, and a question
// that needs facts only the person has (pay, work authorization, and so on) is not sent to the AI at all. Each email gets a
// monthly allowance (reserved first, handed back if nothing usable comes back). Nothing is stored here.

export const dynamic = "force-dynamic";

const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";
// The second look is a quick, focused job, so it runs on the faster model.
const VERIFY_MODEL = process.env.RESUME_VERIFY_MODEL || "claude-haiku-5-5";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 25;
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function isOwner(code: unknown) {
  if (!OWNER_CODE || typeof code !== "string") return false;
  const a = Buffer.from(code);
  const b = Buffer.from(OWNER_CODE);
  return a.length === b.length && timingSafeEqual(a, b);
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
const strings = (value: unknown, itemMax: number, countMax: number): string[] =>
  Array.isArray(value) ? value.map((v) => plainAnswer(v, itemMax)).filter(Boolean).slice(0, countMax) : [];

async function ask(input: AnswerInput): Promise<AnswerResult | null> {
  const payload = JSON.stringify(buildAnswerRequest(input, MODEL));
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(35000),
      });
      if (res.ok) {
        const parsed = parseAnswerResponse(await res.json());
        if (parsed) return parsed;
        console.error(`resume-answers attempt ${attempt}: no usable tool call`);
      } else {
        console.error(`resume-answers attempt ${attempt}: Claude answered ${res.status}`);
        if (res.status !== 429 && res.status < 500) return null;
      }
    } catch (err) {
      console.error(`resume-answers attempt ${attempt} failed`, err instanceof Error ? err.message : err);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
  }
  return null;
}

// Compares a draft to the material. Returns the unsupported sentences, or null when the check could not be done.
async function verify(input: AnswerInput, answer: string): Promise<Unsupported[] | null> {
  const payload = JSON.stringify(buildVerifyRequest(input, answer, VERIFY_MODEL));
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const parsed = parseVerifyResponse(await res.json(), answer);
        if (parsed) return parsed;
      } else if (res.status !== 429 && res.status < 500) return null;
    } catch {
      /* try once more, then report that it was not checked */
    }
    await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

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
  const owner = isOwner(body.ownerCode);
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!owner && tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  const question = plainAnswer(body.question, MAX_QUESTION_CHARS);
  if (question.length < 8) return NextResponse.json({ error: "question" }, { status: 400 });
  const doc = body.doc && typeof body.doc === "object" ? (parseDoc(body.doc as Record<string, unknown>) as ResumeDoc | null) : null;
  if (!doc) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  const tweak = isAnswerTweak(body.tweak) ? body.tweak : "";
  const rawLimit = typeof body.limit === "number" && Number.isFinite(body.limit) ? Math.round(body.limit) : 0;
  const limit = rawLimit >= MIN_LIMIT ? Math.min(MAX_LIMIT, rawLimit) : 0;

  // For testing the second look on its own (owner only): check a draft someone wrote, without writing a new one.
  if (owner && typeof body.verifyAnswer === "string") {
    const probe: AnswerInput = { doc, stories: plainAnswer(body.stories, 3000), postingTitle: cleanText(body.postingTitle, 140), postingCompany: cleanText(body.postingCompany, 120), postingKeywords: strings(body.postingKeywords, 60, 14), fitReason: "", question, limit: 0, extra: plainAnswer(body.extra, MAX_EXTRA_CHARS), tweak: "", previous: "" };
    return NextResponse.json({ ok: true, flagged: await verify(probe, plainAnswer(body.verifyAnswer, 6000)) });
  }

  // A question about pay, work authorization, and the like is for the person to answer, so it costs nothing.
  if (isPersonalQuestion(question)) {
    return NextResponse.json({ ok: true, result: { outcome: "yours", note: "This one asks for facts only you can give, such as pay, work authorization, or your dates. Answer it yourself so it is exactly right." } satisfies AnswerResult });
  }

  const input: AnswerInput = {
    doc,
    stories: plainAnswer(body.stories, 3000),
    postingTitle: cleanText(body.postingTitle, 140),
    postingCompany: cleanText(body.postingCompany, 120),
    postingKeywords: strings(body.postingKeywords, 60, 14),
    fitReason: plainAnswer(body.fitReason, 400),
    question,
    limit,
    extra: plainAnswer(body.extra, MAX_EXTRA_CHARS),
    tweak,
    previous: plainAnswer(body.previous, 3000),
  };

  // Hands the count back if nothing usable came back, so a failed try costs the person nothing.
  let giveBack = async () => {};
  if (!owner) {
    try {
      const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
      const kv = await getKv(live);
      const month = monthKey().replace("month/", "");
      const mineKey = `answers/${month}/${emailKey(email).replace("email/", "")}`;
      const allKey = `answers-all/${month}`;
      giveBack = async () => {
        await bumpCounter(kv, mineKey, -1, ANSWERS_PER_EMAIL_PER_MONTH).catch(() => null);
        await bumpCounter(kv, allKey, -1, ANSWERS_PER_MONTH).catch(() => null);
      };
      const mine = await bumpCounter(kv, mineKey, 1, ANSWERS_PER_EMAIL_PER_MONTH);
      if (mine === null) return NextResponse.json({ error: "answers-limit" }, { status: 429 });
      const all = await bumpCounter(kv, allKey, 1, ANSWERS_PER_MONTH);
      if (all === null) {
        await bumpCounter(kv, mineKey, -1, ANSWERS_PER_EMAIL_PER_MONTH);
        return NextResponse.json({ error: "cap" }, { status: 429 });
      }
    } catch (err) {
      console.error("resume-answers limits failed", err);
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }

  // Everything the person gave us, so a number that appears nowhere in it can be caught.
  const sources = [JSON.stringify({ ...doc, contact: [] }), input.stories, input.extra, input.question, input.postingTitle, input.postingKeywords.join(" ")];

  const started = Date.now();
  let result = await ask(input);
  // One careful second try if the first draft broke a rule that code can check.
  if (result?.outcome === "answer") {
    const invented = inventedNumbers(result.answer, sources);
    const over = limit > 0 && result.answer.length > limit;
    if (invented.length > 0 || over) {
      const fix = [
        invented.length > 0 ? `Your last draft used numbers that are not in the material: ${invented.join(", ")}. Remove them or use only numbers from the resume, stories, or the person's own words.` : "",
        over ? `Your last draft was ${result.answer.length} characters, over the limit of ${limit}. Shorten it clearly under the limit.` : "",
      ]
        .filter(Boolean)
        .join(" ");
      const second = await ask({ ...input, fix, previous: input.previous || result.answer });
      if (second) result = second;
    }
  }
  if (!result) {
    await giveBack();
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  if (result.outcome === "answer") {
    if (inventedNumbers(result.answer, sources).length > 0) {
      await giveBack();
      console.error("resume-answers refused a draft with numbers nobody gave us");
      return NextResponse.json({ error: "refused" }, { status: 422 });
    }
    // The second look: is every sentence in the material? If not, one repair pass, then look again.
    let flagged = await verify(input, result.answer);
    if (flagged && flagged.length > 0 && Date.now() - started < 16000) {
      const repaired = await ask({ ...input, fix: repairInstruction(flagged), previous: input.previous || result.answer });
      if (repaired?.outcome === "answer" && inventedNumbers(repaired.answer, sources).length === 0 && !(limit > 0 && repaired.answer.length > limit + 40)) {
        const again = await verify(input, repaired.answer);
        // Keep the repaired draft only if it checks no worse than the first.
        if (again && again.length <= flagged.length) {
          result = repaired;
          flagged = again;
        }
      }
    }
    const answerNow = result.outcome === "answer" ? result.answer : "";
    return NextResponse.json({ ok: true, result, overLimit: limit > 0 && answerNow.length > limit, checked: flagged !== null, flagged: flagged ?? [] });
  }
  // A question back to the person, or "answer it yourself": no draft was written, so it costs nothing.
  await giveBack();
  return NextResponse.json({ ok: true, result });
}
