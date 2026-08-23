import { ImageResponse } from "next/og";
import { startHereGuides, getStartHere } from "@/lib/start-here";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "The Warthens Start Here Guide";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return startHereGuides.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getStartHere(slug);
  return new ImageResponse(
    renderOgImage("Start Here, For Free", guide?.title ?? "The Warthens"),
    size
  );
}
