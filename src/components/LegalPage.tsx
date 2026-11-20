import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_DRAFT, legalDocs, type Block, type LegalDoc } from "@/lib/legal-content";

// Turns **bold** and [BLANKS TO FILL IN] inside a sentence into real markup. Blanks are highlighted so none can be missed.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\])/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{inline(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <mark key={i} className="rounded bg-amber-100 px-1 text-amber-950 dark:bg-amber-400/20 dark:text-amber-100">
          {part}
        </mark>
      );
    }
    return part;
  });
}

function BlockView({ block }: { block: Block }) {
  if ("sub" in block) return <h3 className="mt-5 text-base font-semibold">{block.sub}</h3>;
  if ("bullets" in block) {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground-muted">
        {block.bullets.map((b, i) => (
          <li key={i}>{inline(b)}</li>
        ))}
      </ul>
    );
  }
  return <p className="mt-3 text-foreground-muted">{inline(block.p)}</p>;
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-12 sm:pt-16">
      {LEGAL_DRAFT && (
        <div role="note" className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100">
          <p className="font-semibold">Preview: not published yet.</p>
          <p className="mt-1">This is the final text waiting for approval. Visitors do not see this page or this note until it is switched on. Any [bracketed] blank would show highlighted.</p>
        </div>
      )}
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Legal</p>
      <h1 className="text-balance mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-2 text-sm text-foreground-muted">{inline(doc.effective)}</p>
      <p className="mt-6 text-lg text-foreground-muted">{inline(doc.intro)}</p>

      <nav aria-label="Legal pages" className="mt-6 flex flex-wrap gap-2 text-sm">
        {legalDocs.map((d) => (
          <Link
            key={d.slug}
            href={`/${d.slug}`}
            aria-current={d.slug === doc.slug ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 transition-colors ${
              d.slug === doc.slug ? "border-blue-600 bg-blue-600 text-white" : "border-border-subtle hover:bg-background-elevated"
            }`}
          >
            {d.title}
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10 first:mt-0">
            <h2 className="text-xl font-semibold tracking-tight">{s.heading}</h2>
            {s.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
