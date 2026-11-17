import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { SITE, socialLinks } from "@/lib/site-schema";

const title = "About Juston & Atiya Warthen | The Warthens";
const description = "Meet Juston and Atiya Warthen: everyday people from hospitality, house cleaning, church, and mentoring teens, sharing a career change into tech and our faith.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", type: "profile", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const offers = [
  { href: "/tech", name: "Tech Journey", text: "A free career quiz, real pay data, honest Hype vs. Reality guides, and step-by-step paths into tech sales, cybersecurity, coding, and data analytics." },
  { href: "/resume", name: "Resume Builder and keyword scanner", text: "Free tools to tailor your resume to a specific job, built only from your real experience." },
  { href: "/faith", name: "Faith Journey", text: "Bible studies, testimonies, and lessons from our own life on learning, understanding, and living out God's wisdom." },
  { href: "/techjr", name: "Tech Journey Jr.", text: "Free, ad-free games and parent guides that teach kids ages 5 to 10 about online safety and tech careers." },
  { href: "/tech/coaching", name: "1:1 coaching with Jermell Mitchell", text: "Paid coaching on tech sales, interviewing, and negotiation, with a free 15-minute intro call." },
];

export default function AboutPage() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE}/about#webpage`,
        url: `${SITE}/about`,
        name: title,
        description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#organization` },
        mainEntity: [{ "@id": `${SITE}/about#juston` }, { "@id": `${SITE}/about#atiya` }],
        breadcrumb: { "@id": `${SITE}/about#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}/about#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Warthens", item: SITE },
          { "@type": "ListItem", position: 2, name: "About", item: `${SITE}/about` },
        ],
      },
    ],
  };
  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-12 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">About</p>
        <h1 className="text-balance mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">We&apos;re Juston and Atiya Warthen</h1>
        <p className="mt-4 text-lg text-foreground-muted">
          We&apos;re a married couple walking out two journeys in public: a career transition into tech that changed our income and our peace of mind, and a faith journey of relying on God to discover, understand, and live out truth.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <figure className="overflow-hidden rounded-3xl border border-border-subtle">
          <div className="relative aspect-[4/5]">
            <Image src="/team/juston.jpg" alt="Juston Warthen, co-host of Tech Journey and Faith Journey" fill sizes="(min-width: 768px) 360px, 45vw" className="object-cover" style={{ objectPosition: "50% 18%" }} />
          </div>
          <figcaption className="p-3 text-sm font-semibold">Juston Warthen</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-3xl border border-border-subtle">
          <div className="relative aspect-[4/5]">
            <Image src="/team/atiya.png" alt="Atiya Warthen, who co-leads Faith Journey and hosts Women Who Seek" fill sizes="(min-width: 768px) 360px, 45vw" className="object-cover" style={{ objectPosition: "50% 28%" }} />
          </div>
          <figcaption className="p-3 text-sm font-semibold">Atiya Warthen</figcaption>
        </figure>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Where we come from</h2>
        <p className="mt-3 text-foreground-muted">
          We&apos;re everyday people navigating life the best way we can. We know the grind and the day-to-day hustle of working, from hospitality to house cleaning. Alongside the work, we gave our time to what we felt mattered: serving in our local church, in the neighborhoods around us, and mentoring young people in high schools.
        </p>
        <p className="mt-3 text-foreground-muted">
          That is the lens behind everything here. We&apos;re not looking down from above. We hope that after you spend a little time with us, your day is a little bit better.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Why we do this</h2>
        <p className="mt-3 text-foreground-muted">
          Income problems become real problems: not being able to be present with your family, driving for hours after your shift ends, watching bills pile up. Tech is the field that changed things for us, and it is a wide door: coding, IT, cybersecurity, sales, marketing tech, healthcare tech, UX, and the trades all count. We share what we wish someone had told us, and we say so when something is not worth your money.
        </p>
        <p className="mt-3 text-foreground-muted">
          Our faith comes from our own experience, including serving in local church leadership and later questioning what we thought faith was supposed to look like, and finding God faithful through all of it. Hear our stories in{" "}
          <Link href="/jesus" className="font-semibold text-blue-700 underline underline-offset-2">
            Why We Believe in Jesus
          </Link>{" "}
          and{" "}
          <Link href="/magnets" className="font-semibold text-blue-700 underline underline-offset-2">
            Our Kids Swallowed Magnets
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">What you will find here</h2>
        <ul className="mt-4 space-y-3">
          {offers.map((o) => (
            <li key={o.href}>
              <Link href={o.href} className="block rounded-2xl border border-border-subtle bg-background-elevated p-5 transition-colors hover:border-blue-500/50">
                <span className="block text-lg font-semibold">{o.name}</span>
                <span className="mt-1 block text-sm text-foreground-muted">{o.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">How we work, and how we are paid</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground-muted">
          <li>Every number we use has a source.</li>
          <li>Our resume tools only use what is in your real resume and notes. They never invent experience.</li>
          <li>Some links on this site are affiliate links, and some offer paid programs. We may be compensated if you buy, and we say so. Many resources we recommend are free.</li>
          <li>Jermell Mitchell&apos;s coaching is paid. The rest of the site is free to use today.</li>
          <li>We are not counselors or financial advisors. If you are in crisis in the U.S., call or text 988.</li>
        </ul>
      </section>

      <section className="mt-12 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Say hello</h2>
        <p className="mt-2 text-foreground-muted">
          Questions, a story to share, or an idea for a video? Email{" "}
          <a href="mailto:info@thewarthens.com" className="font-semibold text-blue-700 underline underline-offset-2">
            info@thewarthens.com
          </a>{" "}
          or use the{" "}
          <Link href="/contact" className="font-semibold text-blue-700 underline underline-offset-2">
            contact page
          </Link>
          . You can also find us on{" "}
          <a href={socialLinks.youtubeTech} className="font-semibold text-blue-700 underline underline-offset-2" rel="noopener noreferrer" target="_blank">
            YouTube
          </a>
          .
        </p>
      </section>
    </main>
  );
}
