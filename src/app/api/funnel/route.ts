import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { FUNNEL_EVENTS, eventKey } from "@/lib/funnel";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { fieldReport } from "@/lib/field-counts";

// Owner only. Returns the daily counts of each resume-tool step for the last N days (default 14), newest first.
// It needs the owner code. Run it with scripts/funnel.py.

export const dynamic = "force-dynamic";

const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";
function isOwner(code: unknown) {
  if (!OWNER_CODE || typeof code !== "string") return false;
  const a = Buffer.from(code);
  const b = Buffer.from(OWNER_CODE);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  let body: { ownerCode?: string; days?: number; fields?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!isOwner(body.ownerCode)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const days = Math.max(1, Math.min(60, Math.floor(Number(body.days) || 14)));
  const kv = await withTimeout(getKv(true), 5000, "open the store");
  // The report of what kinds of jobs resumes were built for, and which job titles have no lens yet.
  if (body.fields === true) return NextResponse.json({ ok: true, report: await fieldReport(kv, days) });
  const out: { day: string; counts: Record<string, number> }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() - i * 86_400_000);
    const counts: Record<string, number> = {};
    for (const ev of FUNNEL_EVENTS) {
      const key = eventKey(ev, d);
      counts[ev] = (await kv.has(key)) ? Number(((await kv.get(key))?.data as { n?: number } | null)?.n ?? 0) : 0;
    }
    out.push({ day: d.toISOString().slice(0, 10), counts });
  }
  return NextResponse.json({ ok: true, days: out });
}
