import Link from "next/link";

// A short pointer to the Resume Builder, for places where people are already working on their job search
// (the Job Search Toolkit, and the email that sends it).
export default function ResumeBuilderCallout({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-5 text-left sm:flex-row sm:items-center sm:p-6 ${className}`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Free tool</p>
        <p className="mt-1 text-base font-semibold">Next: tailor your resume to the job you want</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Add your resume and the job posting. Get a finished resume and cover letter as PDF and Word files, built only from your real experience. Your first 2 are free.
        </p>
      </div>
      <Link
        href="/resume"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        Open the Resume Builder
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
