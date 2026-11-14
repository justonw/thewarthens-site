import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Good is not always God. “Bad” is not always the devil. Source of Life, Faith Journey with The Warthens.";
export const size = ogImageSize;
export const contentType = ogImageContentType;

// Two equations, each struck through, then "Not always." Built to read at thumbnail size.
function Equation({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: 520,
        height: 190,
        borderRadius: 28,
        border: "2px solid rgba(255,255,255,0.16)",
        backgroundColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", fontSize: 58, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>{text}</div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 26,
          right: 26,
          top: 99,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#fbbf24",
          transform: "rotate(-8deg)",
        }}
      />
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0c1d",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(120,73,206,0.55), transparent 60%), radial-gradient(circle at 90% 100%, rgba(251,191,36,0.20), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: "0.22em", color: "#fcd34d" }}>SOURCE OF LIFE</div>
        <div style={{ display: "flex", marginTop: 34 }}>
          <Equation text="GOOD = GOD?" />
          <div style={{ width: 24, display: "flex" }} />
          <Equation text="BAD = DEVIL?" />
        </div>
        <div style={{ display: "flex", marginTop: 34, fontSize: 92, fontWeight: 800, color: "#fcd34d", letterSpacing: "-0.02em" }}>Not always.</div>
        <div style={{ display: "flex", marginTop: 6, fontSize: 30, color: "#cbd5e1" }}>Who is really in control?</div>
      </div>
    ),
    size
  );
}
