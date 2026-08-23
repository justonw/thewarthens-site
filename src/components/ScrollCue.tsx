export default function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted/70">
        Scroll
      </span>
      <div className="relative h-10 w-px overflow-hidden bg-border-subtle">
        <span className="absolute left-0 top-0 h-3 w-px bg-foreground-muted animate-scroll-cue" />
      </div>
    </div>
  );
}
