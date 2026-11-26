"use client";

import { useEffect } from "react";

// A link can point at a verse that sits inside a closed answer. This opens the answer and brings the verse into view,
// so the link works in every browser.
export default function OpenToVerse() {
  useEffect(() => {
    function reveal() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      const answer = target?.closest("details");
      if (!target || !answer || answer.open) return;
      answer.open = true;
      requestAnimationFrame(() => target.scrollIntoView());
    }
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return null;
}
