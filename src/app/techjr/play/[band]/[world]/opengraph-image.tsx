import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderKidsOg } from "@/lib/og-kids";
import { bandById, bands, worldById, worldsFor } from "@/lib/play-worlds";

export const alt = "A Tech Journey Jr. game for kids";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return bands.flatMap((b) => worldsFor(b.id).map((w) => ({ band: b.id, world: w.id })));
}

export default async function Image({ params }: { params: Promise<{ band: string; world: string }> }) {
  const { band, world } = await params;
  const b = bandById(band);
  const w = worldById(world);
  return new ImageResponse(
    renderKidsOg({
      eyebrow: `Ages ${b?.ages ?? "5 to 10"} · Tech Journey Jr.`,
      title: w ? `${w.title}: a free game for kids` : "Tech Journey Jr.",
      subtitle: w && b ? w.about[b.id] : "Free games that teach kids tech, safety, and careers.",
      crew: ["zuri", "diego", "emma", "joy", "arjun"],
    }),
    size
  );
}
