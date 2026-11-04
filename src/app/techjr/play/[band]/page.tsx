import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorldMap from "@/components/career-day/WorldMap";
import { bandById, bands } from "@/lib/play-worlds";
import { playSeo } from "@/lib/tech-jr";

export const dynamicParams = false;

export function generateStaticParams() {
  return bands.map((b) => ({ band: b.id }));
}

export async function generateMetadata({ params }: PageProps<"/techjr/play/[band]">): Promise<Metadata> {
  const { band } = await params;
  const found = bandById(band);
  if (!found) return {};
  const seo = playSeo[found.id];
  const path = `/techjr/play/${found.id}`;
  return {
    title: seo.title,
    description: seo.description,
    robots: { index: true, follow: true },
    alternates: { canonical: path },
    openGraph: { title: seo.title, description: seo.description, url: path, type: "website" },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

const SITE = "https://thewarthens.com";

export default async function BandPage({ params }: PageProps<"/techjr/play/[band]">) {
  const { band } = await params;
  const found = bandById(band);
  if (!found) notFound();
  const seo = playSeo[found.id];
  const url = `${SITE}/techjr/play/${found.id}`;
  const [minAge, maxAge] = found.id === "ages-5-7" ? [5, 7] : [8, 10];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebApplication", "LearningResource"],
        "@id": `${url}#game`,
        name: `${found.name}: Tech Journey Jr. for ages ${found.ages}`,
        url,
        description: seo.description,
        applicationCategory: "EducationalApplication",
        genre: "Educational game",
        operatingSystem: "Any device with a web browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        audience: { "@type": "PeopleAudience", suggestedMinAge: minAge, suggestedMaxAge: maxAge },
        educationalLevel: found.grades,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE}/techjr/play#game` },
        publisher: { "@type": "Organization", name: "The Warthens", url: SITE },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
          { "@type": "ListItem", position: 2, name: "Tech Journey Jr.", item: `${SITE}/techjr` },
          { "@type": "ListItem", position: 3, name: "Play", item: `${SITE}/techjr/play` },
          { "@type": "ListItem", position: 4, name: found.name, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WorldMap band={found} />
    </>
  );
}
