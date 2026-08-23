import type { PathId } from "@/lib/quiz";

export type StartHereStep = {
  id: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export type StartHereGuide = {
  slug: string;
  pathId: PathId;
  title: string;
  dek: string;
  updated: string;
  video: { youtubeId: string; title: string };
  steps: StartHereStep[];
  paidNote: string;
  paidLinks: { label: string; href: string }[];
};

export const startHereGuides: StartHereGuide[] = [
  {
    slug: "tech-sales",
    pathId: "sales",
    title: "Start Here: Breaking Into Tech Sales",
    dek: "Free steps to figure out if tech sales is actually for you, before you spend a dollar.",
    updated: "August 2026",
    video: {
      youtubeId: "L4j5ffFpnLo",
      title: "Tech Sales Exposed: Prepare Yourself for the Harsh Reality!",
    },
    steps: [
      {
        id: "watch-reality",
        title: "Watch this first: what the job actually looks like",
        description:
          "Before anything else, watch the video below. It's the most honest look at day-to-day tech sales we've put out, cold calls, quota pressure, and all. If this doesn't scare you off, keep going.",
      },
      {
        id: "follow-higher-levels",
        title: "Follow Higher Levels' free content",
        description:
          "Before considering their paid program, follow Higher Levels on YouTube and social media just to see what SDR training actually looks like day to day. You'll get a real feel for the field for free.",
        href: "https://higherlevels.com/?via=journey",
        linkLabel: "Higher Levels",
      },
      {
        id: "watch-our-playlists",
        title: "Watch our Tech Sales playlists",
        description:
          "We've put out over 50 free videos on cold calling, LinkedIn, resumes, and interview prep specifically for people trying to break into tech sales. Start with \"Mastering Tech Sales\" and \"Tech Sales Career.\"",
        href: "https://youtube.com/@thewarthens",
        linkLabel: "Our YouTube channel",
      },
      {
        id: "learn-methodology",
        title: "Learn the vocabulary for free",
        description:
          "Look up SPIN Selling, Gap Selling, and the Challenger Sale. You don't need to master them, but knowing what they are means you won't sound lost in an interview.",
      },
      {
        id: "practice-cold-calls",
        title: "Practice cold calls without a real prospect on the line",
        description:
          "Use a free trial cold call simulator to get reps in before you're doing it for a paycheck.",
        href: "https://www.rithim.ai/r/pNWb22tV",
        linkLabel: "Trial Cold Call Simulator",
      },
      {
        id: "optimize-linkedin",
        title: "Fix your resume and LinkedIn before you apply anywhere",
        description:
          "Recruiters are looking at LinkedIn as much as your resume, sometimes more. Use our free LinkedIn Tips and Resume Tips playlists to fix both before you start applying.",
        href: "https://youtube.com/@thewarthens",
        linkLabel: "LinkedIn & Resume Tips playlists",
      },
      {
        id: "start-applying",
        title: "Start applying, even before you feel ready",
        description:
          "Applying to real SDR postings now, even if you're not fully prepared, shows you what the market actually wants. You'll learn more from five real job descriptions than another week of research.",
      },
    ],
    paidNote:
      "Once you've done the free steps above and tech sales still feels right, a structured program can shorten the timeline. We partner with Higher Levels for exactly that reason, but it's worth trying the free content first so you know it's a fit before paying for anything.",
    paidLinks: [
      { label: "Sales Development Representative (Higher Levels)", href: "https://higherlevels.com/?via=journey" },
    ],
  },
  {
    slug: "cybersecurity",
    pathId: "itsec",
    title: "Start Here: Breaking Into Cybersecurity",
    dek: "A free, in-order path to learn real cybersecurity fundamentals, before you spend a dollar on a cert or a course.",
    updated: "August 2026",
    video: {
      youtubeId: "7i37OopJL74",
      title: "Interview with The Cyber Security Engineer | Break Into TECH",
    },
    steps: [
      {
        id: "watch-interview",
        title: "Watch this first: a real cybersecurity engineer",
        description:
          "Before you study anything, watch the interview below to hear what the job is actually like from someone doing it.",
      },
      {
        id: "command-line",
        title: "Get comfortable at the command line",
        description:
          "Most beginners have never touched a terminal. OverTheWire's Bandit wargame teaches Linux basics one level at a time, built specifically for absolute beginners.",
        href: "https://overthewire.org/wargames/bandit/",
        linkLabel: "OverTheWire: Bandit",
      },
      {
        id: "networking-fundamentals",
        title: "Learn networking fundamentals for free",
        description:
          "Security concepts don't mean anything until you understand what's being protected. Professor Messer's free Network+ videos cover this, taught for people with zero background.",
        href: "https://www.professormesser.com/",
        linkLabel: "Professor Messer (free)",
      },
      {
        id: "tryhackme",
        title: "Start TryHackMe's free Pre Security path",
        description:
          "Guided, browser-based, hands-on rooms, no install needed. The free tier covers this entire path.",
        href: "https://tryhackme.com/path/outline/presecurity",
        linkLabel: "TryHackMe: Pre Security",
      },
      {
        id: "security-plus-free",
        title: "Learn core security concepts for free",
        description:
          "Professor Messer's free Security+ video course is the credible free milestone people recommend finishing before spending money on anything, including the CompTIA exam itself.",
        href: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/",
        linkLabel: "Professor Messer: Security+",
      },
      {
        id: "picoctf",
        title: "Practice with beginner-friendly challenges",
        description:
          "PicoCTF is free, gamified, and built for newcomers, with hints and write-ups so you're not stuck.",
        href: "https://picoctf.org/",
        linkLabel: "picoCTF",
      },
      {
        id: "community",
        title: "Join a community and start asking questions",
        description:
          "r/cybersecurity and TryHackMe's own Discord are both free and welcome beginners. Lurk first, then ask.",
        href: "https://www.reddit.com/r/cybersecurity/",
        linkLabel: "r/cybersecurity",
      },
    ],
    paidNote:
      "Once you've finished the free path above and want to move faster, or you need the actual Security+ credential for a resume filter, that's when paying for a structured program starts to make sense. We partner with Springboard for exactly that stage, not as a substitute for the free fundamentals.",
    paidLinks: [
      {
        label: "Cybersecurity Training (Springboard)",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  {
    slug: "coding",
    pathId: "swe",
    title: "Start Here: Learning to Code",
    dek: "A free, in-order path to start coding for real, before you spend a dollar on a bootcamp.",
    updated: "August 2026",
    video: {
      youtubeId: "FT47fvHIvTs",
      title: "Microsoft Software Engineer Answers 12 Questions about Tech Career",
    },
    steps: [
      {
        id: "watch-swe",
        title: "Watch this first: a real software engineer's perspective",
        description:
          "Before you write a line of code, watch the video below to hear what the job is actually like from someone doing it at Microsoft.",
      },
      {
        id: "pick-a-lane",
        title: "Pick web development as your starting lane",
        description:
          "Web dev is the most beginner-friendly starting point: you write code, refresh a browser, and see it work immediately. Start with JavaScript. If data or AI interests you more, Python is the better first language instead.",
      },
      {
        id: "freecodecamp",
        title: "Start freeCodeCamp's Responsive Web Design certification",
        description:
          "This is freeCodeCamp's own recommended starting point: HTML, CSS, and 5 hands-on projects, completely free, no account needed to start.",
        href: "https://www.freecodecamp.org/",
        linkLabel: "freeCodeCamp",
      },
      {
        id: "supplement-video",
        title: "Supplement with video, but keep building",
        description:
          "freeCodeCamp's own YouTube channel and Traversy Media are both free and well-regarded. The #1 beginner trap is watching tutorials instead of building, use video to reinforce, not replace, hands-on practice.",
      },
      {
        id: "odin-project",
        title: "Go deeper for free once you finish the basics",
        description:
          "The Odin Project is a free, open-source, full-stack curriculum that pushes you to read documentation and problem-solve, closer to real job conditions than a guided tutorial.",
        href: "https://www.theodinproject.com/",
        linkLabel: "The Odin Project",
      },
      {
        id: "build-project",
        title: "Build one real project and put it on GitHub",
        description:
          "Don't overreach: a portfolio site, a calculator, or a to-do app is enough. Host it free on GitHub Pages, this is what \"showing work\" means before any bootcamp or job application.",
        href: "https://pages.github.com/",
        linkLabel: "GitHub Pages",
      },
      {
        id: "community",
        title: "Join a community for help",
        description:
          "freeCodeCamp's own Discord and r/learnprogramming are both free and built for beginners asking exactly the questions you'll have.",
        href: "https://www.freecodecamp.org/news/freecodecamp-discord-server/",
        linkLabel: "freeCodeCamp Discord",
      },
    ],
    paidNote:
      "The real milestone before paying for anything: finish the Responsive Web Design certification and build one project on your own, from a blank file, without following a tutorial step by step. If you've done that and want to move faster, that's when a paid bootcamp is worth evaluating as an informed buyer. We partner with Springboard for that stage.",
    paidLinks: [
      {
        label: "Software Engineering Course (Springboard)",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
];

export function getStartHere(slug: string) {
  return startHereGuides.find((g) => g.slug === slug);
}

export function getStartHereForPath(pathId: PathId) {
  return startHereGuides.find((g) => g.pathId === pathId);
}
