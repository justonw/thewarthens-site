"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Verse } from "@/lib/source-of-life-verses";
import VerseBlock from "./VerseBlock";
import { TeachButton } from "./TeachMode";

type Props = { verses: Verse[]; sections: { id: string; title: string }[] };

const LIMIT = 40;

// Search and filter every verse in one place. It only renders in the browser, because the same
// verses already appear in the sections above and we do not want duplicate text in the page source.
export default function VerseLibrary({ verses, sections }: Props) {
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return verses.filter((v) => (section === "all" || v.section === section) && (!q || v.text.toLowerCase().includes(q) || v.ref.toLowerCase().includes(q)));
  }, [verses, query, section]);

  if (!ready) return <p className="text-center text-sm text-sol-muted">Loading the verse library…</p>;

  const shown = showAll ? results : results.slice(0, LIMIT);
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? "border-sol-primary bg-sol-primary text-sol-on-primary" : "border-sol-line text-sol-ink/80 hover:border-sol-gold/60"}`;

  return (
    <div className="mx-auto max-w-3xl">
      <label htmlFor="sol-search" className="sr-only">
        Search the verses
      </label>
      <input
        id="sol-search"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowAll(false);
        }}
        placeholder="Search a word or a reference, like “evil” or “Job”"
        className="w-full rounded-2xl border border-sol-line bg-sol-input px-5 py-4 text-base text-sol-ink outline-none transition placeholder:text-sol-muted/70 focus:border-sol-gold focus:ring-4 focus:ring-sol-gold/10"
      />
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by section">
        <button type="button" className={chip(section === "all")} onClick={() => { setSection("all"); setShowAll(false); }}>
          All
        </button>
        {sections.map((s) => (
          <button key={s.id} type="button" className={chip(section === s.id)} onClick={() => { setSection(s.id); setShowAll(false); }}>
            {s.title}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-sol-muted">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "verse" : "verses"}
        </p>
        {section !== "all" && results.length > 0 && (
          <TeachButton sectionId={section} className="rounded-full border border-sol-line px-4 py-1.5 text-xs font-semibold text-sol-ink transition-colors hover:border-sol-gold/60 hover:text-sol-gold">
            Teach this section
          </TeachButton>
        )}
      </div>
      <div className="mt-6 space-y-8">
        {shown.map((v) => (
          <div key={`lib-${v.id}`} className="[&_figure]:scroll-mt-28">
            <VerseBlock verse={v} domId={`lib-${v.id}`} />
          </div>
        ))}
        {results.length === 0 && <p className="text-center text-sol-muted">No verses match. Try a shorter word.</p>}
      </div>
      {!showAll && results.length > LIMIT && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setShowAll(true)} className="rounded-full border border-sol-line px-6 py-3 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/60">
            Show all {results.length}
          </button>
        </div>
      )}
    </div>
  );
}
