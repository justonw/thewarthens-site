import { NextRequest, NextResponse } from "next/server";
import { getKv, withTimeout } from "@/lib/resume-limits";
import { addToWaitlist } from "@/lib/resume-waitlist";
import { isLiveHost } from "@/lib/coaching-recipients";

// While paid builds are not open yet, someone who has used their 2 free builds can ask to be told when more are
// available. The address is saved (see lib/resume-waitlist.ts), and an alert goes to the site owner (searchable in the
// inbox as "Resume builds waitlist").
// Nothing is sent to the visitor's address, so this cannot be used to email other people.

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "techjourneyinfo@gmail.com";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
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

  let body: { email?: string; company_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  // A hidden field that people never see: a script that fills it in is told it worked, and nothing is sent.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!RESEND_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  // Keep the address so everyone on the list can be told the day paid builds open. If saving fails, the alert to
  // the owner below still goes out, so the request is not lost.
  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
    const kv = await withTimeout(getKv(live), 5000, "open the store");
    await withTimeout(addToWaitlist(kv, email), 8000, "save the address");
  } catch (err) {
    console.error("resume-waitlist: could not save the address", err instanceof Error ? err.message : err);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: `Resume builds waitlist: ${email.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
        html: `<p>${escapeHtml(email)} used their 2 free builds and asked to be told when paid builds are available.</p>`,
      }),
    });
    if (!res.ok) {
      console.error("resume-waitlist: email service answered", res.status);
      return NextResponse.json({ error: "send-failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("resume-waitlist failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
