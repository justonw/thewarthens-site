import type { ReactNode } from "react";
import {
  avatarHairColors,
  avatarSkins,
  type AvatarLook,
  type HairStyle,
} from "@/lib/career-avatar";

// A friendly cartoon kid, drawn in SVG so every skin tone and hairstyle looks right
// (emoji cannot show twists, braids, locs, or puffs).

const SHIRT = "#4F8DF7";
const TIE = "#F472B6";
const BG = "#E0F2FE";

// Hair that sits behind the head and shoulders.
function backHair(style: HairStyle, c: string): ReactNode {
  switch (style) {
    case "locs":
      return (
        <g stroke={c} strokeWidth="6" strokeLinecap="round" fill="none">
          {[30, 36, 42].map((x) => (
            <path key={x} d={`M${x + 4} 40 C${x - 4} 56 ${x - 4} 72 ${x - 2} 92`} />
          ))}
          {[78, 84, 90].map((x) => (
            <path key={x} d={`M${x - 4} 40 C${x + 4} 56 ${x + 4} 72 ${x + 2} 92`} />
          ))}
        </g>
      );
    case "afro":
      return <circle cx="60" cy="46" r="40" fill={c} />;
    case "big-curls":
      return (
        <g fill={c}>
          <circle cx="60" cy="46" r="39" />
          {[
            [24, 40],
            [28, 62],
            [96, 40],
            [92, 62],
            [40, 14],
            [60, 8],
            [80, 14],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="9" />
          ))}
        </g>
      );
    case "puffs":
      return (
        <g fill={c}>
          <circle cx="32" cy="30" r="16" />
          <circle cx="88" cy="30" r="16" />
        </g>
      );
    case "box-braids":
      return (
        <path d="M29 52 C25 28 42 18 60 18 C78 18 95 28 91 52 L93 100 L27 100 Z" fill={c} />
      );
    case "long-straight":
      return (
        <path d="M30 50 C26 28 42 17 60 17 C78 17 94 28 90 50 L96 104 L24 104 Z" fill={c} />
      );
    case "ponytail":
      return (
        <path d="M80 34 C108 26 118 62 102 98 C98 72 92 58 80 52 Z" fill={c} />
      );
    case "pigtail-braids":
      return null;
    default:
      return null;
  }
}

// The hair cap that sits on top of the head, plus anything drawn over the face frame.
const CAP = "M33 58 C30 36 44 27 60 27 C76 27 90 36 87 58 C84 48 78 43 70 41 C62 45 52 45 46 41 C40 44 35 50 33 58 Z";
const CAP_HIGH = "M34 54 C32 40 44 31 60 31 C76 31 88 40 86 54 C82 47 74 43 66 42 C60 44 54 44 54 44 C46 43 38 47 34 54 Z";

function frontHair(style: HairStyle, c: string): ReactNode {
  switch (style) {
    case "low-cut":
      return <path d={CAP_HIGH} fill={c} />;
    case "fade":
      return (
        <g>
          <path d={CAP_HIGH} fill={c} />
          <ellipse cx="34" cy="55" rx="3.5" ry="9" fill={c} opacity="0.35" />
          <ellipse cx="86" cy="55" rx="3.5" ry="9" fill={c} opacity="0.35" />
        </g>
      );
    case "high-top":
      return (
        <path
          d="M35 54 L34 30 Q35 20 48 20 L72 20 Q85 20 86 30 L85 54 C81 46 71 43 60 43 C49 43 39 46 35 54 Z"
          fill={c}
        />
      );
    case "twists":
      return (
        <g>
          <path d={CAP_HIGH} fill={c} />
          <g stroke={c} strokeWidth="6.5" strokeLinecap="round" fill="none">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const x = 38 + i * 5.5;
              const lean = (i - 4) * 1.6;
              return <path key={i} d={`M${x} 40 L${x + lean} 21`} />;
            })}
          </g>
          <g
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="1.2 4"
            opacity="0.4"
            fill="none"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const x = 38 + i * 5.5;
              const lean = (i - 4) * 1.6;
              return <path key={i} d={`M${x} 40 L${x + lean} 21`} />;
            })}
          </g>
        </g>
      );
    case "cornrows":
      return (
        <g>
          <path d={CAP} fill={c} />
          <g stroke="#fff" strokeWidth="1.7" strokeLinecap="round" opacity="0.35" fill="none">
            <path d="M41 46 C40 38 44 31 50 28" />
            <path d="M50 43 C49 36 52 30 56 27.5" />
            <path d="M60 42 L60 27" />
            <path d="M70 43 C71 36 68 30 64 27.5" />
            <path d="M79 46 C80 38 76 31 70 28" />
          </g>
        </g>
      );
    case "locs":
      return (
        <g>
          <path d={CAP_HIGH} fill={c} />
          <g stroke={c} strokeWidth="6" strokeLinecap="round" fill="none">
            {[40, 48, 56, 64, 72, 80].map((x, i) => (
              <path key={x} d={`M${x} 38 L${x + (i - 2.5) * 1.8} 24`} />
            ))}
            <path d="M33 46 C29 62 29 76 31 90" />
            <path d="M87 46 C91 62 91 76 89 90" />
          </g>
        </g>
      );
    case "afro":
      return (
        <path
          d="M35 54 C38 40 50 34 60 34 C70 34 82 40 85 54 C80 46 72 42 60 42 C48 42 40 46 35 54 Z"
          fill={c}
        />
      );
    case "curly-top":
      return (
        <g fill={c}>
          <path d={CAP_HIGH} />
          {[
            [40, 34],
            [49, 28],
            [60, 26],
            [71, 28],
            [80, 34],
            [45, 38],
            [60, 36],
            [75, 38],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="7.5" />
          ))}
        </g>
      );
    case "puffs":
      return (
        <g>
          <path d={CAP} fill={c} />
          <circle cx="38" cy="38" r="3.6" fill={TIE} />
          <circle cx="82" cy="38" r="3.6" fill={TIE} />
        </g>
      );
    case "box-braids":
      return (
        <g>
          <path d={CAP} fill={c} />
          <path d="M60 28 L60 44" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
          <g stroke={c} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M34 54 C28 70 28 86 30 104" />
            <path d="M42 56 C38 72 38 88 40 104" />
            <path d="M86 54 C92 70 92 86 90 104" />
            <path d="M78 56 C82 72 82 88 80 104" />
          </g>
          <g fill={TIE}>
            <circle cx="30" cy="101" r="3.2" />
            <circle cx="40" cy="101" r="3.2" />
            <circle cx="90" cy="101" r="3.2" />
            <circle cx="80" cy="101" r="3.2" />
          </g>
        </g>
      );
    case "ponytail":
      return (
        <g>
          <path d={CAP} fill={c} />
          <circle cx="84" cy="40" r="5" fill={TIE} />
        </g>
      );
    case "bun":
      return (
        <g>
          <circle cx="60" cy="20" r="13" fill={c} />
          <path d={CAP} fill={c} />
          <ellipse cx="60" cy="31" rx="11" ry="3.4" fill={TIE} />
        </g>
      );
    case "long-straight":
      return (
        <g>
          <path d={CAP} fill={c} />
          <path d="M33 52 L25 104 L41 104 L38 60 Z" fill={c} />
          <path d="M87 52 L95 104 L79 104 L82 60 Z" fill={c} />
        </g>
      );
    case "big-curls":
      return (
        <g>
          <path
            d="M35 54 C38 40 50 34 60 34 C70 34 82 40 85 54 C80 46 72 42 60 42 C48 42 40 46 35 54 Z"
            fill={c}
          />
          <g fill={TIE}>
            <path d="M86 28 L100 20 L98 36 Z" />
            <path d="M86 28 L74 18 L72 34 Z" />
            <circle cx="86" cy="28" r="4" />
          </g>
        </g>
      );
    case "bantu-knots":
      return (
        <g fill={c}>
          <path d={CAP_HIGH} />
          {[
            [38, 36],
            [49, 28],
            [60, 25],
            [71, 28],
            [82, 36],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="7.5" />
              <circle cx={x} cy={y} r="3" fill="#fff" opacity="0.18" />
            </g>
          ))}
        </g>
      );
    case "pigtail-braids":
      return (
        <g>
          <path d={CAP} fill={c} />
          <g stroke={c} strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M34 50 C24 62 28 76 24 94" />
            <path d="M86 50 C96 62 92 76 96 94" />
          </g>
          <g
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="1.4 4"
            opacity="0.4"
            fill="none"
          >
            <path d="M34 50 C24 62 28 76 24 94" />
            <path d="M86 50 C96 62 92 76 96 94" />
          </g>
          <circle cx="34" cy="50" r="4" fill={TIE} />
          <circle cx="86" cy="50" r="4" fill={TIE} />
        </g>
      );
  }
}

export default function Avatar({
  look,
  size = 96,
  label,
  className = "",
}: {
  look: AvatarLook;
  size?: number;
  label?: string;
  className?: string;
}) {
  const skin = avatarSkins.find((s) => s.id === look.skin)?.hex ?? avatarSkins[3].hex;
  const hair = avatarHairColors.find((h) => h.id === look.hairColor)?.hex ?? avatarHairColors[0].hex;
  const clip = `avatar-clip-${look.gender}-${look.skin}-${look.hair}-${look.hairColor}`;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="60" fill={BG} />
      <g clipPath={`url(#${clip})`}>
        {backHair(look.hair, hair)}
        <path d="M16 124 C16 100 38 92 60 92 C82 92 104 100 104 124 Z" fill={SHIRT} />
        <rect x="52" y="80" width="16" height="16" rx="6" fill={skin} />
        <rect x="52" y="80" width="16" height="16" rx="6" fill="#000" opacity="0.12" />
        <circle cx="34" cy="62" r="5.5" fill={skin} />
        <circle cx="86" cy="62" r="5.5" fill={skin} />
        <ellipse cx="60" cy="58" rx="27" ry="29" fill={skin} />
        <circle cx="42" cy="70" r="5" fill="#F2788F" opacity="0.28" />
        <circle cx="78" cy="70" r="5" fill="#F2788F" opacity="0.28" />
        <ellipse cx="49" cy="60" rx="4.3" ry="4.8" fill="#fff" />
        <ellipse cx="71" cy="60" rx="4.3" ry="4.8" fill="#fff" />
        <circle cx="49.4" cy="60.6" r="2.9" fill="#1D1411" />
        <circle cx="71.4" cy="60.6" r="2.9" fill="#1D1411" />
        <circle cx="50.3" cy="59.5" r="0.9" fill="#fff" />
        <circle cx="72.3" cy="59.5" r="0.9" fill="#fff" />
        <path d="M43 52 Q49 49 55 52" stroke="#2B1B13" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M65 52 Q71 49 77 52" stroke="#2B1B13" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M58 66 Q60 69 62 66" stroke="#000" strokeOpacity="0.22" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M50 72 Q60 83 70 72 Q60 76 50 72 Z" fill="#8B2F2F" />
        {frontHair(look.hair, hair)}
      </g>
    </svg>
  );
}
