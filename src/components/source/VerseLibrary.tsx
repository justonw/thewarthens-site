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

  if (!ready) return <p className="text-center text-sm text-slate-500">Loading the verse library…</p>;

  const shown = showAll ? results : results.slice(0, LIMIT);
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? "border-amber-300 bg-amber-300 text-[#0a0c1d]" : "border-white/15 text-slate-300 hover:border-amber-300/60"}`;

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
        className="w-full rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
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
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "verse" : "verses"}
        </p>
        {section !== "all" && results.length > 0 && (
          <TeachButton sectionId={section} className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-amber-300/60 hover:text-amber-200">
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
        {results.length === 0 && <p className="text-center text-slate-400">No verses match. Try a shorter word.</p>}
      </div>
      {!showAll && results.length > LIMIT && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setShowAll(true)} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-amber-300/60">
            Show all {results.length}
          </button>
        </div>
      )}
    </div>
  );
}
