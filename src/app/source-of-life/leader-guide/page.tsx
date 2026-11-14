import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/source/PrintButton";
import { prayer, verseByRef } from "@/lib/source-of-life";

const title = "Source of Life: Leader’s Guide for Small Groups | The Warthens";
const description =
  "A one-page guide for leading a 60-minute small group or Bible study through Source of Life: the quick check, the three acts, discussion questions, and care for people who are hurting.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/source-of-life/leader-guide" },
  openGraph: { title, description, url: "/source-of-life/leader-guide", type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

type Ref = { section: string; ref: string };

// Verse links point to the exact verse on the page, so a leader can open it and read it aloud.
const verseLink = ({ section, ref }: Ref) => ({ ref, href: `/source-of-life#${verseByRef(section, ref).id}` });

const steps: {
  minutes: number;
  name: string;
  what: string;
  verses?: Ref[];
  questions?: string[];
}[] = [
  {
    minutes: 5,
    name: "Open",
    what: "Welcome everyone and say plainly what this is: one person’s study of Scripture, held with conviction and open to other views. Pray together using the prayer from the page.",
  },
  {
    minutes: 10,
    name: "The quick check",
    what: "Everyone takes the 2-minute check on their own phone. Nothing is saved or shared. Then invite each person to say, only if they want to, which situation surprised them most.",
    questions: [
      "Which situation did you answer fastest, and which did you hesitate on?",
      "Where did your answer come from: Scripture, a sermon you heard, or your own experience?",
    ],
  },
  {
    minutes: 10,
    name: "Act I: Know Him",
    what: "Open the page and use teach mode so the group sees one verse at a time. Read these aloud.",
    verses: [
      { section: "source", ref: "Romans 11:36" },
      { section: "jesus", ref: "John 1:1-3" },
      { section: "head", ref: "Colossians 2:10" },
    ],
    questions: [
      "If everything came from Him and through Him, what does that change about how you see an ordinary day?",
      "What is different about coming to a Father who is also the source of all things?",
    ],
  },
  {
    minutes: 15,
    name: "Act II: See Him",
    what: "This is the hard part, so go slowly. Read the Hebrew note on the word “evil” first. Invite disagreement, and do not try to settle it.",
    verses: [
      { section: "source", ref: "Isaiah 45:7" },
      { section: "questions", ref: "Job 1:12" },
      { section: "questions", ref: "Genesis 50:20" },
      { section: "questions", ref: "James 1:13" },
    ],
    questions: [
      "Where have you given God or the devil the credit or the blame for something Scripture makes more complicated?",
      "How do you hold together God’s sovereignty and your own responsibility?",
      "Which of these verses is hardest for you, and why?",
    ],
  },
  {
    minutes: 10,
    name: "Act III: Come to Him",
    what: "Turn from understanding to response.",
    verses: [
      { section: "acknowledge", ref: "Proverbs 3:6" },
      { section: "questions", ref: "James 4:7" },
      { section: "questions", ref: "Romans 8:28" },
    ],
    questions: [
      "What would it look like to submit to God first, and then resist from there?",
      "Romans 8:29 says the good is being conformed to the image of His Son. How does that change what “good” means?",
    ],
  },
  {
    minutes: 7,
    name: "Your current state",
    what: "Each person fills in the five-question worksheet in silence. It is saved only on their own device. Share only what each person is comfortable sharing.",
  },
  {
    minutes: 3,
    name: "Close",
    what: "Pray together. Invite anyone who wants to talk more, or who is hurting, to find you afterward.",
  },
];

export default function LeaderGuidePage() {
  const total = steps.reduce((n, s) => n + s.minutes, 0);
  return (
    <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      {/* Print: hide the site header, footer, and floating buttons so the guide prints cleanly. */}
      <style>{`@media print { header, footer, .fixed { display: none !important; } body { background: #fff !important; } a { text-decoration: none !important; color: inherit !important; } }`}</style>

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sol-gold">Leader’s guide</p>
      <h1 className="mt-3 font-sol text-4xl font-semibold leading-tight text-sol-ink sm:text-5xl">Leading Source of Life with a small group</h1>
      <p className="mt-4 text-lg leading-relaxed text-sol-ink/80">
        A {total}-minute plan for a small group, Bible study, or men’s or women’s gathering. Everyone needs a phone and a Bible
        or the page open at{" "}
        <Link href="/source" className="font-semibold text-sol-violet underline underline-offset-4">
          thewarthens.com/source
        </Link>
        .
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
        <PrintButton className="rounded-full bg-sol-primary px-6 py-3 text-sm font-semibold text-sol-on-primary transition-colors hover:bg-sol-primary/90" />
        <Link href="/source-of-life" className="rounded-full border border-sol-line px-6 py-3 text-sm font-semibold text-sol-ink transition-colors hover:border-sol-gold/60">
          Open the page
        </Link>
      </div>

      <section className="mt-12 rounded-3xl border border-sol-line bg-sol-card p-6 sm:p-8">
        <h2 className="font-sol text-2xl font-semibold text-sol-ink">Before you start</h2>
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-sol-ink/80">
          <li>
            <strong className="text-sol-ink">Read the page yourself first,</strong> including the honest questions section.
          </li>
          <li>
            <strong className="text-sol-ink">Set the tone.</strong> This is one person’s study, held with conviction and open to other views. You are not asking
            anyone to agree, only to look at their own lens and then at Scripture.
          </li>
          <li>
            <strong className="text-sol-ink">Expect disagreement</strong> about how far God’s involvement goes. Thoughtful Christians land in different places.
            Let it stand, and do not try to win it.
          </li>
          <li>
            <strong className="text-sol-ink">Watch for pain.</strong> Someone in the room may be grieving. The page has a “Hurting right now?” path with gentler
            verses. If someone is in crisis, point them to 988 in the U.S. or your local emergency number, and to a pastor or counselor.
          </li>
        </ul>
      </section>

      <h2 className="mt-14 font-sol text-2xl font-semibold text-sol-ink">The plan</h2>
      <ol className="mt-6 space-y-6">
        {steps.map((s, i) => (
          <li key={s.name} className="rounded-3xl border border-sol-line bg-sol-card p-6 sm:p-8 print:break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-sol text-xl font-semibold text-sol-ink">
                <span className="mr-2 text-sol-gold">{i + 1}.</span>
                {s.name}
              </h3>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sol-muted">{s.minutes} min</span>
            </div>
            <p className="mt-3 text-base leading-relaxed text-sol-ink/80">{s.what}</p>
            {s.verses && (
              <p className="mt-3 text-sm text-sol-muted">
                Read aloud:{" "}
                {s.verses.map(verseLink).map((v, j) => (
                  <span key={v.ref}>
                    {j > 0 && ", "}
                    <Link href={v.href} className="font-semibold text-sol-violet underline underline-offset-4">
                      {v.ref}
                    </Link>
                  </span>
                ))}
              </p>
            )}
            {s.questions && (
              <ul className="mt-4 space-y-2 text-base text-sol-ink">
                {s.questions.map((q) => (
                  <li key={q} className="flex gap-3">
                    <span aria-hidden className="text-sol-gold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-3xl border border-sol-gold/30 bg-sol-card p-6 sm:p-8 print:break-inside-avoid">
        <h2 className="font-sol text-2xl font-semibold text-sol-ink">A prayer to close with</h2>
        <p className="mt-3 font-sol text-xl leading-relaxed text-sol-ink">{prayer}</p>
      </section>

      <section className="mt-12 print:break-inside-avoid">
        <h2 className="font-sol text-2xl font-semibold text-sol-ink">If someone pushes back</h2>
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-sol-ink/80">
          <li>
            <strong className="text-sol-ink">“Does this make God the author of sin?”</strong> No. Open the honest questions section and read James 1:13 and Genesis 50:20
            together. The wording on the page is that God allows it, uses it, and is not the author of the sin.
          </li>
          <li>
            <strong className="text-sol-ink">“So should I ignore the devil?”</strong> No. Read James 4:7: submit to God first, then resist the devil.
          </li>
          <li>
            <strong className="text-sol-ink">“Is this only your opinion?”</strong> It is one person’s study, and it says so. Invite the group to test it the way the Bereans did, in Acts 17:11.
          </li>
        </ul>
      </section>

      <p className="mt-14 text-sm text-sol-muted">
        Scripture is quoted from the King James Version. Questions or feedback? Write to us at{" "}
        <Link href="/contact#message" className="font-semibold text-sol-violet underline underline-offset-4">
          thewarthens.com/contact
        </Link>
        .
      </p>
    </article>
  );
}
