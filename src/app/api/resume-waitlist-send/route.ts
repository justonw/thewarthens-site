import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { notifyWaitlist, waitlistCounts } from "@/lib/resume-waitlist";
import { PLANS, availablePlans } from "@/lib/resume-plans";
import { isLiveHost } from "@/lib/coaching-recipients";

// Owner only. Sends the one-time "paid builds are open" email to everyone on the waitlist who has not been told yet.
// It needs the owner code, and it refuses to send until a pack is actually on sale (the Stripe key and a price are
// set), so it can never announce something that cannot be bought. It stops after about 20 seconds and reports how
// many are left, so a long list is finished by running it again. Run it with scripts/notify-waitlist.py.

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const OWNER_CODE = process.env.RESUME_OWNER_CODE || "";

function isOwner(code: unknown) {
  if (!OWNER_CODE || typeof code !== "string") return false;
  const a = Buffer.from(code);
  const b = Buffer.from(OWNER_CODE);
  return a.length === b.length && timingSafeEqual(a, b);
}

function emailHtml(): string {
  const lines = availablePlans()
    .map((id) => `<li><strong>${PLANS[id].display}</strong> for ${PLANS[id].label}</li>`)
    .join("");
  return `<p>You asked us to email you once when more resume builds were available. They are now.</p>
<p>The Resume Builder tailors your resume to a specific job and writes a matching cover letter, as PDF and Word files, built only from your real experience.</p>
<ul>${lines}</ul>
<p>Use the same email address as before: <a href="https://thewarthens.com/resume">thewarthens.com/resume</a>. Your builds are added to it right after you pay.</p>
<p>This is the only email we'll send about this.</p>
<p>The Warthens</p>`;
}

export async function POST(req: NextRequest) {
  let body: { ownerCode?: string; dryRun?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!isOwner(body.ownerCode)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!RESEND_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const kv = await withTimeout(getKv(live), 5000, "open the store");
  const counts = await withTimeout(waitlistCounts(kv), 15000, "count the waitlist");
  if (body.dryRun) return NextResponse.json({ ok: true, dryRun: true, ...counts, packsOnSale: availablePlans().length });

  if (availablePlans().length === 0) return NextResponse.json({ error: "not-on-sale", message: "No pack is on sale yet, so nothing was sent." }, { status: 409 });

  const html = emailHtml();
  const result = await notifyWaitlist(
    kv,
    async (email) => {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: FROM_EMAIL, to: email, subject: "More resume builds are available", html }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    { budgetMs: 20000, pauseMs: 600 }
  );
  return NextResponse.json({ ok: true, ...result });
}
