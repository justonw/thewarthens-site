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

// "library" is the list of saved builds ("My applications"). It is carried here as plain data and checked where it is
// used (see resume-library.ts), so this file stays free of the resume tailor.
export type Profile = { resume: string; notes: string; hiringManager: string; email: string; stories: Story[]; library?: unknown[] };
export const MAX_PROFILE_FILE = 3_000_000;
export const MAX_LIBRARY_IN_FILE = 60;

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

// The three questions that let the interview opening sound like the person. Each answer is kept as a story whose topic starts with
// "Your story", so every later build can use it (interview prep reads exactly those lines for the human part of the opening).
export const YOUR_STORY_PREFIX = "Your story";
export const YOUR_STORY_PROMPTS: { topic: string; question: string; placeholder: string }[] = [
  { topic: "Your story, what connects my work", question: "What connects the jobs and seasons of life on your resume?", placeholder: "For example: I keep ending up as the person who keeps everyone moving." },
  { topic: "Your story, what shaped how I work", question: "What from outside work (family, faith, a hard season, something you lived through) shapes how you work?", placeholder: "A sentence or two, in your own words." },
  { topic: "Your story, why this work and why now", question: "Why this kind of work, and why now?", placeholder: "What you want to do next, and what is pulling you toward it." },
];

// Replaces the story with the same topic (so re-answering a question updates it, and older versions do not sit beside the new one).
export function replaceStoryTopic(list: Story[], story: Story): Story[] {
  return addStoryTo(list.filter((s) => s.topic.toLowerCase() !== story.topic.toLowerCase()), story);
}

// The newest saved answer for each "Your story" question, in the order the questions are asked.
export function yourStoryAnswers(list: Story[]): string[] {
  return YOUR_STORY_PROMPTS.map((p) => [...list].reverse().find((s) => s.topic.toLowerCase() === p.topic.toLowerCase())?.answer ?? "");
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
      library: p.library ?? [],
    },
    null,
    2
  );
}

export type ParsedProfile = { ok: true; profile: Profile } | { ok: false; error: string };

export function parseProfileFile(text: string, limits: { resume: number; notes: number }): ParsedProfile {
  if (text.length > MAX_PROFILE_FILE) return { ok: false, error: "That file is too big to be a profile from this site." };
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
      library: Array.isArray(data.library) ? data.library.slice(0, MAX_LIBRARY_IN_FILE) : [],
    },
  };
}
