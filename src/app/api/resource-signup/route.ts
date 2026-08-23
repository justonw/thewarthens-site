import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const NOTIFY_EMAIL = "justonwarthen@gmail.com";
const SITE_URL = "https://thewarthens.com";

const RESOURCES: Record<
  string,
  { label: string; files: { label: string; fileUrl: string }[] }
> = {
  "job-search-toolkit": {
    label: "Job Search Toolkit",
    files: [
      {
        label: "Resume & LinkedIn Checklist (PDF)",
        fileUrl: `${SITE_URL}/downloads/career-changer-starter-kit.pdf`,
      },
      {
        label: "Job Search Tracker (XLSX)",
        fileUrl: `${SITE_URL}/downloads/job-search-tracker.xlsx`,
      },
    ],
  },
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string) {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return input.replace(/[&<>"']/g, (c) => map[c]);
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  let body: { email?: string; resourceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const resource = body.resourceId ? RESOURCES[body.resourceId] : undefined;
  if (!resource) {
    return NextResponse.json({ error: "Unknown resource." }, { status: 400 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email delivery isn't set up yet. Use the direct download link instead." },
      { status: 503 }
    );
  }

  try {
    const fileList = resource.files
      .map((f) => `<li><a href="${f.fileUrl}">${f.label}</a></li>`)
      .join("");
    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      subject: `Your ${resource.label} (from The Warthens)`,
      html: `<p>Hi,</p>
<p>Here's your ${resource.label}:</p>
<ul>${fileList}</ul>
<p>They're yours. If you haven't taken the free 2-minute career-path quiz yet, it's at <a href="${SITE_URL}/tech">thewarthens.com/tech</a>.</p>
<p>Juston &amp; Atiya</p>`,
    });
  } catch (err) {
    console.error("resource-signup email failed", err);
    return NextResponse.json(
      { error: "Something went wrong sending the email. Use the direct download link instead." },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New signup: ${resource.label}`,
      html: `<p>${escapeHtml(email)} requested "${escapeHtml(resource.label)}".</p>`,
    });
  } catch (err) {
    console.error("resource-signup notify copy failed (visitor email still sent)", err);
  }

  return NextResponse.json({ ok: true });
}
