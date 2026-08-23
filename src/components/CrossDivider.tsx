export default function CrossDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-14 bg-rose-300/70" aria-hidden />
      <span className="text-rose-400" aria-hidden>
        ✝
      </span>
      <span className="h-px w-14 bg-rose-300/70" aria-hidden />
    </div>
  );
}
