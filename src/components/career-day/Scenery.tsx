import ArtIcon, { type ArtIconName } from "./ArtIcon";

// Decorative artwork for the game. All of it is drawn in SVG, hidden from screen readers, and
// holds no information, so it can be changed freely.

// A few planets, a moon, and a little rocket drifting in the corners of the night sky.
export function SkyDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="cd-drift absolute -left-10 top-40 h-40 w-40 opacity-80 sm:left-6 sm:h-52 sm:w-52" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="sky-planet-a" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#FDA4AF" />
            <stop offset="0.6" stopColor="#E11D74" />
            <stop offset="1" stopColor="#7E1D5C" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="92" ry="22" fill="none" stroke="#FBCFE8" strokeOpacity="0.55" strokeWidth="6" transform="rotate(-18 100 100)" />
        <circle cx="100" cy="100" r="52" fill="url(#sky-planet-a)" />
        <path d="M58 92 C80 100 120 100 142 88" stroke="#fff" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M60 114 C84 122 118 122 140 110" stroke="#fff" strokeOpacity="0.16" strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="100" cy="100" rx="92" ry="22" fill="none" stroke="#FBCFE8" strokeOpacity="0.55" strokeWidth="6" strokeDasharray="0 150 120 400" transform="rotate(-18 100 100)" />
      </svg>

      <svg className="cd-drift-slow absolute -right-8 top-[26rem] h-32 w-32 opacity-70 sm:right-10 sm:h-44 sm:w-44" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="sky-planet-b" cx="30%" cy="28%" r="80%">
            <stop offset="0" stopColor="#A7F3D0" />
            <stop offset="0.6" stopColor="#0EA5A4" />
            <stop offset="1" stopColor="#134E6F" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="62" fill="url(#sky-planet-b)" />
        <circle cx="78" cy="84" r="11" fill="#134E6F" opacity="0.25" />
        <circle cx="124" cy="118" r="15" fill="#134E6F" opacity="0.22" />
        <circle cx="116" cy="76" r="6" fill="#134E6F" opacity="0.2" />
      </svg>

      <svg className="absolute right-[18%] top-24 hidden h-16 w-16 opacity-80 sm:block" viewBox="0 0 64 64">
        <path d="M42 8 A26 26 0 1 0 56 40 A20 20 0 1 1 42 8 Z" fill="#FDE68A" />
      </svg>

      <svg className="cd-drift absolute bottom-28 left-[8%] hidden h-24 w-24 -rotate-12 opacity-90 md:block" viewBox="0 0 100 100">
        <path d="M50 8 C66 22 70 44 64 66 L36 66 C30 44 34 22 50 8 Z" fill="#E2E8F0" />
        <path d="M50 8 C58 14 62 22 63 30 L37 30 C38 22 42 14 50 8 Z" fill="#F43F5E" />
        <circle cx="50" cy="44" r="8" fill="#38BDF8" stroke="#94A3B8" strokeWidth="3" />
        <path d="M36 56 L22 74 L38 70 Z M64 56 L78 74 L62 70 Z" fill="#F43F5E" />
        <path d="M42 70 C46 86 54 86 58 70 Z" fill="#FBBF24" />
      </svg>
    </div>
  );
}

// Sparkles and a soft wave along the bottom edge, for the colored top of a card. The wave is
// white so it blends into the white body of the card below it.
export function CardArt() {
  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="#fff" opacity="0.5">
          <path d="M34 36 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
          <path d="M262 52 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" />
          <path d="M240 128 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <circle cx="60" cy="118" r="3" />
          <circle cx="278" cy="96" r="2.5" />
          <circle cx="150" cy="22" r="2.5" />
        </g>
        <circle cx="-10" cy="190" r="70" fill="#fff" opacity="0.1" />
        <circle cx="320" cy="20" r="60" fill="#fff" opacity="0.1" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-5 w-full text-white"
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
      >
        <path d="M0 20 L0 12 C40 0 80 0 120 8 C170 18 220 18 300 4 L300 20 Z" fill="currentColor" />
      </svg>
    </>
  );
}

// Soft white shapes in the colored top of a card that hint at what the world is about, so each card
// has its own look. Pure decoration.
const scenes: Record<string, React.ReactNode> = {
  // chat bubbles and hearts
  helper: (
    <>
      <path d="M30 40 h54 a10 10 0 0 1 10 10 v16 a10 10 0 0 1 -10 10 h-34 l-12 12 v-12 h-8 a10 10 0 0 1 -10 -10 v-16 a10 10 0 0 1 10 -10z" />
      <path d="M214 96 h50 a9 9 0 0 1 9 9 v14 a9 9 0 0 1 -9 9 h-6 v11 l-11 -11 h-33 a9 9 0 0 1 -9 -9 v-14 a9 9 0 0 1 9 -9z" />
      <path d="M262 36 c-8 -5 -8 -13 -2 -13 c2 0 3 1 3 2.500 c0 -1.500 1 -2.500 3 -2.500 c6 0 6 8 -4 13z" />
    </>
  ),
  // film frames and play triangles
  creator: (
    <>
      <rect x="22" y="34" width="46" height="34" rx="6" />
      <rect x="236" y="110" width="44" height="32" rx="6" />
      <path d="M254 22 l16 9 -16 9z" />
      <path d="M44 120 l14 8 -14 8z" />
      <circle cx="262" cy="70" r="4" />
      <circle cx="40" cy="92" r="3" />
    </>
  ),
  // confetti pieces
  gift: (
    <>
      <rect x="34" y="30" width="14" height="6" rx="3" transform="rotate(-25 41 33)" />
      <rect x="250" y="34" width="14" height="6" rx="3" transform="rotate(30 257 37)" />
      <rect x="262" y="104" width="12" height="5" rx="2.500" transform="rotate(-40 268 106)" />
      <rect x="26" y="112" width="12" height="5" rx="2.500" transform="rotate(35 32 114)" />
      <circle cx="78" cy="22" r="4" />
      <circle cx="226" cy="26" r="3.500" />
      <circle cx="288" cy="72" r="3" />
      <path d="M52 76 q8 -10 16 0 t16 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  // lightning bolts and sparks
  facts: (
    <>
      <path d="M44 28 l-14 22 h10 l-5 18 20 -26 h-11z" />
      <path d="M262 96 l-12 19 h9 l-4 15 17 -22 h-9z" />
      <circle cx="252" cy="36" r="5" />
      <circle cx="70" cy="110" r="4" />
      <circle cx="286" cy="60" r="3" />
    </>
  ),
  // hex grid and a lock
  cyber: (
    <>
      <path d="M40 30 l12 -7 12 7 v14 l-12 7 -12 -7z" />
      <path d="M64 44 l12 -7 12 7 v14 l-12 7 -12 -7z" />
      <path d="M246 104 l12 -7 12 7 v14 l-12 7 -12 -7z" />
      <path d="M270 90 l12 -7 12 7 v14 l-12 7 -12 -7z" />
      <rect x="236" y="30" width="26" height="20" rx="4" />
      <path d="M241 30 v-5 a8 8 0 0 1 16 0 v5" fill="none" stroke="#fff" strokeWidth="3.500" />
    </>
  ),
  // code brackets
  coding: (
    <>
      <path d="M52 34 l-18 16 18 16" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M248 34 l18 16 -18 16" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M92 116 l8 -22" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="266" cy="116" r="4" />
    </>
  ),
  // bars and dots
  data: (
    <>
      <rect x="32" y="82" width="12" height="34" rx="3" />
      <rect x="50" y="62" width="12" height="54" rx="3" />
      <rect x="68" y="76" width="12" height="40" rx="3" />
      <circle cx="248" cy="40" r="5" />
      <circle cx="270" cy="62" r="4" />
      <circle cx="238" cy="96" r="3.500" />
      <path d="M248 40 L270 62 L238 96" fill="none" stroke="#fff" strokeWidth="2.500" strokeLinecap="round" />
    </>
  ),
  // a sun and little flowers
  "ages-5-7": (
    <>
      <circle cx="42" cy="38" r="14" />
      <g stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <path d="M42 12 v-4 M42 64 v4 M16 38 h-4 M68 38 h4 M24 20 l-3 -3 M60 56 l3 3 M60 20 l3 -3 M24 56 l-3 3" />
      </g>
      <circle cx="262" cy="104" r="7" />
      <circle cx="250" cy="116" r="5" />
      <circle cx="276" cy="120" r="5" />
    </>
  ),
  // bolts
  "ages-8-10": (
    <>
      <path d="M46 26 l-16 25 h11 l-6 20 22 -29 h-12z" />
      <path d="M262 92 l-13 21 h10 l-5 17 19 -24 h-10z" />
      <circle cx="254" cy="34" r="5" />
      <circle cx="84" cy="112" r="3.500" />
    </>
  ),
};

export function WorldScene({ id }: { id: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 300 150"
      preserveAspectRatio="xMidYMid slice"
      fill="#fff"
      fillOpacity="0.22"
    >
      {scene}
    </svg>
  );
}

// A sweep of light that crosses the colored top of a card when it is hovered or tapped.
export function Glint() {
  return (
    <span
      aria-hidden
      className="cd-glint pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/35 to-transparent"
    />
  );
}

// Little icons floating at the sides of the game's title, like toys around a stage.
export function HeroFloaters({ icons }: { icons: ArtIconName[] }) {
  const spots = [
    "left-[3%] top-12 h-14 w-14 lg:left-[7%] lg:h-16 lg:w-16",
    "right-[3%] top-14 h-14 w-14 lg:right-[7%] lg:h-16 lg:w-16",
    "left-[2%] top-[27rem] h-12 w-12 lg:left-[6%] lg:h-14 lg:w-14",
    "right-[2%] top-[17rem] h-12 w-12 lg:right-[6%] lg:h-14 lg:w-14",
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-[26rem] md:block">
      {icons.slice(0, spots.length).map((name, i) => (
        <span key={name} className={`absolute ${spots[i]}`} style={{ rotate: `${i % 2 ? 8 : -8}deg` }}>
          <span
            className="cd-float block h-full w-full drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)]"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <ArtIcon name={name} className="h-full w-full" />
          </span>
        </span>
      ))}
    </div>
  );
}
