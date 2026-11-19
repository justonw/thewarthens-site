// Checks the numbers coach: which bullets it asks about, the questions, and that a rewrite is only accepted when it carries
// the person's number and adds no other. Run after any change to src/lib/quantify.ts:
//   node --experimental-strip-types scripts/check-quantify.mts
import assert from "node:assert/strict";
import { DEFAULT_QUESTION, answerHasNumber, checkRewrite, findUnquantified, hasNumber, numberQuestion, parseQuantifyResponse, quantifyScore } from "../src/lib/quantify.ts";

const doc: any = {
  name: "Dana", headline: "CSM", contact: [], summary: "", skills: [], training: [], education: [],
  experience: [
    { title: "Support Team Lead", company: "Brightcart", location: "", dates: "Mar 2022 - Present", bullets: ["Run weekly ticket reviews and coach agents on tone and speed", "Lead 11 support agents across chat and email", "Wrote help center articles that reduced repeat tickets", "Report churn risks to the account team"] },
    { title: "Support Specialist", company: "Northline", location: "", dates: "2018 - 2022", bullets: ["Resolved tickets for small business customers using Zendesk", "Trained new hires on product knowledge"] },
    { title: "Barista", company: "Roast Street", location: "", dates: "2016 - 2018", bullets: ["Opened and closed the cafe"] },
  ],
};

assert.ok(hasNumber("Lead 11 agents") && hasNumber("Cut costs by $5k") && hasNumber("Grew sales 30%") && hasNumber("Trained two new hires"));
assert.ok(!hasNumber("Wrote help center articles"));

assert.deepEqual(quantifyScore(doc), { withNumber: 1, total: 7 });

const asked = findUnquantified(doc, ["churn risk", "tickets"]);
assert.equal(asked.length, 3, "at most three at a time");
assert.ok(asked.every((b) => b.job <= 1), "only the newest two jobs are asked about");
assert.ok(!asked.some((b) => /Barista|Opened and closed/.test(b.title + b.text)), "an old, unrelated job is left alone");
assert.ok(asked.every((b) => !hasNumber(b.text)), "a bullet that already has a number is never asked about");
assert.ok(asked[0].job === 0, "the newest job comes first");
const skipped = findUnquantified(doc, [], new Set(["Run weekly ticket reviews and coach agents on tone and speed"]));
assert.ok(!skipped.some((b) => b.text.startsWith("Run weekly")), "a skipped bullet is not asked again");
assert.equal(findUnquantified({ ...doc, experience: [{ ...doc.experience[0], bullets: ["Lead 11 agents"] }] }).length, 0, "nothing to ask when every bullet has a number");

assert.match(numberQuestion("Lead the support team"), /How many people/);
assert.match(numberQuestion("Trained new hires on tools"), /train or coach/);
assert.match(numberQuestion("Reduced repeat tickets"), /By how much/);
assert.match(numberQuestion("Resolved tickets for customers"), /how often/);
assert.match(numberQuestion("Built the onboarding checklist"), /How many, how often, or how big/);
assert.match(numberQuestion("Prepared daily sales reports"), /how often/);
assert.equal(numberQuestion("Strategic thinking"), DEFAULT_QUESTION);

assert.ok(answerHasNumber("about 40") && answerHasNumber("15%") && answerHasNumber("$2,500") && !answerHasNumber("a lot") && !answerHasNumber("forty"));

const original = "Resolved tickets for small business customers using Zendesk";
assert.deepEqual(checkRewrite(original, "about 45 a day", "Resolved 45 tickets a day for small business customers using Zendesk"), { ok: true });
assert.equal((checkRewrite(original, "45", "Resolved tickets for small business customers using Zendesk") as any).ok, false, "the number must be in the rewrite");
assert.equal((checkRewrite(original, "45", "Resolved 45 tickets for 120 small business customers using Zendesk") as any).ok, false, "no other number may be added");
assert.equal((checkRewrite(original, "45", "Managed a billing migration for enterprise clients, 45 cases") as any).ok, false, "it must still be the same bullet");
assert.equal((checkRewrite("Raised the review rating from 3.9 to 4.5 by resolving escalated issues", "30", "Raised the review rating from 3.9 to 4.5 by resolving 30 escalated issues") as any).ok, true, "numbers already in the bullet are kept");
assert.deepEqual(checkRewrite("Grew accounts", "1,200", "Grew accounts to 1200 customers"), { ok: true }, "thousands commas are the same number");
assert.equal((checkRewrite(original, "no idea", "Resolved tickets") as any).ok, false);

const good = { content: [{ type: "tool_use", name: "rewrite_bullet", input: { bullet: "Resolved 45 tickets a day for small business customers using Zendesk" } }] };
assert.equal(parseQuantifyResponse(good), "Resolved 45 tickets a day for small business customers using Zendesk");
assert.equal(parseQuantifyResponse({ content: [{ type: "tool_use", name: "rewrite_bullet", input: { bullet: "short" } }] }), null);
assert.equal(parseQuantifyResponse({ content: [{ type: "text", text: "hi" }] }), null);
assert.ok(!parseQuantifyResponse({ content: [{ type: "tool_use", name: "rewrite_bullet", input: { bullet: "- Resolved 45 tickets — daily for customers" } }] })!.includes("—"), "dashes are removed");

console.log("numbers coach checks passed");
