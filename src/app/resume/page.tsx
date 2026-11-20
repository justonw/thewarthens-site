import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import CoachingCallout from "@/components/coaching/CoachingCallout";
import FieldExplorer from "@/components/resume/FieldExplorer";
import { FinalCta, HowItWorks, ResumeHero, ResumeProof } from "@/components/resume/ResumeLanding";
import { resumeGuides } from "@/lib/resume-guides";

// The title and description are written for the search results page: under about 60 and 160 characters, with the
// words people type ("tailor resume to job description") near the front.
const title = "Tailor Your Resume to a Job Description | The Warthens";
const description =
  "Add your resume and a job posting. Get a tailored resume and matching cover letter as PDF and Word in about a minute, built only from your real experience.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "resume builder",
    "tailor resume to job posting",
    "ats friendly resume",
    "cover letter generator",
    "resume for career change",
    "resume keywords job description",
    "career change resume",
    "tailor resume to job description",
    "ai resume tailor",
    "resume and cover letter generator",
    "ats resume",
  ],
  alternates: { canonical: "/resume" },
  openGraph: { title, description, url: "/resume" },
  twitter: { card: "summary_large_image", title, description },
};

const faq = [
  {
    question: "What if I don't have a resume?",
    answer:
      "Choose \"I'm starting from scratch.\" Add your name and contact details, then tell us about your work, school, and skills. You can type it or tap the microphone and talk. We write a resume from what you say, and we only use what you tell us. If something is missing, such as dates or results, we'll tell you what to add to make it stronger.",
  },
  {
    question: "Does tailoring really get more interviews?",
    answer:
      "The evidence points the same way, and we want to be straight about how strong it is. In Huntr's data, tailored resumes turned into interviews or offers about 1.6 to 2.1 times as often as generic ones: 5.75% against 2.68% in one report, and 5.8% against 3.73% in its full-year 2025 report. Jobscan found that resumes whose title matched the posting had an interview rate 10.6 times higher, and in its survey of 384 recruiters, 55.3% said they value resumes tailored to the job description. Those numbers come from job-search companies and from what users reported, not from controlled experiments, and we found no independent randomized study of resume tailoring. So we don't promise a number. Tailoring is the best-supported thing you can do, and the sources are listed under \"See the evidence\" at the top of this page.",
  },
  {
    question: "Does it work for my field?",
    answer:
      "Yes. It works for any industry and any job, because it builds from your own resume, the notes you add, and the posting, matched to what the posting asks for. It isn't guessing what your field expects. A few things have their own formats: federal government resumes, academic CVs, and acting or creative resumes follow special rules, so treat the result as a draft there. Everything else, from healthcare and trades to teaching, finance, retail, and tech, fits the one-column layout we use.",
  },
  {
    question: "Will it make things up to match the job?",
    answer:
      "No. It only rewords and reorders what's in your resume and in the notes you add. If the posting asks for something neither shows, it lists that separately and leaves it out. If you do have it, tap \"I have this\" and tell us in a sentence, and we'll add it in your words.",
  },
  {
    question: "What can I upload or paste?",
    answer:
      "For your resume: a PDF, a Word (.docx) file, a text file, a screenshot or photo, or pasted text. For the job posting: all of those, or paste a link to the posting. Some job sites, like LinkedIn and Indeed, don't let us read their pages from a link. If that happens, we'll tell you, and you can paste the text or drop in a screenshot instead. Files can add up to about 4 MB per build, and pictures are shrunk automatically.",
  },
  {
    question: "What does the cover letter look like?",
    answer:
      "A one-page business letter, three or four short paragraphs: why this role and company, two or three real examples from your experience matched to what the posting asks for, and a short close. It's written in plain, direct language and addressed to the hiring manager if you give a name. You can edit every line, then download it as a PDF or Word file or copy the text.",
  },
  {
    question: "Why not just paste this into ChatGPT?",
    answer:
      "You can. This does the parts a chat window doesn't: it asks nothing of you but your resume and the posting (as text, files, screenshots, or a link), builds finished PDF and Word files in a layout made for hiring software, checks the result against the same checklist we teach on Tech Journey, and lets you fill in gaps with one tap.",
  },
  {
    question: "Who sees my resume?",
    answer:
      "Your resume and the posting, including any files or screenshots, are sent to an AI service (Anthropic's Claude) to write your documents. The finished files are built in your browser, so you can edit and download them right there. We use your email to count your free builds.",
  },
  {
    question: "What do I get for free?",
    answer:
      "Two builds per email address. A build is a tailored resume, plus a cover letter if you want one. Editing, downloading, and \"I have this\" updates are included. Each build costs us real money to run, which is why there's a limit.",
  },
  {
    question: "Will it remember my resume for next time?",
    answer:
      "Yes, in your own browser on this device. When you come back, tap \"Use my saved info\" and you can tailor for a new job in seconds. You can clear it any time. A resume uploaded as a very large file may not be remembered, so paste the text if you want it saved.",
  },
  {
    question: "Is this layout right for a career change?",
    answer:
      "Yes. It puts your target job title and a short summary at the top, skills right under that, and your experience below in reverse order. That combination layout is what we recommend in our resume checklist for people changing fields.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Resume Builder",
      url: "https://thewarthens.com/resume",
      description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      dateModified: "2026-11-16",
      inLanguage: "en",
      featureList: [
        "Tailors a resume to a specific job posting without adding experience you do not have",
        "Writes a matching cover letter",
        "Accepts a resume as a PDF, Word file, screenshot, or pasted text, and a posting as text, a file, a screenshot, or a link",
        "Downloads as PDF and Word, in a one-column layout that hiring software reads cleanly",
        "Explains every change it made and why",
        "Runs a seven-point resume check as you edit",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "The first 2 builds per email address are free." },
      publisher: { "@type": "Organization", name: "The Warthens", url: "https://thewarthens.com" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
        { "@type": "ListItem", position: 2, name: "Resume Builder", item: "https://thewarthens.com/resume" },
      ],
    },
  ],
};

export default function ResumePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ResumeHero />

      <section id="start" className="group/start relative scroll-mt-20 px-6 pb-16">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-[70%] max-w-5xl rounded-[3rem] bg-gradient-to-b from-blue-500/5 via-violet-500/5 to-transparent" />
        <div className="mx-auto max-w-5xl">
          {/* "Start here" only makes sense on the form. The builder sets data-phase on this section, and the intro hides while it is building and on the result. */}
          <div className="mx-auto mb-6 max-w-3xl text-center group-data-[phase=loading]/start:hidden group-data-[phase=result]/start:hidden">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Start here</h2>
            <p className="mt-2 text-sm text-foreground-muted">Add the job you want, then your resume. Everything else is optional.</p>
          </div>
          <ResumeBuilder />
        </div>
      </section>

      <ResumeProof />

      <HowItWorks />

      <section id="programs" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-14">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">Exploring a new field?</h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Look around. Each field has what the job is like, typical entry-level pay, our free guide, and the programs we work with if you want to build skills.
          </p>
          <div className="mt-5">
            <FieldExplorer />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">Quick answers</h2>
          <div className="mt-5 space-y-3">
            {faq.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-border-subtle bg-background-elevated">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
                  {f.question}
                  <span aria-hidden className="shrink-0 text-sm text-foreground-muted transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm text-foreground-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">Resume and cover letter guides</h2>
          <p className="mt-2 text-sm text-foreground-muted">Want to understand the why? Short, sourced guides to the parts of an application that people get stuck on.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {resumeGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/resume/guides/${g.slug}`} className="block h-full rounded-2xl border border-border-subtle bg-background-elevated p-4 transition-colors hover:border-blue-500/50">
                  <span className="font-semibold text-blue-700">{g.short}</span>
                  <span className="mt-1 block text-sm text-foreground-muted">{g.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/resume/keyword-matcher" className="mt-4 block rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 transition-colors hover:border-blue-500/60">
            <span className="font-semibold text-blue-700">Free resume keyword scanner</span>
            <span className="mt-1 block text-sm text-foreground-muted">Just want to see what your resume is missing? Paste it with a job posting and check, no sign-up.</span>
          </Link>
        </Reveal>
      </section>

      <FinalCta />

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <p className="mb-4 text-sm text-foreground-muted">
            New to changing careers? Start with the{" "}
            <Link href="/tech#checklist" className="font-semibold text-blue-600 underline underline-offset-2">
              resume checklist
            </Link>
            , and keep track of every application with the free{" "}
            <Link href="/tech#tracker" className="font-semibold text-blue-600 underline underline-offset-2">
              job tracker
            </Link>
            .
          </p>
          <CoachingCallout from="resume-builder" />
        </Reveal>
      </section>
    </div>
  );
}
