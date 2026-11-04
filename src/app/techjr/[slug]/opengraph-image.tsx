import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderKidsOg } from "@/lib/og-kids";
import { articleBySlug, articles } from "@/lib/techjr-articles";

export const alt = "Tech Journey Jr. guide for parents | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

const crews = [
  ["maya", "kenji", "emma", "jamal", "joy"],
  ["joshua", "lily", "sofia", "diego", "zuri"],
  ["jackson", "naya", "john", "arjun", "emma"],
];

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  const index = Math.max(0, articles.findIndex((a) => a.slug === slug));
  return new ImageResponse(
    renderKidsOg({
      eyebrow: article?.eyebrow ?? "For parents",
      title: article?.h1 ?? "Guides for parents",
      subtitle: article?.blurb,
      crew: crews[index % crews.length],
      badges: ["Free", "From Tech Journey Jr."],
    }),
    size
  );
}
