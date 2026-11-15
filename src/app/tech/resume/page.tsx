import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ResumeTailor from "@/components/ResumeTailor";
import CoachingCallout from "@/components/coaching/CoachingCallout";

const title = "Tailor Your Resume to Any Job (2 Free) | The Warthens";
const description =
  "Upload or paste your resume and a job posting (or just its link). Get a tailored, scanner-friendly resume as a PDF and Word file, built only from your real experience. First 2 are free.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "tailor resume to job posting",
    "ats friendly resume",
    "resume for career change",
    "free resume tailoring tool",
    "resume keywords job description",
    "career change resume",
  ],
  alternates: { canonical: "/tech/resume" },
  openGraph: { title, description, url: "/tech/resume" },
  twitter: { card: "summary_large_image", title, description },
};

const steps = [
  {
    title: "Add two things",
    body: "Your current resume and the job posting you want. Paste text, upload a file, drop in a screenshot, or paste the posting's link. No quiz, no account.",
  },
  {
    title: "We rewrite it for that job",
    body: "Your real experience, reordered and reworded in the posting's language, in a one-column layout that hiring software reads cleanly.",
  },
  {
    title: "Check, edit, download",
    body: "Fix anything you like right on the page, see how it scores on our checklist, then download a PDF and a Word file.",
  },
];

const faq = [
  {
    question: "Will it make things up to match the job?",
    answer:
      "No. It only rewords and reorders what's already in your resume. If the posting asks for something your resume doesn't show, it lists that separately as something to add only if it's true, and leaves it out of the resume.",
  },
  {
    question: "What can I upload or paste?",
    answer:
      "For your resume: a PDF, a Word (.docx) file, a text file, a screenshot or photo, or pasted text. For the job posting: all of those, or paste a link to the posting. Some job sites, like LinkedIn and Indeed, don't let us read their pages from a link. If that happens, we'll tell you, and you can paste the text or drop in a screenshot instead. Files can add up to about 4 MB per try, and pictures are shrunk automatically.",
  },
  {
    question: "Why not just paste this into ChatGPT?",
    answer:
      "You can. This does the parts a chat window doesn't: it asks nothing of you but your resume and the posting (as text, files, screenshots, or a link), builds a finished PDF and Word file in a layout made for hiring software, and checks the result against the same checklist we teach on Tech Journey.",
  },
  {
    question: "Who sees my resume?",
    answer:
      "Your resume and the posting, including any files or screenshots, are sent to an AI service (Anthropic's Claude) to be rewritten. The finished resume is built in your browser, so you can edit and download it right there. We use your email to count your free tries.",
  },
  {
    question: "What do I get for free?",
    answer:
      "Two tailored resumes per email address. Editing and downloading a resume you've built is always free. Each rewrite costs us real money to run, which is why there's a limit.",
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
      name: "Resume Tailoring Tool",
      url: "https://thewarthens.com/tech/resume",
      description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        { "@type": "ListItem", position: 1, name: "Tech Journey", item: "https://thewarthens.com/tech" },
        { "@type": "ListItem", position: 2, name: "Resume tool", item: "https://thewarthens.com/tech/resume" },
      ],
    },
  ],
};

export default function ResumePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center sm:pt-24">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Tech Journey</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your resume, tailored to the job
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-foreground-muted">
            Add your resume and a job posting, by pasting, uploading, or dropping in a screenshot. Get back a finished resume built only from your real experience, as a PDF and a Word file. Your first 2 are free.
          </p>
          <p className="mt-4 text-sm text-foreground-muted">
            Changing careers? Start with the{" "}
            <Link href="/tech#checklist" className="font-semibold text-blue-600 underline underline-offset-2">
              resume checklist
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-12">
        <ResumeTailor />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14">
        <Reveal>
          <h2 className="text-xl font-semibold sm:text-2xl">How it works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border-subtle bg-background-elevated p-5">
                <span className="text-sm font-semibold text-blue-600">Step {i + 1}</span>
                <p className="mt-1 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-foreground-muted">{s.body}</p>
              </li>
            ))}
          </ol>
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

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <p className="mb-4 text-sm text-foreground-muted">
            Applying now? Keep track of every application with the free{" "}
            <Link href="/tech#tracker" className="font-semibold text-blue-600 underline underline-offset-2">
              job tracker
            </Link>
            .
          </p>
          <CoachingCallout from="resume-tool" />
        </Reveal>
      </section>
    </main>
  );
}
