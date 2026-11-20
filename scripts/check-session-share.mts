// Checks the "use my session to improve this web application" copy (src/lib/session-share.ts): contact details and the person's
// own name are replaced, a copy is made only once per build, only its owner can stop sharing, and stopping really empties it.
//   node --experimental-strip-types scripts/check-session-share.mts
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The files import each other without a file extension, which Node cannot resolve, so they are copied to a temporary folder
// with that one import made explicit.
const dir = mkdtempSync(join(tmpdir(), "session-share-"));
writeFileSync(join(dir, "resume-limits.mts"), readFileSync(new URL("../src/lib/resume-limits.ts", import.meta.url), "utf8"));
writeFileSync(join(dir, "session-share.mts"), readFileSync(new URL("../src/lib/session-share.ts", import.meta.url), "utf8").replace('"./resume-limits"', '"./resume-limits.mts"'));
const share: any = await import(join(dir, "session-share.mts"));
const limits: any = await import(join(dir, "resume-limits.mts"));

let failed = 0;
const check = (label: string, ok: boolean) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}`);
  if (!ok) failed++;
};

const names = share.nameParts("Dana Reyes");
const text = "Dana Reyes, dana.reyes@example.com, (614) 555-0142, https://linkedin.com/in/danareyes, SSN 123-45-6789. Reyes led 11 agents at Brightcart.";
const scrubbed: string = share.scrub(text, names);
check("emails are replaced", !scrubbed.includes("@example.com") && scrubbed.includes("[email]"));
check("phone numbers are replaced", !scrubbed.includes("555-0142") && scrubbed.includes("[phone]"));
check("links are replaced", !scrubbed.includes("linkedin.com") && scrubbed.includes("[link]"));
check("ID-like numbers are replaced", !scrubbed.includes("123-45-6789"));
check("the person's full name and each part of it are replaced", !/Dana|Reyes/.test(scrubbed));
check("ordinary content (numbers, employers) is left alone", scrubbed.includes("11 agents") && scrubbed.includes("Brightcart"));
check("name parts skip tiny fragments", share.nameParts("Jo A").every((p: string) => p.length >= 2));

const deep: any = share.scrubDeep({ name: "Dana Reyes", contact: ["dana@example.com", "614-555-0142"], experience: [{ title: "Lead", bullets: ["Worked with Dana Reyes on onboarding"] }] }, names);
check("a finished resume loses its contact line and name", deep.contact.length === 0 && deep.name === "[name]" && !JSON.stringify(deep).includes("Dana"));

const kv = limits.memoryKv();
const id = "build-aaaaaaaaaaaaaaaaaaaa";
const mine = limits.emailKey("dana@example.com");
const parts = { resumeText: text, postingText: "Customer Success Manager. Apply at https://jobs.example.com/123", notes: "Call me at 614-555-0142", result: { postingTitle: "Customer Success Manager", postingCompany: "Lumen", resume: { name: "Dana Reyes", contact: ["dana@example.com"] } }, name: "Dana Reyes", hadFiles: false, email: "dana@example.com" };
check("a copy is saved once", (await share.saveShare(kv, id, mine, parts)) === true);
check("the same build cannot be saved twice", (await share.saveShare(kv, id, mine, parts)) === false);
const saved: any = (await kv.get(share.shareKey(id))).data;
check("the saved copy has no contact details or name (the masked label aside)", !/example\.com|555-0142|Dana|Reyes/.test(JSON.stringify({ ...saved, person: "" })));
check("the saved copy holds the email only as a one-way key and a masked label", saved.who === mine && saved.person === "d***@example.com" && !JSON.stringify(saved).includes("dana@example.com"));
const list: any[] = await share.listShares(kv);
check("the review list shows who, when, and which job", list.length === 1 && list[0].person === "d***@example.com" && list[0].title === "Customer Success Manager" && list[0].company === "Lumen" && list[0].state === "shared");
check("the review list carries no resume text", !JSON.stringify(list).includes("Brightcart"));

check("someone else cannot stop it", (await share.withdrawShare(kv, id, limits.emailKey("other@example.com"))) === "none" && (await kv.get(share.shareKey(id))).data.state === "shared");
check("an unknown build answers 'none'", (await share.withdrawShare(kv, "build-bbbbbbbbbbbbbbbbbbbb", mine)) === "none");
check("its owner can stop it", (await share.withdrawShare(kv, id, mine)) === "withdrawn");
const after: any = (await kv.get(share.shareKey(id))).data;
check("stopping empties the copy", after.state === "withdrawn" && !("resumeText" in after) && !("result" in after));
const listAfter: any[] = await share.listShares(kv);
check("a stopped copy shows as stopped, with no person or job", listAfter.length === 1 && listAfter[0].state === "withdrawn" && listAfter[0].person === "" && listAfter[0].title === "");
check("stopping twice is fine", (await share.withdrawShare(kv, id, mine)) === "withdrawn");

if (failed) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
