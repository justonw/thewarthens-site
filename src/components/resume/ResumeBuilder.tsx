"use client";

import { useEffect, useRef, useState } from "react";
import type { CoverLetter, ResumeDoc, ResumeGap, TailorResult } from "@/lib/resume-tailor";
import { MAX_NOTES_CHARS, MAX_POSTING_CHARS, MAX_RESUME_CHARS } from "@/lib/resume-input-limits";
import type { PickedFile } from "@/lib/resume-upload";
import { usePersistentState } from "@/lib/use-persistent-state";
import ResumeInputBox from "@/components/ResumeInputBox";
import ResultView from "./ResultView";
import VoiceInput from "./VoiceInput";
import ScratchForm, { emptyScratch, scratchReady, scratchToText, type Scratch } from "./ScratchForm";

// The whole resume builder: the form, the progress screen, and the results. Anything worth keeping for
// next time (resume, notes, email) is remembered in this browser only.

type Phase = "form" | "loading" | "result";

const SOURCES = ["YouTube", "Instagram or TikTok", "Google search", "A friend or family member", "Career day or an event", "Other"];

const NOTE_STARTERS = [
  "Skills or tools that aren't on my resume: ",
  "Volunteer, side, or past work: ",
  "Certifications or classes I'm working on: ",
  "Strengths I want highlighted: ",
  "The kind of role I'm looking for: ",
];

// Drops starter lines that were tapped but never filled in, so they are not sent as "notes".
function tidyNotes(value: string) {
  const starters = new Set(NOTE_STARTERS.map((x) => x.trim()));
  return value
    .split("\n")
    .filter((line) => !starters.has(line.trim()))
    .join("\n")
    .trim();
}

const SAVED_KEY = "warthens-resume-builder-v1";
const MAX_SAVED_FILE_B64 = 1_500_000;

type SavedFile = { name: string; kind: "pdf" | "image"; mediaType: string; data: string; size: number };
type Saved = {
  resume: string;
  notes: string;
  hiringManager: string;
  email: string;
  source: string;
  wantLetter: boolean;
  files: SavedFile[];
};

const noSaved: Saved | null = null;

const errorText: Record<string, string> = {
  email: "Enter a valid email address.",
  source: "Choose how you found us.",
  files: "One of your files couldn't be used. Remove it and add it again, or paste the text instead.",
  "too-big": "Your files add up to more than we can send at once (about 4 MB). Remove one, or paste the text instead.",
  "resume-short": "Add your resume first: paste the text, or upload a file or screenshot.",
  "posting-short": "Add the job posting: paste it, paste its link, or upload a file or screenshot.",
  "too-long": "That's more text than we can read at once. Trim the resume or the posting and try again.",
  limit: "You've used your 2 free builds. Paid builds are coming soon. Email info@thewarthens.com if you need one sooner.",
  cap: "We've reached our free limit for this month. It resets on the 1st. Email info@thewarthens.com to join the wait.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  unavailable: "The resume builder isn't available right now. Try again later.",
  upstream: "Something went wrong building your resume, and it didn't use up a free build. Try again.",
  forbidden: "Something went wrong. Reload the page and try again.",
};

const progressSteps = (letter: boolean) => [
  "Reading your resume…",
  "Reading the job posting…",
  "Matching your experience to what they want…",
  "Writing your resume…",
  ...(letter ? ["Writing your cover letter…"] : []),
  "Checking it against our checklist…",
];

export default function ResumeBuilder() {
  const [phase, setPhase] = useState<Phase>("form");
  const [mode, setMode] = useState<"have" | "scratch">("have");
  const [scratch, setScratch] = useState<Scratch>(emptyScratch);
  const [resume, setResume] = useState("");
  const [resumeFiles, setResumeFiles] = useState<PickedFile[]>([]);
  const [posting, setPosting] = useState("");
  const [postingFiles, setPostingFiles] = useState<PickedFile[]>([]);
  const [notes, setNotes] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [wantLetter, setWantLetter] = useState(false);
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [tick, setTick] = useState(0);

  const [result, setResult] = useState<TailorResult | null>(null);
  const [doc, setDoc] = useState<ResumeDoc | null>(null);
  const [letter, setLetter] = useState<CoverLetter | null>(null);
  const [letterFailed, setLetterFailed] = useState(false);
  const [gaps, setGaps] = useState<ResumeGap[]>([]);
  const [changes, setChanges] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [matchDesign, setMatchDesign] = useState(true);

  const [saved, setSaved, hydrated] = usePersistentState<Saved | null>(SAVED_KEY, noSaved);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Rotates the progress messages while the AI works.
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = setInterval(() => setTick((t) => t + 1), 4500);
    return () => clearInterval(timer);
  }, [phase]);

  const formIsEmpty = !scratch.name.trim() && !scratch.story.trim() && !resume.trim() && !posting.trim() && !notes.trim() && resumeFiles.length === 0 && postingFiles.length === 0;
  const showSaved = hydrated && saved !== null && formIsEmpty && phase === "form";

  function useSaved() {
    if (!saved) return;
    setMode("have");
    setResume(saved.resume);
    setNotes(saved.notes);
    setHiringManager(saved.hiringManager);
    setEmail(saved.email);
    setSource(saved.source);
    setWantLetter(saved.wantLetter);
    setResumeFiles(
      saved.files.map((f, i) => ({
        id: `saved-${i}-${Date.now()}`,
        name: f.name,
        kind: f.kind,
        attachment: { kind: f.kind, mediaType: f.mediaType, data: f.data },
        size: f.size,
        previewUrl: f.kind === "image" ? `data:${f.mediaType};base64,${f.data}` : undefined,
      }))
    );
  }

  function insertStarter(starter: string) {
    setNotes((n) => `${n.trim() ? `${n.trimEnd()}\n` : ""}${starter}`);
    notesRef.current?.focus();
  }

  async function build(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Check here first so people get a clear message before anything is sent.
    const fromScratch = mode === "scratch";
    const resumeText = fromScratch ? scratchToText(scratch, email) : resume;
    if (fromScratch) {
      if (scratch.name.trim().length < 2) return setError("Add your name so we can put it at the top.");
      if (!scratchReady(scratch)) return setError("Tell us a little more about your work, school, and skills. A few sentences is enough.");
    } else if (resume.trim().length < 150 && resumeFiles.length === 0) {
      return setError(errorText["resume-short"]);
    }
    if (posting.trim().length < 80 && postingFiles.length === 0) return setError(errorText["posting-short"]);
    if (resumeText.length > MAX_RESUME_CHARS) return setError(`Your resume text is very long (${resumeText.length.toLocaleString()} characters). Keep it under ${MAX_RESUME_CHARS.toLocaleString()}, or upload it as a file instead.`);
    if (posting.length > MAX_POSTING_CHARS) return setError(`The posting text is very long (${posting.length.toLocaleString()} characters). Keep it under ${MAX_POSTING_CHARS.toLocaleString()}, or paste just the job description.`);
    if (notes.length > MAX_NOTES_CHARS) return setError(`Your notes are a bit long (${notes.length.toLocaleString()} characters). Keep them under ${MAX_NOTES_CHARS.toLocaleString()}.`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError(errorText.email);
    if (!source) return setError(errorText.source);
    if ([...resumeFiles, ...postingFiles].reduce((n, f) => n + f.size, 0) > 5_000_000) return setError(errorText["too-big"]);

    setPhase("loading");
    setRetrying(false);
    setTick(0);
    const payload = JSON.stringify({
      email: email.trim(),
      source,
      resumeText,
      postingText: posting,
      fromScratch,
      resumeFiles: fromScratch ? [] : resumeFiles.flatMap((f) => (f.attachment ? [f.attachment] : [])),
      postingFiles: postingFiles.flatMap((f) => (f.attachment ? [f.attachment] : [])),
      notes: tidyNotes(notes),
      coverLetter: wantLetter,
      hiringManager: hiringManager.trim(),
      matchDesign: !fromScratch && matchDesign && resumeFiles.some((f) => Boolean(f.attachment)),
    });
    // A one-off hiccup on our side should not reach the person: try once more before showing an error.
    // A failed try never uses up a free build, so trying again is safe.
    let data: { ok?: boolean; error?: string; message?: string; result?: TailorResult; letterFailed?: boolean; remaining?: number | null } = {};
    let status = 0;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch("/api/resume-tailor", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload });
        status = res.status;
        data = await res.json().catch(() => ({}));
      } catch {
        status = 0;
        data = { error: "upstream" };
      }
      const retryable = (status === 0 || status >= 500) && data.error !== "unavailable";
      if (data.ok || !retryable || attempt === 2) break;
      setRetrying(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
    if (!data.ok || !data.result) {
      setError(data.error === "problem" ? data.message ?? errorText.upstream : errorText[data.error as string] ?? errorText.upstream);
      setPhase("form");
      return;
    }

    // Remember what is worth keeping for next time, in this browser only.
    const files: SavedFile[] = [];
    let total = 0;
    for (const f of resumeFiles) {
      if (!f.attachment) continue;
      total += f.attachment.data.length;
      if (total > MAX_SAVED_FILE_B64) break;
      files.push({ name: f.name, kind: f.attachment.kind, mediaType: f.attachment.mediaType, data: f.attachment.data, size: f.size });
    }
    setSaved({ resume: resumeText, notes: tidyNotes(notes), hiringManager, email: email.trim(), source, wantLetter, files });

    setResult(data.result);
    setDoc(data.result.resume);
    setLetter(data.result.coverLetter ?? null);
    setLetterFailed(Boolean(data.letterFailed));
    setGaps(data.result.gaps);
    setChanges(data.result.changes);
    setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    setOriginal(fromScratch || !resumeText.trim() ? null : resumeText);
    setPhase("result");
    window.scrollTo({ top: Math.max(0, (document.getElementById("resume-tool")?.offsetTop ?? 0) - 80), behavior: "smooth" });
  }

  function startOver() {
    // Keeps the resume, notes, and email, so the next job takes seconds.
    setPhase("form");
    setResult(null);
    setDoc(null);
    setLetter(null);
    setPosting("");
    setPostingFiles([]);
    setError("");
    window.scrollTo({ top: Math.max(0, (document.getElementById("resume-tool")?.offsetTop ?? 0) - 80), behavior: "smooth" });
  }

  if (phase === "loading") {
    const steps = progressSteps(wantLetter);
    const index = Math.min(tick, steps.length - 1);
    return (
      <div id="resume-tool" className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border-subtle bg-background-elevated shadow-lg">
        <div className="h-1.5 w-full overflow-hidden bg-background-elevated-2">
          <div className="rb-bar h-full w-full bg-gradient-to-r from-blue-600 to-violet-600" />
        </div>
        <div className="p-8 text-center sm:p-10">
          <div className="relative mx-auto h-14 w-14">
            <span className="rb-ping absolute inset-0 rounded-full bg-violet-500/30" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <svg viewBox="0 0 24 24" className="h-7 w-7 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z" />
              </svg>
            </span>
          </div>
          <p className="mt-5 text-xl font-semibold">{wantLetter ? "Building your resume and cover letter" : "Building your resume"}</p>
          <p className="mt-1 text-sm text-foreground-muted" role="status">
            {retrying ? "That took a little longer than usual, so we're trying again." : "Writing it for this exact job."}
          </p>
          <ul className="mx-auto mt-6 max-w-xs space-y-2.5 text-left text-sm">
            {steps.map((label, i) => (
              <li key={label} className={`flex items-center gap-3 transition-opacity ${i > index ? "opacity-40" : ""}`}>
                {i < index ? (
                  <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600">
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5l3 3 6-7" />
                    </svg>
                  </span>
                ) : i === index ? (
                  <span aria-hidden className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-border-subtle border-t-blue-600" />
                ) : (
                  <span aria-hidden className="h-5 w-5 shrink-0 rounded-full border-2 border-border-subtle" />
                )}
                <span className={i === index ? "font-semibold" : ""}>{label.replace("…", "")}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-foreground-muted">This usually takes 10 to 30 seconds. Please keep this tab open.</p>
        </div>
      </div>
    );
  }

  if (phase === "result" && doc && result) {
    return (
      <ResultView
        result={result}
        doc={doc}
        onDoc={setDoc}
        letter={letter}
        letterFailed={letterFailed}
        onLetter={setLetter}
        gaps={gaps}
        onGaps={setGaps}
        changes={changes}
        onChanges={setChanges}
        email={email.trim()}
        remaining={remaining}
        original={original}
        onStartOver={startOver}
      />
    );
  }

  const input = "w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50";
  const resumeReady = mode === "scratch" ? scratchReady(scratch) : resume.trim().length >= 150 || resumeFiles.length > 0;
  const postingReady = posting.trim().length >= 80 || postingFiles.length > 0;
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && Boolean(source);
  const readyCount = Number(resumeReady) + Number(postingReady) + Number(emailReady);
  const missing = [!resumeReady && "your resume", !postingReady && "the job", !emailReady && "your email and how you found us"].filter(Boolean) as string[];

  return (
    <form id="resume-tool" onSubmit={build} className="mx-auto max-w-3xl space-y-4" noValidate>
      <div className="sticky top-14 z-30 -mx-1 rounded-2xl border border-border-subtle bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:top-16">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
          <span>{readyCount === 3 ? "You're ready. Build it." : `${readyCount} of 3 steps done`}</span>
          <span className="hidden gap-3 font-medium text-foreground-muted sm:flex">
            {[
              ["Resume", resumeReady],
              ["Job", postingReady],
              ["Email", emailReady],
            ].map(([label, done]) => (
              <span key={label as string} className={done ? "text-green-700" : ""}>
                {done ? "✓ " : ""}
                {label as string}
              </span>
            ))}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background-elevated-2">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500" style={{ width: `${(readyCount / 3) * 100}%` }} />
        </div>
      </div>

      {showSaved && mode === "have" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 px-5 py-4">
          <p className="text-sm">
            <span className="font-semibold">Welcome back.</span> We kept your resume and notes on this device, so you can skip step 1.
          </p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={useSaved} className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500">
              Use my saved info
            </button>
            <button type="button" onClick={() => setSaved(null)} className="text-xs text-foreground-muted underline underline-offset-2">
              Forget it
            </button>
          </div>
        </div>
      )}

      {mode === "scratch" ? (
        <>
          <p className="text-center text-xs text-foreground-muted">
            <button type="button" onClick={() => setMode("have")} className="font-semibold text-blue-600 underline underline-offset-2">
              ← Back: I have a resume to tailor
            </button>
          </p>
          <ScratchForm value={scratch} onChange={setScratch} done={resumeReady} />
        </>
      ) : (
        <>
          <ResumeInputBox
        id="rt-resume"
        step={1}
        done={resumeReady}
        label="Your current resume"
        help="Upload a file, drag one in, paste a screenshot, or paste the text."
        placeholder="Paste your resume text here, or drop a PDF, Word file, or screenshot onto this box."
        text={resume}
        onText={setResume}
        files={resumeFiles}
        onFiles={setResumeFiles}
        lookHint
      />
          {resumeFiles.some((f) => Boolean(f.attachment)) && (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 shadow-sm">
              <input type="checkbox" checked={matchDesign} onChange={(e) => setMatchDesign(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
              <span>
                <span className="block text-sm font-semibold">Copy the look of my resume</span>
                <span className="block text-xs text-foreground-muted">We match its font style, colors, header, and section order. We keep one clean column, because hiring software reads that best.</span>
              </span>
            </label>
          )}
          <p className="-mt-1 text-center text-xs text-foreground-muted">
            No resume yet?{" "}
            <button type="button" onClick={() => setMode("scratch")} className="font-semibold text-blue-600 underline underline-offset-2">
              Start from scratch
            </button>
          </p>
        </>
      )}

      <ResumeInputBox
        id="rt-posting"
        step={2}
        done={postingReady}
        label="The job you want"
        help="Paste a link to the posting, or paste the text, or upload a file or screenshot."
        placeholder="Paste the link to the job posting here, or paste the posting text, or drop a screenshot onto this box."
        text={posting}
        onText={setPosting}
        files={postingFiles}
        onFiles={setPostingFiles}
        allowLink
      />

      <div className="rounded-2xl border border-border-subtle bg-background-elevated p-4 shadow-sm transition-shadow focus-within:border-blue-500/40 focus-within:shadow-md sm:p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${tidyNotes(notes) ? "bg-green-600 text-white" : "bg-blue-600/10 text-blue-700"}`}>
            {tidyNotes(notes) ? "✓" : 3}
          </span>
          <label className="text-base font-semibold" htmlFor="rt-notes">
            Tell us more about you <span className="text-sm font-normal text-foreground-muted">(optional)</span>
          </label>
        </div>
        <p className="mt-1 text-xs text-foreground-muted sm:pl-10">
          Anything that isn&apos;t on your resume. We use it to write your resume and cover letter, in your own words.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 sm:pl-10">
          {NOTE_STARTERS.map((starter) => (
            <button key={starter} type="button" onClick={() => insertStarter(starter)} className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs transition-colors hover:border-blue-500/40">
              + {starter.replace(/: $/, "")}
            </button>
          ))}
        </div>
        <textarea
          ref={notesRef}
          id="rt-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="For example: I volunteer as a youth mentor. I use Canva and Notion every day. I'm finishing a Google Career Certificate. I'm great at calming upset customers."
          className={`${input} mt-3 resize-y`}
        />
        <div className="mt-2 sm:pl-10">
          <VoiceInput onText={(t) => setNotes((prev) => `${prev}${prev && !/\s$/.test(prev) ? " " : ""}${t}`)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-background-elevated p-4 shadow-sm transition-shadow focus-within:border-blue-500/40 focus-within:shadow-md sm:p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && source ? "bg-green-600 text-white" : "bg-blue-600/10 text-blue-700"}`}>
            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && source ? "✓" : 4}
          </span>
          <p className="text-base font-semibold">Last step: your email</p>
        </div>
        <p className="mt-1 text-xs text-foreground-muted sm:pl-10">We use it to count your 2 free builds.</p>
        <div className="mt-3 grid gap-3 sm:ml-10 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold" htmlFor="rt-email">
              Your email
            </label>
            <input id="rt-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" className={`${input} mt-1`} />
          </div>
          <div>
            <label className="block text-xs font-semibold" htmlFor="rt-source">
              How did you find us?
            </label>
            <select id="rt-source" value={source} onChange={(e) => setSource(e.target.value)} className={`${input} mt-1`}>
              <option value="" disabled>
                Choose one
              </option>
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-background-elevated p-4 shadow-sm transition-shadow focus-within:border-blue-500/40 focus-within:shadow-md sm:p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={wantLetter} onChange={(e) => setWantLetter(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
          <span>
            <span className="block text-sm font-semibold">Also write a cover letter</span>
            <span className="block text-xs text-foreground-muted">Matched to this job. Worth including when the posting asks for one or you are writing to a hiring manager. Included with your free build.</span>
          </span>
        </label>
        {wantLetter && (
          <div className="mt-3 sm:ml-7">
            <label className="block text-xs font-semibold" htmlFor="rt-manager">
              Who should it be addressed to? <span className="font-normal text-foreground-muted">(if you know)</span>
            </label>
            <input id="rt-manager" value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} placeholder="For example: Ms. Alvarez, or leave blank" className={`${input} mt-1`} />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="pt-1">
        <button type="submit" className="rb-cta inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-white">
          {wantLetter ? "Build my resume and cover letter" : "Build my resume"}
          <span aria-hidden>→</span>
        </button>
        {missing.length > 0 && <p className="mt-2 text-center text-xs text-foreground-muted">Still needed: {missing.join(", ")}.</p>}
        <p className="mt-3 text-center text-xs text-foreground-muted">
          Your first 2 builds are free. We send your resume and the posting, including any files or screenshots, to an AI service (Anthropic&apos;s Claude) to write your documents. We use your email to count your free builds, and we may send the occasional resource. Reply to any email from us to opt out. We only reword what&apos;s in your resume and notes. We never add experience you don&apos;t have.
        </p>
      </div>
    </form>
  );
}

