// Checks the saved profile: stories are added once, kept to a limit, turned into notes within a budget, and a downloaded
// file loads back safely (and a wrong or hostile file is refused). Run: node --experimental-strip-types scripts/check-resume-profile.mts
import assert from "node:assert/strict";
import { MAX_STORIES, PROFILE_APP, YOUR_STORY_PROMPTS, YOUR_STORY_PREFIX, addStoryTo, buildProfileFile, newStory, parseProfileFile, profileFileName, replaceStoryTopic, storiesAsNotes, yourStoryAnswers } from "../src/lib/resume-profile.ts";

const limits = { resume: 40000, notes: 6000 };
let list: ReturnType<typeof newStory>[] = [];
list = addStoryTo(list, newStory("Salesforce experience", "Did you use a CRM?", "I used Salesforce at Harbor Table for 2 years."));
list = addStoryTo(list, newStory("salesforce experience", "again", "i used salesforce at harbor table for 2 years."));
assert.equal(list.length, 1, "same answer is not kept twice");
list = addStoryTo(list, newStory("Quota", "Target?", "On my own, outside a paid job: I tracked a monthly goal."));
assert.equal(list.length, 2);
for (let i = 0; i < 60; i++) list = addStoryTo(list, newStory(`Topic ${i}`, "q", `answer number ${i}`));
assert.equal(list.length, MAX_STORIES, "only the newest stories are kept");
assert.ok(list[list.length - 1].topic === "Topic 59");

// Notes block: newest first, inside the budget, empty when there is no room.
const notes = storiesAsNotes(list, 300);
assert.ok(notes.length <= 300 && notes.startsWith("Things I have already told you"));
assert.ok(notes.includes("Topic 59") && !notes.includes("Topic 0:"));
assert.equal(storiesAsNotes(list, 20), "");
assert.equal(storiesAsNotes([], 1000), "");

// A file round trip.
const small = addStoryTo([], newStory("Salesforce experience", "Did you use a CRM?", "I used Salesforce at Harbor Table."));
const file = buildProfileFile({ resume: "Jordan Rivera\nGeneral Manager", notes: "I like customer work.", hiringManager: "", email: "j@x.com", stories: small, filesOmitted: 1 });
const back = parseProfileFile(file, limits);
assert.ok(back.ok && back.profile.resume.startsWith("Jordan") && back.profile.stories.length === 1 && back.profile.email === "j@x.com");
assert.match(profileFileName(new Date("2026-11-18T12:00:00Z")), /^my-career-profile-2026-11-18\.json$/);

// Wrong, hostile, or oversized files are refused or trimmed.
assert.equal(parseProfileFile("not json", limits).ok, false);
assert.equal(parseProfileFile(JSON.stringify({ app: "something-else", version: 1 }), limits).ok, false);
assert.equal(parseProfileFile(JSON.stringify({ app: PROFILE_APP, version: 99 }), limits).ok, false);
assert.equal(parseProfileFile("x".repeat(3_100_000), limits).ok, false);
const hostile = parseProfileFile(JSON.stringify({ app: PROFILE_APP, version: 1, resume: "r".repeat(100000), notes: "<script>alert(1)</script>", stories: [{ topic: "ok", answer: "fine answer" }, { topic: "", answer: "no topic" }, "junk", null, { topic: "t", answer: "a".repeat(5000) }] }), limits);
assert.ok(hostile.ok);
if (hostile.ok) {
  assert.equal(hostile.profile.resume.length, 40000, "long text is trimmed to the limit");
  assert.equal(hostile.profile.stories.length, 2, "bad stories are dropped");
  assert.equal(hostile.profile.stories[1].answer.length, 700);
}
// Saved builds travel in the file as plain data (they are checked where they are used), and an older file without any is fine.
const withLibrary = parseProfileFile(buildProfileFile({ resume: "r", notes: "", hiringManager: "", email: "", stories: [], library: [{ id: "a1" }, { id: "a2" }] }), limits);
assert.ok(withLibrary.ok && withLibrary.profile.library?.length === 2, "saved builds round trip");
const noLibrary = parseProfileFile(JSON.stringify({ app: PROFILE_APP, version: 1, resume: "r", stories: [] }), limits);
assert.ok(noLibrary.ok && noLibrary.profile.library?.length === 0, "an older file has no saved builds");
const tooMany = parseProfileFile(JSON.stringify({ app: PROFILE_APP, version: 1, resume: "r", stories: [], library: Array.from({ length: 500 }, (_, i) => ({ id: `x${i}` })) }), limits);
assert.ok(tooMany.ok && (tooMany.profile.library?.length ?? 0) <= 60, "the number of saved builds in a file is capped");
// "Your story": re-answering a question replaces the old answer, and the answers come back in the order they are asked.
{
  let st: ReturnType<typeof newStory>[] = [];
  const [a, b] = YOUR_STORY_PROMPTS;
  st = replaceStoryTopic(st, newStory(a.topic, a.question, "I keep ending up as the person who keeps everyone moving."));
  st = replaceStoryTopic(st, newStory(a.topic, a.question, "I am the one who keeps a busy house on schedule."));
  assert.equal(st.length, 1, "a new answer to the same story question replaces the old one");
  assert.equal(yourStoryAnswers(st)[0], "I am the one who keeps a busy house on schedule.");
  assert.equal(yourStoryAnswers(st)[1], "", "an unanswered question is empty");
  st = replaceStoryTopic(st, newStory("Quota", "Target?", "I tracked a monthly goal."));
  st = replaceStoryTopic(st, newStory(b.topic, b.question, "Faith and family."));
  assert.equal(st.length, 3, "other stories are untouched");
  assert.ok(YOUR_STORY_PROMPTS.every((p) => p.topic.startsWith(YOUR_STORY_PREFIX)), "every topic starts with the prefix the prompt looks for");
  assert.ok(storiesAsNotes(st, 2000).includes("- Your story, what shaped how I work: Faith and family."), "the notes carry the story lines");
}
console.log("profile checks passed");
