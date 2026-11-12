import Link from "next/link";
import CopyEmailButton from "./CopyEmailButton";

export const CONTACT_EMAIL = "info@thewarthens.com";

// A big, hard-to-miss contact block. Sits at the top of the footer, so it shows on every page.
export default function ContactBand() {
  return (
    <section
      aria-labelledby="contact-band-heading"
      className="relative overflow-hidden rounded-3xl text-white shadow-xl shadow-purple-950/15"
      style={{
        backgroundImage:
          "radial-gradient(60% 130% at 8% 0%, rgba(147,51,234,0.5), transparent), radial-gradient(50% 120% at 100% 100%, rgba(59,130,246,0.35), transparent), linear-gradient(135deg, #14104a, #241b72 55%, #3b1d86)",
      }}
    >
      <div className="relative flex flex-col gap-7 p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
            Contact us
          </p>
          <h2 id="contact-band-heading" className="mt-2 text-2xl font-semibold sm:text-3xl">
            Questions? We&apos;d love to hear from you.
          </h2>
          <p className="mt-3 text-purple-100">Email us anytime at</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-1 block whitespace-nowrap text-xl font-semibold text-white underline underline-offset-4 hover:text-purple-100 sm:text-2xl"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-900 shadow-lg transition-colors hover:bg-purple-50"
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
            className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          />
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full px-3 py-3 text-sm font-semibold text-purple-100 underline underline-offset-4 hover:text-white"
          >
            More ways to reach us
          </Link>
        </div>
      </div>
    </section>
  );
}
