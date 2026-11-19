// The "you're done" moment: a ring that fills to show how many checks the resume passes, and a short
// burst of confetti. Both are CSS only, and show their end state without motion for visitors who ask
// for reduced motion. The ring's number is real: it is the share of our resume checks that pass.

const R = 24;
const C = 2 * Math.PI * R;

export function ReadinessRing({ passed, total }: { passed: number; total: number }) {
  const ratio = total > 0 ? passed / total : 0;
  const done = passed === total;
  return (
    <div className="flex shrink-0 flex-col items-center gap-1" role="img" aria-label={`${passed} of ${total} resume checks passed`}>
     <div className="relative h-16 w-16">
      <svg viewBox="0 0 56 56" className="h-16 w-16 -rotate-90">
        <circle cx="28" cy="28" r={R} fill="none" strokeWidth="6" className="rb-ring-track" />
        <circle
          cx="28"
          cy="28"
          r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          stroke={done ? "#16a34a" : "#7c3aed"}
          strokeDasharray={`${C * ratio} ${C}`}
          className="rb-draw"
          style={{ ["--rb-len" as string]: `${C * ratio}` }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
        {passed}/{total}
      </span>
     </div>
     <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">checks passed</span>
    </div>
  );
}

// Fixed pieces (not random) so the burst looks the same every time and never differs between renders.
const pieces = [
  { x: -150, y: 150, r: 300, c: "#2563eb", d: 0 },
  { x: -110, y: 190, r: -240, c: "#7c3aed", d: 0.05 },
  { x: -70, y: 140, r: 200, c: "#f59e0b", d: 0.1 },
  { x: -40, y: 210, r: -320, c: "#16a34a", d: 0.02 },
  { x: -10, y: 170, r: 260, c: "#ec4899", d: 0.12 },
  { x: 20, y: 200, r: -180, c: "#2563eb", d: 0.07 },
  { x: 55, y: 150, r: 340, c: "#f59e0b", d: 0.03 },
  { x: 90, y: 215, r: -280, c: "#7c3aed", d: 0.15 },
  { x: 125, y: 160, r: 220, c: "#16a34a", d: 0.09 },
  { x: 160, y: 195, r: -300, c: "#ec4899", d: 0.04 },
  { x: -130, y: 220, r: 180, c: "#f59e0b", d: 0.18 },
  { x: 140, y: 230, r: -200, c: "#2563eb", d: 0.2 },
];

export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-2 h-0 w-0">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="rb-confetti absolute block h-2.5 w-1.5 rounded-[1px] opacity-0 motion-reduce:hidden"
          style={{ backgroundColor: p.c, animationDelay: `${p.d}s`, ["--rb-x" as string]: `${p.x}px`, ["--rb-y" as string]: `${p.y}px`, ["--rb-r" as string]: `${p.r}deg` }}
        />
      ))}
    </div>
  );
}
