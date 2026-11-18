import Image from "next/image";
import Link from "next/link";
import HeaderNav from "./HeaderNav";

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
          <span className="hidden text-lg font-semibold tracking-tight lg:inline">
            The Warthens
          </span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
