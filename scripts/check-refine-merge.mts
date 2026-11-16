// Checks that "I have this" can only ADD to a resume: whatever the AI sends back, the contact line, education,
// training, headline, and every job's dates stay as they were. Run after any change to mergeRefined:
//   node --experimental-strip-types scripts/check-refine-merge.mts
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// The library file re-exports from a path without an extension, which Node cannot resolve, so that one line is removed.
const lib = readFileSync(new URL("../src/lib/resume-tailor.ts", import.meta.url), "utf8").split("\n").filter((l) => !l.includes('from "./resume-input-limits"')).join("\n");
const tmp = join(tmpdir(), "resume-tailor-under-test.mts");
writeFileSync(tmp, lib);
const { mergeRefined } = await import(tmp);
const original: any = {
  name: "Juston Warthen", headline: "Account Executive, New Business Sales",
  contact: ["Atlanta, GA", "(504) 377-4584", "justonwarthen@gmail.com", "linkedin.com/in/justonwarthen"],
  summary: "B2B sales professional with 5 years of full-cycle experience.",
  skills: [{ label: "Sales", items: "Full Cycle B2B Sales" }, { label: "Tools", items: "Salesforce, HubSpot" }],
  experience: [
    { title: "Customer Success Manager", company: "Wonderly", location: "", dates: "Aug 2026 - Present", bullets: ["Advise owners and operators in remodeling.", "Lead qualification for net-new prospects."] },
    { title: "Co-Founder", company: "Tech Journey with The Warthens", location: "", dates: "Sep 2022 - Present", bullets: ["Helped grow the YouTube channel to 4,000+ subscribers."] },
  ],
  training: [{ name: "Technology Sales", detail: "CourseCareers", dates: "" }],
  education: [{ school: "International Bible Institute", credential: "Bachelor of Biblical Ministries", dates: "" }],
};
// A badly behaved AI answer: forgets contact, education, training, a job's dates; rewords a bullet; adds the new bullet.
const refined: any = {
  name: "Juston Warthen", headline: "Account Executive", contact: [], summary: "",
  skills: [{ label: "Tools", items: "Salesforce, HubSpot, Google Ads, Meta Ads" }],
  experience: [
    { title: "Customer Success Manager", company: "Wonderly", location: "", dates: "", bullets: ["Advise owners and operators in remodeling and construction.", "Lead qualification for net-new prospects.", "Ran freelance digital advertising campaigns on Google Ads and Meta Ads."] },
  ],
  training: [], education: [],
};
const out: any = mergeRefined(original, refined);
const checks: [string, boolean][] = [
  ["contact kept", out.contact.length === 4 && out.contact.includes("justonwarthen@gmail.com")],
  ["education kept", out.education.length === 1],
  ["training kept", out.training.length === 1],
  ["headline kept", out.headline === original.headline],
  ["job dates kept", out.experience[0].dates === "Aug 2026 - Present"],
  ["second job kept with dates", out.experience.length === 2 && out.experience[1].dates === "Sep 2022 - Present"],
  ["original bullets kept as written", out.experience[0].bullets[0] === original.experience[0].bullets[0]],
  ["reworded copy not duplicated", out.experience[0].bullets.filter((b: string) => /Advise owners/.test(b)).length === 1],
  ["new bullet added", out.experience[0].bullets.some((b: string) => /freelance digital advertising/.test(b))],
  ["skills group restored", out.skills.some((g: any) => g.label === "Sales")],
  ["new skills added", out.skills.find((g: any) => g.label === "Tools").items.includes("Google Ads")],
  ["summary kept when AI sent none", out.summary === original.summary],
];
let bad = 0;
for (const [name, ok] of checks) { console.log(ok ? "PASS" : "FAIL", name); if (!ok) bad++; }
process.exit(bad ? 1 : 0);
