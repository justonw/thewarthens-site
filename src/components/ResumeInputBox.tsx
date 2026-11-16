"use client";

import { useRef, useState } from "react";
import { processFile, type PickedFile } from "@/lib/resume-upload";

// One of the two input boxes on the resume tool. A person can type or paste text, upload files, drag
// files in from their desktop, or paste a screenshot. For the job posting they can also paste a link.
// Whenever something can't be read, a message says what to do instead.

const MAX_FILES = 6;
const ACCEPT = ".pdf,.docx,.txt,.md,image/*";

const linkErrors: Record<string, string> = {
  "bad-url": "That doesn't look like a link we can read. Paste the posting text instead, or drop in a screenshot of it.",
  "blocked-site": "That site doesn't let us read its pages (LinkedIn and Indeed often don't). Copy the posting text and paste it here, or drop in a screenshot of it.",
  unreachable: "We couldn't open that link. Check it, or paste the posting text or a screenshot instead.",
  thin: "That page didn't have a job posting we could read. Some sites only show it after their own scripts run. Paste the posting text or drop in a screenshot instead.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes, or paste the posting text instead.",
  forbidden: "Something went wrong. Reload the page and try again.",
};

type Notice = { kind: "error" | "info"; message: string } | null;

export default function ResumeInputBox({
  id,
  label,
  help,
  placeholder,
  text,
  onText,
  files,
  onFiles,
  allowLink = false,
  lookHint = false,
  step,
  done = false,
}: {
  id: string;
  label: string;
  help: string;
  placeholder: string;
  text: string;
  onText: (value: string) => void;
  files: PickedFile[];
  onFiles: (value: PickedFile[]) => void;
  allowLink?: boolean;
  // On the resume box: remind people that a Word file gives us its words but not its look.
  lookHint?: boolean;
  step: number;
  done?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const picker = useRef<HTMLInputElement>(null);

  const trimmed = text.trim();
  const looksLikeLink = allowLink && /^https?:\/\/\S+$/i.test(trimmed);

  async function addFiles(list: File[]) {
    if (list.length === 0) return;
    setBusy(true);
    setNotice(null);
    const errors: string[] = [];
    const added: PickedFile[] = [];
    const words: string[] = [];
    let sawWord = false;
    for (const file of list) {
      if (/\.docx$/i.test(file.name)) sawWord = true;
      if (files.length + added.length >= MAX_FILES) {
        errors.push(`You can add up to ${MAX_FILES} files here. Skipped ${file.name || "a file"}.`);
        continue;
      }
      try {
        const picked = await processFile(file);
        if (picked.kind === "text" && picked.text) words.push(picked.text);
        else added.push(picked);
      } catch (e) {
        errors.push(e instanceof Error ? e.message : `We couldn't read ${file.name}. Paste the text instead.`);
      }
    }
    if (added.length) onFiles([...files, ...added]);
    if (words.length) onText([text.trim(), ...words].filter(Boolean).join("\n\n"));
    if (errors.length) setNotice({ kind: "error", message: errors.join(" ") });
    else if (words.length) setNotice({ kind: "info", message: `Added the text from your file. Read it over and fix anything that looks off.${lookHint && sawWord ? " To copy its look as well, upload it as a PDF or a screenshot." : ""}` });
    setBusy(false);
  }

  async function fetchLink(url: string) {
    setBusy(true);
    setNotice({ kind: "info", message: "Reading the posting from your link…" });
    try {
      const res = await fetch("/api/posting-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setNotice({ kind: "error", message: linkErrors[data.error as string] ?? linkErrors.unreachable });
      } else {
        onText(data.text as string);
        setNotice({ kind: "info", message: `Got it: ${data.title || "the posting"}. Read it over and fix anything that looks off.` });
      }
    } catch {
      setNotice({ kind: "error", message: linkErrors.unreachable });
    }
    setBusy(false);
  }

  function removeFile(fileId: string) {
    const gone = files.find((f) => f.id === fileId);
    if (gone?.previewUrl) URL.revokeObjectURL(gone.previewUrl);
    onFiles(files.filter((f) => f.id !== fileId));
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = Array.from(e.clipboardData.files);
    if (pasted.length > 0) {
      e.preventDefault();
      void addFiles(pasted);
      return;
    }
    if (allowLink && !trimmed) {
      const value = e.clipboardData.getData("text").trim();
      if (/^https?:\/\/\S+$/i.test(value)) {
        e.preventDefault();
        onText(value);
        void fetchLink(value);
      }
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void addFiles(Array.from(e.dataTransfer.files));
      }}
      className={`h-full rounded-3xl border p-5 shadow-lg shadow-blue-900/5 transition-all focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6 ${
        dragging ? "border-dashed border-blue-500 bg-blue-500/5" : "border-border-subtle bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition-colors ${
            done ? "bg-green-600" : "bg-gradient-to-br from-blue-600 to-violet-600"
          }`}
        >
          {done ? "✓" : step}
        </span>
        <label className="text-lg font-bold tracking-tight" htmlFor={id}>
          {label}
        </label>
      </div>
      <p className="mt-1.5 text-sm text-foreground-muted sm:pl-12 lg:min-h-[2.75rem]">{help}</p>
      <textarea
        id={id}
        rows={9}
        value={text}
        onChange={(e) => onText(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder}
        className="mt-4 w-full resize-y rounded-2xl border border-border-subtle bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-blue-500/60 focus:bg-white"
      />

      {files.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background px-2 py-1 text-xs">
              {f.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.previewUrl} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-[10px] font-bold text-blue-700">
                  PDF
                </span>
              )}
              <span className="max-w-[10rem] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                aria-label={`Remove ${f.name}`}
                className="rounded px-1 text-sm font-bold text-foreground-muted hover:text-foreground"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => picker.current?.click()}
        disabled={busy}
        className="group mt-3 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border-subtle bg-background px-4 py-3 text-left transition-colors hover:border-blue-500/50 hover:bg-blue-500/5 disabled:opacity-60"
      >
        <span aria-hidden className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 transition-colors group-hover:bg-blue-600/15">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V5m0 0l-4 4m4-4l4 4" />
            <path d="M4 16v2.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V16" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-semibold">Upload a file or screenshot</span>
          <span className="block text-xs text-foreground-muted">{busy ? "Working on it…" : "Or drag it in, or paste a screenshot. PDF, Word, text, and pictures all work."}</span>
        </span>
      </button>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        {looksLikeLink && (
          <button
            type="button"
            onClick={() => fetchLink(trimmed)}
            disabled={busy}
            className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
          >
            Get the posting from this link
          </button>
        )}
        <input
          ref={picker}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-label={`${label}: choose files`}
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []);
            e.target.value = "";
            void addFiles(picked);
          }}
        />
      </div>

      {notice && (
        <p
          role={notice.kind === "error" ? "alert" : "status"}
          className={`mt-2 rounded-lg px-3 py-2 text-xs ${
            notice.kind === "error" ? "border border-red-500/30 bg-red-500/5 text-red-700" : "bg-blue-500/5 text-foreground-muted"
          }`}
        >
          {notice.message}
        </p>
      )}
    </div>
  );
}
