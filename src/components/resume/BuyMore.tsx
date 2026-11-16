"use client";

import { useEffect, useState } from "react";
import { PLANS, PLAN_ORDER, isPlanId, type PlanId } from "@/lib/resume-plans";

// Shown when someone has used their free builds: the packs for sale, and a button that opens Stripe's own
// checkout page. Card details are entered there, never on this site. Only packs that are set up in Stripe
// (and Netlify) are shown.

const SOON = "Paid builds are coming soon.";

export default function BuyMore({ email, afterPayment, onBeforeCheckout }: { email: string; afterPayment: boolean; onBeforeCheckout?: () => void }) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  // null while we check which packs are on sale.
  const [plans, setPlans] = useState<PlanId[] | null>(null);
  // The "tell me when more builds are open" request, used while there is nothing to buy yet.
  const [waitEmail, setWaitEmail] = useState(email);
  const [trap, setTrap] = useState("");
  const [waitState, setWaitState] = useState<"" | "sending" | "done" | "error">("");

  useEffect(() => {
    let live = true;
    fetch("/api/resume-checkout")
      .then((r) => r.json())
      .then((d: { plans?: unknown[] }) => live && setPlans((d.plans ?? []).filter(isPlanId).sort((a, b) => PLAN_ORDER.indexOf(a) - PLAN_ORDER.indexOf(b))))
      .catch(() => live && setPlans([]));
    return () => {
      live = false;
    };
  }, []);

  async function buy(plan: string) {
    setBusy(plan);
    setMessage("");
    // Lets the page keep what the person typed, because the payment page takes them away from this one.
    onBeforeCheckout?.();
    try {
      const res = await fetch("/api/resume-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setMessage(res.status === 503 ? SOON : "We couldn't open the payment page. Try again in a moment, or email info@thewarthens.com.");
    } catch {
      setMessage("We couldn't open the payment page. Check your connection and try again.");
    }
    setBusy("");
  }

  // This box sits inside the build form, and a form cannot hold another form, so it is a plain group with its own
  // button, and pressing Enter in the email box sends it instead of building.
  async function joinWaitlist() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitEmail.trim())) {
      setWaitState("error");
      return;
    }
    setWaitState("sending");
    try {
      const res = await fetch("/api/resume-waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: waitEmail.trim(), company_url: trap }),
      });
      setWaitState(res.ok ? "done" : "error");
    } catch {
      setWaitState("error");
    }
  }

  const none = plans !== null && plans.length === 0;
  const cols = plans && plans.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4 sm:p-5">
      <p className="text-base font-semibold">{afterPayment ? "Your payment is being confirmed" : "You've used your 2 free builds"}</p>
      <p className="mt-1 text-sm text-foreground-muted">
        {afterPayment
          ? "It usually takes a few seconds. Press Build again in a moment. If it still says you're out of builds after a minute, email info@thewarthens.com and we'll sort it out."
          : none
            ? SOON
            : "Get more builds to keep tailoring. You pay on Stripe's secure page, and your builds are added to this email address right away."}
      </p>
      {!afterPayment && plans && plans.length > 0 && (
        <div className={`mt-3 grid gap-3 ${cols}`}>
          {plans.map((id) => {
            const p = PLANS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => buy(id)}
                disabled={busy !== ""}
                className={`rounded-2xl border p-4 text-left transition-colors disabled:opacity-60 ${p.best ? "border-violet-500/60 bg-white shadow-sm hover:border-violet-600" : "border-border-subtle bg-white hover:border-blue-500/40"}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-base font-semibold">{p.builds === 1 ? "1 build" : `${p.builds} builds`}</span>
                  <span className="rb-gradient-text text-xl font-bold">{p.display}</span>
                </span>
                <span className="mt-1 block text-xs text-foreground-muted">{busy === id ? "Opening the payment page..." : p.note}</span>
                {p.best && <span className="mt-2 inline-block rounded-full bg-violet-600 px-2.5 py-0.5 text-[11px] font-bold text-white">Best value</span>}
              </button>
            );
          })}
        </div>
      )}
      {none && !afterPayment && (
        <div className="mt-3">
          {waitState === "done" ? (
            <p role="status" className="rounded-xl border border-green-600/30 bg-green-600/5 px-4 py-3 text-sm text-green-800">
              <span aria-hidden>✓ </span>You&apos;re on the list. We&apos;ll email you once when more builds are available.
            </p>
          ) : (
            <div role="group" aria-label="Get an email when more builds are available" className="space-y-2">
              <p className="text-sm font-semibold">Want an email when more builds are available?</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="rt-waitlist-email" className="sr-only">
                  Your email
                </label>
                <input
                  id="rt-waitlist-email"
                  type="email"
                  value={waitEmail}
                  onChange={(e) => setWaitEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void joinWaitlist();
                    }
                  }}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="flex-1 rounded-xl border border-border-subtle bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
                />
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="rt-waitlist-company">Company website</label>
                  <input id="rt-waitlist-company" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={() => void joinWaitlist()}
                  disabled={waitState === "sending"}
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-60"
                >
                  {waitState === "sending" ? "Saving..." : "Notify me"}
                </button>
              </div>
              <p className="text-xs text-foreground-muted">One email when paid builds open, and nothing else from this.</p>
              {waitState === "error" && (
                <p role="alert" className="text-sm text-red-700">
                  We couldn&apos;t save that. Check the email address and try again, or email info@thewarthens.com.
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {message && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
