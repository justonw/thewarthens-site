"use client";

import { useEffect, useRef } from "react";

// "Your files": every document the kit has made, in one panel that opens from anywhere on the result screen, each with the way to
// take it with you. A part that has not been made yet says so and offers the way to make it. Built on the browser's own
// <dialog>, so it traps focus, closes on Escape, and works with a screen reader without extra code.

export type HubAction = { label: string; onClick: () => void; busy?: boolean };
export type HubRow = {
  id: string;
  title: string;
  detail: string;
  // The ways to take it. Empty means it has not been made yet, and `empty` says how to make it.
  actions: HubAction[];
  empty?: { text: string; action: HubAction };
};

const small =
  "inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-background px-4 text-sm font-semibold transition-colors hover:border-blue-500/40 disabled:opacity-60";

export default function DownloadHub({
  open,
  onClose,
  rows,
  email,
  mail,
  onProfile,
  inApp,
}: {
  open: boolean;
  onClose: () => void;
  rows: HubRow[];
  email: string;
  mail: { state: "" | "sending" | "sent" | "failed"; onSend: () => void };
  // Downloads the saved profile (notes and true answers) to reuse next time. Absent when there is nothing to save.
  onProfile?: () => void;
  // Inside another app's built-in browser, where downloads are often blocked.
  inApp: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="hub-title"
      className="m-0 ml-auto h-full max-h-none w-full max-w-md bg-transparent p-0 backdrop:bg-black/40"
    >
      <div className="flex h-full flex-col overflow-y-auto bg-background p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="hub-title" className="text-xl font-semibold tracking-tight">
              Your files
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">Everything you have made for this job, in one place.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close your files" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle text-lg hover:border-blue-500/40">
            <span aria-hidden>×</span>
          </button>
        </div>

        <p className="mt-4 rounded-2xl border border-blue-500/25 bg-blue-500/5 px-4 py-3 text-sm">
          <span className="font-semibold">Saved on this device only.</span> Download what you want to keep. Clearing your browser data erases it.
        </p>

        {inApp && (
          <p role="status" className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
            This looks like an app&apos;s built-in browser, which often blocks downloads. If one doesn&apos;t start, use &ldquo;Email me a copy&rdquo; below, or open this page in Safari or Chrome.
          </p>
        )}

        <ul className="mt-5 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border-subtle bg-background-elevated p-4">
              <p className="font-semibold">{r.title}</p>
              <p className="mt-0.5 text-sm text-foreground-muted">{r.detail}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {r.actions.length > 0 ? (
                  r.actions.map((a) => (
                    <button key={a.label} type="button" onClick={a.onClick} disabled={a.busy} className={small}>
                      {a.busy ? "Preparing…" : a.label}
                    </button>
                  ))
                ) : r.empty ? (
                  <>
                    <span className="text-sm text-foreground-muted">{r.empty.text}</span>
                    <button type="button" onClick={r.empty.action.onClick} className={small}>
                      {r.empty.action.label}
                    </button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Keep a copy</p>
        <ul className="mt-2 space-y-3">
          <li className="rounded-2xl border border-border-subtle bg-background-elevated p-4">
            <p className="font-semibold">Email me a copy</p>
            <p className="mt-0.5 text-sm text-foreground-muted">Sends your resume and cover letter to {email || "your email address"} through our email service.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={mail.onSend} disabled={mail.state === "sending"} className={small}>
                {mail.state === "sending" ? "Sending…" : mail.state === "sent" ? "Email it again" : "Email me a copy"}
              </button>
              <span role="status" className="text-sm text-foreground-muted">
                {mail.state === "sent" && "On its way. Check spam if it does not show up."}
                {mail.state === "failed" && "That did not go through. You can still download your files."}
              </span>
            </div>
          </li>
          {onProfile && (
            <li className="rounded-2xl border border-border-subtle bg-background-elevated p-4">
              <p className="font-semibold">Your profile</p>
              <p className="mt-0.5 text-sm text-foreground-muted">Your resume, notes, and the true answers you gave, so your next resume starts faster or works on another device.</p>
              <div className="mt-3">
                <button type="button" onClick={onProfile} className={small}>
                  Download my profile
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </dialog>
  );
}
