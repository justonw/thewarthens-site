import type { PathId } from "@/lib/quiz";

export type GuidePoint = {
  text: string;
  source?: string;
};

export type GuideQuote = {
  quote: string;
  source: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
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
  faq: GuideFaq[];
  sources: string[];
};

export const guides: Guide[] = [
  {
    slug: "tech-sales-hype-vs-reality",
    pathId: "sales",
    title: "Tech Sales (SDR): Hype vs. Reality",
    dek: "Is tech sales worth it in 2026? What sales-training marketing claims about breaking into tech sales, checked against real 2025-2026 industry data and what actual SDRs say.",
    updated: "August 2026",
    hype: [
      {
        text: "Sales-training marketing in this space commonly claims no prior tech or sales experience is needed, and pitches a fast path to a \"$100K+ career\" within weeks of finishing a course.",
      },
      {
        text: "A common claim across course marketing: typical starting salaries for entry-level tech sales roles are around $68,000, with most people hired within 1 to 6 months of finishing a course.",
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
      "Where the marketing gets dishonest is in blurring SDR pay with the post-promotion Account Executive pay, and staying quiet about a promotion pipeline that's measurably shrinking. The \"$100K+ career\" pitch is describing a destination that fewer people are actually reaching on the timeline implied.",
      "We're keeping our current training partnership for this path because the entry-level pay and the on-ramp itself are real. But we'd rather you go in knowing the honest numbers than find them out three months into a 40-call-a-day quota grind.",
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
    faq: [
      {
        question: "Is tech sales worth it in 2026?",
        answer: "For entry-level pay, yes: real industry data puts SDR total comp around $55K-$90K, close to what we show on our Income Snapshot, a genuinely strong outcome for someone with no degree. It's worth it for people with real customer-facing experience who go in expecting that range, not the '$100K+ career' framing some marketing uses, and a competitive 18-24+ month path to promotion rather than a guaranteed 12-month one.",
      },
      {
        question: "Is tech sales saturated?",
        answer: "Entry-level postings are more competitive than a few years ago: one company reported over 1,000 applications within 3 hours of posting a single SDR opening in 2025. AI outbound tools are also letting teams hit the same pipeline goals with fewer SDRs. It's not gone, but it's harder to break into than the marketing suggests.",
      },
      {
        question: "How much do tech sales reps (SDRs) actually make?",
        answer: "The most rigorous current benchmark puts median SDR base pay at $55,000 and total on-target earnings (OTE) at $80,000, though only 60% of SDRs actually hit quota in 2025. A separate crowd-verified database puts it slightly higher: $60K base, $85K OTE. Either way, that's below the $100K+ figure often used in marketing, which usually describes post-promotion Account Executive pay, not SDR pay.",
      },
      {
        question: "How long does it take to get promoted from SDR to Account Executive?",
        answer: "Longer than it used to. Promotions accounted for 34% of why people left the SDR seat in 2020; by 2025 that had dropped to just 16%, meaning more people are leaving the role for other reasons than being promoted up. Some industry reporting suggests the typical timeline has stretched from around 12 months to 18-24 months.",
      },
    ],
    sources: [
      "The Bridge Group, 2025 SDR Models, Metrics & Compensation Report, bridgegroupinc.com",
      "RepVue SDR salary data, repvue.com",
      "graph8.com, \"Is the SDR Role Dead? We Got 1,000 Applications in 3 Hours\"",
      "Sales-training and course marketing pages, reviewed directly",
      "Blind (teamblind.com) and RepVue company reviews",
    ],
  },
  {
    slug: "software-engineering-hype-vs-reality",
    pathId: "swe",
    title: "Software Engineering: Hype vs. Reality",
    dek: "Is software engineering still a good career in 2026? What bootcamp marketing claims, checked against real placement data, BLS numbers, and new research on how AI is reshaping entry-level hiring.",
    updated: "August 2026",
    hype: [
      {
        text: "Bootcamps commonly advertise 85-96% job placement rates and salaries in the $70K-$109K range within months of graduating.",
        source: "Aggregated bootcamp marketing pages",
      },
      {
        text: "A common claim across bootcamp marketing: \"become a software engineer in as little as 15 weeks,\" often paired with a tuition-back job guarantee if you're not employed within 6 months, typically with eligibility conditions attached, like logging 10-30 applications a week.",
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
      "We're keeping our current training partnership for this path because the field itself remains real and the training is legitimate. But if you're going in expecting a 3-month sprint to a six-figure job, the current data doesn't support that timeline, and we'd rather tell you that upfront.",
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
    faq: [
      {
        question: "Is software engineering still a good career in 2026?",
        answer: "Long-run, yes: BLS projects 15% job growth through 2034 with a strong median salary. Short-term for a new entrant, it's harder than the 2018-2021 bootcamp era suggested. New-grad hiring at the largest tech companies fell 25% from 2023 to 2024, and entry-level job postings are still down even as senior postings recover. Expect 6-12+ months of active searching, not weeks.",
      },
      {
        question: "Is a coding bootcamp worth it in 2026?",
        answer: "It depends which number you trust. Bootcamps commonly advertise 85-96% placement rates, but CIRR, the industry's own third-party outcomes auditor, which counts only full-time, in-field, professional work, puts real placement closer to 64-78%. A broader 2025 survey found 79% employed full-time at an average starting salary near $70,700, close to what we show on our own Income Snapshot.",
      },
      {
        question: "Will AI replace software engineers?",
        answer: "Not outright, but it's already reshaping who gets hired. Using millions of real payroll records, researchers found employment for 22-25 year olds in AI-exposed jobs is about 19% below where it would otherwise be, with no comparable gap for workers over 30. The effect comes from reduced hiring of juniors, not increased firing: AI has eaten much of the boilerplate and routine debugging work that used to justify hiring and mentoring someone new.",
      },
      {
        question: "Is it too late to become a software engineer?",
        answer: "No, but the on-ramp looks different now. The field's long-run outlook remains genuinely strong per BLS. What's changed is that success now depends more on a real portfolio (shipped projects, open-source contributions, a referral or two) and transferable professional experience than on a bootcamp certificate alone. The data shows younger entrants with no other signal are being hit hardest, more than an experienced career-changer with real work history.",
      },
    ],
    sources: [
      "BLS Occupational Outlook Handbook, bls.gov/ooh/computer-and-information-technology/software-developers.htm",
      "Council on Integrity in Results Reporting, cirr.org",
      "Stanford Digital Economy Lab, \"Canaries in the Coal Mine\", digitaleconomy.stanford.edu",
      "SignalFire, State of Tech Talent Report, signalfire.com",
      "Indeed Hiring Lab, hiringlab.org",
      "Stack Overflow 2025 Developer Survey, survey.stackoverflow.co",
      "Course Report, 2025 Year in Review, coursereport.com",
      "Bootcamp marketing pages and job guarantee terms, reviewed directly",
      "Blind (teamblind.com)",
    ],
  },
  {
    slug: "cybersecurity-hype-vs-reality",
    pathId: "itsec",
    title: "Cybersecurity & IT: Hype vs. Reality",
    dek: "Is there really a cybersecurity talent shortage? What cert-prep and training marketing claims, checked against real hiring data and what a CISA advisor has said about the shortage narrative itself.",
    updated: "August 2026",
    hype: [
      {
        text: "A common claim across cert-prep and career-change marketing: get a single entry cert like CompTIA Security+, and that's enough on its own to break into a security role, no other experience required.",
      },
      {
        text: "A recurring \"career-changer to six-figure analyst in 12-16 weeks\" narrative shows up across bootcamp and course advertising, sometimes framed as \"barista to pentester\" in a few months.",
      },
      {
        text: "The most commonly recycled hype-adjacent statistic in this space: a \"3.5 million\" or \"4.8 million unfilled cybersecurity jobs\" figure, used to imply the field is desperate for newcomers and hiring is easy.",
      },
      {
        text: "Self-reported job placement rates, often 85%+, advertised without third-party audit, is a documented pattern across training programs in this space.",
      },
    ],
    realityData: [
      {
        text: "The 4.8 million global \"workforce gap\" figure is real and grew 19% year over year, but ISC2's own methodology note describes it as \"perceived staffing need based on organizational surveys,\" not a direct count of open, fillable, entry-level jobs. It measures how understaffed employers feel, weighted toward mid and senior roles, not how many entry-level seats are actually open.",
        source: "ISC2, 2025 Cybersecurity Workforce Study, isc2.org",
      },
      {
        text: "A CISA cybersecurity advisor has publicly pushed back on the shortage narrative itself, characterizing it as partly a myth driven by inadequate salaries and poor job or location fit rather than a true talent void.",
        source: "AFCEA Signal, \"Is the Cyber Workforce Shortage a Myth?\" (quoting Klint Walker, CISA)",
      },
      {
        text: "Entry-level hiring tells a different story than the shortage number suggests: in one recent labor-market analysis, only 17% of employers actively recruited entry-level talent (down from 25%), 63% of postings wanted 2-6 years of experience, and 31% of organizations made zero entry-level cybersecurity hires in the prior year despite reporting a shortage. This data is UK-sourced, but the pattern is widely described as similar in the US.",
        source: "UK Cyber Security Skills in the Labour Market report, 2025",
      },
      {
        text: "Real entry-level SOC (Security Operations Center) analyst pay varies a lot by source: reported averages range from roughly $58K to $90K depending on how \"entry-level\" is defined, with a 25th-75th percentile band closer to $40K-$62K. That's a wide, source-dependent spread, worth treating as a range rather than a single number, and it runs below our own $78K-$100K Income Snapshot figure for this path, which likely reflects 1-2 years of experience rather than a true first day on the job.",
      },
      {
        text: "CompTIA Security+ genuinely is valued: it's the second most requested certification in US cybersecurity job postings. But it's consistently described as \"the minimum needed to be taken seriously,\" not sufficient alone, pairing it with real hands-on skill (home labs, Wireshark, Splunk, CTF platforms) is the difference employers describe looking for.",
        source: "CyberSeek certification-demand data",
      },
      {
        text: "There's a real contradiction worth naming: the same industry's own hiring-trends research found 90% of hiring managers would consider a candidate with only general IT experience (no cyber-specific background), and 89% would consider a candidate with only an entry-level cert and no experience. But actual job postings often don't reflect that stated openness, which is the catch-22 many career-changers describe: employers say they're open to it, then post reqs wanting years of experience anyway.",
        source: "ISC2, 2025 Cybersecurity Hiring Trends Study",
      },
      {
        text: "The long-run outlook remains genuinely strong: information security analyst roles are projected to grow 29% from 2024 to 2034, one of the fastest-growing occupations tracked.",
        source: "BLS Occupational Outlook Handbook, bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm",
      },
    ],
    aiAngle: {
      intro:
        "Multiple independent write-ups converge on the same theme here: augmentation and role-flattening, not full elimination, but it directly targets the classic first rung into this field.",
      points: [
        {
          text: "The consistent, better-corroborated pattern across independent security-industry commentary: AI is absorbing Tier-1 SOC work specifically, log triage, alert correlation, initial ticket sorting, while demand grows for people who can validate AI output, do detection engineering, and threat-hunt.",
        },
        {
          text: "This matters directly for career-changers because Tier-1 SOC analyst work, the traditional first job after getting a cert, is exactly the task category AI security tooling is being built to automate. That's a real, structural headwind on the classic on-ramp, separate from and in addition to the entry-level hiring gap above.",
        },
      ],
    },
    voices: [
      {
        quote:
          "The shortage is partly a myth, driven by inadequate salaries and job or location fit, not a true talent void.",
        source: "Klint Walker, CISA cybersecurity advisor, quoted in AFCEA Signal",
      },
    ],
    synthesis: [
      "This isn't a bait-and-switch field: real growth, a real pay ceiling, and real demand exist, and the 29% projected growth rate is genuinely one of the strongest of any occupation tracked. But the on-ramp marketed to career-changers, get a cert, ride a 3.5-4.8 million job shortage into a fast hire, mischaracterizes what that shortage actually is. It's real at the aggregate, experienced level, and largely illusory at the entry level: employers report feeling understaffed while simultaneously not budgeting for, recruiting for, or training entry-level hires.",
      "Layer an AI headwind on top: the Tier-1 SOC work that used to be the standard first job is exactly what security AI tooling is being built to absorb. The honest framing is that the destination is real, but the on-ramp is narrower and slower than advertised, and by most accounts getting narrower, not staying still.",
      "We're keeping our current training partnership for this path because certs and hands-on skill are genuinely valued by hiring managers, per their own research. They're just not sufficient alone the way a lot of marketing implies.",
    ],
    forWhom: [
      "People willing to build general IT, helpdesk, or sysadmin experience first, rather than jumping straight to a \"security analyst\" title with no IT background at all.",
      "People who treat certs as a door-opener paired with real hands-on skill (home labs, CTFs, Wireshark, Splunk, scripting), not a credential that alone closes the deal.",
      "People targeting a realistic 6-18 month runway, not a 12-16 week bootcamp-to-six-figures timeline.",
    ],
    notForWhom: [
      "Anyone expecting a single entry cert, with zero IT background, to produce a fast six-figure hire. The current hiring data doesn't support that pathway at scale.",
      "Anyone not prepared for AI increasingly absorbing the Tier-1 triage work that used to be the standard entry point.",
    ],
    faq: [
      {
        question: "Is there really a cybersecurity talent shortage?",
        answer: "Yes and no. The widely cited 4.8 million global \"workforce gap\" is real, but ISC2's own methodology describes it as employers' perceived staffing need from surveys, not a count of actual open entry-level jobs. It's weighted toward mid and senior roles. Meanwhile only 17% of employers actively recruit entry-level talent, and 31% made zero entry-level hires in the prior year despite reporting a shortage. A CISA cybersecurity advisor has publicly called the shortage narrative partly a myth, driven more by pay and job-fit issues than a true talent void.",
      },
      {
        question: "Is CompTIA Security+ enough to get hired?",
        answer: "Not alone. It's genuinely valued, the second most requested certification in US cybersecurity postings, but it's consistently described as the minimum needed to be taken seriously, not a credential that closes the deal by itself. Pairing it with real hands-on skill (home labs, CTFs, tools like Wireshark or Splunk) is what employers describe actually looking for.",
      },
      {
        question: "How do I get started in cybersecurity with no experience?",
        answer: "The most consistent advice across practitioner sources: build general IT, helpdesk, or sysadmin experience first rather than aiming straight for a security analyst title, then layer on a cert and demonstrable hands-on projects. Employers say they're open to candidates with IT-only experience or entry-level certs alone, but actual job postings often still ask for 2-6 years of experience, so budget for a real search, not a fast one.",
      },
      {
        question: "Is cybersecurity oversaturated?",
        answer: "Not at the senior level, where real demand and a 29% projected growth rate through 2034 hold up. At the entry level, it's more competitive than the shortage headlines suggest: only 11% of the global cyber workforce is under 30, and AI tools are increasingly absorbing the Tier-1 SOC work that used to be the standard first job.",
      },
    ],
    sources: [
      "ISC2, 2025 Cybersecurity Workforce Study, isc2.org",
      "ISC2, 2025 Cybersecurity Hiring Trends Study, isc2.org",
      "AFCEA Signal, \"Is the Cyber Workforce Shortage a Myth?\", afcea.org",
      "BLS Occupational Outlook Handbook, bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm",
      "UK Cyber Security Skills in the Labour Market report, 2025",
      "CyberSeek certification and job-posting data",
      "Cert-prep and cybersecurity training marketing pages, reviewed directly",
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function getGuideForPath(pathId: PathId) {
  return guides.find((g) => g.pathId === pathId);
}
