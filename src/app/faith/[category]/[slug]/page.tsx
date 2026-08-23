import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  faithWritings,
  getFaithWriting,
  categoryLabels,
  type FaithWritingCategory,
} from "@/lib/faith-writings";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return faithWritings.map((w) => ({ category: w.category, slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const writing = getFaithWriting(category, slug);
  if (!writing) return {};
  return {
    title: `${writing.title} | The Warthens`,
    description: writing.dek,
    alternates: { canonical: `/faith/${writing.category}/${writing.slug}` },
    openGraph: {
      title: writing.title,
      description: writing.dek,
      url: `/faith/${writing.category}/${writing.slug}`,
      images: [{ url: writing.heroImage.src }],
    },
    twitter: {
      card: "summary_large_image",
      title: writing.title,
      description: writing.dek,
      images: [writing.heroImage.src],
    },
  };
}

export default async function FaithWritingPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const writing = getFaithWriting(category, slug);
  if (!writing) notFound();

  const categoryLabel = categoryLabels[writing.category as FaithWritingCategory];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
      { "@type": "ListItem", position: 2, name: "Faith Journey", item: "https://thewarthens.com/faith" },
      { "@type": "ListItem", position: 3, name: categoryLabel },
      {
        "@type": "ListItem",
        position: 4,
        name: writing.title,
        item: `https://thewarthens.com/faith/${writing.category}/${writing.slug}`,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: writing.title,
    description: writing.dek,
    image: `https://thewarthens.com${writing.heroImage.src}`,
    author: { "@type": "Person", name: writing.author },
    publisher: {
      "@type": "Organization",
      name: "The Warthens",
      logo: { "@type": "ImageObject", url: "https://thewarthens.com/brand/icon-square.png" },
    },
    mainEntityOfPage: `https://thewarthens.com/faith/${writing.category}/${writing.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="border-b border-border-subtle/60 bg-background-elevated/30">
        <div className="mx-auto max-w-3xl px-6 py-3 text-sm text-foreground-muted">
          <Link href="/faith" className="hover:text-foreground">
            Faith Journey
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{categoryLabel}</span>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(147,51,234,0.10), transparent)",
          }}
        />
        <Reveal className="mx-auto max-w-3xl px-6 pt-14 pb-10 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">
            {categoryLabel}
          </p>
          <h1 className="text-balance mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {writing.title}
          </h1>
          <p className="mt-4 text-balance text-lg text-foreground-muted">{writing.dek}</p>
          <p className="mt-4 text-sm font-semibold text-foreground-muted">
            {writing.author} &middot; {writing.date}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-10">
        <Reveal className="overflow-hidden rounded-3xl border border-border-subtle">
          <Image
            src={writing.heroImage.src}
            alt={writing.heroImage.alt}
            width={896}
            height={1195}
            className="h-auto w-full object-cover"
            priority
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-16">
        <Reveal className="space-y-5">
          {writing.body.map((block, i) =>
            block.type === "quote" ? (
              <blockquote
                key={i}
                className="border-l-4 border-purple-500/40 pl-5 text-lg italic text-foreground"
              >
                &ldquo;{block.text}&rdquo;
              </blockquote>
            ) : (
              <p key={i} className="text-foreground-muted">
                {block.text}
              </p>
            )
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-background-elevated p-6 text-center sm:p-8">
          <p className="text-sm text-foreground-muted">
            Have thoughts on this? We&apos;d love to hear them.
          </p>
          <a
            href="mailto:info@thewarthens.com"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Share Your Thoughts
            <span aria-hidden>→</span>
          </a>
          <Link
            href="/faith"
            className="mt-2 text-sm font-semibold text-purple-700 underline decoration-purple-300 underline-offset-4 hover:text-purple-800"
          >
            Back to Faith Journey
          </Link>
        </Reveal>
      </section>
    </>
  );
}
