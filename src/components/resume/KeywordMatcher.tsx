"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import InputArea from "@/components/resume/InputArea";
import { findPostingLink } from "@/lib/posting-link";
import { markResume, matchKeywords, type TermKind, type TermResult } from "@/lib/keyword-match";
import { saveHandoff } from "@/lib/resume-handoff";
import { processFile } from "@/lib/resume-upload";
import { pdfToText } from "@/lib/pdf-text";
import { track } from "@/lib/track";
import { imageToText } from "@/lib/ocr";

// The free keyword check. Paste a resume and a job posting (or a link to the posting, or a Word or text file for the
// resume), press the button, and see which of the posting's key phrases are in the resume. Nothing here calls an AI:
// the matching is plain code in lib/keyword-match.ts. Reading a posting from a link uses the same free reader as the
// Resume Builder.

const SAMPLE_RESUME = `Taylor Morgan
Customer support specialist with 4 years answering customer questions for a software company.
Managed a queue of about 60 tickets a day in Zendesk. Wrote help articles that cut repeat questions.
Used HubSpot to log customer notes and passed feedback to the sales and success teams. Reported weekly ticket numbers to a manager. Trained 5 new teammates.
Associate degree in Business, 2021.`;

const SAMPLE_POSTING = `Sales Development Representative
Requirements
- 2+ years of customer-facing experience
- Associate degree or equivalent experience
- Experience with cold calling and outbound prospecting
- Familiarity with Salesforce or HubSpot CRM
- Strong communication skills and comfort working with cross-functional teams
Nice to have
- Experience with Gong or Outreach
What you'll do
- Book meetings for account executives
- Manage the sales pipeline and report on KPIs
- Hand off qualified leads to customer success`;

const KINDS: { id: Exclude<TermKind, "name">; label: string }[] = [
  { id: "tool", label: "Tools" },
  { id: "skill", label: "Skills" },
  { id: "soft", label: "People skills" },
  { id: "cert", label: "Certifications" },
  { id: "other", label: "Other phrases" },
];

const STATUS = {
  missing: {
    heading: "Not in your resume",
    help: "If you truly have this experience, find where it fits and say it in the posting's words. If you do not, leave it out.",
    chip: "border-amber-500/40 bg-amber-500/10 text-foreground",
  },
  words: {
    heading: "The words are there, but not as this phrase",
    help: "Every word shows up in your resume, just not together. If it describes real work you did, you may be able to use the exact phrase.",
    chip: "border-blue-500/30 bg-blue-500/5 text-foreground",
  },
  found: {
    heading: "Already in your resume",
    help: "Nothing to change here.",
    chip: "border-green-600/30 bg-green-600/5 text-foreground",
  },
} as const;

const linkErrors: Record<string, string> = {
  "blocked-site": "That site doesn't let us read its pages (LinkedIn and Indeed often don't). Copy the posting text and paste it here instead.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes, or paste the posting text instead.",
  thin: "That page didn't have a job posting we could read. Paste the posting text instead.",
};

type Target = "resume" | "posting";
type Note = { kind: "info" | "error"; message: string };
const IMAGE = /\.(png|jpe?g|webp|gif|heic|heif|bmp)$/i;

export default function KeywordMatcher() {
  const router = useRouter();
  const [resume, setResume] = useState("");
  const [posting, setPosting] = useState("");
  const [checked, setChecked] = useState<{ resume: string; posting: string } | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [busy, setBusy] = useState(false);
  const [fileNote, setFileNote] = useState<Note | null>(null);
  const [drag, setDrag] = useState<Target | null>(null);
  const [reading, setReading] = useState<{ resume: string | null; posting: string | null }>({ resume: null, posting: null });
  const picker = useRef<HTMLInputElement>(null);
  const postingPicker = useRef<HTMLInputElement>(null);
  const postingRef = useRef(posting);
  const request = useRef(0);
  useEffect(() => {
    postingRef.current = posting;
  });

  const result = useMemo(() => (checked ? matchKeywords(checked.resume, checked.posting) : null), [checked]);
  const terms = useMemo(() => (result ? result.terms.filter((t) => !hidden.includes(t.phrase)) : []), [result, hidden]);
  const names = useMemo(() => (result ? result.names.filter((t) => !hidden.includes(t.phrase)) : []), [result, hidden]);
  const pieces = useMemo(() => (checked && result ? markResume(checked.resume, terms) : []), [checked, result, terms]);

  const canCheck = resume.trim().length >= 40 && posting.trim().length >= 80;
  const found = terms.filter((t) => t.status === "found").length;
  const pct = terms.length ? Math.round((found / terms.length) * 100) : 0;
  const required = terms.filter((t) => t.tier === "required");
  const requiredFound = required.filter((t) => t.status === "found").length;

  useEffect(() => {
    track("scanner-visit");
  }, []);

  const run = () => {
    if (!canCheck) return;
    track("scanner-checked");
    setHidden([]);
    setChecked({ resume, posting });
    setTimeout(() => document.getElementById("kw-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const copyMissing = async () => {
    const list = terms.filter((t) => t.status !== "found").map((t) => t.phrase).join(", ");
    try {
      await navigator.clipboard.writeText(list);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying is a convenience; the list is on screen either way.
    }
  };

  async function readFile(list: FileList | File[] | null, target: Target) {
    const file = list?.[0];
    if (!file) return;
    const say = (n: Note | null) => (target === "resume" ? setFileNote(n) : setNote(n));
    const work = (m: string | null) => setReading((r) => ({ ...r, [target]: m }));
    const name = file.name || "your picture";
    const subject = target === "resume" ? "resume" : "posting";
    say(null);
    try {
      let text = "";
      if (file.type.startsWith("image/") || IMAGE.test(file.name)) {
        work("Reading the words in your picture…");
        try {
          text = await imageToText(file, (pct) => work(`Reading the words in your picture… ${pct}%`));
        } catch (e) {
          throw new Error(e instanceof Error ? e.message : "We couldn't read that picture. Paste the text instead.");
        }
        if (text.length < 40) throw new Error(`We couldn't find enough words in that picture. Try a sharper or larger one, or paste the text instead.`);
      } else if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
        work(`Reading ${name}…`);
        try {
          text = await pdfToText(file);
        } catch {
          throw new Error("We couldn't open that PDF. Copy the text out of it and paste it into the box instead.");
        }
        if (text.length < 40) {
          // A PDF that is a picture of a page has no words in it to read.
          throw new Error("That PDF is a picture of a page, so there are no words for us to read. Take a screenshot of it and drop that in, or paste the text.");
        }
      } else {
        work(`Reading ${name}…`);
        const picked = await processFile(file);
        if (picked.kind !== "text" || !picked.text) throw new Error("We can read PDF, Word, text, and picture files here.");
        text = picked.text;
      }
      if (target === "resume") setResume(text);
      else setPosting(text);
      say({ kind: "info", message: `Added the text from ${name}. Read it over and fix anything that looks off, especially after a picture.` });
    } catch (e) {
      say({ kind: "error", message: e instanceof Error ? e.message : `We couldn't read that ${subject} file. Paste the text instead.` });
    } finally {
      work(null);
    }
  }

  function dropHandlers(target: Target) {
    return {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        setDrag(target);
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrag(null);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setDrag(null);
        void readFile(e.dataTransfer.files, target);
      },
    };
  }

  function pastedFiles(e: React.ClipboardEvent<HTMLTextAreaElement>, target: Target) {
    const files = Array.from(e.clipboardData.files);
    if (files.length === 0) return false;
    e.preventDefault();
    void readFile(files, target);
    return true;
  }

  async function readLink(url: string) {
    const mine = ++request.current;
    setBusy(true);
    setNote({ kind: "info", message: "Reading the posting from your link…" });
    const controller = new AbortController();
    const giveUp = window.setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch("/api/posting-fetch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }), signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      if (request.current !== mine) return;
      if (!res.ok || !data.ok) setNote({ kind: "error", message: linkErrors[data.error as string] ?? "We couldn't open that link. Paste the posting text instead." });
      else if (postingRef.current.trim() === url) {
        setPosting(data.text as string);
        setNote({ kind: "info", message: `Got it: ${data.title || "the posting"}. Read it over and fix anything that looks off.` });
      }
    } catch {
      if (request.current === mine) setNote({ kind: "error", message: "That link took too long to open. Paste the posting text instead." });
    } finally {
      window.clearTimeout(giveUp);
      if (request.current === mine) setBusy(false);
    }
  }

  function takeLink(url: string) {
    setPosting(url);
    void readLink(url);
  }

  function onPostingChange(value: string) {
    const url = findPostingLink(value);
    // A link that appears all at once and is the only thing in the box (a keyboard's clipboard suggestion) counts as a paste.
    if (url && !findPostingLink(posting) && value.length - posting.length >= 8) return takeLink(url);
    setPosting(value);
  }

  function buildFromThese() {
    if (!checked) return;
    saveHandoff(checked.resume, checked.posting);
    router.push("/resume#resume-tool");
  }

  const group = (status: TermResult["status"]) => terms.filter((t) => t.status === status);
  const postingLink = findPostingLink(posting.trim());

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-all focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6">
          <div className="flex items-center gap-3">
            <span aria-hidden className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition-colors ${resume.trim().length >= 40 ? "bg-green-600" : "bg-gradient-to-br from-blue-600 to-violet-600"}`}>
              {resume.trim().length >= 40 ? "✓" : "1"}
            </span>
            <label htmlFor="kw-resume" className="text-lg font-bold tracking-tight">
              Your resume
            </label>
          </div>
          <p className="mb-3 mt-1.5 text-sm text-foreground-muted sm:pl-12">Paste the text, or upload a PDF, Word file, or photo.</p>
          <div {...dropHandlers("resume")}>
            <InputArea
              id="kw-resume"
              value={resume}
              onChange={setResume}
              onPaste={(e) => void pastedFiles(e, "resume")}
              title="Drop your resume here"
              hint="Or click to paste the text. A phone photo of it works too."
              formats={["PDF", "Word", "Photo", "Text"]}
              noun="resume"
              dragging={drag === "resume"}
              working={reading.resume}
              onChoose={() => picker.current?.click()}
              placeholder="Paste your resume here"
            />
          </div>
          {fileNote && (
            <p role={fileNote.kind === "error" ? "alert" : "status"} className={`mt-3 rounded-xl px-4 py-3 text-sm ${fileNote.kind === "error" ? "border border-red-500/30 bg-red-500/5 text-red-700" : "bg-blue-500/5 text-foreground-muted"}`}>
              {fileNote.message}
            </p>
          )}
          <input
            ref={picker}
            type="file"
            accept=".docx,.txt,.md,.pdf,image/*"
            className="sr-only"
            tabIndex={-1}
            aria-label="Choose a resume file"
            onChange={(e) => {
              const files = e.target.files;
              void readFile(files, "resume");
              e.target.value = "";
            }}
          />
        </div>
        <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-all focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6">
          <div className="flex items-center gap-3">
            <span aria-hidden className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition-colors ${posting.trim().length >= 80 ? "bg-green-600" : "bg-gradient-to-br from-blue-600 to-violet-600"}`}>
              {posting.trim().length >= 80 ? "✓" : "2"}
            </span>
            <label htmlFor="kw-posting" className="text-lg font-bold tracking-tight">
              The job posting
            </label>
          </div>
          <p className="mb-3 mt-1.5 text-sm text-foreground-muted sm:pl-12">Paste the posting or its link, or drop a screenshot.</p>
          <div {...dropHandlers("posting")}>
            <InputArea
              id="kw-posting"
              value={posting}
              onChange={onPostingChange}
              onPaste={(e) => {
                if (pastedFiles(e, "posting")) return;
                const url = findPostingLink(e.clipboardData.getData("text"));
                if (url) {
                  e.preventDefault();
                  takeLink(url);
                }
              }}
              icon="link"
              title="Paste the job link or text"
              hint="Or drop a screenshot or file of the posting here."
              formats={["Link", "Text", "Screenshot", "PDF"]}
              noun="job posting"
              dragging={drag === "posting"}
              working={reading.posting}
              onChoose={() => postingPicker.current?.click()}
              placeholder="Paste the job posting here"
            />
          </div>
          {postingLink && !busy ? (
            <button type="button" onClick={() => void readLink(postingLink)} className="mt-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
              Get the posting from this link
            </button>
          ) : null}
          {note && (
            <p role={note.kind === "error" ? "alert" : "status"} className={`mt-3 rounded-xl px-4 py-3 text-sm ${note.kind === "error" ? "border border-red-500/30 bg-red-500/5 text-red-700" : "bg-blue-500/5 text-foreground-muted"}`}>
              {note.message}
            </p>
          )}
          <input
            ref={postingPicker}
            type="file"
            accept=".docx,.txt,.md,.pdf,image/*"
            className="sr-only"
            tabIndex={-1}
            aria-label="Choose a job posting file"
            onChange={(e) => {
              const files = e.target.files;
              void readFile(files, "posting");
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={!canCheck || busy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          Check my keywords
        </button>
        <button
          type="button"
          onClick={() => {
            setResume(SAMPLE_RESUME);
            setPosting(SAMPLE_POSTING);
            setChecked(null);
            setNote(null);
          }}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline-offset-4 hover:underline"
        >
          Try it with an example
        </button>
        {!canCheck && (resume || posting) ? <span className="text-sm text-foreground-muted">Add a bit more text to both boxes to check.</span> : null}
      </div>

      {result && (
        <div id="kw-results" className="mt-10 scroll-mt-24">
          {terms.length === 0 ? (
            <p className="rounded-2xl border border-border-subtle bg-background-elevated p-5 text-foreground-muted">
              We could not find clear key phrases in that posting. Check that you pasted the full text of the job description, not just its title.
            </p>
          ) : (
            <>
              <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Your result</p>
                <p className="mt-1 text-2xl font-semibold" aria-live="polite">
                  {found} of {terms.length} key phrases are in your resume
                </p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-border-subtle" role="img" aria-label={`${pct} percent of key phrases found`}>
                  <div className="h-full rounded-full bg-green-600" style={{ width: `${pct}%` }} />
                </div>
                {required.length > 0 ? (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">{requiredFound} of {required.length}</span> of the ones that look <span className="font-semibold">required</span> (under a requirements heading, said three or more times, or in the title) are in your resume.
                  </p>
                ) : null}
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-foreground-muted">
                  {KINDS.map((k) => {
                    const of = terms.filter((t) => t.kind === k.id);
                    return of.length ? (
                      <li key={k.id}>
                        {k.label}: <span className="font-semibold text-foreground">{of.filter((t) => t.status === "found").length}/{of.length}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
                <p className="mt-3 text-sm text-foreground-muted">
                  This is a simple word match, not a score from any hiring software. No one outside those companies knows exactly how theirs work. Use it as a to-do list, and only add what is true.
                </p>
              </div>

              {result.title && (
                <div className="mt-6 rounded-2xl border border-border-subtle bg-background-elevated p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Job title</p>
                  <p className="mt-1 font-semibold">
                    <span aria-hidden>{result.title.status === "found" ? "✓ " : result.title.status === "words" ? "~ " : "✗ "}</span>
                    {result.title.phrase}
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">
                    {result.title.status === "found"
                      ? "Your resume uses this exact title. Good."
                      : result.title.status === "words"
                        ? "Your resume has most of these words, but not as this title. If it is the job you are aiming for, put it as a headline under your name (as the target role, not a job you held)."
                        : "Your resume does not use this title. If it is the job you are aiming for, put it as a headline under your name (as the target role, not a job you held). Many recruiters search by title."}
                  </p>
                </div>
              )}

              {result.requirements.length > 0 && (
                <div className="mt-6 rounded-2xl border border-border-subtle bg-background-elevated p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Experience and education the posting mentions</p>
                  <ul className="mt-3 space-y-3">
                    {result.requirements.map((q) => (
                      <li key={q.label} className="text-sm">
                        <p className="font-semibold">
                          <span aria-hidden>{q.status === "found" ? "✓ " : q.status === "missing" ? "✗ " : "? "}</span>
                          {q.label}
                        </p>
                        <p className="mt-0.5 text-foreground-muted">{q.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(["missing", "words", "found"] as const).map((status) => {
                const list = group(status);
                if (list.length === 0) return null;
                return (
                  <section key={status} className="mt-8">
                    <h2 className="text-lg font-semibold">
                      {STATUS[status].heading} <span className="text-foreground-muted">({list.length})</span>
                    </h2>
                    <p className="mt-1 text-sm text-foreground-muted">{STATUS[status].help}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {list.map((t) => (
                        <li key={t.phrase} className={`flex items-center gap-2 rounded-full border py-1.5 pl-3.5 pr-2 text-sm ${STATUS[status].chip}`}>
                          <span className="font-medium">{t.phrase}</span>
                          {t.tier === "required" ? <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-background">Required</span> : null}
                          {t.tier === "preferred" ? <span className="rounded-full border border-border-subtle px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Nice to have</span> : null}
                          {t.count > 1 ? <span className="text-xs text-foreground-muted">used {t.count}x</span> : null}
                          <button
                            type="button"
                            onClick={() => setHidden((h) => [...h, t.phrase])}
                            aria-label={`Hide ${t.phrase}`}
                            title="Not relevant? Hide it"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-black/10 hover:text-foreground"
                          >
                            <span aria-hidden>×</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}

              {names.length > 0 && (
                <details className="mt-8 rounded-2xl border border-border-subtle bg-background-elevated">
                  <summary className="cursor-pointer p-5 font-semibold">
                    Names and words we don&apos;t recognize ({names.length})
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-sm text-foreground-muted">These are probably company names, places, or product names. If one is a tool or skill you have, add it to your resume. We keep them out of your score.</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {names.map((t) => (
                        <li key={t.phrase} className="rounded-full border border-border-subtle bg-background px-3.5 py-1.5 text-sm">
                          {t.phrase}
                          {t.count > 1 ? <span className="ml-2 text-xs text-foreground-muted">used {t.count}x</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}

              <p className="mt-6 text-sm text-foreground-muted">Company names, cities and other words that do not describe the work can still show up in the lists above. Press the × on any phrase to hide it.</p>

              <details className="mt-6 rounded-2xl border border-border-subtle bg-background-elevated">
                <summary className="cursor-pointer p-5 font-semibold">See your resume with the matches highlighted</summary>
                <div className="px-5 pb-5">
                  <p className="whitespace-pre-wrap break-words rounded-xl bg-background p-4 text-sm leading-relaxed">
                    {pieces.map((p, i) =>
                      p.hit ? (
                        <mark key={i} className="rounded bg-green-600/20 px-0.5 text-foreground">
                          {p.text}
                        </mark>
                      ) : (
                        <span key={i}>{p.text}</span>
                      )
                    )}
                  </p>
                </div>
              </details>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {group("missing").length + group("words").length > 0 ? (
                  <button
                    type="button"
                    onClick={copyMissing}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/50 hover:text-blue-700"
                  >
                    {copied ? "Copied" : "Copy the list of missing phrases"}
                  </button>
                ) : null}
              </div>

              <div className="mt-10 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8">
                <h2 className="text-xl font-semibold">Want these worked in for you?</h2>
                <p className="mt-2 text-foreground-muted">
                  The Resume Builder rewrites your resume for this posting and uses the phrases that truly match your experience. It never invents anything: what your experience does not cover is listed for you instead. It also writes a matching cover letter. Your first 2 builds are free.
                </p>
                <button
                  type="button"
                  onClick={buildFromThese}
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Build my tailored resume from these →
                </button>
                <p className="mt-2 text-xs text-foreground-muted">We will carry your resume and the posting over, so you do not paste them again.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
