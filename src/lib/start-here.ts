import type { PathId } from "@/lib/quiz";

export type StartHereStep = {
  id: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export type StartHereFaq = {
  question: string;
  answer: string;
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
  faq: StartHereFaq[];
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
          "Before anything else, watch the video above. It's the most honest look at day-to-day tech sales we've put out, cold calls, quota pressure, and all. If this doesn't scare you off, keep going.",
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
          "We've put out over 50 free videos on cold calling, LinkedIn, resumes, interview prep, and industry insights specifically for people trying to break into tech sales. Start with \"Mastering Tech Sales\" and \"Tech Sales Career.\"",
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
      "You don't have to finish the free steps above before considering this. A paid program makes sense whenever you want a packaged, structured way of learning and a designated community to talk through what you're working on, whether that's day one or after you've already tried the free content. We partner with Higher Levels for that reason.",
    paidLinks: [
      { label: "Sales Development Representative (Higher Levels)", href: "https://higherlevels.com/?via=journey" },
    ],
    faq: [
      {
        question: "How do I get into tech sales with no experience?",
        answer:
          "Start free: watch real day-to-day content from people doing the job (not just course marketing), learn the basic vocabulary (SPIN Selling, Gap Selling, the Challenger Sale), and fix your resume and LinkedIn before you apply anywhere. Then start applying to real SDR postings even before you feel ready. You don't need a degree or prior sales experience, retail, hospitality, or any customer-facing background transfers well.",
      },
      {
        question: "Do I need a degree to break into tech sales?",
        answer:
          "No. Tech sales is one of the more degree-blind entry points in the economy. What actually matters is being able to handle daily rejection at volume and communicate clearly, both of which retail, hospitality, service, and military backgrounds already build.",
      },
      {
        question: "What should I do before paying for a tech sales course?",
        answer:
          "Everything in this free path first: watch honest day-in-the-life content, follow a training program's free content to see what it actually teaches, learn the core vocabulary, and clean up your resume and LinkedIn. If you still want a structured program and community after that, paying then makes more sense than paying first.",
      },
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
          "Before you study anything, watch the interview above to hear what the job is actually like from someone doing it.",
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
      "You don't have to finish the free path above before considering this. A paid program makes sense whenever you want a packaged, structured way of learning and a designated community to talk through what you're working on, whether that's day one or after you've already tried the free fundamentals. We partner with Springboard for that reason.",
    paidLinks: [
      {
        label: "Cybersecurity Training (Springboard)",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
    faq: [
      {
        question: "How do I get started in cybersecurity with no experience, for free?",
        answer:
          "In order: get comfortable at the command line with OverTheWire's Bandit wargame, learn networking fundamentals through Professor Messer's free videos, work through TryHackMe's free Pre Security path, then Professor Messer's free Security+ course before you ever pay for the exam. Practice with picoCTF, and join a community like r/cybersecurity to start asking questions.",
      },
      {
        question: "What's the best free way to learn cybersecurity basics?",
        answer:
          "Professor Messer's free video courses (Network+ and Security+) are the most consistently recommended free resource, paired with TryHackMe's browser-based, hands-on rooms, which need no install and cover real fundamentals at zero cost.",
      },
      {
        question: "Do I need a degree or certification to start learning cybersecurity?",
        answer:
          "No, all of the resources in this free path (OverTheWire, Professor Messer, TryHackMe, picoCTF) require nothing but time and a computer. A cert like CompTIA Security+ becomes useful later, once you've built real fundamentals and want something to show employers.",
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
          "Before you write a line of code, watch the video above to hear what the job is actually like from someone doing it at Microsoft.",
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
      "You don't have to finish the free path above before considering this. A paid bootcamp makes sense whenever you want a packaged, structured way of learning and a designated community to talk through what you're building, whether that's day one or after you've already tried freeCodeCamp on your own. We partner with Springboard for that reason.",
    paidLinks: [
      {
        label: "Software Engineering Course (Springboard)",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
    faq: [
      {
        question: "How do I start learning to code for free?",
        answer:
          "Start with freeCodeCamp's Responsive Web Design certification, it's free, requires no account to begin, and covers HTML, CSS, and 5 hands-on projects. Supplement with video from freeCodeCamp's own channel or Traversy Media, but keep building more than you watch. Once you finish the basics, The Odin Project is a free, open-source curriculum that goes deeper.",
      },
      {
        question: "What programming language should I learn first?",
        answer:
          "JavaScript, if you're starting with web development, which is the most beginner-friendly lane since you write code, refresh a browser, and immediately see it work. Python is the better first language if data or AI interests you more.",
      },
      {
        question: "Do I need a bootcamp to become a software engineer?",
        answer:
          "No, not to start. Everything in this free path (freeCodeCamp, The Odin Project, building and shipping your own project on GitHub Pages) can get you real, demonstrable skill before you spend a dollar. A bootcamp can still make sense later for structure and community, but it's not required to begin.",
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
