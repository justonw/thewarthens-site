import { NextRequest, NextResponse } from "next/server";
import {
  coach,
  helpAreas,
  intakeQuestions,
  INTAKE_MAX_CHARS,
  INTAKE_MIN_CHARS,
} from "@/lib/coaching";
import { getCounterStore, isWinningNumber, recordEntry } from "@/lib/winner-counter";
import { isLiveHost, JERMELL_EMAIL, recipientsFor } from "@/lib/coaching-recipients";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const TEAM_EMAIL = "info@thewarthens.com";
const EXTRA_EMAILS = (process.env.COACHING_NOTIFY_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// Free-session cadence. Kept here on the server on purpose: it is never sent to the browser
// and never printed on the page. On a test link every 2nd request wins so the winning screen
// can be reviewed without waiting for the real number.
const WIN_EVERY_LIVE = 25;
const WIN_EVERY_TEST = 2;

// Which host did this request come in on? Real-site requests email Jermell only; anything else
// (localhost, a Netlify test link) emails Juston only, and uses a separate test counter.
function isLiveSite(req: NextRequest) {
  return isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
}

type Intake = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  areas: string[];
  answers: string[];
  source: string;
};

type Entry = {
  number: number; // 0 when not counted
  winner: boolean;
  counterFailed: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
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

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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

function notificationHtml(i: Intake, entry: Entry, testMode: boolean) {
  const banners = [
    testMode
      ? '<p style="margin:0 0 12px;padding:8px 12px;background:#fff4cc;border-radius:6px"><strong>TEST SUBMISSION.</strong> This came from a test or local copy of the site, so only Juston received it.</p>'
      : "",
    entry.winner
      ? `<p style="margin:0 0 12px;padding:10px 14px;background:#dcfce7;border-radius:6px"><strong>FREE SESSION WINNER.</strong> This request landed on the free-session cadence. Please reach out to ${escapeHtml(i.name)} to schedule their free 30-minute session. They have already been told on screen and by email.</p>`
      : "",
    entry.counterFailed
      ? '<p style="margin:0 0 12px;padding:8px 12px;background:#fee2e2;border-radius:6px"><strong>Counter unavailable.</strong> This request could not be numbered, so it was not counted toward the free-session cadence.</p>'
      : "",
  ].join("");
  const entryLine = entry.number
    ? `<p style="margin:12px 0 0;color:#5a5f70;font-size:13px">Entry number: ${entry.number}</p>`
    : "";
  const qa = intakeQuestions
    .map(
      (q, n) => `<p style="margin:18px 0 4px;font-weight:600">${n + 1}. ${escapeHtml(q.question)}</p>
<p style="margin:0;white-space:pre-wrap">${escapeHtml(i.answers[n])}</p>`
    )
    .join("");
  const linkedin = i.linkedin ? `<br>LinkedIn / profile: ${escapeHtml(i.linkedin)}` : "";
  const phone = i.phone ? `<br>Phone: ${escapeHtml(i.phone)}` : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#14161f;max-width:640px">
${banners}<h2 style="margin:0 0 4px">New coaching request</h2>
<p style="margin:0;color:#5a5f70">Reply to this email to reach ${escapeHtml(i.name)} directly. They asked for a free 15-minute intro call and have been told the coaching itself is paid.</p>
<p style="margin:18px 0 0"><strong>${escapeHtml(i.name)}</strong><br>Email: ${escapeHtml(i.email)}${phone}${linkedin}</p>
<p style="margin:12px 0 0"><strong>Wants help with:</strong> ${i.areas.length ? escapeHtml(i.areas.join(", ")) : "(none selected)"}</p>
${qa}
${entryLine}
<p style="margin:8px 0 0;color:#5a5f70;font-size:13px">Came from: ${escapeHtml(i.source || "direct")}</p>
</div>`;
}

function confirmationHtml(name: string, winner: boolean) {
  const winnerBlock = winner
    ? `<p style="margin:0 0 16px;padding:12px 14px;background:#dcfce7;border-radius:8px"><strong>You also won a free 30-minute session with ${coach.name}.</strong> ${coach.firstName} will email you to schedule it. Hang on to this message, and enjoy.</p>`
    : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#14161f;max-width:560px">
<p>Hi ${escapeHtml(name)},</p>
${winnerBlock}<p>Thank you for sending your answers. We received your request for a free 15-minute intro call with ${coach.name}.</p>
<p><strong>What happens next:</strong> ${coach.firstName} will read what you shared. If it looks like a fit, you will get an email to schedule your intro call. The call is free, with no obligation.</p>
<p>In the meantime, the free guides, quiz, and checklists are always at <a href="https://thewarthens.com/tech">thewarthens.com/tech</a>.</p>
<p>Juston &amp; Atiya<br>The Warthens</p>
</div>`;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend it worked, never a winner.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true, winner: false });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const linkedin = clean(body.linkedin, 200);
  const source = clean(body.source, 200);
  const consent = body.consent === true;

  const rawAnswers = Array.isArray(body.answers) ? body.answers : [];
  const answers = intakeQuestions.map((_, n) => clean(rawAnswers[n], INTAKE_MAX_CHARS));
  const areas = (Array.isArray(body.areas) ? body.areas : []).filter(
    (a): a is string => typeof a === "string" && (helpAreas as readonly string[]).includes(a)
  );

  if (!name) {
    return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (answers.some((a) => a.length < INTAKE_MIN_CHARS)) {
    return NextResponse.json(
      { error: "Please answer all seven questions, even briefly." },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please confirm you understand how this works." },
      { status: 400 }
    );
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      {
        error: `Sending isn't set up yet. Please email ${TEAM_EMAIL} and we'll connect you with ${coach.firstName}.`,
      },
      { status: 503 }
    );
  }

  const live = isLiveSite(req);

  // Number this request. A storage problem must never block a real request, so on failure
  // it simply isn't counted and the team is told in the email.
  const entry: Entry = { number: 0, winner: false, counterFailed: false };
  try {
    // Never let a storage problem hold up a visitor: give up after a few seconds.
    const result = await Promise.race([
      getCounterStore(live).then((store) => recordEntry(store, email)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("counter timed out")), 6000)
      ),
    ]);
    entry.number = result.number;
    entry.winner =
      result.counted && isWinningNumber(result.number, live ? WIN_EVERY_LIVE : WIN_EVERY_TEST);
  } catch (err) {
    console.error("coaching-intake counter failed (request still processed)", err);
    entry.counterFailed = true;
  }

  const intake: Intake = { name, email, phone, linkedin, areas, answers, source };
  const recipients = recipientsFor(live, EXTRA_EMAILS);

  try {
    await sendEmail({
      from: FROM_EMAIL,
      to: recipients,
      reply_to: email,
      subject: `${live ? "" : "[TEST] "}${entry.winner ? "[WINNER] " : ""}New coaching request: ${name}`,
      html: notificationHtml(intake, entry, !live),
    });
  } catch (err) {
    console.error("coaching-intake notification failed", err);
    return NextResponse.json(
      {
        error: `Something went wrong sending your request. Please try again, or email ${TEAM_EMAIL}.`,
      },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      // On the real site, replies from the applicant go straight to Jermell. Test links keep
      // them with the team so a tester replying never reaches him.
      reply_to: live ? JERMELL_EMAIL : TEAM_EMAIL,
      subject: entry.winner
        ? `You won a free session with ${coach.firstName}`
        : `We got your request for a free intro call with ${coach.firstName}`,
      html: confirmationHtml(name, entry.winner),
    });
  } catch (err) {
    // The team already has the request, so a failed confirmation should not fail the visitor.
    console.error("coaching-intake confirmation failed (request still delivered)", err);
  }

  return NextResponse.json({ ok: true, winner: entry.winner });
}
