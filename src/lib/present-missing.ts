// The "Present but Missing" lesson for men (page: /faith/present-but-missing). The words are
// Juston's notes, with grammar corrected. The same content builds the web page and the PDF that
// is emailed to a man with his own answers, so edit it here only.

export const LESSON_PATH = "/faith/present-but-missing";
export const LESSON_TITLE = "Present but Missing";
export const LESSON_SUBTITLE = "When a Man Provides Everything but Himself";
export const LESSON_LABEL = "A lesson and exercise for men";

export type Version = "NASB2020" | "NLT";
export type Verse = { ref: string; version: Version; text: string };

export const synopsis = [
  "Being fully present means paying attention to what is actually happening, discerning it in light of God’s truth, and responding faithfully in love.",
  "Being “present but missing” means I am physically there, perhaps even performing my duties, but I am not faithfully engaging the person or situation before me.",
];

export type VerseGroup = { heading: string; verses: Verse[] };

export const explanation: VerseGroup[] = [
  {
    heading: "Explanation of the synopsis",
    verses: [
      {
        ref: "Isaiah 58:3",
        version: "NASB2020",
        text: "‘Why have we fasted and You do not see? Why have we humbled ourselves and You do not notice?’ Behold, on the day of your fast you find your desire, And oppress all your workers.",
      },
      {
        ref: "Isaiah 58:4",
        version: "NASB2020",
        text: "Behold, you fast for contention and strife, and to strike with a wicked fist. You do not fast like you have done today to make your voice heard on high!",
      },
      {
        ref: "Isaiah 58:5",
        version: "NASB2020",
        text: "Is it a fast like this that I choose, a day for a person to humble himself? Is it for bowing one’s head like a reed And for spreading out sackcloth and ashes as a bed? Will you call this a fast, even an acceptable day to the LORD?",
      },
      {
        ref: "Isaiah 58:6",
        version: "NASB2020",
        text: "Is this not the fast that I choose: To release the bonds of wickedness, To undo the ropes of the yoke, And to let the oppressed go free, And break every yoke?",
      },
      {
        ref: "Isaiah 58:7",
        version: "NASB2020",
        text: "Is it not to break your bread with the hungry And bring the homeless poor into the house; When you see the naked, to cover him; And not to hide yourself from your own flesh?",
      },
      {
        ref: "Isaiah 58:8",
        version: "NASB2020",
        text: "Then your light will break out like the dawn, And your recovery will spring up quickly; And your righteousness will go before you; The glory of the LORD will be your rear guard.",
      },
      {
        ref: "Isaiah 58:9",
        version: "NASB2020",
        text: "Then you will call, and the LORD will answer; You will cry for help, and He will say, ‘Here I am.’ If you remove the yoke from your midst, The pointing of the finger and speaking wickedness,",
      },
      {
        ref: "Isaiah 58:10",
        version: "NASB2020",
        text: "And if you offer yourself to the hungry And satisfy the need of the afflicted, Then your light will rise in darkness, And your gloom will become like midday.",
      },
    ],
  },
  {
    heading: "Christ’s stance on being “fully present”",
    verses: [
      {
        ref: "Matthew 23:23",
        version: "NLT",
        text: "What sorrow awaits you teachers of religious law and you Pharisees. Hypocrites! For you are careful to tithe even the tiniest income from your herb gardens, but you ignore the more important aspects of the law: justice, mercy, and faith. You should tithe, yes, but do not neglect the more important things.",
      },
      {
        ref: "Matthew 23:24",
        version: "NLT",
        text: "Blind guides! You strain your water so you won’t accidentally swallow a gnat, but you swallow a camel!",
      },
    ],
  },
];

export type Context = {
  id: string;
  label: string;
  question: string;
  /** A verse shown with the question, before the response. */
  honor?: Verse;
  respond: string;
  /** Scripture that supports the response. */
  references?: Verse[];
};

export const contexts: Context[] = [
  {
    id: "pressure",
    label: "Personal Pressure Context",
    question: "What do others experience when I am overwhelmed?",
    respond:
      "Ask yourself, “Why am I anxious?” and “Should I give in to the urge to react?”",
  },
  {
    id: "household",
    label: "Household Context",
    question: "Am I responding to the person or defending my authority?",
    respond: "Listen, explain, correct fairly, and apologize when wrong.",
  },
  {
    id: "church",
    label: "Church Context",
    question:
      "Do I view honor and respect as unquestioning agreement? Am I calling conformity unity?",
    honor: {
      ref: "1 Peter 2:17",
      version: "NASB2020",
      text: "Honor all people, love the brotherhood, fear God, honor the king.",
    },
    respond: "Study, ask questions, trust the Spirit.",
    references: [
      {
        ref: "1 John 2:27",
        version: "NASB2020",
        text: "And as for you, the anointing which you received from Him remains in you, and you have no need for anyone to teach you; but as His anointing teaches you about all things, and is true and is not a lie, and just as it has taught you, you remain in Him.",
      },
      {
        ref: "1 John 2:20-21",
        version: "NASB2020",
        text: "But you have an anointing from the Holy One, and you all know. I have not written to you because you do not know the truth, but because you do know it, and because no lie is of the truth.",
      },
      {
        ref: "Psalm 119:99",
        version: "NASB2020",
        text: "I have more insight than all my teachers, For Your testimonies are my meditation.",
      },
    ],
  },
  {
    id: "community",
    label: "Community Context",
    question:
      "Am I avoiding involvement because nothing is happening, or because involvement will cost me?",
    respond:
      "Don’t turn a blind eye.",
    references: [
      {
        ref: "John 8:3",
        version: "NASB2020",
        text: "Now the scribes and the Pharisees brought a woman caught in the act of adultery, and after placing her in the center of the courtyard,",
      },
      {
        ref: "John 8:4",
        version: "NASB2020",
        text: "they said to Him, “Teacher, this woman has been caught in the very act of committing adultery.",
      },
      {
        ref: "John 8:5",
        version: "NASB2020",
        text: "Now in the Law, Moses commanded us to stone such women; what then do You say?”",
      },
      {
        ref: "John 8:6",
        version: "NASB2020",
        text: "Now they were saying this to test Him, so that they might have grounds for accusing Him. But Jesus stooped down and with His finger wrote on the ground.",
      },
      {
        ref: "John 8:7",
        version: "NASB2020",
        text: "When they persisted in asking Him, He straightened up and said to them, “He who is without sin among you, let him be the first to throw a stone at her.”",
      },
      { ref: "John 8:8", version: "NASB2020", text: "And again He stooped down and wrote on the ground." },
      {
        ref: "John 8:9",
        version: "NASB2020",
        text: "Now when they heard this, they began leaving, one by one, beginning with the older ones, and He was left alone, and the woman where she was, in the center of the courtyard.",
      },
      {
        ref: "John 8:10",
        version: "NASB2020",
        text: "And straightening up, Jesus said to her, “Woman, where are they? Did no one condemn you?”",
      },
      {
        ref: "John 8:11",
        version: "NASB2020",
        text: "She said, “No one, Lord.” And Jesus said, “I do not condemn you, either. Go. From now on do not sin any longer.”",
      },
    ],
  },
];

export type ActionGroup = { id: string; label: string; verses: Verse[] };

export const actions: ActionGroup[] = [
  {
    id: "overwhelmed",
    label: "Overwhelmed?",
    verses: [
      {
        ref: "1 Peter 1:13",
        version: "NASB2020",
        text: "Therefore, prepare your minds for action, keep sober in spirit, set your hope completely on the grace to be brought to you at the revelation of Jesus Christ.",
      },
      {
        ref: "Philippians 4:6",
        version: "NASB2020",
        text: "Do not be anxious about anything, but in everything by prayer and pleading with thanksgiving let your requests be made known to God.",
      },
    ],
  },
  {
    id: "household",
    label: "Household",
    verses: [
      {
        ref: "1 Peter 3:7",
        version: "NASB2020",
        text: "You husbands in the same way, live with your wives in an understanding way, as with someone weaker, since she is a woman; and show her honor as a fellow heir of the grace of life, so that your prayers will not be hindered.",
      },
      {
        ref: "Ephesians 6:4",
        version: "NASB2020",
        text: "Fathers, do not provoke your children to anger, but bring them up in the discipline and instruction of the Lord.",
      },
      {
        ref: "Colossians 3:21",
        version: "NASB2020",
        text: "Fathers, do not antagonize your children, so that they will not become discouraged.",
      },
    ],
  },
  {
    id: "church",
    label: "Church",
    verses: [
      {
        ref: "Acts 17:10",
        version: "NASB2020",
        text: "The brothers immediately sent Paul and Silas away by night to Berea, and when they arrived, they went into the synagogue of the Jews.",
      },
      {
        ref: "Acts 17:11",
        version: "NLT",
        text: "And the people of Berea were more open-minded than those in Thessalonica, and they listened eagerly to Paul’s message. They searched the Scriptures day after day to see if Paul and Silas were teaching the truth.",
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    verses: [
      {
        ref: "Esther 4:14",
        version: "NLT",
        text: "If you keep quiet at a time like this, deliverance and relief for the Jews will arise from some other place, but you and your relatives will die. Who knows if perhaps you were made queen for just such a time as this?",
      },
      {
        ref: "Galatians 2:11",
        version: "NLT",
        text: "But when Peter came to Antioch, I had to oppose him to his face, for what he did was very wrong.",
      },
      {
        ref: "Galatians 2:12",
        version: "NLT",
        text: "When he first arrived, he ate with the Gentile believers, who were not circumcised. But afterward, when some friends of James came, Peter wouldn’t eat with the Gentiles anymore. He was afraid of criticism from these people who insisted on the necessity of circumcision.",
      },
      {
        ref: "Galatians 2:13",
        version: "NLT",
        text: "As a result, other Jewish believers followed Peter’s hypocrisy, and even Barnabas was led astray by their hypocrisy.",
      },
      {
        ref: "Galatians 2:14",
        version: "NLT",
        text: "When I saw that they were not following the truth of the gospel message, I said to Peter in front of all the others, “Since you, a Jew by birth, have discarded the Jewish laws and are living like a Gentile, why are you now trying to make these Gentiles follow the Jewish traditions?”",
      },
    ],
  },
];

// Each question is taught with its own "What to do about it", so the page and the PDF show the two
// together. Only the Personal Pressure question is paired with a differently named action.
const ACTION_FOR_CONTEXT: Record<string, string> = { pressure: "overwhelmed" };

export function actionFor(context: Context): ActionGroup {
  const id = ACTION_FOR_CONTEXT[context.id] ?? context.id;
  const found = actions.find((a) => a.id === id);
  if (!found) throw new Error(`No action group for ${context.id}`);
  return found;
}

// Every place a man can write. The ids are what the page saves and what the PDF is built from.
export const noteFields = [
  ...contexts.map((c) => ({
    id: `q-${c.id}`,
    label: `${c.label}: my notes`,
    prompt: c.question,
  })),
  ...actions.map((a) => ({
    id: `a-${a.id}`,
    label: `${a.label}: my next step`,
    prompt: `What do I need to do about this, and when?`,
  })),
];

export const MAX_NOTE_LENGTH = 3000;

export const versionNotice: Record<Version, string> = {
  NASB2020:
    "Scripture quotations taken from the (NASB®) New American Standard Bible®, Copyright © 1960, 1971, 1977, 1995, 2020 by The Lockman Foundation. Used by permission. All rights reserved. www.Lockman.org",
  NLT: "Scripture quotations are taken from the Holy Bible, New Living Translation, Copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, a Division of Tyndale House Ministries. All rights reserved.",
};
