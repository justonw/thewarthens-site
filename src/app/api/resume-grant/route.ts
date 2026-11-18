import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { buildStatus, grantBuilds } from "@/lib/resume-grants";
import { isLiveHost } from "@/lib/coaching-recipients";

// Owner only. Gives a particular email address extra resume builds (on top of the 2 free ones), or shows where an
// address stands. It needs the owner code. Run it with scripts/grant-builds.py. The builds are used by the normal
// build form: the person just types their email as usual.

export const dynamic = "force-dynamic";

const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";
const MAX_GRANT = 5000;

function isOwner(code: unknown) {
  if (!OWNER_CODE || typeof code !== "string") return false;
  const a = Buffer.from(code);
  const b = Buffer.from(OWNER_CODE);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  let body: { ownerCode?: string; email?: string; builds?: number; note?: string; statusOnly?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!isOwner(body.ownerCode)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return NextResponse.json({ error: "email" }, { status: 400 });

  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const kv = await withTimeout(getKv(live), 5000, "open the store");
  if (!body.statusOnly) {
    const n = Number(body.builds);
    if (!Number.isInteger(n) || n < 1 || n > MAX_GRANT) return NextResponse.json({ error: "builds", message: `builds must be a whole number from 1 to ${MAX_GRANT}` }, { status: 400 });
    await withTimeout(grantBuilds(kv, email, n, body.note), 10000, "save the grant");
  }
  return NextResponse.json({ ok: true, ...(await withTimeout(buildStatus(kv, email), 10000, "read the balance")) });
}
