"use client";

import Link from "next/link";
import { useState } from "react";
import { tagLabels, type LibraryItem, type LibraryTag } from "@/lib/faith-featured";

// Everything to read or do, with filter chips so it stays easy to scan as it grows. Only filters that
// have something in them are shown. Without JavaScript the whole list still shows.
export default function FaithLibrary({ items }: { items: LibraryItem[] }) {
  const [filter, setFilter] = useState<LibraryTag | "all">("all");
  const [showAll, setShowAll] = useState(false);

  const order: LibraryTag[] = ["men", "women", "lesson", "story-time", "topical-study", "reflections"];
  const filters = order.filter((tag) => items.some((i) => i.tags.includes(tag)));
  const matching = filter === "all" ? items : items.filter((i) => i.tags.includes(filter));
  const LIMIT = 6;
  const shown = showAll ? matching : matching.slice(0, LIMIT);

  const chip = (active: boolean) =>
    `inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      active
        ? "border-purple-700 bg-purple-700 text-white"
        : "border-border-subtle bg-background-elevated text-foreground-muted hover:border-purple-500/50 hover:text-purple-800"
    }`;

  return (
    <div>
      <div role="group" aria-label="Filter what to read" className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setFilter("all"); setShowAll(false); }} aria-pressed={filter === "all"} className={chip(filter === "all")}>
          All
        </button>
        {filters.map((tag) => (
          <button key={tag} type="button" onClick={() => { setFilter(tag); setShowAll(false); }} aria-pressed={filter === tag} className={chip(filter === tag)}>
            {tagLabels[tag]}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status">
        {shown.length} of {matching.length} shown
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {shown.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/5"
            >
              <span className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-purple-600/10 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                    {tagLabels[tag]}
                  </span>
                ))}
              </span>
              <p className="mt-3 text-lg font-semibold leading-snug">{item.title}</p>
              <p className="mt-2 flex-1 text-sm text-foreground-muted">{item.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700">
                {item.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {matching.length > LIMIT && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll((on) => !on)}
            aria-expanded={showAll}
            className="inline-flex min-h-11 items-center rounded-full border border-purple-600/30 bg-background-elevated px-6 py-2.5 text-sm font-semibold text-purple-800 transition-colors hover:bg-purple-600/10"
          >
            {showAll ? "Show fewer" : `Show all ${matching.length}`}
          </button>
        </div>
      )}
    </div>
  );
}
