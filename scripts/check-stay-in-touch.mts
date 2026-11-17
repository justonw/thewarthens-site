// Checks the "occasional note" list. Run: RESUME_OWNER_CODE=test-secret node --experimental-strip-types scripts/check-stay-in-touch.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// The library imports its neighbour without a file extension, which Node cannot resolve, so the files are copied to a
// temporary folder with that one import made explicit.
const dir = mkdtempSync(join(tmpdir(), "stay-check-"));
const read = (f: string) => readFileSync(new URL(`../src/lib/${f}`, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-limits.ts"), read("resume-limits.ts"));
writeFileSync(join(dir, "stay-in-touch.ts"), read("stay-in-touch.ts").replace('"./resume-limits"', '"./resume-limits.ts"'));
writeFileSync(join(dir, "note-html.ts"), read("note-html.ts"));
const { memoryKv } = await import(join(dir, "resume-limits.ts"));
const { addFriend, friendStats, idForEmail, sendNote, tokenFor, unsubscribe, wouldSend } = await import(join(dir, "stay-in-touch.ts"));
const { noteHtml } = await import(join(dir, "note-html.ts"));

const kv = memoryKv();
await addFriend(kv, "A@x.com", "tech");
await addFriend(kv, "a@x.com", "tech"); // same person
await addFriend(kv, "b@x.com", "faith");
await addFriend(kv, "c@x.com", "tech");
assert.deepEqual(await friendStats(kv), { total: 3, active: 3, tech: 2, faith: 1, unsubscribed: 0 });

// Unsubscribing needs the right signed link.
const c = idForEmail("c@x.com");
assert.equal(await unsubscribe(kv, c, "0".repeat(32)), "invalid");
assert.equal(await unsubscribe(kv, "nothex", tokenFor(c)), "invalid");
assert.equal(await unsubscribe(kv, c, tokenFor(c)), "ok");
assert.equal((await friendStats(kv)).unsubscribed, 1);

// Sending: skips the unsubscribed, honors the audience, never repeats a note.
assert.equal(await wouldSend(kv, "n1", "all"), 2);
assert.equal(await wouldSend(kv, "n1", "faith"), 1);
const got: string[] = [];
const send = async (email: string, link: string) => {
  assert.match(link, /\/unsubscribe\?i=[0-9a-f]{64}&t=[0-9a-f]{32}$/);
  got.push(email);
  return true;
};
let r = await sendNote(kv, { campaignId: "n1", audience: "all", budgetMs: 5000, send });
assert.deepEqual({ sent: r.sent, failed: r.failed, remaining: r.remaining }, { sent: 2, failed: 0, remaining: 0 });
assert.deepEqual(got.sort(), ["a@x.com", "b@x.com"]);
r = await sendNote(kv, { campaignId: "n1", audience: "all", budgetMs: 5000, send });
assert.equal(r.sent, 0, "same note is never sent twice");
r = await sendNote(kv, { campaignId: "n2", audience: "tech", budgetMs: 5000, send });
assert.equal(r.sent, 1, "a new note goes out, only to the chosen page's people");

// A failed send is retried, not marked as sent.
const kv2 = memoryKv();
await addFriend(kv2, "d@x.com", "tech");
r = await sendNote(kv2, { campaignId: "n1", audience: "all", budgetMs: 5000, send: async () => false });
assert.deepEqual({ sent: r.sent, failed: r.failed, remaining: r.remaining }, { sent: 0, failed: 1, remaining: 1 });
assert.equal(await wouldSend(kv2, "n1", "all"), 1);

// Coming back after unsubscribing turns the notes back on.
await addFriend(kv, "c@x.com", "tech");
assert.equal((await friendStats(kv)).unsubscribed, 0);

// The note text becomes safe, simple HTML.
const html = noteHtml("Hi <b>there</b>\n\nRead https://thewarthens.com/tech. Thanks", "https://thewarthens.com/unsubscribe?i=1&t=2");
assert.ok(html.includes("&lt;b&gt;") && !html.includes("<b>"));
assert.ok(html.includes('<a href="https://thewarthens.com/tech">'));
assert.ok(html.includes("Unsubscribe"));
console.log("stay-in-touch checks passed");
