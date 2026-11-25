// "What I Learned in 15 Years of Ministry": Atiya's three lessons, on one page. The reading comes first, and each verse
// sits right after the part it belongs to, with one or two lines on why it was chosen and how far it can honestly be
// applied. Scripture is the New Living Translation (NLT), copied word for word from the NLT text on Bible Gateway, except
// where a passage is marked NASB 2020 (the same wording used in the video overlays). Each passage shows its own translation.
// (1 Corinthians 3:11 has a dash in the NLT's own wording, so that one dash is kept as printed.)

export const MINISTRY_PATH = "/faith/15-years-in-ministry";
export const MINISTRY_TITLE = "What I Learned in 15 Years of Ministry";
export const MINISTRY_PUBLISHED = "2026-11-24";
export const MINISTRY_MODIFIED = "2026-11-24";

export const ministrySeoTitle = "What I Learned in 15 Years of Ministry | Atiya Warthen";
export const ministrySeoDescription =
  "Three lessons from 15 years of serving in ministry: know God and His Word for yourself, lead with humility, and serve God's people without being bound by their opinions.";

export const NLT_NOTICE =
  "Scripture quotations marked (NLT) are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.";

export type Passage = { ref: string; text: string; version?: "NLT" | "NASB 2020" };

export const NASB_NOTICE =
  "Scripture quotations taken from the (NASB®) New American Standard Bible®, Copyright © 1960, 1971, 1977, 1995, 2020 by The Lockman Foundation. Used by permission. All rights reserved. www.lockman.org";

export type Block =
  | { kind: "p"; text: string; lead?: boolean }
  | { kind: "scripture"; passages: Passage[]; why: string };

export type Lesson = {
  n: number;
  id: string;
  title: string;
  /** One line under the title. */
  summary: string;
  blocks: Block[];
};

export const dek = "Three lessons for anyone who serves in a local church, and for anyone who has stepped back from serving.";

export const audience = [
  {
    label: "If you serve",
    text: "This is for you if you serve in a local church, full-time or part-time, and you are heavily involved in making sure everyone is taken care of. It is easy to keep your commitments to people and neglect your commitment to God. When that happens, you miss Him, and the people you are serving are not impacted the way you intended.",
  },
  {
    label: "If you have stepped back",
    text: "This is also for you if you have taken a step back, or walked away from serving. You are still called to obey God.",
  },
];

export const lessons: Lesson[] = [
  {
    n: 1,
    id: "lesson-1",
    title: "Know God and His Word for yourself",
    summary: "A relationship with Him and time in His Word are your foundation.",
    blocks: [
      { kind: "p", lead: true, text: "You are serving God. You are not really serving man." },
      {
        kind: "p",
        text: "You have to know Him. You have to have a relationship with Him, and you have to be able to hear from Him. That fire for God can never be allowed to die down. If you let it go out, you will have nothing left to give.",
      },
      {
        kind: "scripture",
        passages: [{ ref: "Leviticus 6:13", text: "Remember, the fire must be kept burning on the altar at all times. It must never go out." }],
        why: "This is an illustration of keeping our devotion to God burning. The command itself was for Israel's priests, who kept the fire on the altar going.",
      },
      { kind: "p", text: "You also have to know His Word for yourself. Read it. Study it." },
      {
        kind: "scripture",
        passages: [
          {
            ref: "Acts 17:11",
            text: "And the people of Berea were more open-minded than those in Thessalonica, and they listened eagerly to Paul’s message. They searched the Scriptures day after day to see if Paul and Silas were teaching the truth.",
          },
        ],
        why: "The Bereans did not simply accept what they heard, even from Paul. They checked it against the Scriptures for themselves.",
      },
      {
        kind: "scripture",
        passages: [
          {
            ref: "Hebrews 4:12",
            text: "For the word of God is alive and powerful. It is sharper than the sharpest two-edged sword, cutting between soul and spirit, between joint and marrow. It exposes our innermost thoughts and desires.",
          },
        ],
        why: "God's Word is alive, and it reaches what is really in us. That is why it matters to read it for yourself and not only hear it from someone else.",
      },
      { kind: "p", text: "You cannot rely on someone else's interpretation of Scripture to be your foundation. You cannot build your life on someone else's foundation." },
      {
        kind: "scripture",
        passages: [{ ref: "1 Corinthians 3:11", text: "For no one can lay any foundation other than the one we already have—Jesus Christ." }],
        why: "Paul wrote this to believers who were following leaders instead of Christ. The foundation of our lives is Jesus Himself, not any one teacher.",
      },
    ],
  },
  {
    n: 2,
    id: "lesson-2",
    title: "Lead with humility",
    summary: "Pride will have you serving the wrong thing.",
    blocks: [
      {
        kind: "p",
        lead: true,
        text: "There were so many times I felt prideful. I looked for accolades, titles, and the best seat at an event, and I looked forward to those things.",
      },
      {
        kind: "p",
        text: "All of that sets you up so that you cannot walk away. After 15 years, the Lord told us to walk away. When pride is what you are really serving, you do not walk away from it, even when the Lord says to. We know what the Bible says about pride.",
      },
      {
        kind: "scripture",
        passages: [{ ref: "Proverbs 16:18", version: "NASB 2020", text: "Pride goes before destruction,\nAnd a haughty spirit before stumbling." }],
        why: "God's Word is clear about where pride leads: destruction and stumbling.",
      },
      {
        kind: "scripture",
        passages: [
          {
            ref: "Mark 10:45",
            version: "NASB 2020",
            text: "For even the Son of Man did not come to be served, but to serve, and to give His life as a ransom for many.",
          },
        ],
        why: "The opposite of pride is Jesus Himself. He said this to disciples who were arguing about who would be greatest, and He pointed to His own example: not to be served, but to serve.",
      },
    ],
  },
  {
    n: 3,
    id: "lesson-3",
    title: "Serve God's people, but do not be bound by their opinions",
    summary: "Give your gifts to His people without being limited by what they think.",
    blocks: [
      {
        kind: "p",
        lead: true,
        text: "My role as a servant of God is to serve God's people. I am there to serve them, pray for them, and stand in the gap for them. Whatever gift and talent God has given me, I use it for His church, His people, His bride.",
      },
      {
        kind: "p",
        text: "But I cannot be limited by their opinions. We saw how the crowds treated Jesus. They loved him one day and were ready to crucify him the next.",
      },
      {
        kind: "scripture",
        passages: [
          {
            ref: "Matthew 21:9",
            text: "Jesus was in the center of the procession, and the people all around him were shouting, “Praise God for the Son of David! Blessings on the one who comes in the name of the Lord! Praise God in highest heaven!”",
          },
          {
            ref: "Matthew 27:22-23",
            text: "Pilate responded, “Then what should I do with Jesus who is called the Messiah?” They shouted back, “Crucify him!” “Why?” Pilate demanded. “What crime has he committed?” But the mob roared even louder, “Crucify him!”",
          },
        ],
        why: "One crowd praised Jesus as He entered Jerusalem; days later, another demanded His crucifixion before Pilate.",
      },
      { kind: "p", text: "His ministry was still to the people, but he was not bound by their opinions." },
      {
        kind: "scripture",
        passages: [
          {
            ref: "John 2:23-25",
            text: "Because of the miraculous signs Jesus did in Jerusalem at the Passover celebration, many began to trust in him. But Jesus didn’t trust them, because he knew all about people. No one needed to tell him about human nature, for he knew what was in each person’s heart.",
          },
        ],
        why: "Many believed after seeing His miracles, but Jesus didn't trust them, because He knew what was in people. Their approval was not what He relied on.",
      },
      {
        kind: "p",
        text: "That can happen to us a lot, because we really do care what people think. And what if everyone you are serving gives you no recognition at all?",
      },
      {
        kind: "scripture",
        passages: [
          {
            ref: "Galatians 1:10",
            text: "Obviously, I’m not trying to win the approval of people, but of God. If pleasing people were my goal, I would not be Christ’s servant.",
          },
        ],
        why: "Paul says plainly that making people's approval our goal and serving Christ pull in different directions.",
      },
      { kind: "p", text: "Whatever we do, we do it as to the Lord." },
      {
        kind: "scripture",
        passages: [
          {
            ref: "Colossians 3:23-24",
            text: "Work willingly at whatever you do, as though you were working for the Lord rather than for people. Remember that the Lord will give you an inheritance as your reward, and that the Master you are serving is Christ.",
          },
        ],
        why: "God instructs us to work as for the Lord, not for people. It also reminds us who our Master really is.",
      },
      { kind: "p", text: "And we are to obey God rather than men." },
      {
        kind: "scripture",
        passages: [{ ref: "Acts 5:29", text: "But Peter and the apostles replied, “We must obey God rather than any human authority.”" }],
        why: "Peter said this when leaders ordered the apostles to stop preaching, putting God's command above any human demand. It does not mean ignoring wise counsel.",
      },
    ],
  },
];

export const closing = {
  title: "Obey Him",
  lines: [
    "Whatever gifts God has given you are for building His kingdom.",
    "If you are serving right now, keep your eyes on Him and not on the room. If you have taken a step back, or walked away from serving, you are still called to obey God. Obey Him.",
  ],
};
