"use client";

// Step 1 when someone has no specific job yet: the kind of role they are aiming for. It stands where the job box
// normally is, and says plainly that a resume written for one real posting is the stronger one, so the main product stays
// the main product.

const EXAMPLES = ["Customer Success Manager", "Project Manager", "Registered Nurse", "Software Developer", "Warehouse Supervisor", "Teacher"];

export default function GeneralTarget({ value, onChange, done, onBack }: { value: string; onChange: (value: string) => void; done: boolean; onBack: () => void }) {
  return (
    <div className="h-full rounded-3xl border border-border-subtle bg-white p-5 shadow-lg shadow-blue-900/5 transition-all focus-within:border-blue-500/40 focus-within:shadow-xl sm:p-6">
      <div className="flex items-center gap-3">
        <span aria-hidden className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm transition-colors ${done ? "bg-green-600" : "bg-gradient-to-br from-blue-600 to-violet-600"}`}>
          {done ? "✓" : 1}
        </span>
        <h2 className="text-lg font-bold tracking-tight">What are you applying for?</h2>
      </div>
      <p className="mt-1.5 text-sm text-foreground-muted sm:pl-12">A resume built for one real job is what works best. Paste that job&apos;s link, or tell us the kind of role if you don&apos;t have one yet.</p>
      <div className="mt-4 sm:pl-12">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-left text-white shadow-lg shadow-blue-600/25 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
        >
          <span>
            <span className="block text-sm font-bold sm:text-base">I have a job. Tailor my resume to it</span>
            <span className="mt-0.5 block text-xs text-white/85">Paste the job link. This is where it works best.</span>
          </span>
          <span aria-hidden className="text-xl">→</span>
        </button>
        <p className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          <span aria-hidden className="h-px flex-1 bg-border-subtle" />
          No job yet?
          <span aria-hidden className="h-px flex-1 bg-border-subtle" />
        </p>
        <label htmlFor="rt-target" className="mt-3 block text-sm font-semibold">
          The kind of role you want
        </label>
        <p className="mt-0.5 text-xs text-foreground-muted">We&apos;ll build a strong general resume for it. When you find a real posting, you can tailor it to that job in one step.</p>
        <input
          id="rt-target"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 120))}
          placeholder="For example: Customer Success Manager"
          autoComplete="off"
          className="mt-2 w-full rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" onClick={() => onChange(example)} className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs transition-colors hover:border-blue-500/40">
              {example}
            </button>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-violet-500/10 px-3 py-2 text-xs text-foreground-muted">
          A resume matched to one job description tends to do better than a general one, though no one can promise a result. A general resume is a good start. The tailored one is the one to send.
        </p>
      </div>
    </div>
  );
}
