import { NextRequest, NextResponse } from "next/server";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { unsubscribe } from "@/lib/stay-in-touch";
import { isLiveHost } from "@/lib/coaching-recipients";

// Takes someone off the "occasional note" list. Used by the button on /unsubscribe and by the one-click unsubscribe
// button that mail apps show. The link is signed, so it only works for the person it was sent to.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  let i = url.searchParams.get("i") ?? "";
  let t = url.searchParams.get("t") ?? "";
  if (!i || !t) {
    try {
      const body = await req.json();
      i = typeof body.i === "string" ? body.i : "";
      t = typeof body.t === "string" ? body.t : "";
    } catch {
      // Mail apps send a form body, which the query string above already covers.
    }
  }
  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
    const kv = await withTimeout(getKv(live), 5000, "open the store");
    const result = await withTimeout(unsubscribe(kv, i, t), 8000, "save the change");
    return NextResponse.json(result === "ok" ? { ok: true } : { error: "invalid" }, { status: result === "ok" ? 200 : 400 });
  } catch (err) {
    console.error("unsubscribe failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
