import type { CoolFact, FactGroup } from "./career-day";

// More Cool Facts. The first group list for each age group (in career-day.ts and play-little.ts)
// keeps the original facts; the groups here are added around them by play-content.ts.
// Every fact was checked against more than one source. Claims stay plain: "one of the first",
// never "the first ever", unless the record is clear.
//
// Ages 5 to 7 use first-grade words and short sentences. Ages 8 to 10 can hold a little more.

/* ------------------------------------------------------------------ */
/* Ages 8 to 10                                                        */
/* ------------------------------------------------------------------ */

// Extra facts folded into groups that already exist.
export const bigExtraFacts: Record<string, CoolFact[]> = {
  heroes: [
    {
      id: "hopper",
      emoji: "⏱️",
      hook: "Who handed out pieces of wire to show how fast a computer thinks?",
      answer:
        "Grace Hopper, a Navy leader and computer scientist. Her wire was about 11.8 inches long. That is how far light travels in one billionth of a second. She helped make computer code easier to read.",
    },
    {
      id: "hamilton",
      emoji: "🌙",
      hook: "Who led the team that wrote the code for the Moon landing?",
      answer:
        "Margaret Hamilton, a computer scientist at MIT. Her team wrote the software for the Apollo spaceships. She also helped make the name “software engineering” popular.",
    },
  ],
};

export const bigNewGroups: FactGroup[] = [
  {
    id: "games",
    emoji: "🎮",
    title: "Game Time",
    blurb: "Fun facts about video games",
    facts: [
      {
        id: "pacman",
        emoji: "🟡",
        hook: "What did the Pac-Man creator say gave him the idea?",
        answer:
          "A pizza with a slice missing! Toru Iwatani said that is what Pac-Man looks like. The game came out in 1980 and became a huge hit.",
      },
      {
        id: "mario",
        emoji: "🍄",
        hook: "What was Mario called before he was Mario?",
        answer:
          "Jumpman! He first showed up in the game Donkey Kong in 1981. Later he got his new name from a real person named Mario Segale, who owned a building the game company used.",
      },
      {
        id: "tetris",
        emoji: "🧱",
        hook: "Who made Tetris?",
        answer:
          "Alexey Pajitnov, a computer engineer in the Soviet Union. He made it in 1984 for fun. Now people all over the world play it.",
      },
      {
        id: "minecraft",
        emoji: "⛏️",
        hook: "How did Minecraft get started?",
        answer:
          "A programmer named Markus Persson made the first version on his own in 2009. Millions of people play it now. It is one of the best-selling games ever made.",
      },
    ],
  },
  {
    id: "internet",
    emoji: "📱",
    title: "Internet & Phones",
    blurb: "How the web and phones got started",
    facts: [
      {
        id: "website",
        emoji: "🌐",
        hook: "When did the very first website go up?",
        answer:
          "Around 1991. A scientist named Tim Berners-Lee built it at a lab called CERN. It was just words that explained what the World Wide Web was.",
      },
      {
        id: "text",
        emoji: "💬",
        hook: "What did the first text message say?",
        answer:
          "“Merry Christmas.” An engineer named Neil Papworth sent it in December 1992. He typed it on a computer, because phones did not have keyboards for texting yet.",
      },
      {
        id: "google",
        emoji: "🔎",
        hook: "Where does the name Google come from?",
        answer:
          "A math word, googol. A googol is a 1 with 100 zeros after it. The founders picked a play on that word because they wanted to organize a huge amount of information.",
      },
      {
        id: "mouse",
        emoji: "🖱️",
        hook: "What was the first computer mouse made of?",
        answer:
          "Wood! Douglas Engelbart and his team built it in the 1960s. It was a little wooden box with a button and wheels.",
      },
      {
        id: "cellphone",
        emoji: "📞",
        hook: "How heavy was the first cell phone?",
        answer:
          "More than 2 pounds, like a big brick! Martin Cooper made the first call on one in 1973. It was so big you could not put it in a pocket.",
      },
      {
        id: "wifi",
        emoji: "📶",
        hook: "Does Wi-Fi stand for something?",
        answer:
          "Nope! It is just a catchy name. Lots of people think it means “wireless fidelity,” but that is a myth.",
      },
    ],
  },
  {
    id: "robots",
    emoji: "🤖",
    title: "Robots & AI",
    blurb: "Machines that move and learn",
    facts: [
      {
        id: "robotword",
        emoji: "📖",
        hook: "Where does the word “robot” come from?",
        answer:
          "A play from 1920 by a writer named Karel Čapek. In Czech, the word robota means hard work. The word spread around the world after that.",
      },
      {
        id: "deepblue",
        emoji: "♟️",
        hook: "When did a computer first win a match against a world chess champion?",
        answer:
          "In 1997! A computer called Deep Blue beat Garry Kasparov in a six-game match. It made people ask big questions about what computers can do.",
      },
      {
        id: "ingenuity",
        emoji: "🚁",
        hook: "Has a helicopter ever flown on another planet?",
        answer:
          "Yes! A small helicopter named Ingenuity flew on Mars in 2021. It rode there on the rover Perseverance. It was the first aircraft to fly on another planet.",
      },
      {
        id: "imagenet",
        emoji: "🖼️",
        hook: "How do computers learn to see?",
        answer:
          "By looking at lots and lots of pictures. Dr. Fei-Fei Li and her team made ImageNet, a giant collection of millions of labeled pictures. Computers practiced on it.",
      },
      {
        id: "aljazari",
        emoji: "⚙️",
        hook: "Who built machines that moved by themselves 800 years ago?",
        answer:
          "Al-Jazari, an inventor in the Middle East. He built clocks, water machines, and even a robot-like servant that could pour drinks. He wrote a book with pictures of his inventions.",
      },
    ],
  },
  {
    id: "space",
    emoji: "🚀",
    title: "Space Tech",
    blurb: "Computers and rockets",
    facts: [
      {
        id: "apollo",
        emoji: "🌕",
        hook: "How strong was the computer that helped land on the Moon?",
        answer:
          "A lot weaker than the phone in your pocket! The Apollo computer from 1969 was small and slow. But smart people wrote careful code, and it worked.",
      },
      {
        id: "voyager",
        emoji: "🛸",
        hook: "What is the farthest thing people ever sent from Earth?",
        answer:
          "Voyager 1! It launched in 1977 and is still flying through space. It carries a golden record with sounds, pictures, and hellos in 55 languages.",
      },
      {
        id: "iss",
        emoji: "🛰️",
        hook: "How many sunrises do astronauts on the space station see in a day?",
        answer:
          "About 16! The International Space Station zooms around Earth about every 90 minutes. People have lived on it nonstop since the year 2000.",
      },
    ],
  },
  {
    id: "computers",
    emoji: "🖥️",
    title: "Computer Facts",
    blurb: "How computers really work",
    facts: [
      {
        id: "eniac",
        emoji: "🏢",
        hook: "How big were the first computers?",
        answer:
          "As big as a room! A computer called ENIAC weighed about 30 tons. Six women programmed it: Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Fran Bilas, and Ruth Lichterman.",
      },
      {
        id: "binary",
        emoji: "0️⃣",
        hook: "What language do computers really speak?",
        answer:
          "Just two numbers: 0 and 1. It is called binary. Lots of tiny switches are either off (0) or on (1), and together they make everything on a screen.",
      },
      {
        id: "cloud",
        emoji: "☁️",
        hook: "Where is “the cloud”?",
        answer:
          "Not in the sky! The cloud is really giant buildings full of computers called data centers. When you save a photo to the cloud, it goes to one of those computers.",
      },
      {
        id: "billion",
        emoji: "🔢",
        hook: "How long would it take to count to a billion?",
        answer:
          "About 31 years, if you counted one number every second and never stopped to sleep! Computers can do billions of tiny jobs in just one second.",
      },
    ],
  },
  {
    id: "safe",
    emoji: "🛡️",
    title: "Stay Safe Online",
    blurb: "Where tricky words come from",
    facts: [
      {
        id: "phishing",
        emoji: "🎣",
        hook: "Why is a trick message called “phishing”?",
        answer:
          "It sounds like fishing! A bad guy sends out a message as bait and hopes someone bites. If a message feels odd or pushy, show a grown-up.",
      },
      {
        id: "spam",
        emoji: "📧",
        hook: "Why is junk email called “spam”?",
        answer:
          "Many people say it comes from a funny old comedy sketch where the word Spam is said over and over and over. Junk email shows up again and again, too.",
      },
      {
        id: "longpass",
        emoji: "🔑",
        hook: "Why is a long password stronger than a short one?",
        answer:
          "Every extra letter makes it many times harder to guess. A silly sentence that is long but easy for you to remember beats a short, tricky one.",
      },
    ],
  },
  {
    id: "world",
    emoji: "🌍",
    title: "Builders Around the World",
    blurb: "Ideas that came from many places",
    facts: [
      {
        id: "algorithm",
        emoji: "📜",
        hook: "Where does the word “algorithm” come from?",
        answer:
          "From the name of a mathematician who lived about 1,200 years ago, al-Khwarizmi. He worked in Baghdad and wrote about step-by-step ways to solve math. An algorithm is a set of steps, like a recipe.",
      },
      {
        id: "vonahn",
        emoji: "🧩",
        hook: "Who invented puzzles that check you are not a robot?",
        answer:
          "Luis von Ahn, who grew up in Guatemala. He helped invent CAPTCHA, the wiggly letters you sometimes type to prove you are a person. He also started Duolingo.",
      },
      {
        id: "bhatt",
        emoji: "🔌",
        hook: "Who helped invent USB?",
        answer:
          "Ajay Bhatt, an engineer born in India. USB is the plug on lots of chargers and computers. Before it, every gadget needed its own kind of plug.",
      },
      {
        id: "emtage",
        emoji: "🔍",
        hook: "Who made one of the first ways to search the internet?",
        answer:
          "Alan Emtage, a student from Barbados. In 1990 at a college in Canada he built a tool called Archie. Many people call it the first internet search engine.",
      },
      {
        id: "ross",
        emoji: "✈️",
        hook: "Who helped plan trips to other planets in the 1950s?",
        answer:
          "Mary Golda Ross, a Cherokee engineer. She worked at a company called Lockheed on secret projects and wrote about how spaceships could fly to other planets. Many people call her the first Native American woman engineer.",
      },
    ],
  },
  {
    id: "lift",
    emoji: "💪",
    title: "Speak Up & Build",
    blurb: "People who made tech fairer and better",
    facts: [
      {
        id: "buolamwini",
        emoji: "🪞",
        hook: "Who noticed that some face-finding programs missed dark skin?",
        answer:
          "Joy Buolamwini, a computer scientist. She saw that some programs could not find her face unless she wore a white mask. She spoke up, and companies took notice.",
      },
      {
        id: "jemison",
        emoji: "👩🏾‍🚀",
        hook: "Who was the first Black woman to fly in space?",
        answer:
          "Dr. Mae Jemison. She was a doctor and an engineer. She flew on the space shuttle Endeavour in 1992. She loved science fiction as a kid.",
      },
      {
        id: "west",
        emoji: "🧭",
        hook: "Whose math helped make GPS maps possible?",
        answer:
          "Dr. Gladys West, a Black mathematician. She worked on math about the exact shape of the Earth. That work helped lead to the GPS in phones and cars.",
      },
      {
        id: "vaughan",
        emoji: "👩🏾‍💼",
        hook: "Who taught herself a new computer language to lead her team?",
        answer:
          "Dorothy Vaughan, a Black mathematician at NASA. When electronic computers showed up, she learned to program them and taught her team to do it too.",
      },
      {
        id: "croak",
        emoji: "📲",
        hook: "Who helped invent internet phone calls and giving by text?",
        answer:
          "Dr. Marian Croak, a Black engineer. She has more than 200 patents. One of her ideas lets people give money to help others by sending a text message.",
      },
      {
        id: "bryant",
        emoji: "👩🏿‍💻",
        hook: "Who started Black Girls Code?",
        answer:
          "Kimberly Bryant, an engineer. She wanted her daughter and other girls to have a place to learn to code. She started the group in 2011.",
      },
    ],
  },
  {
    id: "kids",
    emoji: "🧒🏽",
    title: "Kid Inventors",
    blurb: "Young people who made big things",
    facts: [
      {
        id: "braille",
        emoji: "⠿",
        hook: "Who invented braille when he was just 15?",
        answer:
          "Louis Braille, a boy in France who was blind. He made a way to read with raised dots. People who are blind still use braille today.",
      },
      {
        id: "rao",
        emoji: "💧",
        hook: "Who was TIME magazine’s first-ever Kid of the Year?",
        answer:
          "Gitanjali Rao! In 2020 she was 15. She invented a tool to test water for lead and an app to help stop online bullying.",
      },
      {
        id: "nay",
        emoji: "🫧",
        hook: "Which 14-year-old made a game that hit number one?",
        answer:
          "Robert Nay made Bubble Ball. He taught himself to code. In 2011 his free game reached number one on the iPhone free-app chart, ahead of Angry Birds.",
      },
      {
        id: "ulmer",
        emoji: "🐝",
        hook: "Who started a lemonade business at 4 to help bees?",
        answer:
          "Mikaila Ulmer from Texas! After a bee stung her, she learned how much bees help us. She started selling lemonade made with honey, and it grew into a real company.",
      },
      {
        id: "popsicle",
        emoji: "🍧",
        hook: "Who invented the Popsicle?",
        answer:
          "An 11-year-old named Frank Epperson, in 1905! He left a drink with a stirring stick outside on a freezing night. In the morning it was frozen into a treat.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Ages 5 to 7                                                         */
/* ------------------------------------------------------------------ */

export const littleExtraFacts: Record<string, CoolFact[]> = {
  heroes: [
    {
      id: "hopper",
      emoji: "⏱️",
      hook: "Who made computer code easier to read?",
      answer:
        "Grace Hopper. She worked in the Navy. She helped computers understand words that people can read.",
    },
    {
      id: "jemison",
      emoji: "👩🏾‍🚀",
      hook: "Who was the first Black woman in space?",
      answer: "Dr. Mae Jemison! She is a doctor and an engineer. She flew in a space shuttle in 1992.",
    },
  ],
};

export const littleNewGroups: FactGroup[] = [
  {
    id: "games",
    emoji: "🎮",
    title: "Game Time",
    blurb: "Fun facts about games",
    facts: [
      {
        id: "pacman",
        emoji: "🟡",
        hook: "What gave the Pac-Man maker his idea?",
        answer: "A pizza with a slice gone! Pac-Man looks just like it.",
      },
      {
        id: "mario",
        emoji: "🍄",
        hook: "What was Mario called at first?",
        answer: "Jumpman! He got a new name later. Now he is Mario.",
      },
      {
        id: "tetris",
        emoji: "🧱",
        hook: "Who made Tetris?",
        answer: "Alexey Pajitnov made it in 1984. He made it for fun. Now kids all over the world play it.",
      },
    ],
  },
  {
    id: "internet",
    emoji: "📱",
    title: "Phones & Web",
    blurb: "How the web got started",
    facts: [
      {
        id: "text",
        emoji: "💬",
        hook: "What did the first text message say?",
        answer: "“Merry Christmas!” It was sent in 1992.",
      },
      {
        id: "mouse",
        emoji: "🖱️",
        hook: "What was the first computer mouse made of?",
        answer: "Wood! It was a little wooden box with a button.",
      },
      {
        id: "cloud",
        emoji: "☁️",
        hook: "Where is “the cloud”?",
        answer: "Not in the sky! It is big buildings full of computers.",
      },
    ],
  },
  {
    id: "robots",
    emoji: "🤖",
    title: "Robots & Space",
    blurb: "Machines that move and fly",
    facts: [
      {
        id: "robotword",
        emoji: "📖",
        hook: "Where does the word “robot” come from?",
        answer: "From a play in 1920. The word means hard work.",
      },
      {
        id: "ingenuity",
        emoji: "🚁",
        hook: "Did a helicopter ever fly on Mars?",
        answer: "Yes! A little helicopter named Ingenuity flew on Mars in 2021.",
      },
      {
        id: "voyager",
        emoji: "🛸",
        hook: "What is the farthest thing people sent into space?",
        answer: "Voyager 1! It has a golden record with hello in 55 languages.",
      },
    ],
  },
  {
    id: "computers",
    emoji: "🖥️",
    title: "Computer Facts",
    blurb: "How computers work",
    facts: [
      {
        id: "eniac",
        emoji: "🏢",
        hook: "How big were the first computers?",
        answer: "As big as a room! Six women learned to program one.",
      },
      {
        id: "binary",
        emoji: "0️⃣",
        hook: "What do computers use to think?",
        answer: "Just two numbers, 0 and 1! Tiny switches are off or on.",
      },
    ],
  },
  {
    id: "world",
    emoji: "🌍",
    title: "Builders Around the World",
    blurb: "Ideas from many places",
    facts: [
      {
        id: "vonahn",
        emoji: "🧩",
        hook: "Who made puzzles that check you are not a robot?",
        answer: "Luis von Ahn. He grew up in Guatemala. He also made an app to learn languages.",
      },
      {
        id: "bhatt",
        emoji: "🔌",
        hook: "Who helped invent USB?",
        answer: "Ajay Bhatt, an engineer born in India. USB is a plug on many chargers.",
      },
      {
        id: "ross",
        emoji: "✈️",
        hook: "Who helped plan trips to space?",
        answer: "Mary Golda Ross. She is Cherokee. She was an engineer who worked on space ideas.",
      },
    ],
  },
  {
    id: "lift",
    emoji: "💪",
    title: "Speak Up & Build",
    blurb: "People who made tech better",
    facts: [
      {
        id: "west",
        emoji: "🧭",
        hook: "Whose math helped make phone maps work?",
        answer: "Dr. Gladys West. She is a Black math whiz. Her math helped make GPS.",
      },
      {
        id: "buolamwini",
        emoji: "🪞",
        hook: "Who spoke up when a computer could not find her face?",
        answer: "Joy Buolamwini. She spoke up. Then people worked to fix it. Speaking up helps!",
      },
    ],
  },
  {
    id: "kids",
    emoji: "🧒🏽",
    title: "Kid Inventors",
    blurb: "Kids who made big things",
    facts: [
      {
        id: "braille",
        emoji: "⠿",
        hook: "Which kid made braille?",
        answer: "Louis Braille! He was 15. He was blind. He made dots that people can read with their fingers.",
      },
      {
        id: "ulmer",
        emoji: "🐝",
        hook: "Who made lemonade to help bees?",
        answer: "Mikaila Ulmer! She was 4. Now her lemonade is in stores.",
      },
      {
        id: "popsicle",
        emoji: "🍧",
        hook: "Who made the Popsicle?",
        answer: "A kid named Frank! He was 11. He left a drink outside. It froze into a treat.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* True or Made-Up? A quick game: the child decides.                    */
/* ------------------------------------------------------------------ */

export type FactCheck = {
  id: string;
  emoji: string;
  statement: string;
  isTrue: boolean;
  because: string;
};

export const bigFactChecks: FactCheck[] = [
  {
    id: "c-moth",
    emoji: "🐛",
    statement: "A real moth was once found stuck inside a computer.",
    isTrue: true,
    because: "True! In 1947 a team taped a moth into their notebook. That is why fixing computer problems is called debugging.",
  },
  {
    id: "c-cloud",
    emoji: "☁️",
    statement: "“The cloud” is a computer floating up in the sky.",
    isTrue: false,
    because: "Made up! The cloud is giant buildings full of computers, called data centers, right here on the ground.",
  },
  {
    id: "c-mouse",
    emoji: "🖱️",
    statement: "The very first computer mouse was made of wood.",
    isTrue: true,
    because: "True! Douglas Engelbart’s team built it as a wooden box with a button.",
  },
  {
    id: "c-wifi",
    emoji: "📶",
    statement: "Wi-Fi is short for “Wireless Fidelity.”",
    isTrue: false,
    because: "Made up! Wi-Fi is just a catchy name. It does not stand for anything.",
  },
  {
    id: "c-mars",
    emoji: "🚁",
    statement: "A helicopter has flown on the planet Mars.",
    isTrue: true,
    because: "True! A little helicopter named Ingenuity flew on Mars in 2021.",
  },
  {
    id: "c-pacman",
    emoji: "🟡",
    statement: "Pac-Man was named after a real kid called Pac.",
    isTrue: false,
    because: "Made up! The maker said the idea came from a pizza with a slice missing.",
  },
  {
    id: "c-braille",
    emoji: "⠿",
    statement: "A 15-year-old invented braille, the dots that blind people read with their fingers.",
    isTrue: true,
    because: "True! Louis Braille did it in France. People still use braille today.",
  },
  {
    id: "c-count",
    emoji: "🔢",
    statement: "You could count to a billion in one afternoon.",
    isTrue: false,
    because: "Made up! Counting one number each second would take about 31 years.",
  },
  {
    id: "c-text",
    emoji: "💬",
    statement: "The first text message ever sent said “Merry Christmas.”",
    isTrue: true,
    because: "True! It was sent in December 1992.",
  },
  {
    id: "c-binary",
    emoji: "0️⃣",
    statement: "Computers use only two numbers inside: 0 and 1.",
    isTrue: true,
    because: "True! It is called binary. Tiny switches are off (0) or on (1).",
  },
];

export const littleFactChecks: FactCheck[] = [
  {
    id: "c-moth",
    emoji: "🐛",
    statement: "A real bug got stuck in a computer.",
    isTrue: true,
    because: "True! It was a moth. That was in 1947.",
  },
  {
    id: "c-cloud",
    emoji: "☁️",
    statement: "“The cloud” is a computer in the sky.",
    isTrue: false,
    because: "Made up! The cloud is big buildings full of computers.",
  },
  {
    id: "c-mouse",
    emoji: "🖱️",
    statement: "The first computer mouse was made of wood.",
    isTrue: true,
    because: "True! It was a little wooden box.",
  },
  {
    id: "c-mars",
    emoji: "🚁",
    statement: "A helicopter flew on Mars.",
    isTrue: true,
    because: "True! It was named Ingenuity.",
  },
  {
    id: "c-pacman",
    emoji: "🟡",
    statement: "Pac-Man looks like a pizza with a slice gone.",
    isTrue: true,
    because: "True! That gave the maker his idea.",
  },
  {
    id: "c-cow",
    emoji: "🐄",
    statement: "The first YouTube video was about a cow.",
    isTrue: false,
    because: "Made up! It was about elephants at a zoo.",
  },
  {
    id: "c-braille",
    emoji: "⠿",
    statement: "A kid made braille. It is dots you read with your fingers.",
    isTrue: true,
    because: "True! Louis Braille was 15.",
  },
  {
    id: "c-tetris",
    emoji: "🧱",
    statement: "A robot made the game Tetris.",
    isTrue: false,
    because: "Made up! A person named Alexey Pajitnov made it.",
  },
  {
    id: "c-text",
    emoji: "💬",
    statement: "The first text message said “Merry Christmas.”",
    isTrue: true,
    because: "True! It was sent in 1992.",
  },
  {
    id: "c-hi",
    emoji: "👋",
    statement: "The first text message said “Hi Mom.”",
    isTrue: false,
    because: "Made up! It said “Merry Christmas.”",
  },
];

/* ------------------------------------------------------------------ */
/* Words said aloud, so recorded clips can be made for all of it.      */
/* ------------------------------------------------------------------ */

export const factCheckSpoken = (c: FactCheck) => `${c.statement} True or made up?`;
export const factCheckAnswerSpoken = (c: FactCheck) => c.because;
