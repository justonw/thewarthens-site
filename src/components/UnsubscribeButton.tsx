"use client";

import { useState } from "react";

// A button (not a bare link) so a mail app that scans links cannot unsubscribe someone by accident.
export default function UnsubscribeButton({ i, t }: { i: string; t: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function go() {
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ i, t }) });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }
  if (status === "done") {
    return (
      <p role="status" className="mt-8 rounded-xl bg-green-600/10 px-4 py-3 text-sm font-semibold text-green-800">
        Done. You won&apos;t get any more notes from us.
      </p>
    );
  }
  return (
    <div className="mt-8">
      <button type="button" onClick={go} disabled={status === "loading" || !i || !t} className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50">
        {status === "loading" ? "One moment…" : "Yes, unsubscribe me"}
      </button>
      {status === "error" || !i || !t ? (
        <p role="alert" className="mt-4 text-sm text-red-700">
          That link didn&apos;t work. Reply to the note and say &ldquo;stop&rdquo;, and we&apos;ll take you off by hand.
        </p>
      ) : null}
    </div>
  );
}
