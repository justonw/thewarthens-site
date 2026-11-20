// "Use my resume-building session to improve this web application": an optional box a person can check before a build.
// It covers ONE build only (the one made when the box was checked). Nothing is kept unless the box is checked, the box is
// never pre-checked and never remembered, and a person can stop sharing a build and have its saved copy emptied.
//
// What is kept for a shared build: the resume and posting text they typed or pasted (files and screenshots are never kept),
// the notes they added, and the finished resume. Emails, phone numbers, web links, long ID-like numbers, and their own
// name are replaced first. This cannot catch everything (an employer's name or a personal story can still be in the text),
// so the screen says so and never promises the copy is anonymous. Nothing here is used to train AI models: the copy is read
// by our team to improve our own wording and tests.
//
// This file stands on its own (a type import only) so a script can test it without a build.
import type { Kv } from "./resume-limits";

export const SHARE_PREFIX = "share/";
export const shareKey = (id: string) => `${SHARE_PREFIX}${id}`;

const NAME_MIN = 2;

// Replaces the details that identify a person directly. Order matters: links and emails first, then phone-like and ID-like runs.
export function scrub(text: string, names: string[] = []): string {
  let out = text
    .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "[email]")
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "[link]")
    .replace(/\b(?:linkedin\.com|github\.com|twitter\.com|x\.com|facebook\.com|instagram\.com)\/\S+/gi, "[link]")
    .replace(/(?:\+?\d{1,2}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g, "[phone]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[id]")
    .replace(/\b\d{9,}\b/g, "[id]");
  for (const name of names) {
    const n = name.trim();
    if (n.length < NAME_MIN) continue;
    out = out.replace(new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), "[name]");
  }
  return out;
}

// Every part of a person's name, so "Dana Reyes" is also caught as "Dana" and as "Reyes".
export function nameParts(name: string): string[] {
  const parts = name.split(/\s+/).map((p) => p.replace(/[^\p{L}'-]/gu, "")).filter((p) => p.length >= NAME_MIN);
  return [...new Set([name.trim(), ...parts])].filter(Boolean);
}

// Scrubs every piece of text inside a value (a finished resume, for example), and drops the contact line altogether.
export function scrubDeep<T>(value: T, names: string[]): T {
  if (typeof value === "string") return scrub(value, names) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => scrubDeep(v, names)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === "contact") out[k] = [];
      else if (k === "name") out[k] = "[name]";
      else out[k] = scrubDeep(v, names);
    }
    return out as T;
  }
  return value;
}

// "d***@gmail.com": enough to tell people apart when reviewing, not enough to contact anyone from the review list.
export function maskEmail(email: string): string {
  const [user = "", domain = ""] = email.trim().toLowerCase().split("@");
  return `${user.slice(0, 1)}***@${domain}`;
}

export type ShareParts = {
  resumeText: string;
  postingText: string;
  notes: string;
  // The finished build (any JSON-like value).
  result: unknown;
  // The person's name as it appears on the finished resume, so it can be replaced everywhere.
  name: string;
  hadFiles: boolean;
  email: string;
};

export type ShareRecord =
  | { state: "shared"; who: string; person: string; at: number; resumeText: string; postingText: string; notes: string; result: unknown; hadFiles: boolean }
  | { state: "withdrawn"; who: string; at: number };

// Saves a scrubbed copy of one build. `who` is the same one-way email key the usage counts use, so the person can be matched
// on a later request to stop sharing without the copy carrying their email.
export async function saveShare(kv: Kv, id: string, who: string, parts: ShareParts, now = Date.now()): Promise<boolean> {
  const names = nameParts(parts.name);
  const rec: ShareRecord = {
    state: "shared",
    who,
    person: maskEmail(parts.email),
    at: now,
    resumeText: scrub(parts.resumeText, names).slice(0, 40_000),
    postingText: scrub(parts.postingText, names).slice(0, 20_000),
    notes: scrub(parts.notes, names).slice(0, 8_000),
    result: scrubDeep(parts.result, names),
    hadFiles: parts.hadFiles,
  };
  const r = await kv.set(shareKey(id), rec, { onlyIfNew: true });
  return r.modified;
}

// Empties the saved copy of one build. Only the person it belongs to can do it, and doing it twice is fine.
export async function withdrawShare(kv: Kv, id: string, who: string, now = Date.now()): Promise<"withdrawn" | "none"> {
  const key = shareKey(id);
  if (!(await kv.has(key))) return "none";
  const entry = await kv.get(key);
  const rec = entry?.data as ShareRecord | null;
  if (!rec || rec.who !== who) return "none";
  if (rec.state === "withdrawn") return "withdrawn";
  const r = await kv.set(key, { state: "withdrawn", who, at: now } satisfies ShareRecord, { onlyIfMatch: entry?.etag });
  return r.modified ? "withdrawn" : "none";
}

// What the owner sees when reviewing: a list (no resume text), or one whole copy. A stopped copy is shown as stopped.
export type ShareSummary = { id: string; at: string; state: "shared" | "withdrawn"; person: string; who: string; title: string; company: string; hadFiles: boolean };

export function summarize(id: string, rec: ShareRecord): ShareSummary {
  if (rec.state === "withdrawn") return { id, at: new Date(rec.at).toISOString(), state: "withdrawn", person: "", who: rec.who.slice(-8), title: "", company: "", hadFiles: false };
  const r = (rec.result ?? {}) as { postingTitle?: string; postingCompany?: string };
  return { id, at: new Date(rec.at).toISOString(), state: "shared", person: rec.person, who: rec.who.slice(-8), title: String(r.postingTitle ?? "").slice(0, 120), company: String(r.postingCompany ?? "").slice(0, 120), hadFiles: rec.hadFiles };
}

// The newest copies first. `kv.list` returns keys only, so each is read in turn.
export async function listShares(kv: Kv, limit = 200): Promise<ShareSummary[]> {
  const keys = (await kv.list(SHARE_PREFIX)).slice(0, 1000);
  const out: ShareSummary[] = [];
  for (const key of keys) {
    const entry = await kv.get(key);
    const rec = entry?.data as ShareRecord | null;
    if (rec && (rec.state === "shared" || rec.state === "withdrawn")) out.push(summarize(key.slice(SHARE_PREFIX.length), rec));
  }
  return out.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
