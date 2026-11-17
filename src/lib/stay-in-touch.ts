import { createHmac, timingSafeEqual } from "node:crypto";
import { emailKey, type Kv } from "./resume-limits";

// People who asked for an occasional note from Juston and Atiya. Each is kept as a small record: their address, when
// they joined, which page they joined from ("tech" or "faith"), whether they have unsubscribed, and which notes they
// have already been sent. So a note can go to everyone (or just one page's people) with one command, nobody gets the
// same note twice, and nobody who unsubscribed is emailed again.

export type FriendEntry = { email: string; at: string; from: string; unsubscribed?: string; sent?: string[] };
export type Audience = "all" | "tech" | "faith";

const PREFIX = "friends/";
const idOf = (email: string) => emailKey(email).slice(6);
const keyFor = (id: string) => `${PREFIX}${id}`;

export async function addFriend(kv: Kv, email: string, from: string, now = new Date()) {
  const id = idOf(email);
  const fresh: FriendEntry = { email: email.trim().toLowerCase(), at: now.toISOString(), from };
  const { modified } = await kv.set(keyFor(id), fresh, { onlyIfNew: true });
  if (modified) return;
  // Already on the list. If they had unsubscribed and asked again, welcome them back (keeping what they were sent).
  const existing = await kv.get(keyFor(id));
  const data = existing?.data as FriendEntry | null;
  if (existing?.etag && data?.unsubscribed) {
    const { unsubscribed: _gone, ...rest } = data;
    void _gone;
    await kv.set(keyFor(id), { ...rest, at: now.toISOString() }, { onlyIfMatch: existing.etag });
  }
}

// ---- Unsubscribe links: signed, so only the link in someone's own email can unsubscribe them. ----

function secret() {
  return process.env.RESUME_OWNER_CODE || process.env.RESEND_API_KEY || "";
}
export const canSign = () => secret().length > 0;
export function tokenFor(id: string) {
  return createHmac("sha256", secret()).update(`unsubscribe:${id}`).digest("hex").slice(0, 32);
}
export function tokenOk(id: string, token: string) {
  if (!canSign() || !/^[0-9a-f]{64}$/.test(id) || typeof token !== "string") return false;
  const a = Buffer.from(token);
  const b = Buffer.from(tokenFor(id));
  return a.length === b.length && timingSafeEqual(a, b);
}
export const idForEmail = idOf;
export function unsubscribeUrl(id: string, base = "https://thewarthens.com") {
  return `${base}/unsubscribe?i=${id}&t=${tokenFor(id)}`;
}

export async function unsubscribe(kv: Kv, id: string, token: string, now = new Date()): Promise<"ok" | "invalid"> {
  if (!tokenOk(id, token)) return "invalid";
  if (!(await kv.has(keyFor(id)))) return "ok";
  const entry = await kv.get(keyFor(id));
  const data = entry?.data as FriendEntry | null;
  if (!entry?.etag || !data || data.unsubscribed) return "ok";
  await kv.set(keyFor(id), { ...data, unsubscribed: now.toISOString() }, { onlyIfMatch: entry.etag });
  return "ok";
}

// ---- Counts and sending (owner only, see /api/friends-send). ----

const wanted = (d: FriendEntry, audience: Audience) => !d.unsubscribed && (audience === "all" || d.from === audience);

export async function friendStats(kv: Kv): Promise<{ total: number; active: number; tech: number; faith: number; unsubscribed: number }> {
  const out = { total: 0, active: 0, tech: 0, faith: 0, unsubscribed: 0 };
  for (const key of await kv.list(PREFIX)) {
    const d = (await kv.get(key))?.data as FriendEntry | null;
    if (!d?.email) continue;
    out.total++;
    if (d.unsubscribed) out.unsubscribed++;
    else {
      out.active++;
      if (d.from === "tech") out.tech++;
      if (d.from === "faith") out.faith++;
    }
  }
  return out;
}

// Sends one note to everyone it has not reached yet, one at a time, stopping when the time budget is used so a long
// list is finished over a few calls. Someone is marked as sent only after the email was accepted, so a failure is
// retried next time and a success is never repeated.
export async function sendNote(
  kv: Kv,
  opts: { campaignId: string; audience: Audience; budgetMs: number; pauseMs?: number; send: (email: string, unsubscribeLink: string) => Promise<boolean> }
): Promise<{ sent: number; failed: number; remaining: number }> {
  const started = Date.now();
  let sent = 0;
  let failed = 0;
  let remaining = 0;
  for (const key of await kv.list(PREFIX)) {
    const entry = await kv.get(key);
    const d = entry?.data as FriendEntry | null;
    if (!entry?.etag || !d?.email || !wanted(d, opts.audience) || d.sent?.includes(opts.campaignId)) continue;
    if (Date.now() - started > opts.budgetMs) {
      remaining++;
      continue;
    }
    const id = key.slice(PREFIX.length);
    if (await opts.send(d.email, unsubscribeUrl(id))) {
      await kv.set(key, { ...d, sent: [...(d.sent ?? []), opts.campaignId] }, { onlyIfMatch: entry.etag });
      sent++;
    } else {
      failed++;
      remaining++;
    }
    if (opts.pauseMs) await new Promise((r) => setTimeout(r, opts.pauseMs));
  }
  return { sent, failed, remaining };
}

export async function wouldSend(kv: Kv, campaignId: string, audience: Audience): Promise<number> {
  let n = 0;
  for (const key of await kv.list(PREFIX)) {
    const d = (await kv.get(key))?.data as FriendEntry | null;
    if (d?.email && wanted(d, audience) && !d.sent?.includes(campaignId)) n++;
  }
  return n;
}
