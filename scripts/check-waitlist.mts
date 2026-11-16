// Checks the waitlist: addresses are saved once, everyone is told exactly once, failures are retried, and a long list
// can be finished over several calls. Run: node --experimental-strip-types scripts/check-waitlist.mts
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// The library imports its neighbour without a file extension, which Node cannot resolve, so both files are copied
// to a temporary folder with that one import made explicit.
const dir = mkdtempSync(join(tmpdir(), "waitlist-check-"));
const read = (f: string) => readFileSync(new URL(`../src/lib/${f}`, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-limits.ts"), read("resume-limits.ts"));
writeFileSync(join(dir, "resume-waitlist.ts"), read("resume-waitlist.ts").replace('"./resume-limits"', '"./resume-limits.ts"'));
const { memoryKv } = await import(join(dir, "resume-limits.ts"));
const { addToWaitlist, notifyWaitlist, waitlistCounts } = await import(join(dir, "resume-waitlist.ts"));

let bad = 0;
function check(name: string, ok: boolean, got?: unknown) {
  if (!ok) { bad++; console.log("FAIL", name, JSON.stringify(got)); } else console.log("ok  ", name);
}

const kv = memoryKv();
await addToWaitlist(kv, "a@example.com");
await addToWaitlist(kv, "B@Example.com");
await addToWaitlist(kv, "a@example.com");
await addToWaitlist(kv, " c@example.com ");
let c = await waitlistCounts(kv);
check("3 distinct addresses (repeat and case ignored)", c.total === 3 && c.waiting === 3, c);

const got: string[] = [];
let r = await notifyWaitlist(kv, async (e) => { got.push(e); return e !== "b@example.com"; }, { budgetMs: 5000 });
check("2 sent, 1 failed and kept for retry", r.sent === 2 && r.failed === 1 && r.remaining === 1, r);

r = await notifyWaitlist(kv, async (e) => { got.push(e); return true; }, { budgetMs: 5000 });
check("retry sends only the failed one", r.sent === 1 && r.remaining === 0 && got.filter((e) => e === "a@example.com").length === 1, { r, got });

r = await notifyWaitlist(kv, async (e) => { got.push(e); return true; }, { budgetMs: 5000 });
check("a third run sends nobody", r.sent === 0 && r.remaining === 0, r);

const kv2 = memoryKv();
for (let i = 0; i < 6; i++) await addToWaitlist(kv2, `p${i}@example.com`);
r = await notifyWaitlist(kv2, async () => { await new Promise((x) => setTimeout(x, 30)); return true; }, { budgetMs: 70 });
check("time budget stops early and reports what is left", r.sent > 0 && r.sent < 6 && r.remaining === 6 - r.sent, r);
r = await notifyWaitlist(kv2, async () => true, { budgetMs: 5000 });
check("the rest are finished on the next call", r.remaining === 0 && (await waitlistCounts(kv2)).waiting === 0, r);

console.log(bad ? `${bad} failed` : "all passed");
process.exit(bad ? 1 : 0);
