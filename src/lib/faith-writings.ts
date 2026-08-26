export type FaithWritingCategory = "topical-study" | "story-time" | "reflections";

export const categoryLabels: Record<FaithWritingCategory, string> = {
  "topical-study": "Topical Study",
  "story-time": "Story Time",
  "reflections": "Reflections",
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
  {
    slug: "this-thing-is-spiritual",
    category: "reflections",
    title: "This Thing Is Spiritual",
    dek: "Everything we experience and perceive is spiritual first. A reflection on trusting the Spirit over intellect and emotion to bring true focus, even in the midst of change.",
    author: "Juston Warthen",
    date: "August 2026",
    heroImage: {
      src: "/faith/writings/its-spiritual.jpg",
      alt: "A man standing amid wreckage and fire as storm clouds part to reveal light and a peaceful valley beyond",
    },
    body: [
      { type: "p", text: "This thing is spiritual." },
      { type: "p", text: "What we experience is spiritual. What we perceive is spiritual. How we process what we experience may be filtered through intellect and emotion, but the actual thing we are attempting to interpret is spiritual." },
      { type: "p", text: "Concerning how we filter that which is spiritual, first let's understand that there is an order to spiritual things. As we know, “By faith we understand that the entire universe was formed at God's command, that what we now see did not come from anything that can be seen” (Hebrews 11:3 NLT)." },
      { type: "p", text: "And let's not forget that “For God is Spirit, so those who worship him must worship in spirit and in truth” (John 4:24 NLT)." },
      { type: "p", text: "This means that creation as we “see” it is an expression of that which we cannot “see.” Those who worship the Most High must worship Him in Spirit and in Truth. Creation has a manual just as an item in need of assembly has a manual. Truth has order because there is only one truth." },
      { type: "p", text: "Therefore, when we attempt to filter that which is spiritual apart from the Spirit, our intellect and emotions scan tons of information and feelings based on a plethora of things we see. This makes it difficult, and dare I say impossible, to make truthful sense of." },
      { type: "p", text: "Just as man has created AI tools to attach themselves to a company's tech stack and streamline getting the proper information to a person searching for it, so does the Spirit function in this way, except at an incomparably greater measure." },
      { type: "p", text: "Let's not forget, oftentimes when it comes to what man creates, it is only an attempt to replicate a version of that which already is: “Be sure that you make everything according to the pattern I have shown you here on the mountain” (Exodus 25:40 NLT)." },
      { type: "p", text: "This thing is spiritual. Life is spiritual. Our battles are spiritual." },
      { type: "p", text: "We must approach our day with this in mind. We must fixate our meditations on this." },
      { type: "p", text: "A company that does not adapt with the technological times is at risk of being left behind. This is similar to the human who attempts to do life without adapting, but the difference is we are not just adapting to change; we are remaining steadfast in the midst of change." },
      { type: "p", text: "While mankind is inventing new things, we know that “History merely repeats itself. It has all been done before. Nothing under the sun is truly new” (Ecclesiastes 1:9 NLT)." },
      { type: "p", text: "When it comes to the Spirit, God says, “I am the Alpha and the Omega, the beginning and the end,” says the Lord God. “I am the one who is, who always was, and who is still to come, the Almighty One” (Revelation 1:8 NLT)." },
      { type: "p", text: "Our steadfastness is our reliance on the Spirit of God to bring proper focus to that which is spiritual." },
      { type: "p", text: "Let us not be entangled in the web of intellectualism and emotionalism. Our intellect and emotions are a support to our objective to be led by the Spirit." },
      { type: "p", text: "Truth must be our anchor. Christ must be our focus." },
      { type: "p", text: "May we remain steadfast in the midst of change, perceiving life in the Spirit and enjoying the benefit of being grounded in truth." },
      { type: "p", text: "Remember, AI is man's attempt to replicate that which already is, a way to streamline obtaining the proper information so that you can reach your destination more efficiently." },
      { type: "quote", text: "Trust the Spirit." },
    ],
  },
  {
    slug: "the-widows-mite-in-context",
    category: "topical-study",
    title: "The Widow's Mite in Context: What Jesus, Malachi, and Acts 4 Actually Teach About Giving",
    dek: "A closer look at the rich young ruler, the widow's mite in its full context, and what Malachi 3 and Acts 4 actually say about giving, a follow-up to our first look at tithing.",
    author: "Juston Warthen",
    date: "August 2026",
    heroImage: {
      src: "/faith/writings/tithing-post-2.jpg",
      alt: "A congregation worshipping together in a church service, with a pastor standing at the front",
    },
    body: [
      { type: "p", text: "If you are committed to giving 10% of all your income, as well as additional portions, to your local church because it means you are giving to Jesus, why did Jesus tell the rich young ruler to sell all that he had and give it to the poor and not to himself?" },
      { type: "p", text: "Could it be because Jesus said when you have fed the hungry, taken in the stranger, clothed the naked, and visited the sick and imprisoned, you have done it to Him (Matthew 25:40)?" },
      { type: "p", text: "...You may say, “Jesus was standing in the church overlooking the offering and noticed the sacrificial giving of a poor widow (Mark 12:41). Let's look at this in context.”" },
      { type: "p", text: "Jesus was standing in a temple of the religious leaders He rebuked for taking advantage of widows (v40), acknowledging that a widow gave all that she had when the rich had money left over (v44)." },
      { type: "p", text: "Jesus never actually commended the widow, but He did prophesy the destruction of this temple immediately following (Mark 13:2)." },
      { type: "p", text: "...I'm not saying to never give resources to your local church or pastor, I just find it odd that although Jesus never taught to commit to giving 10% of all your income to the coming non-profit corporations after His resurrection, nor did Paul teach to give 10% of all your income to your local church, yet there are people who teach that doing this is necessary to be protected from the devil." },
      { type: "p", text: "You may think I am saying that these people teach that you need to give to them in order to be saved. Well, they appear to teach a similar message." },
      { type: "p", text: "Why reference Malachi chapter 3 to declare that God will rebuke the devil from your physical health and the well-being of your family, and that God will bless you financially IF you give 10% of all of your income to their organization?" },
      { type: "p", text: "This seems to insinuate that we are not already blessed in Christ." },
      { type: "p", text: "Besides, is God asking the common people or the “sons of Levi,” “Will a man rob God?” (Malachi 3:8)?" },
      { type: "p", text: "Does not returning all the tithe into the storehouse (Malachi 3:10) refer to the supply of food for the people?" },
      { type: "p", text: "Why did Malachi say that God will be a witness against the sorcerers, adulterers, perjurers, and those who exploit wage earners and widows and orphans (Malachi 3:5)?" },
      { type: "p", text: "Is this not a message about the misappropriation of resources, which left people in lack?" },
      { type: "p", text: "What was the purpose of the Christians giving their resources to the apostles in Acts 4?" },
      { type: "p", text: "Was it not so that the funds could be distributed to the congregation as each had need so that no one would be in lack (Acts 4:34-35)?" },
      { type: "p", text: "Is this what your local church does with the funds?" },
      { type: "p", text: "Again, I'm not against you giving to a local church or a pastor; my concern is giving 10% of all your income to a local church because you feel your blessing is wrapped up in this obligation." },
      { type: "quote", text: "The atonement of Christ is enough to declare you blessed." },
      { type: "p", text: "I predominantly see the purpose of giving as for the well-being of those in need, and the means for financial provision as laboring with your own hands." },
      { type: "p", text: "What are your thoughts?" },
    ],
  },
];

export function getFaithWriting(category: string, slug: string) {
  return faithWritings.find((w) => w.category === category && w.slug === slug);
}

export function getFaithWritingsByCategory(category: FaithWritingCategory) {
  return faithWritings.filter((w) => w.category === category);
}
