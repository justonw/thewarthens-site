import { NextRequest, NextResponse } from "next/server";
import { emailKey, getKv, withTimeout, type Kv } from "@/lib/resume-limits";
import { isLiveHost, JUSTON_EMAIL } from "@/lib/coaching-recipients";
import { isClosed, parseRsvp, publicView, remindersFor, totals, type Rsvp } from "@/lib/birthday";
import { confirmation, notifyJuston, REMINDERS } from "@/lib/birthday-email";

// RSVPs for Atiya's birthday lunch (/birthday).
//   GET   only whether the RSVP is still open. Nothing about other guests is ever sent to the page.
//   POST  save or update one RSVP (one per email address), email a confirmation, schedule the reminders,
//         and tell Juston. Closed after the cutoff.
// Off the real site (localhost, Netlify test links) every email goes to Juston only, so testing never emails a guest.

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.TRACKER_FROM_EMAIL || "The Warthens <info@thewarthens.com>";
const PREFIX = "birthday/rsvp/";
const MAX_RSVPS = 120;

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

async function readAll(kv: Kv): Promise<{ key: string; rsvp: Rsvp; etag?: string }[]> {
  const keys = await kv.list(PREFIX);
  const rows = await Promise.all(
    keys.map(async (key) => {
      const hit = await kv.get(key);
      return hit?.data ? { key, rsvp: hit.data as Rsvp, etag: hit.etag } : null;
    }),
  );
  return rows.filter((r): r is { key: string; rsvp: Rsvp; etag: string | undefined } => r !== null);
}

type Sent = { ok: boolean; id?: string };

async function send(to: string, subject: string, html: string, scheduledAt?: string): Promise<Sent> {
  if (!RESEND_API_KEY) return { ok: false };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, ...(scheduledAt ? { scheduled_at: scheduledAt } : {}) }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false };
  }
}

async function cancel(id: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      signal: AbortSignal.timeout(6000),
    });
  } catch {
    // A reminder that could not be cancelled is a small problem; the answer itself is already saved.
  }
}

export async function GET() {
  try {
    return NextResponse.json(publicView([]), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(publicView([]), { headers: { "Cache-Control": "no-store" } });
  }
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  // A hidden field that people never see: a script that fills it in is told it worked, and nothing is saved.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "Too many tries from this connection. Please wait a few minutes." }, { status: 429 });

  if (isClosed()) return NextResponse.json({ error: "RSVPs closed on Saturday, November 28. Please contact Juston if your plans changed." }, { status: 410 });

  const parsed = parseRsvp(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { email, status, names } = parsed;

  const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
  let kv: Kv;
  try {
    kv = await withTimeout(getKv(live), 5000, "open the store");
  } catch (err) {
    console.error("birthday: store unavailable", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "We could not save that just now. Please try again in a minute." }, { status: 503 });
  }

  const key = `${PREFIX}${emailKey(email).slice(6)}`;
  const now = new Date();
  const nowIso = now.toISOString();
  let previous: Rsvp | null = null;
  let saved: Rsvp | null = null;

  try {
    for (let attempt = 0; attempt < 12 && !saved; attempt++) {
      const hit = (await kv.has(key)) ? await kv.get(key) : null;
      previous = (hit?.data as Rsvp | undefined) ?? null;
      if (!previous) {
        const count = (await kv.list(PREFIX)).length;
        if (count >= MAX_RSVPS) return NextResponse.json({ error: "This list is full. Please contact Juston." }, { status: 409 });
      }
      const next: Rsvp = {
        email,
        status,
        names,
        createdAt: previous?.createdAt ?? nowIso,
        updatedAt: nowIso,
        scheduled: [],
      };
      const written = await kv.set(key, next, previous && hit?.etag ? { onlyIfMatch: hit.etag } : { onlyIfNew: true });
      if (written.modified) saved = next;
      else await new Promise((r) => setTimeout(r, Math.random() * 40));
    }
  } catch (err) {
    console.error("birthday: save failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "We could not save that just now. Please try again in a minute." }, { status: 503 });
  }
  if (!saved) return NextResponse.json({ error: "That was busy. Please press the button once more." }, { status: 503 });

  // Take back any reminders that were waiting from an earlier answer, then schedule the ones this answer needs.
  if (previous?.scheduled?.length) await Promise.all(previous.scheduled.map(cancel));

  const guest = live ? email : JUSTON_EMAIL;
  const tag = live ? "" : "[TEST] ";
  const updated = Boolean(previous);

  const confirm = confirmation(status, names, updated);
  const confirmSent = await send(guest, tag + confirm.subject, confirm.html);

  const scheduledIds: string[] = [];
  for (const r of remindersFor(status, now)) {
    const mail = REMINDERS[r.key](names);
    const out = await send(guest, tag + mail.subject, mail.html, r.at);
    if (out.ok && out.id) scheduledIds.push(out.id);
  }

  // Remember which reminders are waiting so a later change can cancel them. If this write fails, the answer is still saved.
  try {
    const latest = await kv.get(key);
    if (latest?.etag) await kv.set(key, { ...saved, scheduled: scheduledIds }, { onlyIfMatch: latest.etag });
  } catch {
    // Not fatal.
  }

  // Tell Juston, with the running totals.
  try {
    const all = await readAll(kv);
    const note = notifyJuston(updated ? "updated" : "new", status, names, email, totals(all.map((r) => r.rsvp)));
    await send(JUSTON_EMAIL, tag + note.subject, note.html);
    return NextResponse.json({ ok: true, emailed: confirmSent.ok }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("birthday: notify failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: true, emailed: confirmSent.ok });
  }
}
