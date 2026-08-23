export type FaithWritingCategory = "topical-study" | "story-time" | "wisdom-devotional";

export const categoryLabels: Record<FaithWritingCategory, string> = {
  "topical-study": "Topical Study",
  "story-time": "Story Time",
  "wisdom-devotional": "Wisdom & Devotional",
};

export type FaithWritingBlock =
  | { type: "p"; text: string }
  | { type: "quote"; text: string };

export type FaithWriting = {
  slug: string;
  category: FaithWritingCategory;
  title: string;
  dek: string;
  author: string;
  date: string;
  heroImage: { src: string; alt: string };
  body: FaithWritingBlock[];
};

export const faithWritings: FaithWriting[] = [
  {
    slug: "is-tithing-biblical",
    category: "topical-study",
    title: "Is Tithing Biblical? What I Found When I Finally Studied It For Myself",
    dek: "A personal reckoning turned scriptural study: what happened when I finally examined tithing for myself, verse by verse, instead of just accepting what I'd been taught.",
    author: "Juston Warthen",
    date: "August 2026",
    heroImage: {
      src: "/faith/writings/window-stare-juston-warthen.jpg",
      alt: "Juston Warthen looking out a window",
    },
    body: [
      { type: "p", text: "I walked outside prior to sunrise and was instantly depleted as I saw the empty parking spot where our only vehicle once was." },
      { type: "p", text: "After this repo, I was faced with the sobering reality of my poor stewardship that led me to this moment." },
      { type: "quote", text: "I committed the last decade and essentially all of my adulthood to pursuing what I deemed as the will of God." },
      { type: "quote", text: "I tithed and gave generously beyond that for the same time period." },
      { type: "quote", text: "Why are we broke, car-less and living in this apartment that we barely got approved for?" },
      { type: "p", text: "What did I conclude?" },
      { type: "p", text: "Either the God whom I grew to know was not real, or something was evidently wrong in my interpretation of Him." },
      { type: "p", text: "This conclusion was further cemented as I looked around me and deeply pondered on the outcomes and economical state of various church members' lives." },
      { type: "p", text: "Who was distinctly blessed financially? Hmmm… I could point to, literally, a handful." },
      { type: "p", text: "And them? Well, they were anomalies." },
      { type: "p", text: "There were decision-based factors that led them to a marketplace positioning which enabled them to make a decent amount of income (advanced academic credentials, business owners, etc.)." },
      { type: "p", text: "Another group which I saw fall into the anomalies are those who benefit from the generous. This made practical sense, as if you give and your livelihood is supported by the doctrines of giving which your supporters believe, then you will have some convincing testimonies on why “giving” is beneficial." },
      { type: "p", text: "So… if I could not unequivocally see the evidence of giving tithing and offering to the local nonprofit corporations, granting financial prosperity, then I had a choice to make:" },
      { type: "p", text: "Ignore what I see or take the heart-pounding step of searching for the truth." },
      { type: "p", text: "Here's where I landed. . ." },
      { type: "p", text: "An argument often used is that tithing is a heart issue and a key indicator of your love for God." },
      { type: "p", text: "But if tithing is the measure of the heart, how do we reconcile the Pharisees in Luke 11:42?" },
      { type: "p", text: "They were meticulous tithers, even down to the mint and rue in their gardens." },
      { type: "p", text: "Yet Jesus says they ignored justice and the love of God." },
      { type: "p", text: "It seems scripture is clear that religious tax or systematic giving is not the ultimate indicator of a person's heart." },
      { type: "p", text: "We often hear that tithing is a timeless principle because Abraham did it before the law." },
      { type: "p", text: "But Abraham only did it once, and it was from the spoils of war, not his personal income." },
      { type: "p", text: "And let us look at Jacob's tithe in Genesis 28." },
      { type: "p", text: "It was an “if” statement. “If God will be with me and keep me... then I will give a tenth.”" },
      { type: "p", text: "Is a bargain based on conditions really the foundation for a New Covenant mandate?" },
      { type: "p", text: "Not to mention, we never see where Jacob fulfills this vow." },
      { type: "p", text: "The New Covenant writers tell us in Hebrews 8:13 that the old covenant is obsolete and disappearing." },
      { type: "p", text: "The levitical priesthood, for whom the tithe was established to support, no longer functions as the intermediary between man and God." },
      { type: "p", text: "We are told that the worker is worthy of his hire, but we often conflate “support” with a mandatory 10% tax." },
      { type: "p", text: "Does the scripture show Paul mentioning the tithe?" },
      { type: "p", text: "Instead, in 1 Corinthians 16:2, he tells them to put aside “as he may prosper.”" },
      { type: "p", text: "No percentage. No mandate. No threat of a curse." },
      { type: "p", text: "We have been taught that if we tithe, God is obligated to protect our finances and heal our bodies." },
      { type: "p", text: "But if a person can give away all their possessions to charity and still not have love (1 Corinthians 13:3), then how is giving the spiritual insurance policy?" },
      { type: "p", text: "True “pure religion” according to James 1:27 is visiting orphans and widows in their distress." },
      { type: "p", text: "It is about meeting the practical needs of the lowly." },
      { type: "p", text: "When Jesus spoke of the widow's mite, was he commending a system that took the last bit of living from a poor woman, or was he lamenting a system that devoured widows' houses?" },
      { type: "p", text: "If your well-being and relationships are being held hostage by a 10% requirement, you might be serving a system rather than the Savior." },
      { type: "p", text: "Jesus said to sell our possessions and give to “charity” (Luke 12:33), which specifically refers to alms for the poor." },
      { type: "p", text: "Why has the focus shifted from the poor in our streets to the coffers of our institutions?" },
      { type: "p", text: "If you want to use 10% as a personal budgeting goal, that is your liberty." },
      { type: "p", text: "But to teach it as a doctrinal necessity for God's favor, blessing and healing?" },
      { type: "p", text: "Would love to know your experience..." },
      { type: "p", text: "What are your thoughts on all of this?" },
    ],
  },
];

export function getFaithWriting(category: string, slug: string) {
  return faithWritings.find((w) => w.category === category && w.slug === slug);
}

export function getFaithWritingsByCategory(category: FaithWritingCategory) {
  return faithWritings.filter((w) => w.category === category);
}
