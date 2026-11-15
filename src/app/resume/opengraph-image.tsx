import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Boost your chances of being interviewed. Tailor your resume to every job you apply for. Resume Builder by The Warthens.";
export const size = ogImageSize;
export const contentType = ogImageContentType;

// The share image says the outcome in big type, and shows a resume that has been tailored to a job:
// the job title matched, a few skills ticked. No numbers, so there is nothing to keep up to date.
function Line({ width, color = "#cbd5e1", height = 12 }: { width: number; color?: string; height?: number }) {
  return <div style={{ display: "flex", width, height, borderRadius: 6, backgroundColor: color, marginTop: 12 }} />;
}

function Check({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: "#16a34a",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 9,
            height: 16,
            marginTop: -3,
            borderRight: "4px solid #ffffff",
            borderBottom: "4px solid #ffffff",
            transform: "rotate(45deg)",
          }}
        />
      </div>
      <div style={{ display: "flex", marginLeft: 14, fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{label}</div>
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
          position: "relative",
          backgroundColor: "#3b2bd0",
          backgroundImage:
            "linear-gradient(135deg, #1e40e0 0%, #4c2fd6 52%, #8b3df0 100%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.22), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 700, paddingLeft: 64, paddingTop: 70 }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: "0.2em", color: "#c7d2fe" }}>RESUME BUILDER</div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 80, fontWeight: 700, lineHeight: 1.04, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Boost your chances of being interviewed.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 36, fontWeight: 700, color: "#e0e7ff", lineHeight: 1.2 }}>
            A resume tailored to every job you apply for.
          </div>
        </div>

        <div style={{ display: "flex", position: "absolute", right: 56, top: 70, width: 400, height: 480, transform: "rotate(3deg)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 400,
              height: 480,
              borderRadius: 22,
              backgroundColor: "#ffffff",
              padding: 34,
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", width: 190, height: 22, borderRadius: 8, backgroundColor: "#0f172a" }} />
            <div style={{ display: "flex", marginTop: 14, fontSize: 24, fontWeight: 700, color: "#1d4ed8", backgroundColor: "#dbeafe", padding: "4px 10px", borderRadius: 8, alignSelf: "flex-start" }}>
              Job title matched
            </div>
            <Line width={250} />
            <div style={{ display: "flex", width: "100%", height: 2, backgroundColor: "#0f172a", marginTop: 26 }} />
            <Check label="Skills the job asks for" />
            <Check label="Wording from the posting" />
            <Check label="Clean, scannable layout" />
            <div style={{ display: "flex", width: "100%", height: 2, backgroundColor: "#0f172a", marginTop: 26 }} />
            <Line width={320} />
            <Line width={280} />
            <Line width={300} />
          </div>
        </div>

        <div style={{ display: "flex", position: "absolute", left: 64, bottom: 40, alignItems: "center" }}>
          <img src={logo} width={52} height={52} alt="" style={{ borderRadius: 12 }} />
          <div style={{ display: "flex", marginLeft: 16, fontSize: 28, fontWeight: 700, color: "#e0e7ff" }}>thewarthens.com/resume</div>
        </div>
      </div>
    ),
    size
  );
}
