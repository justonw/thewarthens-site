// Checks "Answers": which questions are never drafted, that a draft with an invented number is caught, how the AI's three
// kinds of reply (answer, ask back, answer it yourself) are read, and what goes into the request. Run after any change to
// src/lib/answers.ts:
//   node --experimental-strip-types scripts/check-answers.mts
import assert from "node:assert/strict";
import { QUICK_QUESTIONS, buildAnswerRequest, inventedNumbers, isAnswerTweak, isPersonalQuestion, parseAnswerResponse, plainAnswer, wordCount } from "../src/lib/answers.ts";

// Questions only the person can answer are never drafted.
for (const q of [
  "What are your salary expectations?",
  "Are you legally authorized to work in the United States?",
  "Will you now or in the future require visa sponsorship?",
  "What is your desired pay range?",
  "Please list three professional references.",
  "When is your earliest start date?",
  "Are you willing to relocate?",
  "Do you have any criminal convictions?",
  "How do you identify your gender and race?",
  "Do you have a disability or veteran status to disclose?",
]) assert.ok(isPersonalQuestion(q), `should be personal: ${q}`);
for (const q of QUICK_QUESTIONS) assert.ok(!isPersonalQuestion(q), `a common question must be drafted: ${q}`);
assert.ok(!isPersonalQuestion("Tell us about a time you managed a team through a deadline."), "'managed' is not 'age'");
assert.ok(!isPersonalQuestion("Why do you want to join our company?"));

// Numbers nobody gave us are caught.
const sources = ['{"summary":"Led 11 agents","bullets":["cut onboarding from 21 days to 13 days","kept renewal at 91 percent across 120 accounts"]}', "I fixed a billing error for 3 customers", "Where do you see yourself in 5 years?"];
assert.deepEqual(inventedNumbers("I led 11 agents and cut onboarding from 21 days to 13.", sources), []);
assert.deepEqual(inventedNumbers("I fixed a billing error for 3 customers and saved 5 years of work.", sources), [], "numbers from the question count");
assert.deepEqual(inventedNumbers("I grew revenue 40% and led 11 agents.", sources), ["40"]);
assert.deepEqual(inventedNumbers("We kept 1,200 accounts", [...sources, "1200 accounts"]), [], "thousands commas are the same number");
assert.deepEqual(inventedNumbers("No numbers here at all.", sources), []);

// The AI's three replies.
const tool = (input: any) => ({ content: [{ type: "tool_use", name: "write_answer", input }] });
const good = parseAnswerResponse(tool({ outcome: "answer", answer: "I rebuilt the merchant onboarding checklist at Brightcart, which cut time to first sale from 21 days to 13.", basedOn: "Your onboarding rebuild at Brightcart." }));
assert.ok(good && good.outcome === "answer" && good.basedOn.includes("Brightcart"));
const ask = parseAnswerResponse(tool({ outcome: "ask", askBack: "Tell us about a real time you handled a disagreement at work." }));
assert.ok(ask && ask.outcome === "ask" && ask.askBack.includes("disagreement"));
const yours = parseAnswerResponse(tool({ outcome: "yours", note: "" }));
assert.ok(yours && yours.outcome === "yours" && yours.note.length > 10, "a missing note gets a default");
assert.equal(parseAnswerResponse(tool({ outcome: "answer", answer: "too short" })), null, "a stub answer is refused");
assert.equal(parseAnswerResponse(tool({ outcome: "ask", askBack: "?" })), null);
assert.equal(parseAnswerResponse(tool({ outcome: "something else" })), null);
assert.equal(parseAnswerResponse({ content: [{ type: "text", text: "hello" }] }), null);
const dashed = parseAnswerResponse(tool({ outcome: "answer", answer: "I led the team — and we shipped on time, 2020–2022, for the customers we served well.", basedOn: "x" })) as any;
assert.ok(!dashed.answer.includes("—") && !dashed.answer.includes("–") && dashed.answer.includes("2020-2022"), "dashes are removed");

// What goes into the request.
const doc: any = { name: "Dana Whitfield", headline: "CSM", contact: ["dana@example.com", "(614) 555-0147"], summary: "Support lead.", skills: [], training: [], education: [], experience: [{ title: "Lead", company: "Brightcart", location: "", dates: "2022 - Present", bullets: ["Led 11 agents"] }] };
const base: any = { doc, stories: "- Billing: I fixed a billing error for 3 customers.", postingTitle: "Customer Success Manager", postingCompany: "Lumen", postingKeywords: ["onboarding", "renewals"], fitReason: "Good fit.", question: "Why do you want to work here?", limit: 0, extra: "", tweak: "", previous: "" };
const req: any = buildAnswerRequest(base, "claude-sonnet-5-5");
const text = JSON.stringify(req.messages);
assert.ok(!text.includes("dana@example.com") && !text.includes("555-0147"), "contact details are not sent");
assert.ok(text.includes("<true_stories>") && text.includes("billing error"));
assert.ok(text.includes("There is no character limit"));
assert.ok(req.system.includes("Never invent") && req.system.includes("never write he, she, him, her, his, or they".replace("never", "Never")) && req.system.includes("outcome to \"ask\""));
assert.ok(JSON.stringify(buildAnswerRequest({ ...base, limit: 500 }, "m").messages).includes("at most 500 characters"));
assert.ok(!JSON.stringify(buildAnswerRequest({ ...base, stories: "" }, "m").messages).includes("<true_stories>"), "no stories, no stories block");
assert.ok(JSON.stringify(buildAnswerRequest({ ...base, extra: "I settled a scheduling fight between two agents." }, "m").messages).includes("<person_says>"));
const tweaked: any = buildAnswerRequest({ ...base, tweak: "example", previous: "Old answer text." }, "m");
assert.ok(JSON.stringify(tweaked.messages).includes("<previous_version>") && JSON.stringify(tweaked.messages).includes("DIFFERENT real example"));
assert.ok(JSON.stringify(buildAnswerRequest({ ...base, fix: "Remove the numbers: 40." }, "m").messages).includes("Remove the numbers: 40."));
assert.equal((buildAnswerRequest(base, "claude-haiku-5-5") as any).tool_choice.type, "tool");
assert.equal(req.tool_choice.type, "auto");
assert.ok(isAnswerTweak("shorter") && isAnswerTweak("") && !isAnswerTweak("longer"));
assert.equal(plainAnswer("a “quote” here", 50), 'a "quote" here');
assert.equal(wordCount("  three little words "), 3);

console.log("answers checks passed");
