import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Good is not always God. “Bad” is not always the devil. Source of Life, Faith Journey with The Warthens.";
export const size = ogImageSize;
export const contentType = ogImageContentType;

// Two equations, each struck through, then "Not always." Built to read at thumbnail size: big bold
// type, a thin strike that leaves the words readable, and the logo so it is clearly ours when reposted.
function Equation({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: 548,
        height: 176,
        borderRadius: 28,
        border: "2px solid rgba(255,255,255,0.2)",
        backgroundColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ display: "flex", fontSize: 62, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>{text}</div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 28,
          right: 28,
          top: 104,
          height: 7,
          borderRadius: 4,
          backgroundColor: "#fbbf24",
          transform: "rotate(-6deg)",
        }}
      />
    </div>
  );
}

export default async function Image() {
  const logo = `data:image/png;base64,${(await readFile(path.join(process.cwd(), "public/brand/icon-square.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 52,
          backgroundColor: "#0a0c1d",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(120,73,206,0.55), transparent 60%), radial-gradient(circle at 90% 100%, rgba(251,191,36,0.20), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "0.22em", color: "#fcd34d" }}>SOURCE OF LIFE</div>
        <div style={{ display: "flex", marginTop: 26 }}>
          <Equation text="GOOD = GOD?" />
          <div style={{ width: 24, display: "flex" }} />
          <Equation text="BAD = DEVIL?" />
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 104, fontWeight: 700, color: "#fcd34d", letterSpacing: "-0.02em" }}>Not always.</div>
        <div style={{ display: "flex", marginTop: 2, fontSize: 36, fontWeight: 700, color: "#e2e8f0" }}>Who is really in control?</div>
        <div style={{ display: "flex", position: "absolute", left: 44, bottom: 34, alignItems: "center" }}>
          <img src={logo} width={52} height={52} alt="" style={{ borderRadius: 12 }} />
          <div style={{ display: "flex", marginLeft: 16, fontSize: 28, fontWeight: 700, color: "#cbd5e1" }}>thewarthens.com</div>
        </div>
      </div>
    ),
    size
  );
}
