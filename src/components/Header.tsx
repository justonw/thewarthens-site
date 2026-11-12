import Image from "next/image";
import Link from "next/link";

const links = [
  // On phones the logo already goes home, so this makes room for the coaching link.
  { href: "/", label: "Home", short: "Home", wideOnly: true },
  { href: "/tech", label: "Tech Journey", short: "Tech", wideOnly: false },
  { href: "/techjr", label: "Tech Jr.", short: "Tech Jr.", wideOnly: false },
  { href: "/faith", label: "Faith Journey", short: "Faith", wideOnly: false },
  { href: "/tech/coaching", label: "1:1 Coaching", short: "Coaching", wideOnly: false },
  // A filled button on every screen size. Phone labels above are short so all five fit.
  { href: "/contact", label: "Contact", short: "Contact", wideOnly: false, cta: true },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 min-[360px]:px-4 sm:px-6 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/brand/icon-square.png"
            alt="The Warthens"
            width={32}
            height={32}
            className="rounded-md sm:h-9 sm:w-9"
            priority
          />
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            The Warthens
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                link.cta
                  ? "ml-0.5 bg-purple-700 px-2.5 font-semibold min-[360px]:ml-1 min-[360px]:px-3 text-white shadow-sm hover:bg-purple-800"
                  : "px-1 text-foreground-muted min-[360px]:px-1.5 hover:bg-background-elevated hover:text-foreground"
              } ${link.wideOnly ? "hidden sm:inline-block" : ""}`}
            >
              <span className="sm:hidden">{link.short}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
