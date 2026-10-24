// Content for the /career-day kiosk, built for a K-5 school career fair.
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
  },
  {
    id: "creator",
    emoji: "🎥",
    title: "Make a Show",
    blurb: "Share what you are great at",
    tag: "Content Creation",
  },
  {
    id: "gift",
    emoji: "🎁",
    title: "Find Your Gift",
    blurb: "Discover how you like to help",
    tag: "Careers & You",
  },
] as const;

export type MissionId = (typeof missions)[number]["id"];

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

export const skinTones = ["🏻", "🏼", "🏽", "🏾", "🏿"] as const;
export const defaultSkinTone = "🏾";

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

export const giftVerse = {
  text: "Each of you should use whatever gift you have received to serve others.",
  ref: "1 Peter 4:10",
};

export const giftWrapUp =
  "Every gift is needed. You get to choose your road, and every road starts with learning to read, write, and do math.";
