import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentHub from "@/components/ContentHub";
import { faithWritings, type FaithWritingCategory } from "@/lib/faith-writings";
import { faithWritingSeo } from "@/lib/seo";

// One listing page for each kind of writing that has pieces in it (Topical Study, Story Time, Reflections).
const categories: Record<string, { label: string; h1: string; title: string; description: string; intro: string }> = {
  "topical-study": {
    label: "Topical Study",
    h1: "Topical Bible Studies",
    title: "Topical Bible Studies on Tithing, Giving & Calling",
    description: "Verse-by-verse topical Bible studies on tithing, giving, and calling, checked against what Scripture says in context. From Faith Journey with The Warthens.",
    intro: "Each study takes one question people really ask, such as whether tithing is required, and works through what Scripture actually says in context, so you can see it for yourself.",
  },
  reflections: {
    label: "Reflections",
    h1: "Faith Reflections",
    title: "Faith Reflections on Trusting God | The Warthens",
    description: "Short reflections on trusting the Spirit, finding focus in change, and living out God's wisdom. From Faith Journey with The Warthens.",
    intro: "Shorter pieces on trusting God through change, written from our own experience.",
  },
  "story-time": {
    label: "Story Time",
    h1: "Faith Story Time",
    title: "Faith Stories: Real Life, Real Trust in God | The Warthens",
    description: "True stories from our family about trusting God in hard moments. From Faith Journey with The Warthens.",
    intro: "True stories from our own life about what it looked like to trust God.",
  },
};

function pieces(category: string) {
  return faithWritings.filter((w) => w.category === (category as FaithWritingCategory));
}

export function generateStaticParams() {
  return Object.keys(categories).filter((c) => pieces(c).length > 0).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = categories[category];
  if (!c || pieces(category).length === 0) return {};
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: `/faith/${category}` },
    openGraph: { title: c.title, description: c.description, url: `/faith/${category}`, type: "website", images: [{ url: "/faith/opengraph-image", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: ["/faith/opengraph-image"] },
  };
}

export default async function FaithCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categories[category];
  const list = pieces(category);
  if (!c || list.length === 0) notFound();
  return (
    <ContentHub
      path={`/faith/${category}`}
      title={c.title}
      description={c.description}
      h1={c.h1}
      intro={c.intro}
      crumbs={[{ name: "Faith Journey", href: "/faith" }]}
      updated={list.map((w) => w.date).sort().at(-1) ?? "2026-11-16"}
      items={list.map((w) => ({ href: `/faith/${w.category}/${w.slug}`, title: faithWritingSeo[w.slug]?.title ?? w.title, description: faithWritingSeo[w.slug]?.description ?? w.dek, tag: c.label }))}
      cta={{ heading: "Watch the stories behind the studies", text: "Our testimonies and Bible studies are on the Faith Journey page, with the videos on YouTube.", label: "Visit Faith Journey", href: "/faith" }}
    />
  );
}
