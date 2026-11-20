import { ImageResponse } from "next/og";
import { faithWritings, categoryLabels, getFaithWriting, type FaithWritingCategory } from "@/lib/faith-writings";
import { faithWritingSeo } from "@/lib/seo";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "The Warthens Faith Journey";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return faithWritings.map((w) => ({ category: w.category, slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const writing = getFaithWriting(category, slug);
  const label = writing ? categoryLabels[writing.category as FaithWritingCategory] : "Faith Journey";
  return new ImageResponse(renderOgImage(label, (writing && faithWritingSeo[writing.slug]?.title) || writing?.title || "The Warthens"), size);
}
