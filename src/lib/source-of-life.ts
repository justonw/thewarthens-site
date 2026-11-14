import { verses, type Verse } from "./source-of-life-verses";

export const PAGE_PATH = "/source-of-life";
export const PAGE_TITLE = "Source of Life";
export const PAGE_TAGLINE = "Praise Him anyway.";
export const PAGE_PUBLISHED = "2026-11-14";
export const PAGE_MODIFIED = "2026-11-14";

export const seoTitle = "Is Good Always God and Bad Always the Devil? | The Warthens";
export const seoDescription =
  "Is everything good from God and everything bad from the devil? A Scripture study on who is really in control, and why you can praise God anyway.";

// A plain, quotable answer near the top of the page. Written to be read on its own.
export const shortAnswer =
  "No. Something that feels good is not automatically from God, and something that feels bad is not automatically the devil. What we call good and bad comes from our own paradigm. Scripture shows that God is in control of all of it, that the devil is a real but limited adversary who is not His equal, and that our own choices and a broken world play a part too. So in the good and in the bad, I can come to the Father by the blood of Jesus and praise Him anyway.";

export const seoKeywords = [
  "is everything good from God and everything bad from the devil",
  "is the devil responsible for everything bad",
  "does God allow evil bible verses",
  "is God in control of everything",
  "Isaiah 45:7 meaning",
  "Amos 3:6 meaning",
  "God and the devil are not equal",
  "praise God in all circumstances",
  "Bible verses God is in control",
  "why does God allow suffering",
];

// What shows when the link is shared: the promise, not the document's name.
export const shareTitle = "Good Is Not Always God. “Bad” Is Not Always the Devil.";
export const shareDescription =
  "A Scripture-by-Scripture look at who is really in control, and why you can praise God anyway.";

export type Section = {
  id: string;
  act: 1 | 2 | 3;
  title: string;
  take: string;
  /** Refs shown large and open. Everything else sits in the "see all" drawer. */
  featured: string[];
  note?: string;
};

export type Act = {
  number: 1 | 2 | 3;
  name: string;
  line: string;
  intro: string;
};

export const acts: Act[] = [
  {
    number: 1,
    name: "Know Him",
    line: "Who is the source?",
    intro:
      "Before we ask what God allows, we have to know who He is. Everything on this page rests on these first verses.",
  },
  {
    number: 2,
    name: "See Him",
    line: "Where is He in the good, the bad, and the evil?",
    intro:
      "This is the part that challenges how many of us were taught. I am not saying every hard thing is a punishment, and I am not saying the devil is not real. I am asking what Scripture says about who is behind what we perceive as good, bad, and evil. If you are in a hard season right now, you can start with the hurting path instead.",
  },
  {
    number: 3,
    name: "Come to Him",
    line: "What do we do with it?",
    intro:
      "Understanding is not the goal. Coming to the Father is. Once we see that God is in control, the response is not fear. It is to submit to Him first, come to the Father by the blood of Jesus, and resist the enemy from there.",
  },
];

// "take" is our short framing for each section, written from the author's notes. Scripture is
// always shown in its own style so a reader can tell the Bible from our perspective.
export const sections: Section[] = [
  {
    id: "source",
    act: 1,
    title: "God is the source of life and creator of all",
    take: "Everything that exists came from Him, came through Him, and exists for Him. That includes what we like and what we do not. Start here, because every other section grows out of it.",
    featured: ["Romans 11:36", "Revelation 4:11", "Acts 17:24", "Acts 17:25", "Psalm 89:11"],
  },
  {
    id: "jesus",
    act: 1,
    title: "Jesus is God",
    take: "The source did not stay far away. The Word became flesh. When we say we come to the Father by the blood of Jesus, we are coming to the same God who made all things.",
    featured: ["John 1:1-3", "John 8:58", "Isaiah 9:6", "Colossians 1:12-16", "Hebrews 12:2"],
  },
  {
    id: "head",
    act: 1,
    title: "Christ is the head over every power",
    take: "Thrones, dominions, principalities, and powers were created by Christ and for Christ. Nothing in the unseen world sits outside His authority, so nothing in your life sits outside His knowledge.",
    featured: ["Colossians 2:10", "Ephesians 1:21-22", "Colossians 2:9"],
  },
  {
    id: "evil",
    act: 2,
    title: "Even calamity and evil do not happen outside God’s awareness",
    take: "God and the devil are not equal. The adversary is real, and Scripture shows him needing permission before he can touch what belongs to God. These verses show that hard events, even what looks like evil, never fall outside God’s awareness. How far His involvement goes, whether He causes, allows, or uses, is where faithful Christians differ, so I hold it humbly. I do not believe He is the author of sin.",
    featured: ["Isaiah 45:7", "Amos 3:6", "Lamentations 3:37-40", "1 Samuel 2:6-7", "Acts 4:27-28"],
    note: "A note on the word “evil.” In Isaiah 45:7 and Amos 3:6 the Hebrew word usually means calamity, trouble, or disaster, set against peace. Newer translations such as the NASB and ESV read “calamity” or “disaster.” The same Hebrew word can mean moral evil in other places, so context decides. I read these verses mainly as: hard events do not fall outside God’s awareness.",
  },
  {
    id: "wicked",
    act: 2,
    title: "What God issues to the wicked",
    take: "Scripture also shows God judging. Some hard things come because a person, a family, or a nation turned from Him. This is where accountability meets sovereignty, and why I am asked to examine my own ways.",
    featured: ["Deuteronomy 32:39", "Daniel 9:14", "Proverbs 3:33", "Job 20:29", "1 Kings 22:19-23"],
  },
  {
    id: "trials",
    act: 2,
    title: "God uses trials for good",
    take: "Joseph told his brothers that God sent him ahead of them to preserve life. The thing meant for harm became the thing used to save. These are the verses we hold when we cannot yet see the good.",
    featured: ["Genesis 45:5", "Job 1:8", "Jonah 1:4"],
  },
  {
    id: "recognize",
    act: 3,
    title: "Recognize it is Him",
    take: "David said, because thou didst it. Naming where something came from changes how we pray. We stop arguing with the wrong enemy and start talking to our Father.",
    featured: ["Isaiah 42:24", "Psalm 39:9-10", "Psalm 40:17", "Colossians 2:13-15"],
  },
  {
    id: "david",
    act: 3,
    title: "David acknowledged the affliction, then asked God for help",
    take: "Notice the order. David did not hide the pain, and he did not pretend it came from nowhere. He named it, and then he cried out: make haste to help me, O Lord my salvation.",
    featured: ["Psalm 38:1-3, 22", "Psalm 88:6-7", "Psalm 69:26"],
  },
  {
    id: "acknowledge",
    act: 3,
    title: "Acknowledge Him",
    take: "Peace, trust, thanksgiving, and help all follow acknowledgment. This is the turn from understanding what happened to leaning on the One who is in control of it.",
    featured: ["Isaiah 26:3", "Proverbs 3:6", "Psalm 119:75", "Psalm 138:8", "Ephesians 2:4-5", "Isaiah 45:22"],
  },
  {
    id: "meekness",
    act: 3,
    title: "Meekness: accepting His dealings without resisting",
    take: "The Greek word is praotes. Thayer glosses it as mildness of disposition and gentleness of spirit. In my words: meekness toward God is trusting that what He does is good, and not disputing or resisting it. It is the opposite of self-assertion, it comes from trusting His goodness and His control, and Scripture calls it a fruit of the Spirit, not a work of the human will.",
    featured: ["Galatians 5:22-23"],
  },
  {
    id: "control",
    act: 3,
    title: "God is in control",
    take: "The joy of a people, the order of every day, the hearts of kings: all of it is in His hands. Our part includes ruling our own spirit.",
    featured: ["Ezra 6:22", "Psalm 119:91", "Proverbs 25:28"],
  },
  {
    id: "understand",
    act: 3,
    title: "Who can understand God?",
    take: "We will not understand all of it, and Scripture says so. That is not a reason to stop. It is a reason to worship.",
    featured: ["Romans 11:33-34", "Isaiah 55:8-9", "1 Corinthians 2:16"],
  },
];

// Added by us for the questions and hurting sections. Not part of the original document.
export const extraSections = [
  { id: "foundation", title: "The foundation (added)" },
  { id: "questions", title: "Honest questions (added)" },
  { id: "hurting", title: "If you are hurting (added)" },
];

export const sectionTitles: Record<string, string> = Object.fromEntries(
  [...sections, ...extraSections].map((s) => [s.id, s.title])
);

export function versesFor(sectionId: string): Verse[] {
  return verses.filter((v) => v.section === sectionId);
}

export function verseByRef(sectionId: string, ref: string): Verse {
  const v = verses.find((x) => x.section === sectionId && x.ref === ref);
  if (!v) throw new Error(`Missing verse ${ref} in ${sectionId}`);
  return v;
}

// Two verses open by default so a section never overwhelms. Everything else sits in the drawer.
const OPEN_BY_DEFAULT = 2;

export function featuredFor(section: Section): Verse[] {
  return section.featured.slice(0, OPEN_BY_DEFAULT).map((ref) => verseByRef(section.id, ref));
}

export function restFor(section: Section): Verse[] {
  const shown = new Set(section.featured.slice(0, OPEN_BY_DEFAULT));
  return versesFor(section.id).filter((v) => !shown.has(v.ref));
}

export const documentVerseCount = verses.filter((v) => !v.added).length;

// ---------- the paradigm test ----------

export type Pick = "god" | "devil" | "me" | "unsure";

export const situations: string[] = [
  "You get the job you have been praying for.",
  "You lose your job without warning.",
  "A friend you trusted betrays you.",
  "You make a bad money decision and feel the consequences.",
  "A medical scare turns out to be nothing.",
  "A door you were sure God would open closes.",
  "You narrowly avoid a serious accident.",
];

export const pickLabels: Record<Pick, string> = {
  god: "God",
  devil: "The devil",
  me: "Me and my choices",
  unsure: "I’m not sure",
};

// ---------- honest questions ----------

export type Faq = {
  question: string;
  answer: string;
  refs: { section: string; ref: string }[];
};

export const faq: Faq[] = [
  {
    question: "Does this make God the author of sin?",
    answer:
      "I do not believe so. Scripture says God cannot be tempted with evil and tempts no one, that in Him is no darkness at all, and that His eyes are too pure to look on iniquity. Of some evil acts He says they never came into His mind. Scripture also says He is sovereign over what He allows, even through people who intend harm. Joseph’s brothers meant it for evil and God meant it for good, and the cross was by God’s plan and still carried out by wicked hands that are held responsible. My own wording is that God allows it, uses it, and is not the author of the sin. I do not claim to have the whole picture, and thoughtful Christians land in different places on how far His involvement goes.",
    refs: [
      { section: "questions", ref: "James 1:13" },
      { section: "questions", ref: "1 John 1:5" },
      { section: "questions", ref: "Habakkuk 1:13" },
      { section: "questions", ref: "Jeremiah 19:5" },
      { section: "questions", ref: "Genesis 50:20" },
      { section: "questions", ref: "Acts 2:23" },
    ],
  },
  {
    question: "What does “evil” mean in Isaiah 45:7 and Amos 3:6?",
    answer:
      "In both verses the Hebrew word usually means calamity, trouble, or disaster, and Isaiah sets it against peace. Newer translations such as the NASB and ESV read “calamity” or “disaster,” while the King James Version says “evil,” which is easier to misread. The same Hebrew word can also mean moral evil in other passages, so context decides. I use these verses to say that hard events do not fall outside God’s awareness. I do not use them to say that God does wrong.",
    refs: [
      { section: "source", ref: "Isaiah 45:7" },
      { section: "evil", ref: "Amos 3:6" },
    ],
  },
  {
    question: "Is the devil real? Should I ignore him or fight him?",
    answer:
      "He is real, he is dangerous, and he is not God’s equal. Scripture sometimes names him as the direct cause of suffering, like a woman bound for eighteen years and Paul’s thorn. In the clearest picture of his reach he can touch only what the Lord permits. And Scripture tells us what to do: submit to God first, then resist the devil. So I am not saying ignore him. I am saying do not go back and forth with him as if he were the main event. Go to the Father, and resist from there.",
    refs: [
      { section: "questions", ref: "1 Peter 5:8" },
      { section: "questions", ref: "Job 1:12" },
      { section: "questions", ref: "Job 2:6" },
      { section: "questions", ref: "Luke 13:16" },
      { section: "questions", ref: "Acts 10:38" },
      { section: "questions", ref: "2 Corinthians 12:7" },
      { section: "questions", ref: "James 4:7" },
      { section: "questions", ref: "Ephesians 6:11-12" },
    ],
  },
  {
    question: "Does this mean every hard thing is God punishing me?",
    answer:
      "No. Scripture gives several causes for hard seasons: my own choices, God’s loving discipline, a broken world, an enemy, and sometimes no cause I can see. Jesus said a man’s blindness was not about his sin or his parents’ sin, and God Himself called Job upright while Job suffered. I try to take accountability for what is mine, and not assume what is not.",
    refs: [
      { section: "questions", ref: "John 9:3" },
      { section: "trials", ref: "Job 1:8" },
      { section: "questions", ref: "Galatians 6:7" },
      { section: "questions", ref: "Hebrews 12:6" },
      { section: "wicked", ref: "Daniel 9:14" },
    ],
  },
  {
    question: "Is this the final word?",
    answer:
      "No. I believe what I have written here, but I do not claim to have the full picture, and I am open to other views. Please do not take my word for it. Search the Scriptures and see if these things are so.",
    refs: [{ section: "questions", ref: "Acts 17:11" }],
  },
];

export const notSaying: string[] = [
  "I am not saying hard things do not hurt. Jesus wept.",
  "I am not saying people who suffer deserve it, or that abuse or harm is acceptable.",
  "I am not saying this replaces counseling, medical care, or emergency help.",
  "I am not saying I have it all figured out. His ways are higher than mine.",
];

// ---------- the hurting path ----------

export const hurtingVerses: { section: string; ref: string }[] = [
  { section: "hurting", ref: "Psalm 34:18" },
  { section: "hurting", ref: "Matthew 11:28" },
  { section: "hurting", ref: "John 11:35" },
  { section: "recognize", ref: "Psalm 40:17" },
  { section: "acknowledge", ref: "Ephesians 2:4-5" },
  { section: "david", ref: "Psalm 38:1-3, 22" },
];

export const prayer =
  "Father, I come to You by the blood of Jesus. I may not understand what is happening, but I believe You are in control, and I need You. Help my paradigm be transformed and conformed to the image of Your Son, Jesus, by the empowerment of Your Holy Spirit. Amen.";

// ---------- the current state worksheet ----------

export const worksheetPrompts: { id: string; label: string; hint: string }[] = [
  {
    id: "state",
    label: "Where am I right now?",
    hint: "Describe your current state honestly. You cannot trust God into a future state if you have misread this one.",
  },
  {
    id: "mine",
    label: "What part might be mine?",
    hint: "Decisions, lack of discipline, or the way I approach situations. Accountability is not condemnation.",
  },
  {
    id: "paradigm",
    label: "What do I call good or bad here, and why?",
    hint: "My paradigm is mine. It does not mean it lines up with truth.",
  },
  {
    id: "question",
    label: "What might God be allowing, and what question am I afraid to ask Him?",
    hint: "Ask it. He can handle it.",
  },
  {
    id: "next",
    label: "What is my next step toward Christ?",
    hint: "One small, real step. He is the lens we look at all of life through.",
  },
];
