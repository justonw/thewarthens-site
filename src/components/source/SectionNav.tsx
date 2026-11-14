"use client";

import { useEffect, useRef, useState } from "react";

export type NavItem = { id: string; label: string };

// A slim menu that sticks under the site header, so a reader always knows where they are and can
// jump to the test, the acts, the worksheet, or the hurting path.
export default function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [top, setTop] = useState(60);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const header = document.querySelector("header.sticky");
    const measure = () => setTop(header ? Math.round(header.getBoundingClientRect().height) : 60);
    measure();
    window.addEventListener("resize", measure);

    let frame = 0;
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Keep the active item visible when the menu scrolls sideways on a phone.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (el && list) list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="sticky z-40 border-y border-sol-line bg-sol-paper/85 backdrop-blur-xl"
      style={{ top }}
    >
      <ul ref={listRef} className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <li key={it.id} data-id={it.id} className="shrink-0">
            <a
              href={`#${it.id}`}
              aria-current={active === it.id ? "true" : undefined}
              className={`block rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                active === it.id ? "bg-sol-primary text-sol-on-primary" : "text-sol-ink/80 hover:text-sol-gold"
              }`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
