export type TechLink = {
  label: string;
  href: string;
};

export type TechSection = {
  title: string;
  note?: string;
  links: TechLink[];
};

export const freeResources: TechSection = {
  title: "Free Career Resources",
  links: [
    { label: "Trial Cold Call Simulator", href: "https://www.rithim.ai/r/pNWb22tV" },
    { label: "Free Tech Courses", href: "https://perscholas.org/" },
    { label: "Learn to Code", href: "https://www.freecodecamp.org/" },
    {
      label: "Apollo.io Sales Engagement Platform",
      href: "https://get.apollo.io/yrc241daugd9",
    },
  ],
};

export const techSections: TechSection[] = [
  {
    title: "Learn Tech Sales",
    note: 'with "Higher Levels" (Coupon: JOURNEY)',
    links: [
      { label: "Sales Development Representative", href: "https://higherlevels.com/?via=journey" },
      { label: "SDR to Account Executive", href: "https://higherlevels.com/?via=journey" },
      { label: "Account Executive Growth", href: "https://higherlevels.com/?via=journey" },
    ],
  },
  {
    title: "Springboard & University of South Florida Courses",
    links: [
      {
        label: "Gen AI Online Course",
        href: "https://usfbootcamps.com/leads/generative-ai-for-business/?utm_source=thewarthens&utm_medium=influencer&utm_campaign=usfai&utm_term=paid&utm_content=usfai582025",
      },
    ],
  },
  {
    title: "Learn Cybersecurity and I.T.",
    note: 'with "Springboard" or "Leveld Careers"',
    links: [
      { label: "I.T. Training", href: "https://www.coursecareers.com/journey" },
      {
        label: "Cybersecurity Training",
        href: "https://www.leveldcareers.com/a/2147528378/5LmSQXTm",
      },
      {
        label: "Graduate w/ CompTIA Security+",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  {
    title: "Learn Digital Transformation & Design",
    note: 'with "Springboard"',
    links: [
      {
        label: "Software Engineering Course",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
      {
        label: "UX / UI Training",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
      {
        label: "Data Analytics / Science Training",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
    ],
  },
  {
    title: "Learn a Skilled Trade",
    note: 'with "CourseCareers"',
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
  {
    title: "Learn Supply Chain",
    note: 'with "CourseCareers"',
    links: [{ label: "Supply Chain", href: "https://www.coursecareers.com/journey" }],
  },
  {
    title: "Learn Business Operations & Accounting",
    note: 'with "CourseCareers"',
    links: [
      { label: "Accounting", href: "https://coursecareers.com/a/bbe72885?course=accounting" },
      { label: "Business Operations", href: "https://www.coursecareers.com/journey" },
    ],
  },
];
