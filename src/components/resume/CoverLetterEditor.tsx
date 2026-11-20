"use client";

import { useState } from "react";
import type { CoverLetter, ResumeDoc } from "@/lib/resume-tailor";
import { buildCoverLetterDocx, buildCoverLetterPdf, coverLetterFileName, coverLetterToText } from "@/lib/resume-files";
import { downloadBlob } from "@/lib/download";
import { cleanLetter } from "@/lib/kit-export";
import AutoTextarea from "./AutoTextarea";

const field =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm leading-relaxed outline-none hover:border-border-subtle focus:border-blue-500/50 focus:bg-background-elevated";

const tips = [
  "Read it out loud once. If a sentence sounds like something you would not say, change it.",
  "If you know the hiring manager's name, put it in the greeting. A name beats \"Hiring Team\".",
  "Keep it to one page. Short and specific beats long and general.",
];

export default function CoverLetterEditor({
  letter,
  doc,
  onChange,
}: {
  letter: CoverLetter;
  doc: ResumeDoc;
  onChange: (letter: CoverLetter) => void;
}) {
  const [busy, setBusy] = useState<"" | "pdf" | "docx">("");
  const [copied, setCopied] = useState(false);
  const clean: CoverLetter = cleanLetter(letter);
  const words = clean.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

  async function download(kind: "pdf" | "docx") {
    setBusy(kind);
    try {
      if (kind === "pdf") {
        downloadBlob(new Blob([(await buildCoverLetterPdf(clean, doc)) as BlobPart], { type: "application/pdf" }), coverLetterFileName(doc, "pdf"));
      } else {
        downloadBlob(await buildCoverLetterDocx(clean, doc), coverLetterFileName(doc, "docx"));
      }
    } finally {
      setBusy("");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(coverLetterToText(clean, doc));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying can be blocked; the download buttons still work.
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => download("pdf")} disabled={busy !== ""} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60">
            {busy === "pdf" ? "Preparing…" : "Download PDF"}
          </button>
          <button onClick={() => download("docx")} disabled={busy !== ""} className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40 disabled:opacity-60">
            {busy === "docx" ? "Preparing…" : "Download Word"}
          </button>
          <button onClick={copy} className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40">
            {copied ? "Copied" : "Copy text"}
          </button>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-background p-4 font-sans sm:p-8">
          <p className="px-2 text-lg font-semibold">{doc.name}</p>
          {doc.contact.length > 0 && <p className="px-2 text-xs text-foreground-muted">{doc.contact.join("  |  ")}</p>}
          <input aria-label="Greeting" className={`${field} mt-5`} value={letter.greeting} onChange={(e) => onChange({ ...letter, greeting: e.target.value })} />
          {letter.paragraphs.map((p, i) => (
            <div key={i} className="group relative mt-2">
              <AutoTextarea
                aria-label={`Paragraph ${i + 1}`}
                className={field}
                value={p}
                onChange={(e) => onChange({ ...letter, paragraphs: letter.paragraphs.map((x, k) => (k === i ? e.target.value : x)) })}
              />
              {letter.paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...letter, paragraphs: letter.paragraphs.filter((_, k) => k !== i) })}
                  aria-label={`Remove paragraph ${i + 1}`}
                  className="absolute right-1 top-1 rounded px-1.5 text-sm font-bold text-foreground-muted opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <input aria-label="Closing" className={`${field} mt-2`} value={letter.closing} onChange={(e) => onChange({ ...letter, closing: e.target.value })} />
          <p className="mt-3 px-2 text-sm font-semibold">{doc.name}</p>
        </div>
        <p className="text-xs text-foreground-muted" role="status">
          {words} words. {words > 350 ? "A little long: trim it to fit one page." : "That fits on one page."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
          <p className="font-semibold">Before you send it</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground-muted">
            {tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
