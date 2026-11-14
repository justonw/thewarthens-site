import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { verses } from "@/lib/source-of-life-verses";

// A shareable image for any verse on the Source of Life page.
//   /source-of-life/card/<verse id>                 square, for feeds and messages (1080 x 1080)
//   /source-of-life/card/<verse id>?format=story    tall, for stories and Shorts (1080 x 1920)
// The verse text comes from the same King James Version data as the page.

const MAX_CHARS = 480;

function fit(text: string): { text: string; cut: boolean } {
  if (text.length <= MAX_CHARS) return { text, cut: false };
  const head = text.slice(0, MAX_CHARS);
  const sentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("; "), head.lastIndexOf(": "));
  const end = sentence > MAX_CHARS * 0.5 ? sentence + 1 : head.lastIndexOf(" ");
  return { text: head.slice(0, end).trim() + (sentence > MAX_CHARS * 0.5 ? "" : "…"), cut: true };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verse = verses.find((v) => v.id === id);
  if (!verse) return new Response("Verse not found", { status: 404 });

  const story = new URL(request.url).searchParams.get("format") === "story";
  const width = 1080;
  const height = story ? 1920 : 1080;
  const { text, cut } = fit(verse.text);
  const scale = story ? 1.18 : 1;
  const base = text.length <= 100 ? 66 : text.length <= 200 ? 54 : text.length <= 320 ? 44 : 36;
  const logo = `data:image/png;base64,${(await readFile(path.join(process.cwd(), "public/brand/icon-square.png"))).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: story ? "150px 80px 120px" : "84px 84px 70px",
          backgroundColor: "#0b0d22",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(120,73,206,0.5), transparent 55%), radial-gradient(circle at 100% 100%, rgba(244,196,90,0.2), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: "0.24em", color: "#f4c45a" }}>SOURCE OF LIFE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 0.6, color: "#f4c45a", fontWeight: 700, marginBottom: 20 }}>“</div>
          <div style={{ display: "flex", fontSize: Math.round(base * scale), lineHeight: 1.32, color: "#f1f2fb", fontWeight: 700 }}>{text}</div>
          <div style={{ display: "flex", marginTop: 38, fontSize: 30, fontWeight: 700, letterSpacing: "0.16em", color: "#f4c45a" }}>
            {verse.ref.toUpperCase()} · KJV{cut ? " · READ THE FULL PASSAGE ONLINE" : ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={54} height={54} alt="" style={{ borderRadius: 12 }} />
            <div style={{ display: "flex", marginLeft: 16, fontSize: 28, fontWeight: 700, color: "#cbd5e1" }}>thewarthens.com/source</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a9aecb" }}>Praise Him anyway.</div>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000" },
    }
  );
}
