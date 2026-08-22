import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/tech", label: "Tech Journey" },
  { href: "/faith", label: "Faith Journey" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
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
              className="whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-medium text-foreground-muted transition-colors hover:bg-background-elevated hover:text-foreground sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
