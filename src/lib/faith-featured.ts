// What /faith shows. `pinnedVideo` is the one video on the page: the Jesus story, at the very top. It does not
// change when new videos are posted. Everything below it is reading, arranged on shelves by topic.
//
// To add a new article: write it in faith-writings.ts, then add one line to the right shelf below. The title,
// summary, author, picture and reading time fill themselves in. For a page that is not in faith-writings.ts,
// write the whole entry here. Every video linked here is on the Faith Journey with The Warthens channel.

import { faithWritings, type FaithWritingBlock } from "./faith-writings";
import { audience, dek as ministryDek, lessons as ministryLessons, MINISTRY_PATH, MINISTRY_TITLE } from "./atiya-ministry";

export const pinnedVideo = {
  /** YouTube id, used for the thumbnail. */
  id: "HKWT347dZ3U",
  title: "She Grew Up in Church. I Didn’t. We Both Needed Jesus.",
  blurb: "Why we believe in Jesus: Atiya’s story, Juston’s story, and how we both needed him.",
  href: "/jesus",
  cta: "Read our stories and watch",
};

export type Reading = {
  href: string;
  title: string;
  blurb: string;
  /** What kind of thing it is, such as "Topical study" or "Lesson with worksheet". */
  kind: string;
  cta: string;
  author?: string;
  /** Reading time, only where it is counted from the real text. */
  minutes?: number;
  image?: { src: string; alt: string };
  /** The big card at the top of a shelf, with links straight to its parts. */
  featured?: boolean;
  parts?: { label: string; href: string }[];
};

export type Shelf = {
  id: string;
  /** Short topic name. */
  name: string;
  /** The question this shelf helps a person explore. */
  question: string;
  intro: string;
  /** True when the pieces are meant to be read in order. They are then numbered. */
  inOrder?: boolean;
  items: Reading[];
  more?: { label: string; href: string };
};

const WORDS_PER_MINUTE = 200;
const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;
const toMinutes = (words: number) => Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

function blockWords(block: FaithWritingBlock) {
  return block.type === "chart" ? countWords(`${block.title} ${block.sourceNote}`) : countWords(block.text);
}

function writing(slug: string, kind: string, extra: Partial<Reading> = {}): Reading {
  const w = faithWritings.find((x) => x.slug === slug);
  if (!w) throw new Error(`No faith writing called "${slug}"`);
  return {
    href: `/faith/${w.category}/${w.slug}`,
    title: w.title,
    blurb: w.dek,
    kind,
    cta: "Read it",
    author: w.author,
    minutes: toMinutes(w.body.reduce((sum, block) => sum + blockWords(block), 0)),
    image: w.heroImage,
    ...extra,
  };
}

const ministryWords = [
  ...audience.map((a) => a.text),
  ...ministryLessons.flatMap((lesson) =>
    lesson.blocks.flatMap((block) => (block.kind === "p" ? [block.text] : [...block.passages.map((p) => p.text), block.why])),
  ),
].reduce((sum, text) => sum + countWords(text), 0);

export const shelves: Shelf[] = [
  {
    id: "ministry",
    name: "Ministry and calling",
    question: "How do you serve God without being ruled by people?",
    intro: "For anyone who serves in a local church, has stepped back from serving, or is waiting on someone’s approval to start.",
    items: [
      {
        href: MINISTRY_PATH,
        title: MINISTRY_TITLE,
        blurb: ministryDek,
        kind: "Three lessons",
        cta: "Read all three lessons",
        author: "Atiya Warthen",
        minutes: toMinutes(ministryWords),
        featured: true,
        parts: ministryLessons.map((lesson) => ({ label: lesson.title, href: `${MINISTRY_PATH}#${lesson.id}` })),
      },
      writing("did-paul-wait-14-years-to-preach", "Topical study"),
    ],
  },
  {
    id: "giving",
    name: "Giving and tithing",
    question: "What does Scripture actually say about giving?",
    intro: "Three studies that build on each other. Start with the first.",
    inOrder: true,
    items: [
      writing("is-tithing-biblical", "Topical study"),
      writing("the-widows-mite-in-context", "Topical study"),
      writing("answering-common-tithing-arguments", "Topical study"),
    ],
    more: { label: "All topical studies", href: "/faith/topical-study" },
  },
  {
    id: "trusting-god",
    name: "Trusting God in real life",
    question: "How do you make sense of what is happening to you?",
    intro: "For a hard or confusing season: a Scripture study, a reflection, and a story from our own family.",
    items: [
      {
        href: "/source-of-life",
        title: "Source of Life",
        blurb: "Who is really in control: is good always God, and bad always the devil? A short test, the verses in three acts, and a worksheet for where you are right now.",
        kind: "Scripture study with worksheet",
        cta: "Start the study",
      },
      writing("this-thing-is-spiritual", "Reflection"),
      {
        href: "/magnets",
        title: "Our Kids Swallowed Magnets. This Is How We Trusted God.",
        blurb: "Our story of trusting God when we could not control the outcome, plus what every parent should know about magnetic beads.",
        kind: "Our story, with video",
        cta: "Read the story",
      },
    ],
    more: { label: "All reflections", href: "/faith/reflections" },
  },
  {
    id: "men-and-women",
    name: "For men and for women",
    question: "Where can you go deeper?",
    intro: "A lesson to work through for men, and a Bible study community for women.",
    items: [
      {
        href: "/faith/present-but-missing",
        title: "Present but Missing",
        blurb: "For men, on providing everything but yourself. Follow the Scripture, write your notes, and email yourself a PDF.",
        kind: "For men: lesson with worksheet",
        cta: "Start the lesson",
      },
      {
        href: "/faith/women-who-seek",
        title: "Women Who Seek",
        blurb: "Finding Jesus in the Scriptures, hosted by Atiya. Open to any woman, wherever she is in her journey with Jesus.",
        kind: "For women: Bible study community",
        cta: "Visit Women Who Seek",
      },
    ],
  },
];
