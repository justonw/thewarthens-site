import { NextRequest, NextResponse } from "next/server";
import { eventKey, isFunnelEvent } from "@/lib/funnel";
import { bumpCounter, getKv, withTimeout } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// Counts one step of the resume tools for today (see lib/funnel.ts). It stores a number per day and step, nothing else.
// It answers quickly and never fails loudly, and a visitor cannot run the numbers up by sending a lot of them.

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 60;
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
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return new NextResponse(null, { status: 204 });
    } catch {
      return new NextResponse(null, { status: 204 });
    }
  }
  let event: unknown;
  try {
    event = (await req.json()).event;
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (!isFunnelEvent(event)) return new NextResponse(null, { status: 204 });
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return new NextResponse(null, { status: 204 });
  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
    // Test traffic from a developer's computer is not counted with real visitors.
    if (!live) return new NextResponse(null, { status: 204 });
    const kv = await withTimeout(getKv(true), 4000, "open the store");
    await withTimeout(bumpCounter(kv, eventKey(event), 1, Number.MAX_SAFE_INTEGER), 4000, "count the step");
  } catch {
    /* ignored on purpose */
  }
  return new NextResponse(null, { status: 204 });
}
