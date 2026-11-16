// Server-only usage limits for the resume builder, so it cannot run up the AI bill.
//   1. Each email address gets FREE_PER_EMAIL resumes.
//   2. The whole site gets MONTHLY_CAP resumes a month, a safety net on top of the spend limit
//      set in the Anthropic Console.
// Counts live in Netlify Blobs. A count is reserved before the AI is called and handed back if the
// AI call fails, so a failed try never uses up someone's free resume. Conditional writes keep the
// counts correct when two requests arrive at the same moment.
import { createHash } from "node:crypto";

export const FREE_PER_EMAIL = 2;
export const DEFAULT_MONTHLY_CAP = 150;

type Entry = { data: unknown; etag?: string } | null;

export type Kv = {
  get(key: string): Promise<Entry>;
  // Whether a key exists. Used before reading a key that may not be there: Netlify's storage currently never
  // answers a read of a missing key, so a missing key is never read.
  has(key: string): Promise<boolean>;
  set(key: string, data: unknown, opts: { onlyIfNew?: boolean; onlyIfMatch?: string }): Promise<{ modified: boolean; etag?: string }>;
  // Every key that starts with the prefix.
  list(prefix: string): Promise<string[]>;
};

export function memoryKv(): Kv {
  const data = new Map<string, { value: unknown; etag: string }>();
  let version = 0;
  return {
    async get(key) {
      const hit = data.get(key);
      return hit ? { data: hit.value, etag: hit.etag } : null;
    },
    async has(key) {
      return data.has(key);
    },
    async list(prefix) {
      return [...data.keys()].filter((k) => k.startsWith(prefix));
    },
    async set(key, value, opts) {
      const hit = data.get(key);
      if (opts.onlyIfNew && hit) return { modified: false };
      if (opts.onlyIfMatch && hit?.etag !== opts.onlyIfMatch) return { modified: false };
      const etag = `v${++version}`;
      data.set(key, { value, etag });
      return { modified: true, etag };
    },
  };
}

// Never wait forever on storage. If it does not answer in time, the caller gets an error it can handle, and the
// log says which step was stuck.
export class KvTimeoutError extends Error {}
export function withTimeout<T>(work: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new KvTimeoutError(`${label} timed out after ${ms} ms`)), ms);
  });
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

const devKvs = new Map<string, Kv>();


export async function getKv(live: boolean): Promise<Kv> {
  const name = live ? "resume-usage" : "resume-usage-test";
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name, consistency: "strong" });
    return {
      async get(key) {
        return store.getWithMetadata(key, { type: "json", consistency: "strong" });
      },
      async has(key) {
        const { blobs } = await store.list({ prefix: key });
        return blobs.some((b) => b.key === key);
      },
      async list(prefix) {
        const { blobs } = await store.list({ prefix });
        return blobs.map((b) => b.key);
      },
      async set(key, value, opts) {
        return opts.onlyIfMatch
          ? store.setJSON(key, value, { onlyIfMatch: opts.onlyIfMatch })
          : store.setJSON(key, value, { onlyIfNew: true });
      },
    };
  } catch {
    // No Netlify storage here (local development): fall back to memory.
    let kv = devKvs.get(name);
    if (!kv) {
      kv = memoryKv();
      devKvs.set(name, kv);
    }
    return kv;
  }
}

const MAX_ATTEMPTS = 30;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function emailKey(email: string) {
  const digest = createHash("sha256").update(`resume-v1:${email.trim().toLowerCase()}`).digest("hex");
  return `email/${digest}`;
}

export function monthKey(now = new Date()) {
  return `month/${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Adds `delta` to a counter, but only if the result stays within [0, max]. Returns the new value,
// or null when it would go over max.
export async function bumpCounter(kv: Kv, key: string, delta: number, max: number): Promise<number | null> {
  await kv.set(key, { n: 0 }, { onlyIfNew: true });
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const current = await kv.get(key);
    if (!current?.etag) throw new Error("counter is missing");
    const n = Number((current.data as { n?: number } | null)?.n ?? 0);
    const next = Math.max(0, n + delta);
    if (delta > 0 && next > max) return null;
    const written = await kv.set(key, { n: next }, { onlyIfMatch: current.etag });
    if (written.modified) return next;
    await sleep(Math.random() * 25);
  }
  throw new Error("counter is busy");
}

// ---------- Paid builds ----------
// Someone who has used their free builds can buy more (see /api/resume-checkout). Each purchase adds builds to
// a balance kept for their email address. A build is paid for out of the free ones first, then the balance.

export function creditsKey(email: string) {
  return `credits/${emailKey(email).slice(6)}`;
}

// How many builds this address has ever bought, so a result can say "paid build 3 of 15". It only goes up, when a
// payment is confirmed (see the Stripe webhook).
export function purchasedKey(email: string) {
  return `purchased/${emailKey(email).slice(6)}`;
}

export async function purchasedTotal(kv: Kv, email: string): Promise<number | null> {
  if (!(await kv.has(purchasedKey(email)))) return null;
  const entry = await kv.get(purchasedKey(email));
  return Math.max(0, Number((entry?.data as { n?: number } | null)?.n ?? 0));
}

export async function addPurchased(kv: Kv, email: string, n: number): Promise<number | null> {
  return bumpCounter(kv, purchasedKey(email), n, Number.MAX_SAFE_INTEGER);
}

export async function creditsLeft(kv: Kv, email: string): Promise<number> {
  if (!(await kv.has(creditsKey(email)))) return 0;
  const entry = await kv.get(creditsKey(email));
  return Math.max(0, Number((entry?.data as { n?: number } | null)?.n ?? 0));
}

export async function addCredits(kv: Kv, email: string, n: number): Promise<number | null> {
  return bumpCounter(kv, creditsKey(email), n, Number.MAX_SAFE_INTEGER);
}

// Takes one paid build off the balance, or returns null when there is none.
async function takeCredit(kv: Kv, email: string): Promise<number | null> {
  const key = creditsKey(email);
  if (!(await kv.has(key))) return null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const current = await kv.get(key);
    const n = Number((current?.data as { n?: number } | null)?.n ?? 0);
    if (!current?.etag || n < 1) return null;
    const written = await kv.set(key, { n: n - 1 }, { onlyIfMatch: current.etag });
    if (written.modified) return n - 1;
    await sleep(Math.random() * 25);
  }
  throw new Error("credits are busy");
}

// ---------- Builds ever made, and the emailed copies that come with them ----------
// Each build comes with 2 emailed copies: one sent automatically, and one resend. The copies are a pool per address
// (builds x 2), so 2 free builds allow 4 copies, and an address that bought 30 more builds allows 64 in all.
export const COPIES_PER_BUILD = 2;

export function buildsKey(email: string) {
  return `builds/${emailKey(email).slice(6)}`;
}
export function mailedKey(email: string) {
  return `mailed/${emailKey(email).slice(6)}`;
}

// Counts a build against the address. Never lets a counting problem break a build that already went through.
async function countBuild(kv: Kv, email: string, delta: number) {
  try {
    await bumpCounter(kv, buildsKey(email), delta, Number.MAX_SAFE_INTEGER);
  } catch {
    /* the build still counts for the person; only the email allowance is affected */
  }
}

// How many emailed copies the address is allowed in all. Addresses that built before this counter existed are
// worked out from their free builds, so they are never locked out.
export async function copiesAllowed(kv: Kv, email: string, freeUsed: number): Promise<number> {
  let builds = 0;
  if (await kv.has(buildsKey(email))) {
    const entry = await kv.get(buildsKey(email));
    builds = Number((entry?.data as { n?: number } | null)?.n ?? 0);
  }
  return Math.max(builds, freeUsed) * COPIES_PER_BUILD;
}

export type Reservation =
  | { ok: true; used: number; unlimited: boolean; paid: boolean; credits: number }
  | { ok: false; reason: "limit" | "cap" };

export async function reserve(
  kv: Kv,
  email: string,
  opts: { unlimited: boolean; monthlyCap: number; now?: Date }
): Promise<Reservation> {
  if (opts.unlimited) return { ok: true, used: 0, unlimited: true, paid: false, credits: 0 };
  const mine = await bumpCounter(kv, emailKey(email), 1, FREE_PER_EMAIL);
  if (mine === null) {
    // The free builds are used up. A paid build comes off the balance, and is not held to the monthly cap
    // because the person paid for it.
    const left = await takeCredit(kv, email);
    if (left === null) return { ok: false, reason: "limit" };
    await countBuild(kv, email, 1);
    return { ok: true, used: FREE_PER_EMAIL, unlimited: false, paid: true, credits: left };
  }
  const all = await bumpCounter(kv, monthKey(opts.now), 1, opts.monthlyCap);
  if (all === null) {
    await bumpCounter(kv, emailKey(email), -1, FREE_PER_EMAIL);
    return { ok: false, reason: "cap" };
  }
  await countBuild(kv, email, 1);
  return { ok: true, used: mine, unlimited: false, paid: false, credits: await creditsLeft(kv, email) };
}

export async function refund(kv: Kv, email: string, opts: { unlimited: boolean; paid?: boolean; now?: Date }) {
  if (opts.unlimited) return;
  await countBuild(kv, email, -1);
  if (opts.paid) {
    await addCredits(kv, email, 1);
    return;
  }
  await bumpCounter(kv, emailKey(email), -1, FREE_PER_EMAIL);
  await bumpCounter(kv, monthKey(opts.now), -1, Number.MAX_SAFE_INTEGER);
}
