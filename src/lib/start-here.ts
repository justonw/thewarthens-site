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

export type StartHereSpecialization = {
  name: string;
  description: string;
  goodFor: string;
  href?: string;
  linkLabel?: string;
};

export type StartHereWhatIsTheJob = {
  intro: string;
  dayToDay: string;
  specializations: StartHereSpecialization[];
};

export type StartHereProsCon = {
  text: string;
  source?: string;
};

export type StartHereGuide = {
  slug: string;
  pathId: PathId;
  title: string;
  dek: string;
  updated: string;
  video: { youtubeId: string; title: string };
  whatIsTheJob?: StartHereWhatIsTheJob;
  pros?: StartHereProsCon[];
  cons?: StartHereProsCon[];
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
    updated: "September 2026",
    video: {
      youtubeId: "L4j5ffFpnLo",
      title: "Tech Sales Exposed: Prepare Yourself for the Harsh Reality!",
    },
    whatIsTheJob: {
      intro:
        "\"Tech sales\" almost always means starting as an SDR (Sales Development Rep) or BDR, a specific, distinct first job, not a general sales career. The role you're promoted into, Account Executive, is genuinely a different job with different daily work, worth knowing that going in.",
      dayToDay:
        "As an SDR, your day is built around outbound: building prospect lists, running email, phone, and LinkedIn outreach sequences, logging every touch in a CRM, and hitting a monthly quota for meetings booked. The strongest reps front-load prospecting in the morning, personalize outreach instead of blasting templates, and treat objections as something to get curious about, not a script to fight through. In 2026, AI increasingly handles the grunt work, list-building, first-draft messages, research, shifting human SDRs toward account selection and judgment calls instead of pure volume.",
      specializations: [
        {
          name: "SDR / BDR",
          description:
            "Outbound prospecting and booking meetings. The standard entry point and training ground for almost every AE in the industry.",
          goodFor:
            "People okay with daily rejection at volume and quota pressure from day one, in exchange for the most accessible, degree-blind entry point in tech.",
          href: "https://higherlevels.com/?via=journey",
          linkLabel: "Sales Development Representative (Higher Levels)",
        },
        {
          name: "Account Executive (AE)",
          description:
            "Closes the deals SDRs set up: discovery calls, product demos, negotiation. Sub-tracks include Mid-Market, Enterprise, and Strategic/Global AE, each with bigger deals and longer sales cycles.",
          goodFor:
            "People who've proven themselves as an SDR and want to own the full deal cycle and the bigger commission that comes with it.",
          href: "https://higherlevels.com/?via=journey",
          linkLabel: "SDR to Account Executive (Higher Levels)",
        },
        {
          name: "Sales Engineer (SE)",
          description:
            "The technical counterpart on a sales team: runs technical demos, answers hard product questions, and de-risks complex deals.",
          goodFor:
            "People with some technical background who like being part of sales without living entirely on a cold-outreach quota.",
        },
        {
          name: "Customer Success Manager (CSM)",
          description:
            "Owns the relationship after the deal closes: onboarding, retention, renewals, and account growth, not new-business hunting.",
          goodFor:
            "People who'd rather build long-term relationships than chase new logos. A real, respected destination, not a fallback for people who \"couldn't hack\" new business.",
        },
      ],
    },
    pros: [
      {
        text: "A real, fast promotion path exists: the standard SDR-to-AE window is 12-18 months, with high performers reaching it in 10-12, and AE on-target earnings run roughly double SDR pay.",
      },
      {
        text: "One of the most degree-blind entry points in the economy. Retail, hospitality, service, or military experience transfers directly, since the core skill is handling daily rejection at volume and communicating clearly.",
      },
      {
        text: "Multiple real destinations beyond pure cold-calling if that's not your personality long-term: Sales Engineer (technical) and Customer Success (relationship-based, no new-business quota) are both legitimate career tracks, not consolation prizes.",
      },
      {
        text: "Genuinely remote-friendly, and some sources note skills like empathy and listening matter more than raw charisma, which opens the door to a wider range of personality types than the stereotype suggests.",
      },
    ],
    cons: [
      {
        text: "Burnout is the single most common reason SDRs quit (35%), ahead of feeling stuck (28%) or unrealistic quotas (18%).",
      },
      {
        text: "This is the highest-turnover role in the sales ladder: year-one SDR turnover runs 35-40%, with an average tenure around 14 months. Only 60% of SDRs hit quota in a given year, per the most rigorous industry benchmark, and some other sources report the miss rate running even higher.",
        source: "The Bridge Group, 2025 SDR Models, Metrics & Compensation Report",
      },
      {
        text: "The mental health cost is documented, not just anecdotal: one 2024 study found sales teams scored meaningfully worse than R&D teams on measures of depression, anxiety, and hostility.",
      },
      {
        text: "AI is absorbing exactly the list-building and first-draft outreach work that used to fill an SDR's day, which cuts both ways: less busywork, but also fewer seats needed per team to hit the same pipeline targets.",
      },
    ],
    steps: [
      {
        id: "watch-reality",
        title: "Watch this first: what the job actually looks like",
        description:
          "Before anything else, watch the video above. It's the most honest look at day-to-day tech sales we've put out, cold calls, quota pressure, and all. If this doesn't scare you off, keep going.",
      },
      {
        id: "pick-a-lane",
        title: "Know which lane you're actually aiming for",
        description:
          "Read the breakdown above. Almost everyone starts as an SDR, but if quota-driven cold outreach isn't sustainable for you long-term, Sales Engineer and Customer Success are real destinations worth knowing about now, not just discovering by accident later.",
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
    updated: "September 2026",
    video: {
      youtubeId: "7i37OopJL74",
      title: "Interview with The Cyber Security Engineer | Break Into TECH",
    },
    whatIsTheJob: {
      intro:
        "\"Cybersecurity\" isn't one job, it's several very different jobs that happen to share a job-posting keyword. Which one fits you matters more than the industry label.",
      dayToDay:
        "The most common entry point is a SOC (Security Operations Center) analyst: watching SIEM dashboards, triaging a queue of security alerts to sort real threats from false positives, investigating things like a phishing attempt or a malware infection, documenting what happened, and tuning detection rules so the same noise doesn't keep firing. It's shift-based work, 8-hour or 12-hour rotations (mornings, nights, weekends), and some employers add on-call rotations on top of that.",
      specializations: [
        {
          name: "SOC / Blue Team",
          description:
            "Monitoring and defense. The most common first job, and the most shift-work-heavy, highest-pressure one.",
          goodFor:
            "People okay with rotating shifts and a real-time, reactive pace early on, in exchange for the most beginner-friendly on-ramp.",
          href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
          linkLabel: "Cybersecurity Training (Springboard)",
        },
        {
          name: "GRC (Governance, Risk, Compliance)",
          description:
            "Writing security policy, running risk assessments, and managing frameworks like NIST CSF, ISO 27001, or SOC 2, translating technical risk into language executives act on.",
          goodFor:
            "People who want into cybersecurity without a heavy technical or coding background. Often the fastest, most stable entry point for career-changers from a non-IT background, and typically no shift work.",
        },
        {
          name: "Red Team / Penetration Testing",
          description:
            "Offensive security: simulating real attacks to find weaknesses before an actual attacker does.",
          goodFor:
            "People with real technical depth already, or willing to build it. Not a realistic first job, most sources describe a 24-36 month runway of hands-on skill-building before this is reachable.",
        },
        {
          name: "Cloud Security",
          description: "Securing AWS, Azure, and Google Cloud environments as companies move more infrastructure there.",
          goodFor:
            "People who already have some general IT or cloud fundamentals. Currently one of the fastest-growing, highest-paid specializations, but it's rarely a true zero-experience starting point.",
        },
      ],
    },
    pros: [
      {
        text: "Genuinely strong long-run demand: information security analyst roles are projected to grow 29% from 2024 to 2034, one of the fastest-growing occupations tracked.",
        source: "BLS Occupational Outlook Handbook",
      },
      {
        text: "Multiple real on-ramps depending on your personality, not just one path: hands-on technical (SOC, cloud), adversarial (red team), or process and policy-driven (GRC) if coding or shift work isn't for you.",
      },
      {
        text: "No degree required for most entry paths. Hiring managers themselves say they're open to it: 90% would consider a candidate with only general IT experience, and 89% would consider someone with just an entry-level cert and no experience.",
        source: "ISC2, 2025 Cybersecurity Hiring Trends Study",
      },
      {
        text: "Real pay ceiling once you're established: Security Engineers average around $135K and Threat Intelligence Analysts around $148K. That's not a day-one number, but it's a real, earned destination.",
      },
    ],
    cons: [
      {
        text: "The entry-level hiring gap is real, not just hype-vs-reality marketing spin: only 17% of employers actively recruit entry-level talent, and 31% made zero entry-level cybersecurity hires in the prior year despite reporting a shortage.",
        source: "UK Cyber Security Skills in the Labour Market report, 2025",
      },
      {
        text: "Burnout is concentrated exactly where most beginners start: SOC analyst, incident response, and digital forensics roles report the highest stress, with cybersecurity professionals working an average of 10.8 extra hours a week beyond their contracted schedule, effectively a sixth workday. GRC, identity management, and security architecture report meaningfully lower stress.",
        source: "Help Net Security, 2026 workforce burnout reporting",
      },
      {
        text: "AI is actively absorbing the Tier-1 SOC triage work, alert sorting, log correlation, that used to be the standard first job in this field, narrowing the classic on-ramp further.",
      },
      {
        text: "It's a genuine treadmill: threats, tools, and attacker techniques change continuously, so the learning never really stops. Some people find that energizing; for others it's exhausting long-term.",
      },
    ],
    steps: [
      {
        id: "watch-interview",
        title: "Watch this first: a real cybersecurity engineer",
        description:
          "Before you study anything, watch the interview above to hear what the job is actually like from someone doing it.",
      },
      {
        id: "pick-a-lane",
        title: "Decide which specialization actually fits you",
        description:
          "Read the breakdown above before you pick a track. If shift work and reactive, high-pressure monitoring isn't for you, GRC is a real, often faster on-ramp that doesn't require a technical background, not a lesser path.",
      },
      {
        id: "it-foundations",
        title: "Build general IT experience first, if you can",
        description:
          "The most consistent advice from people already in the field: a helpdesk, IT support, or sysadmin role first makes you a far stronger candidate than jumping straight to a \"security analyst\" title with zero IT background. It's not required to start learning below, but budget for it in your realistic timeline.",
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
    updated: "September 2026",
    video: {
      youtubeId: "FT47fvHIvTs",
      title: "Microsoft Software Engineer Answers 12 Questions about Tech Career",
    },
    whatIsTheJob: {
      intro:
        "\"Software engineer\" covers genuinely different day-to-day jobs depending on specialization. Which lane you eventually target matters, both for what your day looks like and for how competitive the job search actually is.",
      dayToDay:
        "As a junior engineer, your day is mentorship-heavy, not solo: checking overnight code review comments, a daily standup to share progress and blockers, working an assigned feature or bug fix, and often a pair-programming session with a senior engineer on something more complex. You'll write code, but you'll spend real time in code review, testing, and debugging too. Success early on is measured by growth rate, not raw output, you're expected to need guidance.",
      specializations: [
        {
          name: "Backend",
          description: "Server-side logic, databases, and the APIs that power an application.",
          goodFor:
            "Beginners who want a friendlier path to actually getting hired: fewer entry-level candidates target backend than frontend, and you can prove skill with one strong project.",
        },
        {
          name: "Frontend",
          description: "The visible, interactive part of an app that users actually click on and see.",
          goodFor:
            "The most beginner-friendly way to learn (you see results in a browser immediately), but it's also the most crowded specialization to get hired into, worth knowing before you assume it's the easy path end to end.",
        },
        {
          name: "Full-Stack",
          description: "Both frontend and backend. The generalist option.",
          goodFor:
            "People who want the shortest overall learning curve to strong entry-level demand, without narrowing down to one specialization right away.",
          href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
          linkLabel: "Software Engineering Course (Springboard)",
        },
        {
          name: "DevOps / Cloud",
          description: "Deployment pipelines, infrastructure, and cloud operations (AWS, Azure, GCP).",
          goodFor:
            "People who want a lane that's currently reporting some of the highest job satisfaction in the field, partly because it relies on judgment AI tools can't fully replace yet.",
        },
      ],
    },
    pros: [
      {
        text: "Real, strong long-run demand and pay: the Bureau of Labor Statistics projects 15% job growth through 2034, well above average, with a median software developer salary of $133,080 (though that reflects the whole employed workforce, not a first-day number).",
        source: "BLS Occupational Outlook Handbook",
      },
      {
        text: "Backend and data engineering specifically have friendlier entry-level competition than frontend, a real, specific, actionable fact for choosing where to focus your first project, not just generic career advice.",
      },
      {
        text: "Career satisfaction varies a lot by lane, and that's useful, not discouraging: DevOps and cloud roles report meaningfully higher satisfaction (63-81%) than the field average, so \"software engineer\" isn't one fixed experience.",
      },
      {
        text: "It remains one of the highest-paying knowledge careers available without a specific degree requirement in many companies, if you can build a real, demonstrable project.",
      },
    ],
    cons: [
      {
        text: "New-grad and junior hiring is genuinely harder right now: hiring at the largest tech companies fell 25% from 2023 to 2024, and entry-level postings were still declining year over year even as the broader market recovered in 2025-2026.",
        source: "SignalFire, State of Tech Talent Report",
      },
      {
        text: "AI hasn't reduced the workload the way many assume, for a lot of engineers it's increased it: 65% report burnout despite AI handling more of the routine coding, because reviewing AI-generated code is often more mentally tiring than writing it yourself was.",
      },
      {
        text: "Frontend, the most common beginner starting point for learning, is also the most crowded lane once you're actually job-hunting, worth planning around rather than discovering after months of study.",
      },
      {
        text: "Remote work removes the physical separation between work and life that used to happen automatically. Without real discipline, \"just check one thing\" from the couch becomes a structural stressor, not just a personal failing.",
      },
    ],
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
          "Web dev is the most beginner-friendly starting point: you write code, refresh a browser, and see it work immediately. Start with JavaScript. If data or AI interests you more, Python is the better first language instead. Just know this is about what's easiest to learn first, not what's easiest to get hired into, see the breakdown above once you're comfortable with the basics.",
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
  {
    slug: "data-analytics",
    pathId: "data",
    title: "Start Here: Breaking Into Data Analytics",
    dek: "A free, in-order path to build real data analyst skills, before you spend a dollar on a course.",
    updated: "September 2026",
    video: {
      youtubeId: "I9ouZUvq3gA",
      title: "How I became a Data Analyst (No CS Degree nor Exp)",
    },
    whatIsTheJob: {
      intro:
        "\"Data\" covers several different jobs. Data analyst is the accessible entry point; data engineer and data scientist are different, usually later, destinations, not competing starting points.",
      dayToDay:
        "As an entry-level analyst, your day follows a consistent loop: pulling data with SQL queries, cleaning messy spreadsheets so the numbers actually mean something, building or updating a dashboard in Tableau or Power BI, and meeting with other teams to understand what they actually need or explain what you found. Excel and SQL are the two non-negotiable skills almost every posting expects on day one.",
      specializations: [
        {
          name: "Data Analyst",
          description:
            "Surfaces business insights from existing data: cleaning, querying, dashboards, and explaining what the numbers mean to non-technical teams.",
          goodFor:
            "Beginners. The lowest barrier to entry of the three, companies are used to hiring career switchers straight into this role with solid Excel, SQL, and a real portfolio.",
          href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
          linkLabel: "Data Analytics / Science Training (Springboard)",
        },
        {
          name: "Business Intelligence (BI) Analyst",
          description:
            "A close cousin of data analyst, focused specifically on building and maintaining recurring dashboards and reports for business decision-making.",
          goodFor:
            "People who like the dashboard and visualization side of analysis more than one-off deep dives.",
        },
        {
          name: "Data Engineer",
          description: "Builds and maintains the pipelines and infrastructure that move and store the data analysts and scientists use.",
          goodFor:
            "People who enjoy backend-style systems work more than interpreting the data itself. Usually not a zero-experience starting point, more often a move after some analyst or software experience.",
        },
        {
          name: "Data Scientist",
          description: "Builds predictive models instead of explaining what already happened, using Python, statistics, and machine learning.",
          goodFor:
            "People ready to go deeper into math, statistics, and programming. Almost never a realistic first job, most people arrive here after analyst experience or a more technical, quantitative background.",
        },
      ],
    },
    pros: [
      {
        text: "Real, strong entry-level pay for a no-degree path: entry-level data analyst pay has climbed to around $85K-$100K in major markets, and 85% of listings don't even specify required experience.",
      },
      {
        text: "AI is genuinely freeing analysts from grunt work rather than replacing them: 70% report AI automation enhances their effectiveness, and 87% feel more strategically valuable than before, since AI increasingly handles the routine data-cleaning, freeing time for the higher-value storytelling and business-judgment side of the job.",
      },
      {
        text: "A real, accessible on-ramp: companies are genuinely used to hiring fresh grads and career switchers straight into analyst roles, and a demonstrable portfolio (real queries, real dashboards) matters more than a specific degree.",
      },
      {
        text: "Real growth path once you're in: analyst experience is a legitimate stepping stone toward senior analyst, analytics manager, or, with real upskilling, data scientist or data engineer.",
      },
    ],
    cons: [
      {
        text: "The entry-level market is more competitive than the growth headlines suggest. \"23% projected growth\" describes the field overall, not how easy any single entry-level req is to land.",
      },
      {
        text: "The skill bar has risen. Learning Excel and SQL used to be enough to stand out; employers now expect you to interpret trends, communicate insights clearly, and work alongside AI tools on top of the basics.",
      },
      {
        text: "The roles most exposed to AI are the narrowest ones: if your entire value is writing SQL queries and pulling static reports with no business context, that specific slice of the job is genuinely at risk.",
      },
      {
        text: "It's more reporting than discovery most of the time. If you're picturing constant, open-ended exploratory analysis, the reality of a lot of analyst work is recurring dashboards and requests, not a research project.",
      },
    ],
    steps: [
      {
        id: "watch-interview",
        title: "Watch this first: a real career-changer's path in",
        description:
          "Before you touch a tool, watch the video above. It's a real account of breaking in with no CS degree or prior experience, which is the realistic starting point for most people reading this.",
      },
      {
        id: "pick-a-lane",
        title: "Aim at Data Analyst first, not Data Scientist",
        description:
          "Read the breakdown above. Data Scientist is the job title most beginners fixate on, but it's rarely a realistic first job. Data Analyst is the accessible, well-documented on-ramp, and analyst experience is what actually opens the door to data science or engineering later, if you still want it.",
      },
      {
        id: "sql-basics",
        title: "Learn SQL for free, interactively",
        description:
          "SQL is one of the two non-negotiable skills for almost every entry-level posting. SQLBolt teaches it free, in the browser, one short interactive lesson at a time.",
        href: "https://sqlbolt.com/",
        linkLabel: "SQLBolt",
      },
      {
        id: "excel-basics",
        title: "Get genuinely fluent in Excel, not just familiar",
        description:
          "The other non-negotiable skill. GCFGlobal's free Excel tutorials, built by a nonprofit, cover real business use, not just formulas for their own sake.",
        href: "https://edu.gcfglobal.org/en/excel/",
        linkLabel: "GCFGlobal: Excel",
      },
      {
        id: "visualization",
        title: "Learn to build dashboards, not just spreadsheets",
        description:
          "Tableau Public is a free version of the tool most job postings name directly. Build something real with it, not just a tutorial project.",
        href: "https://public.tableau.com/",
        linkLabel: "Tableau Public (free)",
      },
      {
        id: "portfolio-project",
        title: "Build one real project with a real dataset",
        description:
          "Kaggle has thousands of free, real-world datasets and free short courses. Pick one dataset that genuinely interests you and turn it into a full analysis: cleaning, a few real findings, and a dashboard, that's your portfolio piece.",
        href: "https://www.kaggle.com/",
        linkLabel: "Kaggle",
      },
      {
        id: "community",
        title: "Join a community and start asking questions",
        description:
          "r/analytics and r/businessintelligence are both free and used to beginners asking exactly the questions you'll have.",
        href: "https://www.reddit.com/r/analytics/",
        linkLabel: "r/analytics",
      },
    ],
    paidNote:
      "You don't have to finish the free path above before considering this. A paid program makes sense whenever you want a packaged, structured way of learning and a designated community to talk through what you're building, whether that's day one or after you've already tried SQLBolt, Excel, and Tableau on your own. We partner with Springboard for that reason.",
    paidLinks: [
      {
        label: "Data Analytics / Science Training (Springboard)",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
    faq: [
      {
        question: "How do I get started in data analytics with no experience, for free?",
        answer:
          "In order: learn SQL through SQLBolt's free interactive lessons, get genuinely fluent in Excel through GCFGlobal's free tutorials, learn to build dashboards with the free version of Tableau, then build one real portfolio project using a free Kaggle dataset. Join a community like r/analytics to start asking questions along the way.",
      },
      {
        question: "Should I aim to become a data analyst, data scientist, or data engineer?",
        answer:
          "Data Analyst, if you're starting from zero. It's the most accessible entry point, companies are used to hiring career switchers directly into it, and it's the most common path toward data science or data engineering later. Aiming straight for data scientist as a first job isn't realistic for most beginners.",
      },
      {
        question: "Do I need a degree for data analytics?",
        answer:
          "No. 85% of data analyst job listings don't even specify required experience, and employers consistently say a real, demonstrable portfolio (actual SQL queries, actual dashboards) matters more than a specific credential.",
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
