// Content for the Cyber Defenders world, ages 8 to 10 (3rd to 5th grade).
// The ages 5 to 7 version lives in play-little.ts and uses the same types.
// Every question puts the child in the seat of the person
// deciding, with something a child really sees: tablets, game chat, friends, pop-ups.
// The ideas follow the basics grown-up security professionals learn: social engineering and
// phishing, strong and unique passwords, multifactor login, malware, patching, backups, least
// privilege, and the CIA triad. Every sentence here is written fresh for kids.
// Rules for anything added here:
//  - Short sentences, around a 3rd grade reading level.
//  - No em dashes.
//  - No outbound links and nothing that collects or stores a child's information.
//  - No pay numbers and no ranking of jobs.
//  - Use made-up names for sites and companies. Never name a real brand or person.

import { cardSpoken } from "./career-day";

export const cyberAbout =
  "Spot tricks, protect passwords, and learn how people keep the internet safe. Solve four cases to become a Cyber Defender.";

export const cyberIntro =
  "Welcome, Cyber Defender! Bad guys online try to trick people. You will learn to spot their tricks and keep people safe. Pick a case to start!";

export type CyberOption = {
  emoji: string;
  text: string;
  correct?: boolean;
  feedback: string;
};

export type CyberRound = {
  sceneEmoji: string;
  /** A Tech Crew member (see career-avatar.ts) shown as the person talking, when a kid is speaking. */
  speaker?: string;
  who: string;
  says?: string;
  question: string;
  options: CyberOption[];
  lesson: string;
};

export type CyberCardData = {
  emoji: string;
  title: string;
  tagline: string;
  soft: string[];
  hard: string[];
  school: string;
  ways: string[];
  honest?: string;
};

export type CyberGrownUps = {
  heading: string;
  topics: string[];
  homeworkHeading: string;
  homework: string[];
  starters: string[];
};

/** Everything one age group sees inside the Cyber Defenders world. */
export type CyberContent = {
  intro: string;
  cases: CyberCase[];
  card: CyberCardData;
  cardCloser: string;
  grownUps: CyberGrownUps;
};

export type CyberCase = {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
  doneLine: string;
  rounds: CyberRound[];
};

export const cyberCases: CyberCase[] = [
  {
    id: "tricks",
    emoji: "🎣",
    title: "Spot the Trick",
    blurb: "Learn how bad guys try to fool people.",
    doneLine: "Case closed! You can spot a trick now.",
    rounds: [
      {
        sceneEmoji: "📱",
        who: "A message pops up on your tablet:",
        says: "YOU WON a free game console! Tap here in 5 minutes or lose it!",
        question: "What do you do?",
        options: [
          { emoji: "👆", text: "Tap it fast", feedback: "Careful! Bad guys rush you so you will not stop and think." },
          {
            emoji: "🙋",
            text: "Show a grown-up and do not tap",
            correct: true,
            feedback: "Smart! You stopped to think and asked for help.",
          },
          { emoji: "✍️", text: "Type in your name and address", feedback: "Never share where you live with a message like this." },
        ],
        lesson:
          "This trick is called phishing. It sounds like fishing, because bad guys use bait like free prizes. Watch out for messages that rush you.",
      },
      {
        sceneEmoji: "🎧",
        who: "Someone in your game chat says:",
        says: "Hi! I work for the game. Tell me your password so I can fix your account.",
        question: "What do you do?",
        options: [
          { emoji: "⌨️", text: "Type the password", feedback: "Oops. Real helpers never need your password." },
          {
            emoji: "🚪",
            text: "Leave the chat and tell a grown-up",
            correct: true,
            feedback: "Yes! You kept your password secret.",
          },
          { emoji: "✂️", text: "Type just the first half", feedback: "Even half a password helps a bad guy." },
        ],
        lesson:
          "Pretending to be someone you trust is a bad guy trick. Never share your password with anyone who asks, even if they say they work for the game. Tell a grown-up.",
      },
      {
        sceneEmoji: "💻",
        who: "You want to play Bamboo Bay. The real address is:",
        says: "bamboobay.com",
        question: "Which address is a sneaky fake?",
        options: [
          { emoji: "✅", text: "bamboobay.com", feedback: "That one matches the real address." },
          {
            emoji: "🕵️",
            text: "barnboobay.com",
            correct: true,
            feedback: "You caught it! It has an r and an n, which can look like an m.",
          },
          { emoji: "🛒", text: "bamboobay.com/shop", feedback: "That is the same site with a page name added. It matches the real address." },
        ],
        lesson:
          "Bad guys make lookalike web addresses. Read each letter slowly. A grown-up can help you save the real site so you do not have to type it.",
      },
      {
        sceneEmoji: "🔌",
        who: "You find a little USB stick on the playground. It says:",
        says: "Free Cat Videos",
        question: "What do you do?",
        options: [
          { emoji: "💻", text: "Plug it in to take a look", feedback: "Do not! It could hide bad software." },
          {
            emoji: "🙋",
            text: "Give it to a grown-up and do not plug it in",
            correct: true,
            feedback: "Great choice. A grown-up can decide what to do.",
          },
          { emoji: "🧑🏽‍🤝‍🧑🏿", text: "Let a friend try it first", feedback: "That could hurt your friend's computer too." },
        ],
        lesson:
          "Bad guys leave USB sticks around, hoping someone is curious. Plugging one in can start bad software. Never plug in a stick you do not know.",
      },
    ],
  },
  {
    id: "locks",
    emoji: "🔐",
    title: "Lock It Down",
    blurb: "Make passwords and logins hard to crack.",
    doneLine: "Case closed! Your locks are strong.",
    rounds: [
      {
        sceneEmoji: "🔑",
        who: "You are making a new password for your game account.",
        question: "Which password is hardest to guess?",
        options: [
          { emoji: "🔢", text: "123456", feedback: "Very easy to guess. Lots of people use it." },
          { emoji: "🐶", text: "ilovemydog", feedback: "Pet names are easy for bad guys to guess." },
          {
            emoji: "🥒",
            text: "blue-pickle-rocket-dance",
            correct: true,
            feedback: "Yes! It is long and made of random words.",
          },
        ],
        lesson:
          "Longer is stronger. Four random words in a row is hard for a computer to guess and easy for you to remember. Dashes between the words make it even longer.",
      },
      {
        sceneEmoji: "🔁",
        who: "You are signing up for a brand new game.",
        question: "What password do you use?",
        options: [
          {
            emoji: "♻️",
            text: "The same one I use for everything",
            feedback: "Careful! If a bad guy learns it, he can try it on all your accounts.",
          },
          {
            emoji: "🆕",
            text: "A brand new one just for this game",
            correct: true,
            feedback: "Yes! Every account gets its own password.",
          },
          {
            emoji: "2️⃣",
            text: "My old password with a 2 on the end",
            feedback: "Bad guys try that trick too. Make a new one.",
          },
        ],
        lesson:
          "If you use one password everywhere, a bad guy who learns it can try it on all your accounts. That is a lot of passwords to remember! A password manager can keep them safe for you. Ask a grown-up to help you set one up.",
      },
      {
        sceneEmoji: "🧑🏽‍🤝‍🧑🏿",
        who: "Your best friend says:",
        speaker: "jamal",
        says: "Tell me your game password so I can play on your account!",
        question: "What do you do?",
        options: [
          { emoji: "🤫", text: "Tell them, they are your best friend", feedback: "Friends mean well, but secrets can slip out. Keep it secret." },
          {
            emoji: "🙅",
            text: "Say no, and only share it with a grown-up in your family",
            correct: true,
            feedback: "Yes! A true friend understands.",
          },
          { emoji: "📝", text: "Write it on a note and pass it in class", feedback: "Other people could see the note." },
        ],
        lesson:
          "A password is a secret, even from friends. Only share it with a grown-up in your family. If you want to play together, ask a grown-up to help you set it up the safe way.",
      },
      {
        sceneEmoji: "📲",
        who: "Your game asks for a code from your grown-up's phone each time you log in. A friend says:",
        speaker: "sofia",
        says: "Turn that off. It takes too long!",
        question: "What do you do?",
        options: [
          {
            emoji: "🛡️",
            text: "Keep it on. It helps keep bad guys out",
            correct: true,
            feedback: "Yes! Two checks are harder to beat than one.",
          },
          {
            emoji: "⏩",
            text: "Turn it off to go faster",
            feedback: "Faster, but a bad guy with your password could get in.",
          },
          {
            emoji: "🗣️",
            text: "Read the code out to my friend",
            feedback: "A code is a secret too. Never share it.",
          },
        ],
        lesson:
          "This is called two-step login. A computer can check three kinds of proof. Something you know, like a password. Something you have, like a phone. Something you are, like a fingerprint. Using two kinds is stronger.",
      },
    ],
  },
  {
    id: "bugs",
    emoji: "🐛",
    title: "Bad Bugs",
    blurb: "Meet the sneaky software that causes trouble.",
    doneLine: "Case closed! You know the bad bugs.",
    rounds: [
      {
        sceneEmoji: "🔒",
        who: "A scary message pops up on the screen:",
        says: "Your photos are locked! Pay money to get them back!",
        question: "What do you do?",
        options: [
          {
            emoji: "🙋",
            text: "Tell a grown-up right away",
            correct: true,
            feedback: "Yes! Grown-ups know what to do.",
          },
          { emoji: "💸", text: "Tap the pay button", feedback: "Do not tap it! Paying does not promise you get anything back." },
          { emoji: "🚶", text: "Walk away and say nothing", feedback: "The message will still be there. Tell a grown-up." },
        ],
        lesson:
          "This bad software is called ransomware. It locks files and asks for money. Grown-ups can protect your photos by making a backup, which is a safe copy kept somewhere else.",
      },
      {
        sceneEmoji: "🎮",
        who: "A video says:",
        says: "Download this FREE file to get unlimited game coins!",
        question: "What do you do?",
        options: [
          { emoji: "⬇️", text: "Download it, free coins!", feedback: "Free coin offers often hide bad software." },
          {
            emoji: "🙋",
            text: "Skip it and tell a grown-up",
            correct: true,
            feedback: "Yes! If it sounds too good to be true, it usually is.",
          },
          { emoji: "📤", text: "Send it to your friends", feedback: "That could hurt your friends' devices too." },
        ],
        lesson:
          "This is called a Trojan horse. Like the wooden horse in the old story, it looks like a gift but hides trouble. Bad software is called malware. Only get games and apps from places a grown-up trusts.",
      },
      {
        sceneEmoji: "🚨",
        who: "A loud pop-up says:",
        says: "WARNING! Your tablet has a virus! Tap here to clean it now!",
        question: "What do you do?",
        options: [
          { emoji: "👆", text: "Tap the button fast", feedback: "Careful! That button may be the trick." },
          {
            emoji: "😌",
            text: "Stay calm, do not tap, and tell a grown-up",
            correct: true,
            feedback: "Yes! You stayed calm and did not fall for it.",
          },
          { emoji: "📞", text: "Call the number on the screen", feedback: "Do not call! Bad guys pretend to be helpers." },
        ],
        lesson:
          "Scary pop-ups try to rush you into tapping. Stop, stay calm, and show a grown-up. A real fix never comes from a pop-up that shouts at you.",
      },
      {
        sceneEmoji: "🔄",
        who: "Your tablet says:",
        says: "An update is ready.",
        question: "What should you do?",
        options: [
          { emoji: "⏭️", text: "Tap Later, again and again", feedback: "Old software can have weak spots." },
          {
            emoji: "🙋",
            text: "Ask a grown-up to install it",
            correct: true,
            feedback: "Yes! Updates fix weak spots.",
          },
          { emoji: "😴", text: "Turn the tablet off for a week", feedback: "That does not fix anything." },
        ],
        lesson:
          "Fixing a weak spot is called patching. It is like fixing a hole in a fence. Bad guys look for old software with known holes. Ask a grown-up to install updates.",
      },
    ],
  },
  {
    id: "shield",
    emoji: "🛡️",
    title: "Be a Defender",
    blurb: "Protect yourself and the people around you.",
    doneLine: "Case closed! You are a real defender.",
    rounds: [
      {
        sceneEmoji: "💬",
        who: "A new online friend asks:",
        says: "What school do you go to? And what street do you live on?",
        question: "What do you do?",
        options: [
          { emoji: "😀", text: "Tell them, they seem nice", feedback: "Nice-seeming people can still be tricky." },
          {
            emoji: "🙅",
            text: "Say no and tell a trusted grown-up",
            correct: true,
            feedback: "Great! Keep private facts private.",
          },
          { emoji: "🏠", text: "Tell them just the street", feedback: "Every little fact helps someone find you." },
        ],
        lesson:
          "Bad guys gather small facts, like your school, your street, and your birthday. Then they put the facts together. Keep private facts private, online and in games.",
      },
      {
        sceneEmoji: "🏗️",
        who: "A friend wants to help build in your game world. You get to pick their powers.",
        question: "Which power do you give them?",
        options: [
          { emoji: "👑", text: "Boss powers, so they can delete anything", feedback: "Too much! They could delete your whole world, even by accident." },
          { emoji: "🧱", text: "Just the power to build in one spot", correct: true, feedback: "Yes! They get just what they need." },
          { emoji: "👀", text: "No powers, they can only watch", feedback: "Then they cannot help build." },
        ],
        lesson:
          "Give people only the power they need. Security pros call this least privilege. If something goes wrong, only a little can be hurt.",
      },
      {
        sceneEmoji: "🏆",
        who: "A kid at school says:",
        speaker: "kenji",
        says: "I know a trick to change your game score from 500 to 5,000!",
        question: "What do you do?",
        options: [
          {
            emoji: "🤩",
            text: "Yes! Change it!",
            feedback: "Wait! Then your score would not be true. Real scores are earned.",
          },
          {
            emoji: "🙅",
            text: "No thanks. I want my real score",
            correct: true,
            feedback: "Yes! A true score is one you earned.",
          },
          {
            emoji: "🤫",
            text: "Yes, but do not tell anyone",
            feedback: "Sneaky tricks can break the game. Try again!",
          },
        ],
        lesson:
          "Defenders protect three goals. Keep it secret, so only the right people can see it. Keep it true, so nobody changes it by trick. Keep it ready, so it works when you need it.",
      },
      {
        sceneEmoji: "😬",
        who: "You clicked a weird link by accident. Your screen looks strange.",
        question: "What do you do?",
        options: [
          { emoji: "🙈", text: "Hide it and hope it goes away", feedback: "Hiding it gives the problem time to grow." },
          {
            emoji: "🙋",
            text: "Tell a grown-up right away",
            correct: true,
            feedback: "Yes! Telling fast is brave and it helps a lot.",
          },
          { emoji: "🖱️", text: "Click more buttons to fix it", feedback: "Extra clicks can make it worse." },
        ],
        lesson:
          "Everyone makes mistakes online, even experts. Tell a grown-up right away. Telling quickly is always the right move.",
      },
    ],
  },
];

export const cyberCard: CyberCardData = {
  emoji: "🛡️",
  title: "Cybersecurity Defender",
  tagline: "Grown-ups who protect people, computers, and information from bad guys online.",
  soft: [
    "Being curious and asking why",
    "Being careful and patient",
    "Explaining things clearly",
    "Doing the right thing, even when nobody is watching",
  ],
  hard: [
    "How computers and networks work",
    "Spotting tricks and weak spots",
    "Watching for problems and fixing them fast",
    "Writing down what happened",
    "Learning new tools all the time",
  ],
  school:
    "Many people start with computer classes, a certificate, or college. Some learn on the job. Reading, math, and good questions help in every path.",
  ways: [
    "Join a coding or computer club, with a parent",
    "Help desk or IT support jobs",
    "Training programs and certificates when you are grown",
    "Community college or a 4-year degree",
    "Internships",
  ],
  honest:
    "Some defenders are ethical hackers. They get permission first, then try to break in so they can fix weak spots before bad guys find them. Breaking in without permission is against the law.",
};

export const cyberCardCloser = "Defenders keep the internet safe for everyone.";

// Shown on the last screen so a parent can see what was practiced and talk about it.
export const cyberGrownUps: CyberGrownUps = {
  heading: "For grown-ups: what your child practiced",
  topics: [
    "Phishing and impersonation (messages and chats that rush or pretend)",
    "Lookalike web addresses and unknown USB drives",
    "Strong, long passwords, a different one for every account, and not sharing them with friends",
    "Two-step login, or multifactor authentication",
    "Fake warnings, free-download traps, ransomware, and Trojans",
    "Updates (patching) and keeping private facts private",
    "Least privilege, and the three goals of security: confidentiality, integrity, and availability",
  ],
  homeworkHeading: "Things a grown-up can do this week",
  homework: [
    "Change the default password on your router, cameras, and smart devices",
    "Turn on two-step login for the accounts your family uses most",
    "Set up a password manager together",
    "Back up family photos to a second place, such as an external drive",
    "Turn on automatic updates",
  ],
  starters: [
    "Which trick would you be most likely to fall for?",
    "What is one password we should make stronger today?",
    "Who would you tell if something looked wrong on a screen?",
  ],
};

export const cyberBig: CyberContent = {
  intro: cyberIntro,
  cases: cyberCases,
  card: cyberCard,
  cardCloser: cyberCardCloser,
  grownUps: cyberGrownUps,
};

/* ------------------------------------------------------------------ */
/* What the "Read it to me" buttons say                                */
/* ------------------------------------------------------------------ */

export const cyberRoundSpoken = (round: CyberRound) =>
  `${round.who} ${round.says ?? ""} ${round.question} ${round.options
    .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}`)
    .join(" ")}`
    .replace(/\s+/g, " ")
    .trim();

// A wrong answer hears only what went wrong. The right answer hears the lesson too.
export const cyberFeedbackSpoken = (round: CyberRound, option: CyberOption) =>
  option.correct ? `${option.feedback} ${round.lesson}` : option.feedback;

// Every line the voice can say for one age group's version, so recorded clips can be made for it.
export const cyberContentSpoken = (c: CyberContent): string[] => [
  c.intro,
  ...c.cases.flatMap((k) => [
    k.doneLine,
    ...k.rounds.flatMap((r) => [cyberRoundSpoken(r), ...r.options.map((o) => cyberFeedbackSpoken(r, o))]),
  ]),
  ...[
    cardSpoken.intro(c.card),
    cardSpoken.soft(c.card),
    cardSpoken.hard(c.card),
    cardSpoken.school(c.card),
    cardSpoken.ways(c.card),
    cardSpoken.honest(c.card),
  ].filter(Boolean),
  c.cardCloser,
];

export const cyberSpokenLines: string[] = [cyberAbout, ...cyberContentSpoken(cyberBig)];
