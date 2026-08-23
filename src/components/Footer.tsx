import Link from "next/link";
import { guides } from "@/lib/guides";

const socials = [
  { href: "https://youtube.com/@thewarthens?si=hMA8NuKtm0vox8X4", label: "YouTube" },
  {
    href: "https://www.instagram.com/thewarthens?igsh=MWVnbTRsOWsyc3M4bg%3D%3D&utm_source=qr",
    label: "Instagram",
  },
  { href: "https://www.tiktok.com/@techjourneyyoutube?_t=8oaopXMHjKg&_r=1", label: "TikTok" },
  { href: "https://calendly.com/techjourneyinfo", label: "Book a Call" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle/80 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold">The Warthens</p>
            <p className="mt-1 max-w-sm text-sm text-foreground-muted">
              Juston &amp; Atiya Warthen: career transitions and a faith
              journey, side by side.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Career Guides
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/tech#quiz"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Take the Career Quiz
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
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Follow Along
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
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
