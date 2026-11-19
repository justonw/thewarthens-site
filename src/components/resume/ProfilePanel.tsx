"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_NOTES_CHARS, MAX_RESUME_CHARS } from "@/lib/resume-input-limits";
import { parseProfileFile, type Profile, type Story } from "@/lib/resume-profile";

// "Your saved profile": shows what is kept on this device, lets the person download a copy, load one back (on this or
// another device), and forget everything. When nothing is saved yet it is a single quiet line offering to import a file.

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export default function ProfilePanel({
  hasSaved,
  resumeText,
  notesText,
  stories,
  useStories,
  onUseStories,
  onRemoveStory,
  onImport,
  onExport,
  onForget,
  applications = 0,
}: {
  hasSaved: boolean;
  resumeText: string;
  notesText: string;
  stories: Story[];
  useStories: boolean;
  onUseStories: (v: boolean) => void;
  onRemoveStory: (id: string) => void;
  onImport: (profile: Profile, how: "replace" | "stories") => void;
  onExport: () => void;
  onForget: () => void;
  // How many saved builds ("My applications") are on this device.
  applications?: number;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Profile | null>(null);
  const [confirmForget, setConfirmForget] = useState(false);
  const has = hasSaved || stories.length > 0;

  // An error message goes away on its own, so it is never left on screen after the person has moved on.
  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => setError(""), 7000);
    return () => window.clearTimeout(t);
  }, [error]);

  async function pick(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    setError("");
    setPending(null);
    try {
      const parsed = parseProfileFile(await file.text(), { resume: MAX_RESUME_CHARS, notes: MAX_NOTES_CHARS });
      if (!parsed.ok) return setError(parsed.error);
      if (has) setPending(parsed.profile);
      else onImport(parsed.profile, "replace");
    } catch {
      setError("We couldn't read that file. Try downloading your profile again.");
    }
  }

  const input = (
    <input
      ref={picker}
      type="file"
      accept=".json,application/json"
      className="sr-only"
      tabIndex={-1}
      aria-label="Choose a saved profile file"
      onChange={(e) => {
        const files = e.target.files;
        void pick(files);
        e.target.value = "";
      }}
    />
  );

  const message = error ? (
    <p role="alert" className="mt-2 text-xs text-red-700">
      {error}
    </p>
  ) : null;

  if (!has) {
    return (
      <div className="mx-auto max-w-3xl text-center text-xs text-foreground-muted">
        Have a saved profile file?{" "}
        <button type="button" onClick={() => picker.current?.click()} className="min-h-8 font-semibold text-blue-700 underline underline-offset-2">
          Import it
        </button>
        {input}
        {message}
      </div>
    );
  }

  return (
    <section aria-label="Your saved profile" className="mx-auto max-w-3xl rounded-2xl border border-border-subtle bg-background-elevated p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Your saved profile</p>
          <p className="mt-0.5 text-xs text-foreground-muted">Kept in this browser only. We never receive it. Clearing your browser data or using a private window erases it, so download a copy.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onExport} className="inline-flex min-h-10 items-center rounded-full bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-500">
            Download a copy
          </button>
          <button type="button" onClick={() => picker.current?.click()} className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-white px-4 text-xs font-semibold transition-colors hover:border-blue-500/40">
            Import a copy
          </button>
        </div>
      </div>
      {input}
      {message}

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground-muted">
        <li>Resume: {resumeText.trim() ? `saved (${wordCount(resumeText).toLocaleString()} words)` : "not saved as text"}</li>
        <li>Notes: {notesText.trim() ? "saved" : "none"}</li>
        <li>
          Stories: {stories.length} {stories.length === 1 ? "answer" : "answers"}
        </li>
        <li>
          Applications: {applications} saved {applications === 1 ? "build" : "builds"}
        </li>
      </ul>

      {pending && (
        <div className="mt-3 rounded-xl bg-blue-500/5 p-3 text-sm">
          <p className="font-semibold">You already have a profile here. What should we do with the file?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onImport(pending, "replace");
                setPending(null);
              }}
              className="inline-flex min-h-10 items-center rounded-full bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Replace everything
            </button>
            <button
              type="button"
              onClick={() => {
                onImport(pending, "stories");
                setPending(null);
              }}
              className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-white px-4 text-xs font-semibold hover:border-blue-500/40"
            >
              Add its stories only
            </button>
            <button type="button" onClick={() => setPending(null)} className="min-h-10 px-2 text-xs text-foreground-muted underline underline-offset-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {stories.length > 0 && (
        <>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3">
            <input type="checkbox" checked={useStories} onChange={(e) => onUseStories(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
            <span>
              <span className="block text-sm font-semibold">Use my stories in my next resume</span>
              <span className="block text-xs text-foreground-muted">We add the true answers you gave before, so you don&apos;t have to tell us again.</span>
            </span>
          </label>
          <details className="group mt-3 rounded-xl border border-border-subtle bg-background">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span>My story bank ({stories.length})</span>
              <span aria-hidden className="text-foreground-muted transition-transform group-open:rotate-180">
                ⌄
              </span>
            </summary>
            <ul className="space-y-3 border-t border-border-subtle px-4 py-3">
              {[...stories].reverse().map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 text-sm">
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-foreground-muted">{s.topic}</span>
                    <span className="block">{s.answer}</span>
                  </span>
                  <button type="button" onClick={() => onRemoveStory(s.id)} aria-label={`Remove: ${s.topic}`} className="min-h-8 shrink-0 px-2 text-lg leading-none text-foreground-muted hover:text-red-700">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </>
      )}

      <div className="mt-4 border-t border-border-subtle pt-3 text-xs">
        {confirmForget ? (
          <span>
            Erase your saved resume, notes, stories, and saved builds from this browser?{" "}
            <button
              type="button"
              onClick={() => {
                onForget();
                setConfirmForget(false);
              }}
              className="font-semibold text-red-700 underline underline-offset-2"
            >
              Yes, erase it
            </button>{" "}
            <button type="button" onClick={() => setConfirmForget(false)} className="text-foreground-muted underline underline-offset-2">
              Keep it
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmForget(true)} className="min-h-8 text-foreground-muted underline underline-offset-2">
            Forget everything on this device
          </button>
        )}
      </div>
    </section>
  );
}
