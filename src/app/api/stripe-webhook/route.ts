import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { addCredits, addPurchased, getKv, withTimeout, type Kv } from "@/lib/resume-limits";
import { OWNER_ALERT_EMAIL, escapeHtml, sendMail } from "@/lib/mail";
import { PLANS, isPlanId } from "@/lib/resume-plans";
import { isLiveHost } from "@/lib/coaching-recipients";

// Stripe calls this when a payment finishes. It checks Stripe's signature, then adds the builds that were
// bought to that email's balance. Each checkout is counted once, even if Stripe sends the message again.
// Without STRIPE_WEBHOOK_SECRET it answers 503. Every way a payment can fail to turn into builds sends an alert to the
// owner, so it is never found out about from an unhappy customer: a bad signature (usually a wrong webhook secret),
// a paid checkout that could not be matched to an address and pack, and a failure while adding the builds.

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

// Sends an alert at most once for each key (and the keys below include the hour or the payment), so a flood of bad
// requests or Stripe's own retries cannot flood the inbox.
async function alertOnce(kv: Kv | null, key: string, subject: string, html: string) {
  try {
    if (kv) {
      const first = await withTimeout(kv.set(`alert/${key}`, { at: Date.now() }, { onlyIfNew: true }), 5000, "mark the alert");
      if (!first.modified) return;
    }
    await sendMail(OWNER_ALERT_EMAIL, subject, html);
  } catch (err) {
    console.error("stripe-webhook: could not send an alert", err instanceof Error ? err.message : err);
  }
}

const hourKey = () => new Date().toISOString().slice(0, 13);

export async function POST(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("stripe-signature"))) {
    // Most often this means STRIPE_WEBHOOK_SECRET in Netlify does not match the endpoint in Stripe, which would make
    // every real payment fail quietly. At most one alert an hour.
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
    const kv = await withTimeout(getKv(live), 5000, "open usage store").catch(() => null);
    await alertOnce(
      kv,
      `badsig/${hourKey()}`,
      "Stripe webhook: a request failed its signature check",
      "<p>A request to the Stripe webhook did not pass the signature check. If a customer just paid, the <strong>STRIPE_WEBHOOK_SECRET</strong> in Netlify probably does not match the webhook in Stripe, and their builds were NOT added. Compare the two, then resend the event from Stripe (Developers, Webhooks, the event, Resend).</p><p>If nobody paid, this was probably a stray request and can be ignored.</p>"
    );
    return NextResponse.json({ error: "bad-signature" }, { status: 400 });
  }

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
  if (session?.id && session.payment_status === "paid" && (!email || !isPlanId(plan))) {
    // Money was taken, but the payment cannot be matched to an address and a pack, so nothing was added.
    const kv = await withTimeout(getKv(isLiveHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"))), 5000, "open usage store").catch(() => null);
    await alertOnce(
      kv,
      `unmatched/${session.id}`,
      "Stripe: a payment could not be matched to builds",
      `<p>A paid checkout (<strong>${escapeHtml(session.id)}</strong>) has no usable email or pack in its details, so no builds were added. Open it in the Stripe dashboard and add the builds by hand, or refund it.</p>`
    );
  }
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
    let balance: number | null = null;
    try {
      balance = await withTimeout(addCredits(kv, email, builds), 15000, "add the builds");
      // How many have ever been bought, so results can say "paid build 3 of 15". Not worth failing the payment over.
      await withTimeout(addPurchased(kv, email, builds), 8000, "count the purchase").catch((err) => console.error("stripe-webhook: could not count the purchase", err instanceof Error ? err.message : err));
    } catch (err) {
      // Let Stripe try again later: mark this one as not done.
      if (first.etag) await kv.set(marker, { state: "failed", email, builds }, { onlyIfMatch: first.etag }).catch(() => {});
      throw err;
    }
    if (first.etag) await kv.set(marker, { state: "done", email, builds }, { onlyIfMatch: first.etag }).catch(() => {});

    // A receipt for the buyer, and a note for the owner. Both are best effort: the builds are already added.
    const p = PLANS[plan];
    await Promise.all([
      sendMail(
        email,
        `Your ${p.label} are ready`,
        `<p>Thank you! Your payment of ${p.display} went through, and <strong>${builds} resume ${builds === 1 ? "build was" : "builds were"} added</strong> to ${escapeHtml(email)}.</p>
<p>${balance !== null ? `You now have <strong>${balance}</strong> paid ${balance === 1 ? "build" : "builds"} ready to use. ` : ""}Go to <a href="https://thewarthens.com/resume">thewarthens.com/resume</a> and use this same email address. Each build comes with a cover letter if you want one, and the finished files can be emailed to you.</p>
<p>Questions? Reply to this email.</p>
<p>The Warthens</p>`
      ),
      sendMail(
        OWNER_ALERT_EMAIL,
        `New purchase: ${p.label} (${p.display})`,
        `<p>${escapeHtml(email)} bought <strong>${escapeHtml(p.label)}</strong> for ${p.display}. ${builds} ${builds === 1 ? "build was" : "builds were"} added.</p><p>Stripe checkout: ${escapeHtml(session.id)}</p>`
      ),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("stripe-webhook failed", err instanceof Error ? err.message : err);
    // Stripe will try again, but the owner should know a payment is not yet turned into builds.
    await alertOnce(
      null,
      "",
      "Stripe: a payment did not turn into builds yet",
      `<p>A payment from <strong>${escapeHtml(email)}</strong> (checkout ${escapeHtml(session.id)}, ${escapeHtml(PLANS[plan].label)}) was received, but adding the builds failed: ${escapeHtml(err instanceof Error ? err.message : "unknown error")}.</p><p>Stripe retries automatically over the next hours. If their builds still are not there in a few hours, add them by hand or refund the payment.</p>`
    );
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
