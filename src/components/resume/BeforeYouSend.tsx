"use client";

// "Before you send": the few things that decide whether a resume is ready to go out, in plain order, each with the button that
// fixes it. Two tiers: what is needed before sending (contact details, the resume checks, and the person reading it through,
// which only they can do) and what is worth doing but optional. Nothing is locked: the download is always reachable, and says
// "Download anyway" while something needed is still open.

export type ReadyItem = {
  id: string;
  label: string;
  detail: string;
  state: "ok" | "fix";
  action?: { label: string; onClick: () => void };
};

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <span aria-hidden className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  ) : (
    <span aria-hidden className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold leading-none text-white">
      !
    </span>
  );
}

const smallButton =
  "inline-flex min-h-9 shrink-0 items-center rounded-full border border-border-subtle bg-background px-3.5 text-xs font-semibold transition-colors hover:border-blue-500/40";

export default function BeforeYouSend({
  items,
  readThrough,
  onReadThrough,
  openOptional,
  onReviewOptional,
  onJumpToDownload,
}: {
  // The needed items, except reading it through (that one is built in below).
  items: ReadyItem[];
  readThrough: boolean;
  onReadThrough: (v: boolean) => void;
  // Optional improvements still open (gap questions and bullets that could carry a number).
  openOptional: number;
  onReviewOptional: () => void;
  onJumpToDownload: () => void;
}) {
  const open = items.filter((i) => i.state === "fix").length + (readThrough ? 0 : 1);
  const ready = open === 0;

  return (
    <section aria-labelledby="before-send-title" className="rounded-3xl border border-border-subtle bg-background-elevated p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 id="before-send-title" className="text-base font-semibold tracking-tight">
            Before you send
          </h3>
          <span
            role="status"
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${ready ? "bg-green-600" : "bg-amber-500"}`}
          >
            {ready ? "Ready to send" : `${open} thing${open === 1 ? "" : "s"} to do`}
          </span>
        </div>
        <button
          type="button"
          onClick={onJumpToDownload}
          className={
            ready
              ? "inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              : "inline-flex min-h-10 items-center gap-2 rounded-full border border-border-subtle bg-background px-5 text-sm font-semibold transition-colors hover:border-blue-500/40"
          }
        >
          {ready ? "Go to download" : "Download anyway"}
          <span aria-hidden>↓</span>
        </button>
      </div>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Needed</p>
      <ul className="mt-2 space-y-2.5">
        {items.map((i) => (
          <li key={i.id} className="flex items-start gap-3">
            <Mark ok={i.state === "ok"} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{i.label}</p>
              <p className="text-sm text-foreground-muted">{i.detail}</p>
            </div>
            {i.state === "fix" && i.action && (
              <button type="button" onClick={i.action.onClick} className={smallButton}>
                {i.action.label}
              </button>
            )}
          </li>
        ))}
        <li className="flex items-start gap-3">
          <Mark ok={readThrough} />
          <div className="min-w-0 flex-1">
            <label htmlFor="rt-read-through" className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                id="rt-read-through"
                type="checkbox"
                checked={readThrough}
                onChange={(e) => onReadThrough(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span>
                <span className="font-semibold">I read it through, and everything in it is true.</span>
                <span className="block text-foreground-muted">Only you know. It takes a minute and protects you in an interview.</span>
              </span>
            </label>
          </div>
        </li>
      </ul>

      {openOptional > 0 && (
        <>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Worth doing</p>
          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="min-w-0 text-sm text-foreground-muted">
              <span className="font-semibold text-foreground">
                {openOptional} optional thing{openOptional === 1 ? "" : "s"} could make this resume stronger.
              </span>{" "}
              Answer only what is true. Each one you skip is left off.
            </p>
            <button type="button" onClick={onReviewOptional} className={smallButton}>
              Review them
            </button>
          </div>
        </>
      )}
    </section>
  );
}
