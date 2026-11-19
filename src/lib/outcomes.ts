// Outcome tracking: for each job the person applied to, where it stands now (waiting, phone screen, interview, offer, or
// not selected), and what the whole list says about what seems to be working. Everything is worked out on the person's
// own device from their own saved applications; nothing is sent anywhere. The patterns come from small numbers, so they
// are shown as hints, only when there are enough applications on both sides to compare, and never as proof.
//
// This file stands on its own (type imports only) so a script can test it without a build.
import type { LibraryEntry } from "./resume-library";

export type Result = "" | "phone" | "interview" | "offer" | "rejected";

// "" is "still waiting". Each stage also says which status it sets in the job tracker, so the two stay in step.
export const RESULTS: { id: Result; label: string; tracker: "Applied" | "Phone Screen" | "Interview" | "Offer Received" | "Rejected" }[] = [
  { id: "", label: "Waiting", tracker: "Applied" },
  { id: "phone", label: "Phone screen", tracker: "Phone Screen" },
  { id: "interview", label: "Interview", tracker: "Interview" },
  { id: "offer", label: "Offer", tracker: "Offer Received" },
  { id: "rejected", label: "Not selected", tracker: "Rejected" },
];

export const isResult = (v: unknown): v is Result => RESULTS.some((r) => r.id === v);

// Any answer at all, including a "no", means the company got back to them.
export const heardBack = (r: Result) => r !== "";
// They got to talk to someone: a phone screen, an interview, or an offer.
export const reachedConversation = (r: Result) => r === "phone" || r === "interview" || r === "offer";

export function daysSince(iso: string, now = new Date()): number {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? Math.max(0, Math.floor((now.getTime() - t) / 86_400_000)) : 0;
}

export type Summary = { applied: number; waiting: number; heard: number; conversations: number; offers: number; notSelected: number };

export function summarize(entries: LibraryEntry[]): Summary {
  const applied = entries.filter((e) => e.status === "applied");
  return {
    applied: applied.length,
    waiting: applied.filter((e) => !heardBack(e.result)).length,
    heard: applied.filter((e) => heardBack(e.result)).length,
    conversations: applied.filter((e) => reachedConversation(e.result)).length,
    offers: applied.filter((e) => e.result === "offer").length,
    notSelected: applied.filter((e) => e.result === "rejected").length,
  };
}

export type Group = { n: number; heard: number };
export type Insight = { id: string; label: string; withIt: Group; without: Group };

// Things the person did differently from one application to the next, as questions about each job.
const FACTORS: { id: string; label: string; test: (e: LibraryEntry, numbers: number) => boolean }[] = [
  { id: "letter", label: "wrote a cover letter", test: (e) => e.letter !== null },
  { id: "message", label: "wrote to someone at the company", test: (e) => e.messages.some((m) => m.purpose !== "followup") },
  { id: "followup", label: "followed up after applying", test: (e) => e.followedUpAt !== "" },
  { id: "numbers", label: "had numbers in most bullets", test: (_e, numbers) => numbers >= 0.7 },
];

const rate = (g: Group) => (g.n === 0 ? 0 : g.heard / g.n);

// What seems to go with a reply. A factor is shown only when at least `minEach` applications fall on each side of it.
// `numbersShare` gives the share of an application's bullets that show a number (0 to 1).
export function insights(entries: LibraryEntry[], numbersShare: (e: LibraryEntry) => number, minEach = 3, max = 3): Insight[] {
  const applied = entries.filter((e) => e.status === "applied");
  const out: Insight[] = [];
  for (const f of FACTORS) {
    const withIt: Group = { n: 0, heard: 0 };
    const without: Group = { n: 0, heard: 0 };
    for (const e of applied) {
      const g = f.test(e, numbersShare(e)) ? withIt : without;
      g.n += 1;
      if (heardBack(e.result)) g.heard += 1;
    }
    if (withIt.n >= minEach && without.n >= minEach) out.push({ id: f.id, label: f.label, withIt, without });
  }
  return out.sort((a, b) => Math.abs(rate(b.withIt) - rate(b.without)) - Math.abs(rate(a.withIt) - rate(a.without))).slice(0, max);
}

// One plain sentence for an insight, such as "When you wrote to someone at the company: 3 of 4 heard back, against 1 of 5 without."
export function insightSentence(i: Insight): string {
  const d = rate(i.withIt) - rate(i.without);
  const lead = `When you ${i.label}: ${i.withIt.heard} of ${i.withIt.n} heard back`;
  const tail = `${i.without.heard} of ${i.without.n} when you didn't`;
  return `${lead}, against ${tail}.${Math.abs(d) < 0.1 ? " About the same." : ""}`;
}
