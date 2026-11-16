"use client";

import { useEffect, useState } from "react";
import { PLANS, PLAN_ORDER, isPlanId, type PlanId } from "@/lib/resume-plans";

// Shown when someone has used their free builds: the packs for sale, and a button that opens Stripe's own
// checkout page. Card details are entered there, never on this site. Only packs that are set up in Stripe
// (and Netlify) are shown.

const SOON = "Paid builds are coming soon. Email info@thewarthens.com if you need one sooner.";

export default function BuyMore({ email, afterPayment, onBeforeCheckout }: { email: string; afterPayment: boolean; onBeforeCheckout?: () => void }) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  // null while we check which packs are on sale.
  const [plans, setPlans] = useState<PlanId[] | null>(null);

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
      {message && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
