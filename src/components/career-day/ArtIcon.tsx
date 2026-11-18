// The illustrated icon set for Tech Journey Jr. Every icon is drawn in SVG in one "sticker" style:
// bright flat colors, a dark outline, and a little shine, so they look the same on every phone
// (emoji change shape from device to device). They are decoration: hidden from screen readers
// unless a `label` is passed. The words next to them carry the meaning.

import type { ReactNode } from "react";

const INK = "#1E1B4B";

export type ArtIconName =
  | "helper"
  | "creator"
  | "gift"
  | "facts"
  | "cyber"
  | "coding"
  | "data"
  | "sprout"
  | "bolt"
  | "rookie"
  | "explorer"
  | "builder"
  | "techpro"
  | "star"
  | "lock"
  | "check"
  | "map"
  | "medal";

const o = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// A thick dark line with a lighter line on top, for strokes that need an outline too.
function Outlined({ d, color, width = 5 }: { d: string; color: string; width?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const shine = (d: string) => <path d={d} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />;

const art: Record<ArtIconName, ReactNode> = {
  // Be the Helper: a chat bubble with a heart.
  helper: (
    <>
      <path
        d="M20 8 H44 A12 12 0 0 1 56 20 V32 A12 12 0 0 1 44 44 H35 L21 57 L23 44 H20 A12 12 0 0 1 8 32 V20 A12 12 0 0 1 20 8 Z"
        fill="#fff"
        {...o}
      />
      <path d="M32 37 C19 29 20 18 27 18 C30 18 32 20 32 22 C32 20 34 18 37 18 C44 18 45 29 32 37 Z" fill="#F43F5E" {...o} />
      {shine("M25 22 C25 21 26 20 27 20")}
      <path d="M52 4 l1.8 4.6 4.6 1.8 -4.6 1.8 -1.8 4.6 -1.8 -4.6 -4.6 -1.8 4.6 -1.8z" fill="#FDE047" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),

  // Make a Show: a movie camera.
  creator: (
    <>
      <circle cx="17" cy="14" r="8" fill="#F472B6" {...o} />
      <circle cx="33" cy="14" r="8" fill="#F472B6" {...o} />
      <circle cx="17" cy="14" r="2.5" fill={INK} />
      <circle cx="33" cy="14" r="2.5" fill={INK} />
      <rect x="6" y="22" width="38" height="30" rx="8" fill="#38BDF8" {...o} />
      <path d="M44 31 L58 22 V52 L44 43 Z" fill="#FBBF24" {...o} />
      <circle cx="25" cy="37" r="9" fill="#fff" {...o} />
      <circle cx="25" cy="37" r="4.5" fill={INK} />
      <circle cx="23.5" cy="35.5" r="1.4" fill="#fff" />
      <circle cx="12" cy="28" r="2.2" fill="#F43F5E" />
    </>
  ),

  // Find Your Gift: a wrapped present.
  gift: (
    <>
      <path d="M32 22 C22 6 8 12 20 22 Z" fill="#FDE047" {...o} />
      <path d="M32 22 C42 6 56 12 44 22 Z" fill="#FDE047" {...o} />
      <rect x="9" y="30" width="46" height="27" rx="4" fill="#F43F5E" {...o} />
      <rect x="5" y="21" width="54" height="11" rx="4" fill="#FB7185" {...o} />
      <rect x="27" y="21" width="10" height="36" fill="#FDE047" {...o} />
      <path d="M13 38 V50" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
    </>
  ),

  // Cool Facts: a glowing lightbulb.
  facts: (
    <>
      <path
        d="M32 5 C20 5 13 13 13 23 C13 30 17 34 20 38 C22 41 22 43 22 45 H42 C42 43 42 41 44 38 C47 34 51 30 51 23 C51 13 44 5 32 5 Z"
        fill="#FDE047"
        {...o}
      />
      <rect x="22" y="45" width="20" height="6" rx="3" fill="#CBD5E1" {...o} />
      <rect x="26" y="51" width="12" height="7" rx="3.5" fill="#94A3B8" {...o} />
      {shine("M21 21 C22 15 26 11 31 11")}
      <path d="M32 18 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6z" fill="#F97316" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 22 H9 M55 22 H60 M8 8 L12 12 M56 8 L52 12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),

  // Cyber Defenders: a shield with a check.
  cyber: (
    <>
      <path d="M32 4 L57 13 V30 C57 45 47 54 32 61 C17 54 7 45 7 30 V13 Z" fill="#6366F1" {...o} />
      <path d="M32 4 L7 13 V30 C7 45 17 54 32 61 Z" fill="#818CF8" />
      <path d="M32 4 L57 13 V30 C57 45 47 54 32 61 C17 54 7 45 7 30 V13 Z" fill="none" {...o} />
      <path d="M32 11 L50 17 V30 C50 41 43 48 32 54 C21 48 14 41 14 30 V17 Z" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinejoin="round" />
      <Outlined d="M21 32 L29 40 L44 23" color="#fff" />
    </>
  ),

  // Code Quest: a laptop showing code.
  coding: (
    <>
      <rect x="9" y="9" width="46" height="34" rx="5" fill="#CBD5E1" {...o} />
      <rect x="14" y="14" width="36" height="24" rx="2" fill="#1E1B4B" />
      <path d="M25 20 L19 26 L25 32" fill="none" stroke="#34D399" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 19 L30 33" fill="none" stroke="#FDE047" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M40 20 L46 26 L40 32" fill="none" stroke="#F472B6" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 47 H61 L57 56 H7 Z" fill="#94A3B8" {...o} />
      <path d="M27 47 H37 L36 50 H28 Z" fill="#64748B" />
    </>
  ),

  // Data & AI Lab: a bar chart.
  data: (
    <>
      <rect x="6" y="6" width="52" height="52" rx="9" fill="#fff" {...o} />
      <rect x="14" y="34" width="9" height="17" rx="2" fill="#38BDF8" {...o} />
      <rect x="27" y="24" width="9" height="27" rx="2" fill="#A78BFA" {...o} />
      <rect x="40" y="13" width="9" height="38" rx="2" fill="#F472B6" {...o} />
      <path d="M13 55 H51" stroke={INK} strokeWidth="0" />
    </>
  ),

  // Tech Sprouts: a sunflower.
  sprout: (
    <>
      <Outlined d="M32 38 V60" color="#22C55E" />
      <path d="M32 54 C22 54 16 48 15 42 C24 42 31 46 32 54 Z" fill="#4ADE80" {...o} />
      <path d="M32 50 C42 50 48 44 49 38 C40 38 33 42 32 50 Z" fill="#86EFAC" {...o} />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="32" cy="12" rx="6" ry="9.5" fill="#FDE047" {...o} transform={`rotate(${i * 45} 32 27)`} />
      ))}
      <circle cx="32" cy="27" r="10" fill="#92400E" {...o} />
      <circle cx="28" cy="24" r="1.6" fill="#D97706" />
      <circle cx="35" cy="25" r="1.6" fill="#D97706" />
      <circle cx="31" cy="31" r="1.6" fill="#D97706" />
      <circle cx="36" cy="31" r="1.4" fill="#D97706" />
    </>
  ),

  // Tech Trailblazers: a lightning bolt.
  bolt: (
    <>
      <path d="M37 3 L11 36 H27 L22 61 L53 24 H36 Z" fill="#FDE047" {...o} />
      {shine("M33 11 L21 28")}
    </>
  ),

  // Level 1, Rookie: a seedling.
  rookie: (
    <>
      <path d="M12 58 C12 48 52 48 52 58 Z" fill="#92400E" {...o} />
      <Outlined d="M32 52 V34" color="#22C55E" width={4} />
      <path d="M32 40 C18 40 9 32 9 19 C23 19 32 27 32 40 Z" fill="#4ADE80" {...o} />
      <path d="M32 33 C32 20 41 11 55 11 C55 26 46 35 32 33 Z" fill="#86EFAC" {...o} />
    </>
  ),

  // Level 2, Explorer: a compass.
  explorer: (
    <>
      <circle cx="32" cy="32" r="27" fill="#FDE68A" {...o} />
      <circle cx="32" cy="32" r="20" fill="#fff" {...o} />
      <g transform="rotate(40 32 32)">
        <path d="M32 13 L39 32 H25 Z" fill="#F43F5E" {...o} />
        <path d="M32 51 L39 32 H25 Z" fill="#94A3B8" {...o} />
      </g>
      <circle cx="32" cy="32" r="3" fill={INK} />
      <path d="M32 6 V10 M32 54 V58 M6 32 H10 M54 32 H58" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),

  // Level 3, Builder: a hammer.
  builder: (
    <>
      <g transform="rotate(40 32 32)">
        <rect x="27" y="16" width="10" height="44" rx="4" fill="#F59E0B" {...o} />
        <rect x="10" y="4" width="44" height="18" rx="5" fill="#94A3B8" {...o} />
        <rect x="14" y="8" width="12" height="4" rx="2" fill="#fff" fillOpacity="0.6" />
      </g>
    </>
  ),

  // Level 4, Tech Pro: a rocket.
  techpro: (
    <>
      <path d="M20 40 L7 57 L23 52 Z" fill="#F43F5E" {...o} />
      <path d="M44 40 L57 57 L41 52 Z" fill="#F43F5E" {...o} />
      <path d="M25 51 C27 63 37 63 39 51 Z" fill="#FBBF24" {...o} />
      <path d="M32 3 C47 15 51 36 45 52 H19 C13 36 17 15 32 3 Z" fill="#F1F5F9" {...o} />
      <path d="M32 3 C40 9 44 16 46 24 H18 C20 16 24 9 32 3 Z" fill="#F43F5E" {...o} />
      <circle cx="32" cy="35" r="7" fill="#38BDF8" {...o} />
      {shine("M29 33 C29 32 30 31 31 31")}
    </>
  ),

  star: (
    <>
      <path d="M32 3 L40 23 L61 24 L45 38 L50 59 L32 47 L14 59 L19 38 L3 24 L24 23 Z" fill="#FDE047" {...o} />
      {shine("M26 22 L32 10")}
    </>
  ),

  lock: (
    <>
      <path d="M19 30 V21 A13 13 0 0 1 45 21 V30" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M19 30 V21 A13 13 0 0 1 45 21 V30" fill="none" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
      <rect x="10" y="28" width="44" height="30" rx="7" fill="#FBBF24" {...o} />
      <circle cx="32" cy="41" r="4.5" fill={INK} />
      <rect x="30" y="43" width="4" height="9" rx="2" fill={INK} />
    </>
  ),

  check: (
    <>
      <circle cx="32" cy="32" r="27" fill="#22C55E" {...o} />
      <Outlined d="M19 33 L28 42 L46 22" color="#fff" width={6} />
    </>
  ),

  map: (
    <>
      <path d="M5 14 L21 8 L43 14 L59 8 V50 L43 56 L21 50 L5 56 Z" fill="#FDE68A" {...o} />
      <path d="M21 8 V50 M43 14 V56" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 40 C20 28 28 44 36 32 S47 28 52 22" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeDasharray="1 5" strokeLinecap="round" />
      <path d="M50 17 l6 6 M56 17 l-6 6" stroke="#F43F5E" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),

  medal: (
    <>
      <path d="M17 3 H31 L37 28 H24 Z" fill="#F43F5E" {...o} />
      <path d="M47 3 H33 L27 28 H40 Z" fill="#38BDF8" {...o} />
      <circle cx="32" cy="41" r="18" fill="#FDE047" {...o} />
      <circle cx="32" cy="41" r="12" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
      <path d="M32 33 l2.6 5.2 5.8 .8 -4.2 4 1 5.8 -5.2 -2.8 -5.2 2.8 1 -5.8 -4.2 -4 5.8 -.8z" fill="#F59E0B" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
};

export default function ArtIcon({
  name,
  className = "h-10 w-10",
  label,
}: {
  name: ArtIconName;
  className?: string;
  /** Only when the icon stands alone with no words next to it. */
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {art[name]}
    </svg>
  );
}

// The icon for each world, band and level. Keeping this map here means a new world is one line.
export const worldArt: Record<string, ArtIconName> = {
  helper: "helper",
  creator: "creator",
  gift: "gift",
  facts: "facts",
  cyber: "cyber",
  coding: "coding",
  data: "data",
};

export const bandArt: Record<string, ArtIconName> = {
  "ages-5-7": "sprout",
  "ages-8-10": "bolt",
};

export const levelArt: Record<string, ArtIconName> = {
  Rookie: "rookie",
  Explorer: "explorer",
  Builder: "builder",
  "Tech Pro": "techpro",
};
