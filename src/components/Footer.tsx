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
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Tech Journey
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/tech"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Explore Tech Journey
              </Link>
              <Link
                href="/tech#quiz"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Take the Career Quiz
              </Link>
              <Link
                href="/tech#start-here"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Start Here, For Free
              </Link>
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/tech/guides/${g.slug}`}
                  className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                >
                  {g.title}
                </Link>
              ))}
              <Link
                href="/tech/coaching"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                1:1 Coaching with Jermell
              </Link>
              <Link
                href="/techjr"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Tech Journey Jr. (for kids)
              </Link>
              <Link
                href="/techjr/internet-safety-for-kids"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Internet safety for kids
              </Link>
              <Link
                href="/techjr/cool-tech-facts-for-kids"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Cool tech facts for kids
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Faith Journey
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/faith"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Explore Faith Journey
              </Link>
              <Link
                href="/faith/women-who-seek"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Women Who Seek
              </Link>
              <Link
                href="/faith/present-but-missing"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Present but Missing
              </Link>
              <Link
                href="/faith/topical-study/is-tithing-biblical"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Is Tithing Biblical?
              </Link>
              <Link
                href="/faith/topical-study/did-paul-wait-14-years-to-preach"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Did Paul Wait 14 Years to Preach?
              </Link>
              <Link
                href="/magnets"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Our Kids Swallowed Magnets
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Follow Along
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {socials.map((s) => {
                const isMailto = s.href.startsWith("mailto:");
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(!isMailto && { target: "_blank", rel: "noopener noreferrer" })}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <p className="mt-8 text-xs text-foreground-muted">
          Some links on this site are affiliate links. Some provide free
          content, while others offer paid opportunities that provide
          compensation for us, and some offer you discounts or incentives
          on their platforms.
        </p>
        <p className="mt-4 text-xs text-foreground-muted">
          © {new Date().getFullYear()} The Warthens. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
