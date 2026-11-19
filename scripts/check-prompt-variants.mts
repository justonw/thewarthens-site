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
console.log("prompt variant checks passed");
