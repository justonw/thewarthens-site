import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Women Who Seek | The Warthens",
  description:
    "Women Who Seek: a community of women finding Jesus in the Scriptures. Hosted by Atiya Warthen.",
};

const ZOOM_LINK =
  "https://us06web.zoom.us/j/84219780543?pwd=QH05EYCRiT5XFeOa5UybiNH0tK9ssX.1";

function Verse({ children, citation }: { children: React.ReactNode; citation: string }) {
  return (
    <Reveal className="mx-auto max-w-xl text-center">
      <p className="text-balance text-lg italic text-foreground-muted">
        &ldquo;{children}&rdquo;
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-rose-700">
        {citation}
      </p>
    </Reveal>
  );
}

export default function WomenWhoSeekPage() {
  return (
    <>
      <div className="border-b border-border-subtle/60 bg-background-elevated/30">
        <div className="mx-auto max-w-5xl px-6 py-3 text-sm text-foreground-muted">
          <Link href="/faith" className="hover:text-foreground">
            Faith Journey
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Women Who Seek</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(190,90,70,0.12), transparent)",
          }}
        />
        <Reveal className="mx-auto max-w-3xl px-6 pt-16 pb-14 text-center sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-700">
            A Community of Women
          </p>
          <h1 className="text-balance mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Women Who Seek
          </h1>
          <p className="mt-2 text-xl italic text-rose-700">
            Finding Jesus in the Scriptures
          </p>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-foreground-muted">
            Wherever you are in your journey with Jesus, you are welcome
            here. Hosted by Atiya Warthen.
          </p>
        </Reveal>
        <div className="mx-auto max-w-3xl px-6 pb-16">
          <Verse citation="Matthew 6:33 · NLT">
            Seek the Kingdom of God above all else, and live righteously, and
            he will give you everything you need.
          </Verse>
        </div>
      </section>

      {/* Who We Are */}
      <section className="border-t border-border-subtle bg-background-elevated/30">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-700">
              Who We Are
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Seeking Jesus Together
            </h2>
            <p className="mt-4 text-foreground-muted">
              We are women seeking Jesus together, whether you&apos;ve known
              Him for years or are just beginning. We gather to encourage
              one another, grow in God&apos;s Word, and seek Christ. You are
              welcome here.
            </p>
            <p className="mt-4 text-sm italic text-foreground-muted">
              &ldquo;Jesus can be found throughout every passage of the
              Bible. We are on a journey to seek Him together.&rdquo;
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-rose-700">
              The Heart of Our Community
            </p>
          </Reveal>
          <Reveal delay={150} className="overflow-hidden rounded-3xl border border-border-subtle">
            <Image
              src="/women-who-seek/praying.png"
              alt="Woman praying with an open Bible"
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
        <div className="mx-auto max-w-3xl px-6 pb-16">
          <Verse citation="Jeremiah 29:13 · NKJV">
            And you will seek Me and find Me, when you search for Me with
            all your heart.
          </Verse>
        </div>
      </section>

      {/* What We Believe */}
      <section className="border-t border-border-subtle">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2 sm:items-center">
          <Reveal className="order-2 overflow-hidden rounded-3xl border border-border-subtle sm:order-1">
            <Image
              src="/women-who-seek/study-group.png"
              alt="Women gathered together for Bible study"
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={150} className="order-1 sm:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-700">
              What We Believe
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Our Foundation
            </h2>
            <p className="mt-4 text-foreground-muted">
              The Word of God is our foundation and final authority. All
              Scripture points to Jesus. Through prayer and the Holy
              Spirit, He reveals Christ more clearly and draws us closer to
              the Father. Through Jesus alone, we have access to God.
            </p>
          </Reveal>
        </div>
        <div className="mx-auto max-w-3xl px-6 pb-16">
          <Verse citation="2 Chronicles 7:14 · NLT">
            Then if my people who are called by my name will humble
            themselves and pray and seek my face and turn from their wicked
            ways, I will hear from heaven and will forgive their sins and
            restore their land.
          </Verse>
        </div>
      </section>

      {/* Join Us */}
      <section className="border-t border-border-subtle bg-background-elevated/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-700">
              Join Us
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Ways to Gather
            </h2>
            <p className="mt-4 text-foreground-muted">
              Three ways to seek with us: virtually, in your city, or at
              our annual gathering. All women are welcome.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 overflow-hidden rounded-3xl border border-border-subtle">
            <Image
              src="/women-who-seek/laughing.jpg"
              alt="Two women laughing together in community"
              width={1200}
              height={500}
              sizes="(max-width: 640px) 100vw, 1024px"
              className="h-56 w-full object-cover sm:h-72"
            />
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Reveal delay={0} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-shadow hover:shadow-lg hover:shadow-rose-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Monthly Bible Study
              </p>
              <h3 className="mt-2 text-lg font-semibold">Seek the Word</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>Monthly virtual gathering</li>
                <li>First Wednesday of every month</li>
                <li>7:30-9:00 PM EST | 6:30-8:00 PM CST | 5:30-7:00 PM MST</li>
              </ul>
              <a
                href={ZOOM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-rose-700 hover:text-rose-800"
              >
                Join Zoom Meeting
                <span aria-hidden>→</span>
              </a>
              <p className="mt-3 text-xs text-foreground-muted">
                Contact us at the bottom of the page for Meeting ID &amp;
                passcode.
              </p>
            </Reveal>

            <Reveal delay={100} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-shadow hover:shadow-lg hover:shadow-rose-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                In-Person Gatherings
              </p>
              <h3 className="mt-2 text-lg font-semibold">Seek Together</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>Intimate gatherings held in someone&apos;s home</li>
                <li>A time of community, encouragement, worship, and the Word</li>
                <li>Multiple times throughout the year</li>
              </ul>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-rose-700">
                Upcoming Dates
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground-muted">
                <li>Sep 5, 2026 · New Orleans</li>
                <li>Dec 5, 2026 · Atlanta</li>
                <li>Jun 5, 2027 · New Orleans</li>
              </ul>
            </Reveal>

            <Reveal delay={200} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-shadow hover:shadow-lg hover:shadow-rose-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Annual Conference
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                The Seekers Annual Conference
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>A larger gathering for all the ladies</li>
                <li>Encouraging every woman to go deeper</li>
              </ul>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-rose-700">
                Save the Date
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                March 20, 2027
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing image */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image
          src="/women-who-seek/bibles.jpg"
          alt="Women studying the Bible together"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Closing */}
      <section className="border-t border-border-subtle">
        <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-lg font-semibold">Women Who Seek</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Finding Jesus in the Scriptures · All women welcome
          </p>
          <a
            href="https://www.instagram.com/thewarthens?igsh=MWVnbTRsOWsyc3M4bg%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-border-subtle px-6 py-3 text-sm font-semibold transition-colors hover:bg-background-elevated"
          >
            Contact Us
          </a>
        </Reveal>
      </section>
    </>
  );
}
