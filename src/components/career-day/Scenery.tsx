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
