import EvidenceDropdown from "./EvidenceDropdown";

// The marketing parts of the Resume Builder page: the hero with a moving example, the stat band, the
// "how it works" steps, and the closing call to action. The animations are plain CSS (see globals.css)
// and switch off for visitors who ask for reduced motion.

const mark = { backgroundImage: "linear-gradient(#fde68a, #fde68a)", backgroundSize: "100% 100%" } as const;
const delay = (s: number) => ({ animationDelay: `${s}s` });

function Tick({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 ${className}`}>
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}

// A picture of what the tool does: the job asks for things, and the resume comes back speaking its language.
function HeroDemo() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:max-w-lg">
      <div className="rb-glow absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/25 via-violet-500/20 to-sky-400/20 blur-2xl" />

      <div className="rb-float relative mr-10 rounded-2xl border border-border-subtle bg-white p-4 shadow-xl sm:mr-16" style={{ ["--rb-tilt" as string]: "-2deg" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">The job asks for</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Follow-up", "Pipeline", "Customer-facing", "Salesforce"].map((w, i) => (
            <span key={w} className="rb-pop rounded-full bg-violet-600/10 px-3 py-1 text-xs font-semibold text-violet-700" style={delay(0.5 + i * 0.25)}>
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="rb-rise relative -mt-3 ml-6 rounded-2xl border border-border-subtle bg-white p-5 shadow-2xl sm:ml-14" style={delay(0.3)}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Your tailored resume</p>
          <span className="rounded-full bg-background-elevated-2 px-2 py-0.5 text-xs font-semibold text-foreground-muted">Example</span>
        </div>
        <div className="mt-3 h-3.5 w-40 rounded bg-foreground/85" />
        <p className="mt-2 text-sm font-semibold text-foreground">
          <span className="rb-mark rounded px-1" style={{ ...mark, animationDelay: "1.4s" }}>
            Account Executive
          </span>
        </p>
        <div className="mt-4 space-y-2.5 text-[13px] leading-snug text-foreground">
          <p>
            <span className="rb-mark rounded px-0.5" style={{ ...mark, animationDelay: "1.9s" }}>
              Followed up
            </span>{" "}
            on every catering lead within 24 hours, growing inquiries 30%.
          </p>
          <p>
            Built a steady{" "}
            <span className="rb-mark rounded px-0.5" style={{ ...mark, animationDelay: "2.3s" }}>
              pipeline
            </span>{" "}
            of repeat <span className="rb-mark rounded px-0.5" style={{ ...mark, animationDelay: "2.7s" }}>customer-facing</span> business.
          </p>
        </div>
        <ul className="mt-4 space-y-2 border-t border-border-subtle pt-3 text-xs font-medium">
          {["Job title matched", "Skills from the posting included", "Clean layout hiring software can read"].map((t, i) => (
            <li key={t} className="rb-pop flex items-center gap-2" style={delay(3.1 + i * 0.35)}>
              <Tick />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="rb-pop absolute -bottom-3 right-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg sm:right-8" style={delay(4.4)}>
        Ready to send
      </div>
    </div>
  );
}

const stats = [
  { big: "1.6 to 2.1x", small: "as many interviews or offers per application when the resume is tailored, in Huntr's data" },
  { big: "About 1 min", small: "from pasting your resume to downloading the new one" },
  { big: "2 free", small: "builds per email, each with an optional cover letter" },
];

// What one job link gets you, in plain words. These are the things the tool really does, in the order a person uses them.
const GET = [
  { title: "A resume matched to that job", body: "We rework your experience to line up with what the company is asking for in the job description. A cover letter too, if you want one." },
  { title: "A note for the hiring manager", body: "We write a short note to the recruiter or hiring manager, and a follow-up if you don't hear back. You copy it and send it yourself." },
  { title: "Help with application questions", body: "When an application asks a question, paste it in and get a draft answer from your real experience. You edit it and submit it." },
  { title: "Interview practice for that job", body: "Practice questions for that role, ideas for answering each from your own experience, and questions you can ask them." },
];
const EASY = ["Paste a link. We do the rest", "About a minute", "Download PDF and Word", "2 free builds"];

// The top of the page: a headline, one line, and a plain list of what one job link gets you and how easy it is, so a visitor
// sees the whole value before the tool. The moving example, the numbers, and the evidence come after the tool (see
// ResumeProof), for anyone who wants the reasons before they trust it.
export function ResumeHero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="rb-mesh pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl px-6 pb-6 pt-8 text-center sm:pt-12">
        <p className="rb-rise inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-foreground-muted shadow-sm backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="rb-ping absolute inline-flex h-full w-full rounded-full bg-green-500" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Resume Builder · About a minute
        </p>
        <h1 className="rb-rise text-balance mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl" style={delay(0.08)}>
          A resume <span className="rb-gradient-text">tailored</span> to the exact job you are applying for
        </h1>
        <p className="rb-rise mx-auto mt-4 max-w-xl text-balance text-base text-foreground-muted sm:text-lg" style={delay(0.16)}>
          Paste the link to the job. We rework your resume to match what the company is looking for, then help with the rest of the application.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-8">
        <p className="rb-rise text-center text-xs font-bold uppercase tracking-wider text-blue-700" style={delay(0.22)}>
          What you get from one job link
        </p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {GET.map((g, i) => (
            <li key={g.title} className="rb-rise flex items-center gap-3 rounded-2xl border border-border-subtle bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:items-start sm:py-4" style={delay(0.26 + i * 0.06)}>
              <span aria-hidden className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug">{g.title}</span>
                <span className="mt-1 hidden text-xs leading-snug text-foreground-muted sm:block">{g.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="rb-rise mt-5 text-center text-xs font-bold uppercase tracking-wider text-blue-700" style={delay(0.5)}>
          Easy by design
        </p>
        <ul className="rb-rise mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-foreground-muted" style={delay(0.54)}>
          {EASY.map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Tick className="h-4 w-4" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// The reasons to trust it: a picture of what the tool does, the numbers, and the evidence. Below the tool, not above it.
export function ResumeProof() {
  return (
    <section aria-label="Why tailoring works" className="relative overflow-hidden pb-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <HeroDemo />
        <div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((s, i) => (
              <li key={s.big} className="rb-rise rounded-2xl border border-border-subtle bg-white/80 p-5 text-center shadow-sm backdrop-blur lg:text-left" style={delay(0.1 + i * 0.1)}>
                <p className="rb-gradient-text text-3xl font-bold tracking-tight sm:text-4xl">{s.big}</p>
                <p className="mt-1.5 text-sm text-foreground-muted">{s.small}</p>
              </li>
            ))}
          </ul>
          <EvidenceDropdown />
        </div>
      </div>
    </section>
  );
}

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-6 w-6" };

const steps = [
  {
    title: "Add the job, then your resume",
    body: "Start with the link to the job you want. Then add your current resume: paste text, upload a file, or drop in a screenshot.",
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
        <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
      </svg>
    ),
  },
  {
    title: "We match it to that job",
    body: "Your real experience, reworded in the posting's language, in a layout hiring software reads cleanly. Add a cover letter and notes about yourself if you like.",
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z" />
        <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
      </svg>
    ),
  },
  {
    title: "Answer a few questions, then download",
    body: "If the job asks for something your resume doesn't show, our gap coach asks short, specific questions about your own experience and writes in what's true. Edit anything on the page, then download.",
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
        <path d="M4 20h16" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-16">
      <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Three steps. About a minute.</h2>
      <ol className="relative mt-8 grid gap-4 md:grid-cols-3">
        <div aria-hidden className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-blue-500/40 md:block" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative rounded-2xl border border-border-subtle bg-background-elevated p-6 text-center transition-shadow hover:shadow-lg">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md">{s.icon}</span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-blue-600">Step {i + 1}</p>
            <p className="mt-1 text-lg font-semibold">{s.title}</p>
            <p className="mt-2 text-sm text-foreground-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 px-6 py-12 text-center text-white sm:px-12">
        <div aria-hidden className="rb-glow pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
        <div aria-hidden className="rb-glow pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <h2 className="relative text-balance text-2xl font-bold tracking-tight sm:text-4xl">Your next application deserves its own resume.</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-balance text-base text-indigo-100">
          Two free builds. Takes about a minute. Everything in it comes from your real experience.
        </p>
        <a href="#start" className="rb-cta relative mt-7 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white">
          Build my tailored resume
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
