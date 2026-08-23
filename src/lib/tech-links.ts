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
    title: "Tech Sales Training",
    note: 'via Higher Levels · Coupon: JOURNEY',
    links: [
      { label: "Sales Development Representative", href: "https://higherlevels.com/?via=journey" },
      { label: "SDR to Account Executive", href: "https://higherlevels.com/?via=journey" },
      { label: "Account Executive Growth", href: "https://higherlevels.com/?via=journey" },
    ],
  },
  {
    title: "Software Engineering, Cybersecurity, Design & Data Bootcamps",
    note: "via Springboard",
    links: [
      {
        label: "Software Engineering Course",
        href: "https://www.springboard.com/landing/influencer/thewarthens?utm_source=thewarthens&utm_medium=influencer&utm_campaign=non-ct&utm_term=paid&utm_content=firstyoutubelanpage8242023",
      },
      {
        label: "Cybersecurity Training",
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
    title: "Trades, Business & Supply Chain Careers",
    note: "via CourseCareers, browse all paths and pick what fits",
    links: [
      { label: "I.T. Training", href: "https://www.coursecareers.com/journey" },
      { label: "Business Operations", href: "https://www.coursecareers.com/journey" },
      { label: "Supply Chain", href: "https://www.coursecareers.com/journey" },
      { label: "Accounting", href: "https://coursecareers.com/a/bbe72885?course=accounting" },
      {
        label: "Construction Project Management",
        href: "https://coursecareers.com/a/bbe72885?course=construction-management",
      },
      { label: "Electrician", href: "https://coursecareers.com/a/bbe72885?course=electrical" },
      { label: "HVAC", href: "https://coursecareers.com/a/bbe72885?course=hvac" },
      { label: "Plumbing", href: "https://coursecareers.com/a/bbe72885?course=plumbing" },
    ],
  },
];
