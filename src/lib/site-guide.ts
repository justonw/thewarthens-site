// The words and map behind the site guide (the chat bubble in the corner of the site).
// The guide is a set of questions with button answers, plus a small keyword search. It does not
// use AI, it does not send anything anywhere, and it does not remember what a visitor typed.
//
// Adding a page: add one entry to `searchIndex`. To put it in the conversation, add a choice to
// a node below. Every `href` must be a real page, and every #section must be a real id on that
// page. Run the link check described in the guide's component file after any change.
// Plain words, no em dashes.

export type GuideChoice = {
  emoji: string;
  label: string;
  /** Go to another question. */
  next?: string;
  /** Or take the visitor straight to a page or a section of a page. */
  href?: string;
  /** What the guide says right before it takes them there. */
  say?: string;
  /** Or open the search box. */
  action?: "search";
};

export type GuideNode = { say: string; choices: GuideChoice[] };

export const GUIDE_START = "start";

export const guideWelcome = "Hi, I'm the guide for The Warthens. 👋 What brings you here today?";

export const guideNodes: Record<string, GuideNode> = {
  start: {
    say: guideWelcome,
    choices: [
      { emoji: "💼", label: "I want a career in tech", next: "tech" },
      { emoji: "🙏", label: "I'm exploring faith", next: "faith" },
      { emoji: "🧒🏽", label: "I'm looking for something for my kids", next: "kids" },
      { emoji: "🤝", label: "I'd like 1:1 coaching", next: "coaching" },
      { emoji: "🔎", label: "I'm looking for something specific", action: "search" },
    ],
  },

  tech: {
    say: "Great. Where are you in your tech journey?",
    choices: [
      { emoji: "🌱", label: "Brand new. Where do I start?", next: "techStart" },
      {
        emoji: "🧭",
        label: "Help me pick a path",
        href: "/tech#quiz",
        say: "Taking you to the career quiz.",
      },
      { emoji: "📖", label: "Is it worth it? Give me the honest take", next: "techGuides" },
      {
        emoji: "💵",
        label: "What do these jobs pay?",
        href: "/tech#pay",
        say: "Here is the pay snapshot.",
      },
      { emoji: "🛠️", label: "Resume, job tracker, and free learning", next: "techTools" },
      { emoji: "💬", label: "I'd like help from a real person", next: "coaching" },
    ],
  },
  techStart: {
    say: "Which role sounds the most like you?",
    choices: [
      {
        emoji: "📞",
        label: "Tech sales: talking with people",
        href: "/tech/start-here/tech-sales",
        say: "Opening the tech sales starter guide.",
      },
      {
        emoji: "🛡️",
        label: "Cybersecurity and IT",
        href: "/tech/start-here/cybersecurity",
        say: "Opening the cybersecurity starter guide.",
      },
      {
        emoji: "💻",
        label: "Coding and software",
        href: "/tech/start-here/coding",
        say: "Opening the coding starter guide.",
      },
      {
        emoji: "📊",
        label: "Data and analytics",
        href: "/tech/start-here/data-analytics",
        say: "Opening the data and analytics starter guide.",
      },
      {
        emoji: "🤷",
        label: "I'm not sure yet",
        href: "/tech#quiz",
        say: "No problem. The career quiz will help.",
      },
    ],
  },
  techGuides: {
    say: "Here are our honest guides: what the marketing says, and what the data and real people say. Which role?",
    choices: [
      {
        emoji: "📞",
        label: "Tech sales (SDR)",
        href: "/tech/guides/tech-sales-hype-vs-reality",
        say: "Opening the tech sales guide.",
      },
      {
        emoji: "💻",
        label: "Software engineering",
        href: "/tech/guides/software-engineering-hype-vs-reality",
        say: "Opening the software engineering guide.",
      },
      {
        emoji: "🛡️",
        label: "Cybersecurity and IT",
        href: "/tech/guides/cybersecurity-hype-vs-reality",
        say: "Opening the cybersecurity guide.",
      },
    ],
  },
  techTools: {
    say: "These are free. Which one do you want?",
    choices: [
      {
        emoji: "📄",
        label: "Resume and LinkedIn checklist",
        href: "/tech#checklist",
        say: "Here is the checklist.",
      },
      {
        emoji: "📌",
        label: "Job application tracker",
        href: "/tech#tracker",
        say: "Here is the job tracker.",
      },
      {
        emoji: "🎓",
        label: "Free places to learn",
        href: "/tech#learn",
        say: "Here are the free resources.",
      },
      {
        emoji: "🧰",
        label: "Printable toolkit (PDF and spreadsheet)",
        href: "/tech#toolkit",
        say: "Here is the toolkit.",
      },
    ],
  },

  faith: {
    say: "Welcome. What would help the most right now?",
    choices: [
      {
        emoji: "📖",
        label: "Read your writings",
        href: "/faith#writings",
        say: "Here are the writings.",
      },
      {
        emoji: "💰",
        label: "Is tithing biblical?",
        href: "/faith/topical-study/is-tithing-biblical",
        say: "Opening that study.",
      },
      {
        emoji: "👩🏾",
        label: "A Bible study community for women",
        href: "/faith/women-who-seek",
        say: "Opening Women Who Seek.",
      },
      {
        emoji: "🎥",
        label: "Hear your faith journey",
        href: "/faith",
        say: "Taking you to Faith Journey.",
      },
    ],
  },

  kids: {
    say: "Wonderful! Tech Journey Jr. is free. How old is your child?",
    choices: [
      {
        emoji: "🌻",
        label: "5 to 7",
        href: "/techjr/play/ages-5-7",
        say: "Opening Tech Sprouts, the game for ages 5 to 7.",
      },
      {
        emoji: "⚡",
        label: "8 to 10",
        href: "/techjr/play/ages-8-10",
        say: "Opening Tech Trailblazers, the game for ages 8 to 10.",
      },
      {
        emoji: "🧑🏾🧒🏽",
        label: "I'm a parent. How does it help?",
        href: "/techjr#parents",
        say: "Here is the guide for parents.",
      },
      {
        emoji: "🏫",
        label: "I'm planning a career day",
        href: "/techjr#host",
        say: "Here is the career day kit.",
      },
      { emoji: "🧑🏽", label: "My child is older than 10", next: "kidsOlder" },
    ],
  },
  kidsOlder: {
    say: "Tech Jr. is made for ages 5 to 10. For teens and adults, our free Tech Journey guides are a good place to start.",
    choices: [
      {
        emoji: "🧭",
        label: "Help me find a tech path",
        href: "/tech#quiz",
        say: "Taking you to the career quiz.",
      },
      {
        emoji: "📖",
        label: "Read the honest guides",
        href: "/tech#guides",
        say: "Here are the guides.",
      },
    ],
  },

  coaching: {
    say: "1:1 coaching is with Jermell Mitchell, an enterprise Account Executive. It starts with a free 15-minute intro call. What would you like to do?",
    choices: [
      {
        emoji: "🎯",
        label: "What can I be coached on?",
        href: "/tech/coaching#focus",
        say: "Here are the five areas.",
      },
      {
        emoji: "📞",
        label: "Request the free intro call",
        href: "/tech/coaching#apply",
        say: "Taking you to the request form.",
      },
      {
        emoji: "🎁",
        label: "Tell me about the free session",
        href: "/tech/coaching#free-session",
        say: "Here is how the free session works.",
      },
      {
        emoji: "💬",
        label: "Hear from someone Jermell coached",
        href: "/tech/coaching#story",
        say: "Here is a note from Juston.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export type SearchEntry = {
  title: string;
  href: string;
  blurb: string;
  /** Extra words people might type. Spelling variants and everyday words go here. */
  keywords: string;
};

export const searchIndex: SearchEntry[] = [
  {
    title: "Career quiz",
    href: "/tech#quiz",
    blurb: "Find which tech path fits you.",
    keywords: "quiz test path fit which role career choose pick start unsure not sure what should i do",
  },
  {
    title: "Start here: tech sales",
    href: "/tech/start-here/tech-sales",
    blurb: "How people break into tech sales.",
    keywords: "sales sdr bdr sell selling account executive prospecting outreach cold calling talk to people",
  },
  {
    title: "Start here: cybersecurity",
    href: "/tech/start-here/cybersecurity",
    blurb: "How people break into cybersecurity and IT.",
    keywords: "cyber security cybersecurity it help desk helpdesk soc analyst hacker hacking network comptia protect",
  },
  {
    title: "Start here: coding",
    href: "/tech/start-here/coding",
    blurb: "How to start learning to code.",
    keywords: "code coding program programming software engineer developer bootcamp javascript python web app",
  },
  {
    title: "Start here: data and analytics",
    href: "/tech/start-here/data-analytics",
    blurb: "How people break into data and analytics.",
    keywords: "data analytics analyst sql excel dashboard numbers statistics ai",
  },
  {
    title: "Tech sales: hype vs. reality",
    href: "/tech/guides/tech-sales-hype-vs-reality",
    blurb: "An honest look at tech sales (SDR) jobs.",
    keywords: "honest truth worth it hype reality sales sdr course scam real",
  },
  {
    title: "Software engineering: hype vs. reality",
    href: "/tech/guides/software-engineering-hype-vs-reality",
    blurb: "An honest look at software engineering as a career.",
    keywords: "honest truth worth it hype reality coding software engineer developer bootcamp ai layoffs",
  },
  {
    title: "Cybersecurity and IT: hype vs. reality",
    href: "/tech/guides/cybersecurity-hype-vs-reality",
    blurb: "An honest look at cybersecurity and IT careers.",
    keywords: "honest truth worth it hype reality cyber security it help desk certification",
  },
  {
    title: "What these jobs pay",
    href: "/tech#pay",
    blurb: "A snapshot of pay in tech careers.",
    keywords: "pay salary money income earn earnings how much make wage compensation",
  },
  {
    title: "Resume and LinkedIn checklist",
    href: "/tech#checklist",
    blurb: "A checklist to get your resume ready.",
    keywords: "resume cv linkedin checklist application apply job search profile",
  },
  {
    title: "Job application tracker",
    href: "/tech#tracker",
    blurb: "Keep track of every job you apply for.",
    keywords: "job tracker track applications spreadsheet interviews organize applied",
  },
  {
    title: "Free places to learn",
    href: "/tech#learn",
    blurb: "Free courses and resources.",
    keywords: "free learn courses training classes lessons resources certification discount coupon",
  },
  {
    title: "Printable toolkit",
    href: "/tech#toolkit",
    blurb: "A PDF and a spreadsheet you can keep.",
    keywords: "download pdf printable spreadsheet toolkit xlsx template",
  },
  {
    title: "Tech Journey",
    href: "/tech",
    blurb: "Everything for changing careers into tech.",
    keywords: "tech journey career change switch pivot new job",
  },
  {
    title: "1:1 coaching with Jermell",
    href: "/tech/coaching",
    blurb: "Paid coaching with a free 15-minute intro call.",
    keywords: "coaching coach mentor jermell one on one 1:1 help guidance paid price cost interview negotiate offer networking",
  },
  {
    title: "Request the free intro call",
    href: "/tech/coaching#apply",
    blurb: "Tell Jermell what you want help with.",
    keywords: "free intro call book schedule talk apply request sign up consultation",
  },
  {
    title: "The free coaching session",
    href: "/tech/coaching#free-session",
    blurb: "How someone wins a free 30-minute session.",
    keywords: "free session win giveaway 30 minute",
  },
  {
    title: "Faith Journey",
    href: "/faith",
    blurb: "Our journey of relying on God to discover and live out truth.",
    keywords: "faith christian jesus god bible church deconstruction deconstructed discernment wisdom freedom truth",
  },
  {
    title: "Faith writings",
    href: "/faith#writings",
    blurb: "Story Time, Topical Study, and Reflections.",
    keywords: "writings articles read blog studies reflections story",
  },
  {
    title: "Is tithing biblical?",
    href: "/faith/topical-study/is-tithing-biblical",
    blurb: "What I found when I finally studied it for myself.",
    keywords: "tithe tithing giving money offering church ten percent malachi",
  },
  {
    title: "Answering common tithing arguments",
    href: "/faith/topical-study/answering-common-tithing-arguments",
    blurb: "Is tithing required? Common arguments, answered.",
    keywords: "tithe tithing required arguments giving obligation",
  },
  {
    title: "The widow's mite in context",
    href: "/faith/topical-study/the-widows-mite-in-context",
    blurb: "What Jesus, Malachi, and Acts 4 teach about giving.",
    keywords: "widow mite giving offering jesus temple acts generosity",
  },
  {
    title: "Did Paul wait 14 years to preach?",
    href: "/faith/topical-study/did-paul-wait-14-years-to-preach",
    blurb: "A look at Paul's timeline.",
    keywords: "paul apostle preach preaching galatians timeline waiting ministry",
  },
  {
    title: "This thing is spiritual",
    href: "/faith/reflections/this-thing-is-spiritual",
    blurb: "A reflection.",
    keywords: "spiritual reflection warfare discernment",
  },
  {
    title: "Women Who Seek",
    href: "/faith/women-who-seek",
    blurb: "A Bible study community for women, hosted by Atiya.",
    keywords: "women woman ladies bible study community sisters atiya seek group fellowship",
  },
  {
    title: "Tech Journey Jr. for kids",
    href: "/techjr",
    blurb: "A free career game and a guide for parents.",
    keywords: "kids kid children child student school elementary career day game parents family",
  },
  {
    title: "Tech Sprouts: game for ages 5 to 7",
    href: "/techjr/play/ages-5-7",
    blurb: "Short stories and a voice that reads every screen.",
    keywords: "kindergarten first second grade little young toddler 5 6 7 play game sprouts",
  },
  {
    title: "Tech Trailblazers: game for ages 8 to 10",
    href: "/techjr/play/ages-8-10",
    blurb: "Real jobs and trickier choices.",
    keywords: "third fourth fifth grade 8 9 10 play game trailblazers",
  },
  {
    title: "Cyber Defenders (kids)",
    href: "/techjr/play/ages-8-10/cyber",
    blurb: "Kids learn to stay safe online.",
    keywords: "kids internet safety safe online passwords phishing scams cyber security children",
  },
  {
    title: "Cool Facts for kids",
    href: "/techjr/play/ages-8-10/facts",
    blurb: "Tap-to-reveal facts, plus a True or Made Up? game.",
    keywords: "cool facts trivia fun kids inventors heroes robots space games quiz",
  },
  {
    title: "Talking with your child about tech careers",
    href: "/techjr#parents",
    blurb: "A plain-language guide for parents.",
    keywords: "parent parents guide talk conversation child careers help learn",
  },
  {
    title: "Host a career day table",
    href: "/techjr#host",
    blurb: "A free kit for teachers and organizers.",
    keywords: "career day host organizer teacher school kit kiosk event table volunteer",
  },
  {
    title: "Home",
    href: "/",
    blurb: "Start at the front page.",
    keywords: "home main front page start",
  },
];

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "of", "and", "or", "in", "on", "at", "for", "with", "about", "from",
  "i", "me", "my", "we", "our", "you", "your", "is", "are", "am", "be", "do", "does", "can",
  "how", "what", "where", "when", "why", "who", "which", "want", "need", "looking", "look",
  "find", "get", "some", "any", "it", "this", "that", "please", "help", "info", "information",
  "tech", "job", "jobs", "make", "year", "years", "old",
]);

const words = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+:\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

// Two words match when they are the same or one starts the other, so "coach" finds "coaching".
// Everyday words that share no letters ("selling" for "sales") are covered by each entry's keywords.
const matches = (a: string, b: string) =>
  a === b || (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a)));

const MAX_RESULTS = 4;

export function searchGuide(query: string): SearchEntry[] {
  const all = words(query);
  const terms = all.filter((w) => !STOP_WORDS.has(w));
  // "How to get a job" is only generic words, so try again keeping the ones that carry meaning here.
  if (terms.length === 0) {
    const kept = all.filter((w) => w === "tech" || w === "job" || w === "jobs");
    return kept.length > 0 ? searchGuide("resume apply quiz") : [];
  }
  const scored = searchIndex.map((entry, order) => {
    const titleWords = words(entry.title);
    const otherWords = words(`${entry.keywords} ${entry.blurb}`);
    let score = 0;
    for (const term of terms) {
      if (titleWords.some((w) => matches(w, term))) score += 3;
      else if (otherWords.some((w) => matches(w, term))) score += 2;
    }
    return { entry, score, order };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, MAX_RESULTS)
    .map((s) => s.entry);
}
