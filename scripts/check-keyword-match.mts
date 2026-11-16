// Checks the keyword matcher on a made-up posting and resume. Run: node --experimental-strip-types scripts/check-keyword-match.mts
import assert from "node:assert/strict";
import { matchKeywords, stem } from "../src/lib/keyword-match.ts";

const posting = `Sales Development Representative
About us
We are Acme Cloud, a fast growing SaaS company in Austin.
Requirements
- Experience with cold calling and outbound prospecting
- Familiarity with Salesforce or HubSpot CRM
- Strong communication skills and the ability to work with cross-functional teams
- Comfortable with customer success handoffs
What you'll do
- Book meetings for account executives. Customer success partners will help.
- Manage the sales pipeline and report on KPIs
- Customer success handoffs happen weekly`;

const resume = `Jordan Lee
Customer support specialist. Managed a ticket queue, called new customers, and worked with sales teams across departments.
Used HubSpot to track customer questions. Reported weekly metrics. Strong written communication.
Handled customer handoffs to the success team.`;

const r = matchKeywords(resume, posting);
const by = (p: string) => r.terms.find((t) => t.phrase === p);
console.log(r.terms.map((t) => `${t.status.padEnd(7)} ${String(t.count).padStart(2)}  ${t.phrase}`).join("\n"));

assert.equal(stem("managed"), stem("managing"));
assert.equal(stem("managed"), stem("manages"));
assert.ok(r.terms.length > 5 && r.terms.length <= 40);
assert.equal(by("hubspot")?.status, "found");
assert.equal(by("salesforce")?.status, "missing");
assert.ok(by("cold calling"), "cold calling listed");
assert.equal(by("customer success")?.status, "words", "words present but not the phrase");
assert.ok(!by("customer"), "shorter phrase swallowed by customer success");
assert.ok(!r.terms.some((t) => /^(experience|skills|strong|work|team)$/.test(t.phrase)), "filler words never listed");
assert.equal(r.found + r.words + r.missing, r.terms.length);

// A short form counts: "CRM" in the resume satisfies "customer relationship management" in the posting.
const a = matchKeywords("I used CRM tools daily and wrote SQL reports.", "You know customer relationship management and sql. Customer relationship management matters. SQL matters.");
assert.equal(a.terms.find((t) => t.phrase === "customer relationship management")?.status, "found");
assert.equal(a.terms.find((t) => t.phrase === "sql")?.status, "found");

// Empty or tiny input never throws.
assert.equal(matchKeywords("", "").terms.length, 0);
assert.equal(matchKeywords("x", "y").terms.length, 0);
console.log("keyword matcher checks passed");
