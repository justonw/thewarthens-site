// Two houses side by side: one on a cracked foundation, one on a solid one. Plain SVG, no script.
function House({ solid }: { solid: boolean }) {
  const line = "currentColor";
  return (
    <svg viewBox="0 0 160 120" className={`mx-auto h-40 w-full max-w-[13rem] ${solid ? "text-sol-spark" : "text-sol-rose"}`} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g transform={solid ? "" : "rotate(-3 80 100)"}>
        <path d="M30 100 V56 L80 18 L130 56 V100" stroke={line} />
        <path d="M66 100 V74 H94 V100" stroke={line} strokeWidth="2.4" />
        {solid ? (
          <>
            <circle cx="80" cy="50" r="12" fill="var(--sol-spark)" fillOpacity="0.28" stroke="none" />
            <circle cx="80" cy="50" r="5" fill="var(--sol-spark)" stroke="none" />
          </>
        ) : (
          <rect x="72" y="42" width="16" height="16" rx="2" stroke={line} strokeWidth="2" strokeOpacity="0.6" />
        )}
      </g>
      {/* the foundation */}
      {solid ? (
        <g stroke={line} strokeWidth="2.4">
          <path d="M22 100 H138 V116 H22 Z" />
          <path d="M22 108 H138 M54 100 V108 M88 100 V108 M112 108 V116 M40 108 V116 M72 108 V116" />
        </g>
      ) : (
        <g stroke={line} strokeWidth="2.4">
          <path d="M22 100 H138 V116 H22 Z" strokeOpacity="0.7" />
          <path d="M70 100 L76 106 L68 111 L78 116" strokeWidth="3" />
          <path d="M108 100 L103 107 L110 112" strokeWidth="2.4" />
        </g>
      )}
    </svg>
  );
}

export default function FoundationVisual({
  cracked,
  solid,
}: {
  cracked: { title: string; lines: string[] };
  solid: { title: string; lines: string[] };
}) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      <div className="rounded-3xl border border-sol-rose/30 bg-sol-rose/10 p-6">
        <House solid={false} />
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-sol-rose">{cracked.title}</p>
        <ul className="mt-4 space-y-2 text-base text-sol-ink/80">
          {cracked.lines.map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden className="text-sol-rose">×</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-sol-gold/30 bg-sol-gold/10 p-6">
        <House solid />
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-sol-gold">{solid.title}</p>
        <ul className="mt-4 space-y-2 text-base text-sol-ink">
          {solid.lines.map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden className="text-sol-gold">✓</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
