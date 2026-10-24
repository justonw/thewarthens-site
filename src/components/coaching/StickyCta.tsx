"use client";

import { useEffect, useState } from "react";

// A small always-reachable button that appears almost as soon as the visitor starts
// scrolling, and gets out of the way when the form itself is on screen.
const SHOW_AFTER_PX = 60;

export default function StickyCta({ formId }: { formId: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener("scroll", onScroll, { passive: true });

    const form = document.getElementById(formId);
    let formObserver: IntersectionObserver | undefined;
    if (form && typeof IntersectionObserver !== "undefined") {
      formObserver = new IntersectionObserver(([entry]) => setAtForm(entry.isIntersecting), {
        threshold: 0,
      });
      formObserver.observe(form);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      formObserver?.disconnect();
    };
  }, [formId]);

  const show = scrolled && !atForm;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur transition duration-300 motion-reduce:transition-none md:inset-x-auto md:bottom-6 md:right-6 md:rounded-full md:border md:py-2.5 md:pl-6 md:pr-2.5 md:shadow-xl md:shadow-blue-950/10 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 md:gap-5">
        <p className="text-xs font-medium leading-tight text-foreground-muted sm:text-sm">
          Paid 1:1 coaching
          <span className="block font-semibold text-foreground">Free 15-minute intro call</span>
        </p>
        <a
          href={`#${formId}`}
          tabIndex={show ? 0 : -1}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Request a call
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
