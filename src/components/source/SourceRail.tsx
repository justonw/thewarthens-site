"use client";

import { useEffect, useState } from "react";

// Side tabs on wide screens: where you are in the devotional, with a short preview of what is in each part when you
// hover or tab to one. They appear once the overview near the top has scrolled out of sight, so there is only ever one
// map on screen. Phones and tablets keep the overview and the menu under the header.

export type RailItem = { id: string; mark: string; title: string; line: string; peek: string[]; note?: string };

export default function SourceRail({ items, watchId }: { items: RailItem[]; watchId: string }) {
  const [pastOverview, setPastOverview] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPastOverview(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  if (!pastOverview) return null;

  return (
    <nav aria-label="The parts of this devotional" className="fixed right-3 top-[calc(50%+2.5rem)] z-[55] hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-sol-line bg-sol-paper/90 p-1.5 shadow-lg shadow-black/20 backdrop-blur xl:flex">
      {items.map((it) => {
        const on = active === it.id;
        return (
          <div key={it.id} className="group/tab relative">
            <a
              href={`#${it.id}`}
              aria-current={on ? "location" : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-sol text-lg font-semibold transition-colors ${on ? "bg-sol-ink text-sol-paper" : "text-sol-ink/70 hover:bg-sol-card hover:text-sol-ink"}`}
            >
              <span className="sr-only">{it.title}</span>
              <span aria-hidden>{it.mark}</span>
            </a>
            <div
              role="tooltip"
              className="pointer-events-none absolute right-full top-1/2 mr-3 hidden w-72 -translate-y-1/2 rounded-2xl border border-sol-line bg-sol-card p-4 text-left shadow-xl shadow-black/20 group-focus-within/tab:block group-hover/tab:block"
            >
              <p className="text-sm font-semibold text-sol-ink">{it.title}</p>
              <p className="mt-1 text-sm text-sol-ink/80">{it.line}</p>
              {it.peek.length > 0 && (
                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-sol-muted">
                  {it.peek.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
              {it.note && <p className="mt-2 text-xs font-semibold text-sol-gold">{it.note}</p>}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
