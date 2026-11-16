import { ImageResponse } from "next/og";
import { resumeGuides, guideBySlug } from "@/lib/resume-guides";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "A resume guide from The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return resumeGuides.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  return new ImageResponse(renderOgImage("Resume guide", guide?.h1 ?? "The Warthens"), size);
}
