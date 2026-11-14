import type { Verse } from "@/lib/source-of-life-verses";
import VerseActions from "./VerseActions";

// One verse. "featured" is the big pull-quote style, "compact" is the list style used in the drawers.
export default function VerseBlock({ verse, size = "compact", domId }: { verse: Verse; size?: "featured" | "compact"; domId?: string }) {
  const big = size === "featured";
  const long = verse.text.length > 380;
  return (
    <figure
      id={domId ?? verse.id}
      className={`scroll-mt-28 border-l-2 border-amber-300/60 ${big ? "py-1 pl-5 sm:pl-7" : "py-0.5 pl-4"}`}
    >
      <blockquote
        className={`font-serif text-slate-100 ${
          big
            ? long
              ? "text-lg leading-relaxed sm:text-xl sm:leading-relaxed"
              : "text-xl leading-relaxed sm:text-2xl sm:leading-relaxed"
            : "text-base leading-relaxed sm:text-lg"
        }`}
      >
        {verse.text}
      </blockquote>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
          {verse.ref} <span className="text-slate-500">KJV</span>
          {verse.added && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">added</span>}
        </span>
        <VerseActions id={verse.id} text={verse.text} reference={verse.ref} />
      </figcaption>
    </figure>
  );
}
