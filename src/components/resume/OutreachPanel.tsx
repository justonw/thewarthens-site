"use client";

import { useEffect, useRef, useState } from "react";
import { AUDIENCES, NOTE_LIMIT, TWEAKS, looksLikeOnlyLink, MAX_RECIPIENT_FILES, type Audience, type OutreachResult, type Purpose, type Tweak } from "@/lib/outreach";
import { MAX_ATTACH_B64_TOTAL, type ResumeDoc, type ResumeGap, type TailorResult } from "@/lib/resume-tailor";
import { processFile, type PickedFile } from "@/lib/resume-upload";
import { newMessageId, whenLabel, type SavedMessage } from "@/lib/resume-library";
import { track } from "@/lib/track";
import AutoTextarea from "./AutoTextarea";
import InputArea from "./InputArea";

// "Reach out": the step after a resume is built. Two taps get a message: who it is for, then "Write my message". The
// person can also drop in a screenshot or paste what they know about that person, which makes it sharper, but it is
// optional: without it the message is written from the job posting. Everything the person already gave us (resume,
// job, true answers) is reused, so there is nothing to type twice.

const errors: Record<string, string> = {
  "outreach-limit": "You've used this month's messages. They come back on the 1st.",
  "slow-down": "That was a lot of tries in a short time. Wait a few minutes and try again.",
  upstream: "That didn't work this time. Try again in a moment.",
  cap: "We've reached our limit for messages this month. Please try again next month.",
  unavailable: "Messages aren't available right now. Please try again later.",
  email: "Add your email address on the resume form first. It only counts your monthly messages.",
  files: "Those files are too big to send together. Remove one, or use a screenshot instead.",
};

const icons: Record<Audience, React.ReactNode> = {
  recruiter: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="10" cy="10" r="6" />
      <path d="M21 21l-6-6M7.5 10.2l1.7 1.7 3.3-3.4" />
    </svg>
  ),
  manager: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  ),
  peer: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 5h11a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
      <path d="M19 9h1a2 2 0 012 2v5a2 2 0 01-2 2h-1v3l-3-3" />
    </svg>
  ),
  friend: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.2a3.2 3.2 0 010 5.6M18 14.4c2 .8 3.5 2.9 3.5 5.6" />
    </svg>
  ),
};

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
const box = "w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-blue-500/50";

type Copied = "" | "message" | "note" | "subject";

// Older browsers, and some in-app browsers, refuse the modern copy call but still allow this one.
function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(field);
  return ok;
}

export default function OutreachPanel({
  doc,
  result,
  gaps,
  email,
  saved = [],
  onSave,
  initialPurpose = "intro",
  appliedDaysAgo = null,
  onFollowedUp,
  onBack,
}: {
  doc: ResumeDoc;
  result: TailorResult;
  gaps: ResumeGap[];
  email: string;
  // Messages already written for this job, kept with the saved build, and a way to keep the new ones.
  saved?: SavedMessage[];
  onSave?: (m: SavedMessage) => void;
  // Opened from "follow up" on My applications: start on the follow-up message, and say how long ago they applied.
  initialPurpose?: Purpose;
  appliedDaysAgo?: number | null;
  // Called when a follow-up message is copied, so the job is not nudged again.
  onFollowedUp?: () => void;
  onBack: () => void;
}) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [purpose, setPurpose] = useState<Purpose>(initialPurpose);
  const [relationship, setRelationship] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [reading, setReading] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [fileNote, setFileNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [out, setOut] = useState<OutreachResult | null>(null);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [subject, setSubject] = useState("");
  const [left, setLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState<Copied>("");
  const picker = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const previews = useRef<string[]>([]);
  // One saved message per "who and what" the person writes: tweaks and edits update it instead of adding more.
  const keptId = useRef("");

  // Picture previews are released when the panel goes away.
  useEffect(() => {
    const urls = previews.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const linkOnly = looksLikeOnlyLink(about);
  const company = result.postingCompany;

  async function addFiles(list: FileList | File[] | null) {
    const incoming = Array.from(list ?? []);
    if (incoming.length === 0) return;
    setFileNote("");
    setReading("Reading what you added…");
    let attached = files.length;
    let total = files.reduce((n, f) => n + f.size, 0);
    let text = about;
    const added: PickedFile[] = [];
    const problems: string[] = [];
    for (const file of incoming) {
      try {
        const picked = await processFile(file);
        if (picked.previewUrl) previews.current.push(picked.previewUrl);
        if (picked.kind === "text") {
          text = `${text.trim()}${text.trim() ? "\n\n" : ""}${picked.text ?? ""}`;
          continue;
        }
        if (attached >= MAX_RECIPIENT_FILES) {
          problems.push(`You can add up to ${MAX_RECIPIENT_FILES} pictures or files. Remove one to add another.`);
          continue;
        }
        if (total + picked.size > MAX_ATTACH_B64_TOTAL * 0.8) {
          problems.push(`${picked.name} would make the upload too large. Remove one, or use a smaller screenshot.`);
          continue;
        }
        attached += 1;
        total += picked.size;
        added.push(picked);
      } catch (e) {
        problems.push(e instanceof Error ? e.message : "We couldn't read that file. Paste the text instead.");
      }
    }
    if (text !== about) setAbout(text);
    if (added.length) setFiles((f) => [...f, ...added]);
    setFileNote(problems[0] ?? "");
    setReading(null);
  }

  function removeFile(id: string) {
    setFiles((list) => list.filter((f) => f.id !== id));
  }

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrag(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      void addFiles(e.dataTransfer.files);
    },
  };

  async function write(tweak: Tweak = "") {
    if (!audience || busy) return;
    if (!email) {
      setError(errors.email);
      return;
    }
    setBusy(true);
    setError("");
    setCopied("");
    try {
      const res = await fetch("/api/resume-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          audience,
          doc,
          postingTitle: result.postingTitle,
          postingCompany: result.postingCompany,
          postingKeywords: result.postingKeywords,
          fitReason: result.fit?.reason ?? "",
          unmet: gaps.filter((g) => g.kind !== "deepen").map((g) => g.requirement),
          recipientName: name.trim(),
          recipientText: linkOnly ? "" : about.trim(),
          recipientFiles: files.flatMap((f) => (f.attachment ? [f.attachment] : [])),
          tweak,
          purpose,
          daysSince: appliedDaysAgo ?? 7,
          relationship: audience === "friend" ? relationship.trim() : "",
          previous: tweak && out ? { note, message } : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(errors[data.error as string] ?? errors.upstream);
        return;
      }
      const r = data.result as OutreachResult;
      setOut(r);
      setMessage(r.message);
      setNote(r.note);
      setSubject(r.subject);
      setLeft(typeof data.left === "number" ? data.left : null);
      keep(r, { note: r.note, message: r.message, subject: r.subject });
      track("outreach-written");
      // The result takes the place of the form, so bring its top into view.
      window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch {
      setError(errors.upstream);
    } finally {
      setBusy(false);
    }
  }

  // Keeps the message with the saved build, so it is still there when the person comes back to this job.
  function keep(r: OutreachResult, text: { note: string; message: string; subject: string }) {
    if (!onSave || !audience) return;
    if (!keptId.current) keptId.current = newMessageId();
    onSave({
      id: keptId.current,
      at: new Date().toISOString(),
      purpose,
      audience,
      who: [r.recipient.name, r.recipient.role].filter(Boolean).join(", "),
      subject: text.subject,
      note: text.note,
      message: text.message,
    });
  }

  async function copy(kind: Exclude<Copied, "">, text: string) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = legacyCopy(text);
    }
    if (ok) {
      setError("");
      // What they copied is what they will send, so that is what is kept.
      if (out) keep(out, { note, message, subject });
      if (purpose === "followup") onFollowedUp?.();
      setCopied(kind);
      window.setTimeout(() => setCopied((c) => (c === kind ? "" : c)), 2200);
    } else {
      setError("Your browser blocked copying. Select the text and copy it by hand.");
    }
  }

  function startOver() {
    setOut(null);
    setName("");
    setAbout("");
    setFiles([]);
    setFileNote("");
    setError("");
    setAudience(null);
    setRelationship("");
    keptId.current = "";
    window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const ready = audience !== null;
  const hasAbout = about.trim().length > 0 || files.length > 0;

  // ---------- Writing ----------
  if (busy && !out) {
    return (
      <div ref={topRef} className="rounded-3xl border border-border-subtle bg-white p-8 text-center shadow-lg shadow-blue-900/5 sm:p-12">
        <span aria-hidden className="mx-auto block h-10 w-10 animate-spin rounded-full border-[3px] border-blue-500/25 border-t-blue-600" />
        <p role="status" className="mt-5 text-lg font-semibold">
          {hasAbout ? "Reading what you added and writing your message…" : "Writing your message from the job posting…"}
        </p>
        <p className="mt-1 text-sm text-foreground-muted">This usually takes about 15 seconds. Please keep this tab open.</p>
      </div>
    );
  }

  // ---------- The messages ----------
  if (out) {
    const who = [out.recipient.name, out.recipient.role].filter(Boolean).join(", ");
    const noteOver = note.length > NOTE_LIMIT;
    return (
      <div ref={topRef} className="space-y-5 scroll-mt-24">
        <div className="rounded-3xl border border-border-subtle bg-gradient-to-br from-blue-500/10 via-background-elevated to-violet-500/10 p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{who ? `Writing to ${who}` : out.basedOn === "profile" ? "Written from the profile you added" : "Written from the job posting"}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Your message{company ? ` for ${company}` : ""} is ready</h3>
          {out.noticed && (
            <p className="mt-2 flex gap-2 text-sm text-foreground-muted">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>
                <span className="font-semibold text-foreground">What we noticed:</span> {out.noticed}
              </span>
            </p>
          )}
        </div>

        <section aria-labelledby="oc-msg-title" className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 id="oc-msg-title" className="font-semibold">
              Message or email
            </h4>
            <span className="text-xs text-foreground-muted">{wordCount(message)} words</span>
          </div>
          <label htmlFor="oc-subject" className="mt-3 block text-xs font-semibold text-foreground-muted">
            Subject, if you send it as an email
          </label>
          <div className="mt-1 flex gap-2">
            <input id="oc-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={box} />
            <button type="button" onClick={() => void copy("subject", subject)} className="shrink-0 rounded-xl border border-border-subtle bg-background px-3 text-xs font-semibold transition-colors hover:border-blue-500/40">
              {copied === "subject" ? "Copied" : "Copy"}
            </button>
          </div>
          <label htmlFor="oc-message" className="sr-only">
            Your message
          </label>
          <AutoTextarea id="oc-message" value={message} onChange={(e) => setMessage(e.target.value)} className={`${box} mt-3 text-base`} />
          <button
            type="button"
            onClick={() => void copy("message", message)}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:w-auto"
          >
            {copied === "message" ? "Copied, now paste it" : "Copy message"}
          </button>
        </section>

        <section aria-labelledby="oc-note-title" className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 id="oc-note-title" className="font-semibold">
              {audience === "friend" ? "Short text or direct message" : purpose === "followup" ? "Short version" : "Short note for a LinkedIn connection request"}
            </h4>
            <span className={`text-xs font-semibold ${noteOver ? "text-red-700" : "text-foreground-muted"}`} aria-live="polite">
              {note.length} / {NOTE_LIMIT}
            </span>
          </div>
          <label htmlFor="oc-note" className="sr-only">
            Your connection note
          </label>
          <AutoTextarea id="oc-note" value={note} onChange={(e) => setNote(e.target.value)} className={`${box} mt-3 text-base`} />
          {noteOver && <p className="mt-1 text-xs text-red-700">LinkedIn cuts connection notes at {NOTE_LIMIT} characters. Trim a few words.</p>}
          <button
            type="button"
            onClick={() => void copy("note", note)}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border-subtle bg-background-elevated px-6 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40 sm:w-auto"
          >
            {copied === "note" ? "Copied, now paste it" : "Copy note"}
          </button>
        </section>

        <div className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
          <p className="text-sm font-semibold">Not quite right? One tap and we&apos;ll write it again.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TWEAKS.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={busy}
                onClick={() => void write(t.id)}
                className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40 disabled:opacity-60 sm:min-h-10"
              >
                {busy ? "Writing…" : t.label}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {left !== null && left <= 10 && <p className="mt-3 text-xs text-foreground-muted">{left === 0 ? "That was your last message this month." : `${left} more ${left === 1 ? "message" : "messages"} this month.`}</p>}
        </div>

        <p className="text-sm text-foreground-muted">
          Read it once and make it yours before you send it. It only uses what is on your resume and what you gave us about them. No message can promise a reply.
        </p>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={startOver} className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-blue-500/40">
            Write to someone else
          </button>
          <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center rounded-full px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-500/10">
            Back to my resume
          </button>
        </div>
      </div>
    );
  }

  // ---------- The form ----------
  const step = (n: number, done: boolean) => (
    <span aria-hidden className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition-colors ${done ? "bg-green-600" : "bg-gradient-to-br from-blue-600 to-violet-600"}`}>
      {done ? "✓" : n}
    </span>
  );

  return (
    <div ref={topRef} className="space-y-5 scroll-mt-24">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">{purpose === "followup" ? "Follow up on your application" : "Get your resume in front of a real person"}</h3>
        <p className="mt-1 text-sm text-foreground-muted sm:text-base">
          {purpose === "followup"
            ? `A short, polite check-in${company ? ` for ${company}` : ""}${appliedDaysAgo ? `, since you applied about ${appliedDaysAgo} days ago` : ""}. Two taps and about 15 seconds.`
            : `We'll write a short message to someone${company ? ` at ${company}` : " at the company"}, using your resume and the job. Two taps and about 15 seconds.`}
        </p>
        <div role="group" aria-label="What is the message for?" className="mt-4 inline-flex max-w-full flex-wrap rounded-3xl border border-border-subtle bg-background-elevated p-1">
          {(
            [
              ["intro", "Introduce myself"],
              ["followup", "Follow up on my application"],
            ] as [Purpose, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={purpose === id}
              onClick={() => setPurpose(id)}
              className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:min-h-10 ${purpose === id ? "bg-foreground text-background" : "text-foreground-muted hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {saved.length > 0 && (
        <details className="rounded-2xl border border-border-subtle bg-background-elevated p-4">
          <summary className="cursor-pointer text-sm font-semibold">
            Messages you already wrote for this job ({saved.length})
          </summary>
          <ul className="mt-3 space-y-3">
            {saved.map((m) => (
              <li key={m.id} className="rounded-xl border border-border-subtle bg-white p-3 text-sm">
                <p className="text-xs font-semibold text-foreground-muted">
                  {m.who || AUDIENCES.find((a) => a.id === m.audience)?.label} · {whenLabel(m.at)}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void navigator.clipboard?.writeText(m.message).catch(() => {})} className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-xs font-semibold hover:border-blue-500/40">
                    Copy message
                  </button>
                  {m.note && (
                    <button type="button" onClick={() => void navigator.clipboard?.writeText(m.note).catch(() => {})} className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-xs font-semibold hover:border-blue-500/40">
                      Copy note
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 sm:p-6">
        <div className="flex items-center gap-3">
          {step(1, ready)}
          <h4 id="oc-who" className="text-lg font-bold tracking-tight">
            Who are you writing to?
          </h4>
        </div>
        <div role="radiogroup" aria-labelledby="oc-who" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => {
            const on = audience === a.id;
            return (
              <label
                key={a.id}
                className={`relative flex min-h-11 cursor-pointer flex-row items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all sm:flex-col sm:items-start sm:gap-2 ${
                  on ? "border-blue-600 bg-blue-500/5 shadow-md shadow-blue-900/10" : "border-border-subtle bg-background hover:border-blue-500/40"
                } focus-within:ring-2 focus-within:ring-blue-500/40`}
              >
                <input type="radio" name="oc-audience" value={a.id} checked={on} onChange={() => setAudience(a.id)} className="sr-only" />
                <span aria-hidden className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${on ? "bg-blue-600 text-white" : "bg-blue-600/10 text-blue-700"}`}>
                  {icons[a.id]}
                </span>
                <span>
                  <span className="block font-semibold">{a.label}</span>
                  <span className="mt-0.5 block text-xs text-foreground-muted">{a.blurb}</span>
                </span>
                {on && (
                  <span aria-hidden className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    ✓
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className={`rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-opacity sm:p-6 ${ready ? "" : "opacity-60"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {step(2, hasAbout)}
          <h4 className="text-lg font-bold tracking-tight">{purpose === "followup" ? "Who are you following up with?" : audience === "friend" ? "Tell us about your friend" : "Tell us about them"}</h4>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Optional</span>
        </div>
        {purpose !== "followup" && (
          <>
        <p className="mb-3 mt-1.5 text-sm text-foreground-muted sm:pl-12">
          Their profile makes the message sharper. Skip it and we&apos;ll write from the job posting.
        </p>
        <div {...dropHandlers}>
          <InputArea
            id="oc-about"
            value={about}
            onChange={setAbout}
            onPaste={(e) => {
              const pasted = Array.from(e.clipboardData.files);
              if (pasted.length === 0) return;
              e.preventDefault();
              void addFiles(pasted);
            }}
            title="Paste or drop their profile"
            hint="Their LinkedIn About and Experience, a bio, or a screenshot."
            formats={["Text", "Screenshot", "PDF"]}
            noun="profile"
            dragging={drag}
            working={reading}
            onChoose={() => picker.current?.click()}
            placeholder="Paste what you know about them"
            fileCount={files.length}
            heightClass="h-60"
            aboveText={
              files.length > 0 ? (
                <ul className="mb-2 flex flex-wrap gap-2">
                  {files.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 rounded-xl border border-border-subtle bg-background py-1 pl-1 pr-2 text-xs">
                      {f.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.previewUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 font-bold text-blue-700">
                          PDF
                        </span>
                      )}
                      <span className="max-w-[9rem] truncate font-medium">{f.name}</span>
                      <button type="button" onClick={() => removeFile(f.id)} aria-label={`Remove ${f.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-red-500/10 hover:text-red-700">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null
            }
          />
        </div>
        <input
          ref={picker}
          type="file"
          multiple
          accept=".docx,.txt,.md,.pdf,image/*"
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose a screenshot or file about the person"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {fileNote && (
          <p role="alert" className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
            {fileNote}
          </p>
        )}
        {linkOnly && (
          <p role="status" className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
            We can&apos;t open links, because sites like LinkedIn don&apos;t let outside tools in. Copy the text from their profile and paste it here, or add a screenshot. Or skip it and we&apos;ll write from the job posting.
          </p>
        )}

        <details className="mt-3 text-sm">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-blue-700 sm:min-h-0">How do I get this from LinkedIn?</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-foreground-muted">
            <li>Open their profile and scroll to their About and Experience.</li>
            <li>Take a screenshot. Mac: Shift + Command + 4. Windows: Windows key + Shift + S. Phone: side button and volume up.</li>
            <li>Paste it in the box above (Command or Ctrl + V), or tap Choose a file.</li>
          </ol>
        </details>
          </>
        )}

        <div className="mt-4">
          <label htmlFor="oc-name" className="text-xs font-semibold text-foreground-muted">
            Their name, if you know it
          </label>
          <input id="oc-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="For example, Jamie Alvarez" autoComplete="off" className={`${box} mt-1 sm:max-w-sm`} />
        </div>
        {audience === "friend" && purpose !== "followup" && (
          <div className="mt-4">
            <label htmlFor="oc-relationship" className="text-xs font-semibold text-foreground-muted">
              How do you know them? (optional, in a few words)
            </label>
            <input id="oc-relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} maxLength={200} placeholder="For example, we worked together at Northline" autoComplete="off" className={`${box} mt-1 sm:max-w-md`} />
            <p className="mt-1 text-xs text-foreground-muted">We only mention what you tell us here, so nothing is made up about your history together.</p>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void write()}
          disabled={!ready || busy || reading !== null}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Write my message
          <span aria-hidden>→</span>
        </button>
        {!ready && <p className="text-sm text-foreground-muted">Pick who you&apos;re writing to first.</p>}
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground">
          Back to my resume
        </button>
      </div>
      <p className="text-xs text-foreground-muted">We use your resume, the job, and what you add here, and never make up experience. You read it before you send it.</p>
    </div>
  );
}
