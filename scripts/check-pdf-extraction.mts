// Checks that the downloadable PDFs survive text extraction, which is what hiring software does first.
// Builds each saved result in every template, extracts the text the way a parser would (pdftotext), and flags:
//   - words glued together at a style change (for example "Tools:Excel"), which can hide a keyword
//   - a job's title and company that do not read as "Title, Company"
// Run it after ANY change to the PDF layout (src/lib/resume-files.ts):
//   node --experimental-strip-types scripts/check-pdf-extraction.mts resume-evals/*/run-*.json
// Needs poppler (pdftotext). The input files are results saved by scripts/resume-eval.py.
import { buildPdf } from "../src/lib/resume-files.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Pass one or more saved result .json files.");
  process.exit(1);
}

let bad = 0;
let total = 0;
for (const f of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(f, "utf8"));
  } catch {
    continue;
  }
  const doc = (data.result ?? data).resume;
  if (!doc?.experience) continue;
  for (const style of ["classic", "modern", "compact", "traditional"] as const) {
    writeFileSync("/tmp/extraction-check.pdf", await buildPdf(doc, style));
    const text = execFileSync("pdftotext", ["-raw", "/tmp/extraction-check.pdf", "-"]).toString();
    total++;
    const glued = text.split("\n").filter((l) => /\b[A-Za-z][A-Za-z ]{1,25}:[A-Za-z0-9]/.test(l) && !/https?:|linkedin|:\d{2}\b/.test(l));
    const flat = text.replace(/\n/g, " ");
    const broken = doc.experience.filter((j: { title?: string; company?: string }) => j.title && j.company && !flat.includes(`${j.title}, ${j.company}`));
    if (glued.length || broken.length) {
      bad++;
      console.log("PROBLEM", f, style, glued.slice(0, 2), broken.map((j: { title: string }) => j.title).slice(0, 2));
    }
  }
}
console.log(`checked ${total} builds, ${bad} with problems`);
process.exit(bad ? 1 : 0);
