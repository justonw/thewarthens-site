import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import CrossDivider from "@/components/CrossDivider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const serif = "font-[family-name:var(--font-playfair)]";

const title = "Women Who Seek | The Warthens";
const description =
  "Women Who Seek: a community of women finding Jesus in the Scriptures. Hosted by Atiya Warthen.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faith/women-who-seek" },
  openGraph: { title, description, url: "/faith/women-who-seek" },
  twitter: { card: "summary_large_image", title, description },
  appleWebApp: {
    capable: true,
    title: "Women Who Seek",
    statusBarStyle: "default",
  },
};

const ZOOM_LINK =
  "https://us06web.zoom.us/j/84219780543?pwd=QH05EYCRiT5XFeOa5UybiNH0tK9ssX.1";

const faq = [
  {
    question: "What is Women Who Seek?",
    answer:
      "Women Who Seek is a Bible study community for women, hosted by Atiya Warthen, focused on finding Jesus throughout Scripture. Wherever you are in your journey with Jesus, you're welcome.",
  },
  {
    question: "How do I join the Women Who Seek Bible study?",
    answer:
      "The monthly virtual Bible study meets the first Wednesday of every month over Zoom, 7:30-9:00 PM EST. Join using the Zoom link on this page, or contact us for the Meeting ID and passcode.",
  },
  {
    question: "Is Women Who Seek only for women in certain cities?",
    answer:
      "No. The monthly Bible study is virtual and open to any woman, anywhere. In-person gatherings are also held periodically in cities like New Orleans and Atlanta, and there's an annual conference for all women.",
  },
  {
    question: "Do I need Bible knowledge or experience to join?",
    answer:
      "No. Women Who Seek welcomes women wherever they are in their journey with Jesus, whether you've known Him for years or are just beginning.",
  },
];

function Verse({ children, citation }: { children: React.ReactNode; citation: string }) {
  return (
    <Reveal className="mx-auto max-w-xl text-center">
      <p className={`${serif} text-balance text-xl italic text-foreground-muted`}>
        &ldquo;{children}&rdquo;
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-mauve-700">
        {citation}
      </p>
    </Reveal>
  );
}

export default function WomenWhoSeekPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Warthens", item: "https://thewarthens.com" },
      { "@type": "ListItem", position: 2, name: "Faith Journey", item: "https://thewarthens.com/faith" },
      { "@type": "ListItem", position: 3, name: "Women Who Seek", item: "https://thewarthens.com/faith/women-who-seek" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className={playfair.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              "radial-gradient(55% 45% at 50% 0%, rgba(107,69,80,0.14), transparent)",
          }}
        />
        <Reveal className="relative mx-auto max-w-3xl px-6 pt-16 pb-10 text-center sm:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[52%] -z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="h-[420px] w-[420px] rounded-full border border-mauve-300/50 sm:h-[560px] sm:w-[560px]" />
            <div className="absolute inset-[14%] rounded-full border border-mauve-300/40" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-mauve-700">
            A Community of Women
          </p>
          <h1
            className={`${serif} text-balance mt-4 text-5xl font-medium tracking-tight sm:text-6xl`}
          >
            Women Who Seek
          </h1>
          <p className={`${serif} mt-3 text-2xl italic text-rust-700 sm:text-3xl`}>
            Finding Jesus in the Scriptures
          </p>
          <p className="mx-auto mt-8 max-w-xl text-balance text-lg text-foreground-muted">
            Wherever you are in your journey with Jesus, you are welcome
            here. Hosted by Atiya Warthen.
          </p>
          <CrossDivider className="mt-10" />
          <ScrollCue className="mt-8" />
        </Reveal>
        <div className="mx-auto max-w-3xl px-6 pt-6 pb-16">
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
            <p className="text-sm font-semibold uppercase tracking-wider text-mauve-700">
              Who We Are
            </p>
            <h2 className={`${serif} mt-3 text-3xl font-medium sm:text-4xl`}>
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
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-mauve-700">
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
            <p className="text-sm font-semibold uppercase tracking-wider text-mauve-700">
              What We Believe
            </p>
            <h2 className={`${serif} mt-3 text-3xl font-medium sm:text-4xl`}>
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
            <p className="text-sm font-semibold uppercase tracking-wider text-mauve-700">
              Join Us
            </p>
            <h2 className={`${serif} mt-3 text-3xl font-medium sm:text-4xl`}>
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
            <Reveal delay={0} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-shadow hover:shadow-lg hover:shadow-mauve-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">
                Monthly Bible Study
              </p>
              <h3 className={`${serif} mt-2 text-xl font-medium`}>Seek the Word</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>Monthly virtual gathering</li>
                <li>First Wednesday of every month</li>
                <li>7:30-9:00 PM EST | 6:30-8:00 PM CST | 5:30-7:00 PM MST</li>
              </ul>
              <a
                href={ZOOM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-mauve-700 hover:text-mauve-800"
              >
                Join Zoom Meeting
                <span aria-hidden>→</span>
              </a>
              <p className="mt-3 text-xs text-foreground-muted">
                Contact us at the bottom of the page for Meeting ID &amp;
                passcode.
              </p>
            </Reveal>

            <Reveal delay={100} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-shadow hover:shadow-lg hover:shadow-mauve-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">
                In-Person Gatherings
              </p>
              <h3 className={`${serif} mt-2 text-xl font-medium`}>Seek Together</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>Intimate gatherings held in someone&apos;s home</li>
                <li>A time of community, encouragement, worship, and the Word</li>
                <li>Multiple times throughout the year</li>
              </ul>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-mauve-700">
                Upcoming Dates
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground-muted">
                <li>Sep 5, 2026 · New Orleans</li>
                <li>Dec 5, 2026 · Atlanta</li>
                <li>Jun 5, 2027 · New Orleans</li>
              </ul>
            </Reveal>

            <Reveal delay={200} className="rounded-3xl border border-border-subtle bg-background-elevated p-6 transition-shadow hover:shadow-lg hover:shadow-mauve-900/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-mauve-700">
                Annual Conference
              </p>
              <h3 className={`${serif} mt-2 text-xl font-medium`}>
                The Seekers Annual Conference
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>A larger gathering for all the ladies</li>
                <li>Encouraging every woman to go deeper</li>
              </ul>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-mauve-700">
                Save the Date
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                March 20, 2027
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border-subtle">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-mauve-700">
              Questions
            </p>
            <h2 className={`${serif} mt-3 text-3xl font-medium sm:text-4xl`}>
              Quick Answers
            </h2>
            <div className="mt-6 space-y-3">
              {faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-border-subtle bg-background-elevated"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
                    {f.question}
                    <span
                      aria-hidden
                      className="shrink-0 text-sm text-foreground-muted transition-transform group-open:rotate-180"
                    >
                      ⌄
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm text-foreground-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
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
      </div>

      {/* Closing */}
      <section className="border-t border-border-subtle">
        <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className={`${serif} text-2xl font-medium`}>Women Who Seek</p>
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
    </div>
  );
}
