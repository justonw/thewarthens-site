import type { Metadata } from "next";
import PresentMissingLesson from "@/components/faith/PresentMissingLesson";
import { LESSON_PATH } from "@/lib/present-missing";

const title = "Present but Missing: A Lesson and Exercise for Men | Faith Journey";
const description =
  "A short lesson and exercise for men on being fully present at home, at church, and in the community, with Scripture, reflection questions, and a PDF of your notes by email.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: LESSON_PATH },
  openGraph: { title, description, url: LESSON_PATH, type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

export default function PresentButMissingPage() {
  const site = "https://thewarthens.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: site },
      { "@type": "ListItem", position: 2, name: "Faith Journey", item: `${site}/faith` },
      { "@type": "ListItem", position: 3, name: "Present but Missing", item: `${site}${LESSON_PATH}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PresentMissingLesson />
    </>
  );
}
