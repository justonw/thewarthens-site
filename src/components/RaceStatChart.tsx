import type { ChartDatum } from "@/lib/faith-writings";

// Fixed categorical order, keyed by identity so the same group always gets
// the same color across every chart on the page, never by row position.
const FIXED_COLORS: Record<string, string> = {
  white: "#2a78d6",
  black: "#eb6834",
  hispanic: "#1baf7a",
  asian: "#eda100",
};
const FALLBACK_ORDER = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#4a3aa7"];

function colorFor(datum: ChartDatum, fallbackIndex: number) {
  const key = (datum.colorKey ?? datum.label).trim().toLowerCase();
  return FIXED_COLORS[key] ?? FALLBACK_ORDER[fallbackIndex % FALLBACK_ORDER.length];
}

export default function RaceStatChart({
  title,
  sourceNote,
  data,
}: {
  title: string;
  sourceNote: string;
  data: ChartDatum[];
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="not-prose my-2 rounded-3xl border border-border-subtle bg-background-elevated p-5 sm:p-6">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-5 space-y-4">
        {data.map((d, i) => {
          const widthPct = max > 0 ? Math.max((d.value / max) * 100, 3) : 0;
          const color = colorFor(d, i);
          return (
            <div key={d.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {d.label}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                  {d.display}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-background-elevated-2">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${widthPct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-foreground-muted">{sourceNote}</p>
    </div>
  );
}
