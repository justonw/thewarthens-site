import { readFile } from "node:fs/promises";
import path from "node:path";

// Preview cards (the image that shows when a link is shared in a message or on social media) with
// real photos. The small photos live in public/og, resized from the originals so these stay light.

const photo = async (name: string) =>
  `data:image/jpeg;base64,${(await readFile(path.join(process.cwd(), "public/og", `${name}.jpg`))).toString("base64")}`;

const accents = {
  blue: {
    glow: "radial-gradient(circle at 18% 15%, rgba(139,92,246,0.38), transparent 55%), radial-gradient(circle at 85% 10%, rgba(56,189,248,0.34), transparent 50%)",
    eyebrow: "#7dd3fc",
    ring: "linear-gradient(135deg, #38bdf8, #6366f1)",
  },
  mauve: {
    glow: "radial-gradient(circle at 18% 15%, rgba(199,143,160,0.4), transparent 55%), radial-gradient(circle at 85% 10%, rgba(244,184,160,0.3), transparent 50%)",
    eyebrow: "#f3b6c6",
    ring: "linear-gradient(135deg, #f0a3b6, #c78fa0)",
  },
  violet: {
    glow: "radial-gradient(circle at 18% 15%, rgba(139,92,246,0.42), transparent 55%), radial-gradient(circle at 85% 10%, rgba(217,70,239,0.25), transparent 50%)",
    eyebrow: "#c4b5fd",
    ring: "linear-gradient(135deg, #a855f7, #38bdf8)",
  },
} as const;

export async function renderPhotoOg({
  eyebrow,
  title,
  subtitle,
  photos,
  accent = "blue",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  photos: { file: string; caption?: string }[];
  accent?: keyof typeof accents;
}) {
  const a = accents[accent];
  const srcs = await Promise.all(photos.map((p) => photo(p.file)));
  const wide = photos.length === 1 && photos[0].file === "wws";
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#090c14",
        backgroundImage: a.glow,
        padding: "0 70px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: wide ? 520 : 600 }}>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: a.eyebrow,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: title.length > 34 ? 56 : 66,
            fontWeight: 700,
            color: "#f3f5fb",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: "#c3cbe0", lineHeight: 1.3 }}>
            {subtitle}
          </div>
        )}
        <div style={{ display: "flex", marginTop: 34, fontSize: 28, color: "#8b95b0" }}>The Warthens · thewarthens.com</div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {srcs.map((src, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              width: wide ? 460 : 280,
              height: wide ? 330 : 400,
              marginLeft: i === 0 ? 0 : -24,
              marginTop: i === 1 ? 70 : 0,
              padding: 5,
              borderRadius: 36,
              backgroundImage: a.ring,
              transform: `rotate(${srcs.length === 1 ? 0 : i === 0 ? -3 : 3}deg)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              width={wide ? 450 : 270}
              height={wide ? 320 : 390}
              style={{ width: "100%", height: "100%", borderRadius: 31, objectFit: "cover", objectPosition: "50% 22%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
