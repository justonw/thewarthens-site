// Checks the emailed-copies rule: 2 copies per build, pooled per address (free: 2 builds = 4 copies; paid builds add 2 each).
// Run: node --experimental-strip-types scripts/check-email-allowance.mts
import { addCredits, bumpCounter, copiesAllowed, emailKey, mailedKey, memoryKv, refund, reserve } from "../src/lib/resume-limits.ts";

let bad = 0;
function check(name: string, ok: boolean, got?: unknown) {
  if (!ok) { bad++; console.log("FAIL", name, JSON.stringify(got)); } else console.log("ok  ", name);
}
const kv = memoryKv();
const email = "someone@example.com";
const opts = { unlimited: false, monthlyCap: 1000 };
async function freeUsed() {
  return (await kv.has(emailKey(email))) ? Number(((await kv.get(emailKey(email)))?.data as { n: number }).n) : 0;
}
async function sendCopies(howMany: number) {
  let sent = 0;
  for (let i = 0; i < howMany; i++) {
    const allowed = await copiesAllowed(kv, email, await freeUsed());
    if ((await bumpCounter(kv, mailedKey(email), 1, allowed)) !== null) sent++;
  }
  return sent;
}

await reserve(kv, email, opts);
await reserve(kv, email, opts);
check("2 free builds allow 4 copies", (await copiesAllowed(kv, email, await freeUsed())) === 4);
check("copies stop at 4", (await sendCopies(6)) === 4);
const none = await reserve(kv, email, opts);
check("third build refused without credits", !none.ok);
await addCredits(kv, email, 15);
for (let i = 0; i < 3; i++) await reserve(kv, email, opts);
check("5 builds allow 10 copies, 4 already sent, so 6 more", (await sendCopies(10)) === 6);
const r = await reserve(kv, email, opts);
if (r.ok) await refund(kv, email, { unlimited: false, paid: r.paid });
check("a refunded build gives its copies back", (await copiesAllowed(kv, email, await freeUsed())) === 10);
console.log(bad ? `${bad} failed` : "all passed");
process.exit(bad ? 1 : 0);
