export type PathId =
  | "sales"
  | "swe"
  | "trades"
  | "supplychain"
  | "healthcare"
  | "data"
  | "uxui"
  | "itsec"
  | "bizops";

export type QuizOption = {
  label: string;
  path: PathId;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What sounds most like a good day at work?",
    options: [
      { label: "Talking to people and helping them make a decision", path: "sales" },
      { label: "Deep-focus problem solving: debugging, building logic", path: "swe" },
      { label: "Working with your hands on something real and physical", path: "trades" },
      { label: "Making sure every detail and moving piece is accounted for", path: "supplychain" },
      { label: "Directly helping or caring for someone, one-on-one", path: "healthcare" },
    ],
  },
  {
    id: "q2",
    question: "What would you most enjoy getting better at?",
    options: [
      { label: "Reading data and finding the story inside it", path: "data" },
      { label: "Making something people use feel simple and clear", path: "uxui" },
      { label: "Understanding how to protect systems from threats", path: "itsec" },
      { label: "Keeping a business's operations, people, or finances organized", path: "bizops" },
      { label: "Persuading someone and building trust quickly", path: "sales" },
    ],
  },
  {
    id: "q3",
    question: "What's mainly pulling you toward a change?",
    options: [
      { label: "I want to build or create something I can point to", path: "swe" },
      { label: "This field has real, growing demand right now", path: "trades" },
      { label: "I want steady, dependable work I can count on", path: "supplychain" },
      { label: "I want work that feels meaningful, not just a paycheck", path: "healthcare" },
      { label: "I want to get better at something analytical and in-demand", path: "data" },
    ],
  },
  {
    id: "q4",
    question: "How do you feel about screens and computers all day?",
    options: [
      { label: "I want a computer, but for something visual and creative", path: "uxui" },
      { label: "Love it: the more technical, the better", path: "itsec" },
      { label: "Fine with it, especially for organizing and communicating", path: "bizops" },
      { label: "I'd rather be talking to people than staring at a screen", path: "sales" },
      { label: "Bring it on, I could build things all day", path: "swe" },
    ],
  },
  {
    id: "q5",
    question: "Which pace fits you better?",
    options: [
      { label: "I'm patient. Real training takes time, and that's fine", path: "trades" },
      { label: "I want in on a field that's growing before it gets crowded", path: "supplychain" },
      { label: "I want to start helping people relatively soon", path: "healthcare" },
      { label: "I'm fine investing a few months of training for a bigger jump", path: "data" },
      { label: "I want to build a portfolio, even if it takes some time", path: "uxui" },
    ],
  },
  {
    id: "q6",
    question: "If a friend described you, they'd probably say...",
    options: [
      { label: "“They're careful and think about worst-case scenarios.”", path: "itsec" },
      { label: "“They're the most organized person I know.”", path: "bizops" },
      { label: "“They can sell anything.”", path: "sales" },
      { label: "“They love figuring out how things work.”", path: "swe" },
      { label: "“They can fix or build almost anything.”", path: "trades" },
    ],
  },
];

export type CareerPath = {
  id: PathId;
  title: string;
  blurb: string;
  affiliate: boolean;
  /** Typical entry-level annual pay range in USD, per 2026 sources. */
  payLow: number;
  payHigh: number;
  links: { label: string; href: string }[];
};

export const careerPaths: Record<PathId, CareerPath> = {
  sales: {
    id: "sales",
    title: "Tech Sales (SDR)",
    blurb:
      "The fastest real path in for a career changer. No degree required in practice, entry-level SDR pay averages $55K (higher at AI companies), and companies are actively hiring people without sales backgrounds.",
    affiliate: true,
    payLow: 42000,
    payHigh: 61000,
    links: [
      { label: "Sales Development Representative", href: "https://higherlevels.com/?via=journey" },
      { label: "SDR to Account Executive", href: "https://higherlevels.com/?via=journey" },
      { label: "Account Executive Growth", href: "https://higherlevels.com/?via=journey" },
    ],
  },
  swe: {
    id: "swe",
    title: "Software Engineering",
    blurb:
      "Still a real path in, but the honest 2026 picture is slower than the old bootcamp hype: expect 6-12 months of active searching and a strong portfolio, since some companies are hiring fewer juniors due to AI copilots.",
    affiliate: true,
    payLow: 60000,
    payHigh: 75000,
    links: [
      {
        label: "Software Engineering Course",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  trades: {
    id: "trades",
    title: "Skilled Trades",
    blurb:
      "Electricians, HVAC techs, and plumbers are in the middle of a genuine shortage: 530,000+ construction jobs are unfilled right now. Median pay of $60-80K, and it's about as AI-proof as work gets.",
    affiliate: true,
    payLow: 60000,
    payHigh: 80000,
    links: [
      { label: "Electrician", href: "https://coursecareers.com/a/bbe72885?course=electrical" },
      { label: "HVAC", href: "https://coursecareers.com/a/bbe72885?course=hvac" },
      { label: "Plumbing", href: "https://coursecareers.com/a/bbe72885?course=plumbing" },
      {
        label: "Construction Project Management",
        href: "https://coursecareers.com/a/bbe72885?course=construction-management",
      },
    ],
  },
  supplychain: {
    id: "supplychain",
    title: "Supply Chain",
    blurb:
      "One of the most accessible entry points for total career switchers, with a documented history of hiring people from retail, military logistics, or customer service backgrounds. Entry pay around $55-75K.",
    affiliate: true,
    payLow: 55000,
    payHigh: 75000,
    links: [{ label: "Supply Chain", href: "https://www.coursecareers.com/journey" }],
  },
  healthcare: {
    id: "healthcare",
    title: "Healthcare, Non-Clinical",
    blurb:
      "Medical billing/coding, health IT, and clinical operations roles often need under a year of certification, not a medical degree. 1.9 million annual openings projected through 2033. We don't have a partner in this space, so here's the real, neutral source instead of a sales page.",
    affiliate: false,
    payLow: 35000,
    payHigh: 45000,
    links: [
      {
        label: "BLS: Healthcare Careers That Don't Require a 4-Year Degree",
        href: "https://www.bls.gov/careeroutlook/2026/article/healthcare-science-and-engineering-careers.htm",
      },
    ],
  },
  data: {
    id: "data",
    title: "Data Analytics",
    blurb:
      "85% of data analyst listings don't specify required experience, employers care more about a real portfolio. Entry-level pay has climbed to around $90K in major markets.",
    affiliate: true,
    payLow: 85000,
    payHigh: 100000,
    links: [
      {
        label: "Data Analytics / Science Training",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  uxui: {
    id: "uxui",
    title: "UX / UI Design",
    blurb:
      "The tightest entry-level market of this list right now, but real for career changers who lead with transferable strengths and a small number of well-documented case studies over a big portfolio of mockups.",
    affiliate: true,
    payLow: 56000,
    payHigh: 82000,
    links: [
      {
        label: "UX / UI Training",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  itsec: {
    id: "itsec",
    title: "IT & Cybersecurity",
    blurb:
      "Security+ is close to a mandatory baseline now, and SOC Analyst, GRC, and Security Admin roles are hiring straight out of bootcamps. Entry-level cyber cert pay averages $93K.",
    affiliate: true,
    payLow: 78000,
    payHigh: 100000,
    links: [
      { label: "I.T. Training", href: "https://www.coursecareers.com/journey" },
      { label: "Cybersecurity Training", href: "https://www.leveldcareers.com/a/2147528378/5LmSQXTm" },
      {
        label: "Graduate w/ CompTIA Security+",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  bizops: {
    id: "bizops",
    title: "Business Operations",
    blurb:
      "Accounting, HR, property management, and digital marketing all live here. 72% of accounting grads are placed within 6 months; entry-level ops pay averages around $57K.",
    affiliate: true,
    payLow: 50000,
    payHigh: 65000,
    links: [
      { label: "Accounting", href: "https://coursecareers.com/a/bbe72885?course=accounting" },
      { label: "Business Operations", href: "https://www.coursecareers.com/journey" },
    ],
  },
};
