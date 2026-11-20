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
assert.ok(req.system.includes("is NOT their current title") && req.system.includes("If you have not done this directly") && req.system.includes("contract, temporary") && req.system.includes("its own question about that arrangement") && req.system.includes("Never praise a strength"), "the opening-title, gap, and arrangement rules are in the prompt");
assert.ok(!req.system.includes("Role lens"), "visitors do not get the role lens");
const lensed: any = lib.buildInterviewRequest({ ...input, lensText: "\n\nRole lens. Kind of role: Test." }, "claude-sonnet-5-5");
assert.ok(lensed.system.startsWith(req.system) && lensed.system.includes("Role lens. Kind of role: Test."), "a lens is added after the base rules");
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

// The new version (voice: true), switched on for everyone.
assert.equal(lib.INTERVIEW_V2, true, "the new version is ON for visitors");
const v2: any = lib.buildInterviewRequest({ ...input, voice: true }, "claude-sonnet-5-5");
assert.notEqual(v2.system, req.system, "voice changes the rules");
assert.ok(v2.system.includes("100 to 130 words") && v2.system.includes('Your story, what shaped how I work') && v2.system.includes("not a resume read aloud"), "the spoken opening rules are in");
assert.ok(v2.system.includes('Never start with "I am a [title] at [company], a [kind of] company"'), "the resume-summary opener is banned");
assert.ok(v2.system.includes("at most one number, never two numbers side by side") && v2.system.includes("passionate, driven, results-driven, proven"), "stacked numbers and AI words are banned");
assert.ok(!v2.system.includes("Do not put opinions, feelings, or self-praise in the opening"), "feelings are allowed when the person said them");
assert.ok(v2.system.includes("Feelings and opinions are allowed only when the person said them in their own words"), "and only then");
assert.ok(!req.system.includes("100 to 130 words") && req.system.includes("70 to 100 words"), "the old rules stay when voice is off");
assert.ok(v2.system.includes("Never invent an employer") && v2.system.includes("is NOT their current title") && v2.system.includes("Never write he, she, him, her, his, or they about the person"), "the safety rules survive in the new version");
const v2lens: any = lib.buildInterviewRequest({ ...input, voice: true, lensText: "\n\nRole lens. Kind of role: Test." }, "claude-sonnet-5-5");
assert.ok(v2lens.system.startsWith(v2.system) && v2lens.system.includes("Role lens."), "a lens still goes after the new rules");

// A saved sheet can carry the deeper coaching for a question, bounded and cleaned; a sheet without it is unchanged.
const deepRaw = { draft: "I rebuilt the onboarding checklist and got first sale from 21 days to 13. [what the team did differently]", strong: ["Name the one decision you made."], avoid: ["Do not list every task."], followUps: [{ q: "What would you do differently?", hint: "Say one real thing you learned." }, { q: "x", hint: "too short" }], example: "I rebuilt it in a weekend." };
const deep = lib.cleanDeep(deepRaw);
assert.ok(deep && deep.followUps.length === 1 && deep.draft.includes("[what the team did differently]") && deep.strong.length === 1, "a deep answer is cleaned and keeps its blanks");
assert.equal(lib.cleanDeep({ draft: "short" }), null, "nothing usable is refused");
assert.equal(lib.cleanDeep(null), null);
const withDeep = lib.cleanSheet({ ...good, questions: good.questions.map((q: any, i: number) => (i === 0 ? { ...q, deep: deepRaw } : q)) }, "manager");
assert.ok(withDeep.questions[0].deep && !withDeep.questions[1].deep, "deep coaching is kept only where it was built");
const deepText = lib.sheetToPlainText(withDeep, "Job");
assert.ok(deepText.includes("Your first answer:") && deepText.includes("Watch out for:") && deepText.includes("They might ask next: What would you do differently?"), "the plain text carries the deeper coaching");
assert.ok(!/[—–]/.test(deepText));
assert.ok(lib.sheetText(withDeep).length > 0);

// The framework: thread, human moment, bridge, proof, what is next.
assert.ok(v2.system.includes("The bridge:") && v2.system.includes("must not claim a result, a skill, or a habit the material does not show") && v2.system.includes("never paste their sentence whole"), "the bridge rules and the no-copy rule are in");
assert.ok(v2.system.includes("skip steps 2 and 3"), "without a human moment nothing personal is invented");
const withBridge: any = lib.buildInterviewRequest({ ...input, voice: true, bridgeTo: "renewals" }, "claude-sonnet-5-5");
const bridgeText = JSON.stringify(withBridge.messages);
assert.ok(bridgeText.includes("<bridge_to>") && bridgeText.includes("renewals"), "the picked part of the job goes to the AI");
assert.ok(!JSON.stringify(lib.buildInterviewRequest({ ...input, voice: true }, "claude-sonnet-5-5").messages).includes("<bridge_to>"), "no pick, no bridge block");
assert.ok(!JSON.stringify(lib.buildInterviewRequest({ ...input, bridgeTo: "renewals" }, "claude-sonnet-5-5").messages).includes("<bridge_to>"), "the old rules never get a bridge");

// What the opening was built from is kept with the sheet, and the check under it says what is missing.
assert.equal(lib.hasMoment("- Your story, what shaped how I work: I grew up in my mom's diner."), true);
assert.equal(lib.hasMoment("- Your story, what connects my work: I keep people moving."), false, "another story line is not the human moment");
assert.equal(lib.hasMoment(""), false);
const metaSheet = lib.cleanSheet({ ...good, meta: { moment: true, bridge: "renewals" } }, "manager");
assert.deepEqual(metaSheet.meta, { moment: true, bridge: "renewals" }, "meta is kept");
assert.equal(lib.cleanSheet(good, "manager").meta, undefined, "an older sheet has no meta");
const nWords = (n: number) => Array.from({ length: n }, () => "word").join(" ");
const noMoment = lib.openingCheck(nWords(110), { moment: false, bridge: "" });
assert.ok(noMoment.items.some((i: any) => !i.ok && i.label.includes("outside your resume")) && !noMoment.items.some((i: any) => i.label.includes("Connected")), "no moment: that is flagged and the bridge is not asked for yet");
const noBr = lib.openingCheck(nWords(110), { moment: true, bridge: "" });
assert.ok(noBr.items.some((i: any) => !i.ok && i.label.includes("Connected to a part of this job")), "a moment without a pick is flagged");
const complete = lib.openingCheck(nWords(110), { moment: true, bridge: "renewals" });
assert.ok(complete.items.every((i: any) => i.ok), "a complete opening passes every check");
assert.ok(complete.seconds >= 40 && complete.seconds <= 55, `about 45 seconds for 110 words (got ${complete.seconds})`);
assert.ok(lib.openingCheck(nWords(200), undefined).items[0].ok === false, "too long is flagged");
assert.ok(lib.openingCheck("I led 11 agents, cut 21 days to 13, and grew 30 percent in 2024 with 45 accounts. " + nWords(80), undefined).items.some((i: any) => !i.ok && i.label.includes("pile of numbers")), "stacked numbers are flagged");

// A spelled-out length of time counts as a number, and the opening may not work out years from dates.
const spelledSheet = lib.cleanSheet({ ...good, opening: good.opening + " I have done acute care for seven years." }, "manager");
assert.ok(lib.inventedNumbers(spelledSheet, [JSON.stringify({ x: "Support lead, 2022 to present, 11 agents, 21 days to 13" })]).includes("7"), "an invented spelled-out length of time is caught");
assert.equal(lib.inventedNumbers(lib.cleanSheet({ ...good, opening: good.opening + " I volunteered for four years." }, "manager"), ["I volunteered at a food pantry for four years"]).includes("4"), false, "a spelled-out time the person said is allowed");
assert.ok(v2.system.includes("Do not state how long they have done something") && v2.system.includes("until 2024"), "no worked-out lengths of time, and ended jobs are said plainly");

console.log("interview checks passed");
