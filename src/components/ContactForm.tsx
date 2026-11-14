"use client";

import { useState, type FormEvent } from "react";
import { contactTopics, MESSAGE_MAX, STORY_MAX } from "@/lib/contact-topics";

const fieldClass =
  "w-full rounded-2xl border border-border-subtle bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10";
const labelClass = "block text-sm font-semibold";

type Status = "idle" | "sending" | "sent";

// Send-us-a-message form. Posts to /api/contact, which emails info@thewarthens.com.
export default function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [story, setStory] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const isTestimony = topic === "Share my testimony or my story";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: from, topic, message, story, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Something went wrong. Please email ${email}.`);
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError(`We could not send that. Please check your connection or email ${email}.`);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-purple-600/20 bg-background-elevated p-8 text-center shadow-lg shadow-purple-900/5"
      >
        <p className="text-2xl font-semibold">Thank you, we got it.</p>
        <p className="mx-auto mt-3 max-w-md text-foreground-muted">
          Your message is in our inbox. We read every one, and we will write back as soon as we can.
          We also sent a short confirmation to your email.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="relative rounded-3xl border border-border-subtle bg-background-elevated p-5 text-left shadow-lg shadow-purple-900/5 sm:p-8"
    >
      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelClass}>
            Your name
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${fieldClass} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Your email
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={`${fieldClass} mt-2`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-topic" className={labelClass}>
          What is your message about?
        </label>
        <select
          id="cf-topic"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`${fieldClass} mt-2`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {contactTopics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className={labelClass}>
          Your message
        </label>
        <textarea
          id="cf-message"
          rows={5}
          maxLength={MESSAGE_MAX}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className={`${fieldClass} mt-2 resize-y leading-relaxed`}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="cf-story" className={labelClass}>
          {isTestimony ? "Your testimony" : "Tell us about yourself"}{" "}
          <span className="font-normal text-foreground-muted">(optional)</span>
        </label>
        <p className="mt-1 text-sm text-foreground-muted">
          {isTestimony
            ? "Who you were, how you met Jesus, and what has changed. Share as much or as little as you like."
            : "Where you are in life or in your faith, what you do, or how you found us. Or leave your testimony here if you would like to."}
        </p>
        <textarea
          id="cf-story"
          rows={6}
          maxLength={STORY_MAX}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className={`${fieldClass} mt-2 resize-y leading-relaxed`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-purple-800 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        <p className="text-xs text-foreground-muted">
          Goes straight to our inbox, and we read it ourselves.
        </p>
      </div>
    </form>
  );
}
