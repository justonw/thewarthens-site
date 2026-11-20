// Checks the field counts (src/lib/field-counts.ts): a build is counted under the right kind of job, a title with no lens is counted
// by a plain slug, and the report adds the days up. Run after any change to it:
//   node --experimental-strip-types scripts/check-field-counts.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "field-counts-"));
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-limits.mts"), read("../src/lib/resume-limits.ts"));
writeFileSync(join(dir, "interview-lenses.mts"), read("../src/lib/interview-lenses.ts"));
writeFileSync(join(dir, "field-counts.mts"), read("../src/lib/field-counts.ts").replace('from "./resume-limits"', 'from "./resume-limits.mts"').replace('from "./interview-lenses"', 'from "./interview-lenses.mts"'));
const { countField, fieldReport, titleSlug } = (await import(join(dir, "field-counts.mts"))) as any;
const { memoryKv } = (await import(join(dir, "resume-limits.mts"))) as any;

const kv = memoryKv();
const day1 = new Date("2026-11-18T12:00:00Z");
const day2 = new Date("2026-11-19T12:00:00Z");

assert.equal(await countField(kv, "Registered Nurse - Med Surg", [], false, day1), "nursing-clinical");
assert.equal(await countField(kv, "Account Executive", ["quota"], false, day1), "sales");
assert.equal(await countField(kv, "Teacher", [], true, day2), "teaching-education", "a general resume is counted under its field");
assert.equal(await countField(kv, "Dental Hygienist (Part-time)", [], false, day1), "none");
assert.equal(await countField(kv, "Dental Hygienist", [], false, day2), "none");
assert.equal(await countField(kv, "", [], false, day2), "none", "no title is counted as none and adds no title");

const rep = await fieldReport(kv, 3, day2);
assert.equal(rep.builds, 6);
assert.equal(rep.general, 1);
assert.equal(rep.fields.find((f) => f.id === "nursing-clinical")?.n, 1);
assert.equal(rep.fields.find((f) => f.id === "none")?.n, 3);
assert.deepEqual(rep.nolens, [{ title: "dental hygienist", n: 2 }], "titles are added up across days, and carry nothing personal");
assert.equal((await fieldReport(kv, 1, day2)).builds, 3, "only the last day when asked for one");

assert.equal(titleSlug("Sr. Dental Assistant (Remote)!"), "sr-dental-assistant");
assert.equal(titleSlug("  "), "");
assert.ok(titleSlug("A very long job title with many many words indeed").split("-").length <= 5);
console.log("field count checks passed");
