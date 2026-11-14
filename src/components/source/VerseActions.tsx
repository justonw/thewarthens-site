"use client";

import { useState } from "react";

// Copy and share buttons for one verse. The copied text carries the reference and a link back to
// the exact verse on this page.
export default function VerseActions({ id, text, reference }: { id: string; text: string; reference: string }) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");
  const url = `https://thewarthens.com/source-of-life#${id}`;
  const payload = `“${text}”\n${reference} (KJV)\n${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(payload);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      // Clipboard blocked: nothing to do, the verse is on screen.
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: `${reference} (KJV)`, text: `“${text}”\n${reference} (KJV)`, url });
        return;
      } catch {
        // Cancelled, or not allowed: fall through to copying.
      }
    }
    await copy();
  }

  const btn =
    "rounded-full border border-sol-line px-3 py-1 text-xs font-semibold text-sol-ink/80 transition-colors hover:border-sol-gold/60 hover:text-sol-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sol-gold";
  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <button type="button" onClick={copy} className={btn}>
        {status === "copied" ? "Copied" : "Copy"}
      </button>
      <button type="button" onClick={share} className={btn}>
        Share
      </button>
    </div>
  );
}
