// The worlds on the Tech Journey Jr. map (/techjr/play).
// Adding a world means adding one entry here, then (when it has content) the screen that plays it.
// A world with status "soon" shows on the map as locked, so families can see what is coming.
// Kid-screen rules still apply: ~2nd grade reading, no em dashes, no outbound links, no pay
// numbers, no ranking of jobs, and nothing is stored about a child.

import { worldAbout } from "./career-day";

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

export type World = {
  /** Used in the address: /techjr/play/<id> */
  id: string;
  emoji: string;
  title: string;
  tag: string;
  about: string;
  theme: WorldTheme;
  status: "live" | "soon";
  /** A world that earns a star toward the Tech Pro badge. */
  star: boolean;
  /** Which screen plays it (only for live worlds). */
  kind?: "helper" | "creator" | "gift" | "facts";
};

export const worlds: World[] = [
  {
    id: "helper",
    emoji: "🤝",
    title: "Be the Helper",
    tag: "Tech Sales & Customer Success",
    about: worldAbout.helper,
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
    about: worldAbout.creator,
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
    about: worldAbout.gift,
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
    about: worldAbout.facts,
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
    about: "Spot tricks, protect passwords, and learn how people keep the internet safe.",
    theme: "mint",
    status: "soon",
    star: false,
  },
  {
    id: "coding",
    emoji: "👩🏽‍💻",
    title: "Code Quest",
    tag: "Coding & Software",
    about: "Learn how apps and games are made, one small step at a time.",
    theme: "violet",
    status: "soon",
    star: false,
  },
  {
    id: "data",
    emoji: "🔮",
    title: "Data & AI Lab",
    tag: "Data & AI",
    about: "Find patterns, ask big questions, and see how computers learn.",
    theme: "ocean",
    status: "soon",
    star: false,
  },
];

export const worldById = (id: string) => worlds.find((w) => w.id === id);
export const starWorlds = worlds.filter((w) => w.star);
export const liveWorlds = worlds.filter((w) => w.status === "live");

// A kid's level goes up with every star, so the map feels like a game.
export const levels = [
  { name: "Rookie", emoji: "🌱" },
  { name: "Explorer", emoji: "🧭" },
  { name: "Builder", emoji: "🛠️" },
  { name: "Tech Pro", emoji: "🚀" },
] as const;

export const levelFor = (stars: number) => levels[Math.min(stars, levels.length - 1)];
