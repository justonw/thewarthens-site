import type { PathId } from "@/lib/quiz";

export type GuidePoint = {
  text: string;
  source?: string;
  // Where to read it: the source's own page, shown as a link.
  url?: string;
};

export type GuideQuote = {
  quote: string;
  source: string;
  url?: string;
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
  sources: (string | { label: string; url: string })[];
};

export const guides: Guide[] = [
  {
    slug: "tech-sales-hype-vs-reality",
    pathId: "sales",
    title: "Tech Sales (SDR): Hype vs. Reality",
    dek: "Is tech sales worth it in 2026? What training marketing promises, checked against sales data from 2025 and 2026, a survey of SDR leaders taken in August and September 2026, and what SDRs are posting right now.",
    updated: "November 2026",
    hype: [
      {
        text: "A tech sales course provider says on its own website that you don't need a degree, that its course costs under $500 and takes about 4 to 12 weeks, and that the path to six-figure roles doesn't require a degree. It also says openly that it is biased because it sells the course.",
        source: "A tech sales course provider's own pages (not named here)",
      },
      {
        text: "Six-figure claims are usually about the next job up. That same provider's pages put median SDR on-target earnings at $80,000 and cite $200,000 for account executives, the role after SDR.",
        source: "The same provider's pages (not named here)",
      },
      {
        text: "In 2022 a state attorney general sued a tech sales training company over marketing that guaranteed a job offer at a stated salary. The state said the program was about 15 hours of videos. That was a lawsuit filing, not a verdict, and it is one company from 2022, but it shows what job guarantees in this space have looked like.",
        source: "A 2022 state attorney general news release (company not named here)",
      },
    ],
    realityData: [
      {
        text: "RepVue's live salary page, based on 8,073 verified submissions, shows a median SDR base of $60,000 (no change in the last year) and median on-target earnings (OTE, meaning base plus commission if you hit quota) of $90,000. It shows 57.5% of SDRs attain quota.",
        source: "RepVue, Sales Development Representative salary page, viewed Nov 21, 2026",
        url: "https://www.repvue.com/salaries/sales-development-representative",
      },
      {
        text: "The Bridge Group's 2025 benchmark of 351 B2B companies found median SDR OTE of $80,000 ($55,000 base and $25,000 variable), unchanged since 2022. The report says pay has grown about 0.56% a year over the past decade, well below inflation.",
        source: "The Bridge Group, 2025 SDR Models, Motions & Metrics report (published Feb 6, 2025)",
        url: "https://www.bridgegroupinc.com/research/2025-sdr-models-metrics-report-the-bridge-group",
      },
      {
        text: "In that benchmark, 60% of SDRs were at quota, the lowest in the study's history, and the share has trended down since 2018. The median monthly quota was 10 meetings held, and the median SDR logged 112 outreach activities a day (44 phone, 41 email, 19 LinkedIn, 8 text or other).",
        source: "The Bridge Group, 2025",
        url: "https://www.bridgegroupinc.com/research/2025-sdr-models-metrics-report-the-bridge-group",
      },
      {
        text: "Annual turnover was 40% in 2024: 13% left involuntarily, 11% left voluntarily, and 16% were promoted. The report says promotions have halved since 2020, when they were 34%. In a typical year, more SDRs left the role (24%) than were promoted (16%).",
        source: "The Bridge Group, 2025",
        url: "https://www.bridgegroupinc.com/research/2025-sdr-models-metrics-report-the-bridge-group",
      },
      {
        text: "A survey of 574 SDR leaders taken Aug 26 to Sep 20, 2026 found average SDR tenure of 19.8 months and average time to promotion of 20.9 months. In 33% of organizations, tenure ends before the promotion point; in 47% it ends at about the same time; only about 20% keep SDRs past it. The report's own summary is that roughly four in five organizations lose the typical SDR at or before promotion. In North America, average tenure is 18.7 months.",
        source: "memoryBlue, The State of Sales Development 2026 (survey run by SDR Leaders Global, sponsored by memoryBlue)",
        url: "https://memoryblue.com/collateral/the-state-of-sales-development-2026/",
      },
      {
        text: "On openings: new SDR job posts at US B2B digital-native companies were down 21% from a year earlier in the first half of 2026, below the rest of the hiring market. Overall go-to-market job posts were down 15%. The author notes job-post data can be noisy, and this covers digital-native companies, not every employer.",
        source: "Growth Unhinged (Kyle Poyar), May 20, 2026, on the H1 2026 State of GTM Hiring report using Sumble job-post data",
        url: "https://www.growthunhinged.com/p/who-s-actually-hiring-in-gtm-right-now",
      },
      {
        text: "Recruiting firm Betts says SDR hiring fell to roughly half of its pandemic-era peak in 2024, and that entry-level go-to-market roles have declined as more companies adopt AI tools. Betts sells hiring services to employers.",
        source: "Betts Recruiting, \"Top SDR Compensation Trends in Tech for 2026\" (Apr 28, 2026)",
        url: "https://bettsrecruiting.com/blog/top-sdr-compensation-trends-in-tech-for-2026/",
      },
      {
        text: "In an April 2025 survey of more than 560 venture-backed B2B software companies, 36% had decreased SDR/BDR headcount in the prior year, the highest share of any sales role surveyed. 44% kept it the same and 19% increased it.",
        source: "SaaStr (Jason Lemkin), reporting on Emergence Capital's Beyond Benchmarks survey",
        url: "https://www.saastr.com/the-great-sdr-downsizing-36-of-b2b-companies-cut-sales-development-teams-in-2025/",
      },
      {
        text: "A ZoomInfo-produced analysis published Aug 12, 2026 says most reductions in junior sales roles come through turnover that is not backfilled, not through mass layoffs, and that promotion rates from SDR to account executive have dropped significantly. It is written by a sales-software company and cites other vendors.",
        source: "ZoomInfo story distributed by Stacker, Aug 12, 2026",
        url: "https://krdo.com/stacker-business-economy/2026/08/12/ai-is-reshaping-gtm-careers-especially-at-entry-level/",
      },
      {
        text: "Not every source says the function is shrinking. The same Aug to Sep 2026 survey found 53% of organizations grew SDR headcount over the past year, 25% held steady and 23% cut, and its leaders reported average SDR quota attainment of 82%. That survey asked leaders of existing teams, so it cannot show how hard it is to get hired onto one. The sources disagree, and we would rather show you both.",
        source: "memoryBlue, The State of Sales Development 2026",
        url: "https://memoryblue.com/collateral/the-state-of-sales-development-2026/",
      },
    ],
    aiAngle: {
      intro:
        "AI is changing the SDR job, but the data does not show the job disappearing. It shows some junior seats not being refilled and new AI skills being expected.",
      points: [
        {
          text: "78% of SDR teams use AI. Only 16% use autonomous AI SDR agents (13% alongside people, 3% as a partial replacement) and 59% never have. Of the 14 organizations using AI agents as a partial replacement, half cut headcount, a group the report itself calls too small to generalize from.",
          source: "memoryBlue, The State of Sales Development 2026 (Aug 26 to Sep 20, 2026)",
          url: "https://memoryblue.com/collateral/the-state-of-sales-development-2026/",
        },
        {
          text: "AI-native companies more than doubled their SDR headcount year over year, even as SDR job posts overall fell 21%. The report names Cursor, Decagon and OpenAI among AI companies hiring SDRs.",
          source: "Growth Unhinged (Kyle Poyar), May 20, 2026",
          url: "https://www.growthunhinged.com/p/who-s-actually-hiring-in-gtm-right-now",
        },
        {
          text: "Betts says some companies are moving from the SDR title to \"Sales Development Analyst,\" where people are expected to arrive already fluent in AI tools for outreach, research and reporting, and calls AI fluency the current hiring baseline for go-to-market roles.",
          source: "Betts Recruiting, Apr 28, 2026",
          url: "https://bettsrecruiting.com/blog/top-sdr-compensation-trends-in-tech-for-2026/",
        },
      ],
    },
    voices: [
      {
        quote: "Nobody mentioned that requirement the first two times.",
        source: "Senior SDR passed over for an account executive seat for the third time in 2.5 years. RepVue Community, Nov 16, 2026",
        url: "https://www.repvue.com/community/posts/passed-over-for-ae-a-third-time",
      },
      {
        quote: "three people on my team have left since August without being backfilled",
        source: "BDR asking whether to stay. RepVue Community, Nov 19, 2026",
        url: "https://www.repvue.com/community/posts/team-shrinking-and-nobody-is-saying-why",
      },
      {
        quote: "Severance is only 4 weeks",
        source: "Laid-off SDR weighing a 6-month contract SDR role at the old base with no variable pay. RepVue Community, Nov 20, 2026",
        url: "https://www.repvue.com/community/posts/contract-sdr-role-or-keep-waiting",
      },
      {
        quote: "I can't even get an interview for an SDR spot.",
        source: "Experienced account manager and SDR trying to switch industries. RepVue Community, Oct 9, 2026",
        url: "https://www.repvue.com/community/posts/switching-industries-advice",
      },
      {
        quote: "no shows run about 30% for me",
        source: "SDR whose plan pays on meetings held, not booked, with a quota of 20 held a month. RepVue Community, Nov 3, 2026",
        url: "https://www.repvue.com/community/posts/comp-plan-math",
      },
    ],
    synthesis: [
      "The sources agree on a few hard things. The entry door is narrower than the marketing suggests (SDR job posts down 21% in the first half of 2026, and recruiters saying entry-level go-to-market roles have declined). Pay has barely moved (median on-target earnings of $80,000 to $90,000, flat since 2022 in one benchmark). And only about 57% to 60% of SDRs hit quota.",
      "The promotion story is where the marketing and the data differ most. The typical SDR stays about 19.8 months and waits about 20.9 months for a promotion, the Bridge Group found promotions have halved since 2020, and SDRs on RepVue describe being passed over for account executive seats that go to outside hires. Fast, guaranteed six-figure promotion is not what the data shows.",
      "Where the sources disagree is whether the whole SDR function is shrinking. Surveys of team leaders show more teams growing than cutting, while job-post data shows fewer new openings. Both can be true: fewer entry-level openings, and the teams that exist still hiring and keeping people. We would rather you go in knowing the honest range than find it out three months into a day of about 112 outreach touches.",
      "We're keeping our current training partnership for this path because the entry-level pay and the on-ramp itself are real. But we'd rather you go in knowing the honest numbers.",
    ],
    forWhom: [
      "People with real customer-facing or resilience experience (retail, hospitality, service, military) who can handle daily rejection at volume and a pay plan that depends on meetings held.",
      "People who go in expecting realistic total pay of about $55,000 to $90,000 and a wait of around 20 months for a promotion, not a fast, guaranteed six-figure track.",
      "People willing to apply widely, build skills with AI sales tools, and stay with a slow search.",
    ],
    notForWhom: [
      "Anyone counting on a guaranteed job or a fast six-figure track after a short course. A 2022 state attorney general lawsuit over a tech sales course's job guarantee, and the current hiring data, both argue against that.",
      "Anyone who cannot handle daily rejection and a quota that only about 57% to 60% of SDRs reach.",
      "Anyone who needs steady income right away. Median annual turnover in the role is 40%, and SDRs are posting about layoffs and contract roles with no variable pay.",
    ],
    faq: [
      {
        question: "Is tech sales worth it in 2026?",
        answer: "It can be, for the right person, but it is harder than the marketing says. Median SDR pay is about $60,000 base and $80,000 to $90,000 on-target earnings, which is only paid in full if you hit quota, and only about 57% to 60% of SDRs do. New SDR job posts at US digital-native B2B companies were down 21% in the first half of 2026, and the typical SDR waits about 20.9 months for a promotion while staying about 19.8 months. A survey of team leaders in August and September 2026 found more teams growing than cutting, so the sources disagree on how much the role is shrinking.",
      },
      {
        question: "Is it hard to get hired as an SDR in 2026?",
        answer: "Openings are down, but the role is not gone. Job-post data for the first half of 2026 shows new SDR posts down 21%, a recruiting firm says entry-level go-to-market roles have declined as companies adopt AI tools, and SDRs on RepVue describe long searches and being passed over for promotions. A survey of 574 SDR leaders (Aug 26 to Sep 20, 2026) found 53% of organizations grew SDR headcount and 23% cut it. That survey asked team leaders, so it cannot show how hard hiring is for a first-time applicant.",
      },
      {
        question: "How much do tech sales reps (SDRs) actually make?",
        answer: "RepVue's data from 8,073 verified submissions shows a median base of $60,000 and median on-target earnings of $90,000 as of November 2026. The Bridge Group's 2025 benchmark of 351 companies found $80,000 OTE ($55,000 base, $25,000 variable), unchanged since 2022. OTE assumes you hit quota, and RepVue shows 57.5% of SDRs do. The six-figure numbers in marketing usually describe account executives, not SDRs.",
      },
      {
        question: "How long does it take to get promoted from SDR to account executive?",
        answer: "In the 2026 memoryBlue survey of SDR leaders, average time to promotion was 20.9 months while average SDR tenure was 19.8 months, and roughly four in five organizations lose the typical SDR at or before the promotion point. The Bridge Group found promotions made up 16% of SDRs in 2024, down from 34% in 2020.",
      },
      {
        question: "Will AI replace SDRs?",
        answer: "The data so far does not show that. In the 2026 memoryBlue survey, 78% of SDR teams use AI but only 16% use autonomous AI SDR agents. AI-native companies more than doubled their SDR headcount over the past year according to the H1 2026 hiring report, while a ZoomInfo analysis says most junior reductions are roles that are not backfilled after someone leaves. Nobody can say what happens next, so treat any single prediction with care.",
      },
    ],
    sources: [
      { label: "RepVue, Sales Development Representative salary page (viewed Nov 21, 2026)", url: "https://www.repvue.com/salaries/sales-development-representative" },
      { label: "RepVue Community, SDR forum (public posts, Oct and Nov 2026)", url: "https://www.repvue.com/community/sdr" },
      { label: "memoryBlue, The State of Sales Development 2026 (survey Aug 26 to Sep 20, 2026)", url: "https://memoryblue.com/collateral/the-state-of-sales-development-2026/" },
      { label: "The Bridge Group, 2025 SDR Models, Motions & Metrics report (Feb 6, 2025)", url: "https://www.bridgegroupinc.com/research/2025-sdr-models-metrics-report-the-bridge-group" },
      { label: "Growth Unhinged, Who's actually hiring in GTM right now (May 20, 2026)", url: "https://www.growthunhinged.com/p/who-s-actually-hiring-in-gtm-right-now" },
      { label: "Betts Recruiting, Top SDR Compensation Trends in Tech for 2026 (Apr 28, 2026)", url: "https://bettsrecruiting.com/blog/top-sdr-compensation-trends-in-tech-for-2026/" },
      { label: "SaaStr, The Great SDR Downsizing (Emergence Capital survey, April 2025)", url: "https://www.saastr.com/the-great-sdr-downsizing-36-of-b2b-companies-cut-sales-development-teams-in-2025/" },
      { label: "ZoomInfo via Stacker, AI is reshaping GTM careers, especially at entry level (Aug 12, 2026)", url: "https://krdo.com/stacker-business-economy/2026/08/12/ai-is-reshaping-gtm-careers-especially-at-entry-level/" },
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
