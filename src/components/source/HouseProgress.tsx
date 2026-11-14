"use client";

import { useEffect, useState } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

// A small house that is built as you read: foundation, walls, roof, door, and finally a light in
// the window. It replaces a plain progress bar. The idea is the page's own: check the foundation,
// then build, then live in truth.
export default function HouseProgress() {
  const [p, setP] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      // Progress is measured against the article, so the house is finished when the closing line
      // arrives and not when the footer ends.
      const article = document.querySelector("article");
      const rect = article?.getBoundingClientRect();
      const total = rect ? rect.height - window.innerHeight : 0;
      const next = rect && total > 0 ? clamp(-rect.top / total) : 0;
      setP((prev) => (Math.abs(prev - next) > 0.004 ? next : prev));
      setShown(window.scrollY > 260);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const draw = (a: number, b: number) => ({ strokeDasharray: 1, strokeDashoffset: 1 - seg(p, a, b) });
  const lit = seg(p, 0.86, 1);
  const stroke = "currentColor";

  return (
    <div
      role="img"
      aria-label={`Your progress through this page, shown as a house being built. ${Math.round(p * 100)} percent.`}
      className={`pointer-events-none fixed right-3 top-[8.25rem] z-[60] transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"} rounded-2xl border border-sol-line bg-sol-paper/90 p-1.5 shadow-lg shadow-black/40 backdrop-blur sm:right-5 sm:top-[9.5rem]`}
    >
      <svg viewBox="0 0 64 64" className="h-12 w-12 text-sol-gold sm:h-14 sm:w-14" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 57 H58" stroke="currentColor" strokeWidth="1.6" className="text-sol-muted/50" />
        <path d="M8 57 H56" pathLength={1} stroke={stroke} style={draw(0, 0.14)} />
        <path d="M14 57 V31" pathLength={1} stroke={stroke} style={draw(0.14, 0.3)} />
        <path d="M50 57 V31" pathLength={1} stroke={stroke} style={draw(0.3, 0.46)} />
        <path d="M9 33 L32 12 L55 33" pathLength={1} stroke={stroke} style={draw(0.46, 0.7)} />
        <path d="M27 57 V45 H37 V57" pathLength={1} stroke={stroke} style={draw(0.7, 0.86)} />
        <circle cx="32" cy="29" r="7" fill="var(--sol-spark)" stroke="none" style={{ opacity: lit * 0.35 }} />
        <circle cx="32" cy="29" r="3.4" fill="var(--sol-spark)" stroke="none" style={{ opacity: lit }} />
      </svg>
    </div>
  );
}
