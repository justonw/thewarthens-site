"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function TrackerEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/tracker-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Use the direct download link instead.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        id="tracker-download"
        className="rounded-3xl border border-border-subtle bg-background-elevated p-6 text-center sm:p-8"
      >
        <p className="text-sm font-semibold text-blue-600">Check your inbox</p>
        <p className="mt-2 text-sm text-foreground-muted">
          We sent the tracker to {email}. You can also{" "}
          <a
            href="/downloads/job-search-tracker.xlsx"
            download
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            download it directly
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      id="tracker-download"
      className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        Free Download
      </p>
      <p className="mt-1 text-lg font-semibold">The Job Search Tracker Template</p>
      <p className="mt-1 text-sm text-foreground-muted">
        A spreadsheet to track every application, status, and follow-up date.
        Yours to copy and edit.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Email Me the Tracker"}
          <span aria-hidden>↓</span>
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">
          {errorMsg}{" "}
          <a
            href="/downloads/job-search-tracker.xlsx"
            download
            className="font-semibold underline"
          >
            Download directly instead
          </a>
          .
        </p>
      )}
      <p className="mt-3 text-xs text-foreground-muted">
        No spam, just this download and the occasional resource we think is
        worth your time. Unsubscribe anytime.
      </p>
    </div>
  );
}
