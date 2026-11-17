import { NextRequest, NextResponse } from "next/server";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { addFriend } from "@/lib/stay-in-touch";
import { isLiveHost } from "@/lib/coaching-recipients";

// "Want an occasional note from us?" on the Tech Journey and Faith Journey pages. The address is saved, the visitor
// gets a short hello (so a mistyped address is noticed), and the owner gets an alert (searchable as "New friend").

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "techjourneyinfo@gmail.com";
const FROM_PAGES = ["tech", "faith"];

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

async function send(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`email service answered ${res.status}`);
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

  let body: { email?: string; from?: string; company_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return NextResponse.json({ error: "email" }, { status: 400 });
  const from = FROM_PAGES.includes(body.from ?? "") ? (body.from as string) : "site";
  if (!RESEND_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
    const kv = await withTimeout(getKv(live), 5000, "open the store");
    await withTimeout(addFriend(kv, email, from), 8000, "save the address");
  } catch (err) {
    console.error("stay-in-touch: could not save the address", err instanceof Error ? err.message : err);
  }

  try {
    await send({
      from: FROM_EMAIL,
      to: email,
      subject: "Glad you're here (from Juston and Atiya)",
      html: `<p>Hi,</p>
<p>Thanks for joining us. Every so often we'll send a short note: something we're learning, one practical step, and a word of encouragement. Nothing pushy.</p>
<p>A good place to start is our story, <a href="https://thewarthens.com/jesus">why we believe in Jesus</a>, or our Bible studies at <a href="https://thewarthens.com/faith">thewarthens.com/faith</a>. And if you are figuring out a career change too, there is a free 2-minute quiz at <a href="https://thewarthens.com/tech#quiz">thewarthens.com/tech</a>.</p>
<p>You can reply to this email any time, and a real person will read it. Every note we send has an unsubscribe link at the bottom, and replying with "stop" works too.</p>
<p>Juston and Atiya</p>`,
    });
  } catch (err) {
    console.error("stay-in-touch: hello email failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }

  try {
    await send({ from: FROM_EMAIL, to: NOTIFY_EMAIL, subject: `New friend: ${email.replace(/[\r\n]+/g, " ").slice(0, 120)}`, html: `<p>${escapeHtml(email)} asked for an occasional note, from the ${from} page.</p>` });
  } catch (err) {
    console.error("stay-in-touch: alert failed (they were still welcomed)", err instanceof Error ? err.message : err);
  }
  return NextResponse.json({ ok: true });
}
