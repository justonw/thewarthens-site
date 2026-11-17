// Search-result titles and descriptions for pages whose on-page headline is too long or too vague for a search result.
// A title should be about 60 characters or fewer, and a description about 120 to 160, or Google cuts them off.
// The on-page headline does not change; these are only what shows in search results and link previews.

export type SeoText = { title: string; description: string };

const BRAND = " | The Warthens";

// Adds the brand name when it still fits in a search result.
export function searchTitle(t: string) {
  return t.length + BRAND.length <= 60 ? `${t}${BRAND}` : t;
}

export const techGuideSeo: Record<string, SeoText> = {
  "tech-sales-hype-vs-reality": {
    title: "Is Tech Sales Worth It in 2026? Hype vs. Reality",
    description: "Is tech sales worth it in 2026? What training marketing claims, checked against real SDR data, industry reports, and what working reps say.",
  },
  "software-engineering-hype-vs-reality": {
    title: "Is Software Engineering Still a Good Career in 2026?",
    description: "Is software engineering still a good career? What bootcamps claim, checked against placement data, BLS numbers, and research on AI and entry-level jobs.",
  },
  "cybersecurity-hype-vs-reality": {
    title: "Is There a Cybersecurity Talent Shortage? A Reality Check",
    description: "Is there really a cybersecurity talent shortage? What cert and training marketing claims, checked against hiring data and what a CISA advisor has said.",
  },
};

export const startHereSeo: Record<string, SeoText> = {
  "tech-sales": {
    title: "How to Break Into Tech Sales With No Experience",
    description: "A free, in-order path to find out if tech sales fits you and how to get your first role, plus where a paid program fits in. Real steps, no hype.",
  },
  cybersecurity: {
    title: "How to Get Into Cybersecurity: A Free Step-by-Step Path",
    description: "A concrete, in-order path to learn real cybersecurity fundamentals for free, plus honest advice on where a paid cert or program fits in.",
  },
  coding: {
    title: "How to Start Learning to Code: A Free Step-by-Step Path",
    description: "A concrete, in-order path to start coding for real with free resources, plus honest advice on where a paid bootcamp fits in and when to skip it.",
  },
  "data-analytics": {
    title: "How to Become a Data Analyst: A Free Step-by-Step Path",
    description: "A concrete, in-order path to build real data analyst skills with free resources, plus honest advice on where a paid course fits in.",
  },
};

export const faithWritingSeo: Record<string, SeoText> = {
  "is-tithing-biblical": {
    title: "Is Tithing Biblical? A Verse-by-Verse Study",
    description: "What happened when I finally studied tithing for myself, verse by verse, instead of just accepting what I was taught. A personal, scriptural look.",
  },
  "this-thing-is-spiritual": {
    title: "This Thing Is Spiritual: Trusting the Spirit in Change",
    description: "Everything we experience is spiritual first. A reflection on trusting the Spirit over intellect and emotion to find true focus in the middle of change.",
  },
  "the-widows-mite-in-context": {
    title: "The Widow's Mite in Context: What It Teaches About Giving",
    description: "The rich young ruler, the widow's mite, Malachi 3, and Acts 4 in full context: what Scripture says about giving, a follow-up to our first tithing study.",
  },
  "answering-common-tithing-arguments": {
    title: "Is Tithing Required? Common Arguments Answered",
    description: "Real pushback we received on tithing, answered one claim at a time: the storehouse, the whole Law, seed-faith giving, and how widespread these teachings are.",
  },
  "did-paul-wait-14-years-to-preach": {
    title: "Did Paul Wait 14 Years Before Preaching? What Acts Says",
    description: "A popular teaching says you must wait for someone's approval before ministering. We checked it against what Acts and Galatians say about Paul's timeline.",
  },
};
