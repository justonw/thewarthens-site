import type { Metadata } from "next";
import ContentHub from "@/components/ContentHub";
import { guides } from "@/lib/guides";
import { techGuideSeo } from "@/lib/seo";

const title = "Tech Career Reality Checks: Is It Worth It? | The Warthens";
const description = "Is tech sales, software engineering, or cybersecurity worth it? Honest guides that check training marketing against real hiring data and people in the jobs.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/tech/guides" },
  openGraph: { title, description, url: "/tech/guides", type: "website", images: [{ url: "/tech/opengraph-image", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/tech/opengraph-image"] },
};

export default function TechGuidesHub() {
  return (
    <ContentHub
      path="/tech/guides"
      title={title}
      description={description}
      h1="Hype vs. Reality: Is a Tech Career Worth It?"
      intro="Courses and bootcamps promise a lot. These guides take each claim and check it against real hiring data, industry reports, and what people working in the jobs say, so you can decide before you spend money or months."
      crumbs={[{ name: "Tech Journey", href: "/tech" }]}
      updated="2026-11-16"
      items={guides.map((g) => ({
        href: `/tech/guides/${g.slug}`,
        title: techGuideSeo[g.slug]?.title ?? g.title,
        description: techGuideSeo[g.slug]?.description ?? g.dek,
        tag: "Hype vs. Reality",
      }))}
      cta={{ heading: "Not sure which path fits you?", text: "Take the free 2-minute career quiz. It looks at how you like to work, what is pulling you toward a change, and your pace.", label: "Take the career quiz", href: "/tech#quiz" }}
    />
  );
}
