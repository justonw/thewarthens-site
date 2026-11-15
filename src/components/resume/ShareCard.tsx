"use client";

import { useState } from "react";

// "Know someone job hunting?" The message is generic on purpose: it never includes the person's name, the
// job, or the company, since a job search is often private.
const URL = "https://thewarthens.com/resume?from=share";
const TEXT = "I just tailored my resume to a job posting in about a minute with this free Resume Builder from The Warthens.";

export default function ShareCard() {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function nativeShare() {
    try {
      await navigator.share({ title: "Resume Builder", text: TEXT, url: URL });
    } catch {
      // Cancelled or blocked: nothing to do.
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${TEXT} ${URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying can be blocked; the share links still work.
    }
  }

  const btn = "rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40";

  return (
    <section className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
      <p className="font-semibold">Know someone job hunting?</p>
      <p className="mt-1 text-sm text-foreground-muted">Pass it on. It&apos;s free for them too.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canShare && (
          <button type="button" onClick={nativeShare} className={btn}>
            Share
          </button>
        )}
        <button type="button" onClick={copy} className={btn}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(URL)}`} target="_blank" rel="noopener noreferrer" className={btn}>
          LinkedIn
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(TEXT)}&url=${encodeURIComponent(URL)}`} target="_blank" rel="noopener noreferrer" className={btn}>
          X
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}`} target="_blank" rel="noopener noreferrer" className={btn}>
          Facebook
        </a>
      </div>
    </section>
  );
}
