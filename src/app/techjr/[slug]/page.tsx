import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { factsContent } from "@/lib/play-content";
import { articleBySlug, articles, type Block } from "@/lib/techjr-articles";

// One template for the parent guides about Tech Journey Jr. (content in lib/techjr-articles.ts).
// Every page has a single H1, a byline and date, a table of contents, a question-and-answer
// section, related guides, and a link into the free game.

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

const SITE = "https://thewarthens.com";

export async function generateMetadata({ params }: PageProps<"/techjr/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  const path = `/techjr/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: article.title,
      description: article.description,
      url: path,
      type: "article",
      modifiedTime: article.updated,
      authors: ["Juston Warthen", "Atiya Warthen"],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description },
  };
}

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:text-base";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-blue-500/50 hover:text-blue-700 sm:text-base";

const isExternal = (href: string) => href.startsWith("http");

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-foreground-muted">{block.text}</p>;
    case "note":
      return (
        <p className="rounded-2xl border border-blue-600/20 bg-blue-600/5 p-4 text-sm text-foreground-muted sm:text-base">
          {block.text}
        </p>
      );
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
              <span
                aria-hidden
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                {item.say && (
                  <p className="mt-1 border-l-2 border-blue-600/40 pl-3 font-medium text-foreground">
                    Say: &ldquo;{item.say}&rdquo;
                  </p>
                )}
                <p className="mt-2 text-foreground-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "cards":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              {item.tag && (
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-blue-600">{item.tag}</p>
              )}
              <p className="mt-3 text-foreground-muted">{item.text}</p>
              {item.talk && (
                <p className="mt-3 rounded-xl bg-background p-3 text-sm text-foreground">
                  <span className="font-semibold">Ask your child:</span> {item.talk}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    case "facts": {
      const groups = factsContent["ages-8-10"].groups.filter((g) => block.groupIds.includes(g.id));
      return (
        <div className="space-y-5">
          {groups.flatMap((g) => g.facts).map((fact) => (
            <div key={fact.id}>
              <h3 className="text-lg font-semibold text-foreground">{fact.hook}</h3>
              <p className="mt-1 text-foreground-muted">{fact.answer}</p>
            </div>
          ))}
        </div>
      );
    }
    case "links":
      return (
        <ul className="space-y-4">
          {block.items.map((item) => (
            <li key={item.href} className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
              {isExternal(item.href) ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-700 underline-offset-4 hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} className="font-semibold text-blue-700 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              )}
              <p className="mt-1 text-sm text-foreground-muted sm:text-base">{item.text}</p>
            </li>
          ))}
        </ul>
      );
  }
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function TechJrArticlePage({ params }: PageProps<"/techjr/[slug]">) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const pageUrl = `${SITE}/techjr/${article.slug}`;
  const related = article.related.flatMap((s) => articleBySlug(s) ?? []);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: article.h1,
        description: article.description,
        url: pageUrl,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        datePublished: article.updated,
        dateModified: article.updated,
        inLanguage: "en",
        author: [
          { "@type": "Person", name: "Juston Warthen", url: SITE },
          { "@type": "Person", name: "Atiya Warthen", url: SITE },
        ],
        publisher: { "@type": "Organization", name: "The Warthens", url: SITE },
        isPartOf: { "@id": `${SITE}/techjr#webpage` },
        about: article.keywords.slice(0, 3),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: article.title,
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
          { "@type": "ListItem", position: 2, name: "Tech Journey Jr.", item: `${SITE}/techjr` },
          { "@type": "ListItem", position: 3, name: article.short, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: article.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <article className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <header className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(55% 45% at 50% 0%, rgba(56,189,248,0.14), transparent)" }}
        />
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
                <Link href="/techjr" className="hover:text-foreground">
                  Tech Journey Jr.
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {article.short}
              </li>
            </ol>
          </nav>
          <p className="mt-8 inline-flex rounded-full border border-blue-600/25 bg-blue-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            {article.eyebrow}
          </p>
          <h1 className="text-balance mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{article.h1}</h1>
          <p className="mt-4 text-sm text-foreground-muted">
            By Juston &amp; Atiya Warthen · Updated <time dateTime={article.updated}>{formatDate(article.updated)}</time>
          </p>
          <div className="mt-6 space-y-4 text-lg text-foreground-muted">
            {article.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/techjr/play" className={primaryButton}>
              Play the free game
            </Link>
            <Link href="/techjr" className={secondaryButton}>
              About Tech Journey Jr.
            </Link>
          </div>
        </div>
      </header>

      {article.sections.length > 2 && (
        <nav aria-label="On this page" className="mx-auto max-w-3xl px-6 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">On this page</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {article.sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-block rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-sm text-foreground-muted transition-colors hover:border-blue-500/50 hover:text-blue-700"
                >
                  {s.heading}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#faq"
                className="inline-block rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-sm text-foreground-muted transition-colors hover:border-blue-500/50 hover:text-blue-700"
              >
                Questions parents ask
              </a>
            </li>
          </ul>
        </nav>
      )}

      {article.sections.map((section) => (
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
        <div
          className="rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-950/20 sm:p-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 0%, rgba(244,114,182,0.45), transparent 45%), linear-gradient(135deg, #261a68, #3b1f8f 55%, #1e3a8a)",
          }}
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">{article.cta.heading}</h2>
          <p className="mt-3 text-indigo-100">{article.cta.text}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/techjr/play/ages-5-7"
              className="rounded-full bg-amber-300 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03]"
            >
              Ages 5 to 7: Tech Sprouts
            </Link>
            <Link
              href="/techjr/play/ages-8-10"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03]"
            >
              Ages 8 to 10: Tech Trailblazers
            </Link>
          </div>
          <p className="mt-4 text-sm text-indigo-200">No ads. No sign-in. Nothing a child picks is saved or sent.</p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Questions parents ask</h2>
        <div className="mt-6 space-y-6">
          {article.faq.map((f) => (
            <div key={f.question}>
              <h3 className="text-lg font-semibold text-foreground">{f.question}</h3>
              <p className="mt-2 text-foreground-muted">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">Keep reading</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/techjr/${r.slug}`}
                  className="block h-full rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-500/50"
                >
                  <span className="font-semibold text-foreground">{r.short}</span>
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
