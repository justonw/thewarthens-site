import { NextRequest, NextResponse } from "next/server";
import { PLANS, availablePlans, isPlanId } from "@/lib/resume-plans";

// Starts a Stripe Checkout for more resume builds. Card details are entered on Stripe's own page and never
// reach this site. Without STRIPE_SECRET_KEY (or the price for the pack) it answers 503, and the page falls
// back to its "paid builds are coming soon" message.

export const dynamic = "force-dynamic";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

// Which packs can be bought right now, for the buy panel.
export async function GET() {
  return NextResponse.json({ plans: availablePlans() });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!isPlanId(body.plan)) return NextResponse.json({ error: "plan" }, { status: 400 });

  const plan = PLANS[body.plan];
  const price = process.env[plan.priceEnv];
  if (!STRIPE_KEY || !price) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const base = origin && host && new URL(origin).host === host ? origin : `https://${host ?? "thewarthens.com"}`;
  const form = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    customer_email: email,
    "metadata[email]": email,
    "metadata[builds]": String(plan.builds),
    "metadata[plan]": body.plan,
    "payment_intent_data[description]": `Resume Builder: ${plan.label}`,
    "payment_intent_data[metadata][email]": email,
    success_url: `${base}/resume?paid=1#start`,
    cancel_url: `${base}/resume#start`,
  });

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json().catch(() => null)) as { url?: string; error?: { message?: string } } | null;
    if (!res.ok || !data?.url) {
      console.error("resume-checkout: Stripe answered", res.status, data?.error?.message ?? "");
      return NextResponse.json({ error: "unavailable" }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch (err) {
    console.error("resume-checkout failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
