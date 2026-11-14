"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TeachVerse = { id: string; ref: string; text: string };
export type TeachSection = { id: string; title: string; verses: TeachVerse[] };

export const TEACH_EVENT = "sol-teach";

// Full-screen teaching view: one verse per screen, big type, arrow keys to move. Opened by
// TeachButton from anywhere on the page, so it can be filmed or shown on a screen.
export function TeachButton({ sectionId, className = "", children }: { sectionId: string; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(TEACH_EVENT, { detail: { section: sectionId } }))}
    >
      {children}
    </button>
  );
}

export default function TeachMode({ sections }: { sections: TeachSection[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const section = sections.find((s) => s.id === open) ?? null;

  const close = useCallback(() => {
    setOpen(null);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    function onOpen(e: Event) {
      const id = (e as CustomEvent<{ section: string }>).detail.section;
      setIndex(0);
      setOpen(id);
    }
    window.addEventListener(TEACH_EVENT, onOpen);
    return () => window.removeEventListener(TEACH_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!section) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const count = section.verses.length;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setIndex((i) => Math.min(count - 1, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else dialogRef.current?.requestFullscreen?.().catch(() => {});
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [section, close]);

  if (!section) return null;
  const verse = section.verses[index];
  const len = verse.text.length;
  const sizeClass =
    len > 450
      ? "text-xl sm:text-2xl md:text-3xl"
      : len > 220
        ? "text-2xl sm:text-3xl md:text-4xl"
        : len > 110
          ? "text-3xl sm:text-4xl md:text-5xl"
          : "text-4xl sm:text-5xl md:text-6xl";
  const btn =
    "rounded-full border border-sol-line px-4 py-2 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/70 hover:text-sol-gold disabled:opacity-30 disabled:hover:border-sol-line disabled:hover:text-sol-ink";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Teach mode: ${section.title}`}
      tabIndex={-1}
      className="sol-night fixed inset-0 z-[100] flex flex-col bg-[#05060f] text-sol-ink outline-none"
      style={{ backgroundImage: "radial-gradient(60% 50% at 50% 0%, rgba(120,73,206,0.22), transparent), radial-gradient(40% 30% at 85% 90%, rgba(244,196,90,0.10), transparent)" }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.2em] text-sol-gold">{section.title}</p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-sol-muted">{index + 1} / {section.verses.length}</span>
          <button type="button" className={btn} onClick={close}>Close</button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-6 py-6 sm:px-14">
        <figure key={verse.id} className="mx-auto max-w-5xl text-center">
          <blockquote className={`font-sol leading-snug text-sol-ink ${sizeClass}`}>{verse.text}</blockquote>
          <figcaption className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-sol-gold sm:text-base">
            {verse.ref} <span className="text-sol-muted">KJV</span>
          </figcaption>
        </figure>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <button type="button" className={btn} disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          ← Previous
        </button>
        <p className="hidden text-xs text-sol-muted sm:block">Arrow keys to move · F for full screen · Esc to close</p>
        <button
          type="button"
          className={btn}
          disabled={index === section.verses.length - 1}
          onClick={() => setIndex((i) => Math.min(section.verses.length - 1, i + 1))}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
