import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { RESUME_GUIDES_UPDATED, resumeGuides } from "@/lib/resume-guides";

const SITE = "https://thewarthens.com";
const title = "Resume and Cover Letter Guides | The Warthens";
const description = "Plain-English guides to tailoring your resume, passing hiring software, changing careers, and addressing a cover letter, plus a free builder.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resume/guides" },
  openGraph: { title, description, url: "/resume/guides", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ResumeGuidesPage() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/resume/guides#webpage`,
        url: `${SITE}/resume/guides`,
        name: title,
        description,
        dateModified: RESUME_GUIDES_UPDATED,
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${SITE}/resume/guides#breadcrumb` },
        mainEntity: { "@type": "ItemList", itemListElement: resumeGuides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/resume/guides/${g.slug}`, name: g.title })) },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}/resume/guides#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
          { "@type": "ListItem", position: 2, name: "Resume Builder", item: `${SITE}/resume` },
          { "@type": "ListItem", position: 3, name: "Guides", item: `${SITE}/resume/guides` },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-12 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/resume" className="hover:text-foreground">
              Resume Builder
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            Guides
          </li>
        </ol>
      </nav>
      <Reveal>
        <h1 className="text-balance mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Resume and cover letter guides</h1>
        <p className="mt-4 text-lg text-foreground-muted">
          Short, honest guides to the parts of a job application that people get stuck on. Every number we use has a source, and nothing here asks you to stretch the truth.
        </p>
      </Reveal>
      <ul className="mt-10 space-y-4">
        {resumeGuides.map((g) => (
          <li key={g.slug}>
            <Link href={`/resume/guides/${g.slug}`} className="block rounded-2xl border border-border-subtle bg-background-elevated p-6 transition-colors hover:border-blue-500/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">{g.eyebrow}</span>
              <span className="mt-1 block text-xl font-semibold">{g.h1}</span>
              <span className="mt-2 block text-foreground-muted">{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/resume/keyword-matcher" className="mt-6 block rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 transition-colors hover:border-blue-500/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Free tool</span>
        <span className="mt-1 block text-xl font-semibold">Resume keyword scanner</span>
        <span className="mt-2 block text-foreground-muted">Paste your resume and a job posting to see which key phrases you have and which are missing.</span>
      </Link>
      <div className="mt-12 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Skip the reading: let the builder do it</h2>
        <p className="mt-2 text-foreground-muted">Add your resume and a job posting. Get a tailored resume and a matching cover letter as PDF and Word files, built only from your real experience. Your first 2 builds are free.</p>
        <Link href="/resume" className="mt-5 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
          Open the Resume Builder
        </Link>
      </div>
    </main>
  );
}
