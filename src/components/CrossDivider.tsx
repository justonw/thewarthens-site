export default function CrossDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-14 bg-rose-300/50" aria-hidden />
      <svg
        aria-hidden
        viewBox="0 0 16 20"
        className="h-4 w-4 text-rose-300/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <line x1="8" y1="1" x2="8" y2="19" />
        <line x1="2" y1="6.5" x2="14" y2="6.5" />
      </svg>
      <span className="h-px w-14 bg-rose-300/50" aria-hidden />
    </div>
  );
}
