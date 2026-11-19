"use client";

import { useEffect, useRef } from "react";

// A long tool that is folded behind one clear button on phones, so it does not push the rest of the page several screens
// down, and open as usual on tablets and computers. It also opens itself when the visitor arrives through a link to it
// (for example /tech#checklist), so a link never lands on a closed box.

export default function FoldOnPhone({
  id,
  title,
  hint,
  children,
}: {
  // The id of the section this folds, so a link to "#id" opens it.
  id: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const sync = () => {
      const wide = typeof window.matchMedia === "function" && window.matchMedia("(min-width: 768px)").matches;
      if (wide || window.location.hash === `#${id}`) details.open = true;
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [id]);

  return (
    <details ref={ref} className="group">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border border-border-subtle bg-background-elevated px-5 py-4 shadow-sm md:hidden">
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="block text-sm text-foreground-muted">{hint}</span>
        </span>
        <span aria-hidden className="shrink-0 text-lg text-foreground-muted transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="mt-4 md:mt-0">{children}</div>
    </details>
  );
}
