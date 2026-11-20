// Plain-text files for the parts of the job search kit that had no download of their own (messages and application answers),
// and the small helpers the "Your files" panel shares with the rest of the result screen. Pure functions, so a script can test them.
import type { CoverLetter } from "./resume-tailor";
import type { SavedAnswer, SavedMessage } from "./resume-library";

// A job title or name reduced to a safe, short piece of a file name.
export function fileSlug(text: string, fallback = "job"): string {
  const s = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/g, "");
  return s || fallback;
}

// What gets downloaded or emailed for a cover letter: no empty paragraphs, and a closing even when it was cleared.
export function cleanLetter(letter: CoverLetter): CoverLetter {
  return {
    greeting: letter.greeting.trim(),
    paragraphs: letter.paragraphs.map((p) => p.trim()).filter(Boolean),
    closing: letter.closing.trim() || "Sincerely,",
  };
}

const WHO: Record<string, string> = { recruiter: "a recruiter", manager: "a hiring manager", peer: "someone in the field", friend: "a friend" };

export function messagesToText(messages: SavedMessage[], jobLine: string): string {
  const out: string[] = [`MESSAGES${jobLine ? `: ${jobLine}` : ""}`];
  messages.forEach((m, i) => {
    const to = m.who.trim() || WHO[m.audience] || "a contact";
    out.push("", `${i + 1}. To ${to}`);
    if (m.subject.trim()) out.push(`Subject: ${m.subject.trim()}`);
    out.push("", m.message.trim());
    if (m.note.trim()) out.push("", "Short version:", m.note.trim());
  });
  return out.join("\n");
}

export function answersToText(answers: SavedAnswer[], jobLine: string): string {
  const out: string[] = [`APPLICATION ANSWERS${jobLine ? `: ${jobLine}` : ""}`];
  answers.forEach((a, i) => {
    out.push("", `${i + 1}. ${a.question.trim()}`, "", a.answer.trim());
  });
  return out.join("\n");
}
