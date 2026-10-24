import Image from "next/image";
import Link from "next/link";
import { COACHING_PATH, coach } from "@/lib/coaching";

// A quiet "talk to a person" card for the end of free guides.
// `from` tags the link so the intake email shows which page sent the visitor.
export default function CoachingCallout({ from }: { from: string }) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-blue-500/25 bg-gradient-to-br from-blue-500/5 via-background-elevated to-violet-500/5 p-6 sm:flex-row sm:items-center sm:p-8">
      <Image
        src={coach.photo}
        alt={`${coach.name}, ${coach.title}`}
        width={96}
        height={96}
        className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
      />
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          1:1 coaching
        </p>
        <p className="mt-1 text-lg font-semibold">Paid 1:1 coaching with {coach.name}</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Personal coaching on interviewing, networking, and negotiation from an enterprise Account
          Executive. This is a paid service, and it starts with a free 15-minute intro call.
        </p>
      </div>
      <Link
        href={`${COACHING_PATH}?from=${from}`}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        Learn more
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
