// Checks "My applications": a build is saved and opens again the same, the list keeps real applications longest when it
// is full and never drops the newest build, whatever comes from a downloaded file is checked entry by entry, and
// "Today"/"Yesterday" read right. Run after any change to src/lib/resume-library.ts:
//   node --experimental-strip-types scripts/check-resume-library.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The library imports the resume tailor without a file extension, which Node cannot resolve, so both files are copied
// to a temporary folder with the imports fixed.
const dir = mkdtempSync(join(tmpdir(), "resume-library-"));
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-tailor.mts"), read("../src/lib/resume-tailor.ts").split("\n").filter((l) => !l.includes('from "./resume-input-limits"')).join("\n"));
writeFileSync(join(dir, "resume-library.mts"), read("../src/lib/resume-library.ts").replace('from "./resume-tailor";\nimport type', 'from "./resume-tailor.mts";\nimport type').replace('import type { CoverLetter, ResumeDesign, ResumeDoc, ResumeFit, ResumeGap, TailorResult } from "./resume-tailor";', 'import type { CoverLetter, ResumeDesign, ResumeDoc, ResumeFit, ResumeGap, TailorResult } from "./resume-tailor.mts";'));
const lib: any = await import(join(dir, "resume-library.mts"));

const doc: any = {
  name: "Jordan Rivera", headline: "Account Executive", contact: ["Atlanta, GA", "jordan@example.com"], summary: "Restaurant GM.",
  skills: [{ label: "Tools", items: "HubSpot" }], training: [], education: [],
  experience: [{ title: "General Manager", company: "Harbor Table", location: "", dates: "2021 - Present", bullets: ["Follow up on catering leads within 24 hours.", ""] }],
};
const result: any = {
  resume: doc, postingTitle: "Account Executive", postingCompany: "Spotify Technology", postingKeywords: ["pipeline", "HubSpot"],
  gaps: [{ requirement: "Salesforce", note: "Add only if true.", question: "Did you use a CRM?", kind: "missing" }], fit: { level: "good", reason: "Solid on follow-up." }, changes: ["Moved skills up."],
};
const letter = { greeting: "Dear Hiring Team,", paragraphs: ["I follow up fast."], closing: "Sincerely," };

// A build is saved and opens again the same.
const entry = lib.entryFromResult("a1", result, letter, new Date("2026-11-18T15:00:00Z"));
const back = lib.entryToResult(entry);
assert.equal(back.postingTitle, "Account Executive");
assert.equal(back.postingCompany, "Spotify Technology");
assert.deepEqual(back.coverLetter, letter);
assert.equal(back.gaps.length, 1);
assert.equal(entry.status, "built");
assert.equal(entry.style, "classic", "no design means the classic template");

// The list: newest first, updates in place, and never loses the newest build.
let list: any[] = [];
list = lib.upsertEntry(list, entry);
list = lib.upsertEntry(list, lib.entryFromResult("a2", { ...result, postingTitle: "Sales Rep" }, null));
assert.deepEqual(list.map((e) => e.id), ["a2", "a1"]);
list = lib.upsertEntry(list, { ...list[1], status: "applied", appliedAt: "2026-11-19T00:00:00.000Z" });
assert.deepEqual(list.map((e) => e.id), ["a2", "a1"], "an update keeps its place");
assert.equal(list[1].status, "applied");

let full: any[] = [];
for (let i = 0; i < lib.MAX_LIBRARY; i++) full = lib.upsertEntry(full, { ...lib.entryFromResult(`b${i}`, result, null), status: "applied" });
full = lib.upsertEntry(full, lib.entryFromResult("newest", result, null));
assert.equal(full.length, lib.MAX_LIBRARY);
assert.equal(full[0].id, "newest", "the newest build is never the one dropped, even when every other one is applied");
let mixed: any[] = [];
for (let i = 0; i < lib.MAX_LIBRARY; i++) mixed = lib.upsertEntry(mixed, { ...lib.entryFromResult(`c${i}`, result, null), status: i === 0 ? "applied" : "built" });
mixed = lib.upsertEntry(mixed, lib.entryFromResult("next", result, null));
assert.equal(mixed.length, lib.MAX_LIBRARY);
assert.ok(mixed.some((e) => e.id === "c0" && e.status === "applied"), "an applied job outlasts builds that were only tried");
assert.ok(!mixed.some((e) => e.id === "c1"), "the oldest build that was never applied to goes first");

// Labels.
const now = new Date("2026-11-18T12:00:00");
assert.equal(lib.whenLabel(new Date("2026-11-18T08:00:00").toISOString(), now), "Today");
assert.equal(lib.whenLabel(new Date("2026-11-17T23:00:00").toISOString(), now), "Yesterday");
assert.match(lib.whenLabel(new Date("2026-11-10T12:00:00").toISOString(), now), /Nov 10/);
assert.equal(lib.whenLabel("not a date", now), "");

// Follow-up nudges: only an applied job, after enough days, and only once.
const applied = { ...entry, status: "applied", appliedAt: "2026-11-12T10:00:00.000Z" };
const asOf = new Date("2026-11-18T12:00:00.000Z");
assert.deepEqual(lib.followUpDue(applied, asOf), { due: true, days: 6 });
assert.equal(lib.followUpDue({ ...applied, appliedAt: "2026-11-16T10:00:00.000Z" }, asOf).due, false, "too soon");
assert.equal(lib.followUpDue({ ...applied, followedUpAt: "2026-11-17T10:00:00.000Z" }, asOf).due, false, "already followed up");
assert.equal(lib.followUpDue({ ...entry, status: "built" }, asOf).due, false, "not applied yet");
const kept = lib.cleanLibrary([{ ...JSON.parse(JSON.stringify(applied)), followedUpAt: "2026-11-17T10:00:00.000Z", messages: [{ id: "f1", audience: "friend", purpose: "followup", message: "A message that is long enough." }] }, { ...JSON.parse(JSON.stringify(entry)), id: "z9", followedUpAt: "garbage" }]);
assert.ok(kept[0].followedUpAt.startsWith("2026-11-17") && kept[0].messages[0].purpose === "followup" && kept[0].messages[0].audience === "friend");
assert.equal(kept[1].followedUpAt, "", "a bad follow-up date is dropped");

// Drafted answers are kept per job, checked on the way in, and capped.
const withAnswers = lib.cleanLibrary([{ ...JSON.parse(JSON.stringify(entry)), answers: [
  { id: "a1", at: "2026-11-18T10:00:00Z", question: "Why do you want to work here?", answer: "I follow up on every lead within 24 hours, which suits this role." },
  { id: "a2", question: "", answer: "A question is required for an answer to be kept." },
  { id: "a3", question: "Short?", answer: "too short" },
  ...Array.from({ length: 20 }, (_, i) => ({ id: `x${i}`, question: `Question ${i}?`, answer: "A long enough answer to be kept in the list." })),
] }]);
assert.equal(withAnswers[0].answers[0].id, "a1");
assert.ok(!withAnswers[0].answers.some((a: any) => a.id === "a2" || a.id === "a3"), "an answer with no question, or a stub, is dropped");
assert.ok(withAnswers[0].answers.length <= lib.MAX_ANSWERS_PER_ENTRY, "answers are capped");
assert.deepEqual(lib.entryFromResult("n1", result, null).answers, [], "a new build starts with no answers");

// A reply stops the follow-up nudge, and results are checked on the way in.
assert.equal(lib.followUpDue({ ...applied, result: "interview" }, asOf).due, false, "a reply means no follow-up is needed");
const withResult = lib.cleanLibrary([
  { ...JSON.parse(JSON.stringify(applied)), result: "interview", resultAt: "2026-11-16T10:00:00.000Z" },
  { ...JSON.parse(JSON.stringify(entry)), id: "r2", result: "interview" },
  { ...JSON.parse(JSON.stringify(applied)), id: "r3", result: "hired!" },
]);
assert.equal(withResult[0].result, "interview");
assert.ok(withResult[0].resultAt.startsWith("2026-11-16"));
assert.equal(withResult[1].result, "", "a job that was never applied to has no result");
assert.equal(withResult[2].result, "", "an unknown stage is dropped");
assert.equal(lib.entryFromResult("n2", result, null).result, "", "a new build starts out waiting");

// Matching a job in the tracker ignores case and spaces.
assert.ok(lib.sameJob({ company: " Spotify ", role: "account executive" }, { company: "spotify", role: "Account Executive " }));
assert.ok(!lib.sameJob({ company: "Spotify", role: "Account Executive" }, { company: "Spotify", role: "Sales Rep" }));

// Blank lines are dropped before a download.
const cleaned = lib.cleanDoc(doc);
assert.deepEqual(cleaned.experience[0].bullets, ["Follow up on catering leads within 24 hours."]);

// A file from outside: good entries pass, bad ones are dropped, nothing is trusted.
const goodFile = JSON.parse(JSON.stringify({ ...entry, messages: [{ id: "m1", at: "2026-11-18T10:00:00Z", audience: "manager", who: "Sam Lee, Head of Support", subject: "Hello", note: "A note that is long enough.", message: "Hi Sam, a message." }] }));
const hostile: any[] = [
  goodFile,
  { ...goodFile }, // same id twice
  { ...goodFile, id: "x2", doc: "not a resume" },
  { ...goodFile, id: "x3", doc: { ...doc, name: "Eve — <script>alert(1)</script>" }, style: "evil", status: "applied", messages: Array.from({ length: 9 }, (_, i) => ({ id: `m${i}`, audience: "manager", message: "a message", who: "", subject: "", note: "" })) },
  { ...goodFile, id: "x4", messages: [{ id: "bad", audience: "ceo", message: "x" }] },
  null,
  "text",
];
const cleanedList = lib.cleanLibrary(hostile);
assert.deepEqual(cleanedList.map((e: any) => e.id), ["a1", "x3", "x4"]);
assert.equal(cleanedList[0].messages.length, 1);
assert.equal(cleanedList[1].style, "classic", "an unknown template falls back to classic");
assert.equal(cleanedList[1].messages.length, lib.MAX_MESSAGES_PER_ENTRY, "messages are capped");
assert.equal(cleanedList[1].status, "applied");
assert.ok(cleanedList[1].appliedAt, "an applied entry always has a date");
assert.ok(!cleanedList[1].doc.name.includes("—"), "dashes are cleaned");
assert.equal(cleanedList[2].messages.length, 0, "a message with an unknown audience is dropped");
assert.deepEqual(lib.cleanLibrary("nope"), []);
assert.equal(lib.cleanLibrary(Array.from({ length: 200 }, (_, i) => ({ ...goodFile, id: `n${i}` }))).length, lib.MAX_LIBRARY);

console.log("library checks passed");
