"use client";

import { useLayoutEffect, useRef } from "react";

// A text box that grows with its text, so nothing hides behind a scrollbar.
export default function AutoTextarea({ value, className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight + 2}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} className={`${className ?? ""} resize-none overflow-hidden`} {...rest} />;
}
