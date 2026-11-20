// Plain-text files for the parts of the job search kit that had no download of their own (messages and application answers),
// and the small helpers the "Your files" panel shares with the rest of the result screen. Pure functions, so a script can test them.
import type { CoverLetter } from "./resume-tailor";
import type { PrepSheet } from "./interview";
import type { KitBlock, KitDocument } from "./kit-documents";
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

// The same content as real documents. These only describe the document (see kit-documents.ts, which draws the PDF and Word file).
export function kitFileName(kind: "interview-prep" | "messages" | "answers", slug: string, ext: "pdf" | "docx" | "txt") {
  return `${kind}-${slug}.${ext}`;
}

export function sheetToDocument(sheet: PrepSheet, jobLine: string): KitDocument {
  const blocks: KitBlock[] = [{ kind: "heading", text: "Your 60-second opening" }, { kind: "para", text: sheet.opening }, { kind: "heading", text: "Likely questions" }];
  sheet.questions.forEach((q, i) => {
    blocks.push({ kind: "question", n: i + 1, text: q.question });
    if (q.why) blocks.push({ kind: "label", label: "Why they ask", text: q.why });
    if (q.approach) blocks.push({ kind: "label", label: "How to answer", text: q.approach });
    if (q.points.length) {
      blocks.push({ kind: "label", label: "Facts from your history to use", text: "" });
      blocks.push({ kind: "bullets", items: q.points });
    }
    if (q.storyAsk) blocks.push({ kind: "label", label: "Your real example", text: q.storyAsk });
    if (q.deep) {
      if (q.deep.example) blocks.push({ kind: "label", label: "What you told us", text: q.deep.example });
      if (q.deep.draft) blocks.push({ kind: "label", label: "Your first answer", text: q.deep.draft });
      if (q.deep.strong.length) {
        blocks.push({ kind: "label", label: "What makes a strong answer", text: "" });
        blocks.push({ kind: "bullets", items: q.deep.strong });
      }
      if (q.deep.avoid.length) {
        blocks.push({ kind: "label", label: "Watch out for", text: "" });
        blocks.push({ kind: "bullets", items: q.deep.avoid });
      }
      if (q.deep.followUps.length) {
        blocks.push({ kind: "label", label: "They might ask next", text: "" });
        blocks.push({ kind: "bullets", items: q.deep.followUps.map((f) => (f.hint ? `${f.q} (${f.hint})` : f.q)) });
      }
    }
  });
  if (sheet.askThem.length) blocks.push({ kind: "heading", text: "Questions to ask them" }, { kind: "bullets", items: sheet.askThem });
  if (sheet.remember.length) blocks.push({ kind: "heading", text: "Remember" }, { kind: "bullets", items: sheet.remember });
  return { title: "Interview prep", subtitle: jobLine, blocks };
}

export function messagesToDocument(messages: SavedMessage[], jobLine: string): KitDocument {
  const blocks: KitBlock[] = [];
  messages.forEach((m, i) => {
    blocks.push({ kind: "heading", text: `${i + 1}. To ${m.who.trim() || WHO[m.audience] || "a contact"}` });
    if (m.subject.trim()) blocks.push({ kind: "label", label: "Subject", text: m.subject.trim() });
    blocks.push({ kind: "para", text: m.message.trim() });
    if (m.note.trim()) blocks.push({ kind: "label", label: "Short version for a connection request", text: m.note.trim() });
  });
  return { title: "Messages", subtitle: jobLine, blocks };
}

export function answersToDocument(answers: SavedAnswer[], jobLine: string): KitDocument {
  const blocks: KitBlock[] = [];
  answers.forEach((a, i) => {
    blocks.push({ kind: "question", n: i + 1, text: a.question.trim() }, { kind: "para", text: a.answer.trim() });
  });
  return { title: "Application answers", subtitle: jobLine, blocks };
}
