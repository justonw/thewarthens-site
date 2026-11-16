import { emailKey, type Kv } from "./resume-limits";

// People who used their 2 free builds before paid builds opened and asked to be told when more are available.
// Each one is kept as a small record (their address, when they asked, and whether they have been told), so one
// email can go to everyone the day paid builds open, and nobody is told twice.

export type WaitlistEntry = { email: string; at: string; notified?: string };

const PREFIX = "waitlist/";
const keyFor = (email: string) => `${PREFIX}${emailKey(email).slice(6)}`;

// Saves the address. Asking twice changes nothing.
export async function addToWaitlist(kv: Kv, email: string, now = new Date()) {
  await kv.set(keyFor(email), { email: email.trim().toLowerCase(), at: now.toISOString() } satisfies WaitlistEntry, { onlyIfNew: true });
}

export async function waitlistCounts(kv: Kv): Promise<{ total: number; waiting: number }> {
  let total = 0;
  let waiting = 0;
  for (const key of await kv.list(PREFIX)) {
    const entry = await kv.get(key);
    const data = entry?.data as WaitlistEntry | null;
    if (!data?.email) continue;
    total++;
    if (!data.notified) waiting++;
  }
  return { total, waiting };
}

// Sends to everyone not yet told, one at a time, stopping when the time budget is used so a long list can be
// finished over a few calls. An address is marked as told only after its email was accepted, so a failure is
// retried next time and a success is never repeated.
export async function notifyWaitlist(
  kv: Kv,
  send: (email: string) => Promise<boolean>,
  opts: { budgetMs: number; pauseMs?: number; now?: Date }
): Promise<{ sent: number; failed: number; remaining: number }> {
  const started = Date.now();
  let sent = 0;
  let failed = 0;
  let remaining = 0;
  for (const key of await kv.list(PREFIX)) {
    const entry = await kv.get(key);
    const data = entry?.data as WaitlistEntry | null;
    if (!entry?.etag || !data?.email || data.notified) continue;
    if (Date.now() - started > opts.budgetMs) {
      remaining++;
      continue;
    }
    if (await send(data.email)) {
      await kv.set(key, { ...data, notified: (opts.now ?? new Date()).toISOString() }, { onlyIfMatch: entry.etag });
      sent++;
    } else {
      failed++;
      remaining++;
    }
    if (opts.pauseMs) await new Promise((r) => setTimeout(r, opts.pauseMs));
  }
  return { sent, failed, remaining };
}
