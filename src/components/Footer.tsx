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
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold">The Warthens</p>
            <p className="mt-1 max-w-sm text-sm text-foreground-muted">
              Juston &amp; Atiya Warthen: career transitions and a faith
              journey, side by side.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
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
