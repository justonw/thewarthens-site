import { NextRequest, NextResponse } from "next/server";
import { contactTopics, MESSAGE_MAX, STORY_MAX } from "@/lib/contact-topics";
import { isLiveHost, JUSTON_EMAIL } from "@/lib/coaching-recipients";
import { looksLikeSalesPitch } from "@/lib/contact-spam";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const TEAM_EMAIL = "info@thewarthens.com";

// Each visitor can send a few messages in ten minutes. Enough for a real person, too slow for a spam run.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const MIN_FILL_MS = 3000;
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

function escapeHtml(input: string) {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return input.replace(/[&<>"']/g, (c) => map[c]);
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
}

export async function POST(req: NextRequest) {
  // Only the site's own form may post here.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "Something went wrong. Reload the page and try again." }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Something went wrong. Reload the page and try again." }, { status: 403 });
    }
  }

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "That was a lot of messages in a short time. Please wait a few minutes and try again, or email us directly." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend it worked.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  // A real person takes more than a few seconds to fill in the form. The form sends how long it was open; a request
  // without that number did not come from the form. (Silently dropped, like the trap field above.)
  if (typeof body.elapsed !== "number") return NextResponse.json({ error: "Please reload the page and try again." }, { status: 400 });
  if (body.elapsed < MIN_FILL_MS) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const topic = clean(body.topic, 100);
  const message = clean(body.message, MESSAGE_MAX);
  const story = clean(body.story, STORY_MAX);

  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!(contactTopics as readonly string[]).includes(topic)) {
    return NextResponse.json({ error: "Please choose what your message is about." }, { status: 400 });
  }
  if (message.length < 3 && story.length < 3) {
    return NextResponse.json({ error: "Please write us a short message." }, { status: 400 });
  }

  // Cold sales pitches (SEO, "traffic", web design) are dropped without a sound, so they never reach the inbox.
  if (looksLikeSalesPitch(message, story)) {
    console.warn("contact: dropped a message that looks like a sales pitch");
    return NextResponse.json({ ok: true });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: `Sending isn't set up yet. Please email ${TEAM_EMAIL} directly.` },
      { status: 503 }
    );
  }

  // Real site goes to the team inbox. Localhost and test links go to Juston only.
  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const to = live ? [TEAM_EMAIL] : [JUSTON_EMAIL];

  const banner = live
    ? ""
    : '<p style="margin:0 0 12px;padding:8px 12px;background:#fff4cc;border-radius:6px"><strong>TEST SUBMISSION.</strong> This came from a test or local copy of the site.</p>';
  const storyBlock = story
    ? `<p style="margin:18px 0 4px;font-weight:600">Their story:</p><p style="margin:0;white-space:pre-wrap">${escapeHtml(story)}</p>`
    : "";
  const messageBlock = message
    ? `<p style="margin:18px 0 4px;font-weight:600">Message:</p><p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>`
    : "";

  try {
    await sendEmail({
      from: FROM_EMAIL,
      to,
      reply_to: email,
      subject: `${live ? "" : "[TEST] "}Website message: ${topic} (${name})`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#14161f;max-width:640px">
${banner}<h2 style="margin:0 0 4px">New message from the website</h2>
<p style="margin:0;color:#5a5f70">Reply to this email to reach ${escapeHtml(name)} directly.</p>
<p style="margin:18px 0 0"><strong>${escapeHtml(name)}</strong><br>${escapeHtml(email)}</p>
<p style="margin:12px 0 0"><strong>About:</strong> ${escapeHtml(topic)}</p>
${messageBlock}${storyBlock}
</div>`,
    });
  } catch (err) {
    console.error("contact notification failed", err);
    return NextResponse.json(
      { error: `Something went wrong sending your message. Please try again, or email ${TEAM_EMAIL}.` },
      { status: 500 }
    );
  }

  // Short thank-you so the sender knows it arrived. A failure here must not fail the visitor.
  try {
    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      reply_to: TEAM_EMAIL,
      subject: "We got your message",
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#14161f;max-width:560px">
<p>Hi ${escapeHtml(name)},</p>
<p>Thank you for writing to us. We received your message and we read every one. We'll get back to you as soon as we can.</p>
<p>Juston &amp; Atiya<br>The Warthens</p>
</div>`,
    });
  } catch (err) {
    console.error("contact confirmation failed (message still delivered)", err);
  }

  return NextResponse.json({ ok: true });
}
