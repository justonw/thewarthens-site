import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "You are invited to Atiya's Birthday Lunch, Sunday December 6 at Chattahoochee Food Works. Tap the link for details and to RSVP.";
export const size = ogImageSize;
export const contentType = ogImageContentType;

// The picture that shows when the link is texted. It has to say two things at a glance: this is an invitation,
// and the details are behind the link ("TAP THE LINK FOR DETAILS").
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
          backgroundImage:
            "linear-gradient(135deg, #7c3aed 0%, #c026d3 55%, #f43f5e 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 690, padding: "0 0 0 60px" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: "0.2em", color: "#fde68a" }}>YOU ARE INVITED</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 84, lineHeight: 1.02, fontWeight: 700, color: "#ffffff" }}>Atiya&apos;s Birthday Lunch</div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 36, fontWeight: 700, color: "#ffffff" }}>Sunday, Dec 6 · arrive 12:28 to 12:43</div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 30, color: "#fce7f3" }}>Chattahoochee Food Works, Atlanta</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 34,
              alignSelf: "flex-start",
              padding: "16px 30px",
              borderRadius: 999,
              backgroundColor: "#ffffff",
              color: "#be123c",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            TAP THE LINK FOR DETAILS
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 28, fontWeight: 700, color: "#fde68a" }}>RSVP by Saturday, Nov 28</div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 450, height: 630, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 370, height: 520, borderRadius: 36, overflow: "hidden", border: "8px solid #ffffff", transform: "rotate(3deg)" }}>
            <img src={photo} width={354} height={504} alt="" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
