// Guards the legal pages so something unfinished or untrue cannot be published by accident.
//   node --experimental-strip-types scripts/check-legal.mts
//
// Always checks: no company names in the policy text (kinds of providers only), no em dashes, no address, and no promise of a
// timed deletion of our own records (the code does not delete anything on a schedule). Also fails if LEGAL_DRAFT is false
// while any [BLANK] is still in the text.
import assert from "node:assert/strict";
import { CONTACT_EMAIL, EFFECTIVE, LEGAL_DRAFT, legalDocs, privacy, refunds, terms, type Block } from "../src/lib/legal-content.ts";

const textOf = (b: Block): string => ("p" in b ? b.p : "sub" in b ? b.sub : b.bullets.join("\n"));
const all = legalDocs.map((d) => [d.title, d.intro, d.effective, ...d.sections.flatMap((s) => [s.heading, ...s.blocks.map(textOf)])].join("\n")).join("\n\n");

// Kinds of providers, never names. (Real names live in docs/legal/third-parties.json.)
for (const name of ["Anthropic", "Claude", "Resend", "Stripe", "Netlify", "YouTube", "GitHub"]) {
  assert.ok(!all.toLowerCase().includes(name.toLowerCase()), `the legal text names a provider: ${name}`);
}
assert.ok(!all.includes("—") && !all.includes("–"), "no em or en dashes");
assert.ok(!/\bP\.?O\.? Box\b|\bSuite\b|\bStreet\b|\bAvenue\b/i.test(all), "no postal address in the text");
assert.ok(all.includes(CONTACT_EMAIL), "the contact email is in the text");
assert.ok(/Georgia/.test(terms.sections.map((s) => s.blocks.map(textOf).join(" ")).join(" ")), "terms name Georgia law");
assert.ok(/November 20, 2026|Effective/.test(EFFECTIVE));

// The code deletes nothing on a schedule, so the text must not promise a timed deletion of our own records.
assert.ok(!/(deleted|delete them|deleted automatically) (after|within|in) \d+ (days|months|years)/i.test(all.replace(/our AI provider[^.]*\./gi, "").replace(/our email service[^.]*\./gi, "")), "no promise of timed deletion of our own records");

// Facts that must stay in step with the provider terms and the code.
const privacyText = privacy.sections.map((s) => s.blocks.map(textOf).join(" ")).join(" ");
assert.ok(privacyText.includes("within 30 days"), "AI provider retention fact present");
assert.ok(privacyText.includes("do not use what you send us to train") || privacyText.includes("We do not use what you send us to train"), "no-training promise present");
assert.ok(refunds.sections[0].blocks.map(textOf).join(" ").includes("all sales are final"), "all sales final");

// Nothing unfinished goes live.
const blanks = all.match(/\[[^\]]+\]/g) ?? [];
if (!LEGAL_DRAFT) assert.equal(blanks.length, 0, `LEGAL_DRAFT is false but ${blanks.length} [BLANK](s) remain: ${blanks.slice(0, 3).join(", ")}`);
console.log(`legal text checks passed (${blanks.length} blank${blanks.length === 1 ? "" : "s"} left, draft mode ${LEGAL_DRAFT ? "on" : "off"})`);
