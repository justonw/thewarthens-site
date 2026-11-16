// Checks the contact safety net: an email, phone number, and LinkedIn address are found in plain text and added only
// when the contact line lacks them. Run: node --experimental-strip-types scripts/check-contact-fill.mts
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// The library re-exports from a path without an extension, which Node cannot resolve, so that line is removed.
const lib = readFileSync(new URL("../src/lib/resume-tailor.ts", import.meta.url), "utf8").split("\n").filter((l) => !l.includes('from "./resume-input-limits"')).join("\n");
const tmp = join(tmpdir(), "resume-tailor-contact-under-test.mts");
writeFileSync(tmp, lib);
const { addMissingContact, contactFromText, contactGaps } = await import(tmp);

let bad = 0;
function check(name: string, ok: boolean, got?: unknown) {
  if (!ok) { bad++; console.log("FAIL", name, JSON.stringify(got)); } else console.log("ok  ", name);
}

const text = "JUSTON WARTHEN\nCONTACT\n(504) 377-4584\nAtlanta, GA\njustonwarthen@gmail.com\nlinkedin.com/in/justonwarthen\n";
const found = contactFromText(text, []);
check("finds email, phone, linkedin", found.includes("justonwarthen@gmail.com") && found.includes("(504) 377-4584") && found.some((f) => f.includes("linkedin.com/in/justonwarthen")), found);
check("gaps on empty", contactGaps([]).email && contactGaps([]).phone);
check("no gaps when present", !contactGaps(["a@b.co", "(504) 377-4584"]).email && !contactGaps(["a@b.co", "(504) 377-4584"]).phone);
check("adds only what is missing", JSON.stringify(addMissingContact(["Atlanta, GA", "a@b.co"], ["other@x.com", "(504) 377-4584"])) === JSON.stringify(["Atlanta, GA", "a@b.co", "(504) 377-4584"]), addMissingContact(["Atlanta, GA", "a@b.co"], ["other@x.com", "(504) 377-4584"]));
check("nothing found in blank text", contactFromText("no details here", []).length === 0);
console.log(bad ? `${bad} failed` : "all passed");
process.exit(bad ? 1 : 0);
