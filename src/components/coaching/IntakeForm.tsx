"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  coach,
  helpAreas,
  intakeQuestions,
  INTAKE_MAX_CHARS,
  INTAKE_MIN_CHARS,
  freeSession,
} from "@/lib/coaching";

type Status = "idle" | "submitting" | "success" | "error";

const QUESTION_COUNT = intakeQuestions.length;
const CONTACT_STEP = QUESTION_COUNT;
const TOTAL_STEPS = QUESTION_COUNT + 1;

const fieldClass =
  "w-full rounded-2xl border border-border-subtle bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => intakeQuestions.map(() => ""));
  const [areas, setAreas] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [consent, setConsent] = useState(false);
  const [winner, setWinner] = useState(false);
  const [company, setCompany] = useState(""); // honeypot
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const focusRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const hasMoved = useRef(false);

  // After the visitor moves between steps, put the cursor in the first field.
  // Skipped on first render so the page never steals focus on load.
  useEffect(() => {
    if (!hasMoved.current) {
      hasMoved.current = true;
      return;
    }
    focusRef.current?.focus();
  }, [step]);

  const isContactStep = step === CONTACT_STEP;
  const question = isContactStep ? null : intakeQuestions[step];
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  function validate(): string | null {
    if (question) {
      if (answers[step].trim().length < INTAKE_MIN_CHARS) {
        return "Share a little more, even a sentence or two. It helps Jermell understand your situation.";
      }
      return null;
    }
    if (!name.trim()) return "Please add your name so Jermell knows who to reach.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    if (!consent) return "Please check the box to confirm you understand how this works.";
    return null;
  }

  function goNext() {
    const problem = validate();
    if (problem) {
      setFieldError(problem);
      return;
    }
    setFieldError(null);
    setStep((s) => Math.min(s + 1, CONTACT_STEP));
  }

  function goBack() {
    setFieldError(null);
    setServerError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function toggleArea(area: string) {
    setAreas((current) =>
      current.includes(area) ? current.filter((a) => a !== area) : [...current, area]
    );
  }

  function setAnswer(value: string) {
    setAnswers((current) => current.map((a, i) => (i === step ? value : a)));
    if (fieldError) setFieldError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isContactStep) {
      goNext();
      return;
    }
    const problem = validate();
    if (problem) {
      setFieldError(problem);
      return;
    }
    setFieldError(null);
    setServerError("");
    setStatus("submitting");

    // Where did this visitor come from? Helps the team see which pages send people here.
    let source = "";
    try {
      const from = new URLSearchParams(window.location.search).get("from");
      let referrer = "";
      if (document.referrer) referrer = new URL(document.referrer).hostname;
      source = [from, referrer].filter(Boolean).join(" | ");
    } catch {
      source = "";
    }

    try {
      const res = await fetch("/api/coaching-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          linkedin,
          areas,
          answers,
          consent,
          company,
          source,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(
          data.error || "Something went wrong. Please try again, or email info@thewarthens.com."
        );
        setStatus("error");
        return;
      }
      setWinner(data.winner === true);
      setStatus("success");
    } catch {
      setServerError("Something went wrong. Please try again, or email info@thewarthens.com.");
      setStatus("error");
    }
  }

  if (status === "success" && winner) {
    const first = name.trim().split(" ")[0];
    return (
      <div
        role="status"
        className="cd-pop relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 text-center text-white shadow-2xl shadow-blue-900/30 sm:p-10"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
            <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
          </svg>
        </div>
        <h3 className="text-balance mt-5 text-2xl font-semibold sm:text-3xl">
          Hey {first}, {freeSession.winnerLine}
        </h3>
        <p className="mt-4 text-xl font-semibold text-sky-100">{freeSession.winnerHeadline}</p>
        <p className="mx-auto mt-4 max-w-md text-blue-100">
          {coach.firstName} will email you at <strong className="text-white">{email.trim()}</strong>{" "}
          to schedule it. We sent the details to your inbox too.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-blue-100">
          Your request for the free 15-minute intro call is in as well.
        </p>
        <Link
          href="/tech"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
        >
          Explore the free guides while you wait
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-border-subtle bg-background-elevated p-8 text-center sm:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-semibold">Your request is in</h3>
        <p className="mx-auto mt-3 max-w-md text-foreground-muted">
          Thank you, {name.trim().split(" ")[0]}. {coach.firstName} will read what you shared. If it
          looks like a fit, you will get an email at <strong>{email.trim()}</strong> to schedule a
          free 15-minute intro call.
        </p>
        <Link
          href="/tech"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/50"
        >
          Explore the free guides while you wait
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-border-subtle bg-background-elevated p-5 shadow-xl shadow-blue-950/5 sm:p-8"
    >
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          <span aria-live="polite">
            {isContactStep
              ? "Last step: how to reach you"
              : `Question ${step + 1} of ${QUESTION_COUNT}`}
          </span>
          <span>{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Form progress"
          className="mt-2 h-2 overflow-hidden rounded-full bg-background-elevated-2"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-500 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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

      <div className="mt-7 min-h-[22rem]">
        {question ? (
          <fieldset>
            <legend className="text-xl font-semibold leading-snug sm:text-2xl">
              {question.question}
            </legend>
            <p id={`hint-${step}`} className="mt-2 text-sm text-foreground-muted">
              {question.hint}
            </p>

            {step === 1 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                  Tap any that apply (optional)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {helpAreas.map((area) => {
                    const on = areas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleArea(area)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                          on
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-border-subtle bg-background text-foreground hover:border-blue-500/50"
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <textarea
              key={step}
              ref={(el) => {
                focusRef.current = el;
              }}
              value={answers[step]}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={INTAKE_MAX_CHARS}
              rows={7}
              aria-describedby={`hint-${step}`}
              aria-invalid={fieldError ? true : undefined}
              placeholder="Type your answer here"
              className={`${fieldClass} mt-4 min-h-44 resize-y leading-relaxed`}
            />
            <p className="mt-1 text-right text-xs text-foreground-muted">
              {answers[step].length}/{INTAKE_MAX_CHARS}
            </p>
          </fieldset>
        ) : (
          <fieldset>
            <legend className="text-xl font-semibold leading-snug sm:text-2xl">
              Where should Jermell reach you?
            </legend>
            <p className="mt-2 text-sm text-foreground-muted">
              If your answers look like a fit, this is how you will hear about the free 15-minute
              intro call.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Your name
                <input
                  ref={(el) => {
                    focusRef.current = el;
                  }}
                  type="text"
                  autoComplete="name"
                  value={name}
                  maxLength={100}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  className={`${fieldClass} mt-1.5 font-normal`}
                />
              </label>
              <label className="block text-sm font-semibold">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  maxLength={200}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  className={`${fieldClass} mt-1.5 font-normal`}
                />
              </label>
              <label className="block text-sm font-semibold">
                Phone <span className="font-normal text-foreground-muted">(optional)</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  maxLength={40}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${fieldClass} mt-1.5 font-normal`}
                />
              </label>
              <label className="block text-sm font-semibold">
                LinkedIn <span className="font-normal text-foreground-muted">(optional)</span>
                <input
                  type="url"
                  autoComplete="url"
                  inputMode="url"
                  placeholder="linkedin.com/in/you"
                  value={linkedin}
                  maxLength={200}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className={`${fieldClass} mt-1.5 font-normal`}
                />
              </label>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-border-subtle bg-background p-4 text-sm">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (fieldError) setFieldError(null);
                }}
                className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
              />
              <span>
                I understand that Jermell&apos;s coaching is a <strong>paid service</strong>, and that
                this form requests a <strong>free 15-minute intro call</strong> to see if we are a
                fit. I consent to being contacted by Jermell about my request.
              </span>
            </label>
          </fieldset>
        )}

        {fieldError && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {fieldError}
          </p>
        )}
        {status === "error" && serverError && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {serverError}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span> Back
          </button>
        ) : (
          <span />
        )}

        {isContactStep ? (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : "Send my request"}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Next
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </form>
  );
}
