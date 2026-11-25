// Checks the birthday invitation's rules: answers are cleaned and validated, seats fill in order, only first names are
// public, the cutoff closes the list, and the right reminders are scheduled.
// Run:  npx tsx scripts/check-birthday.mts
import assert from "node:assert/strict";
import { SCHEDULE, cleanName, isClosed, parseRsvp, publicView, remindersFor, totals, type Rsvp } from "../src/lib/birthday.ts";
import { confirmation, notifyJuston, REMINDERS } from "../src/lib/birthday-email.ts";

// Names and emails
assert.equal(cleanName("  Maria   <b>Lopez</b> "), "Maria bLopezb");
assert.equal(cleanName("O'Neil-Smith Jr."), "O'Neil-Smith Jr.");
assert.equal(cleanName(42), "");
const ok = parseRsvp({ email: " Me@Example.com ", status: "yes", names: ["Ana", " ana ", "Ben", ""] });
assert.ok(ok.ok && ok.email === "me@example.com" && ok.names.join() === "Ana,Ben", "duplicates removed, email lowercased");
assert.ok(!parseRsvp({ email: "nope", status: "yes", names: ["A"] }).ok, "bad email refused");
assert.ok(!parseRsvp({ email: "a@b.co", status: "sure", names: ["A"] }).ok, "bad status refused");
assert.ok(!parseRsvp({ email: "a@b.co", status: "yes", names: [] }).ok, "needs a name");
const no = parseRsvp({ email: "a@b.co", status: "no", names: ["A", "B"] });
assert.ok(no.ok && no.names.length === 1, "a no holds one name");
const many = parseRsvp({ email: "a@b.co", status: "yes", names: Array.from({ length: 25 }, (_, i) => `Pat${String.fromCharCode(97 + i)}`) });
assert.ok(many.ok && many.names.length === 10, "party size capped");

// Public view
const mk = (email: string, status: Rsvp["status"], names: string[], at: string): Rsvp => ({ email, status, names, createdAt: at, updatedAt: at, scheduled: [] });
const rows = [
  mk("c@x.co", "yes", ["Cara Smith"], "2026-11-26T10:00:00Z"),
  mk("a@x.co", "yes", ["Ann Lee", "Bob Lee"], "2026-11-25T10:00:00Z"),
  mk("m@x.co", "maybe", ["Max Roe"], "2026-11-25T12:00:00Z"),
  mk("n@x.co", "no", ["Nia Ray"], "2026-11-25T13:00:00Z"),
];
const v = publicView(rows, new Date("2026-11-27T00:00:00Z"));
assert.deepEqual(Object.keys(v), ["closed"], "the page gets nothing about other guests");
assert.ok(!JSON.stringify(v).includes("@") && !JSON.stringify(v).includes("Ann"), "no emails or names reach the page");
assert.deepEqual(totals(rows), { yes: 3, maybe: 1, no: 1 }, "totals for the note to Juston count people, not RSVPs");

// Cutoff: open at 11:59 PM Eastern on Nov 28, closed at midnight
assert.ok(!isClosed(new Date("2026-11-29T04:59:00Z")));
assert.ok(isClosed(new Date("2026-11-29T05:00:00Z")));

// Reminders: yes gets five-days and evening-before; maybe and no get the nudge; past times are skipped
const early = new Date("2026-11-25T12:00:00Z");
assert.deepEqual(remindersFor("yes", early).map((r) => r.key), ["fiveDays", "eveningBefore"]);
assert.deepEqual(remindersFor("maybe", early).map((r) => r.key), ["nudge"]);
assert.deepEqual(remindersFor("no", early).map((r) => r.key), ["nudge"]);
assert.deepEqual(remindersFor("yes", new Date("2026-12-03T12:00:00Z")).map((r) => r.key), ["eveningBefore"], "a reminder already past is skipped");
assert.deepEqual(remindersFor("no", new Date("2026-11-28T12:00:00Z")), [], "no nudge after its time");
// Eastern times: 5 days before at 10 AM (15:00Z), evening before at 7 PM (00:00Z on the 6th)
assert.equal(SCHEDULE.eveningBeforeUtc, "2026-12-06T00:00:00Z");
assert.equal(SCHEDULE.fiveDaysUtc, "2026-12-01T15:00:00Z", "10 AM Eastern, five days before Dec 6");

// Emails: guest text is escaped, and no em dashes anywhere
const evil = ['<script>alert(1)</script>"Ann'];
for (const mail of [
  confirmation("yes", evil, false),
  confirmation("maybe", evil, true),
  confirmation("no", evil, false),
  REMINDERS.nudge(evil),
  REMINDERS.fiveDays(evil),
  REMINDERS.eveningBefore(evil),
  notifyJuston("new", "yes", evil, "x<y@z.co", { yes: 1, maybe: 0, no: 0 }),
]) {
  assert.ok(!mail.html.includes("<script>"), `escaped: ${mail.subject}`);
  assert.ok(!mail.html.includes("—") && !mail.subject.includes("—"), "no em dash");
}
console.log("birthday checks passed");
