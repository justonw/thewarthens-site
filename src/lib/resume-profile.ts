// The saved profile: what a person has told us, kept in their own browser (never sent to us), so the next job takes one
// click. It is the saved resume and notes (see ResumeBuilder), plus a "story bank": each true answer they gave to a
// gap-coach question. It can be downloaded as a file and imported on another device. A file is treated as data only:
// it is checked, trimmed, and never run.

export const STORIES_KEY = "warthens-resume-stories-v1";
export const USE_STORIES_KEY = "warthens-resume-use-stories-v1";
export const PROFILE_APP = "thewarthens-resume-profile";
export const PROFILE_VERSION = 1;
export const MAX_STORIES = 40;

export type Story = { id: string; topic: string; question: string; answer: string; at: string };
export const noStories: Story[] = [];

export type Profile = { resume: string; notes: string; hiringManager: string; email: string; stories: Story[] };

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "");

export function newStory(topic: string, question: string, answer: string, now = new Date()): Story {
  return { id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`, topic: clip(topic, 200), question: clip(question, 300), answer: clip(answer, 700), at: now.toISOString() };
}

// Adds a story. The same answer to the same topic is not kept twice, and only the newest MAX_STORIES are kept.
export function addStoryTo(list: Story[], story: Story): Story[] {
  const same = (s: Story) => s.topic.toLowerCase() === story.topic.toLowerCase() && s.answer.toLowerCase() === story.answer.toLowerCase();
  const next = [...list.filter((s) => !same(s)), story];
  return next.slice(-MAX_STORIES);
}

// The stories as a block of notes for the next build, newest first, within a character budget. The person said every one of
// these themselves, so the resume tool treats them like the rest of their notes.
export function storiesAsNotes(list: Story[], budget: number): string {
  const head = "Things I have already told you about my experience (true, in my own words):";
  if (list.length === 0 || budget < head.length + 40) return "";
  const lines: string[] = [];
  let used = head.length;
  for (const s of [...list].reverse()) {
    const line = `- ${s.topic}: ${s.answer}`;
    if (used + line.length + 1 > budget) break;
    lines.push(line);
    used += line.length + 1;
  }
  return lines.length ? `${head}\n${lines.join("\n")}` : "";
}

export function profileFileName(now = new Date()) {
  return `my-career-profile-${now.toISOString().slice(0, 10)}.json`;
}

export function buildProfileFile(p: Profile & { filesOmitted?: number }, now = new Date()): string {
  return JSON.stringify(
    {
      app: PROFILE_APP,
      version: PROFILE_VERSION,
      savedAt: now.toISOString(),
      note: "This is your saved profile from thewarthens.com/resume. Keep it somewhere private. You can load it back on any device.",
      resume: p.resume,
      notes: p.notes,
      hiringManager: p.hiringManager,
      email: p.email,
      filesOmitted: p.filesOmitted ?? 0,
      stories: p.stories,
    },
    null,
    2
  );
}

export type ParsedProfile = { ok: true; profile: Profile } | { ok: false; error: string };

export function parseProfileFile(text: string, limits: { resume: number; notes: number }): ParsedProfile {
  if (text.length > 600_000) return { ok: false, error: "That file is too big to be a profile from this site." };
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "That doesn't look like a profile file from this site." };
  }
  if (!data || typeof data !== "object" || data.app !== PROFILE_APP) return { ok: false, error: "That doesn't look like a profile file from this site." };
  if (typeof data.version !== "number" || data.version > PROFILE_VERSION) return { ok: false, error: "That profile is from a newer version. Reload the page and try again." };
  const rawStories = Array.isArray(data.stories) ? data.stories : [];
  const stories: Story[] = [];
  for (const r of rawStories.slice(-MAX_STORIES)) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const topic = clip(o.topic, 200);
    const answer = clip(o.answer, 700);
    if (!topic || answer.length < 3) continue;
    stories.push({ id: clip(o.id, 60) || `${Date.now()}-${stories.length}`, topic, question: clip(o.question, 300), answer, at: clip(o.at, 40) || new Date().toISOString() });
  }
  return {
    ok: true,
    profile: {
      resume: clip(data.resume, limits.resume),
      notes: clip(data.notes, limits.notes),
      hiringManager: clip(data.hiringManager, 120),
      email: clip(data.email, 200),
      stories,
    },
  };
}
