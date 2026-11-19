import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_MODEL, cleanText, parseDoc, type ResumeDoc } from "@/lib/resume-tailor";
import {
  INTERVIEW_PER_EMAIL_PER_MONTH,
  INTERVIEW_PER_MONTH,
  buildInterviewRequest,
  inventedNumbers,
  isStage,
  parseInterviewResponse,
  plainText,
  type InterviewInput,
  type PrepSheet,
  type Stage,
} from "@/lib/interview";
import { getKv, bumpCounter, monthKey, emailKey } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// "Interview prep": a prep sheet for one job, built only from the person's resume, the true stories they told us, and the job.
// A sheet that uses a number nobody gave us is thrown away and tried once more. Each email gets a monthly allowance (reserved
// first, handed back if nothing usable comes back). Nothing is stored here.

export const dynamic = "force-dynamic";

const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
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
  Array.isArray(value) ? value.map((v) => plainText(v, itemMax)).filter(Boolean).slice(0, countMax) : [];

async function ask(input: InterviewInput): Promise<PrepSheet | null> {
  const payload = JSON.stringify(buildInterviewRequest(input, MODEL));
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(50000),
      });
      if (res.ok) {
        const parsed = parseInterviewResponse(await res.json(), input.stage);
        if (parsed) return parsed;
        console.error(`resume-interview attempt ${attempt}: no usable tool call`);
      } else {
        console.error(`resume-interview attempt ${attempt}: Claude answered ${res.status}`);
        if (res.status !== 429 && res.status < 500) return null;
      }
    } catch (err) {
      console.error(`resume-interview attempt ${attempt} failed`, err instanceof Error ? err.message : err);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
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
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!owner && tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  const doc = body.doc && typeof body.doc === "object" ? (parseDoc(body.doc as Record<string, unknown>) as ResumeDoc | null) : null;
  if (!doc) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  const stage: Stage = isStage(body.stage) ? body.stage : "manager";

  const input: InterviewInput = {
    doc,
    stories: plainText(body.stories, 3000),
    postingTitle: cleanText(body.postingTitle, 140),
    postingCompany: cleanText(body.postingCompany, 120),
    postingKeywords: strings(body.postingKeywords, 60, 14),
    fitReason: plainText(body.fitReason, 400),
    unmet: strings(body.unmet, 200, 6),
    stage,
  };

  // Hands the count back if nothing usable came back, so a failed try costs the person nothing.
  let giveBack = async () => {};
  if (!owner) {
    try {
      const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
      const kv = await getKv(live);
      const month = monthKey().replace("month/", "");
      const mineKey = `interview/${month}/${emailKey(email).replace("email/", "")}`;
      const allKey = `interview-all/${month}`;
      giveBack = async () => {
        await bumpCounter(kv, mineKey, -1, INTERVIEW_PER_EMAIL_PER_MONTH).catch(() => null);
        await bumpCounter(kv, allKey, -1, INTERVIEW_PER_MONTH).catch(() => null);
      };
      const mine = await bumpCounter(kv, mineKey, 1, INTERVIEW_PER_EMAIL_PER_MONTH);
      if (mine === null) return NextResponse.json({ error: "interview-limit" }, { status: 429 });
      const all = await bumpCounter(kv, allKey, 1, INTERVIEW_PER_MONTH);
      if (all === null) {
        await bumpCounter(kv, mineKey, -1, INTERVIEW_PER_EMAIL_PER_MONTH);
        return NextResponse.json({ error: "cap" }, { status: 429 });
      }
    } catch (err) {
      console.error("resume-interview limits failed", err);
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }

  // Everything the person gave us, so a number that appears nowhere in it can be caught.
  const sources = [JSON.stringify({ ...doc, contact: [] }), input.stories, input.postingTitle, input.postingKeywords.join(" "), input.fitReason, input.unmet.join(" ")];

  let sheet = await ask(input);
  if (sheet) {
    const invented = inventedNumbers(sheet, sources);
    if (invented.length > 0) {
      const second = await ask({ ...input, fix: `Your last sheet used numbers that are not in the material: ${invented.join(", ")}. Remove them, or use only numbers from the resume or stories. Keep every rule.` });
      if (second) sheet = second;
    }
  }
  if (!sheet) {
    await giveBack();
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  if (inventedNumbers(sheet, sources).length > 0) {
    await giveBack();
    console.error("resume-interview refused a sheet with numbers nobody gave us");
    return NextResponse.json({ error: "refused" }, { status: 422 });
  }
  return NextResponse.json({ ok: true, sheet });
}
