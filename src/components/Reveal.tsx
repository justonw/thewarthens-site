"use client";

import { useEffect, useRef } from "react";

// Fades content up as it scrolls into view. Progressive on purpose: the server renders
// everything visible, so nothing waits on JavaScript. Only blocks that start below the fold
// are hidden after load, then revealed as they arrive. The state lives in a data attribute
// (see .reveal in globals.css) so it never triggers a React re-render.
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Already on screen when the page loads: leave it alone, no flash and no waiting.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "hidden";
    const show = () => {
      el.dataset.reveal = "shown";
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);

    // Safety net: never leave content hidden if the observer fails to fire.
    const fallback = setTimeout(show, 2500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
