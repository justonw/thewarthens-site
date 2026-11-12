import type { Metadata } from "next";
import Link from "next/link";
import CopyEmailButton from "@/components/CopyEmailButton";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/components/ContactBand";

const title = "Contact | The Warthens";
const description =
  "Email The Warthens at info@thewarthens.com with questions about our videos, Tech Journey, Faith Journey, Tech Jr., or 1:1 coaching.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact" },
  twitter: { card: "summary_large_image", title, description },
};

const reasons = [
  {
    title: "Questions about a video or resource",
    body: "Stuck on something from Tech Journey or Faith Journey, or want to know where to start? Send us a note.",
  },
  {
    title: "Career change and coaching",
    body: "Thinking about a move into tech? Ask us anything, or look at 1:1 coaching with Jermell.",
    href: "/tech/coaching",
    cta: "See 1:1 coaching",
  },
  {
    title: "Suggest a video or topic",
    body: "Tell us what you would like us to cover next. We read the ideas and they shape what we make.",
  },
  {
    title: "Anything else",
    body: "Feedback, a correction, or just saying hello. We would be glad to hear from you.",
  },
];

const socials = [
  { href: "https://youtube.com/@thewarthens?si=hMA8NuKtm0vox8X4", label: "YouTube: Tech Journey" },
  {
    href: "https://www.youtube.com/channel/UCJj_ar9Gs8YvcYK6jSh9a6g",
    label: "YouTube: Faith Journey",
  },
  {
    href: "https://www.instagram.com/thewarthens?igsh=MWVnbTRsOWsyc3M4bg%3D%3D&utm_source=qr",
    label: "Instagram",
  },
  { href: "https://www.tiktok.com/@techjourneyyoutube?_t=8oaopXMHjKg&_r=1", label: "TikTok" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact The Warthens",
  url: "https://thewarthens.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "The Warthens",
    url: "https://thewarthens.com",
    email: CONTACT_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
    },
  },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 40% at 50% 0%, rgba(147,51,234,0.12), transparent), radial-gradient(40% 30% at 90% 10%, rgba(59,130,246,0.08), transparent)",
        }}
      />
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center sm:pt-24">
        <p className="inline-flex items-center rounded-full border border-purple-600/25 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
          Contact
        </p>
        <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-foreground-muted">
          The easiest way to reach us is email. Write to us about anything, and we&apos;ll do our
          best to get back to you.
        </p>

        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-purple-600/20 bg-background-elevated p-8 shadow-lg shadow-purple-900/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Our email
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 block break-all text-2xl font-semibold tracking-tight text-foreground hover:text-purple-700 sm:text-3xl"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20the%20website`}
              className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-7 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-purple-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              Email us
            </a>
            <CopyEmailButton
              email={CONTACT_EMAIL}
              className="inline-flex items-center rounded-full border border-purple-600/40 px-7 py-3 text-sm font-semibold text-purple-800 transition-colors hover:bg-purple-600/10"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <h2 className="text-center text-xl font-semibold sm:text-2xl">What to write to us about</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <div className="h-full rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-all hover:-translate-y-0.5 hover:border-purple-600/30 hover:shadow-lg hover:shadow-purple-900/5">
                <p className="text-lg font-semibold leading-snug">{r.title}</p>
                <p className="mt-2 text-sm text-foreground-muted">{r.body}</p>
                {r.href && (
                  <Link
                    href={r.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700 hover:underline"
                  >
                    {r.cta}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">
              Or find us here
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border-subtle bg-background-elevated px-5 py-2.5 text-sm font-semibold transition-colors hover:border-purple-600/40 hover:text-purple-700"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
