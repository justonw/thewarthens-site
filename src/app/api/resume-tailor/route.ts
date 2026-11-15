import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  buildResumeRequest,
  RESUME_MODEL,
  MAX_POSTING_CHARS,
  MAX_RESUME_CHARS,
  parseResumeResponse,
} from "@/lib/resume-tailor";
import { DEFAULT_MONTHLY_CAP, FREE_PER_EMAIL, getKv, refund, reserve } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

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
const NOTIFY_EMAIL = "justonwarthen@gmail.com";
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
async function notify(live: boolean, email: string, jobTitle: string, source: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: `${live ? "" : "[TEST] "}New resume built: ${jobTitle || "job"}`,
        html: `<p>${escapeHtml(email)} built a resume for "${escapeHtml(jobTitle)}".</p><p>Found us via: ${escapeHtml(source || "not given")}</p>`,
      }),
    });
  } catch (err) {
    console.error("resume-tailor notify failed", err);
  }
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

  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  let body: { email?: unknown; resume?: unknown; posting?: unknown; source?: unknown; ownerCode?: unknown; model?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const resume = typeof body.resume === "string" ? body.resume.trim() : "";
  const posting = typeof body.posting === "string" ? body.posting.trim() : "";
  const source = typeof body.source === "string" ? body.source.trim().slice(0, 60) : "";

  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  if (resume.length < 150) return NextResponse.json({ error: "resume-short" }, { status: 400 });
  if (posting.length < 80) return NextResponse.json({ error: "posting-short" }, { status: 400 });
  if (resume.length > MAX_RESUME_CHARS || posting.length > MAX_POSTING_CHARS) {
    return NextResponse.json({ error: "too-long" }, { status: 413 });
  }

  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
  const unlimited = isOwner(body.ownerCode);
  const model = unlimited && typeof body.model === "string" && OWNER_MODELS.has(body.model) ? body.model : MODEL;

  let kv;
  try {
    kv = await getKv(live);
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let reservation;
  try {
    reservation = await reserve(kv, email, { unlimited, monthlyCap: MONTHLY_CAP });
  } catch (err) {
    console.error("resume-tailor reserve failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (!reservation.ok) {
    return NextResponse.json({ error: reservation.reason }, { status: 429 });
  }

  const giveBack = () => refund(kv, email, { unlimited }).catch(() => {});

  try {
    const res = await fetch(`${API_BASE}/v1/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(buildResumeRequest(resume, posting, model)),
      signal: AbortSignal.timeout(55000),
    });
    if (!res.ok) {
      await giveBack();
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    const parsed = parseResumeResponse(await res.json());
    if (!parsed) {
      await giveBack();
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    if (!parsed.ok) {
      await giveBack();
      return NextResponse.json({ error: "problem", message: parsed.problem }, { status: 422 });
    }
    await notify(live, email, parsed.result.postingTitle, source);
    return NextResponse.json({
      ok: true,
      result: parsed.result,
      remaining: unlimited ? null : Math.max(0, FREE_PER_EMAIL - reservation.used),
    });
  } catch {
    await giveBack();
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
