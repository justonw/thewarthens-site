// Checks the keyword matcher on a made-up posting and resume. Run: node --experimental-strip-types scripts/check-keyword-match.mts
import assert from "node:assert/strict";
import { markResume, matchKeywords, stem } from "../src/lib/keyword-match.ts";

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
// Categories, tiers, names, title, requirements.
const posting2 = `Senior Account Executive - Acme Cloud, Austin TX
About Acme
Acme Cloud is a SaaS company in Austin, Texas.
Requirements
- 5+ years of B2B sales experience
- Bachelor's degree or equivalent experience
- Salesforce and HubSpot
- Excellent communication and problem solving
Nice to have
- PMP or Six Sigma certification
- Gong experience`;
const resume2 = "Jordan Lee. Account Executive at Beta Corp 2019-2024. Closed B2B deals with Salesforce. Strong communication. B.S. in Business, 2016.";
const r2 = matchKeywords(resume2, posting2);
console.log(r2.terms.map((t) => `${t.status.padEnd(7)} ${t.kind.padEnd(6)} ${t.tier.padEnd(9)} ${t.phrase}`).join("\n"));
console.log("names:", r2.names.map((t) => t.phrase).join(", "));
console.log("title:", JSON.stringify(r2.title), "reqs:", JSON.stringify(r2.requirements.map((q) => q.status + ": " + q.label)));
const g = (p: string) => r2.terms.find((t) => t.phrase === p);
assert.equal(g("salesforce")?.kind, "tool");
assert.equal(g("salesforce")?.status, "found");
assert.equal(g("hubspot")?.status, "missing");
assert.equal(g("communication")?.kind, "soft");
assert.equal(g("pmp")?.tier, "preferred");
assert.equal(g("pmp")?.kind, "cert");
assert.ok(!r2.terms.some((t) => /austin|texas/.test(t.phrase)), "places are not skills");
assert.ok(r2.names.length >= 0);
assert.equal(r2.title?.phrase, "Senior Account Executive");
assert.equal(r2.title?.status, "words", "Account Executive is close to Senior Account Executive");
assert.ok(r2.requirements.some((q) => /5\+ years/.test(q.label) && q.status === "check"));
assert.ok(r2.requirements.some((q) => /bachelor/.test(q.label) && q.status === "found"));
assert.ok(r2.requiredTotal >= 3 && r2.requiredFound >= 1 && r2.requiredFound <= r2.requiredTotal);

// Highlighting marks only what was found, and keeps all of the text.
const pieces = markResume(resume2, r2.terms);
assert.equal(pieces.map((p) => p.text).join(""), resume2);
const marked = pieces.filter((p) => p.hit).map((p) => p.text.toLowerCase());
assert.ok(marked.includes("salesforce") && marked.some((m) => m.includes("communication")));
assert.ok(!marked.includes("hubspot"));
console.log("keyword matcher checks passed");
