import { readFileSync } from "node:fs";
import path from "node:path";

// The preview card for every Tech Journey Jr. page: a bright night-sky card with the Tech Crew,
// so a link to the kids' game looks like the kids' game when it is shared in a message.

// The crew pictures are saved as SVG files in public/og/crew (one per Tech Crew member). If the
// look of a crew member changes in lib/career-avatar.ts, save a fresh copy of their avatar there.
const avatarSrc = (id: string) => {
  try {
    const svg = readFileSync(path.join(process.cwd(), "public/og/crew", `${id}.svg`));
    return `data:image/svg+xml;base64,${svg.toString("base64")}`;
  } catch {
    return "";
  }
};

const STARS: [number, number, number][] = [
  [60, 70, 5],
  [170, 40, 3],
  [330, 90, 4],
  [520, 36, 3],
  [760, 80, 5],
  [940, 44, 4],
  [1130, 100, 3],
  [90, 300, 3],
  [1150, 300, 4],
  [1100, 520, 5],
  [40, 560, 3],
  [600, 590, 3],
];

export function renderKidsOg({
  eyebrow,
  title,
  subtitle,
  crew = ["maya", "kenji", "emma", "jamal", "joy"],
  badges = ["Free", "No ads", "No sign-in"],
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  crew?: string[];
  badges?: string[];
}) {
  const faces = crew.slice(0, 4);
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        backgroundColor: "#1a1250",
        backgroundImage:
          "radial-gradient(circle at 12% 0%, rgba(124,58,237,0.7), transparent 55%), radial-gradient(circle at 100% 8%, rgba(14,165,233,0.5), transparent 50%), radial-gradient(circle at 55% 110%, rgba(236,72,153,0.5), transparent 55%)",
        padding: "56px 70px 44px",
      }}
    >
      {STARS.map(([x, y, r]) => (
        <div
          key={`${x}-${y}`}
          style={{
            display: "flex",
            position: "absolute",
            left: x,
            top: y,
            width: r * 2,
            height: r * 2,
            borderRadius: 999,
            backgroundColor: "#fde68a",
            opacity: 0.85,
          }}
        />
      ))}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#1a1250",
              backgroundColor: "#fcd34d",
              padding: "8px 22px",
              borderRadius: 999,
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            maxWidth: 1060,
            fontSize: title.length > 40 ? 62 : 76,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ display: "flex", marginTop: 18, maxWidth: 980, fontSize: 32, color: "#dbe4ff", lineHeight: 1.25 }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            {badges.map((b) => (
              <div
                key={b}
                style={{
                  display: "flex",
                  marginRight: 12,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#ffffff",
                  border: "3px solid rgba(255,255,255,0.7)",
                  padding: "6px 20px",
                  borderRadius: 999,
                }}
              >
                {b}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 28, color: "#c7d2fe" }}>
            thewarthens.com/techjr
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {faces.map((id, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={id}
              src={avatarSrc(id)}
              alt=""
              width={160}
              height={160}
              style={{ width: 160, height: 160, marginLeft: i === 0 ? 0 : -26 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
