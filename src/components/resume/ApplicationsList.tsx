"use client";

import { useState } from "react";
import { cleanDoc, followUpDue, whenLabel, type LibraryEntry } from "@/lib/resume-library";
import { downloadBlob } from "@/lib/download";

// "My applications": every resume the person has built, kept on this device. Open one to edit it, download it again
// without building it twice, mark it applied, or remove it. Shown under the build button, so the next job and the
// last jobs are on the same screen.

const SHOWN = 4;
const pill = "inline-flex min-h-10 items-center justify-center rounded-full border border-border-subtle bg-white px-4 text-xs font-semibold shadow-sm transition-colors hover:border-blue-500/40 disabled:opacity-60";

export default function ApplicationsList({
  entries,
  onOpen,
  onFollowUp,
  onToggleApplied,
  onRemove,
}: {
  entries: LibraryEntry[];
  onOpen: (id: string) => void;
  // Opens the job on a short follow-up message.
  onFollowUp: (id: string) => void;
  onToggleApplied: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [all, setAll] = useState(false);
  const [busy, setBusy] = useState("");
  const [confirming, setConfirming] = useState("");
  const [problem, setProblem] = useState("");

  if (entries.length === 0) return null;
  const shown = all ? entries : entries.slice(0, SHOWN);
  const applied = entries.filter((e) => e.status === "applied").length;

  async function download(e: LibraryEntry, kind: "pdf" | "docx") {
    setBusy(`${e.id}:${kind}`);
    setProblem("");
    try {
      const files = await import("@/lib/resume-files");
      const doc = cleanDoc(e.doc);
      const design = e.design ?? undefined;
      if (kind === "pdf") downloadBlob(new Blob([(await files.buildPdf(doc, e.style, design)) as BlobPart], { type: "application/pdf" }), files.resumeFileName(doc, "pdf"));
      else downloadBlob(await files.buildDocx(doc, e.style, design), files.resumeFileName(doc, "docx"));
    } catch {
      setProblem("That file didn't come out. Open the resume and download it from there.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section aria-labelledby="apps-title" className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="apps-title" className="text-xl font-semibold tracking-tight">
            My applications <span className="text-base font-normal text-foreground-muted">({entries.length})</span>
          </h2>
          <p className="mt-0.5 text-sm text-foreground-muted">
            Every resume you build is kept here, on this device only. Open one to edit it, or download it again without building it twice.
          </p>
        </div>
        {applied > 0 && <p className="text-xs font-semibold text-green-700">{applied} marked applied</p>}
      </div>

      <ul className="mt-4 space-y-3">
        {shown.map((e) => {
          const isApplied = e.status === "applied";
          const nudge = followUpDue(e);
          return (
            <li key={e.id} className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <p className="font-semibold leading-snug">
                    {e.title || e.doc.headline || "Untitled job"}
                    {e.company && <span className="font-normal text-foreground-muted"> at {e.company}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {whenLabel(e.at)} · {e.letter ? "Resume and cover letter" : "Resume"}
                    {e.messages.length > 0 ? ` · ${e.messages.length} ${e.messages.length === 1 ? "message" : "messages"} written` : ""}
                  </p>
                </div>
                {isApplied && <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">Applied</span>}
              </div>
              {nudge.due && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2.5">
                  <p className="text-sm">
                    <span className="font-semibold">Applied {nudge.days} days ago.</span> A short, polite check-in can bring a reply.
                  </p>
                  <button type="button" onClick={() => onFollowUp(e.id)} className="inline-flex min-h-10 items-center rounded-full bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90">
                    Write follow-up
                  </button>
                </div>
              )}
              {e.followedUpAt && <p className="mt-2 text-xs font-semibold text-green-700">Followed up {whenLabel(e.followedUpAt).toLowerCase()}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => onOpen(e.id)} className="inline-flex min-h-10 items-center justify-center rounded-full bg-blue-600 px-5 text-xs font-semibold text-white transition-colors hover:bg-blue-500">
                  Open
                </button>
                <button type="button" onClick={() => void download(e, "pdf")} disabled={busy !== ""} className={pill}>
                  {busy === `${e.id}:pdf` ? "Preparing…" : "PDF"}
                </button>
                <button type="button" onClick={() => void download(e, "docx")} disabled={busy !== ""} className={pill}>
                  {busy === `${e.id}:docx` ? "Preparing…" : "Word"}
                </button>
                <button type="button" onClick={() => onToggleApplied(e.id)} aria-pressed={isApplied} className={pill}>
                  {isApplied ? "Applied ✓" : "Mark applied"}
                </button>
                {confirming === e.id ? (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <button type="button" onClick={() => { onRemove(e.id); setConfirming(""); }} className="inline-flex min-h-10 items-center rounded-full px-3 font-semibold text-red-700 hover:bg-red-500/10">
                      Yes, remove it
                    </button>
                    <button type="button" onClick={() => setConfirming("")} className="inline-flex min-h-10 items-center rounded-full px-3 font-semibold text-foreground-muted hover:text-foreground">
                      Keep
                    </button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirming(e.id)} className="inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold text-foreground-muted transition-colors hover:text-red-700">
                    Remove
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {problem && (
        <p role="alert" className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {problem}
        </p>
      )}
      {entries.length > SHOWN && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-2">
          {all ? "Show fewer" : `Show all ${entries.length}`}
        </button>
      )}
    </section>
  );
}
