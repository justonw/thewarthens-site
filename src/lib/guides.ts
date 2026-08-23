import type { PathId } from "@/lib/quiz";

export type GuidePoint = {
  text: string;
  source?: string;
};

export type GuideQuote = {
  quote: string;
  source: string;
};

export type Guide = {
  slug: string;
  pathId: PathId;
  title: string;
  dek: string;
  updated: string;
  hype: GuidePoint[];
  realityData: GuidePoint[];
  aiAngle: {
    intro: string;
    points: GuidePoint[];
  };
  voices: GuideQuote[];
  synthesis: string[];
  forWhom: string[];
  notForWhom: string[];
  sources: string[];
};

export const guides: Guide[] = [
  {
    slug: "tech-sales-hype-vs-reality",
    pathId: "sales",
    title: "Tech Sales (SDR): Hype vs. Reality",
    dek: "What sales-training marketing says about breaking into tech sales, compared to what the actual 2025-2026 industry data and real SDRs say. Includes an honest look at our own training partner's claims.",
    updated: "August 2026",
    hype: [
      {
        text: "\"Zero tech or sales experience required\" and \"build a $100K+ career\" in a 5-week average completion time.",
        source: "Higher Levels, our own affiliate training partner",
      },
      {
        text: "\"Typical starting salaries for entry-level tech sales roles are around $68,000\" and most people are hired within 1 to 6 months of finishing a course.",
        source: "CourseCareers marketing",
      },
      {
        text: "The consistent framing across most sales-training marketing: this is \"the most degree-blind, well-paid entry in the economy,\" where retail or service experience beats a business degree.",
      },
    ],
    realityData: [
      {
        text: "The most rigorous, current industry benchmark puts median SDR base pay at $55,000 and OTE (on-target earnings, meaning base plus commission if you hit quota) at $80,000, unchanged since 2022. That means it's actually lost ground to inflation over the past several years.",
        source: "The Bridge Group, 2025 SDR Models, Metrics & Compensation Report (351 B2B companies surveyed)",
      },
      {
        text: "A separate, crowd-verified salary database of over 8,000 SDR data points puts median pay a bit higher: $60K base, $85K OTE, with real variance by company size and industry.",
        source: "RepVue",
      },
      {
        text: "Those numbers roughly track with what we already show on our own Income Snapshot ($42K-$61K entry). The dishonest part of the marketing isn't the entry number, it's that the \"$100K+ career\" language sits right next to the entry pitch without making clear it's describing pay after you're promoted to Account Executive, not SDR pay itself.",
      },
      {
        text: "Only 60% of SDRs hit quota in 2025, the lowest rate on record in this benchmark's history.",
        source: "The Bridge Group, 2025",
      },
      {
        text: "Median annual attrition (people leaving the role) sits at 40%, with average tenure of 1.9 years.",
        source: "The Bridge Group, 2025",
      },
      {
        text: "The promotion pipeline from SDR to Account Executive, the entire premise of \"it's just a stepping stone,\" is shrinking. Promotions accounted for 34% of why people left the SDR seat in 2020. By 2025 that dropped to 16%. More people are leaving for other reasons (a different job, leaving sales entirely) than being promoted up.",
        source: "The Bridge Group, 2025",
      },
      {
        text: "Some industry reporting suggests SDR-to-AE promotion timelines have stretched from roughly 12 months a few years ago to 18-24 months now, though we'd call this a directional read rather than a hard number, since it comes from sales-ops blogs rather than an audited study.",
      },
      {
        text: "One recruiting company reported getting over 1,000 applications within 3 hours of posting a single SDR opening in 2025, illustrating how competitive entry-level postings have become, even though this is one company's experience, not a market-wide statistic.",
        source: "graph8.com",
      },
    ],
    aiAngle: {
      intro:
        "AI outbound tools are real and spreading fast, but the story is more \"fewer humans needed to hit the same targets\" than \"the SDR role is disappearing.\"",
      points: [
        {
          text: "Roughly 41-42% of enterprise B2B sales teams had an AI SDR tool in production by early 2026, up from just 3% two years earlier.",
        },
        {
          text: "Most companies are pairing AI tools with human SDRs rather than replacing them outright. AI-booked meetings convert to real opportunities at around 15%, compared to about 25% for meetings a human SDR booked. AI is good at volume, weaker at judging whether a lead is actually worth a salesperson's time.",
        },
        {
          text: "The practical effect: some teams report hitting the same pipeline goals with about 26% fewer SDRs than before. That's not the job vanishing, it's fewer seats needed to do it, which lines up with the shrinking promotion pipeline above.",
        },
      ],
    },
    voices: [
      {
        quote:
          "Laid off last July, applied over 300 jobs since Jan 2024, however not receiving any interviews yet... it's really difficult to be selected for interviews.",
        source: "Bootcamp/training grad, posted on Blind (teamblind.com)",
      },
      {
        quote:
          "Every 3 months you felt lucky to survive.",
        source: "SDR, company review on RepVue, describing a high-pressure quota environment",
      },
    ],
    synthesis: [
      "The entry-level pay claims for tech sales roughly check out. Real industry data (Bridge Group, RepVue) lands close to our own $42K-$61K figure, and that's a genuinely strong outcome for someone coming from retail, hospitality, or customer service with no degree.",
      "Where the marketing, including our own partner's marketing, gets dishonest is in blurring SDR pay with the post-promotion Account Executive pay, and staying quiet about a promotion pipeline that's measurably shrinking. The \"$100K+ career, 5 weeks\" pitch is describing a destination that fewer people are actually reaching on the timeline implied.",
      "We're keeping our Higher Levels partnership because the entry-level pay and the on-ramp itself are real. But we'd rather you go in knowing the honest numbers than find them out three months into a 40-call-a-day quota grind.",
    ],
    forWhom: [
      "People with real customer-facing or resilience experience (retail, hospitality, service, military) who can handle daily rejection at volume: the transferable-skills pitch is legitimately true for this group.",
      "People who go in expecting realistic total comp of $55K-$90K, not $100K+, and a competitive 18-24+ month path to promotion, not a guaranteed 12-month one.",
      "People weighing SDR against other low-credential tech-adjacent entry points (support, customer success, RevOps): SDR still pays a real premium, the door is just harder to walk through than advertised.",
    ],
    notForWhom: [
      "Anyone counting on a fast, guaranteed six-figure track within a year. The data doesn't support that timeline for a typical entrant.",
      "Anyone who can't tolerate high daily rejection (cold call connect rates run 3-10%) in an environment where AI tools are compressing how many SDRs a team needs.",
    ],
    sources: [
      "The Bridge Group, 2025 SDR Models, Metrics & Compensation Report, bridgegroupinc.com",
      "RepVue SDR salary data, repvue.com",
      "graph8.com, \"Is the SDR Role Dead? We Got 1,000 Applications in 3 Hours\"",
      "Higher Levels and CourseCareers marketing pages, reviewed directly",
      "Blind (teamblind.com) and RepVue company reviews",
    ],
  },
  {
    slug: "software-engineering-hype-vs-reality",
    pathId: "swe",
    title: "Software Engineering: Hype vs. Reality",
    dek: "What bootcamp marketing says about becoming a software engineer, compared to current placement data, BLS numbers, and new research on how AI is specifically reshaping entry-level hiring.",
    updated: "August 2026",
    hype: [
      {
        text: "Bootcamps commonly advertise 85-96% job placement rates and salaries in the $70K-$109K range within months of graduating.",
        source: "Aggregated bootcamp marketing pages (Hack Reactor, App Academy, Springboard, Flatiron)",
      },
      {
        text: "\"Become a software engineer in as little as 15 weeks,\" plus a tuition-back job guarantee if you're not employed within 6 months (with eligibility conditions attached, like logging 10-30 applications a week).",
        source: "Springboard, our own affiliate training partner",
      },
      {
        text: "Some reporting suggests that despite Springboard's advertised employment rate near 95.8%, only around 1.2% of students in recent cohorts actually collected a refund under the job guarantee. We couldn't independently verify this exact figure against a primary Springboard filing, so treat it as a data point worth asking about directly rather than a settled fact, but it points at the same thing the placement-rate gap below shows.",
      },
    ],
    realityData: [
      {
        text: "The industry's own third-party outcomes auditor, CIRR, requires \"employed\" to mean full-time, professional, in-field work (not internships, not freelance, not underemployment). Under that stricter standard, in-field placement within 180 days runs closer to 64-78% industry-wide, noticeably below the 85-96% many bootcamps advertise on their own numbers.",
        source: "Council on Integrity in Results Reporting, cirr.org",
      },
      {
        text: "A broader 2025 industry survey found 79% of bootcamp alumni employed full-time, with an average starting salary near $70,700, closely matching our own $60K-$75K entry figure for this path.",
        source: "Course Report, 2025 Year in Review",
      },
      {
        text: "The Bureau of Labor Statistics puts the median software developer salary at $133,080, with 15% projected job growth through 2034 (well above average for all occupations). That's a genuinely strong long-run outlook, but it describes the whole employed workforce, mostly mid-career and senior developers, not what a new entrant should expect to earn on day one.",
        source: "BLS Occupational Outlook Handbook, bls.gov",
      },
      {
        text: "New-grad hiring at the 15 largest tech companies fell 25% from 2023 to 2024, and now makes up only about 7% of hires there, down more than half from 2019 levels.",
        source: "SignalFire, State of Tech Talent Report",
      },
      {
        text: "Software job postings remain roughly 27.5% below pre-pandemic levels even after a 2025-2026 recovery, and 71% of that recovery has been in senior roles. Entry-level and mid-level postings were still declining year over year.",
        source: "Indeed Hiring Lab",
      },
      {
        text: "The bootcamp industry itself is contracting, with several well-known programs closing (including SNHU's bootcamp and Portland's Epicodus) amid falling enrollment and a tighter junior hiring market.",
      },
    ],
    aiAngle: {
      intro:
        "This is the single most important, best-evidenced finding in this research, and it deserves to be front and center rather than a footnote. Multiple independent, rigorous sources converge on the same conclusion.",
      points: [
        {
          text: "Using millions of real payroll records, researchers found that employment for 22-25 year olds in AI-exposed occupations is now about 19% below where it would be expected to be, with no comparable gap for workers over 30. The effect comes from reduced hiring of young workers, not increased firing.",
          source: "Stanford Digital Economy Lab, \"Canaries in the Coal Mine\" (Brynjolfsson, Chandar, Chen)",
        },
        {
          text: "At firms that have adopted generative AI, entry-level hiring has reportedly fallen around 80% per quarter since 2023, concentrated specifically in software development and customer service. Rather than eliminating junior titles outright, many employers are \"seniorizing\" them, keeping the job title but requiring the judgment and experience of a senior hire.",
          source: "Harvard working paper, via Forbes reporting, May 2026",
        },
        {
          text: "This lines up with Indeed's posting data above (entry-level postings still shrinking while senior postings recover) and with Stack Overflow's own 2025 developer survey, which found a declining share of developers aged 18-24 in the field since 2022.",
        },
      ],
    },
    voices: [
      {
        quote:
          "Laid off last July, applied over 300 jobs since Jan 2024, however not receiving any interviews yet... i graduated from bootcamp end of 2021... it's really difficult to be selected for interviews.",
        source: "Bootcamp grad, posted on Blind (teamblind.com)",
      },
      {
        quote:
          "176 applications since December 2023, only 3 online assessments.",
        source: "Bootcamp grad, describing their job search on Blind",
      },
    ],
    synthesis: [
      "The long-run outlook for software development, per BLS, is genuinely strong. This isn't a dying field. But the fast, easy on-ramp that bootcamp marketing sold in 2018-2021 (12-15 weeks, 85%+ placement, quick six-figure trajectory) has broken down, and we now have unusually convergent, rigorous data (Stanford's payroll research, a Harvard working paper, and Indeed's live hiring data) all pointing at the same cause: AI tools have specifically eaten the boilerplate, testing, and routine debugging work that used to justify hiring and mentoring a junior developer in the first place.",
      "We're keeping our Springboard partnership because the field itself remains real and the training is legitimate. But if you're going in expecting a 3-month sprint to a six-figure job, the current data doesn't support that timeline, and we'd rather tell you that upfront.",
    ],
    forWhom: [
      "People who can commit 6-12+ months of active searching after training, not weeks.",
      "People who build a real portfolio (shipped projects, open-source contributions, ideally a referral or two) instead of relying on a bootcamp's job-guarantee logistics or cold-applying alone.",
      "Career changers with transferable professional experience or an existing network. The data shows the youngest entrants with no other signal are being hit hardest right now, more than a 30-something switching fields with real work history behind them.",
    ],
    notForWhom: [
      "Anyone expecting a fast, guaranteed timeline based on a bootcamp's advertised placement rate rather than CIRR's audited numbers.",
      "Anyone who can't sustain a long, often discouraging job search in a market where entry-level postings are still shrinking even as senior postings recover.",
    ],
    sources: [
      "BLS Occupational Outlook Handbook, bls.gov/ooh/computer-and-information-technology/software-developers.htm",
      "Council on Integrity in Results Reporting, cirr.org",
      "Stanford Digital Economy Lab, \"Canaries in the Coal Mine\", digitaleconomy.stanford.edu",
      "SignalFire, State of Tech Talent Report, signalfire.com",
      "Indeed Hiring Lab, hiringlab.org",
      "Stack Overflow 2025 Developer Survey, survey.stackoverflow.co",
      "Course Report, 2025 Year in Review, coursereport.com",
      "Springboard job guarantee terms, reviewed directly, springboard.com",
      "Blind (teamblind.com)",
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function getGuideForPath(pathId: PathId) {
  return guides.find((g) => g.pathId === pathId);
}
