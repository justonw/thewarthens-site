import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "You are invited to Atiya's Birthday Lunch. Tell us how many people are coming. Click to reveal the details.";
export const size = ogImageSize;
export const contentType = ogImageContentType;

// The picture that shows when the link is texted. It deliberately shows no date, time, or place: only the title, a prompt to say
// how many people are coming, and "click to reveal details".
export default async function Image() {
  const photo = `data:image/jpeg;base64,${(await readFile(path.join(process.cwd(), "public/birthday/og-atiya.jpg"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#a21caf",
          backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #c026d3 55%, #f43f5e 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 760, padding: "0 0 0 54px" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: "0.2em", color: "#fde68a" }}>YOU ARE INVITED</div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 78, lineHeight: 1.02, fontWeight: 700, color: "#ffffff" }}>Atiya&apos;s Birthday Lunch</div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 46, lineHeight: 1.1, fontWeight: 800, color: "#fde68a" }}>Tell us how many people are coming.</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 28,
              alignSelf: "flex-start",
              padding: "18px 36px",
              borderRadius: 999,
              backgroundColor: "#ffffff",
              color: "#be123c",
              fontSize: 42,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            CLICK TO REVEAL DETAILS
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 440, height: 630, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 340, height: 480, borderRadius: 36, overflow: "hidden", border: "8px solid #ffffff", transform: "rotate(3deg)" }}>
            <img src={photo} width={324} height={464} alt="" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
