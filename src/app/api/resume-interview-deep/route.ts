import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_MODEL, cleanText, parseDoc, type ResumeDoc } from "@/lib/resume-tailor";
import { DEEP_PER_EMAIL_PER_MONTH, DEEP_PER_MONTH, INTERVIEW_V2, isStage, plainText, type DeepAnswer, type QuestionKind, type Stage } from "@/lib/interview";
import { blankRisky, buildDeepRequest, deepNumbers, parseDeepResponse, riskyClaims, type DeepInput } from "@/lib/interview-deep";
import { getKv, bumpCounter, monthKey, emailKey } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// "Build my answer": deeper coaching for one interview question, built only from the person's resume, their true stories, and the
// real example they typed. An answer that uses a number nobody gave us is thrown away and tried once more. Each email gets a
// monthly allowance (reserved first, handed back if nothing usable comes back). Nothing is stored here. While INTERVIEW_V2 is off
// only the owner can use it, so the real output can be read before visitors see it.

export const dynamic = "force-dynamic";

const API_KEY = process.env.CLAUDE_API_KEY;
const API_BASE = process.env.CLAUDE_API_BASE_URL || "https://api.anthropic.com";
const MODEL = process.env.RESUME_MODEL || RESUME_MODEL;
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
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
const KINDS: QuestionKind[] = ["role", "behavioral", "gap", "motivation"];

async function ask(input: DeepInput): Promise<DeepAnswer | null> {
  const payload = JSON.stringify(buildDeepRequest(input, MODEL));
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/v1/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY as string, "anthropic-version": "2023-06-01" },
        body: payload,
        signal: AbortSignal.timeout(40000),
      });
      if (res.ok) {
        const parsed = parseDeepResponse(await res.json(), input.example);
        if (parsed) return parsed;
        console.error(`resume-interview-deep attempt ${attempt}: no usable tool call`);
      } else {
        console.error(`resume-interview-deep attempt ${attempt}: Claude answered ${res.status}`);
        if (res.status !== 429 && res.status < 500) return null;
      }
    } catch (err) {
      console.error(`resume-interview-deep attempt ${attempt} failed`, err instanceof Error ? err.message : err);
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
  // Closed to visitors until the new version is switched on.
  if (!owner && !INTERVIEW_V2) return NextResponse.json({ error: "unavailable" }, { status: 404 });
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!owner && tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) return NextResponse.json({ error: "email" }, { status: 400 });
  const doc = body.doc && typeof body.doc === "object" ? (parseDoc(body.doc as Record<string, unknown>) as ResumeDoc | null) : null;
  if (!doc) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  const q = body.question && typeof body.question === "object" ? (body.question as Record<string, unknown>) : null;
  const questionText = q ? plainText(q.question, 300) : "";
  if (!q || questionText.length < 8) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  const stage: Stage = isStage(body.stage) ? body.stage : "manager";

  const input: DeepInput = {
    doc,
    stories: plainText(body.stories, 3000),
    postingTitle: cleanText(body.postingTitle, 140),
    postingCompany: cleanText(body.postingCompany, 120),
    postingKeywords: strings(body.postingKeywords, 60, 14),
    stage,
    question: {
      question: questionText,
      kind: KINDS.includes(q.kind as QuestionKind) ? (q.kind as QuestionKind) : "role",
      why: plainText(q.why, 300),
      points: strings(q.points, 260, 5),
    },
    example: plainText(body.example, 800),
  };

  // Hands the count back if nothing usable came back, so a failed try costs the person nothing.
  let giveBack = async () => {};
  if (!owner) {
    try {
      const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
      const kv = await getKv(live);
      const month = monthKey().replace("month/", "");
      const mineKey = `interview-deep/${month}/${emailKey(email).replace("email/", "")}`;
      const allKey = `interview-deep-all/${month}`;
      giveBack = async () => {
        await bumpCounter(kv, mineKey, -1, DEEP_PER_EMAIL_PER_MONTH).catch(() => null);
        await bumpCounter(kv, allKey, -1, DEEP_PER_MONTH).catch(() => null);
      };
      const mine = await bumpCounter(kv, mineKey, 1, DEEP_PER_EMAIL_PER_MONTH);
      if (mine === null) return NextResponse.json({ error: "deep-limit" }, { status: 429 });
      const all = await bumpCounter(kv, allKey, 1, DEEP_PER_MONTH);
      if (all === null) {
        await bumpCounter(kv, mineKey, -1, DEEP_PER_EMAIL_PER_MONTH);
        return NextResponse.json({ error: "cap" }, { status: 429 });
      }
    } catch (err) {
      console.error("resume-interview-deep limits failed", err);
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }

  // Everything the person gave us, so a number that appears nowhere in it can be caught.
  const sources = [
    JSON.stringify({ ...doc, contact: [] }),
    input.stories,
    input.example,
    input.postingTitle,
    input.postingKeywords.join(" "),
    input.question.question,
    input.question.why,
    input.question.points.join(" "),
  ];

  let deep = await ask(input);
  if (deep) {
    const invented = deepNumbers(deep, sources);
    if (invented.length > 0) {
      const second = await ask({ ...input, fix: `Your last answer used numbers that are not in the material: ${invented.join(", ")}. Remove them, or use only numbers from the resume, the stories, or the example. Keep every rule.` });
      if (second) deep = second;
    }
  }
  // Sentences about what the person did, or how they usually act, that nobody told us: ask once more, then leave a blank for their own detail.
  if (deep) {
    const claims = riskyClaims(deep.draft, sources);
    if (claims.length > 0) {
      const again = await ask({ ...input, fix: `Your last answer described things the person never said they did or how they act: "${claims.join('" and "')}". Remove them. Say only what the resume, the stories, or their example say, and leave a [short blank] for any detail only they know. Keep every rule.` });
      if (again && deepNumbers(again, sources).length === 0) deep = again;
    }
    deep = { ...deep, draft: blankRisky(deep.draft, sources) };
  }
  if (!deep) {
    await giveBack();
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  if (deepNumbers(deep, sources).length > 0) {
    await giveBack();
    console.error("resume-interview-deep refused an answer with numbers nobody gave us");
    return NextResponse.json({ error: "refused" }, { status: 422 });
  }
  return NextResponse.json({ ok: true, deep });
}
