import type { Metadata } from "next";
import Link from "next/link";
import KeywordMatcher from "@/components/resume/KeywordMatcher";
import Reveal from "@/components/Reveal";
import { resumeGuides } from "@/lib/resume-guides";

const SITE = "https://thewarthens.com";
const path = "/resume/keyword-matcher";
const UPDATED = "2026-11-16";
const title = "Free Resume Keyword Scanner | The Warthens";
const description = "Paste your resume and a job posting to see which key phrases you already have and which are missing. Free, instant, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["resume keyword scanner", "resume keyword checker", "resume keyword matcher", "match resume to job description", "resume keywords from job posting", "free resume scanner"],
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const faq = [
  {
    question: "Is this the same as an ATS score?",
    answer:
      "No. Applicant tracking systems differ, and the companies that make them do not publish how they rank people. This tool does something simpler and more honest: it finds the phrases a posting repeats or names, and checks whether your resume uses the same wording. Many hiring teams search resumes for words from the posting, so matching the wording is worth doing, but a percentage here is a to-do list and not a prediction.",
  },
  {
    question: "Should I add every missing keyword to my resume?",
    answer:
      "No. Add a phrase only if it describes work you really did. A resume that claims skills you do not have may get you an interview you cannot handle, and recruiters notice. For a phrase you truly have but worded differently, switch to the posting's wording. For one you do not have, leave it out and be ready to say how you would learn it.",
  },
  {
    question: "Why does it show company names or cities?",
    answer:
      "The tool reads the posting as plain text, so a company name, a city or a product name can look like a key phrase. Press the × on any phrase that does not describe the work, and it disappears from your list.",
  },
  {
    question: "What does \"the words are there, but not as this phrase\" mean?",
    answer:
      "Your resume uses every word of the phrase, just not together. A posting that asks for \"customer success\" and a resume that mentions \"customers\" and \"success\" in different sentences is a good example. If the phrase describes what you did, using it exactly makes the match clear to a person and to software.",
  },
  {
    question: "Does it cost anything?",
    answer: "No. It is free and you do not need to make an account. If you want the changes written for you, the Resume Builder does that and also writes a matching cover letter.",
  },
];

export default function KeywordMatcherPage() {
  const url = `${SITE}${path}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Resume Keyword Scanner",
        url,
        description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        dateModified: UPDATED,
        inLanguage: "en",
        featureList: ["Finds the key phrases in a job posting", "Shows which phrases your resume already has", "Flags phrases whose words are present but not together", "Counts how often the posting uses each phrase"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "The Warthens", url: SITE },
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
          { "@type": "ListItem", position: 2, name: "Resume Builder", item: `${SITE}/resume` },
          { "@type": "ListItem", position: 3, name: "Keyword Scanner", item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      },
    ],
  };

  const guides = resumeGuides.filter((g) => ["tailor-resume-to-job-description", "ats-friendly-resume"].includes(g.slug));

  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-12 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/resume" className="hover:text-foreground">
              Resume Builder
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            Keyword scanner
          </li>
        </ol>
      </nav>

      <Reveal>
        <p className="mt-8 inline-flex rounded-full border border-blue-600/25 bg-blue-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">Free tool</p>
        <h1 className="text-balance mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Free resume keyword scanner</h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground-muted">
          Hiring teams and their software often look for the words a posting uses. Paste your resume and the job posting, and see which key phrases you already have, which are missing, and which are almost there.
        </p>
      </Reveal>

      <div className="mt-10">
        <KeywordMatcher />
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold sm:text-3xl">How to use your results</h2>
        <ol className="mt-6 space-y-5">
          {[
            { t: "Start with the amber list", d: "These are phrases the posting uses that your resume does not. The ones used most often matter most." },
            { t: "Keep only what is true", d: "For each phrase, ask: did I do this? If yes, find the bullet that proves it and reword it using the posting's phrase. If no, skip it." },
            { t: "Fix the almost-there phrases", d: "When the words are on your resume but not together, joining them into the exact phrase is often the easiest, honest win." },
            { t: "Read it out loud", d: "A person reads your resume next. If a sentence sounds stuffed with buzzwords, say it the way you would to a colleague." },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-foreground-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold sm:text-3xl">How the scanner works</h2>
        <div className="mt-4 space-y-4 text-foreground-muted">
          <p>
            It reads the posting, drops filler like &ldquo;strong&rdquo;, &ldquo;experience&rdquo; and &ldquo;team player&rdquo;, and looks at the words and short phrases that are left. A phrase makes the list when the posting repeats it, or when it is a named skill, a tool, an acronym, or part of the job title. Then it checks your resume for the same phrase, ignoring small differences like &ldquo;manage&rdquo; and &ldquo;managed&rdquo;.
          </p>
          <p>
            It also knows a few common short forms, so &ldquo;CRM&rdquo; in your resume counts for &ldquo;customer relationship management&rdquo; in the posting. It will miss some things and flag some things that do not matter, which is why every phrase can be hidden. Think of it as a second pair of eyes, not a judge.
          </p>
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold sm:text-3xl">Common questions</h2>
        <div className="mt-6 space-y-3">
          {faq.map((f) => (
            <details key={f.question} className="group rounded-2xl border border-border-subtle bg-background-elevated">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
                {f.question}
                <span aria-hidden className="shrink-0 text-sm text-foreground-muted transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <p className="px-5 pb-5 text-foreground-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold sm:text-2xl">Keep reading</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {guides.map((r) => (
            <li key={r.slug}>
              <Link href={`/resume/guides/${r.slug}`} className="block h-full rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-500/50">
                <span className="font-semibold text-blue-700">{r.short}</span>
                <span className="mt-1 block text-sm text-foreground-muted">{r.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
