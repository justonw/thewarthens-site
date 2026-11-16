// Checks that a build the person never received is given back exactly once, never while it is still running, and
// that the build counter text is right. Run: node --experimental-strip-types scripts/check-build-recovery.mts
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// The libraries import each other without file extensions, which Node cannot resolve, so they are copied to a
// temporary folder with those imports made explicit.
const dir = mkdtempSync(join(tmpdir(), "recovery-check-"));
const read = (f: string) => readFileSync(new URL(`../src/lib/${f}`, import.meta.url), "utf8");
writeFileSync(join(dir, "resume-limits.ts"), read("resume-limits.ts"));
writeFileSync(join(dir, "resume-builds.ts"), read("resume-builds.ts").replace('"./resume-limits"', '"./resume-limits.ts"'));
writeFileSync(join(dir, "resume-usage.ts"), read("resume-usage.ts"));
const L = await import(join(dir, "resume-limits.ts"));
const B = await import(join(dir, "resume-builds.ts"));
const U = await import(join(dir, "resume-usage.ts"));

let bad = 0;
function check(name: string, ok: boolean, got?: unknown) {
  if (!ok) { bad++; console.log("FAIL", name, JSON.stringify(got)); } else console.log("ok  ", name);
}
const opts = { unlimited: false, monthlyCap: 1000 };
const yes = async () => true;

// 1. a finished build the page never got is given back once
{
  const kv = L.memoryKv();
  const email = "a@example.com";
  await L.reserve(kv, email, opts);
  const mark = await B.startBuildMark(kv, "build-id-0000000001", email, false);
  await B.finishBuildMark(kv, mark);
  let refunds = 0;
  const hooks = { allow: yes, giveBack: async (paid: boolean) => { refunds++; await L.refund(kv, email, { unlimited: false, paid }); } };
  check("finished build is given back", (await B.recoverBuild(kv, "build-id-0000000001", email, hooks)) === "refunded");
  check("second ask gives back nothing more", (await B.recoverBuild(kv, "build-id-0000000001", email, hooks)) === "already" && refunds === 1, refunds);
  const again = await L.reserve(kv, email, opts);
  const second = await L.reserve(kv, email, opts);
  check("free builds are back to 2 after the give-back", again.ok && second.ok && (await L.reserve(kv, email, opts)).ok === false);
}

// 2. a running build is left alone, a dead one is given back
{
  const kv = L.memoryKv();
  const email = "b@example.com";
  await B.startBuildMark(kv, "build-id-0000000002", email, true, 1_000_000);
  const hooks = { allow: yes, giveBack: async () => {} };
  check("running build is pending", (await B.recoverBuild(kv, "build-id-0000000002", email, hooks, 1_000_000 + 30_000)) === "pending");
  check("a build that never finished is given back after 80 seconds", (await B.recoverBuild(kv, "build-id-0000000002", email, hooks, 1_000_000 + 90_000)) === "refunded");
}

// 3. a build that gave itself back cannot be given back again
{
  const kv = L.memoryKv();
  const email = "c@example.com";
  const mark = await B.startBuildMark(kv, "build-id-0000000003", email, false);
  check("the build's own give-back wins once", (await B.claimRefund(kv, mark)) === true);
  let refunds = 0;
  const r = await B.recoverBuild(kv, "build-id-0000000003", email, { allow: yes, giveBack: async () => { refunds++; } });
  check("the page's later request finds it already given back", r === "already" && refunds === 0, { r, refunds });
}

// 4. someone else's build id, an unknown id, and the daily limit
{
  const kv = L.memoryKv();
  const mark = await B.startBuildMark(kv, "build-id-0000000004", "d@example.com", false);
  await B.finishBuildMark(kv, mark);
  let refunds = 0;
  const hooks = { allow: yes, giveBack: async () => { refunds++; } };
  check("another address cannot claim it", (await B.recoverBuild(kv, "build-id-0000000004", "other@example.com", hooks)) === "none" && refunds === 0);
  check("an unknown id finds nothing", (await B.recoverBuild(kv, "build-id-9999999999", "d@example.com", hooks)) === "none");
  check("the daily limit stops a give-back", (await B.recoverBuild(kv, "build-id-0000000004", "d@example.com", { allow: async () => false, giveBack: async () => { refunds++; } })) === "limit" && refunds === 0);
  check("and it can still be given back later", (await B.recoverBuild(kv, "build-id-0000000004", "d@example.com", hooks)) === "refunded");
}

// 5. a paid build goes back to the balance
{
  const kv = L.memoryKv();
  const email = "e@example.com";
  await L.reserve(kv, email, opts);
  await L.reserve(kv, email, opts);
  await L.addCredits(kv, email, 5);
  const r = await L.reserve(kv, email, opts);
  const mark = await B.startBuildMark(kv, "build-id-0000000005", email, r.paid);
  await B.finishBuildMark(kv, mark);
  await B.recoverBuild(kv, "build-id-0000000005", email, { allow: yes, giveBack: (paid: boolean) => L.refund(kv, email, { unlimited: false, paid }) });
  check("the paid build is back in the balance", (await L.creditsLeft(kv, email)) === 5);
}

// 6. the counter text
check("free label", U.buildLabel({ kind: "free", number: 2, of: 2, left: 0 }) === "Free build 2 of 2");
check("paid label", U.buildLabel({ kind: "paid", number: 3, of: 15, left: 12 }) === "Paid build 3 of 15");
check("paid line", U.usageLine({ kind: "paid", number: 3, of: 15, left: 12 }) === "Paid build 3 of 15. 12 builds left.", U.usageLine({ kind: "paid", number: 3, of: 15, left: 12 }));
check("last build line", U.usageLine({ kind: "paid", number: 15, of: 15, left: 0 }).startsWith("Paid build 15 of 15. No builds left"));
check("unknown total falls back", U.usageLine({ kind: "paid", number: 0, of: null, left: 4 }) === "You have 4 builds left.");
check("email note only accepts the exact shape", U.BUILD_NOTE_RE.test("Paid build 3 of 15") && !U.BUILD_NOTE_RE.test("Paid build 3 of 15 <b>hi</b>") && !U.BUILD_NOTE_RE.test("anything else"));

console.log(bad ? `${bad} failed` : "all passed");
process.exit(bad ? 1 : 0);
