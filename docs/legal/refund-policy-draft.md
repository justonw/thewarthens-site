# Refund Policy (DRAFT, needs your decision)

> **Status: draft. Not live.** I could not find a written refund policy on the site, so the choices below are my recommendation. **Decide the bracketed items.** An attorney or CPA should confirm that it matches your Stripe settings and state rules.

**Effective [DATE]**

## What you are buying
A pack of resume builds. Builds are added to the email address you used at checkout, right after payment.

## Builds that do not work
If a build fails or a result never reaches you, we give the build back automatically. You never use up a build for a document you did not receive.

## Refunds
- **Unused builds:** if you have not used any builds from a pack, you may ask for a full refund within **[7]** days of purchase.
- **Used builds:** builds that have been used are **not** refundable, because the AI work is done as soon as you use one. If you used only some builds, we may refund the unused ones at our discretion: **[DECIDE: refund the unused portion, or no partial refunds]**.
- **Problems with a document:** if a result has a real problem you cannot fix by editing, contact us and we will make it right, with a replacement build or a refund at our discretion.

## How to ask
Email **[CONTACT EMAIL]** from the address you used at checkout, and tell us the date of purchase. We reply within **[3]** business days. Approved refunds go back to the original payment method through Stripe, and your card issuer decides how long it takes to appear (usually 5 to 10 business days).

## Notes for you (not part of the policy)
1. Your payment webhook already handles refunds from Stripe, including partner commission clawbacks. Make sure the `charge.refunded` event is switched on in Stripe so refunds are reflected.
2. The partner agreement should say commissions on refunded sales are returned.
3. If the Job Search Pass or a larger bundle launches, this policy needs a line for it.
