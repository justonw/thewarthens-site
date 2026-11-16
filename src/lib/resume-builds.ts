import { emailKey, type Kv } from "./resume-limits";

// Each build gets a small record, so that a build which finished on our side but never reached the person (the
// page timed out, or the connection dropped) can be given back, and so a failed build is never given back twice.
// The record holds no resume text: only who it belongs to (a hash), whether it used a paid build, and its state.
//
//   started   the build was counted and is running
//   done      the build finished and the result was sent back
//   refunded  the build was given back (by the build itself when it failed, or later by the page asking)

export type BuildRecord = { state: "started" | "done" | "refunded"; who: string; paid: boolean; at: number };
export type BuildMark = { key: string; etag: string; rec: BuildRecord };

export const validBuildId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9-]{16,64}$/.test(v);
const keyFor = (id: string) => `build/${id}`;

export async function startBuildMark(kv: Kv, id: string, email: string, paid: boolean, now = Date.now()): Promise<BuildMark | null> {
  const rec: BuildRecord = { state: "started", who: emailKey(email), paid, at: now };
  const key = keyFor(id);
  const r = await kv.set(key, rec, { onlyIfNew: true });
  return r.modified && r.etag ? { key, etag: r.etag, rec } : null;
}

export async function finishBuildMark(kv: Kv, m: BuildMark): Promise<void> {
  await kv.set(m.key, { ...m.rec, state: "done" }, { onlyIfMatch: m.etag });
}

// True only for the one caller that moves the record to "refunded", so a build is given back at most once.
export async function claimRefund(kv: Kv, m: BuildMark): Promise<boolean> {
  const r = await kv.set(m.key, { ...m.rec, state: "refunded" }, { onlyIfMatch: m.etag });
  return r.modified;
}

export type RecoverResult = "refunded" | "already" | "pending" | "none" | "limit";

// Called when the page did not get its result. A build that finished (or died without finishing) is given back; a
// build that is still running is left alone, and the page asks again in a few seconds. `allow` is asked just before a
// build is given back, so the number of give-backs per person can be limited.
export async function recoverBuild(
  kv: Kv,
  id: string,
  email: string,
  hooks: { allow: () => Promise<boolean>; giveBack: (paid: boolean) => Promise<void> },
  now = Date.now(),
  runningMs = 80_000
): Promise<RecoverResult> {
  const key = keyFor(id);
  if (!(await kv.has(key))) return "none";
  const entry = await kv.get(key);
  const rec = entry?.data as BuildRecord | null;
  if (!rec || !entry?.etag || rec.who !== emailKey(email)) return "none";
  if (rec.state === "refunded") return "already";
  if (rec.state === "started" && now - rec.at < runningMs) return "pending";
  if (!(await hooks.allow())) return "limit";
  const won = (await kv.set(key, { ...rec, state: "refunded" }, { onlyIfMatch: entry.etag })).modified;
  if (!won) return "already";
  await hooks.giveBack(rec.paid);
  return "refunded";
}
