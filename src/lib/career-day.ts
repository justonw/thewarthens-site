// Content for the /techjr/play kiosk, built for a K-5 school career fair.
// Rules for anything added here:
//  - Keep the reading level around 2nd grade. Short sentences.
//  - No em dashes.
//  - No outbound links and nothing that collects or stores a child's information.
//  - No pay numbers and no ranking of jobs anywhere on a kid's screen. Every job helps people.
//  - Never mention a real person's job (teachers, parents) in a comparison.

export type SoftSkillId = "listening" | "honesty" | "kindness" | "problem-solving";

export const softSkills: Record<SoftSkillId, { emoji: string; label: string }> = {
  listening: { emoji: "👂", label: "Listening" },
  honesty: { emoji: "🤝", label: "Honesty" },
  kindness: { emoji: "💛", label: "Kindness" },
  "problem-solving": { emoji: "🧩", label: "Problem Solving" },
};

export const missions = [
  {
    id: "helper",
    emoji: "🤝",
    title: "Be the Helper",
    blurb: "Help customers solve problems",
    tag: "Tech Sales & Customer Success",
    about:
      "In tech sales and customer success, you listen to people and find the right tool to fix their problem. Then you make sure it keeps working for them.",
  },
  {
    id: "creator",
    emoji: "🎥",
    title: "Make a Show",
    blurb: "Share what you are great at",
    tag: "Content Creation",
    about:
      "Content creators make videos and shows that teach people and share what they love. They plan their ideas, film them, and keep getting better.",
  },
  {
    id: "gift",
    emoji: "🎁",
    title: "Find Your Gift",
    blurb: "Discover how you like to help",
    tag: "Careers & You",
    about:
      "Everyone is good at something. Answer a few questions to find how you like to help, and see grown-up jobs that use your gift.",
  },
] as const;

export type MissionId = (typeof missions)[number]["id"];

export const homeIntro = "Be a tech pro for a day! Pick a mission, earn stars, and get a sticker.";

export const badgeVerse = {
  text: "Whatever you do, work at it with all your heart.",
  ref: "Colossians 3:23",
};

/* ------------------------------------------------------------------ */
/* Mission 1: Be the Helper                                            */
/* ------------------------------------------------------------------ */

export type HelperOption = {
  emoji: string;
  text: string;
  correct?: boolean;
  feedback: string;
};

export type HelperRound = {
  sceneEmoji: string;
  who: string;
  says: string;
  question: string;
  options: HelperOption[];
  earns: SoftSkillId[];
  lesson: string;
};

export const helperIntro =
  "In tech sales, you help people find tools that fix their problems. In customer success, you make sure people are happy after they buy. Let's practice!";

export const helperRoundSpoken = (round: HelperRound) =>
  `${round.who} ${round.says} ${round.question} ${round.options
    .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}`)
    .join(" ")}`;

export const helperRounds: HelperRound[] = [
  {
    sceneEmoji: "🧁",
    who: "Miss Tasha owns a bakery.",
    says: "My orders are a MESS!",
    question: "What should you do FIRST?",
    options: [
      {
        emoji: "📱",
        text: "Show her my coolest app right away!",
        feedback: "Hold on! If you talk first, you might fix the wrong thing. Try again!",
      },
      {
        emoji: "👂",
        text: "Ask her, \"What part is messy?\"",
        correct: true,
        feedback: "Yes! Great helpers ask questions and listen first.",
      },
      {
        emoji: "🥱",
        text: "Tell her I am too busy.",
        feedback: "Oops. People can tell when you do not care. Try again!",
      },
    ],
    earns: ["listening"],
    lesson:
      "You cannot fix a problem until you understand it. Real tech sellers ask lots of questions first.",
  },
  {
    sceneEmoji: "🧢",
    who: "Mr. James is thinking about buying your tool.",
    says: "Can it do EVERYTHING?",
    question: "Your tool does a lot, but not everything. What do you say?",
    options: [
      {
        emoji: "🎉",
        text: "Yes! It does everything!",
        feedback: "If that is not true, he will stop trusting you. Try again!",
      },
      {
        emoji: "🙈",
        text: "Let's talk about something else.",
        feedback: "Dodging the question hurts trust. Try again!",
      },
      {
        emoji: "🤝",
        text: "It does a lot! I will tell you what it cannot do.",
        correct: true,
        feedback: "Yes! Honesty builds trust. People buy from people they trust.",
      },
    ],
    earns: ["honesty"],
    lesson: "Trust is a seller's best tool. Honest people keep their customers for life.",
  },
  {
    sceneEmoji: "💻",
    who: "Ms. Renee's app stopped working. She is upset.",
    says: "This is NOT okay!",
    question: "What do you do?",
    options: [
      {
        emoji: "💛",
        text: "Listen, say sorry, and help fix it.",
        correct: true,
        feedback: "Yes! That is customer success. You help people win even after they buy.",
      },
      {
        emoji: "😤",
        text: "Say, \"It's not my fault!\"",
        feedback: "That makes people feel worse. Try again!",
      },
      {
        emoji: "🙈",
        text: "Hope she forgets about it.",
        feedback: "Problems do not go away on their own. Try again!",
      },
    ],
    earns: ["kindness", "problem-solving"],
    lesson: "Customer success means staying with people until their problem is solved.",
  },
];

/* ------------------------------------------------------------------ */
/* Career cards (used at the end of Mission 1 and Mission 2)           */
/* ------------------------------------------------------------------ */

export type CareerCardData = {
  emoji: string;
  title: string;
  tagline: string;
  soft: string[];
  hard: string[];
  school: string;
  ways: string[];
  honest?: string;
};

export const techSalesCard: CareerCardData = {
  emoji: "💻",
  title: "Tech Sales & Customer Success",
  tagline: "Helping people find the right tools, and making sure the tools work for them.",
  soft: [
    "Listening and asking good questions",
    "Being honest",
    "Staying calm when someone is upset",
    "Kindness and patience",
  ],
  hard: [
    "Learning how software works",
    "Writing clear emails",
    "Showing a tool to a customer (a demo)",
    "Using a customer database (a CRM)",
    "Tracking goals with numbers",
  ],
  school:
    "Many people start with a high school diploma plus training. Others go to college. Both can work. Reading, writing, and math help in every job.",
  ways: [
    "Start in customer service or retail",
    "Online training programs",
    "Community college or a 4-year degree",
    "Help desk or support jobs",
    "Internships",
  ],
};

export const creatorCard: CareerCardData = {
  emoji: "🎥",
  title: "Content Creator",
  tagline: "Grown-ups who share what they know to help people, and build a name people trust.",
  soft: [
    "Telling a story people care about",
    "Being brave in front of people",
    "Being kind and honest",
    "Patience, because it takes time to grow",
  ],
  hard: [
    "Filming and editing videos",
    "Writing and planning ideas",
    "Talking clearly",
    "Learning how to run a small business",
  ],
  school:
    "No school is required to become a creator. Reading, writing, and speaking well help a lot, and you can learn the rest.",
  ways: [
    "Practice telling stories and teaching people now, at home and at school",
    "Learn from grown-up creators, with a parent",
    "Many creators work with a team",
    "When you are older, and your parents say yes, start small and stay safe",
  ],
  honest:
    "Some creators do not get many viewers at first. It takes time, practice, and patience. Kids should always ask a parent before sharing anything online.",
};

/* ------------------------------------------------------------------ */
/* Mission 2: Make a Show (family and class, never posted online)      */
/* ------------------------------------------------------------------ */

export const creatorIntro =
  "A creator shares what they know to help people. Real creators are grown-ups with a team. Kids stay safe by making shows for family and class. Let's plan YOUR show!";

export const creatorSafety =
  "Kids make shows for family and class. Ask a grown-up first, and never share your name, school, or address online. When you are older, with your parents' OK, you can share your gift with more people.";

export const powerPrompt = "What are you really good at? Tap one.";
export const whoPrompt = "Who is your show for? Tap all that fit, or tap Select all. Then tap Next.";
export const lookPrompt =
  "Make a character that looks like you. Pick a boy or a girl. Then pick your skin, your hair, and your hair color.";
export const namePrompt = "Type your first name if you want. Then pick a name for your show.";

export type Superpower = {
  id: string;
  emoji: string;
  label: string;
  topic: string;
  showNames: string[];
  episodeIdeas: string[];
};

export const superpowers: Superpower[] = [
  {
    id: "drawing",
    emoji: "🎨",
    label: "Drawing",
    topic: "drawing",
    showNames: ["Doodle Zone", "Sketch Squad", "Color Kingdom"],
    episodeIdeas: [
      "How to Draw a Dinosaur in 5 Steps",
      "3 Colors That Make Everything Pop",
      "Draw With Me: Our Family Pet!",
    ],
  },
  {
    id: "sports",
    emoji: "⚽",
    label: "Sports",
    topic: "sports",
    showNames: ["Game Day Heroes", "Train Like a Champ", "Team Spirit"],
    episodeIdeas: [
      "3 Drills to Get Faster",
      "How to Be a Great Teammate",
      "Backyard Challenge: Can You Beat Me?",
    ],
  },
  {
    id: "math",
    emoji: "🔢",
    label: "Math",
    topic: "math",
    showNames: ["Number Ninjas", "Math Magic", "Count It Up"],
    episodeIdeas: [
      "Multiplication Tricks That Really Work",
      "Math Games You Can Play at Dinner",
      "How I Solve Word Problems",
    ],
  },
  {
    id: "baking",
    emoji: "🧁",
    label: "Cooking & Baking",
    topic: "cooking and baking",
    showNames: ["Little Chef Corner", "Sweet Treats Club", "Kitchen Kids"],
    episodeIdeas: [
      "The Easiest Cookies Ever",
      "A Breakfast You Can Make by Yourself",
      "Taste Test Time!",
    ],
  },
  {
    id: "games",
    emoji: "🎮",
    label: "Games",
    topic: "games",
    showNames: ["Level Up Crew", "Game Guide Jr.", "Puzzle Pals"],
    episodeIdeas: [
      "Top 3 Tips to Win",
      "Board Games for the Whole Family",
      "How I Beat the Hardest Level",
    ],
  },
  {
    id: "stories",
    emoji: "📖",
    label: "Stories",
    topic: "stories",
    showNames: ["Story Time Stars", "Once Upon a Kid", "The Book Nook"],
    episodeIdeas: [
      "My Favorite Book and Why",
      "Make Up a Story With Me",
      "A Story About My Day",
    ],
  },
  {
    id: "music",
    emoji: "🎵",
    label: "Music",
    topic: "music",
    showNames: ["Beat Builders", "Little Melody", "Sound Squad"],
    episodeIdeas: [
      "Make a Beat With Things in Your House",
      "How I Learned My First Song",
      "Sing Along With Me!",
    ],
  },
  {
    id: "animals",
    emoji: "🐶",
    label: "Animals",
    topic: "animals",
    showNames: ["Pet Pals", "Animal Academy", "Wild Facts Club"],
    episodeIdeas: [
      "Why Dogs Wag Their Tails",
      "How to Take Care of a Pet",
      "5 Amazing Animal Facts",
    ],
  },
  {
    id: "science",
    emoji: "🔬",
    label: "Science",
    topic: "science",
    showNames: ["Little Lab", "Why Wow Science", "Experiment Club"],
    episodeIdeas: [
      "Volcano in a Cup",
      "Why Is the Sky Blue?",
      "Easy Experiments You Can Do Today",
    ],
  },
];

export type Audience = { id: string; emoji: string; label: string; phrase: string };

export const audiences: Audience[] = [
  { id: "family", emoji: "👨🏾‍👩🏾‍👧🏾", label: "My family", phrase: "my family" },
  { id: "class", emoji: "🏫", label: "My class", phrase: "my class" },
  { id: "grandparents", emoji: "👵🏾", label: "My grandparents", phrase: "my grandparents" },
  { id: "friends", emoji: "🧒🏾", label: "My friends", phrase: "my friends" },
];

// "my family", "my family and my class", "my family, my class, and my friends".
// Picking everyone reads as "everyone I know".
export function audienceLine(ids: string[]) {
  const picked = audiences.filter((a) => ids.includes(a.id));
  if (picked.length === audiences.length) return "everyone I know";
  const phrases = picked.map((a) => a.phrase);
  if (phrases.length <= 1) return phrases[0] ?? "my family";
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

/* ------------------------------------------------------------------ */
/* Mission 3: Find Your Gift                                           */
/* No money, no ranking jobs against each other, no mention of any     */
/* real person's job. Every gift helps people.                         */
/* ------------------------------------------------------------------ */

export const giftIntro =
  "Everyone is good at something. Let's find out how YOU like to help people!";

export type GiftId = "problem-solver" | "caregiver" | "storyteller" | "builder" | "connector";

export type GiftOption = { emoji: string; text: string; gift: GiftId };
export type GiftQuestion = { question: string; options: GiftOption[] };

export const giftQuestions: GiftQuestion[] = [
  {
    question: "It's a free day! What sounds the most fun?",
    options: [
      { emoji: "🧩", text: "Solve a puzzle or fix a broken toy", gift: "problem-solver" },
      { emoji: "🐶", text: "Take care of a pet or a friend", gift: "caregiver" },
      { emoji: "🎤", text: "Put on a show or tell a story", gift: "storyteller" },
      { emoji: "🧱", text: "Build or draw something brand new", gift: "builder" },
      { emoji: "🎉", text: "Plan a fun day for the whole group", gift: "connector" },
    ],
  },
  {
    question: "A friend is stuck on something. What do you do?",
    options: [
      { emoji: "🔧", text: "Figure out what is going wrong", gift: "problem-solver" },
      { emoji: "🤗", text: "Make sure they feel okay", gift: "caregiver" },
      { emoji: "📣", text: "Tell them something that cheers them up", gift: "storyteller" },
      { emoji: "✏️", text: "Help them make something to fix it", gift: "builder" },
      { emoji: "🙌", text: "Get everyone to help together", gift: "connector" },
    ],
  },
  {
    question: "Which would make you the proudest?",
    options: [
      { emoji: "🏆", text: "\"I fixed it!\"", gift: "problem-solver" },
      { emoji: "💛", text: "\"I helped someone feel better.\"", gift: "caregiver" },
      { emoji: "🌟", text: "\"Everyone loved my story.\"", gift: "storyteller" },
      { emoji: "🏗️", text: "\"I made it myself!\"", gift: "builder" },
      { emoji: "🤝", text: "\"I brought people together.\"", gift: "connector" },
    ],
  },
  {
    question: "Pick a superpower!",
    options: [
      { emoji: "🔍", text: "See how anything works", gift: "problem-solver" },
      { emoji: "❤️", text: "Healing hands", gift: "caregiver" },
      { emoji: "🗣️", text: "A voice everyone listens to", gift: "storyteller" },
      { emoji: "🛠️", text: "Make anything I imagine", gift: "builder" },
      { emoji: "🌍", text: "Be friends with everyone", gift: "connector" },
    ],
  },
];

export type GiftCareer = {
  emoji: string;
  name: string;
  does: string;
  /** Marks the jobs Mr. and Mrs. Warthen do. */
  ours?: boolean;
};

export type GiftResult = {
  id: GiftId;
  emoji: string;
  title: string;
  blurb: string;
  careers: GiftCareer[];
  tryToday: string;
};

export const giftResults: Record<GiftId, GiftResult> = {
  "problem-solver": {
    id: "problem-solver",
    emoji: "🧩",
    title: "Problem Solver",
    blurb: "You love figuring out how things work and fixing what is broken.",
    careers: [
      { emoji: "💻", name: "Software Engineer", does: "Builds apps and websites" },
      { emoji: "🛡️", name: "Cybersecurity Pro", does: "Keeps computers safe from bad guys" },
      { emoji: "🎧", name: "Customer Success", does: "Helps people when their tech stops working", ours: true },
      { emoji: "⚡", name: "Electrician", does: "Keeps the lights on" },
    ],
    tryToday: "Figure out how one thing works at home, with a grown-up.",
  },
  caregiver: {
    id: "caregiver",
    emoji: "💛",
    title: "Caregiver",
    blurb: "You love taking care of people and animals.",
    careers: [
      { emoji: "💉", name: "Nurse", does: "Takes care of people when they are sick or hurt" },
      { emoji: "🩺", name: "Doctor", does: "Helps people get well and stay healthy" },
      { emoji: "🐾", name: "Veterinarian", does: "Takes care of animals" },
      { emoji: "🧑🏾‍🍳", name: "Chef", does: "Makes good food that feeds people" },
    ],
    tryToday: "Do one kind thing for someone without being asked.",
  },
  storyteller: {
    id: "storyteller",
    emoji: "🎤",
    title: "Storyteller",
    blurb: "You love sharing ideas and making people feel something.",
    careers: [
      { emoji: "🎥", name: "Content Creator", does: "Shares what they know to help lots of people", ours: true },
      { emoji: "⚖️", name: "Lawyer", does: "Speaks up for what is fair" },
      { emoji: "📰", name: "Reporter", does: "Tells people what is happening" },
      { emoji: "✍️", name: "Author", does: "Writes books and stories" },
    ],
    tryToday: "Tell a story to someone at home.",
  },
  builder: {
    id: "builder",
    emoji: "🏗️",
    title: "Builder",
    blurb: "You love making brand new things.",
    careers: [
      { emoji: "🚀", name: "Engineer", does: "Designs bridges, machines, and rockets" },
      { emoji: "🏛️", name: "Architect", does: "Designs buildings" },
      { emoji: "🎮", name: "Game Designer", does: "Makes the games you love" },
      { emoji: "🎨", name: "Artist", does: "Makes things people love to look at" },
    ],
    tryToday: "Build or draw something new and show it to someone.",
  },
  connector: {
    id: "connector",
    emoji: "🤝",
    title: "Connector",
    blurb: "You love bringing people together and helping them find what they need.",
    careers: [
      { emoji: "💻", name: "Tech Sales", does: "Helps people and companies find the right tools", ours: true },
      { emoji: "🎧", name: "Customer Success", does: "Makes sure people are happy after they buy", ours: true },
      { emoji: "🏪", name: "Business Owner", does: "Starts a company to serve people" },
      { emoji: "🙋🏾", name: "Community Leader", does: "Brings people together to help the neighborhood" },
    ],
    tryToday: "Invite someone who is alone to join your game.",
  },
};

export const giftQuestionSpoken = (q: GiftQuestion) =>
  `${q.question} ${q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}`).join(". ")}`;

export const giftResultSpoken = (result: GiftResult) => {
  const names = result.careers.map((c) => c.name);
  const list = `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
  return `You have the gift of being a ${result.title}! ${result.blurb} Grown-ups with your gift can do jobs like ${list}. Try this today: ${result.tryToday}`;
};

export const giftVerse = {
  text: "Each of you should use whatever gift you have received to serve others.",
  ref: "1 Peter 4:10",
};

export const giftWrapUp =
  "Every gift is needed. You get to choose your road, and every road starts with learning to read, write, and do math.";

/* ------------------------------------------------------------------ */
/* Cool Facts. Every fact here was checked against more than one       */
/* source. Keep claims plain and avoid "the first ever" unless the     */
/* record is clear.                                                    */
/* ------------------------------------------------------------------ */

export type CoolFact = { id: string; emoji: string; hook: string; answer: string };
export type FactGroup = { id: string; emoji: string; title: string; blurb: string; facts: CoolFact[] };

export const factsIntro =
  "Here are some wild true facts about the people and ideas behind tech. Tap a card to see the answer!";

export const factGroups: FactGroup[] = [
  {
    id: "helpers",
    emoji: "🤝",
    title: "Tech Helpers",
    blurb: "Tech sales and customer success",
    facts: [
      {
        id: "laser",
        emoji: "🔦",
        hook: "What was one of the very first things sold on eBay?",
        answer:
          "A broken laser pointer! It sold to a person who collects broken laser pointers. There is a right customer for almost anything, and good helpers find them by listening.",
      },
      {
        id: "bug",
        emoji: "🐛",
        hook: "Was there ever a REAL bug inside a computer?",
        answer:
          "Yes! In 1947, a team found a moth stuck inside a big computer at Harvard. They taped it in their notebook and wrote, “First actual case of bug being found.” Today, finding and fixing tech problems is still called debugging.",
      },
      {
        id: "vending",
        emoji: "🪙",
        hook: "What is one of the oldest coin machines?",
        answer:
          "About 2,000 years ago, an inventor named Hero built a machine in Egypt. You dropped in a coin and out came water. Many people call it the first vending machine.",
      },
    ],
  },
  {
    id: "creators",
    emoji: "🎥",
    title: "Creators",
    blurb: "Content creation",
    facts: [
      {
        id: "youtube",
        emoji: "🐘",
        hook: "What was the very first YouTube video about?",
        answer:
          "Elephants! It was only about 19 seconds long and was filmed at a zoo in 2005. Every big creator started with a first video.",
      },
      {
        id: "lightsaber",
        emoji: "⚔️",
        hook: "How was the lightsaber sound made?",
        answer:
          "A sound artist named Ben Burtt mixed the hum of an old movie projector with the buzz of a TV. Creators can make something brand new out of everyday things.",
      },
      {
        id: "babyshark",
        emoji: "🦈",
        hook: "Which video was the first to reach 10 billion views?",
        answer:
          "Baby Shark Dance! A kids' music company made it. In 2022 it became the first YouTube video to pass 10 billion views. A simple idea can reach the whole world.",
      },
      {
        id: "emoji",
        emoji: "😀",
        hook: "Who drew some of the very first emoji?",
        answer:
          "A designer in Japan named Shigetaka Kurita, in 1999. That first set had 176 tiny pictures. Each one was drawn on a grid of 12 by 12 little squares.",
      },
    ],
  },
  {
    id: "heroes",
    emoji: "🌟",
    title: "Tech Heroes",
    blurb: "People who built things you use",
    facts: [
      {
        id: "lawson",
        emoji: "🎮",
        hook: "Who helped make it possible to swap video games?",
        answer:
          "Jerry Lawson, a Black engineer. In 1976 he led the team that built a home game system with game cartridges. Before that, a game system only played the games built inside it.",
      },
      {
        id: "dean",
        emoji: "💻",
        hook: "Who helped invent the home computer?",
        answer:
          "Dr. Mark Dean, a Black engineer at IBM. He helped invent the IBM PC, a computer many families used at home. He is named on 3 of its first 9 patents.",
      },
    ],
  },
];

// Everything the "Read it to me" buttons can say, so recorded clips can be made for all of it.
export const allSpokenLines: string[] = [
  homeIntro,
  ...missions.map((m) => m.about),
  helperIntro,
  ...helperRounds.map(helperRoundSpoken),
  creatorIntro,
  powerPrompt,
  whoPrompt,
  lookPrompt,
  namePrompt,
  giftIntro,
  ...giftQuestions.map(giftQuestionSpoken),
  ...Object.values(giftResults).map(giftResultSpoken),
  factsIntro,
  ...factGroups.flatMap((g) => g.facts.map((f) => `${f.hook} ${f.answer}`)),
];
