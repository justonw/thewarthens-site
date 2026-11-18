// Checks extra builds for particular emails. Run: node --experimental-strip-types scripts/check-grants.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const dir = mkdtempSync(join(tmpdir(), "grants-check-"));
const read = (f: string) => readFileSync(new URL(`../src/lib/${f}`, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-limits.ts"), read("resume-limits.ts"));
writeFileSync(join(dir, "resume-grants.ts"), read("resume-grants.ts").replace('"./resume-limits"', '"./resume-limits.ts"'));
const { memoryKv, reserve, refund } = await import(join(dir, "resume-limits.ts"));
const { buildStatus, grantBuilds } = await import(join(dir, "resume-grants.ts"));

const kv = memoryKv();
const opts = { unlimited: false, monthlyCap: 1000 };
// A stranger: 2 free builds, then stopped.
assert.equal((await reserve(kv, "x@x.com", opts)).ok, true);
assert.equal((await reserve(kv, "x@x.com", opts)).ok, true);
assert.deepEqual(await reserve(kv, "x@x.com", opts), { ok: false, reason: "limit" });

// Someone given 3 extra builds gets 2 free + 3 = 5, matched case-insensitively, and the 6th is stopped.
await grantBuilds(kv, "Friend@Example.com", 3, "beta tester");
assert.deepEqual(await buildStatus(kv, "friend@example.com"), { email: "friend@example.com", freeLeft: 2, extraLeft: 3, buildsMade: 0 });
let made = 0;
for (let i = 0; i < 6; i++) if ((await reserve(kv, "friend@example.com", opts)).ok) made++;
assert.equal(made, 5);
assert.deepEqual(await buildStatus(kv, "FRIEND@example.com"), { email: "friend@example.com", freeLeft: 0, extraLeft: 0, buildsMade: 5 });

// A failed build gives the extra build back, and a second grant adds on.
await grantBuilds(kv, "friend@example.com", 2);
const r = await reserve(kv, "friend@example.com", opts);
assert.equal(r.ok && r.paid, true);
await refund(kv, "friend@example.com", { unlimited: false, paid: true });
assert.equal((await buildStatus(kv, "friend@example.com")).extraLeft, 2);
// Other addresses are not affected.
assert.equal((await buildStatus(kv, "x@x.com")).extraLeft, 0);
console.log("grant checks passed");
