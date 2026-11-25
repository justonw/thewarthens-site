"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EVENT, firstName, type PublicView, type RsvpStatus } from "@/lib/birthday";

// The first thing on the page: type the name of every person in your party. Each name becomes a name tag as it is
// typed, then say yes, maybe, or no and give an email.

const STORE = "bd-rsvp-v1";
type Saved = { email: string; names: string[]; status: RsvpStatus };

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    return s && Array.isArray(s.names) && typeof s.email === "string" ? s : null;
  } catch {
    return null;
  }
}
function writeSaved(s: Saved) {
  try {
    localStorage.setItem(STORE, JSON.stringify(s));
  } catch {
    // The answer is already saved on our side; this only makes the form remember it on this phone.
  }
}

const TAGS = [
  { bar: "bg-[#7c3aed]", ring: "ring-[#7c3aed]/30" },
  { bar: "bg-[#e11d48]", ring: "ring-[#e11d48]/30" },
  { bar: "bg-[#c026d3]", ring: "ring-[#c026d3]/30" },
  { bar: "bg-[#f43f5e]", ring: "ring-[#f43f5e]/30" },
  { bar: "bg-[#6d28d9]", ring: "ring-[#6d28d9]/30" },
] as const;

function NameTag({ name, index }: { name: string; index: number }) {
  const t = TAGS[index % TAGS.length];
  return (
    <div className={`bd-pop overflow-hidden rounded-2xl bg-white text-center shadow-md ring-4 ${t.ring}`}>
      <div className={`${t.bar} px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white`}>Hello, I am</div>
      <div className="truncate px-3 py-3 font-[family-name:var(--font-bd-serif)] text-2xl font-semibold text-[#2e1065]">{name}</div>
    </div>
  );
}

function daysUntil(iso: string, now: number) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - now) / 86_400_000));
}

const label = (s: RsvpStatus) => (s === "yes" ? "Yes" : s === "maybe" ? "Maybe" : "No");

export default function RsvpParty({ initial }: { initial: PublicView }) {
  const [view, setView] = useState<PublicView>(initial);
  const [names, setNames] = useState<string[]>([""]);
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { status: RsvpStatus; names: string[]; emailed: boolean; email: string }>(null);
  const [remembered, setRemembered] = useState<Saved | null>(null);
  const [now, setNow] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/birthday", { cache: "no-store" });
      if (res.ok) setView((await res.json()) as PublicView);
    } catch {
      // The list just stays as it was.
    }
  }, []);

  // Runs once in the browser: restores this phone's earlier answer (it cannot be read while the page is built on the server).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNow(Date.now());
    const saved = readSaved();
    if (saved) {
      setRemembered(saved);
      setNames(saved.names.length ? saved.names : [""]);
      setStatus(saved.status);
      setEmail(saved.email);
    }
    void refresh();
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  }, [refresh]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const typed = useMemo(() => names.map((n) => n.trim()).filter(Boolean), [names]);
  const partySize = status === "no" ? Math.min(1, typed.length) : typed.length;
  const closed = view.closed;
  const cutoffDays = now ? daysUntil(EVENT.cutoffUtc, now) : null;

  const setName = (i: number, value: string) => setNames((prev) => prev.map((n, idx) => (idx === i ? value : n)));
  // A new box takes focus right away, so a guest can keep typing names one after another.
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const addName = () => {
    if (names.length >= 10) return;
    setNames((prev) => [...prev, ""]);
    setFocusIdx(names.length);
  };
  useEffect(() => {
    if (focusIdx === null) return;
    document.getElementById(`bd-name-${focusIdx}`)?.focus();
    setFocusIdx(null); // eslint-disable-line react-hooks/set-state-in-effect
  }, [focusIdx, names.length]);
  const removeName = (i: number) => setNames((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!typed.length) return setError("Please type your name first. We need the name of every person attending.");
    if (!status) return setError("Please choose Yes, Maybe, or No.");
    if (!email.trim()) return setError("Please add your email. We send your confirmation and reminders there.");
    setBusy(true);
    try {
      const res = await fetch("/api/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: typed, status, email: email.trim(), company_url: trap }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; emailed?: boolean };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      const saved: Saved = { email: email.trim().toLowerCase(), names: status === "no" ? typed.slice(0, 1) : typed, status };
      writeSaved(saved);
      setRemembered(saved);
      setDone({ status, names: saved.names, emailed: Boolean(data.emailed), email: saved.email });
      void refresh();
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="rsvp" className="scroll-mt-6">
      <style>{`
        @keyframes bd-pop { 0% { transform: scale(.7) rotate(-3deg); opacity: 0 } 70% { transform: scale(1.05) } 100% { transform: scale(1); opacity: 1 } }
        .bd-pop { animation: bd-pop .4s ease-out both }
        @media (prefers-reduced-motion: reduce) { .bd-pop { animation: none } }
      `}</style>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        {/* The form: every name first. */}
        <div className="overflow-hidden rounded-[2rem] border-2 border-[#7c3aed]/25 bg-white shadow-[0_24px_60px_-28px_rgba(109,40,217,0.55)]">
          <div className="bg-gradient-to-r from-[#7c3aed] via-[#c026d3] to-[#e11d48] px-6 py-4 text-white sm:px-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/90">RSVP · by {EVENT.cutoffLabel}</p>
            <p className="font-[family-name:var(--font-bd-serif)] text-2xl font-semibold sm:text-3xl">Tell us everyone who is attending</p>
          </div>

          <div className="p-6 sm:p-8">
            {done ? (
              <Done done={done} onChange={() => setDone(null)} />
            ) : closed ? (
              <div>
                <h2 className="font-[family-name:var(--font-bd-serif)] text-3xl font-semibold text-[#2e1065]">RSVPs are closed</h2>
                <p className="mt-3 text-[#5b4a6e]">The list closed on {EVENT.cutoffLabel}. If your plans changed, please contact Juston.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7c3aed]">Step 1 of 3</p>
                <h2 className="font-[family-name:var(--font-bd-serif)] text-3xl font-semibold leading-tight text-[#2e1065] sm:text-4xl">
                  Who will be <span className="text-[#e11d48]">attending?</span>
                </h2>
                <p className="mt-2 rounded-2xl bg-[#f3e8ff] px-4 py-3 text-base font-semibold text-[#4c1d95]">
                  List <u>every person</u> who will come, including yourself. Type one full name in each box, then tap &quot;Add another person&quot; for each additional guest.
                </p>

                {remembered && (
                  <p className="mt-4 rounded-xl bg-[#fff4d6] px-4 py-3 text-sm text-[#6b4a1a]">
                    You answered <b>{label(remembered.status)}</b> on this phone. You can change it below until {EVENT.cutoffLabel}.
                  </p>
                )}

                <ul className="mt-5 space-y-3">
                  {names.map((n, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span aria-hidden className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white ${i % 2 === 0 ? "bg-[#7c3aed]" : "bg-[#e11d48]"}`}>
                        {i + 1}
                      </span>
                      <label className="sr-only" htmlFor={`bd-name-${i}`}>
                        {i === 0 ? "Your name" : `Guest ${i + 1} name`}
                      </label>
                      <input
                        id={`bd-name-${i}`}
                        value={n}
                        onChange={(e) => setName(i, e.target.value)}
                        autoComplete={i === 0 ? "name" : "off"}
                        placeholder={i === 0 ? "Your name" : `Guest ${i + 1} name`}
                        maxLength={60}
                        className="h-14 w-full rounded-2xl border-2 border-[#d9c4f3] bg-[#fdfaff] px-4 text-lg text-[#2e1065] outline-none transition placeholder:text-[#a58fc4] focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/20"
                      />
                      {names.length > 1 && (
                        <button type="button" onClick={() => removeName(i)} aria-label={`Remove ${n || `guest ${i + 1}`}`} className="h-12 w-12 shrink-0 rounded-full text-2xl text-[#a58fc4] hover:bg-[#f3e8ff]">
                          ×
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {names.length < 10 && (
                  <button type="button" onClick={addName} className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e11d48]/60 bg-[#fff1f4] px-5 text-lg font-extrabold text-[#be123c] transition hover:bg-[#ffe1e8] sm:w-auto">
                    <span aria-hidden className="text-2xl leading-none">+</span> Add another person
                  </button>
                )}

                {typed.length > 0 && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-4 py-2 text-sm font-extrabold text-[#166534]">
                    <span aria-hidden>✓</span> {typed.length} {typed.length === 1 ? "person" : "people"} listed
                  </p>
                )}

                <fieldset className="mt-8">
                  <legend className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7c3aed]">Step 2 of 3 · Will you be there?</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Will you come?">
                    {(
                      [
                        ["yes", "Yes", "We're coming", "bg-[#16a34a] border-[#16a34a]"],
                        ["maybe", "Maybe", "Hoping to", "bg-[#f59e0b] border-[#f59e0b]"],
                        ["no", "No", "Can't make it", "bg-[#e11d48] border-[#e11d48]"],
                      ] as const
                    ).map(([v, big, small, on]) => (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={status === v}
                        onClick={() => setStatus(v)}
                        className={`min-h-[76px] rounded-2xl border-2 px-2 py-3 text-center transition ${
                          status === v ? `${on} text-white shadow-lg` : "border-[#d9c4f3] bg-[#fdfaff] text-[#2e1065] hover:border-[#7c3aed]"
                        }`}
                      >
                        <span className="block text-xl font-extrabold">{big}</span>
                        <span className="block text-xs opacity-90">{small}</span>
                      </button>
                    ))}
                  </div>
                  {status === "maybe" && <p className="mt-2 text-sm text-[#6b4a1a]">A maybe is welcome. Please make your final answer by {EVENT.cutoffLabel}.</p>}
                  {status === "no" && <p className="mt-2 text-sm text-[#6b4a1a]">Thank you for telling us. We will send one reminder before the list closes, in case your plans change.</p>}
                </fieldset>

                <div className="mt-8">
                  <label htmlFor="bd-email" className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#7c3aed]">
                    Step 3 of 3 · Your email
                  </label>
                  <input
                    id="bd-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    maxLength={200}
                    className="mt-2 h-14 w-full rounded-2xl border-2 border-[#d9c4f3] bg-[#fdfaff] px-4 text-lg text-[#2e1065] outline-none transition placeholder:text-[#a58fc4] focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/20"
                  />
                  <p className="mt-2 text-sm text-[#6b5a80]">
                    {status === "no" ? "We use it for one friendly reminder." : "We email your confirmation, then reminders five days before and the evening before."} Never shared or used for anything else.
                  </p>
                </div>

                {/* A field only a script would fill in. */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Company website
                    <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                  </label>
                </div>

                {status && typed.length > 0 && (
                  <p className="mt-6 rounded-2xl border-2 border-dashed border-[#7c3aed]/40 bg-[#faf5ff] px-4 py-3 text-[#2e1065]">
                    <b>Your RSVP:</b>{" "}
                    {status === "no" ? <>No, not attending ({typed[0]})</> : <>{label(status)} for <b>{typed.length} {typed.length === 1 ? "person" : "people"}</b>: {typed.join(", ")}</>}
                  </p>
                )}

                {error && (
                  <p role="alert" className="mt-5 rounded-xl border border-[#f3a8b8] bg-[#fff0f3] px-4 py-3 text-[#9f1239]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 min-h-16 w-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#c026d3] to-[#e11d48] px-6 text-xl font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(225,29,72,0.7)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Submit my RSVP"}
                </button>
                <p className="mt-3 text-center text-sm text-[#6b5a80]">
                  {cutoffDays === null ? `RSVP closes ${EVENT.cutoffLabel}.` : cutoffDays <= 0 ? "Last day to answer." : `RSVP closes ${EVENT.cutoffLabel} (${cutoffDays} ${cutoffDays === 1 ? "day" : "days"} left).`}
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Name tags for the party, and who is already coming. */}
        <div className="space-y-5 lg:sticky lg:top-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#f3e8ff] via-[#fdf2f8] to-[#ffe4e6] p-5 ring-2 ring-[#c026d3]/20 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c026d3]">Everyone you listed</p>
            <p className="font-[family-name:var(--font-bd-serif)] text-3xl font-semibold leading-tight text-[#2e1065]">
              {partySize === 0 ? "Your list shows up here" : partySize === 1 ? "1 person attending" : `${partySize} people attending`}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(done ? done.names : typed.slice(0, status === "no" ? 1 : 10)).map((n, i) => (
                <NameTag key={`${i}-${n}`} name={firstName(n)} index={i} />
              ))}
              {partySize === 0 && (
                <div className="col-span-2 rounded-2xl border-2 border-dashed border-[#c026d3]/40 px-4 py-8 text-center text-[#7c3aed]">
                  As you type names, a name tag appears here for each person.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#fff8e1] p-5 ring-2 ring-[#f59e0b]/40 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b45309]">Good to know</p>
            <p className="mt-1 text-[#6b4a1a]">
              We do not have a table reserved. We will all show up and pick a place to sit, so come ready to find open seats near each other.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Done({ done, onChange }: { done: { status: RsvpStatus; names: string[]; emailed: boolean; email: string }; onChange: () => void }) {
  const yes = done.status === "yes";
  const maybe = done.status === "maybe";
  return (
    <div>
      <p className="text-5xl" aria-hidden>
        {yes ? "🎉" : maybe ? "🤞" : "💌"}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-bd-serif)] text-3xl font-semibold leading-tight text-[#2e1065] sm:text-4xl">
        {yes ? `You're on the list, ${firstName(done.names[0])}!` : maybe ? `We'll hold a place, ${firstName(done.names[0])}` : `Thank you, ${firstName(done.names[0])}`}
      </h2>
      <p className="mt-3 text-lg text-[#5b4a6e]">
        {yes
          ? `${done.names.length === 1 ? "You are" : `All ${done.names.length} of you are`} on the list for Atiya's birthday lunch.`
          : maybe
            ? `We marked you as a maybe. Please make your final answer by ${EVENT.cutoffLabel}.`
            : `We will miss you. If your plans change before ${EVENT.cutoffLabel}, you can answer again.`}
      </p>
      <p className="mt-3 rounded-xl bg-[#f3e8ff] px-4 py-3 text-sm text-[#4c1d95]">
        {done.emailed ? (
          <>A confirmation is on its way to <b>{done.email}</b>. {yes ? "Reminders come five days before and the evening before." : "A reminder comes before the list closes."}</>
        ) : (
          <>Your answer is saved. The confirmation email could not be sent right now, so please keep this page or come back to it.</>
        )}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href="#details" className="inline-flex min-h-12 items-center rounded-full bg-[#7c3aed] px-6 font-bold text-white">See the plan</a>
        <button type="button" onClick={onChange} className="min-h-12 rounded-full border-2 border-[#e11d48] px-6 font-bold text-[#be123c] hover:bg-[#fff1f4]">
          Change my answer
        </button>
      </div>
    </div>
  );
}
