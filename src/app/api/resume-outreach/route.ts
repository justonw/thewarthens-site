import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cleanAttachments, parseDoc, RESUME_MODEL, type ResumeDoc, MAX_ATTACH_B64_TOTAL } from "@/lib/resume-tailor";
import {
  MAX_RECIPIENT_CHARS,
  MAX_RECIPIENT_FILES,
  MAX_RECIPIENT_NAME,
  OUTREACH_PER_EMAIL_PER_MONTH,
  OUTREACH_PER_MONTH,
  buildOutreachRequest,
  isAudience,
  isPurpose,
  isTweak,
  parseOutreachResponse,
  plain,
  type OutreachResult,
} from "@/lib/outreach";
import { getKv, bumpCounter, monthKey, emailKey } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// "Reach out": writes a short first message from the person's finished resume to a recruiter, the hiring manager, or
// someone on the team, using whatever they gathered about that person. It costs a little, so each email gets a
// monthly allowance (a count is reserved first and handed back if the AI fails). Nothing is stored here.

export const dynamic = "force-dynamic";

const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
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
  Array.isArray(value) ? value.map((v) => plain(v, itemMax)).filter(Boolean).slice(0, countMax) : [];

async function ask(payload: string): Promise<OutreachResult | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(35000),
      });
      if (res.ok) {
        const parsed = parseOutreachResponse(await res.json());
        if (parsed) return parsed;
        console.error(`resume-outreach attempt ${attempt}: no usable tool call`);
      } else {
        console.error(`resume-outreach attempt ${attempt}: Claude answered ${res.status}`);
        if (res.status !== 429 && res.status < 500) return null;
      }
    } catch (err) {
      console.error(`resume-outreach attempt ${attempt} failed`, err instanceof Error ? err.message : err);
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
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!owner && tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!isAudience(body.audience)) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  const tweak = isTweak(body.tweak) ? body.tweak : "";
  const purpose = isPurpose(body.purpose) ? body.purpose : "intro";
  const daysSince = typeof body.daysSince === "number" && Number.isFinite(body.daysSince) ? Math.min(90, Math.max(1, Math.round(body.daysSince))) : 7;
  const doc = body.doc && typeof body.doc === "object" ? (parseDoc(body.doc as Record<string, unknown>) as ResumeDoc | null) : null;
  if (!doc) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  const files = cleanAttachments(body.recipientFiles);
  if (!files || files.length > MAX_RECIPIENT_FILES || files.reduce((n, f) => n + f.data.length, 0) > MAX_ATTACH_B64_TOTAL) {
    return NextResponse.json({ error: "files" }, { status: 400 });
  }

  const prev = body.previous && typeof body.previous === "object" ? (body.previous as Record<string, unknown>) : null;
  const previous = prev && plain(prev.note, 600) && plain(prev.message, 1400) ? { note: plain(prev.note, 600), message: plain(prev.message, 1400) } : null;

  // Hands the count back if the AI could not do it, so a failed try costs the person nothing.
  let giveBack = async () => {};
  let left: number | null = null;
  if (!owner) {
    try {
      const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
      const kv = await getKv(live);
      const month = monthKey().replace("month/", "");
      const mineKey = `outreach/${month}/${emailKey(email).replace("email/", "")}`;
      const allKey = `outreach-all/${month}`;
      giveBack = async () => {
        await bumpCounter(kv, mineKey, -1, OUTREACH_PER_EMAIL_PER_MONTH).catch(() => null);
        await bumpCounter(kv, allKey, -1, OUTREACH_PER_MONTH).catch(() => null);
      };
      const mine = await bumpCounter(kv, mineKey, 1, OUTREACH_PER_EMAIL_PER_MONTH);
      if (mine === null) return NextResponse.json({ error: "outreach-limit" }, { status: 429 });
      left = OUTREACH_PER_EMAIL_PER_MONTH - mine;
      const all = await bumpCounter(kv, allKey, 1, OUTREACH_PER_MONTH);
      if (all === null) {
        await bumpCounter(kv, mineKey, -1, OUTREACH_PER_EMAIL_PER_MONTH);
        return NextResponse.json({ error: "cap" }, { status: 429 });
      }
    } catch (err) {
      console.error("resume-outreach limits failed", err);
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }

  const payload = JSON.stringify(
    buildOutreachRequest(
      {
        audience: body.audience,
        doc,
        postingTitle: plain(body.postingTitle, 140),
        postingCompany: plain(body.postingCompany, 120),
        postingKeywords: strings(body.postingKeywords, 60, 14),
        fitReason: plain(body.fitReason, 400),
        unmet: strings(body.unmet, 200, 12),
        recipientName: plain(body.recipientName, MAX_RECIPIENT_NAME),
        purpose,
        daysSince,
        relationship: plain(body.relationship, 200),
        recipientText: plain(body.recipientText, MAX_RECIPIENT_CHARS),
        recipientFiles: files,
        tweak,
        previous,
        // Owner testing only: visitors do not get the implication clause until it has proved better.
        implication: owner && body.implication === true,
      },
      MODEL
    )
  );
  const result = await ask(payload);
  if (!result) {
    await giveBack();
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, result, left });
}
