// The paid packs for the Resume Builder. The Stripe price for each is set in Netlify (the price IDs are not
// secret, but keeping them in settings lets packs be added, removed, or repriced without a code change). A pack
// is offered only when its price ID is set. How many builds a pack gives is decided here, on the server, and
// never read from the visitor's browser. The price text below is only what the buy panel shows: the amount
// charged is the one on the Stripe price, so keep the two the same.

export type PlanId = "single" | "pack" | "ten" | "fifteen";

export const PLANS: Record<PlanId, { builds: number; label: string; priceEnv: string; display: string; note: string; best?: boolean }> = {
  single: { builds: 1, label: "1 resume build", priceEnv: "STRIPE_PRICE_SINGLE", display: "$2", note: "One tailored resume, with a cover letter if you want one." },
  pack: { builds: 5, label: "5 resume builds", priceEnv: "STRIPE_PRICE_PACK", display: "$5", note: "$1 each. Good for applying to a few jobs." },
  ten: { builds: 10, label: "10 resume builds", priceEnv: "STRIPE_PRICE_TEN", display: "$8", note: "80 cents each." },
  fifteen: { builds: 15, label: "15 resume builds", priceEnv: "STRIPE_PRICE_FIFTEEN", display: "$10", note: "About 67 cents each. Best for a full job search.", best: true },
};

export const PLAN_ORDER: PlanId[] = ["single", "pack", "ten", "fifteen"];

export const isPlanId = (v: unknown): v is PlanId => typeof v === "string" && Object.prototype.hasOwnProperty.call(PLANS, v);

// The plans that can be bought right now: the Stripe key and the plan's price must both be set.
export function availablePlans(): PlanId[] {
  if (!process.env.STRIPE_SECRET_KEY) return [];
  return PLAN_ORDER.filter((id) => Boolean(process.env[PLANS[id].priceEnv]));
}
