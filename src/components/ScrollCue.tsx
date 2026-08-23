export default function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative h-10 w-px overflow-hidden bg-border-subtle">
        <span className="absolute left-0 top-0 h-3 w-px bg-foreground-muted animate-scroll-cue" />
      </div>
    </div>
  );
}
