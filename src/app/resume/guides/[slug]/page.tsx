import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { guideBySlug, resumeGuides, type Block } from "@/lib/resume-guides";

// One template for the guides around the Resume Builder (content in lib/resume-guides.ts). Every page has a single
// H1, a byline and date, a table of contents, a question-and-answer section, related guides, and a link into the
// free builder.

export const dynamicParams = false;

export function generateStaticParams() {
  return resumeGuides.map((g) => ({ slug: g.slug }));
}

const SITE = "https://thewarthens.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  const path = `/resume/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: path,
      type: "article",
      modifiedTime: guide.updated,
      authors: ["Juston Warthen", "Atiya Warthen"],
    },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
  };
}

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:text-base";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-blue-500/50 hover:text-blue-700 sm:text-base";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-foreground-muted">{block.text}</p>;
    case "note":
      return <p className="rounded-2xl border border-blue-600/20 bg-blue-600/5 p-4 text-sm text-foreground-muted sm:text-base">{block.text}</p>;
    case "bullets":
      return (
        <ul className="list-disc space-y-2 pl-5 text-foreground-muted marker:text-blue-600">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "numbered":
      return (
        <ol className="space-y-5">
          {block.items.map((item, i) => (
            <li key={item.title} className="flex gap-4">
              <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-foreground-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "compare":
      return (
        <div className="space-y-3">
          <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Before</p>
            <p className="mt-1 text-foreground">{block.before}</p>
          </div>
          <div className="rounded-2xl border border-green-600/30 bg-green-600/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-800">After</p>
            <p className="mt-1 text-foreground">{block.after}</p>
          </div>
          <p className="text-sm text-foreground-muted sm:text-base">{block.why}</p>
        </div>
      );
    case "links":
      return (
        <ul className="space-y-4">
          {block.items.map((item) => (
            <li key={item.href} className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
              {item.href.startsWith("/") ? (
                <Link href={item.href} className="font-semibold text-blue-700 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline-offset-4 hover:underline">
                  {item.label}
                </a>
              )}
              <p className="mt-1 text-sm text-foreground-muted sm:text-base">{item.text}</p>
            </li>
          ))}
        </ul>
      );
  }
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function ResumeGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const pageUrl = `${SITE}/resume/guides/${guide.slug}`;
  const related = guide.related.flatMap((s) => guideBySlug(s) ?? []);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: guide.h1,
        description: guide.description,
        url: pageUrl,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        datePublished: guide.updated,
        dateModified: guide.updated,
        inLanguage: "en",
        author: [
          { "@type": "Person", name: "Juston Warthen", url: SITE },
          { "@type": "Person", name: "Atiya Warthen", url: SITE },
        ],
        publisher: { "@type": "Organization", name: "The Warthens", url: SITE },
        isPartOf: { "@id": `${SITE}/resume/guides#webpage` },
        about: guide.keywords.slice(0, 3),
      },
      { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: guide.title, breadcrumb: { "@id": `${pageUrl}#breadcrumb` } },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
          { "@type": "ListItem", position: 2, name: "Resume Builder", item: `${SITE}/resume` },
          { "@type": "ListItem", position: 3, name: "Guides", item: `${SITE}/resume/guides` },
          { "@type": "ListItem", position: 4, name: guide.short, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: guide.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      },
    ],
  };

  return (
    <article className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <header className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(55% 45% at 50% 0%, rgba(99,102,241,0.14), transparent)" }} />
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-12 sm:pt-16">
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
              <li>
                <Link href="/resume/guides" className="hover:text-foreground">
                  Guides
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {guide.short}
              </li>
            </ol>
          </nav>
          <p className="mt-8 inline-flex rounded-full border border-blue-600/25 bg-blue-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">{guide.eyebrow}</p>
          <h1 className="text-balance mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{guide.h1}</h1>
          <p className="mt-4 text-sm text-foreground-muted">
            By Juston &amp; Atiya Warthen · Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
          </p>
          <div className="mt-6 space-y-4 text-lg text-foreground-muted">
            {guide.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/resume" className={primaryButton}>
              Tailor my resume
            </Link>
            <Link href="/resume/guides" className={secondaryButton}>
              More resume guides
            </Link>
          </div>
        </div>
      </header>

      {guide.sections.length > 2 && (
        <nav aria-label="On this page" className="mx-auto max-w-3xl px-6 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">On this page</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {guide.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-block rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-sm text-foreground-muted transition-colors hover:border-blue-500/50 hover:text-blue-700">
                  {s.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" className="inline-block rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-sm text-foreground-muted transition-colors hover:border-blue-500/50 hover:text-blue-700">
                Common questions
              </a>
            </li>
          </ul>
        </nav>
      )}

      {guide.sections.map((section) => (
        <section key={section.id} id={section.id} className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-12">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">{section.heading}</h2>
            <div className="mt-6 space-y-6 text-base sm:text-lg">
              {section.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
          </Reveal>
        </section>
      ))}

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-800 to-blue-900 p-8 text-white shadow-xl shadow-indigo-950/20 sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Get it done in about a minute</h2>
          <p className="mt-3 text-indigo-100">Add your resume and the job posting. Get a tailored resume and a matching cover letter as PDF and Word files, built only from your real experience. Your first two builds are free.</p>
          <div className="mt-6">
            <Link href="/resume" className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03]">
              Open the Resume Builder
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-12">
        <Reveal>
          <h2 className="text-2xl font-semibold sm:text-3xl">Common questions</h2>
          <div className="mt-6 space-y-3">
            {guide.faq.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-border-subtle bg-background-elevated">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
                  {f.question}
                  <span aria-hidden className="shrink-0 text-sm text-foreground-muted transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="px-5 pb-5 text-foreground-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-xl font-semibold sm:text-2xl">Keep reading</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/resume/guides/${r.slug}`} className="block h-full rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-500/50">
                  <span className="font-semibold text-blue-700">{r.short}</span>
                  <span className="mt-1 block text-sm text-foreground-muted">{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
