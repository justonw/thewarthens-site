import type { Verse } from "@/lib/source-of-life-verses";
import VerseActions from "./VerseActions";

// One verse. "featured" is a card with a gold edge, "compact" is the plain list style used in the drawers.
export default function VerseBlock({ verse, size = "compact", domId }: { verse: Verse; size?: "featured" | "compact"; domId?: string }) {
  const big = size === "featured";
  const long = verse.text.length > 380;
  return (
    <figure
      id={domId ?? verse.id}
      className={
        big
          ? "scroll-mt-40 rounded-2xl border border-sol-line border-l-4 border-l-sol-spark bg-sol-card p-6 shadow-sm shadow-sol-ink/5 sm:p-8"
          : "scroll-mt-40 border-l-2 border-sol-spark/70 py-0.5 pl-4"
      }
    >
      <blockquote
        className={`font-sol text-sol-ink ${
          big
            ? long
              ? "text-lg leading-relaxed sm:text-xl sm:leading-relaxed"
              : "text-xl leading-relaxed sm:text-[1.65rem] sm:leading-relaxed"
            : "text-base leading-relaxed sm:text-lg"
        }`}
      >
        {verse.text}
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sol-gold">
          {verse.ref} <span className="text-sol-muted">KJV</span>
          {verse.added && <span className="ml-2 rounded-full bg-sol-line px-2 py-0.5 text-[10px] text-sol-muted">added</span>}
        </span>
        <VerseActions id={verse.id} text={verse.text} reference={verse.ref} />
      </figcaption>
    </figure>
  );
}
