// The "ATS check" shown after a resume is built. It is computed here, by plain code, from the
// finished resume and the posting's own keywords: the AI does not grade its own work. Each row
// mirrors an item on the Tech Journey resume checklist.
import type { ResumeDoc } from "./resume-tailor";
import { resumeToPlainText } from "./resume-files";

export type AtsStatus = "pass" | "flag";
export type AtsRow = { id: string; label: string; status: AtsStatus; detail: string };
export type AtsReport = { rows: AtsRow[]; found: string[]; missing: string[] };

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+#./ ]+/g, " ").replace(/\s+/g, " ").trim();
}

export function runAtsCheck(doc: ResumeDoc, postingTitle: string, keywords: string[]): AtsReport {
  const haystack = ` ${norm(resumeToPlainText(doc))} `;
  const has = (needle: string) => {
    const n = norm(needle);
    return n.length > 0 && haystack.includes(n);
  };

  const found = keywords.filter(has);
  const missing = keywords.filter((k) => !has(k));
  const rows: AtsRow[] = [];

  const titleOk = postingTitle ? has(postingTitle) : false;
  rows.push({
    id: "title",
    label: "Exact job title from the posting",
    status: titleOk ? "pass" : "flag",
    detail: titleOk ? `"${postingTitle}" is under your name.` : "Edit the line under your name to match the posting's job title exactly.",
  });

  const ratio = keywords.length ? found.length / keywords.length : 1;
  rows.push({
    id: "keywords",
    label: "Language from the posting",
    status: ratio >= 0.6 ? "pass" : "flag",
    detail: keywords.length
      ? `${found.length} of ${keywords.length} key terms from the posting appear in your resume.`
      : "No key terms were found in the posting.",
  });

  rows.push({
    id: "format",
    label: "Simple formatting",
    status: "pass",
    detail: "One column, standard font, no tables, icons, or graphics.",
  });
  rows.push({
    id: "skills",
    label: "Skills near the top",
    status: doc.skills.length ? "pass" : "flag",
    detail: doc.skills.length ? "Your skills sit right under the summary." : "Add a skills section so it can sit under the summary.",
  });
  rows.push({
    id: "order",
    label: "Reverse-chronological experience",
    status: "pass",
    detail: "Jobs are listed newest first, with skills above them (a combination format).",
  });

  const email = doc.contact.some((c) => /@/.test(c));
  const phone = doc.contact.some((c) => /\d{3}\D*\d{3}\D*\d{4}/.test(c));
  rows.push({
    id: "contact",
    label: "Contact details",
    status: email && phone ? "pass" : "flag",
    detail: email && phone ? "Email and phone are both there." : `Add your ${!email ? "email" : "phone number"} to the contact line.`,
  });

  const undated = doc.experience.filter((j) => !j.dates).length;
  rows.push({
    id: "dates",
    label: "Dates on every job",
    status: undated === 0 ? "pass" : "flag",
    detail: undated === 0 ? "Every job has dates." : `${undated} job${undated === 1 ? " is" : "s are"} missing dates. Add them so a scanner can read your timeline.`,
  });

  return { rows, found, missing };
}

// How many of the posting's key terms a piece of text contains. Used for the before-and-after view, so the
// numbers shown are real counts for the person's original resume and the tailored one.
export function keywordCoverage(text: string, keywords: string[]): { found: string[]; missing: string[] } {
  const haystack = ` ${norm(text)} `;
  const found: string[] = [];
  const missing: string[] = [];
  for (const k of keywords) {
    const n = norm(k);
    if (n && haystack.includes(n)) found.push(k);
    else missing.push(k);
  }
  return { found, missing };
}
