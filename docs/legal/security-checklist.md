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

## Results of the checks run on Nov 19, 2026

**Domain and email (public records)**
- Registrar: Squarespace Domains (formerly Google Domains). Transfer lock and delete protection are ON. Expires Aug 25, 2027: confirm auto-renew.
- Resend DKIM record is present. Confirm "verified" in the Resend dashboard.
- **DMARC is `p=none`** (monitor only), so fake email from your domain is not blocked. Plan: after a few weeks of clean reports, move to `p=quarantine`, then `p=reject`. Reports go to Mailgun and an OnDMARC inbox.
- **The Mailgun records are Squarespace's email forwarding, not a separate account** (confirmed Nov 19 in Squarespace Domains > Email: `info@thewarthens.com` forwards to `techjourneyinfo@gmail.com`). Do not delete the MX or SPF records: they make `info@` work. There is no Mailgun login to secure.
- **`techjourneyinfo@gmail.com` is a critical account:** it receives everything sent to `info@` (contact form, replies from the public) and the site's alerts (payments, sign-ups, signature failures). It needs the same protection as your main Google account: unique password in the manager, two-step with a passkey or authenticator, backup codes saved.
- DNSSEC: unknown, check at the registrar. CAA: none (optional).

**This Mac (read-only checks)**
- macOS 26.6.2, FileVault on, firewall on (stealth mode off, optional), System Integrity Protection on, Gatekeeper on, no management profiles, no cron jobs, Remote Login and Screen Sharing closed.
- Listening ports: AirPlay Receiver (ports 5000, 7000) and Apple's Handoff service are normal; turn AirPlay Receiver off in System Settings > General > AirDrop & Handoff if you do not use it.
- Startup helpers found: Zoom, Microsoft Teams updater, FxFactory, Camo (Reincubate camera helper), Epic Games, Google updaters. Nothing unexpected, but Teams, FxFactory, Camo, and Epic run with high privileges: uninstall any you no longer use.
- Recent sign-ins: only local ones.
- Not confirmed: automatic update settings and "require password immediately" on the lock screen. Check both in System Settings.
- Result: no sign of compromise. No paid scan needed.

## Step by step: what to do now, in order
1. **Google account** (10 min): myaccount.google.com, Security, 2-Step Verification, add a passkey or authenticator app, download backup codes, then review "Your devices" and "Third-party access" and remove anything unfamiliar.
2. **Password manager** (10 min): pick Apple Passwords or 1Password. Give GitHub, Netlify, Stripe, Resend, Anthropic, Squarespace, and the techjourneyinfo Gmail each a unique password stored there.
3. **GitHub** (10 min): Settings, Password and authentication, turn on two-factor and save recovery codes; Settings, Code security, turn on secret scanning and push protection.
4. **Netlify** (5 min): Account settings, Security, turn on two-factor.
5. **Stripe** (5 min): Settings, security, turn on two-step authentication and login alerts; when you go live, create ONE live webhook with `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `charge.refunded` (deferred: Stripe is still in sandbox; never add a second destination, the site has one signing secret).
6. **Squarespace (domain)** (10 min): two-step sign-in, confirm the lock, auto-renew, and card; look for DNSSEC.
7. **Anthropic console** (5 min): Settings, limits, set a monthly spend limit and an email alert; two-step if offered.
8. **Resend** (10 min): confirm the domain says verified; set a usage alert.
9. **techjourneyinfo@gmail.com** (10 min): password in the manager, 2-Step Verification (passkey or authenticator app), backup codes saved, review devices and third-party access. This is where `info@thewarthens.com` mail lands. (There is no Mailgun account; those DNS records are Squarespace's forwarding. Leave them alone.)
10. **YouTube / Apple ID** (10 min): two-step sign-in.
11. **Mac** (10 min): System Settings, check automatic updates and "Require password immediately after screen saver or display off", and uninstall unused apps with privileged helpers.
12. **Look at active sessions** in Google, GitHub, Netlify, and Stripe and sign out anything you do not recognize.
