"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  LESSON_LABEL,
  LESSON_LEAD,
  LESSON_SUBTITLE,
  LESSON_TITLE,
  MAX_NOTE_LENGTH,
  actionFor,
  contexts,
  explanation,
  morePresent,
  faq,
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
    <blockquote className="border-l-4 border-blue-700/40 pl-4">
      <p className="text-lg leading-relaxed text-foreground">{verse.text}</p>
      <footer className="mt-1 text-sm font-semibold text-foreground-muted">
        {verse.ref} <span className="font-normal">({verse.version})</span>
      </footer>
    </blockquote>
  );
}

// Consecutive verses from the same chapter and translation read as one passage with small verse
// numbers (Isaiah 58:3-10), instead of a stack of one-line blocks. The words are not changed.
type Passage = { ref: string; version: Verse["version"]; parts: { n: string; text: string }[] };

function mergePassages(verses: Verse[]): Passage[] {
  const out: (Passage & { book: string; chapter: string; last: number })[] = [];
  for (const v of verses) {
    const m = /^(.+) (\d+):(\d+)(?:-(\d+))?$/.exec(v.ref);
    if (!m) {
      out.push({ ref: v.ref, version: v.version, parts: [{ n: "", text: v.text }], book: v.ref, chapter: "", last: -1 });
      continue;
    }
    const [, book, chapter, start, end] = m;
    const first = Number(start);
    const last = Number(end ?? start);
    const prev = out[out.length - 1];
    if (prev && prev.book === book && prev.chapter === chapter && prev.version === v.version && prev.last === first - 1) {
      prev.parts.push({ n: end ? `${start}-${end}` : start, text: v.text });
      prev.last = last;
      prev.ref = `${book} ${chapter}:${prev.ref.split(":")[1].split("-")[0]}-${last}`;
    } else {
      out.push({ ref: v.ref, version: v.version, parts: [{ n: end ? `${start}-${end}` : start, text: v.text }], book, chapter, last });
    }
  }
  return out;
}

function PassageBlock({ passage }: { passage: Passage }) {
  const numbered = passage.parts.length > 1;
  // Short passages run together; long ones get one line per verse so they stay easy to follow.
  const perLine = passage.parts.length > 3;
  const verseNumber = (n: string) =>
    numbered && n ? <sup className="mr-1 text-[0.65em] font-semibold text-blue-700">{n.split("-")[0]}</sup> : null;
  return (
    <blockquote className="border-l-4 border-blue-700/40 pl-4">
      {perLine ? (
        <div className="space-y-2.5 text-lg leading-relaxed text-foreground">
          {passage.parts.map((part, i) => (
            <p key={i}>
              {verseNumber(part.n)}
              {part.text}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-lg leading-relaxed text-foreground">
          {passage.parts.map((part, i) => (
            <span key={i}>
              {verseNumber(part.n)}
              {part.text}{" "}
            </span>
          ))}
        </p>
      )}
      <footer className="mt-1 text-sm font-semibold text-foreground-muted">
        {passage.ref} <span className="font-normal">({passage.version})</span>
      </footer>
    </blockquote>
  );
}

// Scripture for a topic. Short sets stay open. Long ones (John 8, Galatians 2) fold up so the
// question and the next-step box stay close together; one tap opens them.
function Scripture({ verses, collapsible = true }: { verses: Verse[]; collapsible?: boolean }) {
  const passages = mergePassages(verses);
  const total = passages.reduce((n, p) => n + p.parts.length, 0);
  const list = (
    <div className="space-y-5">
      {passages.map((p) => (
        <PassageBlock key={p.ref} passage={p} />
      ))}
    </div>
  );
  if (!collapsible || total <= 3) return list;
  return (
    <details className="group/passage rounded-2xl border border-border-subtle bg-background">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
        <span>Read {passages.map((p) => p.ref).join(" and ")}</span>
        <svg
          viewBox="0 0 20 20"
          className="h-5 w-5 shrink-0 transition-transform group-open/passage:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m5 8 5 5 5-5" />
        </svg>
      </summary>
      <div className="border-t border-border-subtle px-4 py-5">{list}</div>
    </details>
  );
}

const stageStyles = {
  reflect: { chip: "bg-blue-700", text: "text-blue-700", panel: "" },
  respond: { chip: "bg-indigo-700", text: "text-indigo-800", panel: "border-l-4 border-indigo-700/45 bg-background/70" },
  act: { chip: "bg-emerald-700", text: "text-emerald-800", panel: "border-l-4 border-emerald-700/45 bg-background/70" },
} as const;

function StageLabel({ stage, label, title }: { stage: keyof typeof stageStyles; label: string; title?: string }) {
  const s = stageStyles[stage];
  return (
    <p className={`flex flex-wrap items-center gap-2.5 text-sm font-semibold uppercase tracking-wider ${s.text}`}>
      <span className={`rounded-full px-3 py-1 text-xs text-white ${s.chip}`}>{label}</span>
      {title}
    </p>
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
      <label htmlFor={id} className="text-sm font-semibold text-blue-800">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={MAX_NOTE_LENGTH}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Write here"
        rows={4}
        className="field-sizing-content mt-2 block min-h-28 w-full resize-y rounded-2xl border border-border-subtle bg-background px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-foreground-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
      />
    </div>
  );
}

const sectionTitle = "text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl";

export default function PresentMissingLesson() {
  const [answers, setAnswers] = useState<Answers>({});
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const saveTimer = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Highlight the topic he is on in the progress bar.
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-question]"));
    if (!cards.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveIndex(Number((entry.target as HTMLElement).dataset.question));
        }
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

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
    <div className="theme-men bg-background text-foreground">
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
        <p className="inline-flex rounded-full border border-blue-600/25 bg-blue-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
          {LESSON_LABEL}
        </p>
        <h1 className="text-balance mt-5 text-4xl font-semibold tracking-tight text-blue-950 sm:text-5xl">
          {LESSON_TITLE}
        </h1>
        <p className="mt-2 text-xl text-foreground-muted">{LESSON_SUBTITLE}</p>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground">{LESSON_LEAD}</p>
        <p className="mt-5 rounded-2xl bg-background-elevated px-5 py-4 text-sm text-foreground-muted">
          Follow along and write in the boxes. What you write is saved only on this phone or computer.
          At the end, you can email yourself a PDF of the lesson with your notes.
        </p>
        <nav aria-label="On this page" className="mt-5 flex flex-wrap gap-2 text-sm">
          {[
            ["#synopsis", "Synopsis"],
            ["#explanation", "Explanation"],
            ["#questions", "Questions"],
            ["#more-scripture", "More Scripture"],
            ["#notes", "Get notes"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-border-subtle bg-background-elevated px-3.5 py-1.5 text-foreground-muted transition-colors hover:border-blue-700/40 hover:text-blue-800"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section id="synopsis" className="mt-14 scroll-mt-24">
        <h2 className={sectionTitle}>Synopsis</h2>
        <div className="mt-5 space-y-4 rounded-3xl bg-blue-900 p-6 text-xl leading-relaxed text-white sm:p-8">
          {synopsis.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section id="explanation" className="mt-14 scroll-mt-24 space-y-10">
        {explanation.map((group) => (
          <div key={group.heading}>
            <h2 className={sectionTitle}>{group.heading}</h2>
            <div className="mt-5">
              <Scripture verses={group.verses} collapsible={false} />
            </div>
          </div>
        ))}
      </section>

      <section id="questions" className="mt-16 scroll-mt-24">
        <h2 className={sectionTitle}>Questions to internalize</h2>
        <p className="mt-2 text-foreground-muted">
          Take each one in three steps: reflect and write, see how to respond, then decide what to do.
        </p>

        {/* Stays in view while he works through the four topics */}
        <nav
          aria-label="Question progress"
          className="sticky top-[3.6rem] z-30 -mx-6 mt-6 border-b border-border-subtle/70 bg-background/85 px-6 py-2.5 backdrop-blur-xl sm:top-[4.4rem]"
        >
          <ol className="flex items-center gap-2">
            {contexts.map((c, i) => {
              const active = i === activeIndex;
              return (
                <li key={c.id} className="min-w-0 flex-1">
                  <a
                    href={`#question-${c.id}`}
                    aria-current={active ? "step" : undefined}
                    className={`flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-blue-700 text-white"
                        : "bg-background-elevated text-foreground-muted hover:text-blue-800"
                    }`}
                  >
                    <span>{i + 1}</span>
                    <span className="hidden truncate sm:inline">{c.label.replace(" Context", "")}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 space-y-10">
          {contexts.map((c, i) => {
            const action = actionFor(c);
            return (
              <div
                key={c.id}
                id={`question-${c.id}`}
                data-question={i}
                className="scroll-mt-36 rounded-3xl border border-border-subtle bg-background-elevated p-5 sm:scroll-mt-40 sm:p-8"
              >
                <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-blue-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-sm text-white">
                    {i + 1}
                  </span>
                  {c.label}
                  <span className="ml-auto text-xs font-medium normal-case tracking-normal text-foreground-muted">
                    {i + 1} of {contexts.length}
                  </span>
                </p>
                <p className="mt-4 text-2xl font-semibold leading-snug text-blue-950">{c.question}</p>
                {c.honor && (
                  <div className="mt-5">
                    <VerseBlock verse={c.honor} />
                  </div>
                )}

                <div className="mt-6">
                  <StageLabel stage="reflect" label="Reflect" />
                  <div className="mt-3">
                    <NoteBox id={`q-${c.id}`} label="My notes" value={value(`q-${c.id}`)} onChange={change} />
                  </div>
                </div>

                <div className={`mt-7 rounded-2xl p-4 sm:p-6 ${stageStyles.respond.panel}`}>
                  <StageLabel stage="respond" label="Respond" title="How to respond" />
                  <p className="mt-3 text-xl leading-relaxed text-foreground">{c.respond}</p>
                  {c.references && (
                    <div className="mt-5">
                      <Scripture verses={c.references} />
                    </div>
                  )}
                </div>

                <div className={`mt-5 rounded-2xl p-4 sm:p-6 ${stageStyles.act.panel}`}>
                  <StageLabel stage="act" label="Act" title={`What to do about it: ${action.label}`} />
                  <div className="mt-4">
                    <Scripture verses={action.verses} />
                  </div>
                  <div className="mt-6">
                    <NoteBox
                      id={`a-${action.id}`}
                      label="My next step"
                      value={value(`a-${action.id}`)}
                      onChange={change}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="more-scripture" className="mt-16 scroll-mt-24">
        <h2 className={sectionTitle}>More Scripture on being present</h2>
        <p className="mt-2 text-foreground-muted">
          Passages to keep reading after the session, on showing up with the heart and not only the appearance.
        </p>
        <div className="mt-6 space-y-8">
          {morePresent.map((group) => (
            <div key={group.heading}>
              <h3 className="text-lg font-semibold text-blue-950">{group.heading}</h3>
              <div className="mt-3">
                <Scripture verses={group.verses} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="notes" className="mt-16 scroll-mt-24">
        <div className="rounded-3xl bg-blue-900 p-6 text-white sm:p-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Get notes</h2>
          <p className="mt-3 text-blue-100">
            Type your email and we will send you a PDF with the lesson and everything you wrote. It goes
            only to the address you enter. We do not receive a copy or keep your notes.
          </p>
          <form onSubmit={send} className="mt-6 space-y-4">
            <div>
              <label htmlFor="pm-email" className="text-sm font-semibold text-blue-100">
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
              className="rounded-full bg-white px-7 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Email me the PDF"}
            </button>
            <p role="status" aria-live="polite" className={`text-sm ${status === "error" ? "text-blue-200" : "text-white"}`}>
              {message}
            </p>
          </form>
          <p className="mt-4 text-sm text-blue-200">
            {loaded ? "Your notes are saved on this device as you type." : ""}{" "}
            <button type="button" onClick={clearNotes} className="underline underline-offset-4 hover:text-white">
              Clear my notes
            </button>
          </p>
        </div>
      </section>

      <section id="faq" className="mt-16 scroll-mt-24">
        <h2 className={sectionTitle}>Common questions</h2>
        <div className="mt-6 space-y-3">
          {faq.map((f) => (
            <details key={f.question} className="group/faq rounded-2xl border border-border-subtle bg-background-elevated">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl p-5 text-base font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
                {f.question}
                <svg
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0 text-foreground-muted transition-transform group-open/faq:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m5 8 5 5 5-5" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-base leading-relaxed text-foreground-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="more-faith" className="mt-14">
        <h2 id="more-faith" className="text-xl font-semibold text-blue-950">
          More from Faith Journey
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/faith"
              className="block h-full rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-700/40"
            >
              <span className="font-semibold text-blue-800">Faith Journey</span>
              <span className="mt-1 block text-sm text-foreground-muted">
                Our story, writings, and lessons on relying on God to discover, understand, and live out truth.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/faith/women-who-seek"
              className="block h-full rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-700/40"
            >
              <span className="font-semibold text-blue-800">Women Who Seek</span>
              <span className="mt-1 block text-sm text-foreground-muted">
                A Bible study community for women, hosted by Atiya Warthen.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <footer className="mt-12 space-y-3 text-xs text-foreground-muted">
        <p>{versionNotice.NASB2020}</p>
        <p>{versionNotice.NLT}</p>
      </footer>
    </article>
    </div>
  );
}
