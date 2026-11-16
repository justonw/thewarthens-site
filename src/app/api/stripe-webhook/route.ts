import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { addCredits, getKv, withTimeout } from "@/lib/resume-limits";
import { PLANS, isPlanId } from "@/lib/resume-plans";
import { isLiveHost } from "@/lib/coaching-recipients";

// Stripe calls this when a payment finishes. It checks Stripe's signature, then adds the builds that were
// bought to that email's balance. Each checkout is counted once, even if Stripe sends the message again.
// Without STRIPE_WEBHOOK_SECRET it answers 503.

export const dynamic = "force-dynamic";

const SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const TOLERANCE_SECONDS = 5 * 60;

function validSignature(raw: string, header: string | null): boolean {
  if (!SECRET || !header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts.t;
  if (!t || !parts.v1 || Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_SECONDS) return false;
  const expected = createHmac("sha256", SECRET).update(`${t}.${raw}`).digest("hex");
  // Stripe can send several v1 values while a secret is being rolled, so any one may match.
  return header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .some((p) => {
      const given = Buffer.from(p.slice(3), "hex");
      const want = Buffer.from(expected, "hex");
      return given.length === want.length && timingSafeEqual(given, want);
    });
}

export async function POST(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("stripe-signature"))) return NextResponse.json({ error: "bad-signature" }, { status: 400 });

  let event: { id?: string; type?: string; data?: { object?: { id?: string; payment_status?: string; metadata?: Record<string, string> } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const session = event.data?.object;
  const email = session?.metadata?.email?.trim().toLowerCase() ?? "";
  const plan = session?.metadata?.plan;
  if (!session?.id || session.payment_status !== "paid" || !email || !isPlanId(plan)) return NextResponse.json({ ok: true, ignored: true });
  // The number of builds comes from our own plan table, not from anything the visitor could have changed.
  const builds = PLANS[plan].builds;

  try {
    // The same store the builder counts free builds in, so the balance is found when they build again.
    const kv = await withTimeout(getKv(isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"))), 8000, "open usage store");
    const marker = `stripe/${session.id}`;
    const first = await withTimeout(kv.set(marker, { state: "pending", email, builds, at: Date.now() }, { onlyIfNew: true }), 10000, "mark the payment");
    if (!first.modified) {
      const seen = await withTimeout(kv.get(marker), 10000, "read the payment mark");
      const mark = seen?.data as { state?: string; at?: number } | null;
      // A payment is retried when it failed, or when an earlier try started over two minutes ago and never finished.
      const stuck = mark?.state === "pending" && Date.now() - Number(mark.at ?? 0) > 120_000;
      if ((mark?.state !== "failed" && !stuck) || !seen?.etag) return NextResponse.json({ ok: true, duplicate: true });
      const retake = await withTimeout(kv.set(marker, { state: "pending", email, builds, at: Date.now() }, { onlyIfMatch: seen.etag }), 10000, "retry the payment");
      if (!retake.modified) return NextResponse.json({ ok: true, duplicate: true });
      first.etag = retake.etag;
    }
    try {
      await withTimeout(addCredits(kv, email, builds), 15000, "add the builds");
    } catch (err) {
      // Let Stripe try again later: mark this one as not done.
      if (first.etag) await kv.set(marker, { state: "failed", email, builds }, { onlyIfMatch: first.etag }).catch(() => {});
      throw err;
    }
    if (first.etag) await kv.set(marker, { state: "done", email, builds }, { onlyIfMatch: first.etag }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("stripe-webhook failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
