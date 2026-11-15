"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ResumeDoc, ResumeJob, TailorResult } from "@/lib/resume-tailor";
import { runAtsCheck } from "@/lib/resume-ats";
import { buildDocx, buildPdf, resumeFileName, resumeToPlainText } from "@/lib/resume-files";
import type { PickedFile } from "@/lib/resume-upload";
import ResumeInputBox from "@/components/ResumeInputBox";

type Phase = "input" | "loading" | "result";

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50";
const miniCls =
  "w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm outline-none hover:border-border-subtle focus:border-blue-500/50 focus:bg-background";

const errorText: Record<string, string> = {
  email: "Enter a valid email address.",
  "resume-short": "Paste your whole resume. It looks too short to work with.",
  "posting-short": "Paste the whole job posting, including the requirements.",
  source: "Choose how you found us.",
  files: "One of your files couldn't be used. Remove it and add it again, or paste the text instead.",
  "too-big": "Your files add up to more than we can send at once (about 4 MB). Remove one, or paste the text instead.",
  "too-long": "That's too long. Trim the resume or the posting and try again.",
  limit: "You've used your 2 free resumes. Paid resumes are coming soon. Email info@thewarthens.com if you need one sooner.",
  cap: "We've reached our free limit for this month. It resets on the 1st. Join the wait by emailing info@thewarthens.com.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  unavailable: "The resume builder isn't available right now. Try again later.",
  upstream: "Something went wrong building your resume, and it didn't use up a free try. Try again.",
  forbidden: "Something went wrong. Reload the page and try again.",
};

function cleanDoc(d: ResumeDoc): ResumeDoc {
  const t = (s: string) => s.trim();
  return {
    ...d,
    name: t(d.name),
    headline: t(d.headline),
    summary: t(d.summary),
    contact: d.contact.map(t).filter(Boolean),
    skills: d.skills.map((s) => ({ label: t(s.label), items: t(s.items) })).filter((s) => s.items),
    experience: d.experience
      .map((j) => ({ ...j, title: t(j.title), company: t(j.company), location: t(j.location), dates: t(j.dates), bullets: j.bullets.map(t).filter(Boolean) }))
      .filter((j) => j.title || j.company),
    training: d.training.map((x) => ({ name: t(x.name), detail: t(x.detail), dates: t(x.dates) })).filter((x) => x.name),
    education: d.education.map((e) => ({ school: t(e.school), credential: t(e.credential), dates: t(e.dates) })).filter((e) => e.school),
  };
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// A textarea that grows with its text, so nothing is hidden behind a scrollbar.
function AutoTextarea({ value, className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight + 2}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} className={`${className ?? ""} resize-none overflow-hidden`} {...rest} />;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-1 mt-5 border-b border-foreground/70 pb-0.5 text-[11px] font-semibold uppercase tracking-wider">
      {children}
    </p>
  );
}

export default function ResumeTailor() {
  const [phase, setPhase] = useState<Phase>("input");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState("");
  const [posting, setPosting] = useState("");
  const [resumeFiles, setResumeFiles] = useState<PickedFile[]>([]);
  const [postingFiles, setPostingFiles] = useState<PickedFile[]>([]);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);
  const [doc, setDoc] = useState<ResumeDoc | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [busy, setBusy] = useState<"" | "pdf" | "docx">("");

  const finalDoc = useMemo(() => (doc ? cleanDoc(doc) : null), [doc]);
  const ats = useMemo(
    () => (finalDoc && result ? runAtsCheck(finalDoc, result.postingTitle, result.postingKeywords) : null),
    [finalDoc, result]
  );

  async function build(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Check here first so people get a clear message before anything is sent.
    if (resume.trim().length < 150 && resumeFiles.length === 0) {
      setError(errorText["resume-short"]);
      return;
    }
    if (posting.trim().length < 80 && postingFiles.length === 0) {
      setError(errorText["posting-short"]);
      return;
    }
    if (!source) {
      setError(errorText.source);
      return;
    }
    if ([...resumeFiles, ...postingFiles].reduce((n, f) => n + f.size, 0) > 5_000_000) {
      setError(errorText["too-big"]);
      return;
    }
    setPhase("loading");
    try {
      const res = await fetch("/api/resume-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          resumeText: resume,
          postingText: posting,
          resumeFiles: resumeFiles.flatMap((f) => (f.attachment ? [f.attachment] : [])),
          postingFiles: postingFiles.flatMap((f) => (f.attachment ? [f.attachment] : [])),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error === "problem" ? data.message : errorText[data.error as string] ?? errorText.upstream);
        setPhase("input");
        return;
      }
      setResult(data.result as TailorResult);
      setDoc((data.result as TailorResult).resume);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      setPhase("result");
      window.scrollTo({ top: document.getElementById("resume-tool")?.offsetTop ?? 0, behavior: "smooth" });
    } catch {
      setError(errorText.upstream);
      setPhase("input");
    }
  }

  async function download(kind: "pdf" | "docx") {
    if (!finalDoc) return;
    setBusy(kind);
    try {
      if (kind === "pdf") {
        const bytes = await buildPdf(finalDoc);
        save(new Blob([bytes as BlobPart], { type: "application/pdf" }), resumeFileName(finalDoc, "pdf"));
      } else {
        save(await buildDocx(finalDoc), resumeFileName(finalDoc, "docx"));
      }
    } finally {
      setBusy("");
    }
  }

  function startOver() {
    setPhase("input");
    setResult(null);
    setDoc(null);
    setPosting("");
    setPostingFiles([]);
    setError("");
  }

  if (phase === "loading") {
    return (
      <div id="resume-tool" className="mx-auto max-w-3xl rounded-3xl border border-border-subtle bg-background-elevated p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border-subtle border-t-blue-600" aria-hidden />
        <p className="mt-4 text-lg font-semibold">Building your resume</p>
        <p className="mt-1 text-sm text-foreground-muted" role="status">
          Reading your resume against the job posting. This usually takes 20 to 40 seconds. Please keep this tab open.
        </p>
      </div>
    );
  }

  if (phase === "result" && doc && result && finalDoc && ats) {
    const set = (patch: Partial<ResumeDoc>) => setDoc({ ...doc, ...patch });
    const setJob = (i: number, patch: Partial<ResumeJob>) =>
      set({ experience: doc.experience.map((j, k) => (k === i ? { ...j, ...patch } : j)) });
    const flags = ats.rows.filter((r) => r.status === "flag").length;

    return (
      <div id="resume-tool" className="space-y-6">
        <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Your tailored resume</p>
              <p className="mt-1 text-lg font-semibold">Check it, change anything, then download</p>
              <p className="mt-1 text-sm text-foreground-muted">
                Click any text below to edit it. Everything here came from your own resume. Read it once through before you send it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => download("pdf")}
                disabled={busy !== ""}
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy === "pdf" ? "Preparing…" : "Download PDF"}
              </button>
              <button
                onClick={() => download("docx")}
                disabled={busy !== ""}
                className="inline-flex items-center justify-center rounded-full border border-border-subtle px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-background disabled:opacity-60"
              >
                {busy === "docx" ? "Preparing…" : "Download Word"}
              </button>
            </div>
          </div>
          {remaining !== null && (
            <p className="mt-3 text-xs text-foreground-muted">
              {remaining > 0
                ? `You have ${remaining} free ${remaining === 1 ? "resume" : "resumes"} left.`
                : "That was your last free resume. Editing and downloading this one is still free."}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-border-subtle bg-background p-5 font-sans text-sm leading-snug sm:p-8">
            <input aria-label="Name" className={`${miniCls} text-2xl font-semibold`} value={doc.name} onChange={(e) => set({ name: e.target.value })} />
            <input aria-label="Target job title" className={`${miniCls} text-base`} value={doc.headline} onChange={(e) => set({ headline: e.target.value })} />
            <AutoTextarea
              aria-label="Contact details, separated by vertical bars"
              className={`${miniCls} text-xs text-foreground-muted`}
              value={doc.contact.join(" | ")}
              onChange={(e) => set({ contact: e.target.value.split("|") })}
            />

            <SectionLabel>Summary</SectionLabel>
            <AutoTextarea aria-label="Summary" className={miniCls} value={doc.summary} onChange={(e) => set({ summary: e.target.value })} />

            <SectionLabel>Skills</SectionLabel>
            {doc.skills.map((s, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:gap-1">
                <input
                  aria-label={`Skill group ${i + 1} name`}
                  className={`${miniCls} shrink-0 font-semibold sm:w-28!`}
                  value={s.label}
                  onChange={(e) => set({ skills: doc.skills.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })}
                />
                <AutoTextarea
                  aria-label={`Skill group ${i + 1} items`}
                  className={miniCls}
                  value={s.items}
                  onChange={(e) => set({ skills: doc.skills.map((x, k) => (k === i ? { ...x, items: e.target.value } : x)) })}
                />
              </div>
            ))}

            <SectionLabel>Experience</SectionLabel>
            {doc.experience.map((j, i) => (
              <div key={i} className="mb-3">
                <div className="flex flex-col sm:flex-row sm:gap-1">
                  <input aria-label={`Job ${i + 1} title`} className={`${miniCls} font-semibold`} value={j.title} onChange={(e) => setJob(i, { title: e.target.value })} />
                  <input aria-label={`Job ${i + 1} dates`} className={`${miniCls} shrink-0 sm:w-40! sm:text-right`} value={j.dates} onChange={(e) => setJob(i, { dates: e.target.value })} />
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-1">
                  <input aria-label={`Job ${i + 1} company`} className={`${miniCls} font-semibold`} value={j.company} onChange={(e) => setJob(i, { company: e.target.value })} />
                  <input aria-label={`Job ${i + 1} location`} className={`${miniCls} shrink-0 text-xs text-foreground-muted sm:w-40! sm:text-right`} value={j.location} onChange={(e) => setJob(i, { location: e.target.value })} />
                </div>
                <AutoTextarea
                  aria-label={`Job ${i + 1} bullets, one per line`}
                  className={`${miniCls} mt-1`}
                  value={j.bullets.join("\n")}
                  onChange={(e) => setJob(i, { bullets: e.target.value.split("\n") })}
                />
              </div>
            ))}

            {doc.training.length > 0 && (
              <>
                <SectionLabel>Training and certifications</SectionLabel>
                {doc.training.map((t, i) => (
                  <div key={i} className="flex flex-wrap gap-1 sm:flex-nowrap">
                    <input aria-label={`Training ${i + 1}`} className={miniCls} value={t.name} onChange={(e) => set({ training: doc.training.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} />
                    <input aria-label={`Training ${i + 1} date`} className={`${miniCls} sm:w-28 sm:text-right`} value={t.dates} onChange={(e) => set({ training: doc.training.map((x, k) => (k === i ? { ...x, dates: e.target.value } : x)) })} />
                  </div>
                ))}
              </>
            )}

            {doc.education.length > 0 && (
              <>
                <SectionLabel>Education</SectionLabel>
                {doc.education.map((ed, i) => (
                  <div key={i} className="flex flex-wrap gap-1 sm:flex-nowrap">
                    <input aria-label={`Education ${i + 1} credential`} className={miniCls} value={ed.credential} onChange={(e) => set({ education: doc.education.map((x, k) => (k === i ? { ...x, credential: e.target.value } : x)) })} />
                    <input aria-label={`Education ${i + 1} school`} className={miniCls} value={ed.school} onChange={(e) => set({ education: doc.education.map((x, k) => (k === i ? { ...x, school: e.target.value } : x)) })} />
                    <input aria-label={`Education ${i + 1} date`} className={`${miniCls} sm:w-28 sm:text-right`} value={ed.dates} onChange={(e) => set({ education: doc.education.map((x, k) => (k === i ? { ...x, dates: e.target.value } : x)) })} />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
              <p className="font-semibold">Resume check</p>
              <p className="mt-1 text-xs text-foreground-muted">
                {flags === 0 ? "Everything on our checklist is covered." : `${flags} thing${flags === 1 ? "" : "s"} to look at.`} This updates as you edit.
              </p>
              <ul className="mt-3 space-y-2.5">
                {ats.rows.map((r) => (
                  <li key={r.id} className="flex gap-2.5 text-sm">
                    <span
                      aria-hidden
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        r.status === "pass" ? "bg-green-600/15 text-green-700" : "bg-amber-500/20 text-amber-700"
                      }`}
                    >
                      {r.status === "pass" ? "✓" : "!"}
                    </span>
                    <span>
                      <span className="sr-only">{r.status === "pass" ? "Covered: " : "Look at this: "}</span>
                      <span className="font-medium">{r.label}.</span>{" "}
                      <span className="text-foreground-muted">{r.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {ats.missing.length > 0 && (
                <p className="mt-3 text-xs text-foreground-muted">
                  Terms from the posting not in your resume: {ats.missing.join(", ")}. See below before adding any.
                </p>
              )}
            </div>

            {result.gaps.length > 0 && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="font-semibold">The posting asks for these</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  Your resume didn&apos;t show them, so we left them out. Add one only if it&apos;s true for you.
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {result.gaps.map((g, i) => (
                    <li key={i}>
                      <span className="font-medium">{g.requirement}</span>
                      <span className="block text-xs text-foreground-muted">{g.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.changes.length > 0 && (
              <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                <p className="font-semibold">What we changed</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground-muted">
                  {result.changes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <details className="rounded-2xl border border-border-subtle bg-background-elevated p-5 text-sm">
              <summary className="cursor-pointer font-semibold">How a scanner reads it</summary>
              <p className="mt-2 text-xs text-foreground-muted">
                Hiring software strips the design and reads plain text, in this order. If this looks clean, it parses clean.
              </p>
              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-background p-3 text-xs">{resumeToPlainText(finalDoc)}</pre>
            </details>

            <button onClick={startOver} className="text-sm font-semibold text-blue-600 underline underline-offset-2">
              Tailor it for a different job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form id="resume-tool" onSubmit={build} className="mx-auto max-w-3xl rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Free tool</p>
      <p className="mt-1 text-lg font-semibold">Tailor your resume to a job</p>
      <p className="mt-1 text-sm text-foreground-muted">
        Add your current resume and the job posting, by pasting text, uploading files, or dropping in screenshots. You get a finished, scanner-friendly resume as a PDF and a Word file. Your first 2 are free.
      </p>

      <ResumeInputBox
        id="rt-resume"
        label="1. Your current resume"
        help="Upload a file, drag one in, paste a screenshot, or paste the text."
        placeholder="Paste your resume text here, or drop a PDF, Word file, or screenshot onto this box."
        text={resume}
        onText={setResume}
        files={resumeFiles}
        onFiles={setResumeFiles}
      />

      <ResumeInputBox
        id="rt-posting"
        label="2. The job posting"
        help="Paste a link to the posting, or paste the text, or upload a file or screenshot."
        placeholder="Paste the link to the job posting here, or paste the posting text, or drop a screenshot onto this box."
        text={posting}
        onText={setPosting}
        files={postingFiles}
        onFiles={setPostingFiles}
        allowLink
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold" htmlFor="rt-email">
            3. Your email
          </label>
          <input
            id="rt-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={`${inputCls} mt-2`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold" htmlFor="rt-source">
            4. How did you find us?
          </label>
          <select id="rt-source" required value={source} onChange={(e) => setSource(e.target.value)} className={`${inputCls} mt-2`}>
            <option value="" disabled>
              Choose one
            </option>
            <option>YouTube</option>
            <option>Instagram or TikTok</option>
            <option>Google search</option>
            <option>A friend or family member</option>
            <option>Career day or an event</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Build my resume
        <span aria-hidden>→</span>
      </button>
      <p className="mt-3 text-xs text-foreground-muted">
        We send your resume and the posting, including any files or screenshots, to an AI service (Anthropic&apos;s Claude) to rewrite it, and we don&apos;t save any of it. We only keep your email to count your free tries, and we may send the occasional resource. Reply to any email from us to opt out. We only reword what&apos;s in your resume. We never add experience you don&apos;t have.
      </p>
    </form>
  );
}
