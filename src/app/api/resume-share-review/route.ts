import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { validBuildId } from "@/lib/resume-builds";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";
import { listShares, shareKey } from "@/lib/session-share";

// Owner-only. Lists the builds whose owners checked "use my session to improve this web application" (who, when, which job),
// or returns one whole copy. Read it with scripts/read-shares.py. Nothing here changes anything.

export const dynamic = "force-dynamic";

const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";

function isOwner(code: unknown) {
  if (!OWNER_CODE || typeof code !== "string") return false;
  const a = Buffer.from(code);
  const b = Buffer.from(OWNER_CODE);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!isOwner(body.ownerCode)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
    const kv = await withTimeout(getKv(live), 5000, "open store");
    if (body.id !== undefined) {
      if (!validBuildId(body.id)) return NextResponse.json({ error: "bad-request" }, { status: 400 });
      const entry = await withTimeout(kv.get(shareKey(body.id)), 5000, "read one copy");
      return NextResponse.json({ ok: true, record: entry?.data ?? null });
    }
    const shares = await withTimeout(listShares(kv), 25000, "list the copies");
    return NextResponse.json({ ok: true, shares });
  } catch (err) {
    console.error("resume-share-review failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
