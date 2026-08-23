export default function SourcesToggle({ sources }: { sources: string[] }) {
  return (
    <details className="group rounded-2xl border border-border-subtle bg-background-elevated p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground-muted">
        Sources ({sources.length})
        <span
          aria-hidden
          className="text-sm normal-case transition-transform group-open:rotate-180"
        >
          ⌄
        </span>
      </summary>
      <ul className="mt-4 space-y-1 text-xs text-foreground-muted">
        {sources.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </details>
  );
}
