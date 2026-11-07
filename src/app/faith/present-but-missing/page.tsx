import type { Metadata } from "next";
import PresentMissingLesson from "@/components/faith/PresentMissingLesson";
import {
  LESSON_MODIFIED,
  LESSON_PATH,
  LESSON_PUBLISHED,
  LESSON_TITLE,
  faq,
  seoDescription,
  seoTitle,
} from "@/lib/present-missing";

const site = "https://thewarthens.com";

export const metadata: Metadata = {
  title: { absolute: seoTitle },
  description: seoDescription,
  alternates: { canonical: LESSON_PATH },
  authors: [{ name: "Juston Warthen" }],
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: LESSON_PATH,
    siteName: "The Warthens",
    locale: "en_US",
    type: "article",
    publishedTime: LESSON_PUBLISHED,
    modifiedTime: LESSON_MODIFIED,
    authors: ["Juston Warthen"],
    section: "Faith Journey",
  },
  twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription },
};

export default function PresentButMissingPage() {
  const url = `${site}${LESSON_PATH}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: site },
          { "@type": "ListItem", position: 2, name: "Faith Journey", item: `${site}/faith` },
          { "@type": "ListItem", position: 3, name: LESSON_TITLE, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: "Present but Missing: When a Man Provides Everything but Himself",
        description: seoDescription,
        image: `${url}/opengraph-image`,
        datePublished: LESSON_PUBLISHED,
        dateModified: LESSON_MODIFIED,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        articleSection: "Faith Journey",
        about: ["Being present as a husband and father", "Isaiah 58", "Matthew 23:23-24", "Men\u2019s Bible study"],
        audience: { "@type": "PeopleAudience", suggestedGender: "male" },
        author: { "@type": "Person", name: "Juston Warthen", url: `${site}/faith` },
        publisher: {
          "@type": "Organization",
          name: "The Warthens",
          url: site,
          logo: { "@type": "ImageObject", url: `${site}/brand/icon-square.png` },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PresentMissingLesson />
    </>
  );
}
