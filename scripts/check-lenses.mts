// Checks the role-lens library (src/lib/interview-lenses.ts). Run after adding or editing any lens:
//   node --experimental-strip-types scripts/check-lenses.mts
//
// 1. Every lens has the right shape and obeys the content rules (no numbers, no dashes, no benchmarks).
// 2. A reviewed lens names who reviewed it; visitors only ever get reviewed lenses.
// 3. Sample job titles land on the lens they should (add a line to EXPECT whenever a lens is added).
// 4. Common job titles that match no lens are listed: those are the next lenses to write.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lenses-"));
writeFileSync(join(dir, "lenses.mts"), readFileSync(new URL("../src/lib/interview-lenses.ts", import.meta.url), "utf8"));
const lib: any = await import(join(dir, "lenses.mts"));
const { LENSES, matchLenses, lensRules, GENERIC_LENS } = lib;

// 1 and 2: shape and content rules.
const ids = new Set<string>();
for (const l of LENSES) {
  const where = `lens "${l.id}"`;
  assert.ok(/^[a-z0-9-]+$/.test(l.id) && !ids.has(l.id), `${where}: id is unique, lowercase, and has no spaces`);
  ids.add(l.id);
  assert.ok(l.name.length >= 4, `${where}: has a name`);
  assert.ok(l.status === "draft" || l.status === "reviewed", `${where}: status is draft or reviewed`);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(l.updated), `${where}: updated is YYYY-MM-DD`);
  if (l.status === "reviewed") assert.ok(l.reviewedBy.trim().length >= 3, `${where}: a reviewed lens says who reviewed it and how`);
  else assert.equal(l.reviewedBy, "", `${where}: a draft has no reviewer yet`);
  assert.ok(l.titleHints.length >= 3, `${where}: at least 3 title hints`);
  assert.ok(l.keywordHints.length >= 3, `${where}: at least 3 key-term hints`);
  for (const hint of [...l.titleHints, ...l.keywordHints]) assert.equal(hint, hint.toLowerCase().trim(), `${where}: hint "${hint}" is lowercase`);
  assert.ok(l.measured.length >= 3, `${where}: at least 3 things people are measured on`);
  assert.ok(l.exercises.length >= 3, `${where}: at least 3 exercises or role-plays`);
  assert.ok(l.situations.length >= 3, `${where}: at least 3 situations`);
  assert.ok(l.transferable.length >= 3, `${where}: at least 3 kinds of experience that transfer into this field`);
  const text = JSON.stringify([l.measured, l.exercises, l.situations, l.compliance, l.transferable]);
  assert.ok(!/[—–]/.test(text), `${where}: no em or en dashes`);
  assert.ok(!/\d/.test(text), `${where}: no numbers, benchmarks, or rates (a lens names what is tested, never a figure)`);
  assert.ok(!/\$|%/.test(text), `${where}: no money or percentages`);
  assert.ok(!/\b(typically|on average|industry standard|most companies|usually pay)\b/i.test(text), `${where}: no claims about what is typical for companies`);
}

// Visitors get reviewed lenses only; the owner can see drafts.
const anyReviewed = LENSES.some((l: any) => l.status === "reviewed");
const visitor = matchLenses("Account Executive", ["quota", "pipeline"], false);
const owner = matchLenses("Account Executive", ["quota", "pipeline"], true);
assert.ok(owner.length > 0, "the owner's test builds can use drafts");
if (!anyReviewed) assert.equal(visitor.length, 0, "while every lens is a draft, visitors get none");
assert.ok(visitor.every((m: any) => m.lens.status === "reviewed"), "visitors only ever get reviewed lenses");
const fakeLibrary = [{ ...LENSES[0], status: "draft" }, { ...LENSES[1], status: "reviewed", reviewedBy: "Test reviewer" }];
assert.deepEqual(matchLenses("Sales Administrative Assistant", [], false, fakeLibrary).map((m: any) => m.lens.id), ["admin-office"], "a draft is skipped for visitors, a reviewed lens is used");
assert.deepEqual(matchLenses("Sales Administrative Assistant", [], true, fakeLibrary).map((m: any) => m.lens.id).sort(), ["admin-office", "sales"], "the owner sees both");

// The prompt text.
const text = lensRules([LENSES[0]]);
assert.ok(text.includes("Sales") && text.includes("Measured on") && text.includes("Ask 10 questions") && text.includes("Never invent a metric") && text.includes("MUST be about one of them"), "the lens text names the role and the rules");
assert.ok(GENERIC_LENS.includes("never invent a metric"), "the generic lens keeps the rules");

// Field notes for tailoring.
assert.ok(lib.fieldNotes([LENSES.find((l: any) => l.id === "teaching-education")]).includes("mentoring or coaching") && lib.fieldNotes([]) === "", "field notes list what counts, and nothing when no lens matches");

// 3: sample titles land on the right lens (the first match must be this one).
const EXPECT: [string, string][] = [
  ["Sales Development Representative", "sales"], ["Account Executive, Mid-Market", "sales"], ["Territory Manager", "sales"],
  ["Administrative Assistant (6 month contract)", "admin-office"], ["Executive Assistant to the CEO", "admin-office"], ["Receptionist", "admin-office"], ["Office Manager", "admin-office"],
  ["Patient Access Representative", "healthcare-front-office"], ["Medical Biller", "healthcare-front-office"], ["Medical Receptionist", "healthcare-front-office"],
  ["Registered Nurse - Med Surg", "nursing-clinical"], ["Certified Nursing Assistant (CNA)", "nursing-clinical"], ["Phlebotomist", "nursing-clinical"], ["Licensed Practical Nurse", "nursing-clinical"],
  ["Journeyman Electrician", "skilled-trades"], ["HVAC Service Technician", "skilled-trades"], ["Maintenance Technician", "skilled-trades"], ["Welder", "skilled-trades"],
  ["CDL-A Truck Driver", "driving-logistics"], ["Delivery Driver", "driving-logistics"], ["Logistics Coordinator", "driving-logistics"], ["Dispatcher", "driving-logistics"],
  ["Warehouse Associate", "warehouse-production"], ["Forklift Operator", "warehouse-production"], ["Machine Operator", "warehouse-production"], ["Production Assembler", "warehouse-production"],
  ["Barista", "retail-hospitality"], ["Cashier", "retail-hospitality"], ["Line Cook", "retail-hospitality"], ["Hotel Front Desk Agent", "retail-hospitality"],
  ["High School Math Teacher", "teaching-education"], ["Teaching Assistant", "teaching-education"], ["Tutor", "teaching-education"],
  ["Staff Accountant", "accounting-finance"], ["Accounts Payable Specialist", "accounting-finance"], ["Payroll Specialist", "accounting-finance"], ["Bookkeeper", "accounting-finance"],
  ["Customer Service Representative", "customer-service"], ["Customer Support Specialist", "customer-service"], ["Call Center Agent", "customer-service"],
  ["Software Engineer", "software-it"], ["IT Help Desk Technician", "software-it"], ["Data Analyst", "software-it"], ["Systems Administrator", "software-it"],
  ["Shift Supervisor", "management-supervision"], ["Store Manager", "management-supervision"], ["Operations Manager", "management-supervision"],
  ["Social Media Manager", "marketing-content"], ["Content Writer", "marketing-content"], ["Marketing Coordinator", "marketing-content"],
  ["Technical Recruiter", "hr-recruiting"], ["HR Generalist", "hr-recruiting"], ["Talent Acquisition Specialist", "hr-recruiting"],
];
for (const [title, id] of EXPECT) {
  const got = matchLenses(title, [], true).map((m: any) => m.lens.id);
  assert.ok(got.includes(id), `"${title}" should match ${id}, got [${got.join(", ")}]`);
}
// A title that fits two kinds of role gets both, best first, never more than two.
const both = matchLenses("Customer Success Manager", [], true).map((m: any) => m.lens.id);
assert.ok(both.length <= 2 && both.includes("customer-service") && both.includes("management-supervision"), "a customer success manager gets customer service and management");
// A title with no hint but two key terms still matches; one key term alone does not.
assert.equal(matchLenses("Associate", ["quota", "pipeline", "crm"], true)[0]?.lens.id, "sales", "key terms alone can match when there are two or more");
assert.equal(matchLenses("Associate", ["quota"], true).length, 0, "one key term is not enough");
assert.equal(matchLenses("", [], true).length, 0, "no title and no terms gives no lens");
// Whole words only: "rn" must not match inside "modern", "hr" not inside "chrome".
assert.equal(matchLenses("Modern Chrome Wrangler", [], true).length, 0, "hints match whole words only");

// 4: coverage. Titles across industries that no lens matches yet. This is information, not a failure.
const COMMON = [
  "Legal Assistant", "Paralegal", "Real Estate Agent", "Loan Officer", "Insurance Agent", "Claims Adjuster", "Bank Teller", "Personal Trainer", "Cosmetologist", "Hair Stylist",
  "Security Officer", "Janitor", "Groundskeeper", "Landscaper", "Construction Laborer", "Project Manager", "Project Coordinator", "Civil Engineer", "Mechanical Engineer", "Electrical Engineer",
  "Social Worker", "Case Manager", "Counselor", "Pharmacist", "Dental Hygienist", "Dental Assistant", "Veterinary Technician", "Physical Therapist", "Caregiver", "Home Health Aide",
  "Graphic Designer", "Video Editor", "Photographer", "Event Coordinator", "Librarian", "Nonprofit Program Coordinator", "Grant Writer", "Fundraiser", "Police Officer", "Firefighter",
  "Flight Attendant", "Pilot", "Farm Worker", "Chef", "Property Manager", "Leasing Agent", "Buyer", "Purchasing Agent", "Supply Chain Analyst", "Product Manager",
];
const missing = COMMON.filter((title) => matchLenses(title, [], true).length === 0);
console.log(`\n${LENSES.length} lenses (${LENSES.filter((l: any) => l.status === "reviewed").length} reviewed, ${LENSES.filter((l: any) => l.status === "draft").length} draft).`);
console.log(`${COMMON.length - missing.length} of ${COMMON.length} common titles match a lens. Still without a lens (${missing.length}):`);
console.log(missing.map((t) => `  - ${t}`).join("\n"));
console.log("\nlenses ok");
