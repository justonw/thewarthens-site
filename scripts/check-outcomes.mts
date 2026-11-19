// Checks outcome tracking: the stages, the summary numbers, and that "what seems to work" only appears when there are
// enough applications on both sides, and says so plainly. Run after any change to src/lib/outcomes.ts:
//   node --experimental-strip-types scripts/check-outcomes.mts
import assert from "node:assert/strict";
import { RESULTS, daysSince, heardBack, insightSentence, insights, isResult, reachedConversation, summarize } from "../src/lib/outcomes.ts";

assert.ok(RESULTS.every((r) => isResult(r.id)) && !isResult("hired") && !isResult(undefined));
assert.equal(RESULTS[0].id, "", "waiting is the first stage");
assert.deepEqual(RESULTS.map((r) => r.tracker), ["Applied", "Phone Screen", "Interview", "Offer Received", "Rejected"], "each stage sets the tracker status that matches");
assert.ok(!heardBack("") && heardBack("rejected") && heardBack("phone"), "a no is still a reply");
assert.ok(!reachedConversation("rejected") && !reachedConversation("") && reachedConversation("phone") && reachedConversation("offer"));

assert.equal(daysSince("2026-11-10T12:00:00.000Z", new Date("2026-11-18T12:00:00.000Z")), 8);
assert.equal(daysSince("nonsense"), 0);

const entry = (over: any = {}): any => ({ status: "applied", result: "", letter: null, messages: [], followedUpAt: "", ...over });
const msg = { purpose: "intro", audience: "recruiter", message: "m", note: "n" };

assert.deepEqual(summarize([]), { applied: 0, waiting: 0, heard: 0, conversations: 0, offers: 0, notSelected: 0 });
const list = [entry(), entry({ result: "phone" }), entry({ result: "interview" }), entry({ result: "offer" }), entry({ result: "rejected" }), entry({ status: "built", result: "" })];
assert.deepEqual(summarize(list), { applied: 5, waiting: 1, heard: 4, conversations: 3, offers: 1, notSelected: 1 }, "a build that was never applied to is not counted");

// A factor is compared only when each side has enough jobs.
const noNumbers = () => 0;
assert.deepEqual(insights([entry(), entry(), entry({ letter: {} }), entry({ letter: {} })], noNumbers), [], "two on each side is too few");
const many = [
  ...Array.from({ length: 4 }, (_, i) => entry({ letter: {}, messages: [msg], result: i < 3 ? "phone" : "" })),
  ...Array.from({ length: 5 }, (_, i) => entry({ result: i < 1 ? "rejected" : "" })),
];
const found = insights(many, noNumbers);
const message = found.find((i) => i.id === "message")!;
assert.deepEqual(message.withIt, { n: 4, heard: 3 });
assert.deepEqual(message.without, { n: 5, heard: 1 });
assert.equal(insightSentence(message), "When you wrote to someone at the company: 3 of 4 heard back, against 1 of 5 when you didn't.");
assert.ok(!found.some((i) => i.id === "followup"), "a factor nobody used is not shown");
assert.ok(found.length <= 3);
assert.ok(insightSentence({ id: "x", label: "followed up after applying", withIt: { n: 4, heard: 2 }, without: { n: 4, heard: 2 } }).endsWith("About the same."), "no real difference is said plainly");
// A follow-up message does not count as "wrote to someone".
const followOnly = [...Array.from({ length: 3 }, () => entry({ messages: [{ ...msg, purpose: "followup" }], result: "phone" })), ...Array.from({ length: 3 }, () => entry())];
assert.ok(!insights(followOnly, noNumbers).some((i) => i.id === "message"));
// Numbers in most bullets.
const withNums = [...Array.from({ length: 3 }, () => entry({ result: "phone" })), ...Array.from({ length: 3 }, () => entry())];
const byNum = insights(withNums, (e: any) => (e.result === "phone" ? 0.9 : 0.2)).find((i) => i.id === "numbers")!;
assert.deepEqual([byNum.withIt, byNum.without], [{ n: 3, heard: 3 }, { n: 3, heard: 0 }]);

console.log("outcome checks passed");
