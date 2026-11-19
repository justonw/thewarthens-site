// "Change how it looks": layout choices for a finished resume that never change a single word. The person picks how the
// skills are written (commas, bars, or one per line), how the summary is shaped (a paragraph, short bullets, or its first
// two sentences), and the size (standard, or smaller to fit more on a page). They are applied when the files and the
// preview are drawn, so the resume's words, and the keywords in them, stay exactly as they were written (except that
// "first two sentences" drops the rest of the summary, which the screen says). Remembered in the browser for next time.
//
// This file stands on its own (type imports only) so a script can test it without a build.
import type { ResumeDoc } from "./resume-tailor";

export type SkillsLayout = "commas" | "bars" | "bullets";
export type SummaryLayout = "paragraph" | "bullets" | "short";
export type SizeLayout = "standard" | "smaller";
export type LookOptions = { skills: SkillsLayout; summary: SummaryLayout; size: SizeLayout };

export const DEFAULT_LOOK: LookOptions = { skills: "commas", summary: "paragraph", size: "standard" };
export const LOOK_KEY = "warthens-resume-look-v1";

export const isDefaultLook = (o: LookOptions) => o.skills === DEFAULT_LOOK.skills && o.summary === DEFAULT_LOOK.summary && o.size === DEFAULT_LOOK.size;

// Anything read back from storage is checked, so a damaged or old value falls back to the default for that choice.
export function cleanLook(raw: unknown): LookOptions {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    skills: o.skills === "bars" || o.skills === "bullets" ? o.skills : "commas",
    summary: o.summary === "bullets" || o.summary === "short" ? o.summary : "paragraph",
    size: o.size === "smaller" ? "smaller" : "standard",
  };
}

// The items of a skills group, split at the commas that separate them (not at commas inside parentheses).
export function splitItems(items: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of items) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    if ((ch === "," || ch === ";") && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

// Sentences, split after . ! or ? when a capital letter or digit follows. Common short forms are not sentence ends.
const NOT_END = /\b(?:U\.S|U\.K|e\.g|i\.e|vs|etc|Inc|Ltd|Co|Dr|Mr|Ms|Mrs|St|Jr|Sr|No)\.$/i;
export function splitSentences(text: string): string[] {
  const parts = text.trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/);
  const out: string[] = [];
  for (const p of parts) {
    if (out.length > 0 && NOT_END.test(out[out.length - 1])) out[out.length - 1] += ` ${p}`;
    else out.push(p);
  }
  return out.map((s) => s.trim()).filter(Boolean);
}

export type SummaryBlock = { bullets: boolean; lines: string[] };

export function summaryBlock(summary: string, o: LookOptions): SummaryBlock {
  const text = summary.trim();
  if (!text) return { bullets: false, lines: [] };
  if (o.summary === "paragraph") return { bullets: false, lines: [text] };
  const sentences = splitSentences(text);
  if (o.summary === "bullets") return { bullets: true, lines: sentences };
  // "short": the first two sentences, as one paragraph.
  return { bullets: false, lines: [sentences.slice(0, 2).join(" ")] };
}

// One skills group, ready to draw: either a single line of text, or a list of bullets under the group's name.
export type SkillBlock = { label: string; text: string; bullets: string[] };

export function skillBlocks(skills: ResumeDoc["skills"], o: LookOptions): SkillBlock[] {
  return skills.map((s) => {
    const items = splitItems(s.items);
    if (o.skills === "bullets" && items.length > 1) return { label: s.label, text: "", bullets: items };
    if (o.skills === "bars" && items.length > 1) return { label: s.label, text: items.join(" | "), bullets: [] };
    return { label: s.label, text: s.items, bullets: [] };
  });
}

// What "smaller" changes: tighter margins, type, and line spacing, so more fits on a page. The type stays readable.
export const SMALLER = { margin: 43, body: 9.5, lead: 12, hdGap: 17, docMargin: 864, docBody: 19 };

// The same resume as plain text, laid out the way the choices say.
export function lookToPlainLines(doc: ResumeDoc, o: LookOptions): { summary: string[]; skills: string[] } {
  const summary: string[] = [];
  const sb = summaryBlock(doc.summary, o);
  for (const l of sb.lines) summary.push(sb.bullets ? `- ${l}` : l);
  const skills: string[] = [];
  for (const b of skillBlocks(doc.skills, o)) {
    if (b.bullets.length > 0) {
      skills.push(b.label ? `${b.label}:` : "");
      for (const i of b.bullets) skills.push(`- ${i}`);
    } else skills.push(b.label ? `${b.label}: ${b.text}` : b.text);
  }
  return { summary, skills: skills.filter(Boolean) };
}
