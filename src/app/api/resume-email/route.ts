import { NextRequest, NextResponse } from "next/server";
import { bumpCounter, copiesAllowed, emailKey, getKv, mailedKey, withTimeout } from "@/lib/resume-limits";
import { isLiveHost } from "@/lib/coaching-recipients";

// Emails a person their finished resume (and cover letter) as attachments, to the address they gave us.
// The files are built in the visitor's browser and passed straight through to our email service: nothing
// is stored here. The text of the email is fixed, and an address can only get 2 copies for each build made with it, so this
// cannot be used to send messages to other people. Without RESEND_API_KEY it answers 503.

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const MAX_FILES = 4;
const MAX_B64_TOTAL = 4_000_000;
const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
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
  if (!RESEND_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

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

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return NextResponse.json({ error: "email" }, { status: 400 });
  const jobTitle = (typeof body.jobTitle === "string" ? body.jobTitle : "").replace(/[\r\n]+/g, " ").trim().slice(0, 120);

  const rawFiles = Array.isArray(body.files) ? body.files : [];
  if (rawFiles.length === 0 || rawFiles.length > MAX_FILES) return NextResponse.json({ error: "files" }, { status: 400 });
  const attachments: { filename: string; content: string }[] = [];
  let total = 0;
  for (const f of rawFiles) {
    const name = typeof f?.name === "string" ? f.name : "";
    const data = typeof f?.data === "string" ? f.data : "";
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (!TYPES[ext] || !/^[\w\- .()]{1,150}$/.test(name) || !/^[A-Za-z0-9+/=]+$/.test(data) || data.length < 100) {
      return NextResponse.json({ error: "files" }, { status: 400 });
    }
    // A real PDF starts with "%PDF" and a Word file is a zip that starts with "PK".
    const head = Buffer.from(data.slice(0, 8), "base64").toString("latin1");
    if ((ext === "pdf" && !head.startsWith("%PDF")) || (ext === "docx" && !head.startsWith("PK"))) {
      return NextResponse.json({ error: "files" }, { status: 400 });
    }
    total += data.length;
    attachments.push({ filename: name, content: data });
  }
  if (total > MAX_B64_TOTAL) return NextResponse.json({ error: "too-big" }, { status: 413 });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  // Only an address that has built a resume with us can be sent a copy, and only a few a day.
  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
  try {
    const kv = await withTimeout(getKv(live), 5000, "open usage store");
    // Checked with has() first: reading a key that is not there hangs on Netlify's storage right now.
    const built = (await withTimeout(kv.has(emailKey(email)), 8000, "look up the address")) ? await withTimeout(kv.get(emailKey(email)), 8000, "read the address") : null;
    const n = Number((built?.data as { n?: number } | null)?.n ?? 0);
    if (n < 1) return NextResponse.json({ error: "not-found" }, { status: 403 });
    // Each build comes with 2 emailed copies (the automatic one and one resend), counted as a pool for the address.
    // A person who has bought builds therefore gets copies for every one of them, and a stranger's address can
    // never be sent more than 2 copies per build that was made with it.
    const allowed = await withTimeout(copiesAllowed(kv, email, n), 8000, "work out the copies allowed");
    const sent = await withTimeout(bumpCounter(kv, mailedKey(email), 1, allowed), 8000, "count the copy");
    if (sent === null) return NextResponse.json({ error: "copies-used" }, { status: 429 });
  } catch (err) {
    console.error("resume-email limit check failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const label = jobTitle ? ` for ${jobTitle}` : "";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: `Your tailored resume${label}`,
        html: `<p>Here is the resume${attachments.length > 2 ? " and cover letter" : ""} you built${jobTitle ? ` for <strong>${escapeHtml(jobTitle)}</strong>` : ""} on The Warthens. The files are attached: a PDF to send, and a Word file you can keep editing.</p><p>Read it through once before you apply, and make sure everything is true and says it the way you would.</p><p>You can build another one for a different job any time at <a href="https://thewarthens.com/resume">thewarthens.com/resume</a>.</p><p>If you did not ask for this, you can ignore it.</p><p>The Warthens</p>`,
        attachments,
      }),
    });
    if (!res.ok) {
      console.error("resume-email: email service answered", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return NextResponse.json({ error: "send-failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("resume-email failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
