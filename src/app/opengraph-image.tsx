import { ImageResponse } from "next/og";

export const alt = "The Warthens — Tech Journey & Faith Journey";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#090c14",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 80% 15%, rgba(56,189,248,0.30), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #38bdf8 100%)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: "#0a0d16" }}>W</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#f3f5fb",
            letterSpacing: "-0.02em",
          }}
        >
          The Warthens
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 32,
            color: "#a3aec7",
          }}
        >
          Tech Journey &amp; Faith Journey
        </div>
      </div>
    ),
    { ...size }
  );
}
