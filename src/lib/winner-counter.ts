// Server-only helper that numbers coaching requests so every Nth one wins a free session.
// The number of winners' spacing lives in the API route, never in client code, and the
// visitor only ever learns "you won" or "thanks".
//
// Storage is Netlify Blobs. Conditional writes make the counter safe when two people submit
// at the same moment: only one of them can claim a given number. Each email address is counted
// once, so submitting many times cannot be used to reach a winning number.
import { createHash } from "node:crypto";

export type CounterStore = {
  getWithMetadata(
    key: string,
    options: { type: "json"; consistency?: "strong" | "eventual" }
  ): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(
    key: string,
    data: unknown,
    options?: { onlyIfNew?: boolean; onlyIfMatch?: string }
  ): Promise<{ modified: boolean; etag?: string }>;
};

export type EntryResult = {
  // false when this email was already counted earlier
  counted: boolean;
  // the entry number, or 0 when not counted
  number: number;
};

const COUNT_KEY = "count";
const MAX_ATTEMPTS = 40;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function emailKey(email: string) {
  const digest = createHash("sha256")
    .update(`coaching-v1:${email.trim().toLowerCase()}`)
    .digest("hex");
  return `seen/${digest}`;
}

export async function recordEntry(store: CounterStore, email: string): Promise<EntryResult> {
  // One entry per email address.
  const first = await store.setJSON(emailKey(email), { at: Date.now() }, { onlyIfNew: true });
  if (!first.modified) return { counted: false, number: 0 };

  // Make sure the counter exists before reading it. Reading a key that does not exist yet can
  // hang on Netlify, so this conditional create (a no-op once it exists) comes first.
  await store.setJSON(COUNT_KEY, { n: 0 }, { onlyIfNew: true });

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const current = await store.getWithMetadata(COUNT_KEY, {
      type: "json",
      consistency: "strong",
    });
    if (!current?.etag) throw new Error("counter is missing");
    const n = Number((current.data as { n?: number } | null)?.n ?? 0) + 1;
    const updated = await store.setJSON(COUNT_KEY, { n }, { onlyIfMatch: current.etag });
    if (updated.modified) return { counted: true, number: n };
    // Someone else claimed that number first. Wait a random moment so contenders spread out.
    await sleep(Math.random() * 25);
  }
  throw new Error("could not claim an entry number");
}

export function isWinningNumber(number: number, every: number) {
  return number > 0 && every > 0 && number % every === 0;
}

// A tiny in-memory stand-in with the same conditional-write behavior. Used only when
// Netlify storage is not available (local development) and in tests.
export function memoryStore(): CounterStore {
  const data = new Map<string, { value: unknown; etag: string }>();
  let version = 0;
  const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
  return {
    async getWithMetadata(key) {
      await tick();
      const hit = data.get(key);
      return hit ? { data: hit.value, etag: hit.etag } : null;
    },
    async setJSON(key, value, options) {
      await tick();
      const hit = data.get(key);
      if (options?.onlyIfNew && hit) return { modified: false };
      if (options?.onlyIfMatch && (!hit || hit.etag !== options.onlyIfMatch)) {
        return { modified: false };
      }
      const etag = `v${++version}`;
      data.set(key, { value, etag });
      return { modified: true, etag };
    },
  };
}

const devStores = new Map<string, CounterStore>();

// `live` is true only on the real site. Test links and local copies use a separate counter.
export async function getCounterStore(live: boolean): Promise<CounterStore> {
  const name = live ? "coaching-entries" : "coaching-entries-test";
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name, consistency: "strong" });
    return {
      getWithMetadata: (key, options) =>
        store.getWithMetadata(key, { type: "json", consistency: options.consistency }),
      setJSON: (key, value, options) =>
        options?.onlyIfMatch
          ? store.setJSON(key, value, { onlyIfMatch: options.onlyIfMatch })
          : store.setJSON(key, value, { onlyIfNew: true }),
    };
  } catch {
    // No Netlify storage here (local development): fall back to memory.
    let fallback = devStores.get(name);
    if (!fallback) {
      fallback = memoryStore();
      devStores.set(name, fallback);
    }
    return fallback;
  }
}
