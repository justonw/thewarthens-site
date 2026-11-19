"use client";

import { useState } from "react";
import { HEARD_FROM } from "@/lib/heard-from";

type Status = "idle" | "loading" | "success" | "error";

type FileLink = { label: string; href: string };

function DirectLinks({ files }: { files: FileLink[] }) {
  return (
    <>
      {files.map((f, i) => (
        <span key={f.href}>
          {i > 0 && (files.length === 2 ? " and " : i === files.length - 1 ? ", and " : ", ")}
          <a href={f.href} download className="font-semibold underline">
            {f.label}
          </a>
        </span>
      ))}
    </>
  );
}

export default function EmailGatedDownload({
  resourceId,
  eyebrow = "Free Download",
  title,
  description,
  files,
  ctaLabel = "Email Me This",
}: {
  resourceId: string;
  eyebrow?: string;
  title: string;
  description: string;
  files: FileLink[];
  ctaLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  // A hidden trap field: people never see it, so only a script fills it in.
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/resource-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resourceId, source, company_url: trap }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Use the direct download links instead.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 text-center sm:p-8">
        <p className="text-sm font-semibold text-blue-600">Check your inbox</p>
        <p className="mt-2 text-sm text-foreground-muted">
          We sent {title.toLowerCase()} to {email}. You can also grab{" "}
          <DirectLinks files={files} /> directly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>
      <p className="mt-1 text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="email"
          required
          aria-label="Your email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
        />
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${resourceId}-company`}>Company website</label>
          <input id={`${resourceId}-company`} name="company_url" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </div>
        <label className="sr-only" htmlFor={`${resourceId}-source`}>
          Where did you find us? (optional)
        </label>
        <select
          id={`${resourceId}-source`}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm outline-none focus:border-blue-500/50 sm:w-64"
        >
          <option value="">Where did you find us? (optional)</option>
          {HEARD_FROM.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : ctaLabel}
          <span aria-hidden>↓</span>
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">
          {errorMsg} Download directly instead: <DirectLinks files={files} />.
        </p>
      )}
      <p className="mt-3 text-xs text-foreground-muted">
        No spam, just these downloads and the occasional resource we think is
        worth your time. Unsubscribe anytime.
      </p>
    </div>
  );
}
