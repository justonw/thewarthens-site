// Parent-facing guide pages for Tech Journey Jr. (rendered by src/app/techjr/[slug]/page.tsx).
// Each one answers a question a parent really types into a search box, in plain words, and points
// to the free game at the end. Rules: say only what is true and visible, no pay numbers, no
// medical claims, no promises about outcomes, no em dashes.

export const ARTICLES_UPDATED = "2026-11-03";

export type Item = { title: string; text: string; say?: string; tag?: string; talk?: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: Item[] }
  | { type: "cards"; items: Item[] }
  | { type: "facts"; groupIds: string[] }
  | { type: "note"; text: string }
  | { type: "links"; items: { label: string; href: string; text: string }[] };

export type Section = { id: string; heading: string; blocks: Block[] };

export type Article = {
  slug: string;
  /** The <title> tag. Keep it under about 60 characters. */
  title: string;
  h1: string;
  /** The meta description. Keep it under about 160 characters. */
  description: string;
  eyebrow: string;
  updated: string;
  keywords: string[];
  intro: string[];
  sections: Section[];
  faq: { question: string; answer: string }[];
  related: string[];
  cta: { heading: string; text: string };
  /** The short name used in link lists. */
  short: string;
  blurb: string;
};

const SAFETY_LINKS = [
  {
    label: "NetSmartz, from the National Center for Missing & Exploited Children",
    href: "https://www.missingkids.org/netsmartz/home",
    text: "Free videos and activities about online safety, with sections for kids and for parents.",
  },
  {
    label: "Be Internet Awesome, from Google",
    href: "https://beinternetawesome.withgoogle.com/",
    text: "A free curriculum and an online game called Interland that teaches kids the basics of safe sharing, passwords, and spotting tricks.",
  },
];

export const articles: Article[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "internet-safety-for-kids",
    short: "Internet safety for kids",
    title: "Internet Safety for Kids: 10 Simple Rules by Age (5 to 10)",
    h1: "Internet Safety for Kids: 10 Simple Rules (Ages 5 to 10)",
    description:
      "Ten plain-language internet safety rules for kids ages 5 to 10, with the exact words to say and a free game that lets your child practice them.",
    eyebrow: "Online safety",
    updated: ARTICLES_UPDATED,
    keywords: [
      "internet safety for kids",
      "online safety rules for kids",
      "how to teach kids internet safety",
      "internet safety for 6 year olds",
      "internet safety games for kids",
      "cyber safety for kids",
      "kids online safety rules",
    ],
    blurb: "Ten rules kids can actually remember, with the words to say and a game to practice.",
    intro: [
      "Kids learn online safety the same way they learn to cross the street: by hearing a few simple rules, seeing them used, and practicing before it counts. A long list of dos and don'ts does not stick. Ten short rules, said the same way every time, do.",
      "These are the rules we built the Cyber Defenders game around. Each one has words you can say out loud, and a note about how it changes between ages 5 to 7 and ages 8 to 10. At the end, there is a free game where children practice each rule by making the choice themselves, with no sign-in and nothing saved.",
    ],
    sections: [
      {
        id: "rules",
        heading: "The 10 rules, in kid words",
        blocks: [
          {
            type: "numbered",
            items: [
              {
                title: "Pop-ups and \"You won!\" messages are tricks.",
                say: "If a screen says you won something, do not tap it. Show a grown-up.",
                text: "Real prizes do not show up in the middle of a game or a video. For ages 5 to 7, keep it to one idea: do not tap, tell a grown-up. For ages 8 to 10, add that the countdown timers and big flashing buttons are there to make you rush.",
              },
              {
                title: "Passwords are secret.",
                say: "Only you and your grown-up know your password. Not even your best friend.",
                text: "Kids often share passwords as a sign of friendship, so say this one plainly and say why: a friend can lose it, or share it without meaning to. Older kids can learn that a long password made of four silly words is stronger than a short tricky one, and easier to remember.",
              },
              {
                title: "Keep private things private.",
                say: "We do not tell people online our full name, where we live, our school, or our phone number.",
                text: "Practice what counts as private. Young kids need a short list. Older kids can understand that a photo in a school shirt, or a street sign in the background, can give away more than they meant to.",
              },
              {
                title: "If something feels wrong, stop and tell a grown-up.",
                say: "You will never be in trouble for telling me.",
                text: "This is the most important rule, and the sentence about not being in trouble is what makes it work. Children hide problems when they expect a punishment. Say the sentence often, and mean it.",
              },
              {
                title: "A new online friend is still a stranger.",
                say: "If someone online asks where you live or what school you go to, that is a stop and tell sign.",
                text: "Explain that people online can say they are anyone. You do not need to scare your child. A calm, matter-of-fact tone teaches more than a frightening story.",
              },
              {
                title: "Free stuff online is usually a trick.",
                say: "Free coins, free consoles, and free skins almost always cost something. Ask me first.",
                text: "Kids love free in-game items, and scammers know it. Link the rule to something they care about, like their game account, rather than to an abstract idea about scams.",
              },
              {
                title: "Ask before you download or plug in anything.",
                say: "We never plug in a USB stick we found, and we never download a file without asking.",
                text: "Even a stick marked \"Free Cat Videos\" can hold something harmful. For younger kids the rule is simply \"ask first.\" For older kids, explain that a download can carry a virus, and that this is how some scammers lock up families' photos.",
              },
              {
                title: "Look at the web address.",
                say: "Read the address letter by letter. Bad guys make copies with one letter changed.",
                text: "This one is for ages 8 to 10. A fake address might swap an m for an r and an n. A good habit is for your child to ask a grown-up to save the real site, so they never type it from memory.",
              },
              {
                title: "Be kind online, and do not answer mean messages.",
                say: "If someone is mean, do not write back. Take a screenshot or show me, and we will handle it together.",
                text: "Keeping the proof matters if a school or a game company needs to step in. Remind kids that they can walk away from a chat or a game at any time.",
              },
              {
                title: "If you made a mistake, tell a grown-up right away.",
                say: "Clicked something weird? Tell me. Everyone does it, and fast is what helps.",
                text: "Most online problems get bigger because a child hides a click. Speed matters more than blame. Make the \"I clicked something\" conversation a calm one every time.",
              },
            ],
          },
        ],
      },
      {
        id: "by-age",
        heading: "What changes between ages 5 to 7 and ages 8 to 10",
        blocks: [
          {
            type: "cards",
            items: [
              {
                title: "Ages 5 to 7",
                text: "Keep to three ideas: do not tap pop-ups, keep passwords secret, and tell a grown-up when something feels wrong. Use pictures and short sentences. Practice by doing, not by lecturing. A game that reads each screen aloud lets a child who is still learning to read play along.",
              },
              {
                title: "Ages 8 to 10",
                text: "Add look-alike web addresses, the reasons behind long passwords, and what two-step codes protect. Talk about group chats, in-game trading, and friends who ask for their account. Children this age can handle the \"why\" and often want it.",
              },
            ],
          },
        ],
      },
      {
        id: "grown-ups",
        heading: "What grown-ups can do (so kids do not have to)",
        blocks: [
          {
            type: "p",
            text: "Some safety jobs belong to adults. A child should not be responsible for any of these.",
          },
          {
            type: "bullets",
            items: [
              "Turn on two-step verification for your child's game and app accounts, and keep the codes on your phone.",
              "Use your phone or tablet's built-in parental controls to set app limits and approve downloads.",
              "Use a password manager for the family so no one has to remember dozens of passwords.",
              "Keep screens in shared spaces when kids are younger, and agree on when devices go to charge for the night.",
              "Keep devices and apps updated, and change a router's default password.",
              "Check privacy settings in the games your child plays, especially chat and friend requests.",
            ],
          },
        ],
      },
      {
        id: "practice",
        heading: "Practice the rules with a free game",
        blocks: [
          {
            type: "p",
            text: "Cyber Defenders is a part of our free game, Tech Journey Jr. Your child solves short cases about things kids really see, like a pop-up prize, a friend asking for a password, or a link that looks wrong. Each question puts the child in the decision seat, and the right answer is something a child can actually do. There are no ads, no sign-in, and nothing a child picks is saved or sent.",
          },
          {
            type: "links",
            items: [
              {
                label: "Cyber Defenders for ages 8 to 10",
                href: "/techjr/play/ages-8-10/cyber",
                text: "Four cases with four questions each, including passwords, look-alike sites, and what to do after a mistake.",
              },
              {
                label: "Cyber Defenders for ages 5 to 7",
                href: "/techjr/play/ages-5-7/cyber",
                text: "Three short cases with picture choices and a voice that reads every screen aloud.",
              },
            ],
          },
        ],
      },
      {
        id: "more",
        heading: "More free resources",
        blocks: [{ type: "links", items: SAFETY_LINKS }],
      },
    ],
    faq: [
      {
        question: "At what age should kids learn internet safety?",
        answer:
          "As soon as they use a screen on their own. For ages 5 to 7, three ideas are enough: do not tap pop-ups, keep passwords secret, and tell a grown-up when something feels wrong. You can add more as your child grows and starts to chat or play online with others.",
      },
      {
        question: "What is the most important internet safety rule for kids?",
        answer:
          "Telling a grown-up when something feels wrong, and knowing they will not be in trouble for it. Every other rule works better when a child feels safe to speak up.",
      },
      {
        question: "How do I teach my child about online strangers without scaring them?",
        answer:
          "Use a calm, matter-of-fact tone and a simple rule: anyone online who asks where you live, what school you go to, or for a secret is a stop and tell a grown-up sign. Practice with a few pretend situations so it feels normal.",
      },
      {
        question: "Is there a free internet safety game for kids?",
        answer:
          "Yes. Cyber Defenders, part of Tech Journey Jr., is free, has no ads, and needs no account. It comes in a version for ages 5 to 7 with a read-aloud voice and a version for ages 8 to 10. Google's Interland is another free option for older elementary kids.",
      },
      {
        question: "Should I let my child have their own passwords?",
        answer:
          "Young children can have a simple password you also know. Keep a list in a password manager so you can help them log in, and teach them that the password stays between them and you.",
      },
    ],
    related: ["how-to-choose-safe-educational-games", "things-to-do-when-kids-are-bored"],
    cta: {
      heading: "Let your child practice, hands on",
      text: "Cyber Defenders turns these rules into short cases kids solve themselves. It takes about ten minutes, and it works on a phone, tablet, or computer.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "how-to-choose-safe-educational-games",
    short: "How to choose safe educational games",
    title: "Safe Educational Games for Kids: A Parent's Checklist",
    h1: "Safe Educational Games for Kids: A Parent's Checklist",
    description:
      "Before you hand your child a phone, check these 8 things. A simple checklist for safe, ad-free educational games, plus free options to try for ages 5 to 10.",
    eyebrow: "For parents",
    updated: ARTICLES_UPDATED,
    keywords: [
      "safe educational games for kids",
      "free educational games no ads",
      "educational games kids can play on a phone",
      "best free educational games for kids",
      "games for kids with no ads or in-app purchases",
      "how to pick a safe game for my child",
      "kid friendly games no sign up",
    ],
    blurb: "Eight things to check before you hand over the phone, and free games to try.",
    intro: [
      "Typing \"educational games\" into an app store returns thousands of results, and many are built to keep a child tapping, not to teach. Ads, surprise purchases, and open chat rooms can all hide inside a game that calls itself educational.",
      "Here is the short checklist we use when deciding what to put in front of kids. It takes about five minutes, and it works for any game, including ours. After the checklist, you will find a few free places to start and a tip for getting a game onto your phone so your child can open it in one tap.",
    ],
    sections: [
      {
        id: "checklist",
        heading: "The 8-point safe game checklist",
        blocks: [
          {
            type: "numbered",
            items: [
              {
                title: "No ads.",
                text: "Ads can be unrelated to learning, can push kids toward other apps, and can interrupt a game at the worst moment. If a game is free because it shows ads, think about whether you want that in front of a child.",
              },
              {
                title: "No in-app purchases.",
                text: "A game that keeps asking for coins, gems, or upgrades teaches kids to want more instead of to learn. Look for \"no in-app purchases\" in the app store listing, or for a site that has nothing to buy.",
              },
              {
                title: "No chat with strangers.",
                text: "If a game has chat, find out who can talk to your child and whether you can switch it off. The safest educational games do not have open chat at all.",
              },
              {
                title: "No account, or a very light one.",
                text: "A game that needs no sign-in cannot lose or leak your child's information. If it does ask for an account, check what it collects and whether a parent controls it.",
              },
              {
                title: "A clear age fit.",
                text: "A game for ages 8 to 10 will frustrate a five-year-old, and a game for five-year-olds will bore a ten-year-old. Look for games that say who they are for, or that come in more than one version.",
              },
              {
                title: "Reads aloud, if your child is still learning to read.",
                text: "A voice that reads each screen lets a kindergartner play without help. Picture choices matter too, since a child who is still sounding out words can still make a decision.",
              },
              {
                title: "A natural stopping point.",
                text: "Levels, stars, and short missions are easier to end than a game that never finishes. A game with a clear finish line makes \"time to stop\" a smaller fight.",
              },
              {
                title: "Something you can talk about afterward.",
                text: "The best educational games leave a question behind, like \"what would you do if a pop-up said you won?\" If your child can tell you what they learned, it did its job.",
              },
            ],
          },
          {
            type: "note",
            text: "A quick way to check: play the first five minutes yourself, then read the app store's privacy and \"data safety\" label. If the game collects a lot and you cannot tell why, skip it.",
          },
        ],
      },
      {
        id: "free-options",
        heading: "Free places to start",
        blocks: [
          {
            type: "p",
            text: "We make the first one, so weigh our opinion accordingly. The others are well-known free resources. Policies change, so check each one's current terms before you hand it over.",
          },
          {
            type: "links",
            items: [
              {
                label: "Tech Journey Jr. (ours)",
                href: "/techjr/play",
                text: "A free browser game for ages 5 to 10 that teaches online safety, tech and creator careers, and cool facts. No ads, no sign-in, and nothing a child picks is saved. Two versions: Tech Sprouts (5 to 7, read-aloud) and Tech Trailblazers (8 to 10).",
              },
              {
                label: "PBS KIDS Games",
                href: "https://pbskids.org/games",
                text: "Free games built around PBS KIDS characters and shows, from public media.",
              },
              {
                label: "Khan Academy Kids",
                href: "https://learn.khanacademy.org/khan-academy-kids/",
                text: "A free learning app from a nonprofit, aimed at younger children.",
              },
              {
                label: "Interland, from Google",
                href: "https://beinternetawesome.withgoogle.com/en_us/interland",
                text: "A free online safety game for older elementary kids.",
              },
            ],
          },
        ],
      },
      {
        id: "phone",
        heading: "How to put a game on your phone for your child",
        blocks: [
          {
            type: "p",
            text: "A game that runs in the browser does not need to be installed from an app store. You can put a shortcut on the home screen, and your child opens it with one tap, like an app.",
          },
          {
            type: "bullets",
            items: [
              "iPhone or iPad: open the game in Safari, tap the Share button, then tap Add to Home Screen.",
              "Android: open the game in Chrome, tap the three-dot menu, then tap Add to Home screen (or Install app).",
              "To keep your child inside the game, iPhone has a setting called Guided Access, and Android has screen pinning. Both stop a child from leaving the app until you unlock it. Search your device's settings for either name.",
              "Turn the volume up if your child uses a read-aloud game, and check that the phone is not on silent.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "What makes an educational game safe for kids?",
        answer:
          "No ads, no in-app purchases, no chat with strangers, no or minimal account, a clear age fit, and a natural stopping point. Also look for a game that leaves your child with something to talk about afterward.",
      },
      {
        question: "Are there free educational games with no ads and no sign-up?",
        answer:
          "Yes. Tech Journey Jr. is free with no ads and no sign-in. PBS KIDS Games and Khan Academy Kids are other well-known free options. Always check each one's current policies, since they can change.",
      },
      {
        question: "What can I put on my child's phone that is educational?",
        answer:
          "Look for games that run in the browser so you can add a shortcut to the home screen, or apps with no ads or in-app purchases. Pick games that match your child's reading level and that have levels or missions so there is a natural place to stop.",
      },
      {
        question: "Are browser games safe for kids?",
        answer:
          "They can be, if the site has no ads, no chat, and no account. Open the game yourself first and play for five minutes. A game that sends kids to other sites or asks for personal information is not a good fit.",
      },
      {
        question: "What are good games for kids who cannot read yet?",
        answer:
          "Look for games with picture choices and a voice that reads each screen. Tech Sprouts, the ages 5 to 7 version of Tech Journey Jr., reads every screen aloud and puts a picture on every choice.",
      },
    ],
    related: ["internet-safety-for-kids", "things-to-do-when-kids-are-bored"],
    cta: {
      heading: "Try a game that passes the checklist",
      text: "Tech Journey Jr. is free, has no ads or sign-in, and takes about ten minutes to finish a world. Pick an age group and hand over the phone.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "things-to-do-when-kids-are-bored",
    short: "What to do when your kid is bored",
    title: "What to Do When Your Kid Is Bored: 20 Screen-Smart Ideas",
    h1: "What to Do When Your Kid Is Bored: 20 Screen-Smart Ideas",
    description:
      "Waiting rooms, car rides, rainy days: 20 quick ideas for bored kids ages 5 to 10, from a free no-ads game to screen-free challenges you can start in a minute.",
    eyebrow: "For parents",
    updated: ARTICLES_UPDATED,
    keywords: [
      "what to do when your child is bored",
      "things to do when kids are bored",
      "games to play when kids are bored",
      "what to give a bored kid on a phone",
      "educational activities for bored kids",
      "car ride activities for kids",
      "waiting room activities for kids",
      "screen time ideas for kids",
    ],
    blurb: "Twenty ideas for waiting rooms, car rides, and rainy days, with and without a screen.",
    intro: [
      "\"I'm bored\" always seems to arrive at the worst time: in a waiting room, on a long drive, or ten minutes before dinner. Some days you need to hand over a phone, and that is fine. The goal is to hand over something worth the time.",
      "Here are 20 ideas for kids ages 5 to 10. The first group uses a screen but teaches something, the second needs nothing but a few minutes and a grown-up, and the third works for car rides and waiting rooms.",
    ],
    sections: [
      {
        id: "screen-smart",
        heading: "5 screen-smart ideas for when you need to hand over the phone",
        blocks: [
          {
            type: "numbered",
            items: [
              {
                title: "Play a case in Cyber Defenders.",
                text: "Each case takes a few minutes and ends with a clear finish. Kids practice what to do about pop-ups, passwords, and tricks. Works for ages 5 to 10.",
              },
              {
                title: "Tap \"Surprise me!\" in Cool Facts.",
                text: "Each tap opens a true fact about games, robots, space, or the people who built them. Kids collect facts and rank up from Curious Kid to Fact Master, and they love to read the best ones out loud.",
              },
              {
                title: "Play True or Made Up?",
                text: "Ten quick statements. The child decides if each one is true, then learns the real answer. It is a good one to turn into a family game after.",
              },
              {
                title: "Plan a pretend show in Make a Show.",
                text: "Your child picks what they are good at, makes a character that looks like them, names a show, and gets three episode ideas. Afterward, ask them to pitch it to you.",
              },
              {
                title: "Be the Helper.",
                text: "A short story game about listening and solving problems for a customer. It teaches what tech sales and customer success people do, in kid words.",
              },
            ],
          },
          {
            type: "note",
            text: "All five are in Tech Journey Jr., our free game. There are no ads and no sign-in, and nothing a child picks is saved. See the checklist in our guide to safe educational games for how we think about this.",
          },
        ],
      },
      {
        id: "screen-free",
        heading: "10 screen-free ideas you can start in a minute",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "Job charades.", text: "Act out a job and let everyone guess: a doctor, a baker, a pilot, a video editor." },
              { title: "Interview a grown-up about their job.", text: "Give your child three questions: What do you do all day? What is the hardest part? What do you like best?" },
              { title: "Invent a helper robot.", text: "Draw a robot that solves a problem in your house. What does it do? What is it called?" },
              { title: "Write a three-episode show plan.", text: "Pick a topic, give the show a name, and write three episode titles on paper." },
              { title: "Tech detective.", text: "Find ten things in the room that have a computer inside them." },
              { title: "Teach me something.", text: "Your child teaches you one thing they know. A good practice for explaining, which is a real skill." },
              { title: "Build a stop-motion scene.", text: "Move a toy a little at a time, taking a picture each time, on a parent's phone." },
              { title: "Make a password of four silly words.", text: "Write the words on paper and talk about why long beats short and tricky." },
              { title: "Draw an app you wish existed.", text: "Sketch the screens. Who would use it, and what problem would it fix?" },
              { title: "Family trivia night.", text: "Read the true facts from our Cool Tech Facts page aloud and have everyone guess before you reveal the answer." },
            ],
          },
        ],
      },
      {
        id: "on-the-go",
        heading: "5 ideas for car rides and waiting rooms",
        blocks: [
          {
            type: "numbered",
            items: [
              { title: "True or made up, out loud.", text: "Take turns saying a statement. The others guess if it is true or made up." },
              { title: "I spy a job.", text: "Spot people doing jobs out the window: a driver, a builder, a crossing guard. What do they do?" },
              { title: "Twenty questions about a career.", text: "One person picks a job. Everyone else asks yes or no questions to guess it." },
              { title: "Tell a story together.", text: "Each person adds one sentence. It is practice for the kind of storytelling creators do." },
              { title: "Name that tech.", text: "Take turns naming things that did not exist when you were a kid, and guess when they were invented." },
            ],
          },
        ],
      },
      {
        id: "tips",
        heading: "Tips that make screen time easier",
        blocks: [
          {
            type: "bullets",
            items: [
              "Pick games with a finish line, like levels or missions, so there is a natural place to stop.",
              "Give a heads-up before time is up, and let the child finish the current round.",
              "Ask one question afterward: what was the best part, or what did you learn?",
              "Put a shortcut on the home screen so your child can open the game in one tap, and use Guided Access (iPhone) or screen pinning (Android) to keep them in it.",
              "Families differ on screen time. The American Academy of Pediatrics encourages every family to make a media plan that fits its own routines.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "What can I give my child on a phone when they are bored?",
        answer:
          "Something with a clear end and a little learning in it. A game with short missions, like Tech Journey Jr., lets a child finish and stop. Skip games that run forever or push ads and purchases.",
      },
      {
        question: "What are good activities for kids in the car?",
        answer:
          "Games that need no screen work well: true or made up, twenty questions about a job, group storytelling, and spotting jobs out the window. For a quiet moment, a phone game with read-aloud and short missions is an option.",
      },
      {
        question: "What are educational things to do when kids are bored at home?",
        answer:
          "Job charades, interviewing a grown-up about their work, inventing a helper robot, planning a pretend show, or looking for the computers hiding inside household objects. All take a few minutes and teach something real.",
      },
      {
        question: "Is there a free game I can hand my child with no ads?",
        answer:
          "Yes. Tech Journey Jr. is free with no ads and no sign-in. It has two versions: Tech Sprouts for ages 5 to 7 and Tech Trailblazers for ages 8 to 10.",
      },
    ],
    related: ["how-to-choose-safe-educational-games", "cool-tech-facts-for-kids"],
    cta: {
      heading: "Have a bored kid right now?",
      text: "Pick an age group and hand over the phone. It is free, with no ads or sign-in, and a world takes about ten minutes.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "cool-tech-facts-for-kids",
    short: "Cool tech facts for kids",
    title: "Cool Tech Facts for Kids: True Facts to Share",
    h1: "Cool Tech Facts for Kids",
    description:
      "True, kid-friendly facts about video games, robots, space, computers, and the internet, from the first YouTube video to a helicopter on Mars. Free to read.",
    eyebrow: "Facts for kids",
    updated: ARTICLES_UPDATED,
    keywords: [
      "cool tech facts for kids",
      "fun facts about technology for kids",
      "computer facts for kids",
      "video game facts for kids",
      "robot facts for kids",
      "fun facts about the internet for kids",
      "true or false facts for kids",
    ],
    blurb: "True facts about games, robots, space, computers, and the internet.",
    intro: [
      "These are the facts kids repeat at lunch. Each one is true and checked against more than one source, and each is written for ages 8 to 10, so younger kids can enjoy them with a grown-up reading along.",
      "Want to play instead of read? The Cool Facts world in Tech Journey Jr. turns them into tap-to-reveal cards, a \"Surprise me!\" button, and a True or Made Up? game, with a ranking system from Curious Kid to Fact Master.",
    ],
    sections: [
      { id: "games", heading: "Video game facts", blocks: [{ type: "facts", groupIds: ["games"] }] },
      { id: "internet", heading: "Internet and phone facts", blocks: [{ type: "facts", groupIds: ["internet"] }] },
      { id: "robots", heading: "Robot and AI facts", blocks: [{ type: "facts", groupIds: ["robots"] }] },
      { id: "space", heading: "Space tech facts", blocks: [{ type: "facts", groupIds: ["space"] }] },
      { id: "computers", heading: "Computer facts", blocks: [{ type: "facts", groupIds: ["computers"] }] },
      { id: "creators", heading: "Creator facts", blocks: [{ type: "facts", groupIds: ["creators"] }] },
      { id: "helpers", heading: "Tech helper facts", blocks: [{ type: "facts", groupIds: ["helpers"] }] },
      { id: "safe", heading: "Stay-safe-online facts", blocks: [{ type: "facts", groupIds: ["safe"] }] },
      {
        id: "more",
        heading: "More facts: the people behind the tech",
        blocks: [
          {
            type: "links",
            items: [
              {
                label: "Black inventors and tech heroes for kids",
                href: "/techjr/black-inventors-and-tech-heroes-for-kids",
                text: "True stories of the engineers, scientists, and inventors who helped build the technology kids use every day.",
              },
              {
                label: "Women in tech and STEM for kids",
                href: "/techjr/women-in-tech-and-stem-for-kids",
                text: "From the first computer programmer to a helicopter on Mars, women who built the future.",
              },
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "What is a fun fact about computers for kids?",
        answer:
          "In 1947, a team found a real moth stuck inside a big computer at Harvard. They taped it into their notebook, and today we still call fixing computer problems debugging.",
      },
      {
        question: "What was the first thing ever sold on eBay?",
        answer:
          "One of the very first things sold on eBay was a broken laser pointer. It sold to a person who collects broken laser pointers.",
      },
      {
        question: "How many facts are in the game?",
        answer:
          "The ages 8 to 10 version of Cool Facts has dozens of facts in twelve groups, and the ages 5 to 7 version has the same kind of facts in simpler words. Kids collect facts and rank up as they go.",
      },
      {
        question: "Are the facts checked?",
        answer:
          "Yes. Each fact was checked against more than one source, and we use careful words like \"one of the first\" when the record is not clear.",
      },
    ],
    related: ["black-inventors-and-tech-heroes-for-kids", "women-in-tech-and-stem-for-kids"],
    cta: {
      heading: "Turn the facts into a game",
      text: "Collect facts, tap Surprise me, and play True or Made Up? It is free, with no ads and no sign-in.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "black-inventors-and-tech-heroes-for-kids",
    short: "Black inventors and tech heroes for kids",
    title: "Black Inventors and Tech Heroes for Kids: True Stories",
    h1: "Black Inventors and Tech Heroes for Kids",
    description:
      "Meet Black inventors, engineers, and scientists behind the tech kids use every day, from GPS to video game cartridges. True stories for ages 5 to 10.",
    eyebrow: "Tech heroes",
    updated: ARTICLES_UPDATED,
    keywords: [
      "black inventors for kids",
      "black inventors in technology for kids",
      "black history month tech heroes for kids",
      "african american inventors facts for kids",
      "black scientists and engineers for kids",
      "black history month activities for elementary",
      "famous black computer scientists for kids",
    ],
    blurb: "True stories of Black inventors, engineers, and scientists behind everyday technology.",
    intro: [
      "Every child should be able to read about someone who looks like them doing something amazing in science and technology. These are true stories of Black inventors, engineers, and scientists whose work is part of the games, phones, maps, and spaceships that kids know today.",
      "Each story has a few simple sentences and a question you can ask your child afterward. The same people also appear in the Cool Facts world of Tech Journey Jr., our free game for ages 5 to 10.",
    ],
    sections: [
      {
        id: "heroes",
        heading: "12 Black inventors and tech heroes",
        blocks: [
          {
            type: "cards",
            items: [
              {
                title: "Katherine Johnson",
                tag: "NASA mathematician",
                text: "She did the math by hand that helped plan space flights. In 1962, astronaut John Glenn asked her to check the computer's numbers before he flew. In 2015, she received the Presidential Medal of Freedom.",
                talk: "Why would an astronaut trust a person to check a computer?",
              },
              {
                title: "Jerry Lawson",
                tag: "Video game engineer",
                text: "In 1976, Jerry Lawson led the team that built a home game system that used game cartridges. Before that, a game system could only play the games built inside it. Cartridges let kids swap games, like swapping books.",
                talk: "What is a game you like to swap or share?",
              },
              {
                title: "Dr. Mark Dean",
                tag: "Computer engineer at IBM",
                text: "He helped invent the IBM PC, a computer many families used at home. He is named on 3 of its first 9 patents, and he was the first Black IBM Fellow.",
                talk: "How is a computer at home different from the giant room-sized ones?",
              },
              {
                title: "Dr. Gladys West",
                tag: "Mathematician",
                text: "She worked on math about the exact shape of the Earth. That work helped lead to GPS, the thing that gives directions in phones and cars. In 2018 she was inducted into the Air Force Space and Missile Pioneers Hall of Fame.",
                talk: "When do you use a map on a phone?",
              },
              {
                title: "Dorothy Vaughan",
                tag: "NASA mathematician and leader",
                text: "When electronic computers arrived at NASA's predecessor, Dorothy Vaughan taught herself to program them and taught her team to do the same. She became the first Black supervisor at the agency that later became NASA.",
                talk: "What is something you taught yourself?",
              },
              {
                title: "Dr. Mae Jemison",
                tag: "Astronaut, doctor, engineer",
                text: "In 1992, she flew on the space shuttle Endeavour and became the first Black woman in space. She was a doctor and an engineer, and she loved science fiction as a kid.",
                talk: "If you could go to space, what would you want to look at first?",
              },
              {
                title: "Dr. Marian Croak",
                tag: "Engineer and inventor",
                text: "She has more than 200 patents. She helped develop technology for internet phone calls, and one of her ideas lets people give money to help others by sending a text message.",
                talk: "How could a text message help someone far away?",
              },
              {
                title: "Joy Buolamwini",
                tag: "Computer scientist",
                text: "She noticed that some face-finding programs missed faces with darker skin. She spoke up, and companies took notice. She started the Algorithmic Justice League to help make technology fair.",
                talk: "What can you do when something is unfair?",
              },
              {
                title: "Kimberly Bryant",
                tag: "Engineer and founder",
                text: "She started Black Girls Code in 2011 because she wanted her daughter, and other girls, to have a place to learn to code.",
                talk: "What would you like to build with code?",
              },
              {
                title: "Mikaila Ulmer",
                tag: "Young entrepreneur",
                text: "When she was 4, she started selling lemonade made with honey to help save bees. Her stand grew into a real company with products in stores.",
                talk: "What problem would you like to help solve?",
              },
              {
                title: "Lewis Latimer",
                tag: "Inventor and draftsman",
                text: "He invented a longer-lasting carbon filament that improved the light bulb, and he drew the patent drawings for Alexander Graham Bell's telephone.",
                talk: "Why does a good drawing matter for a new invention?",
              },
              {
                title: "Garrett Morgan",
                tag: "Inventor",
                text: "In 1923, he patented a traffic signal that added a warning signal between stop and go. Many people say it helped make streets safer.",
                talk: "What would a street look like without traffic lights?",
              },
            ],
          },
        ],
      },
      {
        id: "talk",
        heading: "How to talk about these stories",
        blocks: [
          {
            type: "bullets",
            items: [
              "Read one story at a time. Ask the question at the end and let your child answer in their own words.",
              "Point out the ordinary parts: they were curious, they practiced, and they kept going when it was hard.",
              "Connect it to something your child already enjoys: games, maps, phones, space, or helping others.",
              "Look for people in your own family or community whose jobs involve technology, and ask them about their work.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "Who are some famous Black inventors in technology?",
        answer:
          "Katherine Johnson, Jerry Lawson, Dr. Mark Dean, Dr. Gladys West, Dr. Marian Croak, Lewis Latimer, and Garrett Morgan are a few. Each helped create technology that kids see or use today.",
      },
      {
        question: "What is a good Black History Month activity for elementary kids?",
        answer:
          "Read one story a day, ask the question at the end, and have your child draw or invent something inspired by that person. The Cool Facts world in Tech Journey Jr. also includes several of these people.",
      },
      {
        question: "Who helped make video game cartridges possible?",
        answer:
          "Jerry Lawson, a Black engineer, led the team that built a home game system with game cartridges in 1976. Cartridges let players swap games.",
      },
      {
        question: "Who was the first Black woman in space?",
        answer:
          "Dr. Mae Jemison. She flew on the space shuttle Endeavour in 1992.",
      },
    ],
    related: ["women-in-tech-and-stem-for-kids", "cool-tech-facts-for-kids"],
    cta: {
      heading: "Meet more tech heroes in the game",
      text: "Cool Facts in Tech Journey Jr. has true stories of inventors and builders from many backgrounds. It is free, with no ads and no sign-in.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "women-in-tech-and-stem-for-kids",
    short: "Women in tech and STEM for kids",
    title: "Women in Tech and STEM for Kids: True Stories",
    h1: "Women in Tech and STEM for Kids",
    description:
      "From the first computer programmer to the first woman of color in space, meet women who built the tech kids use every day. True stories for ages 5 to 10.",
    eyebrow: "Tech heroes",
    updated: ARTICLES_UPDATED,
    keywords: [
      "women in tech for kids",
      "women in stem for kids",
      "female computer scientists for kids",
      "women in technology history for kids",
      "famous women in stem for elementary students",
      "women's history month activities for kids",
      "girls who code inspiration for kids",
    ],
    blurb: "True stories of women who programmed, engineered, and explored.",
    intro: [
      "Girls and boys both need to see women in science and technology. These are true stories of women whose work helped create computers, software, space travel, and the internet.",
      "Each story is short, and has a question to ask your child afterward. You can read one at bedtime, in the car, or as part of a Women's History Month project.",
    ],
    sections: [
      {
        id: "stories",
        heading: "14 women who built the future",
        blocks: [
          {
            type: "cards",
            items: [
              {
                title: "Ada Lovelace",
                tag: "Mathematician, England",
                text: "In the 1840s, she wrote steps for a machine that had not been finished yet. Many people call her the first computer programmer.",
                talk: "How can you plan something before you can try it?",
              },
              {
                title: "Grace Hopper",
                tag: "Navy leader and computer scientist",
                text: "She helped make computer code easier for people to read. She gave out pieces of wire about 11.8 inches long to show how far light travels in one billionth of a second.",
                talk: "How long is a billionth of a second? Can you picture it?",
              },
              {
                title: "The six ENIAC programmers",
                tag: "Early computer programmers",
                text: "Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Fran Bilas, and Ruth Lichterman programmed ENIAC, a computer that weighed about 30 tons and filled a room.",
                talk: "What do you think it was like to program a computer as big as a room?",
              },
              {
                title: "Hedy Lamarr",
                tag: "Movie star and inventor",
                text: "She and a partner patented an idea for making radio signals hop between frequencies, which made them harder to block. Ideas like it are used in wireless technology today.",
                talk: "Can someone be good at acting and inventing?",
              },
              {
                title: "Katherine Johnson",
                tag: "NASA mathematician",
                text: "She did the math by hand that helped plan space flights, and astronaut John Glenn asked her to check the computer's numbers before he flew.",
                talk: "Why is it important to check your math?",
              },
              {
                title: "Dorothy Vaughan",
                tag: "NASA mathematician and leader",
                text: "She taught herself to program electronic computers and taught her team to do it too.",
                talk: "What is something you could teach a friend?",
              },
              {
                title: "Margaret Hamilton",
                tag: "Software engineer, MIT",
                text: "She led the team that wrote the code for the Apollo spaceships that went to the Moon. She also helped make the name \"software engineering\" popular.",
                talk: "What could go wrong if a spaceship's code had a mistake?",
              },
              {
                title: "Mary Golda Ross",
                tag: "Cherokee engineer",
                text: "She worked at Lockheed on secret projects in the 1950s, including ideas for travel to other planets. Many people call her the first Native American woman engineer.",
                talk: "If you could plan a trip to another planet, where would you go?",
              },
              {
                title: "Dr. Gladys West",
                tag: "Mathematician",
                text: "Her math about the shape of the Earth helped lead to the GPS in phones and cars.",
                talk: "How does your phone know where you are?",
              },
              {
                title: "Dr. Ellen Ochoa",
                tag: "Engineer and astronaut",
                text: "She earned patents for tools that help computers see. In 1993 she flew on the space shuttle, the first Hispanic woman to go to space, and later she led NASA's Johnson Space Center.",
                talk: "What would you want to invent for space?",
              },
              {
                title: "Dr. Mae Jemison",
                tag: "Astronaut, doctor, engineer",
                text: "In 1992, she flew on the space shuttle Endeavour and became the first Black woman in space.",
                talk: "What would you want to learn about up there?",
              },
              {
                title: "Dr. Fei-Fei Li",
                tag: "Computer scientist, Stanford",
                text: "She and her team made ImageNet, a giant collection of millions of labeled pictures. Computers practiced on it to learn how to see.",
                talk: "How did you learn the names of things when you were little?",
              },
              {
                title: "Dr. Marian Croak",
                tag: "Engineer and inventor",
                text: "She has more than 200 patents. One of her ideas lets people give money to help others by sending a text message.",
                talk: "What problem would you like your invention to solve?",
              },
              {
                title: "Gitanjali Rao",
                tag: "Young inventor",
                text: "In 2020, at age 15, she was named TIME magazine's first Kid of the Year. She invented a tool to test water for lead and an app to help stop online bullying.",
                talk: "What problem in your town could you help with?",
              },
            ],
          },
        ],
      },
      {
        id: "talk",
        heading: "Ideas for Women's History Month",
        blocks: [
          {
            type: "bullets",
            items: [
              "Read one story a day, then ask the question at the end.",
              "Have your child draw a poster of their favorite woman and write one sentence about why she matters.",
              "Interview a woman you know who works with technology, math, or science.",
              "Look up one more person together and add her to your family's list.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "Who was the first computer programmer?",
        answer:
          "Ada Lovelace is often called the first computer programmer. In the 1840s she wrote steps for a machine that had not been finished yet.",
      },
      {
        question: "Who helped write the code for the Moon landing?",
        answer:
          "Margaret Hamilton led the team at MIT that wrote the software for the Apollo spaceships.",
      },
      {
        question: "Who was the first Hispanic woman in space?",
        answer:
          "Dr. Ellen Ochoa. She flew on the space shuttle in 1993 and later led NASA's Johnson Space Center.",
      },
      {
        question: "What are some good STEM role models for girls ages 5 to 10?",
        answer:
          "Ada Lovelace, Grace Hopper, Katherine Johnson, Mae Jemison, Ellen Ochoa, and Gitanjali Rao are a few. Each has a short, true story that kids can follow.",
      },
    ],
    related: ["black-inventors-and-tech-heroes-for-kids", "cool-tech-facts-for-kids"],
    cta: {
      heading: "Meet more builders in the game",
      text: "Cool Facts in Tech Journey Jr. is full of true stories of people who built the tech we use. It is free, with no ads and no sign-in.",
    },
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
