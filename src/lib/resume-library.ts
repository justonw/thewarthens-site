// "My applications": every resume the person builds is kept in their own browser (never sent to us), with the job, the
// edited resume, the cover letter, the messages they wrote for it, and whether they have applied. Nothing has to be
// built twice to get a file again, and the list doubles as a record of their search. It goes into the downloadable
// profile too. A file is treated as data only: every entry is checked and trimmed on the way in.
import { cleanText, parseDesign, parseDoc, parseLetter } from "./resume-tailor";
import type { CoverLetter, ResumeDesign, ResumeDoc, ResumeFit, ResumeGap, TailorResult } from "./resume-tailor";
import type { Audience, Purpose } from "./outreach";
import { cleanSheet, isStage, type PrepSheet } from "./interview";
import type { Result } from "./outcomes";
import type { ResumeStyle } from "./resume-files";

export const LIBRARY_KEY = "warthens-resume-library-v1";
// Small enough that a full list sits comfortably in browser storage next to the saved resume.
export const MAX_LIBRARY = 40;
export const MAX_MESSAGES_PER_ENTRY = 5;
export const MAX_ANSWERS_PER_ENTRY = 12;

export type SavedMessage = { id: string; at: string; purpose?: Purpose; audience: Audience; who: string; subject: string; note: string; message: string };

// A drafted answer to an application question, kept with the job it was written for.
export type SavedAnswer = { id: string; at: string; question: string; answer: string };

export type LibraryEntry = {
  id: string;
  at: string;
  updatedAt: string;
  title: string;
  company: string;
  status: "built" | "applied";
  appliedAt: string;
  // When a follow-up message was last copied for this job, so it is not nudged again.
  followedUpAt: string;
  // Where the application stands now: "" is still waiting. See outcomes.ts.
  result: Result;
  resultAt: string;
  doc: ResumeDoc;
  letter: CoverLetter | null;
  design: ResumeDesign | null;
  style: ResumeStyle;
  keywords: string[];
  fit: ResumeFit | null;
  gaps: ResumeGap[];
  changes: string[];
  messages: SavedMessage[];
  answers: SavedAnswer[];
  // The interview prep sheet for this job, if one was built.
  interview: PrepSheet | null;
  // A general resume for a kind of role (the title), not tailored to a posting. It is never "applied" to a job.
  general: boolean;
  // Set when the person checked "use my session to improve this web application" for this build, and a copy was kept.
  // It is the id used to stop sharing. Cleared once they stop sharing.
  shareId?: string;
};

export const noLibrary: LibraryEntry[] = [];

export function newMessageId(now = new Date()) {
  return `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`;
}

const STYLES: ResumeStyle[] = ["classic", "modern", "compact", "traditional", "custom"];
const AUDIENCES: Audience[] = ["recruiter", "manager", "peer", "friend"];

export function entryFromResult(id: string, r: TailorResult, letter: CoverLetter | null, now = new Date()): LibraryEntry {
  const stamp = now.toISOString();
  return {
    id,
    at: stamp,
    updatedAt: stamp,
    title: cleanText(r.postingTitle, 140),
    company: cleanText(r.postingCompany, 120),
    status: "built",
    appliedAt: "",
    followedUpAt: "",
    result: "",
    resultAt: "",
    doc: r.resume,
    letter,
    design: r.design ?? null,
    style: r.design ? "custom" : "classic",
    keywords: r.postingKeywords.slice(0, 20),
    fit: r.fit ?? null,
    gaps: r.gaps,
    changes: r.changes,
    messages: [],
    answers: [],
    interview: null,
    general: r.general === true,
  };
}

// What the result screen needs to open a saved build again.
export function entryToResult(e: LibraryEntry): TailorResult {
  return {
    resume: e.doc,
    design: e.design ?? undefined,
    coverLetter: e.letter ?? undefined,
    postingTitle: e.title,
    postingCompany: e.company,
    postingKeywords: e.keywords,
    gaps: e.gaps,
    fit: e.fit ?? undefined,
    changes: e.changes,
    ...(e.general ? { general: true } : {}),
  };
}

// Puts an entry at the top (or updates the one with the same id). When the list is full the oldest build that has not
// been applied to goes first, so a record of real applications outlasts experiments.
export function upsertEntry(list: LibraryEntry[], entry: LibraryEntry): LibraryEntry[] {
  const existing = list.some((e) => e.id === entry.id);
  const next = existing ? list.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...list];
  if (next.length <= MAX_LIBRARY) return next;
  for (let i = next.length - 1; i >= 0; i--) {
    if (next[i].status === "built" && next[i].id !== entry.id) {
      next.splice(i, 1);
      return next;
    }
  }
  for (let i = next.length - 1; i >= 0; i--) {
    if (next[i].id !== entry.id) {
      next.splice(i, 1);
      return next;
    }
  }
  return next.slice(0, MAX_LIBRARY);
}

export const sameJob = (a: { company: string; role: string }, b: { company: string; role: string }) =>
  a.company.trim().toLowerCase() === b.company.trim().toLowerCase() && a.role.trim().toLowerCase() === b.role.trim().toLowerCase();

// "Today", "Yesterday", or "Nov 14".
export function whenLabel(iso: string, now = new Date()): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(d.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}) });
}

const text = (v: unknown, max: number) => cleanText(v, max);
const iso = (v: unknown) => (typeof v === "string" && !Number.isNaN(new Date(v).getTime()) ? new Date(v).toISOString() : "");

// Checks a list that came from a file. Anything that does not look right is dropped, never repaired by guessing.
export function cleanLibrary(raw: unknown): LibraryEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: LibraryEntry[] = [];
  const seen = new Set<string>();
  for (const item of raw.slice(0, MAX_LIBRARY)) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const doc = o.doc && typeof o.doc === "object" ? parseDoc(o.doc as Record<string, unknown>) : null;
    const id = text(o.id, 80);
    if (!doc || !id || seen.has(id)) continue;
    seen.add(id);
    const at = iso(o.at) || new Date().toISOString();
    const status = o.status === "applied" && o.general !== true ? "applied" : "built";
    const gaps: ResumeGap[] = [];
    for (const g of Array.isArray(o.gaps) ? o.gaps.slice(0, 12) : []) {
      if (!g || typeof g !== "object") continue;
      const r = g as Record<string, unknown>;
      const requirement = text(r.requirement, 200);
      if (!requirement) continue;
      gaps.push({ requirement, note: text(r.note, 400), question: text(r.question, 300) || undefined, ifNot: text(r.ifNot, 300) || undefined, kind: r.kind === "deepen" ? "deepen" : r.kind === "missing" ? "missing" : undefined });
    }
    const f = o.fit && typeof o.fit === "object" ? (o.fit as Record<string, unknown>) : null;
    const fit: ResumeFit | null = f && (f.level === "strong" || f.level === "good" || f.level === "stretch") && text(f.reason, 400) ? { level: f.level, reason: text(f.reason, 400) } : null;
    const messages: SavedMessage[] = [];
    for (const m of Array.isArray(o.messages) ? o.messages.slice(0, MAX_MESSAGES_PER_ENTRY) : []) {
      if (!m || typeof m !== "object") continue;
      const r = m as Record<string, unknown>;
      const message = text(r.message, 1400);
      const note = text(r.note, 600);
      if (!message || !AUDIENCES.includes(r.audience as Audience)) continue;
      messages.push({ id: text(r.id, 80) || `${messages.length}`, at: iso(r.at) || at, purpose: r.purpose === "followup" ? "followup" : "intro", audience: r.audience as Audience, who: text(r.who, 160), subject: text(r.subject, 90), note, message });
    }
    const answers: SavedAnswer[] = [];
    for (const a of Array.isArray(o.answers) ? o.answers.slice(0, MAX_ANSWERS_PER_ENTRY) : []) {
      if (!a || typeof a !== "object") continue;
      const r = a as Record<string, unknown>;
      const question = text(r.question, 600);
      const answer = text(r.answer, 6000);
      if (!question || answer.length < 20) continue;
      answers.push({ id: text(r.id, 80) || `${answers.length}`, at: iso(r.at) || at, question, answer });
    }
    out.push({
      id,
      at,
      updatedAt: iso(o.updatedAt) || at,
      title: text(o.title, 140),
      company: text(o.company, 120),
      status,
      appliedAt: status === "applied" ? iso(o.appliedAt) || at : "",
      followedUpAt: iso(o.followedUpAt),
      result: status === "applied" && (o.result === "phone" || o.result === "interview" || o.result === "offer" || o.result === "rejected") ? o.result : "",
      resultAt: status === "applied" ? iso(o.resultAt) : "",
      doc,
      letter: parseLetter(o.letter),
      design: parseDesign(o.design),
      style: STYLES.includes(o.style as ResumeStyle) ? (o.style as ResumeStyle) : "classic",
      keywords: (Array.isArray(o.keywords) ? o.keywords : []).map((k) => text(k, 60)).filter(Boolean).slice(0, 20),
      fit,
      gaps,
      changes: (Array.isArray(o.changes) ? o.changes : []).map((c) => text(c, 300)).filter(Boolean).slice(0, 12),
      messages,
      answers,
      interview: o.general !== true && o.interview && typeof o.interview === "object" && isStage((o.interview as Record<string, unknown>).stage) ? cleanSheet(o.interview, (o.interview as { stage: "phone" | "manager" | "final" }).stage) : null,
      general: o.general === true,
      shareId: typeof o.shareId === "string" && /^[A-Za-z0-9-]{16,64}$/.test(o.shareId) ? o.shareId : undefined,
    });
  }
  return out;
}

// Drops blank lines and empty entries before a resume is checked or downloaded.
export function cleanDoc(d: ResumeDoc): ResumeDoc {
  const t = (s: string) => s.trim();
  return {
    ...d,
    name: t(d.name),
    headline: t(d.headline),
    summary: t(d.summary),
    contact: d.contact.map(t).filter(Boolean),
    skills: d.skills.map((s) => ({ label: t(s.label), items: t(s.items) })).filter((s) => s.items),
    experience: d.experience
      .map((j) => ({ ...j, title: t(j.title), company: t(j.company), location: t(j.location), dates: t(j.dates), bullets: j.bullets.map(t).filter(Boolean) }))
      .filter((j) => j.title || j.company),
    training: d.training.map((x) => ({ name: t(x.name), detail: t(x.detail), dates: t(x.dates) })).filter((x) => x.name),
    education: d.education.map((e) => ({ school: t(e.school), credential: t(e.credential), dates: t(e.dates) })).filter((e) => e.school),
  };
}

// A job that was applied to a while ago, with no follow-up yet: the moment a short check-in is worth sending.
export function followUpDue(e: LibraryEntry, now = new Date(), afterDays = 5): { due: boolean; days: number } {
  if (e.status !== "applied" || !e.appliedAt || e.followedUpAt || e.result !== "") return { due: false, days: 0 };
  const days = Math.floor((now.getTime() - new Date(e.appliedAt).getTime()) / 86_400_000);
  return { due: Number.isFinite(days) && days >= afterDays, days: Math.max(0, days) };
}
