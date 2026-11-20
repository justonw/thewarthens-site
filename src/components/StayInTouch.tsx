"use client";

import { useState } from "react";
import { track } from "@/lib/track";

// "Want an occasional note from us?" A quiet email box, for people who are not ready to buy or book anything.
export default function StayInTouch({ from }: { from: "tech" | "faith" }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/stay-in-touch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, from, company_url: trap }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        track("notes-signup");
        return setStatus("done");
      }
      setMessage(data.error === "email" ? "That email doesn't look right. Check it and try again." : data.error === "slow-down" ? "That was a lot of tries. Please wait a few minutes." : "Something went wrong. Try again in a moment, or email info@thewarthens.com.");
      setStatus("error");
    } catch {
      setMessage("Something went wrong. Try again in a moment, or email info@thewarthens.com.");
      setStatus("error");
    }
  }

  return (
    <div id="stay-in-touch" className="scroll-mt-32 h-full rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Stay in touch</p>
      <h3 className="mt-1 text-xl font-semibold">Want an occasional note from us?</h3>
      <p className="mt-2 text-sm text-foreground-muted">
        Now and then we send a short note: something we&apos;re learning, one practical step, and a word of encouragement. From Juston and Atiya.
      </p>
      {status === "done" ? (
        <p role="status" className="mt-5 rounded-xl bg-green-600/10 px-4 py-3 text-sm font-semibold text-green-800">
          Thank you. Check your inbox for a hello from us.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor={`stay-${from}`} className="sr-only">
            Your email
          </label>
          <input
            id={`stay-${from}`}
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 flex-1 rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-base outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
          />
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`stay-${from}-company`}>Company website</label>
            <input id={`stay-${from}-company`} type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </div>
          <button type="submit" disabled={status === "loading"} className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60">
            {status === "loading" ? "Joining…" : "Keep me posted"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {message}
        </p>
      )}
      <p className="mt-3 text-xs text-foreground-muted">By submitting your email, you consent to receive communications from The Warthens. Every note has an unsubscribe link.</p>
    </div>
  );
}
