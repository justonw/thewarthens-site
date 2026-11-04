import type { ReactNode } from "react";
import {
  avatarEyeColors,
  avatarHairColors,
  avatarOutfitColors,
  avatarSkins,
  type AvatarLook,
  type HairStyle,
} from "@/lib/career-avatar";

// A friendly cartoon kid, drawn in SVG so every skin tone and hairstyle looks right
// (emoji cannot show twists, braids, locs, or puffs).

const TIE = "#F472B6";

// Small color helpers so shading (lighter skin on the cheeks, darker under the chin, a pastel
// backdrop that matches the shirt) follows whatever colors a child picks.
function mix(a: string, b: string, t: number) {
  const n = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = (i: number) => Math.round(n(a, i) + (n(b, i) - n(a, i)) * t);
  return `#${[0, 1, 2].map((i) => c(i).toString(16).padStart(2, "0")).join("")}`;
}
const lighten = (hex: string, t: number) => mix(hex, "#ffffff", t);
const darken = (hex: string, t: number) => mix(hex, "#000000", t);

// Hair that sits behind the head and shoulders.
function backHair(style: HairStyle, c: string, boy: boolean): ReactNode {
  switch (style) {
    case "twists":
      return (
        <g>
          <ellipse cx="60" cy="46" rx="33" ry="30" fill={c} />
          <g stroke={c} strokeWidth="5.5" strokeLinecap="round" fill="none">
            {[
              [30, 24],
              [36, 31],
              [23, 18],
            ].map(([x, end]) => (
              <g key={x}>
                <path d={`M${x} 48 C${end - 3} 60 ${end - 3} ${boy ? 62 : 76} ${end} ${boy ? 70 : 94}`} />
                <path d={`M${120 - x} 48 C${123 - end} 60 ${123 - end} ${boy ? 62 : 76} ${120 - end} ${boy ? 70 : 94}`} />
              </g>
            ))}
          </g>
          <g stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.2 3.6" opacity="0.4" fill="none">
            {[
              [30, 24],
              [36, 31],
              [23, 18],
            ].map(([x, end]) => (
              <g key={x}>
                <path d={`M${x} 48 C${end - 3} 60 ${end - 3} ${boy ? 62 : 76} ${end} ${boy ? 70 : 94}`} />
                <path d={`M${120 - x} 48 C${123 - end} 60 ${123 - end} ${boy ? 62 : 76} ${120 - end} ${boy ? 70 : 94}`} />
              </g>
            ))}
          </g>
        </g>
      );
    case "locs":
      return (
        <g stroke={c} strokeWidth="6" strokeLinecap="round" fill="none">
          {[
            [27, 25],
            [33, 31],
            [87, 89],
            [93, 95],
          ].map(([x, end]) => (
            <path key={x} d={`M${x} 44 C${end - 4} ${boy ? 54 : 62} ${end - 4} ${boy ? 64 : 80} ${end} ${boy ? 74 : 102}`} />
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
    case "bob":
      return (
        <path
          d="M29 52 C25 30 42 18 60 18 C78 18 95 30 91 52 L93 84 C93 90 88 92 82 90 L38 90 C32 92 27 90 27 84 Z"
          fill={c}
        />
      );
    case "long-wavy":
      return (
        <path
          d="M30 50 C26 28 42 17 60 17 C78 17 94 28 90 50 C98 64 90 76 97 90 C93 98 99 104 96 110 L24 110 C21 104 27 98 23 90 C30 76 22 64 30 50 Z"
          fill={c}
        />
      );
    case "braid":
      return null;
    case "shaggy":
    case "wavy":
    case "spiky":
    case "short":
      return null;
    case "pigtail-braids":
      return null;
    default:
      return null;
  }
}

// The hair cap that sits on top of the head, plus anything drawn over the face frame.
const CAP = "M33 58 C30 36 44 27 60 27 C76 27 90 36 87 58 C84 48 78 43 70 41 C62 45 52 45 46 41 C40 44 35 50 33 58 Z";
const CAP_HIGH = "M34 54 C32 40 44 31 60 31 C76 31 88 40 86 54 C82 47 74 43 66 42 C60 44 54 44 54 44 C46 43 38 47 34 54 Z";

function frontHair(style: HairStyle, c: string, boy: boolean): ReactNode {
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
          <path d="M60 31 L60 43" stroke="#000" strokeOpacity="0.22" strokeWidth="1.4" />
          <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1.2 3.8" opacity="0.4" fill="none">
            <path d="M38 50 C39 41 46 35 55 33" />
            <path d="M44 46 C46 40 51 37 57 36" />
            <path d="M82 50 C81 41 74 35 65 33" />
            <path d="M76 46 C74 40 69 37 63 36" />
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
            <path d={boy ? "M33 46 C30 54 30 62 31 72" : "M33 46 C29 62 29 78 30 96"} />
            <path d={boy ? "M87 46 C90 54 90 62 89 72" : "M87 46 C91 62 91 78 90 96"} />
          </g>
          <g
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="1.2 4"
            opacity="0.35"
            fill="none"
          >
            <path d={boy ? "M33 46 C30 54 30 62 31 72" : "M33 46 C29 62 29 78 30 96"} />
            <path d={boy ? "M87 46 C90 54 90 62 89 72" : "M87 46 C91 62 91 78 90 96"} />
            <path d="M42 44 C44 38 50 34 60 34" />
            <path d="M78 44 C76 38 70 34 60 34" />
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
    case "short":
      return (
        <g>
          <path
            d="M33 57 C29 36 44 26 62 26 C79 26 91 38 87 57 C85 47 80 41 70 40 C60 43 46 41 38 46 C35 49 34 53 33 57 Z"
            fill={c}
          />
          <path d="M48 33 C54 30 62 29 70 31" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      );
    case "shaggy":
      return (
        <g>
          <path
            d="M31 62 C26 34 44 24 60 24 C76 24 94 34 89 62 C88 52 84 46 78 44 C68 49 52 49 42 44 C36 46 32 52 31 62 Z"
            fill={c}
          />
          <path d="M31 62 L33 50 L38 60 Z M89 62 L87 50 L82 60 Z" fill={c} />
        </g>
      );
    case "wavy":
      return (
        <g>
          <path d={CAP_HIGH} fill={c} />
          <g stroke={c} strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M36 44 C40 34 46 40 50 32 C54 26 58 34 62 28 C66 24 72 34 76 30 C82 28 84 38 85 44" />
          </g>
          <path d="M40 38 C46 34 50 40 56 34" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case "spiky":
      return (
        <path
          d="M34 54 L35 36 L43 43 L46 28 L54 40 L60 24 L66 40 L74 28 L77 43 L85 36 L86 54 C82 46 72 42 60 42 C48 42 38 46 34 54 Z"
          fill={c}
          stroke={c}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "bob":
      return (
        <g>
          <path d={CAP} fill={c} />
          <path d="M33 52 L28 86 L41 88 L38 60 Z" fill={c} />
          <path d="M87 52 L92 86 L79 88 L82 60 Z" fill={c} />
        </g>
      );
    case "long-wavy":
      return (
        <g>
          <path d={CAP} fill={c} />
          <path d="M33 52 C27 64 35 74 28 90 C27 98 31 102 33 106 L43 106 C39 94 45 86 39 74 C36 68 38 62 38 58 Z" fill={c} />
          <path d="M87 52 C93 64 85 74 92 90 C93 98 89 102 87 106 L77 106 C81 94 75 86 81 74 C84 68 82 62 82 58 Z" fill={c} />
        </g>
      );
    case "space-buns":
      return (
        <g>
          <circle cx="36" cy="26" r="11" fill={c} />
          <circle cx="84" cy="26" r="11" fill={c} />
          <path d={CAP} fill={c} />
          <ellipse cx="38" cy="35" rx="7" ry="2.6" fill={TIE} />
          <ellipse cx="82" cy="35" rx="7" ry="2.6" fill={TIE} />
        </g>
      );
    case "braid":
      return (
        <g>
          <path d={CAP} fill={c} />
          <g fill={c}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <ellipse
                key={i}
                cx={i % 2 ? 91 : 87}
                cy={52 + i * 8}
                rx="5.5"
                ry="5"
                transform={`rotate(${i % 2 ? 20 : -20} ${i % 2 ? 91 : 87} ${52 + i * 8})`}
              />
            ))}
          </g>
          <circle cx="89" cy="108" r="3.6" fill={TIE} />
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
    default:
      return null;
  }
}

function freckles(): ReactNode {
  return (
    <g fill="#6B3A22" opacity="0.6">
      {[
        [44, 69],
        [49, 72],
        [54, 69],
        [66, 69],
        [71, 72],
        [76, 69],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
      ))}
    </g>
  );
}

function glasses(): ReactNode {
  return (
    <g fill="none" stroke="#1F2937" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="49" cy="60.5" r="8.6" fill="#fff" fillOpacity="0.18" />
      <circle cx="71" cy="60.5" r="8.6" fill="#fff" fillOpacity="0.18" />
      <path d="M57.6 59.5 Q60 57.5 62.4 59.5" />
      <path d="M40.5 59 L33 56.5" />
      <path d="M79.5 59 L87 56.5" />
    </g>
  );
}

function headphones(): ReactNode {
  return (
    <g>
      <path d="M31 58 C28 20 92 20 89 58" stroke="#334155" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="24" y="52" width="11" height="22" rx="5.5" fill="#F43F5E" />
      <rect x="85" y="52" width="11" height="22" rx="5.5" fill="#F43F5E" />
      <rect x="27" y="56" width="4" height="14" rx="2" fill="#fff" opacity="0.35" />
      <rect x="89" y="56" width="4" height="14" rx="2" fill="#fff" opacity="0.35" />
    </g>
  );
}

// A small colorful hearing aid curving over each ear.
function hearingAids(): ReactNode {
  return (
    <g>
      <path d="M32 54 C25 56 25 70 33 74 L36 70 C31 66 31 59 35 57 Z" fill="#38BDF8" />
      <path d="M88 54 C95 56 95 70 87 74 L84 70 C89 66 89 59 85 57 Z" fill="#38BDF8" />
      <circle cx="30" cy="62" r="1.6" fill="#fff" opacity="0.7" />
      <circle cx="90" cy="62" r="1.6" fill="#fff" opacity="0.7" />
    </g>
  );
}

function Outfit({ kind, color }: { kind: string; color: string }) {
  const dark = darken(color, 0.22);
  const light = lighten(color, 0.35);
  return (
    <g>
      {kind === "hoodie" && <path d="M28 100 C28 80 44 74 60 74 C76 74 92 80 92 100 Z" fill={dark} />}
      <path d="M14 124 C14 100 36 92 60 92 C84 92 106 100 106 124 Z" fill={color} />
      <clipPath id="avatar-torso">
        <path d="M14 124 C14 100 36 92 60 92 C84 92 106 100 106 124 Z" />
      </clipPath>
      {kind === "stripes" && (
        <g clipPath="url(#avatar-torso)" stroke={light} strokeWidth="3.2" opacity="0.9">
          <path d="M10 103 H110" />
          <path d="M10 111 H110" />
          <path d="M10 119 H110" />
        </g>
      )}
      {kind === "hoodie" && (
        <g>
          <path d="M47 93 Q60 108 73 93 Q60 100 47 93 Z" fill={dark} />
          <path d="M54 98 L53 110 M66 98 L67 110" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M38 124 L41 112 Q60 107 79 112 L82 124" stroke={dark} strokeWidth="1.6" fill="none" />
        </g>
      )}
      {kind === "jacket" && (
        <g>
          <path d="M47 93 L60 113 L73 93 Z" fill="#F8FAFC" />
          <path d="M47 93 L60 114 L38 124 M73 93 L60 114 L82 124" stroke={dark} strokeWidth="2.2" fill={dark} fillOpacity="0.35" strokeLinejoin="round" />
          <path d="M60 114 V124" stroke={dark} strokeWidth="1.6" />
        </g>
      )}
      {(kind === "tee" || kind === "stripes") && (
        <path d="M46 93 Q60 107 74 93" stroke={dark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
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
  const boy = look.gender === "boy";
  const skin = avatarSkins.find((s) => s.id === look.skin)?.hex ?? avatarSkins[2].hex;
  const hair = avatarHairColors.find((h) => h.id === look.hairColor)?.hex ?? avatarHairColors[0].hex;
  const outfitColor =
    avatarOutfitColors.find((c) => c.id === look.outfitColor)?.hex ?? avatarOutfitColors[0].hex;
  const eye = avatarEyeColors.find((e) => e.id === look.eyes)?.hex ?? avatarEyeColors[0].hex;
  const accessory = look.accessory ?? "none";

  const faceId = `avatar-face-${look.skin}`;
  const hairId = `avatar-hair-${look.hairColor}`;
  const bgId = `avatar-bg-${look.outfitColor ?? "blue"}`;
  const hairFill = `url(#${hairId})`;
  const brow = darken(hair, 0.25);
  const lip = mix(skin, "#A8323F", 0.55);
  const deepShade = darken(skin, 0.18);

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
        <clipPath id="avatar-clip">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
        <radialGradient id={faceId} cx="45%" cy="38%" r="70%">
          <stop offset="0" stopColor={lighten(skin, 0.14)} />
          <stop offset="0.7" stopColor={skin} />
          <stop offset="1" stopColor={darken(skin, 0.1)} />
        </radialGradient>
        <linearGradient id={hairId} gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="112">
          <stop offset="0" stopColor={lighten(hair, 0.22)} />
          <stop offset="0.45" stopColor={hair} />
          <stop offset="1" stopColor={darken(hair, 0.2)} />
        </linearGradient>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(outfitColor, 0.88)} />
          <stop offset="1" stopColor={lighten(outfitColor, 0.7)} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="60" fill={`url(#${bgId})`} />
      <g clipPath="url(#avatar-clip)">
        {backHair(look.hair, hairFill, boy)}
        <Outfit kind={look.outfit ?? "hoodie"} color={outfitColor} />
        <rect x="52" y="78" width="16" height="18" rx="6" fill={skin} />
        <path d="M52 86 Q60 94 68 86 L68 92 L52 92 Z" fill="#000" opacity="0.12" />
        <circle cx="34" cy="62" r="5.5" fill={skin} />
        <circle cx="86" cy="62" r="5.5" fill={skin} />
        <circle cx="34" cy="62.5" r="2.6" fill={deepShade} opacity="0.55" />
        <circle cx="86" cy="62.5" r="2.6" fill={deepShade} opacity="0.55" />
        <path
          d={
            boy
              ? "M33 56 C33 37 45 28 60 28 C75 28 87 37 87 56 C87 77 77 90 60 90 C43 90 33 77 33 56 Z"
              : "M33 56 C33 37 45 28 60 28 C75 28 87 37 87 56 C87 75 76 89 60 89 C44 89 33 75 33 56 Z"
          }
          fill={`url(#${faceId})`}
        />
        <path d="M36 70 C40 84 51 89 60 89 C69 89 80 84 84 70 C79 80 70 85 60 85 C50 85 41 80 36 70 Z" fill="#000" opacity="0.07" />
        {!boy && (
          <>
            <circle cx="42" cy="70" r="5.5" fill="#F2788F" opacity="0.22" />
            <circle cx="78" cy="70" r="5.5" fill="#F2788F" opacity="0.22" />
          </>
        )}
        {[49, 71].map((cx, i) => (
          <g key={cx}>
            <ellipse cx={cx} cy="60" rx="5.2" ry="4.4" fill="#fff" />
            <circle cx={cx + 0.3} cy="60.3" r="3.3" fill={eye} />
            <circle cx={cx + 0.3} cy="60.3" r="1.6" fill="#120C09" />
            <circle cx={cx + 1.5} cy="59" r="1" fill="#fff" />
            <path
              d={`M${cx - 5.4} 60 Q${cx} 54.6 ${cx + 5.4} 60`}
              stroke="#1D1411"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            {!boy && (
              <path
                d={i === 0 ? "M43.6 59.4 L41.4 57" : "M76.4 59.4 L78.6 57"}
                stroke="#1D1411"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
            <path
              d={`M${cx - 6} ${boy ? 51.5 : 52.5} Q${cx} ${boy ? 47.5 : 48.5} ${cx + 6.2} ${boy ? 51 : 52}`}
              stroke={brow}
              strokeWidth={boy ? 3 : 2.3}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ))}
        <path d="M60 60 L59 67" stroke={lighten(skin, 0.35)} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
        <path d="M55.5 69 Q60 72.5 64.5 69" stroke={darken(skin, 0.28)} strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <path d="M50.5 74 Q60 85 69.5 74 Q60 78 50.5 74 Z" fill="#7B2D33" />
        <path d="M52.6 75 Q60 80.5 67.4 75 Q60 77.6 52.6 75 Z" fill="#fff" />
        <path d="M49.6 73.4 Q60 78.6 70.4 73.4" stroke={lip} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M54 81 Q60 85 66 81" stroke={lip} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
        {frontHair(look.hair, hairFill, boy)}
        {accessory === "freckles" && freckles()}
        {accessory === "glasses" && glasses()}
        {accessory === "headphones" && headphones()}
        {accessory === "hearing-aids" && hearingAids()}
      </g>
    </svg>
  );
}
