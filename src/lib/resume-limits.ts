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

export async function getKv(live: boolean): Promise<Kv> {
  const name = live ? "resume-usage" : "resume-usage-test";
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name, consistency: "strong" });
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
async function bump(kv: Kv, key: string, delta: number, max: number): Promise<number | null> {
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

export type Reservation =
  | { ok: true; used: number; unlimited: boolean }
  | { ok: false; reason: "limit" | "cap" };

export async function reserve(
  kv: Kv,
  email: string,
  opts: { unlimited: boolean; monthlyCap: number; now?: Date }
): Promise<Reservation> {
  if (opts.unlimited) return { ok: true, used: 0, unlimited: true };
  const mine = await bump(kv, emailKey(email), 1, FREE_PER_EMAIL);
  if (mine === null) return { ok: false, reason: "limit" };
  const all = await bump(kv, monthKey(opts.now), 1, opts.monthlyCap);
  if (all === null) {
    await bump(kv, emailKey(email), -1, FREE_PER_EMAIL);
    return { ok: false, reason: "cap" };
  }
  return { ok: true, used: mine, unlimited: false };
}

export async function refund(kv: Kv, email: string, opts: { unlimited: boolean; now?: Date }) {
  if (opts.unlimited) return;
  await bump(kv, emailKey(email), -1, FREE_PER_EMAIL);
  await bump(kv, monthKey(opts.now), -1, Number.MAX_SAFE_INTEGER);
}
