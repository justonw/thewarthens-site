// Checks the "Reach out" message builder: what goes to the AI (never the contact line, always the "do not claim" list),
// and what comes back (dashes removed, connection note held to LinkedIn's 300 characters, nothing usable is never shown).
// Run after any change to src/lib/outreach.ts:
//   node --experimental-strip-types scripts/check-outreach.mts
import { buildOutreachRequest, fitNote, looksLikeOnlyLink, parseOutreachResponse, plain, NOTE_LIMIT } from "../src/lib/outreach.ts";

const doc: any = {
  name: "Dana Rivers", headline: "Customer Success Lead",
  contact: ["Atlanta, GA", "(555) 123-4567", "dana@example.com"],
  summary: "Onboarding lead.", skills: [{ label: "Tools", items: "Zendesk" }],
  experience: [{ title: "Onboarding Specialist", company: "Acme", location: "", dates: "2022 - 2026", bullets: ["Onboarded 40 accounts at a time."] }],
  training: [], education: [],
};
const base: any = {
  purpose: "intro", daysSince: 7, relationship: "",
  audience: "manager", doc, postingTitle: "Customer Success Lead", postingCompany: "Globex", postingKeywords: ["onboarding", "renewals"],
  fitReason: "Strong on onboarding.", unmet: ["Salesforce administration"], recipientName: "Sam Lee", recipientText: "", recipientFiles: [], tweak: "", previous: null,
};

let failed = 0;
const check = (label: string, ok: boolean) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}`);
  if (!ok) failed++;
};

const req: any = buildOutreachRequest(base, "claude-sonnet-5-5");
const text = JSON.stringify(req.messages);
check("contact line is not sent", !text.includes("123-4567") && !text.includes("dana@example.com"));
check("resume is sent", text.includes("Onboarded 40 accounts"));
check("unconfirmed requirements are listed as do-not-claim", text.includes("not_confirmed") && text.includes("Salesforce administration"));
check("no profile text means the posting is the basis", text.includes("did not add anything about the person"));
check("forced tool only for haiku", req.tool_choice.type === "auto" && (buildOutreachRequest(base, "claude-haiku-5-5") as any).tool_choice.type === "tool");
const withMaterial: any = buildOutreachRequest({ ...base, recipientText: "Jamie leads onboarding.", recipientFiles: [{ kind: "image", mediaType: "image/jpeg", data: "AAAA".repeat(20) }] }, "m");
check("profile text and screenshot are sent", JSON.stringify(withMaterial.messages).includes("<about_the_person>") && JSON.stringify(withMaterial.messages).includes('"type":"image"'));
const tweaked: any = buildOutreachRequest({ ...base, tweak: "shorter", previous: { note: "Old note.", message: "Old message." } }, "m");
check("a tweak carries the previous version", JSON.stringify(tweaked.messages).includes("<previous_version>") && JSON.stringify(tweaked.messages).includes("a third shorter"));

const withImpl: any = buildOutreachRequest({ ...base, implication: true }, "claude-sonnet-5-5");
check("visitors do not get the implication clause", !req.system.includes("Peer-professional implication"));
check("the owner can turn the implication clause on", withImpl.system.startsWith(req.system) && withImpl.system.includes("Peer-professional implication") && withImpl.system.includes("one professional to another") || withImpl.system.includes("professional to another professional"));
check("the implication clause is skipped for a follow-up and for a friend", !(buildOutreachRequest({ ...base, implication: true, purpose: "followup" }, "m") as any).system.includes("Peer-professional implication") && !(buildOutreachRequest({ ...base, implication: true, audience: "friend" }, "m") as any).system.includes("Peer-professional implication"));
check("the clause is hedged, general, and never about their own team", withImpl.system.includes("tends to") && withImpl.system.includes("never the reader's own team") && withImpl.system.includes("No numbers"));
check("everyone is told to name a group in full words", req.system.includes('never a clipped shorthand like "on your grade"'));

const friend: any = buildOutreachRequest({ ...base, audience: "friend", relationship: "we worked together at Northline" }, "m");
check("a friend request carries how they know each other, as the person's own words", JSON.stringify(friend.messages).includes("<relationship>we worked together at Northline</relationship>"));
const friendBlank: any = buildOutreachRequest({ ...base, audience: "friend" }, "m");
check("with nothing said, the relationship stays general", JSON.stringify(friendBlank.messages).includes("did not say how they know this person"));
check("the referral rules are in the prompt", friend.system.includes("introduction or a referral") && friend.system.includes("never invent shared history"));
const follow: any = buildOutreachRequest({ ...base, purpose: "followup", daysSince: 6 }, "m");
check("a follow-up says how long ago they applied", JSON.stringify(follow.messages).includes("FOLLOW-UP") && JSON.stringify(follow.messages).includes("about 6 days ago"));
check("a follow-up does not ask for the person's profile", !JSON.stringify(follow.messages).includes("did not add anything about the person"));
check("no guessing pronouns and no assumed time since they spoke", friend.system.includes("Never use he, she, him, her, his, or they for the job seeker") && friend.system.includes("never say how long it has been"));
check("the follow-up rules are in the prompt", follow.system.includes("brief, polite check-in") && follow.system.includes("never suggest the company owes a reply"));
check("em and en dashes become commas", plain("Led onboarding — and renewals – well", 200) === "Led onboarding, and renewals, well");
check("number ranges keep a hyphen", plain("2020–2022", 50) === "2020-2022");

const long = "I ran onboarding for forty accounts. That cut handoff delays by half. " + "I would like to share how we did it with you. ".repeat(6);
check("a long note is cut to whole sentences within the limit", fitNote(long).length > 0 && fitNote(long).length <= NOTE_LIMIT && /[.!?]$/.test(fitNote(long)));
check("one endless sentence cannot be fitted", fitNote("word ".repeat(80) + ".") === "");
check("a short note is left alone", fitNote("Short note here, well within the limit.") === "Short note here, well within the limit.");

const good = {
  content: [{ type: "tool_use", name: "write_outreach", input: {
    recipient: { name: "Sam Lee", role: "Head of Support", company: "Globex" }, noticed: "Built on Sam leading support, from the profile you added.", basedOn: "profile",
    note: "Saw you lead support at Globex. I ran onboarding for 40 accounts at once and kept handoffs clean. Open to a short question about your team's priority?",
    subject: "Onboarding at Globex", message: "Hi Sam,\n\nYour team is hiring a lead while support volume is growing, which often strains onboarding. I handled onboarding for 40 accounts at a time and kept handoffs smooth. Happy to share how if useful.\n\nDana",
  } }],
};
const parsed = parseOutreachResponse(good);
check("a good answer parses", !!parsed && parsed.basedOn === "profile" && parsed.recipient.name === "Sam Lee");
check("a bad answer is refused", parseOutreachResponse({ content: [{ type: "tool_use", name: "write_outreach", input: { note: "x", message: "y" } }] }) === null);
check("no tool call is refused", parseOutreachResponse({ content: [{ type: "text", text: "hello" }] }) === null);
check("an unknown basis falls back to posting", parseOutreachResponse({ content: [{ type: "tool_use", name: "write_outreach", input: { ...good.content[0].input, basedOn: "guess" } }] })?.basedOn === "posting");

check("a lone link is detected", looksLikeOnlyLink("https://www.linkedin.com/in/jamie-a/") && looksLikeOnlyLink("www.linkedin.com/in/jamie"));
check("profile text with a link is not a lone link", !looksLikeOnlyLink("Jamie leads onboarding. https://x.com/jamie"));

if (failed) {
  console.log(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
