import type { Metadata } from "next";
import ContentHub from "@/components/ContentHub";
import { startHereGuides } from "@/lib/start-here";
import { startHereSeo } from "@/lib/seo";

const title = "Start Learning Tech for Free: Step-by-Step Paths";
const description = "Free, in-order paths to start in tech sales, cybersecurity, coding, or data analytics, with video from people in the work and honest advice on paid courses.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/tech/start-here" },
  openGraph: { title, description, url: "/tech/start-here", type: "website", images: [{ url: "/tech/opengraph-image", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/tech/opengraph-image"] },
};

export default function StartHereHub() {
  return (
    <ContentHub
      path="/tech/start-here"
      title={title}
      description={description}
      h1="Start Learning Tech for Free"
      intro="Pick a path and follow the steps in order. Each one starts with what the job really looks like, then points to free ways to learn the basics, and is honest about when a paid program is worth it."
      crumbs={[{ name: "Tech Journey", href: "/tech" }]}
      updated="2026-11-16"
      items={startHereGuides.map((g) => ({
        href: `/tech/start-here/${g.slug}`,
        title: startHereSeo[g.slug]?.title ?? g.title,
        description: startHereSeo[g.slug]?.description ?? g.dek,
        tag: "Step-by-step path",
      }))}
      cta={{ heading: "Already know your field? Get the resume ready.", text: "Tailor your resume to a specific job in about a minute, or scan it for missing keywords for free.", label: "Open the Resume Builder", href: "/resume" }}
    />
  );
}
