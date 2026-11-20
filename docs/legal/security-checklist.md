# Security checklist

Written Nov 19, 2026. Part 1 is for you (account settings only you can change). Part 2 is what the code already does. Part 3 is what to add as the site grows. Tick items off and date them.

## Part 1: your accounts (do these first)

For **every** account below: turn on two-step sign-in with an authenticator app or a passkey (not text messages), keep recovery codes printed or in a password manager (not in email), and use a unique password from a password manager.

| Account | Why it matters | Done |
|---|---|---|
| Google / Gmail (justonwarthen@gmail.com) | Password resets for almost everything go here. The most important one. | [ ] |
| GitHub | Holds the code. Whoever controls it can change the site. Also turn on "secret scanning" and require sign-in with two steps. | [ ] |
| Netlify | Runs the site and holds the stored records and secret keys. | [ ] |
| Stripe | Money. Also turn on login alerts and keep the number of people with access at one. | [ ] |
| Resend | Sends email as you. Check the domain's SPF, DKIM, and DMARC are all set to "verified". | [ ] |
| Anthropic console | The AI key. Set a monthly spending limit and an alert. | [ ] |
| Domain registrar (thewarthens.com) | If it is taken, the whole site is. Turn on the registrar lock and two-step sign-in, and make sure auto-renew is on and the card is current. | [ ] |
| YouTube / Google channel | Your audience. Same two-step sign-in. | [ ] |
| ElevenLabs, Canva, others you use | Lower risk, same habit. | [ ] |
| Your Apple ID | Controls your devices and backups. | [ ] |

## Part 2: what the code already does (verified in the code)

- Secret keys live in Netlify settings, not in the code. `.env` files are ignored by git, and a scan of the committed files found no keys.
- Your owner code file on this Mac is readable only by you (permissions 600), and the site compares codes in a way that does not leak information about them.
- Card numbers never reach us: Stripe handles them. Stripe's messages to our site are signature-checked.
- Emails in usage counters are stored scrambled (SHA-256).
- Forms check the page they came from, have limits per visitor, and the contact form has a hidden trap for bots.
- Unsubscribe links are signed, so they only work for the person they were sent to.
- The tools that send email can only send to the address the person typed, with a fixed message, and a limited number of copies.
- Owner-only pages and actions need the owner code.
- The AI is told to treat resumes, postings, and anything pasted as data and ignore instructions inside them.

## Part 3: add as the site grows

1. **Rotate keys** on a schedule (every 6 to 12 months), and right away if a key ever appears in chat, a screenshot, a log, or an email. This includes the owner code. Keys to rotate: Anthropic, Resend, Stripe secret and webhook secret, the owner code.
2. **Limits that survive scale.** The per-visitor limits are kept in memory on each server instance, so at high traffic a determined abuser could get more. Add Netlify's rate limiting or firewall rules when traffic grows. The monthly caps and the Anthropic spending limit are your real backstop.
3. **Alerts:** a Resend usage alert (you hit the daily limit once already), Stripe failed-payment emails (already wired to alert you), Netlify deploy and function-error notifications.
4. **Dependencies:** run `npm audit` monthly and update packages with security fixes.
5. **Backups:** the stored lists (waitlist, occasional-note list, partners) are only in Netlify Blobs. Export them monthly (the send scripts can read them) and keep the export somewhere private.
6. **Access:** when anyone else is ever given access to Netlify, GitHub, or Stripe, give the least access that works, and remove it when they leave.
7. **Vulnerability contact:** add a `/.well-known/security.txt` with a contact email so researchers have somewhere to report problems.
8. **If something goes wrong:** (a) rotate the key involved, (b) look at the provider's logs for what was accessed, (c) if personal data was involved, tell the people affected and any state attorney general the law requires, and (d) write down what happened. Do not delete logs.
9. **Moving to the new Mac:** use a new device only after signing out of the old one on each account, and keep the repo out of cloud-synced folders (the iCloud guard script already covers this).
10. **Enterprise customers later:** SOC 2 and a penetration test only when a company or school asks for them.
