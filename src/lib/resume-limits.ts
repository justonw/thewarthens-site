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
  set(key: string, data: unknown, opts: { onlyIfNew?: boolean; onlyIfMatch?: string }): Promise<{ modified: boolean; etag?: string }>;
};

export function memoryKv(): Kv {
  const data = new Map<string, { value: unknown; etag: string }>();
  let version = 0;
  return {
    async get(key) {
      const hit = data.get(key);
      return hit ? { data: hit.value, etag: hit.etag } : null;
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

const devKvs = new Map<string, Kv>();
let loggedKv = false;

export async function getKv(live: boolean): Promise<Kv> {
  const name = live ? "resume-usage" : "resume-usage-test";
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name, consistency: "strong" });
    // Logged once per start-up, so a storage problem can be told apart from a missing setting.
    if (!loggedKv) {
      loggedKv = true;
      console.log("resume-limits: Netlify Blobs store ready", { store: name, hasBlobsContext: Boolean(process.env.NETLIFY_BLOBS_CONTEXT) });
    }
    return {
      async get(key) {
        return store.getWithMetadata(key, { type: "json", consistency: "strong" });
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

export async function creditsLeft(kv: Kv, email: string): Promise<number> {
  const entry = await kv.get(creditsKey(email));
  return Math.max(0, Number((entry?.data as { n?: number } | null)?.n ?? 0));
}

export async function addCredits(kv: Kv, email: string, n: number): Promise<number | null> {
  return bumpCounter(kv, creditsKey(email), n, Number.MAX_SAFE_INTEGER);
}

// Takes one paid build off the balance, or returns null when there is none.
async function takeCredit(kv: Kv, email: string): Promise<number | null> {
  const key = creditsKey(email);
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
    return { ok: true, used: FREE_PER_EMAIL, unlimited: false, paid: true, credits: left };
  }
  const all = await bumpCounter(kv, monthKey(opts.now), 1, opts.monthlyCap);
  if (all === null) {
    await bumpCounter(kv, emailKey(email), -1, FREE_PER_EMAIL);
    return { ok: false, reason: "cap" };
  }
  return { ok: true, used: mine, unlimited: false, paid: false, credits: await creditsLeft(kv, email) };
}

export async function refund(kv: Kv, email: string, opts: { unlimited: boolean; paid?: boolean; now?: Date }) {
  if (opts.unlimited) return;
  if (opts.paid) {
    await addCredits(kv, email, 1);
    return;
  }
  await bumpCounter(kv, emailKey(email), -1, FREE_PER_EMAIL);
  await bumpCounter(kv, monthKey(opts.now), -1, Number.MAX_SAFE_INTEGER);
}
