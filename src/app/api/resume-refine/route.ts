import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { buildRefineRequest, cleanText, mergeRefined, parseDoc, parseRefineResponse, RESUME_MODEL, type ResumeDoc } from "@/lib/resume-tailor";
import { getKv, bumpCounter, monthKey, emailKey } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// "I have this": the visitor tells us in a sentence that they have something the posting asks for, and
// we add it to their resume. It costs a little, so each email gets a few a month. Nothing is stored.

export const dynamic = "force-dynamic";

const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";
const REFINES_PER_EMAIL_PER_MONTH = 12;
const REFINES_PER_MONTH = 800;

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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

async function ask(payload: string): Promise<ReturnType<typeof parseRefineResponse>> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(35000),
      });
      if (res.ok) {
        const parsed = parseRefineResponse(await res.json());
        if (parsed) return parsed;
        console.error(`resume-refine attempt ${attempt}: no usable tool call`);
      } else {
        console.error(`resume-refine attempt ${attempt}: Claude answered ${res.status}`);
        if (res.status !== 429 && res.status < 500) return null;
      }
    } catch (err) {
      console.error(`resume-refine attempt ${attempt} failed`, err instanceof Error ? err.message : err);
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
  const requirement = cleanText(body.requirement, 520);
  const answer = cleanText(body.answer, 700);
  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!requirement || answer.length < 3) return NextResponse.json({ error: "answer-short" }, { status: 400 });
  const doc = body.doc && typeof body.doc === "object" ? (parseDoc(body.doc as Record<string, unknown>) as ResumeDoc | null) : null;
  if (!doc) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  // Hands the count back if the AI could not do it, so a failed try costs the person nothing.
  let giveBack = async () => {};
  if (!owner) {
    try {
      const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
      const kv = await getKv(live);
      const month = monthKey().replace("month/", "");
      const mineKey = `refine/${month}/${emailKey(email).replace("email/", "")}`;
      giveBack = async () => {
        await bumpCounter(kv, mineKey, -1, REFINES_PER_EMAIL_PER_MONTH).catch(() => null);
        await bumpCounter(kv, `refine-all/${month}`, -1, REFINES_PER_MONTH).catch(() => null);
      };
      const mine = await bumpCounter(kv, mineKey, 1, REFINES_PER_EMAIL_PER_MONTH);
      if (mine === null) return NextResponse.json({ error: "refine-limit" }, { status: 429 });
      const all = await bumpCounter(kv, `refine-all/${month}`, 1, REFINES_PER_MONTH);
      if (all === null) {
        await bumpCounter(kv, mineKey, -1, REFINES_PER_EMAIL_PER_MONTH);
        return NextResponse.json({ error: "cap" }, { status: 429 });
      }
    } catch (err) {
      console.error("resume-refine limits failed", err);
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }

  const payload = JSON.stringify(
    buildRefineRequest(
      {
        doc,
        requirement,
        answer,
        postingTitle: cleanText(body.postingTitle, 140),
        postingCompany: cleanText(body.postingCompany, 120),
      },
      MODEL
    )
  );
  const parsed = await ask(payload);
  if (!parsed || !parsed.added) await giveBack();
  if (!parsed) return NextResponse.json({ error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true, added: parsed.added, note: parsed.note, resume: mergeRefined(doc, parsed.resume) });
}
