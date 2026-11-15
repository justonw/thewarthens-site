import { NextRequest, NextResponse } from "next/server";
import { fetchPosting } from "@/lib/posting-fetch";

// Reads the text of a job posting from a link, so a visitor can paste a link instead of the text.
// It does not use AI and does not store anything. See lib/posting-fetch.ts for the safety rules.

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 15;
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

  let url: unknown;
  try {
    url = (await req.json())?.url;
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (typeof url !== "string" || url.length > 800) return NextResponse.json({ error: "bad-url" }, { status: 400 });

  const result = await fetchPosting(url);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error === "bad-url" ? 400 : 422 });
  return NextResponse.json({ ok: true, title: result.title, text: result.text, via: result.via });
}
