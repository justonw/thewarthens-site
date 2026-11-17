import Image from "next/image";
import Link from "next/link";
import { COACHING_PATH, coach } from "@/lib/coaching";
import { detectPath, nextStepsFor } from "@/lib/next-steps";

// "What to do next", shown under a finished resume. The middle card changes with the field the person is
// going into; the coaching and keep-going cards are the same for everyone. Partner programs are marked
// as partner links, matching the note in our footer.

const card = "flex flex-col rounded-2xl border border-border-subtle bg-background-elevated p-5";
const rowLink =
  "group flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm transition-colors hover:border-blue-500/40";

export default function NextSteps({ title, extra }: { title: string; extra: string }) {
  const pathId = detectPath(title, extra);
  const steps = nextStepsFor(pathId);
  const isSales = pathId === "sales";

  return (
    <section aria-labelledby="next-steps-title" className="border-t border-border-subtle pt-8">
      <h3 id="next-steps-title" className="text-xl font-semibold tracking-tight">
        What to do next
      </h3>
      <p className="mt-1 text-sm text-foreground-muted">Your resume is step one. Here is how to get it in front of people.</p>

      <div className={`mt-5 grid gap-4 ${isSales ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {isSales && (
        <div className={card}>
          <div className="flex items-center gap-3">
            <Image src={coach.photo} alt={coach.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold">Get coached by {coach.firstName}</p>
              <p className="text-xs text-foreground-muted">{coach.roleLine}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">
            {`${coach.firstName} sells for a living. He coaches people going into sales on interviews, outreach, and negotiating the offer, and this is his field.`}
          </p>
          <p className="mt-2 text-xs text-foreground-muted">It starts with a short questionnaire and a free 15-minute intro call.</p>
          <Link
            href={`${COACHING_PATH}?from=resume-builder`}
            className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Learn about coaching
            <span aria-hidden>→</span>
          </Link>
        </div>
        )}

        {steps.path ? (
          <div className={card}>
            <p className="font-semibold">Going into {steps.path.title}?</p>
            <p className="mt-1 text-sm text-foreground-muted">Start free, then look at a program if you want more structure.</p>
            <ul className="mt-3 space-y-2">
              {steps.guide && (
                <li>
                  <Link href={steps.guide.href} className={rowLink}>
                    <span>
                      <span className="block font-medium">{steps.guide.label}</span>
                      <span className="block text-xs text-foreground-muted">Free, from us</span>
                    </span>
                    <span aria-hidden className="text-foreground-muted transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              )}
              {steps.free.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={rowLink}>
                    <span>
                      <span className="block font-medium">{l.label}</span>
                      <span className="block text-xs text-foreground-muted">Free to start, by {l.by}</span>
                    </span>
                    <span aria-hidden className="text-foreground-muted transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </li>
              ))}
              {steps.programs.map((l) => (
                <li key={`${l.href}|${l.label}`}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={rowLink}>
                    <span>
                      <span className="block font-medium">{l.label}</span>
                      <span className="block text-xs text-foreground-muted">{steps.hasPartner ? `Partner program, by ${l.by}` : `Neutral source, by ${l.by}`}</span>
                    </span>
                    <span aria-hidden className="text-foreground-muted transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href="#programs" className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold text-blue-600 underline underline-offset-2 sm:min-h-0">
              Explore all career fields and programs
            </a>
            <p className="mt-2 text-xs text-foreground-muted">
              {steps.hasPartner
                ? "Partner links may earn us compensation, and some come with discounts. The free options cost nothing."
                : "We don't have a partner in this field, so this points to a neutral source."}
            </p>
          </div>
        ) : (
          <div className={card}>
            <p className="font-semibold">Curious about other fields?</p>
            <p className="mt-1 text-sm text-foreground-muted">
              Take our free 2-minute career quiz and see real, sourced entry-level pay for nine different paths.
            </p>
            <a href="#programs" className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold text-blue-600 underline underline-offset-2 sm:min-h-0">
              Explore all career fields and programs
            </a>
            <Link
              href="/tech#quiz"
              className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full border border-border-subtle bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/40"
            >
              Take the quiz
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}

        <div className={card}>
          <p className="font-semibold">Keep your search moving</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/tech#checklist" className={rowLink}>
                <span>
                  <span className="block font-medium">Match your LinkedIn to your resume</span>
                  <span className="block text-xs text-foreground-muted">Recruiters look there too</span>
                </span>
                <span aria-hidden className="text-foreground-muted transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
            {!isSales && (
              <li>
                <Link href={`${COACHING_PATH}?from=resume-builder`} className={rowLink}>
                  <span>
                    <span className="block font-medium">Interview and offer coaching</span>
                    <span className="block text-xs text-foreground-muted">With {coach.firstName}, whose background is sales</span>
                  </span>
                  <span aria-hidden className="text-foreground-muted transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            )}
            <li>
              <Link href="/tech#tracker" className={rowLink}>
                <span>
                  <span className="block font-medium">Track every application</span>
                  <span className="block text-xs text-foreground-muted">Free job tracker</span>
                </span>
                <span aria-hidden className="text-foreground-muted transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
