import { ImageResponse } from "next/og";
import { guides, getGuide } from "@/lib/guides";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "The Warthens Hype vs. Reality Guide";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return new ImageResponse(
    renderOgImage("Hype vs. Reality", guide?.title ?? "The Warthens"),
    size
  );
}
