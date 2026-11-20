"use client";

import { useState, type ReactNode } from "react";

// "Make it stronger": the optional improvements to a finished resume (questions about the job, and bullets that could carry a
// number) in one section, with one heading, one count, and one progress bar, and a way to fold it away. The parts inside keep
// all their own behavior and report how many things are still open. While nothing is open or visible, the section hides itself
// but stays mounted, so the parts can keep reporting.

export default function MakeStronger({ open, total, visible, children }: { open: number; total: number; visible: boolean; children: ReactNode }) {
  const [shown, setShown] = useState(true);
  const done = Math.max(0, total - open);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section
      id="make-stronger"
      aria-labelledby="ms-title"
      className={`scroll-mt-24 rounded-3xl border border-border-subtle bg-background-elevated p-4 shadow-sm sm:p-6 ${visible ? "" : "hidden"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Optional</p>
          <h3 id="ms-title" className="mt-0.5 text-xl font-semibold tracking-tight">
            Make it stronger
          </h3>
          <p className="mt-1 max-w-xl text-sm text-foreground-muted">Only add what is true. Each question you skip is left off, so nothing on your resume is untrue.</p>
        </div>
        <div className="flex items-center gap-3">
          <p role="status" className={`text-sm font-semibold ${open === 0 ? "text-green-700" : "text-violet-800"}`}>
            {open === 0 ? "All done" : `${open} to go`}
          </p>
          <button
            type="button"
            aria-expanded={shown}
            aria-controls="make-stronger-body"
            onClick={() => setShown((v) => !v)}
            className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-sm font-semibold transition-colors hover:border-blue-500/40"
          >
            {shown ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label="Improvements reviewed">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      )}

      <div id="make-stronger-body" hidden={!shown} className="mt-5 space-y-6 [&>*+*]:border-t [&>*+*]:border-border-subtle [&>*+*]:pt-6">
        {children}
      </div>
    </section>
  );
}
