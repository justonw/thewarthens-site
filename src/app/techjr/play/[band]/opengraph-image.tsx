import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderKidsOg } from "@/lib/og-kids";
import { bandById, bands } from "@/lib/play-worlds";

export const alt = "Tech Journey Jr.: free games for kids";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return bands.map((b) => ({ band: b.id }));
}

export default async function Image({ params }: { params: Promise<{ band: string }> }) {
  const { band } = await params;
  const found = bandById(band);
  const young = found?.id === "ages-5-7";
  return new ImageResponse(
    renderKidsOg({
      eyebrow: `Ages ${found?.ages ?? "5 to 10"}`,
      title: found ? `${found.name}: free games for ages ${found.ages}` : "Tech Journey Jr.",
      subtitle: young
        ? "A voice reads every screen. Picture choices, online safety, careers, and cool facts."
        : "Trickier choices, real jobs, online safety, and cool facts.",
      crew: young ? ["maya", "jackson", "joy", "emma", "diego"] : ["kenji", "jamal", "lily", "joshua", "naya"],
    }),
    size
  );
}
