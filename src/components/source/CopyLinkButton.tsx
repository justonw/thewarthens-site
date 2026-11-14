"use client";

import { useState } from "react";

export default function CopyLinkButton({ url, className = "" }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function go() {
    if ("share" in navigator) {
      try {
        await navigator.share({ title: "Source of Life", text: "Source of Life: why you can praise God anyway", url });
        return;
      } catch {
        // Cancelled: fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked.
    }
  }
  return (
    <button type="button" onClick={go} className={className} aria-live="polite">
      {copied ? "Link copied" : "Share this page"}
    </button>
  );
}
