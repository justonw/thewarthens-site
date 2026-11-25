"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/lib/birthday";

// A swipe gallery: on a phone you swipe; with a mouse you use the arrows or the dots. It uses the browser's own
// scroll snapping, so it works without any script for swiping.
export default function PhotoSwipe() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + GALLERY.length) % GALLERY.length;
    const slide = el.children[n] as HTMLElement | undefined;
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - (el.clientWidth - slide.clientWidth) / 2, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const child = c as HTMLElement;
        const d = Math.abs(child.offsetLeft - el.offsetLeft + child.clientWidth / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label="Photos of Atiya">
      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[6%] pb-4 pt-2 [scrollbar-width:none] sm:px-[8%] lg:px-[10%] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
      >
        {GALLERY.map((p, i) => (
          <li
            key={p.src}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${GALLERY.length}`}
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
            className={`relative h-[380px] max-w-[88vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border-4 bg-[#f3e8ff] shadow-xl transition duration-300 sm:h-[460px] lg:h-[520px] ${
              i === index ? "scale-100 border-[#e11d48]" : "scale-[0.93] border-white opacity-80"
            }`}
          >
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 520px, 88vw" className="object-cover" />
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className="absolute left-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#7c3aed] shadow-lg ring-2 ring-[#7c3aed]/20 hover:bg-[#f3e8ff] sm:flex">
        ‹
      </button>
      <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className="absolute right-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#e11d48] shadow-lg ring-2 ring-[#e11d48]/20 hover:bg-[#fff1f4] sm:flex">
        ›
      </button>

      <div className="mt-2 flex items-center justify-center gap-2" role="group" aria-label="Choose a photo">
        {GALLERY.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            className={`h-3 rounded-full transition-all ${i === index ? "w-8 bg-[#e11d48]" : "w-3 bg-[#d9c4f3] hover:bg-[#7c3aed]"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-[#7c3aed]">Swipe to see more →</p>
    </div>
  );
}
