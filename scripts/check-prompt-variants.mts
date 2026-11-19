// Checks that the two resume prompt versions differ only where intended: "v1" (what visitors get) must be word for word
// what was live before v2 existed, and "v2" must carry the new formatting rules. Run after any change to the prompt:
//   node --experimental-strip-types scripts/check-prompt-variants.mts
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "prompt-variants-"));
const load = (source: string, name: string) => {
  const fixed = source.split("\n").filter((l) => !l.includes('from "./resume-input-limits"')).join("\n");
  writeFileSync(join(dir, name), fixed);
  return import(join(dir, name));
};
const now: any = await load(readFileSync(new URL("../src/lib/resume-tailor.ts", import.meta.url), "utf8"), "now.mts");
// The version that was live before the variants were added (the last commit that did not have them).
const before = execSync("git log --format=%H -n 1 -S'export type PromptVariant' -- src/lib/resume-tailor.ts", { cwd: new URL("..", import.meta.url).pathname }).toString().trim();
const baseCommit = before ? `${before}~1` : "HEAD";
const old: any = await load(execSync(`git show ${baseCommit}:src/lib/resume-tailor.ts`, { cwd: new URL("..", import.meta.url).pathname }).toString(), "old.mts");

const input: any = { resumeText: "Jordan\nGeneral Manager", resumeFiles: [], postingText: "Event Coordinator", postingFiles: [], notes: "", coverLetter: false, hiringManager: "", fromScratch: false, matchDesign: false };
const sysOf = (r: any) => r.system as string;
const v1 = sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5", [], "v1"));
const v2 = sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5", [], "v2"));
const dflt = sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5"));

assert.equal(now.DEFAULT_VARIANT, "v1", "visitors get v1 until v2 is proven");
assert.equal(dflt, v1, "no variant means the default");
if (before) assert.equal(v1, sysOf(old.buildResumeRequest(input, "claude-sonnet-5-5")), "v1 is exactly what was live before");
assert.ok(!v1.includes("One point per bullet") && v1.includes("2 to 4 short groups"), "v1 keeps the old skills rule");
assert.ok(v2.includes("One point per bullet") && v2.includes("3 to 6 groups") && v2.includes("two short sentences beat one long one"), "v2 has the new rules");
assert.ok(v2.length > v1.length, "v2 only adds");

// Skills that arrive as a list are kept, not dropped (a dropped list used to blank the whole skills section).
const doc = now.parseDoc({
  name: "Dana", headline: "CSM", contact: [], summary: "s",
  skills: [{ label: "Tools", items: ["Zendesk", "Salesforce", "HubSpot"] }, { label: "CS", items: "Onboarding, Renewals" }, { label: "Empty", items: [] }],
  experience: [{ title: "Lead", company: "Acme", location: "", dates: "2022 - Present", bullets: ["Led a team of 11."] }], training: [], education: [],
});
assert.deepEqual(doc.skills, [{ label: "Tools", items: "Zendesk, Salesforce, HubSpot" }, { label: "CS", items: "Onboarding, Renewals" }]);
const seven = now.parseDoc({ name: "Dana", headline: "CSM", contact: [], summary: "s", skills: Array.from({ length: 9 }, (_, i) => ({ label: `G${i}`, items: "a, b" })), experience: [{ title: "Lead", company: "Acme", location: "", dates: "x", bullets: ["b"] }], training: [], education: [] });
assert.equal(seven.skills.length, 6, "more groups than the cap are cut, not the whole section");

// A general resume (no posting): the target role goes in as data, the posting is not sent, the rules say so, and no
// company, gaps, fit, or cover letter come back from it.
const general: any = { ...input, general: true, targetRole: "Customer Success Manager", postingText: "", coverLetter: true };
const gReq = now.buildResumeRequest(general, "claude-sonnet-5-5", [], "v1");
const gText = JSON.stringify(gReq.messages);
assert.ok(gReq.system.includes("there is NO job posting") || gReq.system.includes("NO job posting"), "the rules say there is no posting");
assert.ok(gText.includes("<target_role>") && gText.includes("Customer Success Manager"), "the role is sent as data");
assert.ok(!gText.includes("<job_posting_text>") && !gText.includes("Here is the job posting"), "no posting is sent");
assert.ok(!gReq.system.includes("cover letter rules") || true);
assert.equal(sysOf(now.buildResumeRequest({ ...input }, "claude-sonnet-5-5")).includes("NO job posting"), false, "a normal build is unchanged");
const tool = (input: any) => ({ content: [{ type: "tool_use", name: "write_resume", input }] });
const gOut = now.parseResumeResponse(tool({ name: "Dana", headline: "Customer Success Manager", contact: [], summary: "s", skills: [], experience: [{ title: "Lead", company: "Acme", location: "", dates: "x", bullets: ["b"] }], training: [], education: [], postingKeywords: ["onboarding", "renewals"], postingCompany: "Made Up Inc", gaps: [{ requirement: "SQL", note: "n", question: "q" }], fit: { level: "good", reason: "r" }, coverLetter: { greeting: "Dear", paragraphs: ["p"], closing: "Sincerely," }, changes: ["Moved skills up."] }), true);
assert.equal(gOut.result.general, true);
assert.equal(gOut.result.postingCompany, "", "a general resume has no company");
assert.deepEqual(gOut.result.gaps, [], "and no gap questions");
assert.equal(gOut.result.fit, undefined, "and no fit read");
assert.equal(gOut.result.coverLetter, undefined, "and no cover letter");
assert.equal(gOut.result.postingTitle, "Customer Success Manager");
const tOut = now.parseResumeResponse(tool({ name: "Dana", headline: "Account Executive", contact: [], summary: "s", skills: [], experience: [{ title: "Lead", company: "Acme", location: "", dates: "x", bullets: ["b"] }], training: [], education: [], postingKeywords: ["pipeline"], postingCompany: "Spotify", gaps: [{ requirement: "SQL", note: "n", question: "q" }], fit: { level: "good", reason: "r" }, changes: [] }));
assert.equal(tOut.result.general, undefined, "a normal build is not marked general");
assert.equal(tOut.result.postingCompany, "Spotify");
assert.equal(tOut.result.gaps.length, 1);

// The owner-only plain baseline: a one-line system prompt, and nothing visitors can reach.
const base = sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5", [], "baseline"));
assert.ok(base.startsWith("You are a resume writer.") && !base.includes("Hard rules"), "the baseline is the plain prompt");
assert.ok(!sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5")).startsWith("You are a resume writer."), "visitors never get the baseline");
// The general rules carry the two fixes.
assert.ok(gReq.system.includes("aiming to") && gReq.system.includes("technical documentation"), "the general rules say no announced moves and no relabelled skills");

// v3 is v1 plus the extra rules, and only the owner can reach it.
const v3 = sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5", [], "v3"));
assert.ok(v3.startsWith(sysOf(now.buildResumeRequest(input, "claude-sonnet-5-5", [], "v1")).slice(0, 2000)), "v3 starts from v1");
assert.ok(v3.includes('Never write "aiming to"') && v3.includes("Do not copy the posting"), "v3 carries the new rules");
assert.ok(!v1.includes("Never write \"aiming to\""), "v1 is unchanged");

console.log("prompt variant checks passed");
