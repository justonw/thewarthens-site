// Checks "Build my answer" (src/lib/interview-deep.ts): the request carries the question, the person's own example, and the rules;
// a reply is cleaned and bounded; a thin or broken reply is refused; a number nobody gave is caught; blanks are found. Run after
// any change to it:
//   node --experimental-strip-types scripts/check-interview-deep.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The two files import each other without a file extension, which Node cannot resolve, so they are copied to a temporary folder
// with that one import made explicit.
const dir = mkdtempSync(join(tmpdir(), "interview-deep-"));
writeFileSync(join(dir, "interview.mts"), readFileSync(new URL("../src/lib/interview.ts", import.meta.url), "utf8"));
writeFileSync(join(dir, "interview-deep.mts"), readFileSync(new URL("../src/lib/interview-deep.ts", import.meta.url), "utf8").replace('"./interview"', '"./interview.mts"'));
const deep: any = await import(join(dir, "interview-deep.mts"));

const doc: any = {
  name: "Dana", headline: "Customer Success Manager", contact: ["dana@example.com", "614-555-0142"], summary: "Support lead.", skills: [], training: [], education: [],
  experience: [{ title: "Support Team Lead", company: "Brightcart", location: "", dates: "2022 - Present", bullets: ["Rebuilt onboarding, cutting time to first sale from 21 days to 13 days", "Lead 11 agents"] }],
};
const input: any = {
  doc,
  stories: "- Your story, what shaped how I work: I grew up helping run my family's restaurant, so I am calm when everything lands at once.",
  postingTitle: "Customer Success Manager", postingCompany: "Lumen Analytics", postingKeywords: ["onboarding", "renewals"], stage: "manager",
  question: { question: "Tell me about a time you improved a process.", kind: "behavioral", why: "They want proof you fix things.", points: ["Your onboarding rebuild: 21 days to 13 days"] },
  example: "Our onboarding took three weeks, so I wrote a checklist and cut it down.",
};

let failed = 0;
const check = (label: string, ok: boolean) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}`);
  if (!ok) failed++;
};

// The request.
const req: any = deep.buildDeepRequest(input, "claude-sonnet-5-5");
const text = JSON.stringify(req.messages);
check("the question, stage, and key terms are sent", text.includes("Tell me about a time you improved a process.") && text.includes("Hiring manager interview") && text.includes("onboarding, renewals"));
check("the person's own example is sent as theirs", text.includes("<their_real_example>") && text.includes("I wrote a checklist and cut it down"));
check("the contact line is not sent", !text.includes("dana@example.com") && !text.includes("614-555"));
check("the story lines are explained", text.includes('Lines that start with \\"Your story\\"'));
check("with no example, the model is told to build from the resume and stories with blanks", JSON.stringify(deep.buildDeepRequest({ ...input, example: "" }, "m").messages).includes("did not add an example") && !JSON.stringify(deep.buildDeepRequest({ ...input, example: "" }, "m").messages).includes("<their_real_example>"));
check("faithfulness rules are in the prompt", req.system.includes("Use ONLY real material") && req.system.includes("Never write a story the material does not contain") && req.system.includes("A number may appear only if it is in the material"));
check("blanks are allowed, and capped", req.system.includes("[how many accounts]") && req.system.includes("at most 3 blanks"));
check("a gap question gets coaching, not a script", req.system.includes('For a gap question, leave "draft" empty'));
check("the answer must not sound like AI", req.system.includes("The answer must not sound like AI") && req.system.includes("Great question") && req.system.includes("leverage"));
check("coaching is specific to the question, not generic", req.system.includes("Not generic advice") && req.system.includes("specific to it"));
check("there is room for a real answer", req.max_tokens >= 1500);
check("Haiku gets the forced tool call", deep.buildDeepRequest(input, "claude-haiku-5-5").tool_choice.type === "tool");
check("the tool is the deep one", req.tools[0].name === "write_interview_answer" && req.tools[0].input_schema.required.includes("followUps"));

// A reply is cleaned and bounded.
const good = {
  type: "tool_use", name: "write_interview_answer",
  input: {
    draft: "Our onboarding took three weeks, which was too long, so I wrote a checklist and cut it down to 13 days. [what the team did differently] helped most, and I kept the checklist alive after that.",
    strong: ["Name the one decision you made.", "Say the result in the first sentence."],
    avoid: ["Do not list every task you did."],
    followUps: [{ q: "What would you do differently now?", hint: "Say one real thing you learned." }, { q: "Who else was involved?", hint: "Name the teams, not a story you did not tell." }],
  },
};
const parsed = deep.parseDeepResponse({ content: [good] }, input.example);
check("a good reply parses and keeps the person's example and blanks", !!parsed && parsed.followUps.length === 2 && parsed.example.includes("checklist") && deep.blanksIn(parsed.draft).length === 1);
check("a reply with no tool call is refused", deep.parseDeepResponse({ content: [{ type: "text", text: "hi" }] }, "") === null);
check("a thin reply is refused", deep.parseDeepResponse({ content: [{ type: "tool_use", name: "write_interview_answer", input: { draft: "ok" } }] }, "") === null);
check("dashes are removed", !/[—–]/.test(JSON.stringify(deep.parseDeepResponse({ content: [{ ...good, input: { ...good.input, draft: good.input.draft + " It was a big deal — a very big deal." } }] }, ""))));

// Invented numbers are caught.
const sources = [JSON.stringify({ ...doc, contact: [] }), input.stories, input.example, input.question.question, input.question.points.join(" ")];
check("numbers from the person's material are allowed", deep.deepNumbers(parsed, sources).length === 0);
const invented = { ...parsed, draft: parsed.draft + " I saved the company 40 percent." };
check("a number nobody gave is caught", deep.deepNumbers(invented, sources).join() === "40");
check("a number in a follow-up hint is caught too", deep.deepNumbers({ ...parsed, followUps: [{ q: "Did it grow 300 percent?", hint: "" }] }, sources).join() === "300");
check("blanks are counted", deep.blanksIn("I led [how many people] and [what happened].").length === 2 && deep.blanksIn("no blanks here").length === 0);

// Made-up habits and scenes are caught, and left as a blank for the person's own detail.
const src2 = [JSON.stringify({ ...doc, contact: [] }), "I stayed steady when everything landed at once."];
const risky = "I handle complaints at Brightcart. First, I go to the guest and listen to the whole story. People tell me I am steady. I stayed steady, which came from my family's restaurant. I'd rather stay with them until it is sorted. [what happened in the end]";
const found = deep.riskyClaims(risky, src2);
check("made-up actions and habits are found", found.length === 3 && found.some((x: string) => x.includes("People tell me")) && found.some((x: string) => x.includes("I'd rather")) && found.some((x: string) => x.startsWith("First, I go")));
check("a habit the person really said is allowed", !found.some((x: string) => x.includes("I stayed steady")));
const cleaned = deep.blankRisky(risky, src2);
check("they become one blank each, and what the person gave stays", cleaned.includes("[what you did, in your own words]") && !cleaned.includes("People tell me") && cleaned.includes("I handle complaints at Brightcart") && cleaned.includes("I stayed steady") && cleaned.includes("[what happened in the end]"));
check("a clean draft is not changed", deep.blankRisky(good.input.draft, src2) === good.input.draft && deep.riskyClaims(good.input.draft, src2).length === 0);
check("a spelled-out length of time is a number too", deep.deepNumbers({ ...parsed, draft: parsed.draft + " I did this for seven years." }, sources).join() === "7");
check("the rule against invented habits is in the prompt", req.system.includes("Do not state habits or rules the person never said"));

if (failed) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
