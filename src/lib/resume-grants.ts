import { addCredits, buildsKey, creditsKey, creditsLeft, emailKey, FREE_PER_EMAIL, type Kv } from "./resume-limits";

// Extra resume builds given to a particular email address by the owner (testers, friends, the team). They use the same
// balance as paid builds, so the build page needs no special case: the 2 free builds are used first, then the balance.
// Every grant is also written to a small log, so there is a record of who was given what and when.

export type Grant = { email: string; builds: number; at: string; note?: string };

const grantKey = (email: string, at: Date) => `grants/${emailKey(email).slice(6)}-${at.getTime()}`;

export async function grantBuilds(kv: Kv, email: string, builds: number, note = "", now = new Date()) {
  const clean = email.trim().toLowerCase();
  const left = await addCredits(kv, clean, builds);
  try {
    await kv.set(grantKey(clean, now), { email: clean, builds, at: now.toISOString(), ...(note ? { note: note.slice(0, 120) } : {}) } satisfies Grant, { onlyIfNew: true });
  } catch {
    /* the grant itself went through; only the log line is missing */
  }
  return left;
}

async function counter(kv: Kv, key: string): Promise<number> {
  if (!(await kv.has(key))) return 0;
  const entry = await kv.get(key);
  return Math.max(0, Number((entry?.data as { n?: number } | null)?.n ?? 0));
}

// Where an address stands: free builds used, extra builds left, and builds made in all.
export async function buildStatus(kv: Kv, email: string) {
  const clean = email.trim().toLowerCase();
  const freeUsed = Math.min(FREE_PER_EMAIL, await counter(kv, emailKey(clean)));
  return {
    email: clean,
    freeLeft: FREE_PER_EMAIL - freeUsed,
    extraLeft: await creditsLeft(kv, clean),
    buildsMade: await counter(kv, buildsKey(clean)),
  };
}

export { creditsKey };
