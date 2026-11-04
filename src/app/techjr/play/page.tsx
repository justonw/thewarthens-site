import type { Metadata } from "next";
import AgePicker from "@/components/career-day/AgePicker";
import { playSeo, TECHJR_PLAY_PATH } from "@/lib/tech-jr";

export const metadata: Metadata = {
  title: playSeo.picker.title,
  description: playSeo.picker.description,
  robots: { index: true, follow: true },
  alternates: { canonical: TECHJR_PLAY_PATH },
  openGraph: {
    title: playSeo.picker.title,
    description: playSeo.picker.description,
    url: TECHJR_PLAY_PATH,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: playSeo.picker.title, description: playSeo.picker.description },
};

const SITE = "https://thewarthens.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebApplication", "LearningResource"],
      "@id": `${SITE}${TECHJR_PLAY_PATH}#game`,
      name: "Tech Journey Jr.",
      url: `${SITE}${TECHJR_PLAY_PATH}`,
      description: playSeo.picker.description,
      applicationCategory: "EducationalApplication",
      genre: "Educational game",
      operatingSystem: "Any device with a web browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      audience: { "@type": "PeopleAudience", suggestedMinAge: 5, suggestedMaxAge: 10 },
      educationalLevel: "Elementary school",
      inLanguage: "en",
      publisher: { "@type": "Organization", name: "The Warthens", url: SITE },
      featureList: [
        "Two versions: ages 5 to 7 with a read-aloud voice, and ages 8 to 10",
        "Online safety game",
        "Tech and creator career exploration",
        "Cool facts with a True or Made Up game",
        "No ads, no sign-in, nothing saved",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
        { "@type": "ListItem", position: 2, name: "Tech Journey Jr.", item: `${SITE}/techjr` },
        { "@type": "ListItem", position: 3, name: "Play", item: `${SITE}${TECHJR_PLAY_PATH}` },
      ],
    },
  ],
};

export default function TechJrPlayPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgePicker />
    </>
  );
}
