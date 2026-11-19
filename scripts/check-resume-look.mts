// Checks "Change how it looks": the layout choices change the shape of the skills and summary, the size, and nothing else.
// Every word of a resume survives every choice except "first 2 sentences" (which drops the rest, by design). The PDF and
// Word files are built for real and read back. Run after any change to src/lib/resume-look.ts or resume-files.ts:
//   node --experimental-strip-types scripts/check-resume-look.mts
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DEFAULT_LOOK, cleanLook, isDefaultLook, lookToPlainLines, skillBlocks, splitItems, splitSentences, summaryBlock } from "../src/lib/resume-look.ts";

// ---------- the pure rules ----------
assert.deepEqual(cleanLook(null), DEFAULT_LOOK);
assert.deepEqual(cleanLook({ skills: "evil", summary: 7, size: "huge" }), DEFAULT_LOOK, "unknown values fall back to the default");
assert.deepEqual(cleanLook({ skills: "bars", summary: "short", size: "smaller" }), { skills: "bars", summary: "short", size: "smaller" });
assert.ok(isDefaultLook(DEFAULT_LOOK) && !isDefaultLook({ ...DEFAULT_LOOK, size: "smaller" }));

assert.deepEqual(splitItems("Zendesk, Salesforce,HubSpot"), ["Zendesk", "Salesforce", "HubSpot"]);
assert.deepEqual(splitItems("Salesforce (CRM, reporting), Excel; SQL basics,"), ["Salesforce (CRM, reporting)", "Excel", "SQL basics"], "commas inside parentheses stay");
assert.deepEqual(splitItems("   "), []);

assert.deepEqual(splitSentences("Led a team of 11. Cut onboarding from 21 days to 13. Based in the U.S. and open to remote work."), ["Led a team of 11.", "Cut onboarding from 21 days to 13.", "Based in the U.S. and open to remote work."], "a short form is not a sentence end");
assert.deepEqual(splitSentences("One sentence only."), ["One sentence only."]);

const summary = "Support lead with 8 years in software support. Cut time to first sale from 21 days to 13. Leads a team of 11. Reports churn risks to the account team.";
assert.deepEqual(summaryBlock(summary, DEFAULT_LOOK), { bullets: false, lines: [summary] });
assert.equal(summaryBlock(summary, { ...DEFAULT_LOOK, summary: "bullets" }).lines.length, 4);
assert.equal(summaryBlock(summary, { ...DEFAULT_LOOK, summary: "bullets" }).bullets, true);
assert.deepEqual(summaryBlock(summary, { ...DEFAULT_LOOK, summary: "short" }), { bullets: false, lines: ["Support lead with 8 years in software support. Cut time to first sale from 21 days to 13."] });
assert.deepEqual(summaryBlock("", { ...DEFAULT_LOOK, summary: "bullets" }), { bullets: false, lines: [] });

const skills = [{ label: "Platforms", items: "Zendesk, Intercom, Salesforce" }, { label: "Data", items: "Looker" }, { label: "", items: "Notion, Slack" }];
assert.deepEqual(skillBlocks(skills, DEFAULT_LOOK).map((b) => b.text), ["Zendesk, Intercom, Salesforce", "Looker", "Notion, Slack"], "commas are the words as written");
assert.equal(skillBlocks(skills, { ...DEFAULT_LOOK, skills: "bars" })[0].text, "Zendesk | Intercom | Salesforce");
assert.equal(skillBlocks(skills, { ...DEFAULT_LOOK, skills: "bars" })[1].text, "Looker", "one item has nothing to separate");
assert.deepEqual(skillBlocks(skills, { ...DEFAULT_LOOK, skills: "bullets" })[0].bullets, ["Zendesk", "Intercom", "Salesforce"]);
assert.deepEqual(skillBlocks(skills, { ...DEFAULT_LOOK, skills: "bullets" })[1].bullets, [], "a one-item group stays a line");

// The words never change, whatever the choice (except "short", which drops sentences on purpose).
const doc: any = { name: "Dana", headline: "CSM", contact: [], summary, skills, experience: [], training: [], education: [] };
const words = (lines: string[]) => lines.join(" ").replace(/[|\-:,;]/g, " ").split(/\s+/).filter(Boolean).sort().join(" ");
const base = lookToPlainLines(doc, DEFAULT_LOOK);
for (const sk of ["commas", "bars", "bullets"] as const)
  for (const sm of ["paragraph", "bullets"] as const) {
    const out = lookToPlainLines(doc, { skills: sk, summary: sm, size: "standard" });
    assert.equal(words(out.skills), words(base.skills), `skills words unchanged (${sk})`);
    assert.equal(words(out.summary), words(base.summary), `summary words unchanged (${sm})`);
  }
const bulletLines = lookToPlainLines(doc, { skills: "bullets", summary: "bullets", size: "standard" });
assert.ok(bulletLines.skills.includes("- Zendesk") && bulletLines.skills.includes("Platforms:"));
assert.ok(bulletLines.summary.every((l) => l.startsWith("- ")));

// ---------- the real files ----------
const dir = mkdtempSync(join(tmpdir(), "resume-look-"));
// The copies need the same packages (pdf-lib, docx) as the app, so they borrow its node_modules.
symlinkSync(new URL("../node_modules", import.meta.url).pathname, join(dir, "node_modules"));
const src = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-look.mts"), src("../src/lib/resume-look.ts"));
writeFileSync(join(dir, "resume-files.mts"), src("../src/lib/resume-files.ts").replace('from "./resume-look";', 'from "./resume-look.mts";'));
const files: any = await import(join(dir, "resume-files.mts"));
const full: any = {
  ...doc,
  contact: ["Columbus, OH", "dana@example.com"],
  experience: [{ title: "Support Team Lead", company: "Brightcart", location: "", dates: "2022 - Present", bullets: ["Led 11 agents.", "Wrote 60 help center articles."] }],
  skills: [{ label: "Platforms", items: "Zendesk, Intercom, Salesforce, HubSpot, Jira" }, { label: "Data", items: "Looker, Excel, SQL basics" }],
};
const pages = (bytes: Uint8Array) => (Buffer.from(bytes).toString("latin1").match(/\/Type\s*\/Page\b/g) ?? []).length;

const pdfOf = async (look: any) => Buffer.from(await files.buildPdf(full, "classic", undefined, look));
const havePdftotext = spawnSync("pdftotext", ["-v"]).error === undefined;
if (havePdftotext) {
  const text = async (look: any) => {
    const f = join(dir, `t-${Math.random().toString(36).slice(2)}.pdf`);
    writeFileSync(f, await pdfOf(look));
    return execFileSync("pdftotext", ["-layout", f, "-"]).toString();
  };
  const plain = await text(DEFAULT_LOOK);
  assert.ok(plain.includes("Zendesk, Intercom, Salesforce, HubSpot, Jira"), "default PDF keeps the commas");
  const bars = await text({ ...DEFAULT_LOOK, skills: "bars" });
  assert.ok(bars.includes("Zendesk | Intercom | Salesforce | HubSpot | Jira") && !bars.includes("Zendesk, Intercom"), "bars in the PDF");
  const bullets = await text({ ...DEFAULT_LOOK, skills: "bullets", summary: "bullets" });
  assert.ok(/•\s+Zendesk/.test(bullets) && /•\s+Support lead with 8 years/.test(bullets), "one bullet per skill and per summary sentence in the PDF");
  const short = await text({ ...DEFAULT_LOOK, summary: "short" });
  assert.ok(short.includes("Cut time to first sale") && !short.includes("Reports churn risks"), "first two sentences only");
  assert.ok((await text({ ...DEFAULT_LOOK, size: "smaller" })).includes("Led 11 agents"), "smaller still has every word");
} else console.log("(pdftotext is not installed here, so the PDF text was not read back)");

// A page count only goes down with "smaller" and up with one-per-line skills.
const normal = pages(await pdfOf(DEFAULT_LOOK));
assert.ok(pages(await pdfOf({ ...DEFAULT_LOOK, size: "smaller" })) <= normal);
assert.ok(pages(await pdfOf({ ...DEFAULT_LOOK, skills: "bullets", summary: "bullets" })) >= normal);

// Word: build each choice and read the words back out of the document.
const haveUnzip = spawnSync("unzip", ["-v"]).error === undefined;
const docxText = async (look: any) => {
  const f = join(dir, `d-${Math.random().toString(36).slice(2)}.docx`);
  writeFileSync(f, Buffer.from(await (await files.buildDocx(full, "classic", undefined, look)).arrayBuffer()));
  return execFileSync("unzip", ["-p", f, "word/document.xml"]).toString().replace(/<w:tab\/>/g, " ").replace(/<\/w:p>/g, "\n").replace(/<[^>]+>/g, "");
};
if (haveUnzip) {
  assert.ok((await docxText(DEFAULT_LOOK)).includes("Zendesk, Intercom, Salesforce, HubSpot, Jira"));
  assert.ok((await docxText({ ...DEFAULT_LOOK, skills: "bars" })).includes("Zendesk | Intercom | Salesforce | HubSpot | Jira"));
  const b = await docxText({ ...DEFAULT_LOOK, skills: "bullets", summary: "bullets" });
  assert.ok(b.split("\n").some((l) => l.trim() === "Zendesk") && b.split("\n").some((l) => l.trim() === "Platforms:"), "one skill per paragraph in Word");
  assert.ok(!(await docxText({ ...DEFAULT_LOOK, summary: "short" })).includes("Reports churn risks"));
} else console.log("(unzip is not installed here, so the Word text was not read back)");

// The scanner's plain-text view follows the choices.
assert.ok(files.resumeToPlainText(full, { ...DEFAULT_LOOK, skills: "bars" }).includes("Zendesk | Intercom"));
assert.ok(files.resumeToPlainText(full).includes("Zendesk, Intercom"), "no choice means the words as written");

console.log("look checks passed");
