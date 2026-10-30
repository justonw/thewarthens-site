// Content for the Tech Journey Jr. landing page (/techjr), written for the grown-ups who find it:
// parents looking for ways to talk to their kids about tech and creator careers, and teachers or
// organizers planning a career day. The game itself lives at /techjr/play (see career-day.ts).
// Rules: plain words, no pay numbers, no promises about outcomes, and nothing we have not built.

export const TECHJR_PATH = "/techjr";
export const TECHJR_PLAY_PATH = "/techjr/play";
export const TECHJR_UPDATED = "2026-10-29";

export const techJrTitle = "Tech & Creator Careers for Kids | Free Career Day Game";
export const techJrDescription =
  "A free career game for kindergarten through 5th grade, plus a parent guide to tech sales and content creation careers and a simple kit for running your own career day table.";

export const gameParts = [
  {
    emoji: "🤝",
    title: "Be the Helper",
    topic: "Tech sales and customer success",
    body: "A child plays a helper in short, real-feeling moments: a customer has a problem, and the child picks the kindest, most honest way to help. Each round shows why listening and honesty matter.",
  },
  {
    emoji: "🎥",
    title: "Make a Show",
    topic: "Content creation",
    body: "A child builds a cartoon character that looks like them, names their own show, and picks who it is for. It teaches that creators start by helping an audience, and nothing is posted or saved.",
  },
  {
    emoji: "🎁",
    title: "Find Your Gift",
    topic: "Careers and you",
    body: "A few simple questions about how a child likes to help, then a list of grown-up jobs that use that gift. Every job on the list is a way of helping people. None is ranked above another.",
  },
  {
    emoji: "🤯",
    title: "Cool Facts",
    topic: "Tech and creator history",
    body: "Tap-to-reveal facts kids actually repeat at lunch, like the first video ever put on YouTube and the first emoji, plus real tech heroes from many backgrounds, like the mathematician who helped astronauts get home safely.",
  },
] as const;

export const softSkillsForParents = [
  {
    title: "Listening",
    body: "Salespeople, support teams, and creators all start by understanding the person in front of them. Kids practice hearing what someone needs before offering an answer.",
  },
  {
    title: "Honesty",
    body: "Trust is the most useful thing in any job that deals with people. The game rewards the honest answer, even when a shortcut would be easier.",
  },
  {
    title: "Kindness and patience",
    body: "Upset customers and slow-growing channels both need patience. Kids see that staying kind is a skill, not just a mood.",
  },
  {
    title: "Problem solving",
    body: "Tech careers are mostly about solving someone else's problem with the right tool or the right words. Kids practice breaking a problem down and choosing a next step.",
  },
] as const;

export const careerExplainers = [
  {
    title: "What is tech sales?",
    body: "Tech sales is helping a person or a company find the software that fixes a problem they already have. Good salespeople listen, ask questions, explain clearly, and are honest about what a product can and cannot do. Customer success is the follow-up: making sure the people who bought the tool are actually happy with it. Neither job requires being a programmer.",
  },
  {
    title: "What is content creation?",
    body: "A content creator makes videos, writing, audio, or art for an audience, and builds trust by being useful or interesting over time. Behind every channel is real work: planning ideas, filming, editing, talking clearly, and treating it like a small business. Many creators work with a team, and plenty take a long time to find an audience.",
  },
] as const;

export const pathsForParents = [
  "Reading, writing, speaking, and basic math help in nearly every tech and creator job, so schoolwork counts.",
  "Many people enter tech sales and customer success from customer service, retail, or help desk jobs, then add training, a certificate, or a degree. Both the college and the no-college routes are real.",
  "Creator skills such as storytelling, clear speaking, and editing can be practiced now at home or in school, with a parent's help and no posting online.",
  "For the grown-up version of these paths, including honest looks at what the jobs are really like, see our free Tech Journey guides.",
] as const;

export const conversationStarters = [
  "If you could help any kind of person with a problem, who would it be?",
  "What is something you know how to do that you could teach someone else?",
  "If you had your own show, what would it be about and who would it be for?",
  "What do you think a person at a tech company does all day? Let's look it up together.",
  "Think of a time someone helped you well. What did they do that made it feel good?",
  "What is the difference between telling someone the truth and telling them what they want to hear?",
  "What is a skill you want to get better at, and what is one small thing you could practice this week?",
  "Who do you know that has a job we have never talked about? What questions could we ask them?",
] as const;

export const creatorSafety = [
  "Ask a parent before sharing anything online. Always.",
  "Practice the skills first: telling a story, teaching a friend, speaking clearly, drawing, writing.",
  "Keep personal details private, like full name, school, and address.",
  "Talk openly about the fact that most creators take a long time to grow, and that views are not the same as worth.",
] as const;

export const hostingNeeds = [
  "One tablet, laptop, or touchscreen with a modern web browser and an internet connection.",
  "The speaker turned up. After a child's first tap, the game reads every screen aloud with a recorded voice, so children can go through it on their own. The speaker button at the top turns the voice off.",
  "A volunteer or two who can say hello, point at the screen, and ask a follow-up question.",
  "Optional: stickers or a small prize to match the game's badge at the end.",
] as const;

export const hostingSteps = [
  {
    title: "Open the game",
    body: "Go to thewarthens.com/techjr/play and put the browser in full screen. On an iPad or iPhone, Guided Access keeps kids from leaving the page.",
  },
  {
    title: "Let kids tap through",
    body: "Each child picks a mission, earns a star, and can earn all three for a badge. Missions are short, so a line can keep moving.",
  },
  {
    title: "Ask one question",
    body: "After a mission, ask the child one thing from the conversation starters, like what kind of show they would make. The short chat is where kids remember the careers.",
  },
  {
    title: "It resets itself",
    body: "If nobody touches the screen for a couple of minutes, the game returns to the start so the next child begins fresh. Nothing about the last child is kept.",
  },
] as const;

export const volunteerTips = [
  "Keep your own 30-second story ready: what you do, who it helps, and one thing you did not expect about the job.",
  "Be honest about the hard parts. Kids and parents trust a real answer more than a polished one.",
  "Say that every job in the game helps people, and that there is no best job.",
  "Never ask a child to share personal details or post anything online. The game is built so you do not need to.",
] as const;

export const privacyPoints = [
  "No sign-in, no accounts, and no forms.",
  "Nothing a child picks or types, including their character and show name, is saved or sent anywhere.",
  "No ads and no outside links on the child's screen.",
] as const;

export type TechJrFaq = { question: string; answer: string };

export const techJrFaq: TechJrFaq[] = [
  {
    question: "What ages is Tech Journey Jr. for?",
    answer:
      "It is written for kindergarten through 5th grade, at about a second grade reading level. Every screen can be read aloud, so younger children can play with a grown-up and older children can play on their own.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. The game, the facts, and the guides on this page are free to use at home, in a classroom, or at a career day table. There is nothing to buy and no account to make.",
  },
  {
    question: "Does it collect my child's information?",
    answer:
      "No. There are no sign-ins, forms, or ads, and nothing a child chooses or types is saved or sent. The character and show name a child makes disappear when the game resets.",
  },
  {
    question: "How do I teach my child about careers in tech?",
    answer:
      "Start with what the jobs actually do in plain words, then connect them to what your child already enjoys: helping people, explaining things, telling stories, building. The conversation starters on this page are a gentle way to begin, and the game gives you something concrete to talk about afterward.",
  },
  {
    question: "What is tech sales, in kid-friendly words?",
    answer:
      "It is helping people find the right tool for a problem they have, and then making sure the tool works for them. The best tech salespeople are good listeners who tell the truth.",
  },
  {
    question: "How can a child start learning about being a content creator?",
    answer:
      "Practice the skills away from the internet first: telling a story, teaching a friend, speaking clearly, drawing, writing, and learning to take feedback. When a child is older and a parent says yes, they can learn how to start small and stay safe. Always ask a parent before sharing anything online.",
  },
  {
    question: "Can I use this at my school's career day?",
    answer:
      "Yes. It was built for exactly that. Open the game on a tablet or laptop at your table, follow the short setup on this page, and bring a volunteer or two to talk with kids. It works on phones, tablets, and computers.",
  },
  {
    question: "Who made Tech Journey Jr.?",
    answer:
      "Juston and Atiya Warthen, who run The Warthens and Tech Journey, built it for a school career fair and kept it online so families and other organizers can use it too.",
  },
];
