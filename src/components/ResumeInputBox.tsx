"use client";

import { useEffect, useRef, useState } from "react";
import { findPostingLink } from "@/lib/posting-link";
import InputArea from "@/components/resume/InputArea";
import { processFile, type PickedFile } from "@/lib/resume-upload";
import { MAX_NOTES_CHARS, MAX_RESUME_CHARS } from "@/lib/resume-input-limits";
import { parseProfileFile, type Profile } from "@/lib/resume-profile";

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
  onProfileFile,
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
  // A saved profile file (from "Download a copy") dropped or picked here is loaded instead of read as a resume.
  onProfileFile?: (profile: Profile) => void;
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
  // What the box said before a link replaced it, so "Undo" can bring it back.
  const [undoText, setUndoText] = useState<string | null>(null);
  // Only the newest link request may fill the box, and only if the person has not changed the box since.
  const requestId = useRef(0);
  const textRef = useRef(text);
  const mounted = useRef(true);
  useEffect(() => {
    textRef.current = text;
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, []);

  const trimmed = text.trim();
  const link = allowLink ? findPostingLink(trimmed) : null;
  const looksLikeLink = link !== null;

  async function addFiles(list: File[]) {
    if (list.length === 0) return;
    setBusy(true);
    setNotice(null);
    const errors: string[] = [];
    const added: PickedFile[] = [];
    const words: string[] = [];
    let sawWord = false;
    let loadedProfile = false;
    for (const file of list) {
      if (onProfileFile && /\.json$/i.test(file.name)) {
        try {
          const parsed = parseProfileFile(await file.text(), { resume: MAX_RESUME_CHARS, notes: MAX_NOTES_CHARS });
          if (parsed.ok) {
            onProfileFile(parsed.profile);
            loadedProfile = true;
            continue;
          }
        } catch {
          /* falls through to the normal "we can't open that" message */
        }
      }
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
    else if (loadedProfile) setNotice({ kind: "info", message: "Loaded your saved profile: your resume, notes, and stories are back." });
    else if (words.length) setNotice({ kind: "info", message: `Added the text from your file. Read it over and fix anything that looks off.${lookHint && sawWord ? " To copy its look as well, upload it as a PDF or a screenshot." : ""}` });
    setBusy(false);
  }

  async function fetchLink(url: string) {
    const mine = ++requestId.current;
    const current = () => mounted.current && requestId.current === mine;
    setBusy(true);
    setUndoText(null);
    setNotice({ kind: "info", message: "Reading the posting from your link…" });
    const slow = window.setTimeout(() => {
      if (current()) setNotice({ kind: "info", message: "Still reading it. Some job sites are slow, this can take up to 20 seconds…" });
    }, 6000);
    const started = Date.now();
    const controller = new AbortController();
    const giveUp = window.setTimeout(() => controller.abort(), 28000);
    try {
      const ask = async () => {
        const r = await fetch("/api/posting-fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });
        return { res: r, data: await r.json().catch(() => ({})) };
      };
      let { res, data } = await ask();
      // Sites like LinkedIn turn away an automated read some of the time and allow it the next. One quiet retry
      // saves the person a second click, but only when the first try was quick (a slow one would double the wait).
      if ((!res.ok || !data.ok) && (data.error === "blocked-site" || data.error === "unreachable") && Date.now() - started < 8000 && current()) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (current()) ({ res, data } = await ask());
      }
      if (!current()) return;
      if (!res.ok || !data.ok) {
        setNotice({ kind: "error", message: linkErrors[data.error as string] ?? linkErrors.unreachable });
      } else if (textRef.current.trim() && !findPostingLink(textRef.current.trim()) && textRef.current !== url) {
        // The person typed or pasted something else while we were reading. Do not overwrite it.
        setNotice({ kind: "info", message: "We read the posting, but the box had changed, so we left it alone. Clear the box and paste the link again to use it." });
      } else {
        onText(data.text as string);
        setNotice({ kind: "info", message: `Got it: ${data.title || "the posting"}. Read it over and fix anything that looks off.` });
      }
    } catch (e) {
      if (current()) {
        const timedOut = e instanceof DOMException && e.name === "AbortError";
        setNotice({
          kind: "error",
          message: timedOut ? "That link took too long to open. Try again, or paste the posting text or a screenshot instead." : linkErrors.unreachable,
        });
      }
    } finally {
      window.clearTimeout(slow);
      window.clearTimeout(giveUp);
      if (current()) setBusy(false);
    }
  }

  // A link was pasted or inserted: put it in the box (remembering what was there) and go and read it.
  function takeLink(url: string) {
    const before = textRef.current;
    if (before.trim() && !findPostingLink(before.trim()) && before.trim() !== url) setUndoText(before);
    onText(url);
    void fetchLink(url);
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
    if (allowLink) {
      const url = findPostingLink(e.clipboardData.getData("text"));
      if (url) {
        e.preventDefault();
        takeLink(url);
      }
    }
  }

  // Some phone keyboards put a copied link into the box without a paste event (the clipboard suggestion above the
  // keys). A link that appears all at once, and is the only thing in the box, is treated like a paste.
  function handleChange(value: string) {
    if (allowLink && value.length - textRef.current.length >= 8 && findPostingLink(value) && !findPostingLink(textRef.current)) {
      const url = findPostingLink(value) as string;
      if (value.trim() === url || value.length - textRef.current.length >= url.length) {
        takeLink(url);
        return;
      }
    }
    onText(value);
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
      <InputArea
        id={id}
        value={text}
        onChange={handleChange}
        onPaste={handlePaste}
        icon={allowLink ? "link" : "document"}
        title={allowLink ? "Paste the job link or text" : "Drop your resume here"}
        hint={allowLink ? "Or drop a screenshot or file of the posting here." : "Or click to paste the text. A PDF, Word file, photo, or screenshot all work."}
        formats={allowLink ? ["Link", "Text", "Screenshot", "PDF"] : ["PDF", "Word", "Photo", "Text"]}
        noun={allowLink ? "job posting" : "resume"}
        dragging={dragging}
        working={busy ? "Reading it…" : null}
        onChoose={() => picker.current?.click()}
        placeholder={placeholder}
        fileCount={files.length}
        aboveText={
files.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background px-2 py-1 text-xs">
              {f.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.previewUrl} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-xs font-bold text-blue-700">
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
      )
        }
      />

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        {looksLikeLink && (
          <button
            type="button"
            onClick={() => fetchLink(link as string)}
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
          {undoText !== null && notice.kind === "info" && !busy ? (
            <>
              {" "}
              <button
                type="button"
                onClick={() => {
                  onText(undoText);
                  setUndoText(null);
                  setNotice(null);
                }}
                className="font-semibold text-blue-700 underline underline-offset-2"
              >
                Undo, put back what I had
              </button>
            </>
          ) : null}
        </p>
      )}
    </div>
  );
}
