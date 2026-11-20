import { NextRequest, NextResponse } from "next/server";
import { validBuildId } from "@/lib/resume-builds";
import { emailKey, getKv, withTimeout } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";
import { withdrawShare } from "@/lib/session-share";

// "Stop sharing" for one build: empties the saved copy made when the person checked the sharing box. Only the email the
// build was made with can do it. The copy is made inside the build itself (see resume-tailor), never here.

export const dynamic = "force-dynamic";

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

export async function POST(req: NextRequest) {
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
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !validBuildId(body.shareId)) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
    const kv = await withTimeout(getKv(live), 5000, "open store");
    // A copy that is already gone, or was never theirs, answers the same way: there is nothing left to share.
    const done = await withTimeout(withdrawShare(kv, body.shareId, emailKey(email)), 5000, "stop sharing");
    return NextResponse.json({ ok: true, state: done });
  } catch (err) {
    console.error("resume-share failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
