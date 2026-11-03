import { NextRequest, NextResponse } from "next/server";
import {
  buildGuideRequest,
  MAX_QUESTION_LENGTH,
  parseGuideResponse,
} from "@/lib/guide-ai";

// The site guide's AI. It only picks pages from the site's own list (see lib/guide-ai.ts).
// Without ANTHROPIC_API_KEY it answers 503 and the guide falls back to its built-in search.
// The question is sent to Anthropic to get an answer, and is not logged or stored here.

export const dynamic = "force-dynamic";

const API_KEY = process.env.ANTHROPIC_API_KEY;

// A small, best-effort limit per visitor. On a serverless host each instance keeps its own count,
// so this slows down casual abuse; the real spending cap is the one set in the Anthropic console.
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

  let message: unknown;
  try {
    message = (await req.json())?.message;
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (typeof message !== "string") return NextResponse.json({ error: "bad-request" }, { status: 400 });
  const question = message.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!question) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(buildGuideRequest(question)),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    const answer = parseGuideResponse(await res.json());
    if (!answer) return NextResponse.json({ error: "upstream" }, { status: 502 });
    return NextResponse.json({ reply: answer.reply, pages: answer.pages.map((p) => p.href) });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
