// "See the evidence": the sources behind the claim that tailoring a resume to the job helps, with what
// each one actually measured and how much weight it can bear. Each figure below was checked against the
// source's own page. If a source updates its numbers, update this list.

type Source = {
  name: string;
  finding: string;
  detail: string;
  kind: string;
  href: string;
};

const sources: Source[] = [
  {
    name: "Huntr, Job Search Trends Report (Q2 2025)",
    finding: "Tailored resumes: 5.75% of applications reached an interview or offer. Generic resumes: 2.68%. About 2.1 times as often.",
    detail: "Over 1.39 million applications tracked since Q4 2024.",
    kind: "Outcomes reported by users of Huntr's job-tracking app",
    href: "https://huntr.co/research/job-search-trends-q2-2025",
  },
  {
    name: "Huntr, 2025 Annual Job Search Trends Report",
    finding: "Tailored resumes: 5.8% reached an interview, offer, or hire. Untailored: 3.73%. About 1.6 times as often.",
    detail: "65,088 tailored submissions and more than 1 million untailored, January to December 2025.",
    kind: "Outcomes reported by users of Huntr's job-tracking app",
    href: "https://huntr.co/research/2025-annual-job-search-trends-report",
  },
  {
    name: "Jobscan, State of the Job Search 2025",
    finding: "Resumes whose job title matched the listing had an interview rate 10.6 times higher. In a survey of 384 recruiters, 55.3% said they value resumes tailored to the job description.",
    detail: "Published February 2025. Based on activity from Jobscan's own users, in a section covering over 2.5 million applications.",
    kind: "A company's own data, showing a correlation. Its method is described only briefly",
    href: "https://www.jobscan.co/blog/interview-rates-study",
  },
  {
    name: "Wellfound, with Huntr's data (September 2025)",
    finding: "Repeats Huntr's finding: tailored resumes drove a 2.1 times higher interview conversion rate.",
    detail: "A recruiting-industry write-up of the same Huntr data, not a separate study.",
    kind: "Secondary source",
    href: "https://wellfound.com/blog/how-to-double-your-interview-rate-what-500-000-job-applications-revealed",
  },
];

export default function EvidenceDropdown() {
  return (
    <details className="group mx-auto mt-4 max-w-2xl rounded-2xl border border-border-subtle bg-background-elevated text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-sm font-semibold">
        <span>See the evidence ({sources.length} sources)</span>
        <span aria-hidden className="text-foreground-muted transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="px-5 pb-5">
        <ul className="space-y-4">
          {sources.map((s) => (
            <li key={s.href} className="text-sm">
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline underline-offset-2">
                {s.name}
              </a>
              <p className="mt-1">{s.finding}</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {s.detail} <span className="font-medium">{s.kind}.</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-background px-4 py-3 text-xs text-foreground-muted">
          <span className="font-semibold text-foreground">How to read this.</span> These numbers show that people who tailor get interviews more often. They
          don&apos;t prove tailoring is the cause, because people who tailor may also be more serious searchers. The data comes from job-search companies and from
          what users reported. We didn&apos;t find an independent controlled study of resume tailoring, so we don&apos;t promise a particular result.
        </p>
      </div>
    </details>
  );
}
