"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildLabel, usageLine, type Usage } from "@/lib/resume-usage";
import { contactGaps, type CoverLetter, type ResumeDoc, type ResumeGap, type TailorResult } from "@/lib/resume-tailor";
import { keywordCoverage, runAtsCheck } from "@/lib/resume-ats";
import { RESUME_STYLES, buildCoverLetterDocx, buildCoverLetterPdf, buildDocx, buildPdf, coverLetterFileName, resumeFileName, resumeToPlainText, type ResumeStyle } from "@/lib/resume-files";
import { downloadBlob } from "@/lib/download";
import { usePersistentState } from "@/lib/use-persistent-state";
import { NO_TRACKER_ENTRIES, TRACKER_KEY, type TrackerEntry } from "@/lib/job-tracker";
import ResumeEditor from "./ResumeEditor";
import CoverLetterEditor from "./CoverLetterEditor";
import NextSteps from "./NextSteps";
import { Confetti, ReadinessRing } from "./Celebrate";
import ShareCard from "./ShareCard";

type Tab = "resume" | "letter";

const card = "rounded-2xl border border-border-subtle bg-background-elevated p-5";
const input =
  "w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-blue-500/50";

const refineErrors: Record<string, string> = {
  "refine-limit": "You've used this month's quick updates. You can still edit your resume by hand.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  upstream: "That didn't work this time. Try again in a moment.",
  cap: "We've reached our limit for quick updates this month. You can still edit your resume by hand.",
  email: "Add your email address above to use quick updates.",
};

// Drops blank lines and empty entries before the resume is checked or downloaded.
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

function GapItem({ gap, onAdd }: { gap: ResumeGap; onAdd: (answer: string) => Promise<string | null> }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (answer.trim().length < 3) {
      setMessage("Write a short sentence about it.");
      return;
    }
    setBusy(true);
    setMessage("");
    const problem = await onAdd(answer.trim());
    setBusy(false);
    if (problem) setMessage(problem);
  }

  return (
    <li className="text-sm">
      <p className="font-medium">{gap.requirement}</p>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="mt-1 text-xs font-semibold text-blue-600 underline underline-offset-2">
          I have this
        </button>
      ) : (
        <form onSubmit={submit} className="mt-2 space-y-2">
          <label className="block text-xs text-foreground-muted" htmlFor={`gap-${gap.requirement}`}>
            Tell us in a sentence: what you did, where, and for how long.
          </label>
          <textarea
            id={`gap-${gap.requirement}`}
            rows={2}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="For example: I used it daily at Harbor Table to track catering leads for 2 years."
            className={input}
          />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={busy} className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60">
              {busy ? "Adding…" : "Add it to my resume"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-foreground-muted underline underline-offset-2">
              Cancel
            </button>
          </div>
          {message && (
            <p role="alert" className="text-xs text-red-700">
              {message}
            </p>
          )}
        </form>
      )}
    </li>
  );
}

function Highlighted({ text, keywords }: { text: string; keywords: string[] }) {
  const escaped = keywords.map((k) => k.trim()).filter(Boolean).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-amber-200/80 px-0.5 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// Your original next to the tailored one, with the posting's key terms highlighted in both. The counts are real.
function Compare({ original, tailored, keywords }: { original: string; tailored: string; keywords: string[] }) {
  const before = keywordCoverage(original, keywords);
  const after = keywordCoverage(tailored, keywords);
  return (
    <details className="group rounded-2xl border border-border-subtle bg-background-elevated">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-sm font-semibold">
        <span>
          See what changed
          {keywords.length > 0 && (
            <span className="ml-2 font-normal text-foreground-muted">
              Posting terms found: {before.found.length} of {keywords.length} before, {after.found.length} of {keywords.length} now
            </span>
          )}
        </span>
        <span aria-hidden className="shrink-0 text-foreground-muted transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Your original</p>
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-background p-3 text-xs leading-relaxed">
            <Highlighted text={original} keywords={keywords} />
          </pre>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Tailored for this job</p>
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-background p-3 text-xs leading-relaxed">
            <Highlighted text={tailored} keywords={keywords} />
          </pre>
        </div>
        <p className="text-xs text-foreground-muted md:col-span-2">Highlighted words are the key terms from the job posting.</p>
      </div>
    </details>
  );
}

export default function ResultView({
  result,
  doc,
  onDoc,
  letter,
  letterFailed = false,
  onLetter,
  gaps,
  onGaps,
  changes,
  onChanges,
  email,
  emailCopy = false,
  remaining,
  usage,
  original,
  onStartOver,
}: {
  result: TailorResult;
  doc: ResumeDoc;
  onDoc: (d: ResumeDoc) => void;
  letter: CoverLetter | null;
  letterFailed?: boolean;
  onLetter: (l: CoverLetter) => void;
  gaps: ResumeGap[];
  onGaps: (g: ResumeGap[]) => void;
  changes: string[];
  onChanges: (c: string[]) => void;
  email: string;
  emailCopy?: boolean;
  remaining: number | null;
  usage?: Usage | null;
  // The resume text the person gave us, for the before-and-after view. Null when it came from a file or from scratch.
  original: string | null;
  onStartOver: () => void;
}) {
  const [tab, setTab] = useState<Tab>("resume");
  const [busy, setBusy] = useState<"" | "pdf" | "docx">("");
  const [justAdded, setJustAdded] = useState("");
  const design = result.design;
  // When we could see the original's look, start with it, as the person asked for.
  const [style, setStyle] = useState<ResumeStyle>(design ? "custom" : "classic");
  // The preview is shown from the start: choosing a template changes only the download, so without a preview
  // nothing on the page would seem to change.
  const [preview, setPreview] = useState(true);
  const [built, setBuilt] = useState<{ url: string; key: string }>({ url: "", key: "" });
  const previewUrl = built.url;

  const finalDoc = useMemo(() => cleanDoc(doc), [doc]);
  const ats = useMemo(() => runAtsCheck(finalDoc, result.postingTitle, result.postingKeywords), [finalDoc, result.postingTitle, result.postingKeywords]);
  const flags = ats.rows.filter((r) => r.status === "flag").length;
  const contactMissing = contactGaps(finalDoc.contact);

  // Add to the job tracker (kept in this browser, the same list as the tracker on the Tech Journey page).
  const [entries, setEntries] = usePersistentState<TrackerEntry[]>(TRACKER_KEY, NO_TRACKER_ENTRIES);
  const [company, setCompany] = useState(result.postingCompany);
  const [role, setRole] = useState(result.postingTitle);
  const [tracked, setTracked] = useState<"" | "added" | "exists">("");

  function addToTracker(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    const exists = entries.some((x) => x.company.toLowerCase() === company.trim().toLowerCase() && x.role.toLowerCase() === role.trim().toLowerCase());
    if (exists) {
      setTracked("exists");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    setEntries((prev) => [
      { id: crypto.randomUUID(), company: company.trim(), role: role.trim(), status: "Not Yet Applied", dateApplied: today, notes: "Resume tailored for this job." },
      ...prev,
    ]);
    setTracked("added");
  }

  // Emails the person their files (the same ones the download buttons make). Sent once on its own if they
  // ticked the box, and again whenever they ask, so the copy can include their edits.
  const [mailed, setMailed] = useState<"" | "sending" | "sent" | "failed">("");
  // When the email did not go, say why in plain words (a daily limit is not a fault, and the files can still be downloaded).
  const [mailWhy, setMailWhy] = useState("");
  // They ticked "email me a copy" on the form next to the address they typed, which is their say-so. The copy goes
  // out once, when the result first appears. A mistyped address is caught on the form, where the address is entered.
  const autoSent = useRef(false);
  useEffect(() => {
    if (!emailCopy || autoSent.current) return;
    const timer = window.setTimeout(() => {
      autoSent.current = true;
      void sendCopy();
    }, 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendCopy() {
    setMailed("sending");
    try {
      const b64 = async (blob: Blob) => {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        let bin = "";
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return btoa(bin);
      };
      // A job title can be very long, so the names sent by email are kept to a sensible length.
      const short = (name: string) => {
        const dot = name.lastIndexOf(".");
        const base = name.slice(0, dot);
        return base.length > 90 ? `${base.slice(0, 90).replace(/-+$/, "")}${name.slice(dot)}` : name;
      };
      const files = [
        { name: short(resumeFileName(finalDoc, "pdf")), data: await b64(new Blob([(await buildPdf(finalDoc, style, design)) as BlobPart])) },
        { name: short(resumeFileName(finalDoc, "docx")), data: await b64(await buildDocx(finalDoc, style, design)) },
      ];
      if (letter) {
        files.push(
          { name: short(coverLetterFileName(finalDoc, "pdf")), data: await b64(new Blob([(await buildCoverLetterPdf(letter, finalDoc)) as BlobPart])) },
          { name: short(coverLetterFileName(finalDoc, "docx")), data: await b64(await buildCoverLetterDocx(letter, finalDoc)) }
        );
      }
      const res = await fetch("/api/resume-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, jobTitle: result.postingTitle, files, buildNote: usage ? buildLabel(usage) ?? undefined : undefined }),
      });
      if (!res.ok) {
        const why = (await res.json().catch(() => ({}))) as { error?: string };
        setMailWhy(
          why.error === "copies-used"
            ? "Every build comes with 2 emailed copies (the one sent automatically and one resend), and you've used them. Your files are still here to download."
            : why.error === "slow-down"
              ? "That was a lot of copies in a short time. Wait a few minutes and press \"Email me a copy\", or download your files below."
              : ""
        );
      } else setMailWhy("");
      setMailed(res.ok ? "sent" : "failed");
    } catch {
      setMailed("failed");
    }
  }

  async function download(kind: "pdf" | "docx") {
    setBusy(kind);
    try {
      if (kind === "pdf") {
        downloadBlob(new Blob([(await buildPdf(finalDoc, style, design)) as BlobPart], { type: "application/pdf" }), resumeFileName(finalDoc, "pdf"));
      } else {
        downloadBlob(await buildDocx(finalDoc, style, design), resumeFileName(finalDoc, "docx"));
      }
    } finally {
      setBusy("");
    }
  }

  // A live preview of the PDF in the chosen style. It is rebuilt a moment after any edit or style change, and the
  // old one stays on screen (marked as updating) until the new one is ready.
  const previewKey = useMemo(() => `${style}|${JSON.stringify(finalDoc)}|${design ? design.accent : ""}`, [style, finalDoc, design]);
  const updating = preview && built.key !== previewKey;
  useEffect(() => {
    if (!preview) return;
    let cancelled = false;
    let url = "";
    const timer = setTimeout(async () => {
      const bytes = await buildPdf(finalDoc, style, design);
      if (cancelled) return;
      url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      setBuilt({ url, key: previewKey });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      // The address of an older preview is released once a newer one has replaced it.
      if (url) window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    };
  }, [preview, finalDoc, style, design, previewKey]);

  // "I have this": the person tells us in a sentence, and we add it to the resume.
  async function addGap(index: number, answer: string): Promise<string | null> {
    if (!email) return refineErrors.email;
    try {
      const res = await fetch("/api/resume-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          doc: finalDoc,
          requirement: gaps[index].requirement,
          answer,
          postingTitle: result.postingTitle,
          postingCompany: result.postingCompany,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return refineErrors[data.error as string] ?? refineErrors.upstream;
      if (!data.added) return data.note || "Add a little more detail, like where you used it and for how long.";
      onDoc(data.resume as ResumeDoc);
      onGaps(gaps.filter((_, k) => k !== index));
      onChanges([data.note as string, ...changes]);
      setJustAdded(data.note as string);
      return null;
    } catch {
      return refineErrors.upstream;
    }
  }

  const tabButton = (id: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        tab === id ? "bg-foreground text-background" : "text-foreground-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div id="resume-tool" className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-green-500/10 via-background-elevated to-violet-500/10 p-5 shadow-sm sm:p-6">
        <Confetti />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ReadinessRing passed={ats.rows.length - flags} total={ats.rows.length} />
            <div>
              {flags === 0 ? (
                <p className="rb-pop inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Ready to apply</p>
              ) : (
                <p className="rb-pop inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {flags} thing{flags === 1 ? "" : "s"} to check before you apply
                </p>
              )}
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                Your {letter ? "resume and cover letter" : "resume"} for {result.postingTitle || doc.headline}
                {result.postingCompany ? ` at ${result.postingCompany}` : ""}
              </h2>
              {mailed !== "" && (
                <p role="status" className="mt-1 text-sm font-medium">
                  {mailed === "sending" && "Emailing you a copy..."}
                  {mailed === "sent" && <span className="text-green-700">A copy is on its way to {email}. If it doesn&apos;t show up, check spam.</span>}
                  {mailed === "failed" && <span className="text-red-700">{mailWhy || "We couldn't email your copy. You can still download your files below."}</span>}
                </p>
              )}
              <p className="mt-1 text-sm text-foreground-muted">
                Click any text to edit it. Read it through once before you send it.
                {usage ? ` ${usageLine(usage)}` : remaining !== null && (remaining > 0 ? ` You have ${remaining} ${remaining === 1 ? "build" : "builds"} left.` : " That was your last build, but you can keep editing and downloading this one.")}
              </p>
            </div>
          </div>
          <button type="button" onClick={onStartOver} className="rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40">
            Tailor for another job
          </button>
        </div>
      </div>

    {(contactMissing.email || contactMissing.phone) && (
        <div role="alert" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5">
          <p className="font-semibold">
            {contactMissing.email && contactMissing.phone ? "No email or phone number made it onto this resume." : contactMissing.email ? "No email address made it onto this resume." : "No phone number made it onto this resume."}
          </p>
          <p className="mt-1 text-sm text-foreground-muted">A recruiter needs a way to reach you. Type your contact details here, separated by &quot;|&quot;, and they go straight into the header.</p>
          <label htmlFor="rt-contact-fix" className="sr-only">
            Your contact details
          </label>
          <input
            id="rt-contact-fix"
            type="text"
            value={doc.contact.join(" | ")}
            onChange={(e) => onDoc({ ...doc, contact: e.target.value.split("|") })}
            placeholder="Atlanta, GA | (555) 123-4567 | you@example.com"
            className="mt-3 w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      {letterFailed && !letter && (
        <p role="status" className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          Your resume is ready, but the cover letter did not come through this time. You can download the resume now, and use &quot;Tailor for another job&quot; to try the letter again. Your resume and notes are saved here, so it only takes a moment.
        </p>
      )}

      {letter && (
        <div role="tablist" aria-label="Your documents" className="inline-flex rounded-full border border-border-subtle bg-background-elevated p-1">
          {tabButton("resume", "Resume")}
          {tabButton("letter", "Cover letter")}
        </div>
      )}

      {tab === "letter" && letter ? (
        <CoverLetterEditor letter={letter} doc={finalDoc} onChange={onLetter} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => download("pdf")} disabled={busy !== ""} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60">
                {busy === "pdf" ? "Preparing…" : "Download PDF"}
              </button>
              <button onClick={() => download("docx")} disabled={busy !== ""} className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40 disabled:opacity-60">
                {busy === "docx" ? "Preparing…" : "Download Word"}
              </button>
              <button onClick={sendCopy} disabled={mailed === "sending"} title={`Sends to ${email}`} className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40 disabled:opacity-60">
                {mailed === "sending" ? "Sending…" : mailed === "sent" ? "Email it again" : "Email me a copy"}
              </button>
            </div>
            <p className="-mt-1 text-xs text-foreground-muted">Email copies go to {email}.</p>
            <div className="space-y-2" role="group" aria-label="Download style">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-xs font-semibold text-foreground-muted">Template for your download</span>
                <div className="inline-flex flex-wrap rounded-2xl border border-border-subtle bg-white p-1 shadow-sm">
                  {design && (
                    <button
                      type="button"
                      aria-pressed={style === "custom"}
                      onClick={() => setStyle("custom")}
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${style === "custom" ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white" : "text-blue-700 hover:text-blue-900"}`}
                    >
                      Match my resume
                    </button>
                  )}
                  {RESUME_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      aria-pressed={style === st.id}
                      title={st.note}
                      onClick={() => setStyle(st.id)}
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${style === st.id ? "bg-foreground text-background" : "text-foreground-muted hover:text-foreground"}`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setPreview((v) => !v)} aria-expanded={preview} className="text-xs font-semibold text-blue-600 underline underline-offset-2">
                  {preview ? "Hide preview" : "Preview the download"}
                </button>
              </div>
              <p className="text-xs text-foreground-muted">
                {style === "custom" && design ? (
                  <>
                    Matched your resume: {design.font === "serif" ? "serif" : "sans-serif"} type, {design.headerAlign} header
                    {design.accent && (
                      <>
                        , accent <span aria-hidden className="inline-block h-2.5 w-2.5 translate-y-px rounded-full align-baseline" style={{ backgroundColor: design.accent }} /> {design.accent}
                      </>
                    )}
                    , {design.columns > 1 ? "sections in the standard order (summary, skills, experience, training, education)" : "sections in your original order"}.
                    {(design.columns > 1 || design.hasGraphics) &&
                      " Your original used columns or graphics, which many hiring systems misread, so we kept one clean column."}
                  </>
                ) : (
                  RESUME_STYLES.find((x) => x.id === style)?.note
                )}
              </p>
              {preview && (
                <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
                  <p className="border-b border-border-subtle bg-background-elevated px-4 py-2 text-xs font-semibold text-foreground-muted">
                    Preview of your download ({style === "custom" ? "Match my resume" : (RESUME_STYLES.find((x) => x.id === style)?.label ?? style)})
                  </p>
                  {previewUrl ? (
                    <iframe title="Preview of your resume download" src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} className="h-[560px] w-full" />
                  ) : (
                    <p className="p-6 text-center text-sm text-foreground-muted">Building the preview…</p>
                  )}
                  {updating && previewUrl && (
                    <span role="status" className="absolute right-3 top-10 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background shadow">
                      Updating…
                    </span>
                  )}
                  {previewUrl && (
                    <p className="border-t border-border-subtle px-4 py-2 text-xs text-foreground-muted">
                      Not showing on your phone?{" "}
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline underline-offset-2">
                        Open the preview in a new tab
                      </a>
                      .
                    </p>
                  )}
                </div>
              )}
            </div>
            <ResumeEditor doc={doc} onChange={onDoc} />
            {original && <Compare original={original} tailored={resumeToPlainText(finalDoc)} keywords={result.postingKeywords} />}
          </div>

          <div className="space-y-4">
            {justAdded && (
              <p role="status" className="rounded-2xl border border-green-600/30 bg-green-600/5 px-4 py-3 text-sm text-green-800">
                {justAdded}
              </p>
            )}

            <div className={card}>
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
                      <span className="font-medium">{r.label}.</span> <span className="text-foreground-muted">{r.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {gaps.length > 0 && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="font-semibold">The posting asks for these</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  Your resume didn&apos;t show them, so we left them out. If you have one, tap &ldquo;I have this&rdquo; and we&apos;ll add it. Only add what&apos;s true.
                </p>
                <ul className="mt-3 space-y-4">
                  {gaps.map((g, i) => (
                    <GapItem key={g.requirement} gap={g} onAdd={(answer) => addGap(i, answer)} />
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={addToTracker} className={card}>
              <p className="font-semibold">Applying for this job?</p>
              <p className="mt-1 text-xs text-foreground-muted">Add it to your job tracker so you remember to follow up.</p>
              <div className="mt-3 space-y-2">
                <input aria-label="Company" value={company} onChange={(e) => { setCompany(e.target.value); setTracked(""); }} placeholder="Company" className={input} />
                <input aria-label="Role" value={role} onChange={(e) => { setRole(e.target.value); setTracked(""); }} placeholder="Role" className={input} />
              </div>
              <button type="submit" disabled={!company.trim() || !role.trim()} className="mt-3 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50">
                Add to my tracker
              </button>
              {tracked && (
                <p role="status" className="mt-2 text-xs text-foreground-muted">
                  {tracked === "added" ? "Added. " : "That one is already in your tracker. "}
                  <Link href="/tech#tracker" className="font-semibold text-blue-600 underline underline-offset-2">
                    Open my tracker
                  </Link>
                </p>
              )}
            </form>

            {changes.length > 0 && (
              <div className={card}>
                <p className="font-semibold">What we did, and why</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground-muted">
                  {changes.map((c, i) => (
                    <li key={`${i}-${c}`}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <details className={`${card} text-sm`}>
              <summary className="cursor-pointer font-semibold">How a scanner reads it</summary>
              <p className="mt-2 text-xs text-foreground-muted">Hiring software first turns your resume into plain text like this. Ours is one column with standard headings, which most systems read well. We can&apos;t test every system, so a clean view here is a good sign, not a guarantee.</p>
              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-background p-3 text-xs">{resumeToPlainText(finalDoc)}</pre>
            </details>
          </div>
        </div>
      )}

      <NextSteps title={`${result.postingTitle} ${doc.headline}`} extra={result.postingKeywords.join(" ")} />

      <ShareCard />
    </div>
  );
}
