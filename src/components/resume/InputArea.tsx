"use client";

import { useState } from "react";

// The big input area used on the resume tools. Empty, it invites: a dashed drop target with an icon, a plain
// headline, a "Choose a file" button, and the kinds of files that work. Click anywhere on it to type or paste.
// Filled, it becomes a normal text box with a quiet bar on top (a green check, a word count, "Add a file").
// While a file is being read, a spinner covers it; while one is dragged over, it lights up.

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export default function InputArea({
  id,
  value,
  onChange,
  onPaste,
  icon = "document",
  title,
  hint,
  formats,
  noun,
  dragging,
  working,
  onChoose,
  placeholder,
  aboveText,
  fileCount = 0,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  icon?: "document" | "link";
  title: string;
  hint: string;
  formats: string[];
  // What is in the box once it is filled, for the bar on top: "resume", "job posting".
  noun: string;
  dragging: boolean;
  // A short message while a file is being read, or null.
  working: string | null;
  onChoose: () => void;
  placeholder: string;
  // Anything to show between the bar and the text, such as the files already added.
  aboveText?: React.ReactNode;
  // Files already attached (kept as files, not as text), so the box does not look empty.
  fileCount?: number;
}) {
  const [focused, setFocused] = useState(false);
  const hasText = value.trim().length > 0;
  const filled = hasText || fileCount > 0;
  const inviting = !filled && !focused && !working;
  const words = wordCount(value);

  return (
    <div>
      {filled ? (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
            </svg>
            {hasText ? `Your ${noun} is in (${words.toLocaleString()} ${words === 1 ? "word" : "words"})` : `${fileCount} ${fileCount === 1 ? "file" : "files"} added`}
          </span>
          <button type="button" onClick={onChoose} className="min-h-8 rounded-full px-3 font-semibold text-blue-700 transition-colors hover:bg-blue-500/10">
            + Add a file
          </button>
        </div>
      ) : null}
      {aboveText}
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={onPaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`block h-72 w-full resize-y rounded-2xl border bg-background px-4 py-3 text-base leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground-muted/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${
            inviting ? "cursor-text border-2 border-dashed border-blue-500/35 bg-blue-500/[0.03] placeholder:text-transparent hover:border-blue-500/60 hover:bg-blue-500/[0.06]" : "border-border-subtle hover:border-blue-500/40"
          } ${dragging ? "!border-solid !border-blue-500 !bg-blue-500/10" : ""}`}
        />
        {inviting && !dragging ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/15 to-violet-600/15 text-blue-700">
              {icon === "link" ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" />
                  <path d="M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
                  <path d="M14 3v5h5M12 17v-5m0 0l-2 2m2-2l2 2" />
                </svg>
              )}
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">{title}</span>
            <span className="max-w-xs text-sm text-foreground-muted">{hint}</span>
            <span className="pointer-events-auto mt-1 inline-flex">
              <button
                type="button"
                tabIndex={-1}
                onClick={onChoose}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/20 transition-colors hover:bg-blue-500"
              >
                Choose a file
              </button>
            </span>
            <span className="mt-1 flex flex-wrap justify-center gap-1.5">
              {formats.map((f) => (
                <span key={f} className="rounded-full border border-blue-500/20 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                  {f}
                </span>
              ))}
            </span>
          </div>
        ) : null}
        {dragging ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl text-blue-700">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V5m0 0l-4 4m4-4l4 4" />
              <path d="M4 16v2.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V16" />
            </svg>
            <span className="text-base font-bold">Drop it here</span>
          </div>
        ) : null}
        {working ? (
          <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 text-center backdrop-blur-[1px]">
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-500/25 border-t-blue-600" aria-hidden />
            <span className="text-sm font-semibold text-foreground">{working}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
