// Checks "Interview prep" (src/lib/interview.ts): the request carries the right stage, gaps, and rules; a reply is cleaned and
// bounded; a thin or broken reply is refused; a number nobody gave is caught; and the plain-text sheet reads right. Run after any
// change to it:
//   node --experimental-strip-types scripts/check-interview.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "interview-"));
writeFileSync(join(dir, "interview.mts"), readFileSync(new URL("../src/lib/interview.ts", import.meta.url), "utf8"));
const lib: any = await import(join(dir, "interview.mts"));

const doc: any = { name: "Dana", headline: "Customer Success Manager", contact: ["dana@example.com", "614-555-0142"], summary: "Support lead.", skills: [], training: [], education: [],
  experience: [{ title: "Support Team Lead", company: "Brightcart", location: "", dates: "2022 - Present", bullets: ["Rebuilt onboarding, cutting time to first sale from 21 days to 13 days", "Lead 11 support agents"] }] };
const input = { doc, stories: "- Disagreement: two agents clashed over shift swaps, so I set up a swap board.", postingTitle: "Customer Success Manager", postingCompany: "Lumen Analytics", postingKeywords: ["onboarding", "renewals"], fitReason: "Strong on onboarding.", unmet: ["Executive stakeholder reviews", "Health scores"], stage: "manager" };

// The request.
const req: any = lib.buildInterviewRequest(input, "claude-sonnet-5-5");
const text = JSON.stringify(req.messages);
assert.ok(text.includes("Hiring manager interview"), "the stage is sent");
assert.ok(text.includes("Executive stakeholder reviews") && text.includes("<unmet>"), "the gaps are sent for the gap questions");
assert.ok(!text.includes("dana@example.com") && !text.includes("614-555"), "the contact line is not sent");
assert.ok(req.system.includes("Never write a story for the person") && req.system.includes("storyAsk") && req.system.includes("Never include questions about pay"), "the rules are in the prompt");
assert.ok(req.system.includes("what a tool or skill is used FOR") && req.system.includes("self-praise"), "the stay-close rules are in the prompt");
assert.ok(!req.system.includes("Role lens"), "visitors do not get the role lens");
const lensed: any = lib.buildInterviewRequest({ ...input, lens: true }, "claude-sonnet-5-5");
assert.ok(lensed.system.includes("Role lens") && lensed.system.includes("never invent a metric"), "the owner can turn the role lens on");
assert.equal(req.tools[0].name, "write_interview_prep");
const none: any = lib.buildInterviewRequest({ ...input, unmet: [], stage: "phone" }, "claude-sonnet-5-5");
assert.ok(JSON.stringify(none.messages).includes("Recruiter phone screen") && JSON.stringify(none.messages).includes("There are no known gaps"));
assert.ok(lib.buildInterviewRequest(input, "claude-haiku-5-5").tool_choice.type === "tool", "Haiku gets the forced tool call");

// A reply is cleaned and bounded.
const good = {
  opening: "I lead a support team of 11 and rebuilt our onboarding checklist, cutting time to first sale from 21 days to 13 — and I want to bring that to customer success.",
  questions: [
    { question: "Tell me about a time you improved a process.", kind: "behavioral", why: "They want proof you fix things.", approach: "Start with the result.", points: ["Your onboarding rebuild: 21 days to 13.", "x"], storyAsk: "" },
    { question: "How do you keep renewals on track?", kind: "role", why: "Renewals are the job.", approach: "Name your steps.", points: ["You lead 11 agents."], storyAsk: "Think of a real renewal you saved. What happened?" },
    { question: "Why this role?", kind: "motivation", why: "Fit.", approach: "Tie it to the work.", points: ["Your onboarding results."], storyAsk: "" },
    { question: "Tell me about working with executives.", kind: "gap", why: "The posting asks for it.", approach: "Say you have not done it directly.", points: ["You report churn risks to the account team."], storyAsk: "" },
    { question: "Bad", kind: "weird", why: "", approach: "", points: [], storyAsk: "" },
  ],
  askThem: ["What does success look like in the first six months?", "short"],
  remember: ["Send a thank-you within a day."],
};
const sheet = lib.cleanSheet(good, "manager", new Date("2026-11-19T12:00:00Z"));
assert.equal(sheet.questions.length, 4, "a question with no real text is dropped");
assert.ok(!/[—–]/.test(sheet.opening), "dashes are cleaned");
assert.deepEqual(sheet.questions[0].points, ["Your onboarding rebuild: 21 days to 13."], "a stub point is dropped");
assert.equal(sheet.askThem.length, 1, "a stub question to ask is dropped");
assert.equal(sheet.at, "2026-11-19T12:00:00.000Z");
assert.equal(lib.cleanSheet({ ...good, kind: undefined, questions: good.questions.map((q) => ({ ...q, kind: "weird" })) }, "phone").questions[0].kind, "role", "an unknown kind becomes role");
assert.equal(lib.cleanSheet({ ...good, opening: "short" }, "manager"), null, "a thin opening is refused");
assert.equal(lib.cleanSheet({ ...good, questions: good.questions.slice(0, 2) }, "manager"), null, "too few questions is refused");
assert.equal(lib.cleanSheet("nope", "manager"), null);
assert.equal(lib.cleanSheet({ ...good, questions: Array.from({ length: 30 }, (_, i) => ({ question: `Question number ${i}?`, kind: "role", why: "", approach: "", points: [], storyAsk: "" })) }, "manager").questions.length, lib.MAX_QUESTIONS, "the list is capped");

// A reply from the AI.
const reply = (input: any) => ({ content: [{ type: "tool_use", name: "write_interview_prep", input }] });
assert.equal(lib.parseInterviewResponse(reply(good), "final").stage, "final");
assert.equal(lib.parseInterviewResponse({ content: [{ type: "text", text: "no" }] }, "final"), null);
assert.equal(lib.parseInterviewResponse(null, "final"), null);

// A number nobody gave us is caught; numbers from the resume, the stories, and the posting are fine.
const sources = [JSON.stringify(doc), input.stories, input.postingTitle, input.postingKeywords.join(" "), input.fitReason, input.unmet.join(" ")];
assert.deepEqual(lib.inventedNumbers(sheet, sources), [], "21, 13, and 11 are all in the resume");
const bad = lib.cleanSheet({ ...good, opening: good.opening + " I grew renewals 45 percent.", questions: good.questions.map((q, i) => (i === 0 ? { ...q, points: [...q.points, "You saved 300 accounts last year."] } : q)) }, "manager");
assert.deepEqual(lib.inventedNumbers(bad, sources).sort(), ["300", "45"], "numbers that are in no source are caught");

// The sheet as text.
const out = lib.sheetToPlainText(sheet, "Customer Success Manager at Lumen Analytics");
assert.ok(out.startsWith("INTERVIEW PREP: Customer Success Manager at Lumen Analytics") && out.includes("1. Tell me about a time you improved a process.") && out.includes("Your real example: Think of a real renewal"));
assert.ok(out.includes("QUESTIONS TO ASK THEM") && out.includes("REMEMBER"));
assert.ok(!/[—–]/.test(out), "no dashes in the text");

console.log("interview checks passed");
