"use client";

import { useEffect, useRef, useState } from "react";
import { usePersistentState } from "@/lib/use-persistent-state";

// "Your job search kit": the map of everything a finished resume leads to, in the order a job search happens, with a mark on
// each part that says whether it is done or needs something. One list drives three views of the same navigation:
//   1. the strip under the result (the map, shown in the page),
//   2. a slim rail on the right edge of wide screens, and
//   3. a bottom bar on phones and tablets,
// where 2 and 3 appear only once the strip has scrolled out of sight, so there is never more than one map on screen.

export type KitId = "resume" | "letter" | "reach" | "answers" | "interview";
export type KitState = "done" | "needs" | "todo";
export type KitItem = {
  id: KitId;
  // The word on the rail and the bottom bar.
  short: string;
  // The name of the step on the strip.
  title: string;
  // When in a job search this is used.
  when: string;
  state: KitState;
  // For "needs": how many things to fix.
  count?: number;
  // One plain line about where this stands.
  note: string;
};

const ICON: Record<KitId, string[]> = {
  resume: ["M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V8z", "M14 3v5h5", "M9 13h6", "M9 17h4"],
  letter: ["M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z", "M3.5 6.5l8.5 6.5 8.5-6.5"],
  reach: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4z"],
  answers: ["M9 6h11", "M9 12h11", "M9 18h11", "M3.5 6l1.5 1.5L7 5", "M3.5 12l1.5 1.5L7 11", "M3.5 18l1.5 1.5L7 17"],
  interview: ["M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z", "M5 11a7 7 0 0014 0", "M12 18v3"],
};

function Icon({ id, className = "h-5 w-5" }: { id: KitId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICON[id].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function DownloadIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function Mark({ item }: { item: KitItem }) {
  if (item.state === "done") {
    return (
      <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (item.state === "needs") {
    return (
      <span aria-hidden className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold leading-none text-white">
        {item.count ?? "!"}
      </span>
    );
  }
  return null;
}

const stateText = (i: KitItem) => (i.state === "done" ? "done" : i.state === "needs" ? `${i.count ?? 1} to do` : "not started yet");

// A small dot on an icon (rail and bottom bar), where there is no room for the full mark.
function Dot({ item }: { item: KitItem }) {
  if (item.state === "todo") return null;
  return <span aria-hidden className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-background-elevated ${item.state === "done" ? "bg-green-600" : "bg-amber-500"}`} />;
}

const COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

export default function KitNav({
  title,
  items,
  current,
  nextId,
  onSelect,
  onOpenDownloads,
}: {
  title: string;
  items: KitItem[];
  current: KitId;
  // The step to do next (shown with a "Next" mark), or null.
  nextId: KitId | null;
  onSelect: (id: KitId) => void;
  // Opens the "Your files" panel.
  onOpenDownloads: () => void;
}) {
  const stripRef = useRef<HTMLElement>(null);
  const [stripVisible, setStripVisible] = useState(true);
  const [collapsed, setCollapsed] = usePersistentState<boolean>("rt-rail-collapsed", false);

  // The rail and the bottom bar show only when the strip is out of sight.
  useEffect(() => {
    const el = stripRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setStripVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Two items (a general resume and its letter) do not need a second map.
  const showFloating = !stripVisible && items.length > 2;

  // While the bottom bar shows, tell the page, so the chat button can sit above it instead of covering its last item.
  useEffect(() => {
    if (!showFloating) return;
    document.body.dataset.kitBar = "1";
    return () => {
      delete document.body.dataset.kitBar;
    };
  }, [showFloating]);

  return (
    <>
      <nav ref={stripRef} id="rt-tabs" aria-label={title} className="scroll-mt-20 rounded-3xl border border-border-subtle bg-background-elevated p-3 sm:p-4">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-foreground-muted">{title}</p>
        <ul className={`mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 ${COLS[items.length] ?? "lg:grid-cols-5"}`}>
          {items.map((i) => {
            const active = current === i.id;
            return (
              <li key={i.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onSelect(i.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full min-h-11 w-full flex-col items-start rounded-2xl border p-3 text-left transition-colors ${
                    active ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600" : "border-border-subtle bg-background hover:border-blue-500/40"
                  }`}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">{i.when}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {nextId === i.id && !active && <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">Next</span>}
                      <Mark item={i} />
                    </span>
                  </span>
                  <span className="mt-1.5 flex items-center gap-2 text-sm font-semibold leading-snug">
                    <Icon id={i.id} className="h-4 w-4 shrink-0 text-foreground-muted" />
                    {i.title}
                  </span>
                  <span className={`mt-1 text-xs text-foreground-muted ${i.state === "needs" ? "" : "max-sm:hidden"}`}>{i.note}</span>
                  <span className="sr-only">Status: {stateText(i)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {showFloating && (
        <>
          <nav aria-label="Jump to a part of your kit" className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-border-subtle bg-background-elevated/95 p-1.5 shadow-lg backdrop-blur xl:flex">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Show labels" : "Hide labels"}
              aria-expanded={!collapsed}
              className="self-end rounded-full px-2 text-sm text-foreground-muted hover:text-foreground"
            >
              {collapsed ? "‹" : "›"}
            </button>
            {items.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => onSelect(i.id)}
                aria-current={current === i.id ? "page" : undefined}
                title={i.title}
                className={`flex min-h-11 items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                  current === i.id ? "bg-foreground text-background" : "text-foreground-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <span className="relative">
                  <Icon id={i.id} />
                  <Dot item={i} />
                </span>
                {!collapsed && <span>{i.short}</span>}
                <span className="sr-only">{collapsed ? `${i.short}. ` : ""}Status: {stateText(i)}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={onOpenDownloads}
              title="Your files"
              className="mt-1 flex min-h-11 items-center gap-2 rounded-xl border-t border-border-subtle px-2.5 py-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <DownloadIcon />
              {!collapsed && <span>Download</span>}
              {collapsed && <span className="sr-only">Download</span>}
            </button>
          </nav>

          <nav aria-label="Jump to a part of your kit" className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-background-elevated/95 pb-[env(safe-area-inset-bottom)] backdrop-blur xl:hidden">
            <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length + 1}, minmax(0, 1fr))` }}>
              {items.map((i) => (
                <li key={i.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onSelect(i.id)}
                    aria-current={current === i.id ? "page" : undefined}
                    className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-semibold transition-colors ${
                      current === i.id ? "bg-blue-600/10 text-blue-700" : "text-foreground-muted"
                    }`}
                  >
                    <span className="relative">
                      <Icon id={i.id} />
                      <Dot item={i} />
                    </span>
                    {i.short}
                    <span className="sr-only">Status: {stateText(i)}</span>
                  </button>
                </li>
              ))}
              <li className="min-w-0">
                <button type="button" onClick={onOpenDownloads} className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-semibold text-foreground-muted transition-colors">
                  <DownloadIcon />
                  Download
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
