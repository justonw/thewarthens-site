import Link from "next/link";
import { guides } from "@/lib/guides";
import ContactBand from "./ContactBand";

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
  { href: "https://www.tiktok.com/@thewarthens", label: "TikTok" },
  { href: "https://calendly.com/techjourneyinfo", label: "Book a Call" },
  { href: "mailto:info@thewarthens.com", label: "info@thewarthens.com" },
  { href: "https://www.linkedin.com/in/juston-warthen-96aa13167", label: "Juston's LinkedIn" },
  { href: "https://www.linkedin.com/in/atiya-warthen-4062881b0", label: "Atiya's LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle/80 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-12">
          <ContactBand />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold">The Warthens</p>
            <p className="mt-1 max-w-sm text-sm text-foreground-muted">
              Juston &amp; Atiya Warthen: career transitions and a faith
              journey, side by side.
            </p>
            <Link
              href="/about"
              className="mt-2 inline-block py-1.5 text-sm font-semibold text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              About us
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Tech Journey
            </p>
            <nav className="mt-3 flex flex-col">
              <Link
                href="/tech"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Explore Tech Journey
              </Link>
              <Link
                href="/tech#quiz"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Take the Career Quiz
              </Link>
              <Link
                href="/resume"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Resume Builder
              </Link>
              <Link
                href="/tech/start-here"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Start Here, For Free
              </Link>
              <Link
                href="/tech/guides"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Hype vs. Reality guides
              </Link>
              <Link
                href="/resume/keyword-matcher"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Free resume keyword scanner
              </Link>
              <Link
                href="/resume/guides"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Resume and cover letter guides
              </Link>
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/tech/guides/${g.slug}`}
                  className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
                >
                  {g.title}
                </Link>
              ))}
              <Link
                href="/tech/coaching"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                1:1 Coaching with Jermell
              </Link>
              <Link
                href="/techjr"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Tech Journey Jr. (for kids)
              </Link>
              <Link
                href="/techjr/internet-safety-for-kids"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Internet safety for kids
              </Link>
              <Link
                href="/techjr/cool-tech-facts-for-kids"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Cool tech facts for kids
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Faith Journey
            </p>
            <nav className="mt-3 flex flex-col">
              <Link
                href="/faith"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Explore Faith Journey
              </Link>
              <Link
                href="/faith/women-who-seek"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Women Who Seek
              </Link>
              <Link
                href="/faith/present-but-missing"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Present but Missing
              </Link>
              <Link
                href="/faith/topical-study/is-tithing-biblical"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Is Tithing Biblical?
              </Link>
              <Link
                href="/faith/topical-study/did-paul-wait-14-years-to-preach"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Did Paul Wait 14 Years to Preach?
              </Link>
              <Link
                href="/magnets"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Our Kids Swallowed Magnets
              </Link>
              <Link
                href="/jesus"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Why We Believe in Jesus
              </Link>
              <Link
                href="/source-of-life"
                className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
              >
                Source of Life
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Follow Along
            </p>
            <nav className="mt-3 flex flex-col">
              {socials.map((s) => {
                const isMailto = s.href.startsWith("mailto:");
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(!isMailto && { target: "_blank", rel: "noopener noreferrer" })}
                    className="py-1 text-sm text-foreground-muted transition-colors hover:text-foreground max-sm:py-2"
                  >
                    {s.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <p className="mt-8 text-sm text-foreground-muted">
          Going through something heavy? You don&apos;t have to carry it alone. In the U.S., you can call or text{" "}
          <a href="tel:988" className="font-semibold underline underline-offset-2 hover:text-foreground">
            988
          </a>{" "}
          any time to reach the Suicide &amp; Crisis Lifeline. We&apos;re not counselors, but we&apos;re glad you&apos;re here.
        </p>
        <p className="mt-4 text-xs text-foreground-muted">
          Some links on this site are affiliate links. Some provide free
          content, while others offer paid opportunities that provide
          compensation for us, and some offer you discounts or incentives
          on their platforms.
        </p>
        <p className="mt-4 text-xs text-foreground-muted">
          © {new Date().getFullYear()} Warthen Enterprise LLC. All rights reserved.
        </p>
        <nav aria-label="Legal" className="mt-2 flex flex-wrap gap-x-4 text-xs text-foreground-muted">
          <Link href="/privacy" className="py-1 underline-offset-2 hover:text-foreground hover:underline max-sm:py-2">
            Privacy
          </Link>
          <Link href="/terms" className="py-1 underline-offset-2 hover:text-foreground hover:underline max-sm:py-2">
            Terms
          </Link>
          <Link href="/refunds" className="py-1 underline-offset-2 hover:text-foreground hover:underline max-sm:py-2">
            Refunds
          </Link>
        </nav>
      </div>
    </footer>
  );
}
