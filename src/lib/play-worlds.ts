// The age groups and worlds of Tech Journey Jr. (/techjr/play).
// A child first picks an age group (a "band"), then plays that band's map of worlds.
// Adding a world means adding one entry here, then (when it has content) the screen that plays it.
// A world's `about` lists the bands it appears in, with the words that band sees on the map.
// A world with status "soon" shows on the map as locked, so families can see what is coming.
// Kid-screen rules still apply: ~2nd grade reading, no em dashes, no outbound links, no pay
// numbers, no ranking of jobs, and nothing is stored about a child.

import { homeIntro, worldAbout } from "./career-day";
import { cyberAbout } from "./cyber-defenders";
import { littleAbout, littleBandIntro } from "./play-little";

export type WorldTheme = "sky" | "fuchsia" | "amber" | "grape" | "mint" | "violet" | "ocean";

// Full class names, written out so Tailwind can see them.
export const worldThemes: Record<
  WorldTheme,
  { band: string; button: string; chip: string; glow: string }
> = {
  sky: {
    band: "from-sky-400 via-blue-500 to-indigo-600",
    button: "bg-blue-500 hover:bg-blue-400 border-blue-800 text-white",
    chip: "bg-sky-100 text-sky-900",
    glow: "shadow-sky-400/40",
  },
  fuchsia: {
    band: "from-fuchsia-500 via-pink-500 to-orange-400",
    button: "bg-fuchsia-500 hover:bg-fuchsia-400 border-fuchsia-900 text-white",
    chip: "bg-fuchsia-100 text-fuchsia-900",
    glow: "shadow-fuchsia-400/40",
  },
  amber: {
    band: "from-amber-300 via-orange-400 to-rose-500",
    button: "bg-amber-400 hover:bg-amber-300 border-amber-700 text-slate-900",
    chip: "bg-amber-100 text-amber-900",
    glow: "shadow-amber-300/40",
  },
  grape: {
    band: "from-violet-500 via-purple-500 to-fuchsia-600",
    button: "bg-violet-500 hover:bg-violet-400 border-violet-900 text-white",
    chip: "bg-violet-100 text-violet-900",
    glow: "shadow-violet-400/40",
  },
  mint: {
    band: "from-emerald-400 via-teal-500 to-cyan-600",
    button: "bg-emerald-500 hover:bg-emerald-400 border-emerald-800 text-white",
    chip: "bg-emerald-100 text-emerald-900",
    glow: "shadow-emerald-400/40",
  },
  violet: {
    band: "from-indigo-500 via-violet-600 to-purple-700",
    button: "bg-indigo-500 hover:bg-indigo-400 border-indigo-900 text-white",
    chip: "bg-indigo-100 text-indigo-900",
    glow: "shadow-indigo-400/40",
  },
  ocean: {
    band: "from-cyan-400 via-sky-500 to-blue-600",
    button: "bg-cyan-500 hover:bg-cyan-400 border-cyan-800 text-white",
    chip: "bg-cyan-100 text-cyan-900",
    glow: "shadow-cyan-400/40",
  },
};

export type BandId = "ages-5-7" | "ages-8-10";

export type Band = {
  id: BandId;
  /** Shown on the picker and the map. */
  name: string;
  emoji: string;
  ages: string;
  grades: string;
  /** One line for the picker card. */
  blurb: string;
  /** Spoken and shown at the top of the band's map. */
  intro: string;
  theme: WorldTheme;
};

export const bands: Band[] = [
  {
    id: "ages-5-7",
    name: "Tech Sprouts",
    emoji: "🌻",
    ages: "5 to 7",
    grades: "Kindergarten to 2nd grade",
    blurb: "Short stories, big pictures, and a voice that reads every screen.",
    intro: littleBandIntro,
    theme: "amber",
  },
  {
    id: "ages-8-10",
    name: "Tech Trailblazers",
    emoji: "⚡",
    ages: "8 to 10",
    grades: "3rd to 5th grade",
    blurb: "Real jobs, trickier choices, and bigger challenges.",
    intro: homeIntro,
    theme: "violet",
  },
];

export const bandById = (id: string) => bands.find((b) => b.id === id);

export const PLAY_PATH = "/techjr/play";
export const bandPath = (band: BandId) => `${PLAY_PATH}/${band}`;
export const worldPath = (band: BandId, world: string) => `${PLAY_PATH}/${band}/${world}`;
export const badgePath = (band: BandId) => `${PLAY_PATH}/${band}/badge`;

export type World = {
  /** Used in the address: /techjr/play/<band>/<id> */
  id: string;
  emoji: string;
  title: string;
  tag: string;
  /** Which bands show this world, and what each band reads about it. */
  about: Partial<Record<BandId, string>>;
  theme: WorldTheme;
  status: "live" | "soon";
  /** A world that earns a star toward the Tech Pro badge. */
  star: boolean;
  /** Which screen plays it (only for live worlds). */
  kind?: "helper" | "creator" | "gift" | "facts" | "cyber";
};

export const worlds: World[] = [
  {
    id: "helper",
    emoji: "🤝",
    title: "Be the Helper",
    tag: "Tech Sales & Customer Success",
    about: { "ages-5-7": littleAbout.helper, "ages-8-10": worldAbout.helper },
    theme: "sky",
    status: "live",
    star: true,
    kind: "helper",
  },
  {
    id: "creator",
    emoji: "🎥",
    title: "Make a Show",
    tag: "Content Creation",
    about: { "ages-5-7": littleAbout.creator, "ages-8-10": worldAbout.creator },
    theme: "fuchsia",
    status: "live",
    star: true,
    kind: "creator",
  },
  {
    id: "gift",
    emoji: "🎁",
    title: "Find Your Gift",
    tag: "Careers & You",
    about: { "ages-5-7": littleAbout.gift, "ages-8-10": worldAbout.gift },
    theme: "amber",
    status: "live",
    star: true,
    kind: "gift",
  },
  {
    id: "facts",
    emoji: "🤯",
    title: "Cool Facts",
    tag: "Bonus Lab",
    about: { "ages-5-7": worldAbout.facts, "ages-8-10": worldAbout.facts },
    theme: "grape",
    status: "live",
    star: false,
    kind: "facts",
  },
  {
    id: "cyber",
    emoji: "🛡️",
    title: "Cyber Defenders",
    tag: "Cybersecurity",
    about: { "ages-5-7": littleAbout.cyber, "ages-8-10": cyberAbout },
    theme: "mint",
    status: "live",
    star: false,
    kind: "cyber",
  },
  {
    id: "coding",
    emoji: "👩🏽‍💻",
    title: "Code Quest",
    tag: "Coding & Software",
    about: {
      "ages-5-7": "Learn how games are made with fun puzzles, one small step at a time.",
      "ages-8-10": "Learn how apps and games are made, one small step at a time.",
    },
    theme: "violet",
    status: "soon",
    star: false,
  },
  {
    id: "data",
    emoji: "📊",
    title: "Data & AI Lab",
    tag: "Data & AI",
    about: { "ages-8-10": "Find patterns, ask big questions, and see how computers learn." },
    theme: "ocean",
    status: "soon",
    star: false,
  },
];

export const worldById = (id: string) => worlds.find((w) => w.id === id);
export const worldsFor = (band: BandId) => worlds.filter((w) => w.about[band] !== undefined);
export const starWorldsFor = (band: BandId) => worldsFor(band).filter((w) => w.star);
export const aboutFor = (world: World, band: BandId) => world.about[band] ?? "";

// A kid's level goes up with every star, so the map feels like a game.
export const levels = [
  { name: "Rookie", emoji: "🌱" },
  { name: "Explorer", emoji: "🧭" },
  { name: "Builder", emoji: "🛠️" },
  { name: "Tech Pro", emoji: "🚀" },
] as const;

export const levelFor = (stars: number) => levels[Math.min(stars, levels.length - 1)];
