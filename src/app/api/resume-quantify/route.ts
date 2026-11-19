import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_MODEL } from "@/lib/resume-tailor";
import { QUANTIFY_PER_EMAIL_PER_MONTH, QUANTIFY_PER_MONTH, answerHasNumber, buildQuantifyRequest, checkRewrite, parseQuantifyResponse } from "@/lib/quantify";
import { getKv, bumpCounter, monthKey, emailKey } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// The numbers coach: rewrites one resume bullet around a number the person just gave. The number is theirs, the rest of
// the bullet stays as it was, and an answer that adds any other number is refused. Each email gets a monthly allowance
// (a count is reserved first and handed back if nothing usable comes back). Nothing is stored here.

export const dynamic = "force-dynamic";

const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";

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
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "");

async function ask(payload: string): Promise<string | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const bullet = parseQuantifyResponse(await res.json());
        if (bullet) return bullet;
        console.error(`resume-quantify attempt ${attempt}: no usable tool call`);
      } else {
        console.error(`resume-quantify attempt ${attempt}: Claude answered ${res.status}`);
        if (res.status !== 429 && res.status < 500) return null;
      }
    } catch (err) {
      console.error(`resume-quantify attempt ${attempt} failed`, err instanceof Error ? err.message : err);
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
  const bullet = clean(body.bullet, 400);
  const answer = clean(body.answer, 200);
  if (bullet.length < 10) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  // The number is the whole point, so an answer with none is sent back for the person to fix, at no cost.
  if (!answerHasNumber(answer)) return NextResponse.json({ error: "no-number" }, { status: 400 });

  // Hands the count back if nothing usable came back, so a failed try costs the person nothing.
  let giveBack = async () => {};
  if (!owner) {
    try {
      const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
      const kv = await getKv(live);
      const month = monthKey().replace("month/", "");
      const mineKey = `quantify/${month}/${emailKey(email).replace("email/", "")}`;
      const allKey = `quantify-all/${month}`;
      giveBack = async () => {
        await bumpCounter(kv, mineKey, -1, QUANTIFY_PER_EMAIL_PER_MONTH).catch(() => null);
        await bumpCounter(kv, allKey, -1, QUANTIFY_PER_MONTH).catch(() => null);
      };
      const mine = await bumpCounter(kv, mineKey, 1, QUANTIFY_PER_EMAIL_PER_MONTH);
      if (mine === null) return NextResponse.json({ error: "quantify-limit" }, { status: 429 });
      const all = await bumpCounter(kv, allKey, 1, QUANTIFY_PER_MONTH);
      if (all === null) {
        await bumpCounter(kv, mineKey, -1, QUANTIFY_PER_EMAIL_PER_MONTH);
        return NextResponse.json({ error: "cap" }, { status: 429 });
      }
    } catch (err) {
      console.error("resume-quantify limits failed", err);
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }

  const payload = JSON.stringify(
    buildQuantifyRequest(
      {
        bullet,
        title: clean(body.title, 120),
        company: clean(body.company, 120),
        current: body.current === true,
        question: clean(body.question, 300),
        answer,
      },
      MODEL
    )
  );
  const rewritten = await ask(payload);
  const verdict = rewritten ? checkRewrite(bullet, answer, rewritten) : null;
  if (!rewritten || !verdict?.ok) {
    await giveBack();
    if (rewritten && verdict && !verdict.ok) console.error("resume-quantify refused a rewrite:", verdict.why);
    return NextResponse.json({ error: rewritten ? "refused" : "upstream" }, { status: rewritten ? 422 : 502 });
  }
  return NextResponse.json({ ok: true, bullet: rewritten });
}
