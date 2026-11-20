"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePersistentState } from "@/lib/use-persistent-state";

// A slim guide on the right edge of wide screens: where you are on the page and a one-click jump to any part.
// It appears once the in-page "Jump to" bar has scrolled out of sight, so there is never more than one map on screen.
// Phones and tablets keep the "Jump to" bar.

export type RailItem = { href: string; label: string };

export default function TechRail({ items, watchId }: { items: RailItem[]; watchId: string }) {
  // Shown once the bar has scrolled up and out of sight (not while it is still below the screen).
  const [pastBar, setPastBar] = useState(false);
  const [active, setActive] = useState<string>("");
  const [collapsed, setCollapsed] = usePersistentState<boolean>("tech-rail-collapsed", false);

  useEffect(() => {
    const bar = document.getElementById(watchId);
    if (!bar || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPastBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(bar);
    return () => io.disconnect();
  }, [watchId]);

  // The section that sits in the upper part of the screen is the one you are "in".
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = items.filter((i) => i.href.startsWith("#")).map((i) => i.href.slice(1));
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = ids.find((id) => seen.has(id));
        if (first) setActive(first);
        else if (seen.size === 0) setActive("");
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  if (!pastBar) return null;

  return (
    <nav
      aria-label="Jump to a part of this page"
      className="group fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-0.5 rounded-2xl border border-border-subtle bg-background-elevated/95 p-1.5 shadow-lg backdrop-blur xl:flex"
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Show labels" : "Hide labels"}
        aria-expanded={!collapsed}
        className="hidden self-end rounded-full px-2 text-sm text-foreground-muted hover:text-foreground 2xl:block"
      >
        {collapsed ? "‹" : "›"}
      </button>
      {items.map((item, i) => {
        const on = active === item.href.slice(1);
        const cls = `flex min-h-10 items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-semibold transition-colors ${
          on ? "bg-foreground text-background" : "text-foreground-muted hover:bg-background hover:text-foreground"
        }`;
        const inner = (
          <>
            <span
              aria-hidden
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${on ? "bg-background/20" : "bg-border-subtle/70"}`}
            >
              {i + 1}
            </span>
            <span className={`sr-only whitespace-nowrap group-focus-within:not-sr-only group-hover:not-sr-only ${collapsed ? "" : "2xl:not-sr-only"}`}>{item.label}</span>
          </>
        );
        return item.href.startsWith("#") ? (
          <a key={item.href} href={item.href} title={item.label} aria-current={on ? "location" : undefined} className={cls}>
            {inner}
          </a>
        ) : (
          <Link key={item.href} href={`${item.href}?from=tech-hub`} title={item.label} className={cls}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
