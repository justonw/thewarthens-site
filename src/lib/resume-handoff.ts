// The free keyword scanner hands a person's resume and job posting to the Resume Builder, so they do not paste them
// twice. It travels in this browser tab only (sessionStorage) and is read once.

export const HANDOFF_KEY = "warthens-resume-handoff-v1";
const MAX_AGE_MS = 30 * 60_000;

export type Handoff = { resume: string; posting: string; at: number };

export function saveHandoff(resume: string, posting: string) {
  try {
    window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ resume: resume.slice(0, 60_000), posting: posting.slice(0, 40_000), at: Date.now() } satisfies Handoff));
  } catch {
    /* private mode: the builder just opens empty */
  }
}

/** Reads the handoff once and removes it. Returns null when there is none or it is old. */
export function takeHandoff(): Handoff | null {
  try {
    const raw = window.sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(HANDOFF_KEY);
    const h = JSON.parse(raw) as Handoff;
    if (typeof h.resume !== "string" || typeof h.posting !== "string" || Date.now() - Number(h.at) > MAX_AGE_MS) return null;
    return h;
  } catch {
    return null;
  }
}
