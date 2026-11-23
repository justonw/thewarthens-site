// What the top of /faith shows. `pinnedVideo` is the Jesus story: it stays at the very top and does not
// change when new videos are posted. To add a new video, put it at the TOP of `faithVideos`; it shows
// first in the "New on the channel" row. Every video here is on the Faith Journey with The Warthens
// channel. Nothing else on the page needs to change.

export type FaithVideo = {
  /** YouTube id, used for the thumbnail. */
  id: string;
  title: string;
  /** One sentence under the title. */
  blurb: string;
  /** Where the card goes on this site (the page that has the video and the follow-up). */
  href: string;
  /** The button words. */
  cta: string;
  /** Only the newest needs these: what a person gets from the page. */
  perks?: string[];
};

export const pinnedVideo: FaithVideo = {
  id: "HKWT347dZ3U",
  title: "She Grew Up in Church. I Didn’t. We Both Needed Jesus.",
  blurb: "Why we believe in Jesus: Atiya’s story, Juston’s story, and how we both needed him.",
  href: "/jesus",
  cta: "Read the stories and watch",
  perks: ["Two very different roads to the same Savior", "Atiya’s story and Juston’s story, in their own words", "A place to share your own"],
};

export const faithVideos: FaithVideo[] = [
  {
    id: "lWuO8-l3d9c",
    title: "How to Be the Man Your Family Is Missing",
    blurb: "Being at home is not the same as being there. A Bible lesson for husbands and fathers. Free lesson plan with the Scripture, questions, and a PDF of your own answers.",
    href: "/faith/present-but-missing",
    cta: "Open the free lesson plan",
  },
  {
    id: "mKewhwS4Ys4",
    title: "Our Kids Swallowed Magnets. This Is How We Trusted God.",
    blurb: "Our story, plus what every parent should know about magnetic beads.",
    href: "/magnets",
    cta: "Read the story and watch",
  },
];

// Things to read or do on this site, shown in the filterable library near the bottom of /faith.
export type LibraryTag = "men" | "women" | "lesson" | "story-time" | "topical-study" | "reflections";

export const tagLabels: Record<LibraryTag, string> = {
  men: "For men",
  women: "For women",
  lesson: "Lessons and exercises",
  "story-time": "Story Time",
  "topical-study": "Topical Study",
  reflections: "Reflections",
};

export type LibraryItem = {
  href: string;
  title: string;
  blurb: string;
  cta: string;
  tags: LibraryTag[];
};

// Lessons, exercises and communities that are not in faith-writings.ts.
export const extraLibraryItems: LibraryItem[] = [
  {
    href: "/faith/15-years-in-ministry",
    title: "What I Learned in 15 Years of Ministry",
    blurb:
      "Three lessons from Atiya for anyone who serves in a local church, or has stepped back from serving: know God and His Word, lead with humility, and serve people without being bound by their opinions.",
    cta: "Read the lessons",
    tags: ["lesson"],
  },
  {
    href: "/faith/present-but-missing",
    title: "Present but Missing",
    blurb:
      "A lesson and exercise for men on providing everything but yourself. Follow the Scripture, write your notes, and email yourself a PDF.",
    cta: "Start the lesson",
    tags: ["men", "lesson"],
  },
  {
    href: "/source-of-life",
    title: "Source of Life",
    blurb:
      "A Scripture study on who is really in control: is good always God, and bad always the devil? A short test, the verses in three acts, and a worksheet for where you are right now.",
    cta: "Start the study",
    tags: ["lesson"],
  },
  {
    href: "/faith/women-who-seek",
    title: "Women Who Seek",
    blurb:
      "Finding Jesus in the Scriptures, hosted by Atiya. Open to any woman, wherever she is in her journey with Jesus.",
    cta: "Visit Women Who Seek",
    tags: ["women"],
  },
];
