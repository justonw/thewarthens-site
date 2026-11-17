import Link from "next/link";
import Reveal from "@/components/Reveal";

// A listing page for a group of articles: a short intro, a card for each article, and one next step. Hubs give search
// engines (and people) a clear map of related pages, and pass strength from the section page down to each article.

const SITE = "https://thewarthens.com";

export type HubItem = { href: string; title: string; description: string; tag?: string };
export type Crumb = { name: string; href: string };

export default function ContentHub({
  path,
  title,
  description,
  h1,
  intro,
  items,
  crumbs,
  cta,
  updated,
}: {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  items: HubItem[];
  // The parents of this page, outermost first (not including the page itself).
  crumbs: Crumb[];
  cta?: { heading: string; text: string; label: string; href: string };
  updated: string;
}) {
  const all = [{ name: "The Warthens", href: "/" }, ...crumbs, { name: h1, href: path }];
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}${path}#webpage`,
        url: `${SITE}${path}`,
        name: title,
        description,
        dateModified: updated,
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${SITE}${path}#breadcrumb` },
        mainEntity: { "@type": "ItemList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${it.href}`, name: it.title })) },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}${path}#breadcrumb`,
        itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE}${c.href === "/" ? "" : c.href}` })),
      },
    ],
  };
  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-12 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-foreground">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-foreground">
                  {c.name === "The Warthens" ? "Home" : c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <Reveal>
        <h1 className="text-balance mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{h1}</h1>
        <p className="mt-4 text-lg text-foreground-muted">{intro}</p>
      </Reveal>
      <ul className="mt-10 space-y-4">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="block rounded-2xl border border-border-subtle bg-background-elevated p-6 transition-colors hover:border-blue-500/50">
              {it.tag ? <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">{it.tag}</span> : null}
              <span className="mt-1 block text-xl font-semibold">{it.title}</span>
              <span className="mt-2 block text-foreground-muted">{it.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      {cta ? (
        <div className="mt-12 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">{cta.heading}</h2>
          <p className="mt-2 text-foreground-muted">{cta.text}</p>
          <Link href={cta.href} className="mt-5 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
            {cta.label}
          </Link>
        </div>
      ) : null}
    </main>
  );
}
