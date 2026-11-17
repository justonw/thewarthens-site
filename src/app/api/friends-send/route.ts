import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { canSign, friendStats, sendNote, unsubscribeUrl, idForEmail, wouldSend, type Audience } from "@/lib/stay-in-touch";
import { isLiveHost } from "@/lib/coaching-recipients";
import { noteHtml } from "@/lib/note-html";

// Owner only. Sends one note to everyone on the "occasional note" list (or just the Tech or Faith page's people).
// It needs the owner code. It never sends the same note (campaignId) to the same person twice, skips anyone who
// unsubscribed, and puts a working unsubscribe link in every email. It stops after about 20 seconds and reports how
// many are left, so a long list is finished by running it again. Run it with scripts/send-note.py.

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

export async function POST(req: NextRequest) {
  let body: { ownerCode?: string; campaignId?: string; subject?: string; text?: string; audience?: string; dryRun?: boolean; testTo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!isOwner(body.ownerCode)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!RESEND_API_KEY || !canSign()) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const audience: Audience = body.audience === "tech" || body.audience === "faith" ? body.audience : "all";
  const campaignId = (body.campaignId ?? "").trim().slice(0, 60);
  const subject = (body.subject ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 200);
  const text = (body.text ?? "").trim();

  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const kv = await withTimeout(getKv(live), 5000, "open the store");

  if (body.dryRun && !subject && !text) {
    return NextResponse.json({ ok: true, dryRun: true, ...(await withTimeout(friendStats(kv), 15000, "count the list")) });
  }
  if (!subject || !text || !/^[a-z0-9-]{3,60}$/.test(campaignId)) {
    return NextResponse.json({ error: "missing", message: "Needs a subject, the text, and a campaignId of lowercase letters, numbers and dashes." }, { status: 400 });
  }
  if (body.dryRun) {
    const n = await withTimeout(wouldSend(kv, campaignId, audience), 15000, "count the list");
    return NextResponse.json({ ok: true, dryRun: true, wouldSend: n, audience, campaignId });
  }

  const post = async (to: string, link: string) => {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject,
          html: noteHtml(text, link),
          headers: { "List-Unsubscribe": `<${link}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  // A test goes to one address, is not recorded, and uses that address's own (working) unsubscribe link.
  if (body.testTo) {
    const to = body.testTo.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return NextResponse.json({ error: "email" }, { status: 400 });
    const ok = await post(to, unsubscribeUrl(idForEmail(to)));
    return NextResponse.json(ok ? { ok: true, test: true } : { error: "send-failed" }, { status: ok ? 200 : 502 });
  }

  const result = await sendNote(kv, { campaignId, audience, budgetMs: 20000, pauseMs: 600, send: post });
  return NextResponse.json({ ok: true, ...result });
}
