import { NextRequest, NextResponse } from "next/server";
import { MAX_NOTE_LENGTH, noteFields } from "@/lib/present-missing";
import { buildLessonPdf } from "@/lib/present-missing-pdf";

// Emails a man his own copy of the "Present but Missing" lesson and his answers, as a PDF.
// It goes ONLY to the address he typed. There is no copy to the Warthens, nothing is stored,
// and the answers and the address are never logged.

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";

// Best-effort limit per visitor, so the form cannot be used to flood someone's inbox.
const WINDOW_MS = 30 * 60 * 1000;
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

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

export async function POST(req: NextRequest) {
  let body: { email?: unknown; answers?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  // A hidden field that only automated forms fill in.
  if (typeof body.website === "string" && body.website !== "") return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // Only the known note boxes, each cut to a sensible length.
  const raw = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const field of noteFields) {
    const value = raw[field.id];
    if (typeof value === "string") answers[field.id] = value.slice(0, MAX_NOTE_LENGTH);
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Email isn't set up yet. Please try again later." }, { status: 503 });
  }

  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a little while." }, { status: 429 });
  }

  try {
    const pdf = await buildLessonPdf(answers);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "Your Present but Missing notes",
        text: "Here is your copy of the Present but Missing lesson, with the notes you wrote. It is attached as a PDF.\n\nJuston & Atiya Warthen\nthewarthens.com",
        html: "<p>Here is your copy of the <strong>Present but Missing</strong> lesson, with the notes you wrote. It is attached as a PDF.</p><p>Juston &amp; Atiya Warthen<br>thewarthens.com</p>",
        attachments: [
          { filename: "Present-but-Missing-notes.pdf", content: Buffer.from(pdf).toString("base64") },
        ],
      }),
    });
    if (!res.ok) throw new Error(`email service ${res.status}`);
  } catch (err) {
    // Log the kind of failure only, never the address or the notes.
    console.error("present-missing email failed", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Something went wrong sending the email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
