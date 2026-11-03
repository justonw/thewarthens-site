// Content for Tech Sprouts, the ages 5 to 7 (kindergarten to 2nd grade) side of Tech Journey Jr.
// The ages 8 to 10 side uses career-day.ts and cyber-defenders.ts. Make a Show and Cool Facts are
// shared by both groups.
// Rules for anything added here:
//  - First grade words. Most sentences are 8 words or fewer. Every screen is read aloud.
//  - A picture on every choice. Story questions have three choices; the gift quiz shows five. No
//    typing is needed to move on.
//  - Every question puts the child in the seat of the person deciding, with something a child
//    really sees: a tablet, a pop-up, game chat, a friend, a school computer.
//  - No em dashes, no outbound links, nothing that collects or stores a child's information.
//  - No pay numbers and no ranking of jobs. Use made-up names. Never name a real brand or person.
//  - Adult-only actions (changing router passwords, backups) go in the grown-up panel, not in
//    the questions.

import {
  cardSpoken,
  giftQuestionSpoken,
  helperCardLead,
  helperRoundSpoken,
  superpowers,
  type CareerCardData,
  type FactGroup,
  type GiftId,
  type GiftQuestion,
  type GiftResult,
  type HelperOption,
  type HelperRound,
  type Superpower,
} from "./career-day";
import { cyberContentSpoken, type CyberContent } from "./cyber-defenders";

export const littleBandIntro = "Pick a world and start playing! Earn stars and grow into a Tech Pro.";

export const pickerPrompt = "Welcome to Tech Journey Jr.! How old are you? Tap your group.";

export const littleAbout = {
  helper: "Be a helper! Listen to people and find the best way to help.",
  creator: "Make your own show! Build a cartoon of you and name your show.",
  gift: "Everyone is good at something. Answer three questions to find your gift.",
  cyber: "Spot tricks and keep secrets. Know when to tell a grown-up. Solve three cases!",
} as const;

/* ------------------------------------------------------------------ */
/* Be the Helper                                                       */
/* ------------------------------------------------------------------ */

export const littleHelper = {
  intro: "A helper listens to people. Then a helper finds a way to help. Let's practice!",
  rounds: [
    {
      sceneEmoji: "👩🏾‍🍳🧁",
      who: "Miss Tasha has a bakery.",
      says: "My orders are all mixed up!",
      question: "What do you do first?",
      options: [
        { emoji: "📱", text: "Show her my cool app", feedback: "Wait! Listen first. Try again!" },
        {
          emoji: "👂",
          text: "Ask her what is wrong",
          correct: true,
          feedback: "Yes! Good helpers ask first.",
        },
        { emoji: "🚶", text: "Walk away", feedback: "That is not kind. Try again!" },
      ],
      earns: ["listening"],
      lesson: "A good helper listens first.",
    },
    {
      sceneEmoji: "👨🏿‍💼🧢",
      who: "Mr. James wants to buy your app.",
      says: "Does it do EVERYTHING?",
      question: "It does not do everything. What do you say?",
      options: [
        { emoji: "🎉", text: "Yes! It does everything!", feedback: "That is not true. Try again!" },
        {
          emoji: "🤝",
          text: "It does a lot. It cannot do everything.",
          correct: true,
          feedback: "Yes! The truth helps people trust you.",
        },
        { emoji: "🙈", text: "Let's talk about something else", feedback: "Do not hide the truth. Try again!" },
      ],
      earns: ["honesty"],
      lesson: "Tell the truth. Then people trust you.",
    },
    {
      sceneEmoji: "👩🏽‍💻",
      who: "Ms. Renee's app broke. She is sad.",
      says: "My app is not working!",
      question: "How can you help?",
      options: [
        { emoji: "😤", text: "Say, \"It is not my fault!\"", feedback: "That makes her feel worse. Try again!" },
        {
          emoji: "💛",
          text: "Say sorry. Then help fix it.",
          correct: true,
          feedback: "Yes! A helper stays and helps.",
        },
        { emoji: "🙈", text: "Hope she forgets", feedback: "Problems do not go away. Try again!" },
      ],
      earns: ["kindness", "problem-solving"],
      lesson: "Helpers stay until the problem is fixed.",
    },
  ] satisfies HelperRound[],
  card: {
    emoji: "💻",
    title: "Helper at a Tech Company",
    tagline: "Grown-ups who help people pick the right apps.",
    soft: ["Listening", "Telling the truth", "Staying calm", "Being kind"],
    hard: ["Learning how apps work", "Writing clear emails", "Showing people how an app works"],
    school: "Grown-ups learn this job in many ways. Reading, writing, and math help in every job.",
    ways: ["Start by helping people at a store", "Learn at school or online", "Ask a grown-up how they help people"],
  } satisfies CareerCardData,
};

// What the voice says after a choice. A right answer also hears the lesson.
export const littleHelperFeedbackSpoken = (round: HelperRound, option: HelperOption) =>
  option.correct ? `${option.feedback} ${round.lesson}` : option.feedback;

/* ------------------------------------------------------------------ */
/* Find Your Gift (the same five gifts and results as ages 8 to 10)    */
/* ------------------------------------------------------------------ */

export const littleGift = {
  intro: "Everyone is good at something. Let's find your gift!",
  questions: [
    {
      question: "What do you like to do most?",
      options: [
        { emoji: "🧩", text: "Do a puzzle", gift: "problem-solver" },
        { emoji: "🐶", text: "Care for a pet", gift: "caregiver" },
        { emoji: "🎤", text: "Tell a story", gift: "storyteller" },
        { emoji: "🧱", text: "Build with blocks", gift: "builder" },
        { emoji: "🎉", text: "Plan a party", gift: "connector" },
      ],
    },
    {
      question: "A friend feels stuck. What do you do?",
      options: [
        { emoji: "🔧", text: "Find out what is wrong", gift: "problem-solver" },
        { emoji: "🤗", text: "Ask if they are okay", gift: "caregiver" },
        { emoji: "📣", text: "Tell a funny story", gift: "storyteller" },
        { emoji: "✏️", text: "Help make something", gift: "builder" },
        { emoji: "🙌", text: "Get friends to help", gift: "connector" },
      ],
    },
    {
      question: "Pick a superpower!",
      options: [
        { emoji: "🔍", text: "See how things work", gift: "problem-solver" },
        { emoji: "❤️", text: "Make people feel better", gift: "caregiver" },
        { emoji: "🗣️", text: "A voice everyone hears", gift: "storyteller" },
        { emoji: "🛠️", text: "Make anything I think of", gift: "builder" },
        { emoji: "🌍", text: "Friends everywhere", gift: "connector" },
      ],
    },
  ] satisfies GiftQuestion[],
};

/* Simpler results for the same five gifts. The "try today" lines are shared. */
export const littleGiftResults: Record<GiftId, GiftResult> = {
  "problem-solver": {
    id: "problem-solver",
    emoji: "🧩",
    title: "Problem Solver",
    blurb: "You love to solve problems and fix things.",
    careers: [
      { emoji: "💻", name: "Software Engineer", does: "Makes apps and websites" },
      { emoji: "🛡️", name: "Cybersecurity Pro", does: "Keeps computers safe" },
      { emoji: "🎧", name: "Customer Success", does: "Helps when tech stops working", ours: true },
      { emoji: "⚡", name: "Electrician", does: "Keeps the lights on" },
    ],
    tryToday: "Find out how one thing works. Ask a grown-up to help.",
  },
  caregiver: {
    id: "caregiver",
    emoji: "💛",
    title: "Caregiver",
    blurb: "You love taking care of people and animals.",
    careers: [
      { emoji: "💉", name: "Nurse", does: "Helps people who are sick or hurt" },
      { emoji: "🩺", name: "Doctor", does: "Helps people get well" },
      { emoji: "🐾", name: "Veterinarian", does: "Takes care of animals" },
      { emoji: "🧑🏾‍🍳", name: "Chef", does: "Makes food that feeds people" },
    ],
    tryToday: "Do one kind thing without being asked.",
  },
  storyteller: {
    id: "storyteller",
    emoji: "🎤",
    title: "Storyteller",
    blurb: "You love to share stories and ideas.",
    careers: [
      { emoji: "🎥", name: "Content Creator", does: "Makes shows to help lots of people", ours: true },
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
    blurb: "You love to make new things.",
    careers: [
      { emoji: "🚀", name: "Engineer", does: "Designs bridges and rockets" },
      { emoji: "🏛️", name: "Architect", does: "Designs buildings" },
      { emoji: "🎮", name: "Game Designer", does: "Makes the games you love" },
      { emoji: "🎨", name: "Artist", does: "Makes things people love to see" },
    ],
    tryToday: "Build or draw something new. Show someone!",
  },
  connector: {
    id: "connector",
    emoji: "🤝",
    title: "Connector",
    blurb: "You love bringing people together.",
    careers: [
      { emoji: "💻", name: "Tech Sales", does: "Helps people find the right tools", ours: true },
      { emoji: "🎧", name: "Customer Success", does: "Helps people be happy with their tools", ours: true },
      { emoji: "🏪", name: "Business Owner", does: "Starts a business to help people" },
      { emoji: "🙋🏾", name: "Community Leader", does: "Helps the neighborhood work together" },
    ],
    tryToday: "Invite someone who is alone to play.",
  },
};

// The voice for a gift result. Shorter than the ages 8 to 10 version, with the jobs as a plain list.
export const littleGiftResultSpoken = (result: GiftResult) => {
  const names = result.careers.map((c) => c.name);
  const list = `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
  return `You have the gift of being a ${result.title}! ${result.blurb} Jobs for you: ${list}. Try this today: ${result.tryToday}`;
};

export const littleGiftWrapUp =
  "Every gift is needed! You get to pick your road. Reading, writing, and math help on every road.";

/* ------------------------------------------------------------------ */
/* Cool Facts: the same true facts as ages 8 to 10, in simpler words    */
/* ------------------------------------------------------------------ */

export const littleFactsIntro = "Here are some wild true facts about tech. Tap a card to see the answer!";

export const littleFactGroups: FactGroup[] = [
  {
    id: "helpers",
    emoji: "🤝",
    title: "Tech Helpers",
    blurb: "People who help",
    facts: [
      {
        id: "laser",
        emoji: "🔦",
        hook: "What was one of the first things sold on eBay?",
        answer:
          "A broken laser pointer! A person who collects them bought it. There is a buyer for almost anything. Helpers find the right person by listening.",
      },
      {
        id: "bug",
        emoji: "🐛",
        hook: "Was there ever a REAL bug inside a computer?",
        answer:
          "Yes! In 1947, a moth got stuck inside a big computer. The team taped it in their notebook. Fixing computer problems is still called debugging.",
      },
      {
        id: "vending",
        emoji: "🪙",
        hook: "What is one of the oldest coin machines?",
        answer:
          "A man named Hero made one in Egypt. It was 2,000 years ago. You dropped in a coin. Water came out!",
      },
    ],
  },
  {
    id: "creators",
    emoji: "🎥",
    title: "Creators",
    blurb: "People who make videos and shows",
    facts: [
      {
        id: "youtube",
        emoji: "🐘",
        hook: "What was the first YouTube video about?",
        answer: "Elephants! It was only 19 seconds long. It was filmed at a zoo. Every big creator starts with a first video.",
      },
      {
        id: "lightsaber",
        emoji: "⚔️",
        hook: "How was the lightsaber sound made?",
        answer:
          "A sound artist named Ben Burtt made it. He mixed the hum of an old movie machine. He added the buzz of a TV. You can make new things from everyday things.",
      },
      {
        id: "babyshark",
        emoji: "🦈",
        hook: "Which video got 10 billion views first?",
        answer:
          "Baby Shark Dance! It was the first YouTube video to get 10 billion views. A simple idea can reach the whole world.",
      },
      {
        id: "emoji",
        emoji: "😀",
        hook: "Who drew some of the first emoji?",
        answer: "A designer in Japan named Shigetaka Kurita. He drew them in 1999. Each one was made from tiny squares.",
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
        id: "ada",
        emoji: "🧮",
        hook: "Who wrote a computer program before computers were built?",
        answer:
          "Ada Lovelace, a math whiz from England. She wrote steps for a machine. It was not finished yet. Many people call her the first computer programmer.",
      },
      {
        id: "johnson",
        emoji: "🚀",
        hook: "Who helped astronauts fly to space and get home safely?",
        answer:
          "Katherine Johnson, a Black math whiz at NASA. She did math by hand to plan flights. Astronaut John Glenn asked her to check the math.",
      },
      {
        id: "ochoa",
        emoji: "🛰️",
        hook: "Who made tools that help computers see?",
        answer: "Dr. Ellen Ochoa is an engineer. She made tools that help computers see pictures. Then she flew to space!",
      },
      {
        id: "lawson",
        emoji: "🎮",
        hook: "Who helped make video game cartridges?",
        answer:
          "Jerry Lawson, a Black engineer. In 1976, his team made a game system with cartridges. Cartridges let you swap games.",
      },
      {
        id: "dean",
        emoji: "💻",
        hook: "Who helped invent the home computer?",
        answer: "Dr. Mark Dean, a Black engineer at IBM. He helped invent a computer for homes.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Make a Show                                                         */
/* ------------------------------------------------------------------ */

const sentences = (items: string[]) => items.map((i) => (/[.!?]$/.test(i) ? i : `${i}.`)).join(" ");

const littleEpisodes: Record<string, string[]> = {
  drawing: ["How to Draw a Dinosaur", "My Favorite Colors", "Draw My Pet With Me"],
  sports: ["Fun Ways to Get Faster", "How to Be a Good Teammate", "Can You Beat Me?"],
  math: ["Counting Games", "Fun With Shapes", "Math Games at Dinner"],
  baking: ["Cookies With a Grown-Up", "A Snack We Make Together", "Taste Test Time!"],
  games: ["My Top 3 Tips", "Board Games for Our Family", "How I Beat the Hard Level"],
  stories: ["My Favorite Book", "Make Up a Story With Me", "A Story About My Day"],
  music: ["Make a Beat With Things at Home", "My First Song", "Sing Along With Me!"],
  animals: ["Why Dogs Wag Their Tails", "How to Care for a Pet", "5 Amazing Animal Facts"],
  science: ["Volcano in a Cup", "Why Is the Sky Blue?", "Easy Experiments With a Grown-Up"],
};

export const littleEpisodeIdeas = (power: Superpower) => littleEpisodes[power.id] ?? power.episodeIdeas;

const littleCreatorSafety =
  "Make shows for your family and class. Ask a grown-up before you share anything online. Never share your name, school, or where you live.";

export const littleCreator = {
  intro: "A creator makes shows to share what they love. You will make a show for your family and friends. Let's plan YOUR show!",
  safety: littleCreatorSafety,
  /** The line under the pitch on the poster screen. */
  practice: "Real creators practice a lot and stay kind.",
  cardCloser: "Your show can make someone smile.",
  /** What the voice says on the poster screen. */
  posterSpoken: (power: Superpower) =>
    `Your brand new show is ready! Here are your first 3 episodes. ${sentences(littleEpisodeIdeas(power))} Now say your show out loud to a grown-up. Real creators practice a lot and stay kind. Stay safe. ${littleCreatorSafety}`,
  card: {
    emoji: "🎥",
    title: "Content Creator",
    tagline: "Grown-ups who make videos and shows to help people.",
    soft: ["Telling a good story", "Being brave", "Being kind and honest", "Being patient"],
    hard: ["Filming and editing videos", "Planning ideas", "Talking clearly"],
    school: "Reading, writing, and talking well help a lot. You can learn the rest.",
    ways: [
      "Practice telling stories now",
      "Teach a friend something you know",
      "Ask a grown-up before you share anything online",
    ],
    honest: "Some creators have only a few viewers at first. It takes time and practice.",
  } satisfies CareerCardData,
};

/* ------------------------------------------------------------------ */
/* Cyber Defenders                                                     */
/* ------------------------------------------------------------------ */

export const littleCyber: CyberContent = {
  intro:
    "Welcome, Cyber Defender! Some people online try to trick kids. You will learn how to stay safe. Pick a case!",
  cases: [
    {
      id: "popups",
      emoji: "🎣",
      title: "Pop-Up Tricks",
      blurb: "Some pop-ups try to fool you.",
      doneLine: "Case closed! You can spot a pop-up trick.",
      rounds: [
        {
          sceneEmoji: "🎁",
          who: "A pop-up shows on your tablet.",
          says: "YOU WON a prize! Tap now!",
          question: "What do you do?",
          options: [
            { emoji: "👆", text: "Tap it fast", feedback: "Careful! Tricks want you to hurry." },
            { emoji: "🙋", text: "Show a grown-up", correct: true, feedback: "Yes! You asked for help." },
            { emoji: "⌨️", text: "Type my name and where I live", feedback: "No! Keep your name and where you live private." },
          ],
          lesson: "Pop-ups that say you won are often tricks. Do not tap. Show a grown-up.",
        },
        {
          sceneEmoji: "🪙",
          who: "A video says:",
          says: "Free game coins! Tap the link!",
          question: "What do you do?",
          options: [
            { emoji: "👆", text: "Tap the link", feedback: "Free stuff can be a trick." },
            { emoji: "🙋", text: "Ask a grown-up first", correct: true, feedback: "Smart! Always ask first." },
            { emoji: "📣", text: "Tell all my friends", feedback: "Wait! It might be a trick. Do not share it." },
          ],
          lesson: "Free things online can be tricks. Ask a grown-up before you tap or download.",
        },
        {
          sceneEmoji: "🚨",
          who: "A loud pop-up says:",
          says: "Your tablet is broken! Call this number!",
          question: "What do you do?",
          options: [
            { emoji: "📞", text: "Call the number", feedback: "No! That is a trick to scare you." },
            {
              emoji: "😌",
              text: "Stay calm and show a grown-up",
              correct: true,
              feedback: "Great! Calm and smart.",
            },
            { emoji: "🔘", text: "Tap all the buttons", feedback: "Do not tap! Tapping can make it worse." },
          ],
          lesson: "Scary pop-ups want you to panic. Stay calm and show a grown-up.",
        },
      ],
    },
    {
      id: "secrets",
      emoji: "🔐",
      title: "Secret Passwords",
      blurb: "Keep your passwords safe.",
      doneLine: "Case closed! You know how to keep a secret.",
      rounds: [
        {
          sceneEmoji: "🔑",
          who: "You are making a new password.",
          question: "Which password is the strongest?",
          options: [
            { emoji: "🔢", text: "123", feedback: "Too short! It is easy to guess." },
            { emoji: "🐱", text: "cat", feedback: "Still short. A bad guy can guess it." },
            {
              emoji: "🐸",
              text: "red-frog-jumps-high",
              correct: true,
              feedback: "Yes! Long and silly is strong.",
            },
          ],
          lesson: "Long, silly passwords are hard to guess. A password is a secret. Only your grown-up can know it.",
        },
        {
          sceneEmoji: "🧒🏾",
          who: "Your best friend asks:",
          speaker: "zuri",
          says: "What is your game password? I will not tell!",
          question: "What do you do?",
          options: [
            { emoji: "🗣️", text: "Tell my friend", feedback: "Oops! A password is a secret, even from friends." },
            {
              emoji: "🤐",
              text: "Say no. It is a secret.",
              correct: true,
              feedback: "Yes! Only a grown-up in your family can know.",
            },
            { emoji: "🪧", text: "Put it on a big sign", feedback: "No! Then everyone could see it!" },
          ],
          lesson: "A password is for you only. Only a grown-up in your family can know it.",
        },
        {
          sceneEmoji: "🏫",
          who: "You finished on a school computer.",
          question: "What do you do before you leave?",
          options: [
            { emoji: "🏃", text: "Run to recess", feedback: "Wait! The next kid could see your stuff." },
            { emoji: "🚪", text: "Tap Log out", correct: true, feedback: "Yes! Now your stuff is private." },
            { emoji: "🖱️", text: "Leave it open", feedback: "Then the next kid can open your stuff." },
          ],
          lesson: "Logging out keeps your things private on a shared computer.",
        },
      ],
    },
    {
      id: "tell",
      emoji: "🛡️",
      title: "Tell a Grown-Up",
      blurb: "Know who to ask for help.",
      doneLine: "Case closed! You know when to tell a grown-up.",
      rounds: [
        {
          sceneEmoji: "🎮",
          who: "A new game friend asks:",
          says: "Where do you live?",
          question: "What do you do?",
          options: [
            { emoji: "🏠", text: "Tell them my street", feedback: "No! Keep where you live private." },
            {
              emoji: "🙅",
              text: "Say no and tell a grown-up",
              correct: true,
              feedback: "Great job! You kept your home private.",
            },
            { emoji: "🏫", text: "Tell them my school", feedback: "No! That is private too." },
          ],
          lesson: "Never tell online friends where you live. Never tell them your school. Tell a grown-up.",
        },
        {
          sceneEmoji: "👤",
          who: "A stranger wants to be your game friend.",
          question: "What do you do?",
          options: [
            { emoji: "✅", text: "Say yes!", feedback: "Wait! You do not know them." },
            {
              emoji: "🙋",
              text: "Ask a grown-up first",
              correct: true,
              feedback: "Smart! A grown-up can help you choose.",
            },
            { emoji: "💬", text: "Send them a message", feedback: "Do not chat with people you do not know." },
          ],
          lesson: "Only play with people your grown-up knows.",
        },
        {
          sceneEmoji: "😬",
          who: "You tapped something by accident. Your tablet looks funny.",
          question: "What do you do?",
          options: [
            { emoji: "🙈", text: "Hide it", feedback: "Hiding it makes it worse." },
            {
              emoji: "🙋",
              text: "Tell a grown-up right away",
              correct: true,
              feedback: "Yes! Telling is the right thing to do.",
            },
            { emoji: "🔘", text: "Tap more buttons", feedback: "Stop tapping! Ask for help." },
          ],
          lesson: "Everyone taps by accident. Tell a grown-up fast so they can help.",
        },
      ],
    },
  ],
  card: {
    emoji: "🛡️",
    title: "Cybersecurity Defender",
    tagline: "Grown-ups who keep computers safe from bad guys.",
    soft: ["Being careful", "Asking good questions", "Doing the right thing"],
    hard: ["Learning how computers work", "Spotting tricks", "Fixing problems fast"],
    school: "Many defenders start with computer classes. Reading and math help.",
    ways: ["Join a computer club with a grown-up", "Help fix computers at school or work", "Learn more when you are older"],
    honest:
      "Some defenders try to break in on purpose. They always ask first. Then they fix the weak spots.",
  },
  cardCloser: "Defenders keep people safe online.",
  grownUps: {
    heading: "For grown-ups: what your child practiced",
    topics: [
      "Pop-up prizes, free downloads, and scary warnings that try to rush a child",
      "Passwords are private, even from friends, and only a family grown-up should know them",
      "Logging out of shared computers",
      "Keeping name, address, and school private, and not chatting with strangers",
      "Telling a grown-up right away, without fear of getting in trouble",
    ],
    homeworkHeading: "Things a grown-up can do this week",
    homework: [
      "Turn on parental controls and screen time limits on your child's tablet",
      "Make a family rule: ask before you tap, download, or accept a new friend",
      "Pick a safe place to keep family passwords, such as a password manager",
      "Tell your child out loud that they will never be in trouble for telling you about something scary online",
    ],
    starters: [
      "What would you do if a pop-up said you won a prize?",
      "Who is allowed to know your password?",
      "Who would you tell if something scary showed up on a screen?",
    ],
  },
};

/** Everything the voice can say on the ages 5 to 7 side, so recorded clips can be made for it. */
export const littleSpokenLines: string[] = [
  pickerPrompt,
  littleBandIntro,
  ...Object.values(littleAbout),
  littleGift.intro,
  ...littleGift.questions.map(giftQuestionSpoken),
  ...Object.values(littleGiftResults).map(littleGiftResultSpoken),
  littleFactsIntro,
  ...littleFactGroups.flatMap((g) => g.facts.map((f) => `${f.hook} ${f.answer}`)),
  littleCreator.intro,
  ...superpowers.map(littleCreator.posterSpoken),
  ...[
    cardSpoken.intro(littleCreator.card),
    cardSpoken.soft(littleCreator.card),
    cardSpoken.hard(littleCreator.card),
    cardSpoken.school(littleCreator.card),
    cardSpoken.ways(littleCreator.card),
    cardSpoken.honest(littleCreator.card),
  ].filter(Boolean),
  littleCreator.cardCloser,
  littleHelper.intro,
  ...littleHelper.rounds.flatMap((r) => [
    helperRoundSpoken(r),
    ...r.options.map((o) => littleHelperFeedbackSpoken(r, o)),
  ]),
  ...[
    cardSpoken.intro(littleHelper.card, helperCardLead),
    cardSpoken.soft(littleHelper.card),
    cardSpoken.hard(littleHelper.card),
    cardSpoken.school(littleHelper.card),
    cardSpoken.ways(littleHelper.card),
    cardSpoken.honest(littleHelper.card),
  ].filter(Boolean),
  ...cyberContentSpoken(littleCyber),
];
