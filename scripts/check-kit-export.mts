// Checks the plain-text downloads and helpers behind the "Your files" panel.
//   node --experimental-strip-types scripts/check-kit-export.mts
import assert from "node:assert/strict";
import { answersToText, cleanLetter, fileSlug, messagesToText } from "../src/lib/kit-export.ts";

// File names.
assert.equal(fileSlug("Customer Success Manager"), "customer-success-manager");
assert.equal(fileSlug("  Sr. Dental Assistant (Remote)!  "), "sr-dental-assistant-remote");
assert.equal(fileSlug("!!!"), "job");
assert.equal(fileSlug("", "kit"), "kit");
assert.ok(fileSlug("a".repeat(200)).length <= 40);
assert.ok(!fileSlug("trailing " + "x".repeat(60)).endsWith("-"));

// Cover letter cleaning.
const letter = cleanLetter({ greeting: "  Dear Team,  ", paragraphs: ["  One.  ", "   ", "Two."], closing: "   " });
assert.deepEqual(letter, { greeting: "Dear Team,", paragraphs: ["One.", "Two."], closing: "Sincerely," });

// Messages.
const m = messagesToText(
  [
    { id: "1", at: "", audience: "recruiter", who: "Jamie Alvarez", subject: "Customer Success Manager", note: "Short note.", message: "Hello Jamie." },
    { id: "2", at: "", audience: "peer", who: "", subject: "", note: "", message: "Hi there." },
  ],
  "Customer Success Manager at Northwind"
);
assert.ok(m.startsWith("MESSAGES: Customer Success Manager at Northwind"));
assert.ok(m.includes("1. To Jamie Alvarez"));
assert.ok(m.includes("Subject: Customer Success Manager"));
assert.ok(m.includes("Short version:\nShort note."));
assert.ok(m.includes("2. To someone in the field"), "falls back to the kind of person when no name");
assert.ok(!m.includes("Subject: \n"), "no empty subject line");
assert.equal(messagesToText([], ""), "MESSAGES");

// Answers.
const a = answersToText([{ id: "1", at: "", question: " Why this role? ", answer: " Because. " }], "Role");
assert.equal(a, "APPLICATION ANSWERS: Role\n\n1. Why this role?\n\nBecause.");
assert.equal(answersToText([], ""), "APPLICATION ANSWERS");

// No em dashes in anything we generate.
for (const text of [m, a]) assert.ok(!text.includes("—"));

console.log("kit-export checks passed");
