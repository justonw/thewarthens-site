"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  LESSON_LABEL,
  LESSON_SUBTITLE,
  LESSON_TITLE,
  MAX_NOTE_LENGTH,
  actions,
  contexts,
  explanation,
  synopsis,
  versionNotice,
  type Verse,
} from "@/lib/present-missing";

// The read-along page for the men's lesson. A man follows the notes, writes in the boxes (saved
// only on his own device), and can email himself a PDF of the lesson with his answers.

const STORAGE_KEY = "warthens-present-missing-notes-v1";

type Answers = Record<string, string>;

function VerseBlock({ verse }: { verse: Verse }) {
  return (
    <blockquote className="border-l-4 border-purple-700/40 pl-4">
      <p className="text-lg leading-relaxed text-foreground">{verse.text}</p>
      <footer className="mt-1 text-sm font-semibold text-foreground-muted">
        {verse.ref} <span className="font-normal">({verse.version})</span>
      </footer>
    </blockquote>
  );
}

function NoteBox({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-purple-800">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={MAX_NOTE_LENGTH}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Write here"
        rows={4}
        className="field-sizing-content mt-2 block min-h-28 w-full resize-y rounded-2xl border border-border-subtle bg-background px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-foreground-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-purple-700"
      />
    </div>
  );
}

const sectionTitle = "text-2xl font-semibold tracking-tight text-mauve-800 sm:text-3xl";

export default function PresentMissingLesson() {
  const [answers, setAnswers] = useState<Answers>({});
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const saveTimer = useRef<number | null>(null);

  // Load this device's saved notes once the page is open.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setAnswers(JSON.parse(saved) as Answers);
      } catch {
        // Private windows can block storage. The page still works, it just will not remember.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const change = (id: string, value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Not saved on this device; the email button still works.
        }
      }, 400);
      return next;
    });
  };

  const clearNotes = () => {
    if (!window.confirm("Clear everything you wrote on this device? This cannot be undone.")) return;
    setAnswers({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing saved to remove.
    }
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/present-missing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, answers, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        setStatus("sent");
        setMessage("Sent. Check your email (and your spam folder) for your PDF.");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please check your connection and try again.");
    }
  };

  const value = (id: string) => answers[id] ?? "";

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-10 sm:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/faith" className="hover:text-foreground">
              Faith Journey
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            {LESSON_TITLE}
          </li>
        </ol>
      </nav>

      <header className="mt-8">
        <p className="inline-flex rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
          {LESSON_LABEL}
        </p>
        <h1 className="text-balance mt-5 text-4xl font-semibold tracking-tight text-mauve-900 sm:text-5xl">
          {LESSON_TITLE}
        </h1>
        <p className="mt-2 text-xl text-foreground-muted">{LESSON_SUBTITLE}</p>
        <p className="mt-5 rounded-2xl bg-background-elevated px-5 py-4 text-sm text-foreground-muted">
          Follow along and write in the boxes. What you write is saved only on this phone or computer.
          At the end, you can email yourself a PDF of the lesson with your notes.
        </p>
        <nav aria-label="On this page" className="mt-5 flex flex-wrap gap-2 text-sm">
          {[
            ["#synopsis", "Synopsis"],
            ["#explanation", "Explanation"],
            ["#questions", "Questions"],
            ["#action", "What to do"],
            ["#notes", "Get my notes"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-foreground-muted transition-colors hover:border-purple-700/40 hover:text-purple-800"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section id="synopsis" className="mt-14 scroll-mt-24">
        <h2 className={sectionTitle}>Synopsis</h2>
        <div className="mt-5 space-y-4 rounded-3xl bg-gradient-to-br from-purple-700/10 to-rose-300/10 p-6 text-xl leading-relaxed text-foreground sm:p-8">
          {synopsis.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section id="explanation" className="mt-14 scroll-mt-24 space-y-10">
        {explanation.map((group) => (
          <div key={group.heading}>
            <h2 className={sectionTitle}>{group.heading}</h2>
            <div className="mt-5 space-y-5">
              {group.verses.map((v) => (
                <VerseBlock key={v.ref} verse={v} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="questions" className="mt-16 scroll-mt-24">
        <h2 className={sectionTitle}>Questions to internalize</h2>
        <p className="mt-2 text-foreground-muted">Take a moment with each question before you write.</p>
        <div className="mt-8 space-y-10">
          {contexts.map((c, i) => (
            <div key={c.id} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
              <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-purple-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-sm text-white">
                  {i + 1}
                </span>
                {c.label}
              </p>
              <p className="mt-4 text-2xl font-semibold leading-snug text-mauve-900">{c.question}</p>
              {c.honor && (
                <div className="mt-5">
                  <VerseBlock verse={c.honor} />
                </div>
              )}
              <div className="mt-6">
                <NoteBox id={`q-${c.id}`} label="My notes" value={value(`q-${c.id}`)} onChange={change} />
              </div>
              <div className="mt-7 border-t border-border-subtle pt-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">How to respond</p>
                <p className="mt-2 text-xl leading-relaxed text-foreground">{c.respond}</p>
                {c.references && (
                  <div className="mt-5 space-y-4">
                    {c.references.map((v) => (
                      <VerseBlock key={v.ref} verse={v} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="action" className="mt-16 scroll-mt-24">
        <h2 className={sectionTitle}>What to do about it</h2>
        <div className="mt-8 space-y-10">
          {actions.map((a) => (
            <div key={a.id} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-mauve-900">{a.label}</h3>
              <div className="mt-5 space-y-5">
                {a.verses.map((v) => (
                  <VerseBlock key={v.ref} verse={v} />
                ))}
              </div>
              <div className="mt-6">
                <NoteBox id={`a-${a.id}`} label="My next step" value={value(`a-${a.id}`)} onChange={change} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="notes" className="mt-16 scroll-mt-24">
        <div className="rounded-3xl bg-mauve-800 p-6 text-white sm:p-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Get my notes</h2>
          <p className="mt-3 text-rose-100">
            Type your email and we will send you a PDF with the lesson and everything you wrote. It goes
            only to the address you enter. We do not receive a copy or keep your notes.
          </p>
          <form onSubmit={send} className="mt-6 space-y-4">
            <div>
              <label htmlFor="pm-email" className="text-sm font-semibold text-rose-100">
                Your email
              </label>
              <input
                id="pm-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 block w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              />
            </div>
            {/* Hidden from people. Automated forms tend to fill it in. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <button
              type="submit"
              disabled={status === "sending" || email.trim() === ""}
              className="rounded-full bg-white px-7 py-3 text-base font-semibold text-mauve-900 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Email me the PDF"}
            </button>
            <p role="status" aria-live="polite" className={`text-sm ${status === "error" ? "text-rose-200" : "text-white"}`}>
              {message}
            </p>
          </form>
          <p className="mt-4 text-sm text-rose-200">
            {loaded ? "Your notes are saved on this device as you type." : ""}{" "}
            <button type="button" onClick={clearNotes} className="underline underline-offset-4 hover:text-white">
              Clear my notes
            </button>
          </p>
        </div>
      </section>

      <footer className="mt-12 space-y-3 text-xs text-foreground-muted">
        <p>{versionNotice.NASB2020}</p>
        <p>{versionNotice.NLT}</p>
      </footer>
    </article>
  );
}
