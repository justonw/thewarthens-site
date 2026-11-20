# Data map: where visitor data goes

Written from the site's code on Nov 19, 2026. This is the base the privacy policy is written from. Anything marked **CONFIRM** is a fact only the account owner (or the provider's own terms) can settle: retention periods and settings. Keep this file current: when a feature changes what is collected or where it goes, change this table first, then the policy.

## 1. What each tool collects, and where it goes

| Tool / page | What the person gives us | Where it goes | Do we keep a copy? |
|---|---|---|---|
| **Resume Builder** (tailor, general, from scratch) | Resume (text, files, screenshots), job posting (text, link, files), optional notes, email, "how you found us" | Browser to our server to the AI provider (Anthropic), and the result back to the browser. A notification email goes to the owner: the person's email, the job title, and how they found us. | **Resume and posting text: no.** Server keeps only counters (see section 3). |
| **Gap coach, "I have this", numbers coach, Answers, Interview prep, Reach out** | Resume content, posting, what the person types in answers, true stories, a recipient's name and any text or screenshots about that person | Browser to our server to the AI provider, and back | **No.** Counters only. |
| **Email me a copy** | The email address; the PDF and Word files are built in the browser and passed through | Browser to our server to Resend, to the person's inbox | **No** copy on our side. Resend keeps its own logs (CONFIRM). |
| **Site guide chat** | The question typed | Browser to our server to the AI provider | No. Not logged. |
| **Job link paste** | A link to a public job posting | Our server fetches that page's text | No. |
| **Keyword checker** | Resume text and posting text | Handled in the browser | Not sent to us (CONFIRM in code before the policy says so). |
| **Voice input** (microphone on resume fields) | Spoken words | The browser's built-in speech recognition. In Chrome and some others, the browser maker's servers turn the audio into text. | We never receive the audio. |
| **"Occasional note" list** (Tech and Faith pages) | Email, which page, date | Saved in our store; the person gets a hello email; owner gets an alert | Yes, until they unsubscribe. We keep the unsubscribe record so they are not emailed again. |
| **Resume waitlist** | Email, date | Saved in our store; owner gets an alert | Yes. |
| **Contact form** | Name, email, topic, message, optional story | Emailed to the owner through Resend | Only in the owner's inbox. |
| **Coaching intake** | Name, email, phone, LinkedIn, answers, areas, consent box | Emailed to the owner through Resend | Only in the owner's inbox. |
| **"Present but Missing" PDF** | The address typed, the answers | One email to that address through Resend | No. Not logged. |
| **Buying more builds** | Email; card details are typed on **Stripe's** page and never reach us | Stripe; Stripe tells our server a payment finished (email, amount, ids) | Yes: a balance for that email (stored under a scrambled version of the email), plus a payment marker. |
| **Partner program** | Partner's name, email, payout details (owner enters these); each referred build is tied to a partner by code | Our store | Yes, until the partner is removed. Referred customers are never named to partners. |
| **Tech Jr. (kids' game and quiz)** | Optional first name typed in the character step (12 characters) | Stays in the browser's memory. Our code makes no request with it and does not save it. | **No.** (CONFIRM by testing in a browser's network panel before the policy says "nothing is sent or saved".) |

## 2. Who processes data for us (the "service providers")

| Provider | Role | What it can see | Retention: **CONFIRM** |
|---|---|---|---|
| **Anthropic** (the AI) | Writes the resume, answers, interview prep, notes, guide replies | Everything sent for those tasks | Their API data-retention and training terms, and whether zero-retention is offered on our account. Read the current commercial terms and data-retention page, and write the exact promise from them. |
| **Resend** | Sends email: owner alerts, resume copies, hello emails, notes, payout reminders | Recipient addresses, subjects, bodies, attachments | Email log and content retention under our plan. Check the Resend dashboard. |
| **Stripe** | Takes payment | Card and billing details, email | Stripe's own terms. We never touch card numbers. |
| **Netlify** | Hosts the site; runs the server code; stores our counters and lists (Netlify Blobs); keeps server logs | Request logs (which can include IP addresses and URLs), our stored records | Log retention under our plan. Check Netlify. Blobs keep data until we delete it. |
| **Embedded videos** (YouTube on several pages) | Plays videos on the page | YouTube may set cookies and see that the page was viewed | YouTube's own terms. |
| **GitHub** | Holds the source code (not visitor data) | Code only | n/a |

No third-party analytics, advertising pixels, or tracking scripts were found in the code. Step counts are our own (section 3).

## 3. What our own store holds (Netlify Blobs)

| Record | Contains | Email stored as |
|---|---|---|
| Monthly usage counters (builds, answers, interview prep, notes, numbers) | A number per person per month | **Scrambled** (SHA-256 of the email) |
| Build marks | State of one build (started, done, refunded), paid or free, time | Scrambled |
| Purchased-build balances | A number | Scrambled |
| Partner email locks | Which partner code an email is tied to | Scrambled |
| Free-build grants (owner gives extra builds) | Email, number, date, optional note | **Plain** |
| Resume waitlist | Email, date, when notified | **Plain** |
| "Occasional note" list | Email, source page, dates, unsubscribe, which notes were sent | **Plain** |
| Partners | Code, name, email, rate, payout details, clicks, sales ledger | **Plain** (partner's own) |
| Stripe payment markers | Email, number of builds, state | **Plain** |
| Funnel counts | A number per step per day | No person at all |

## 4. What stays only on the person's own device (browser storage)

Draft resume, saved builds ("My applications"), true stories, tracker, saved profile, chosen look, partner referral code, "guide seen", this-week and checklist notes, and the Present but Missing notes. We do not receive these unless the person sends them through a form above. Clearing browser data erases them.

## 5. Owner-side copies

The owner's inbox holds: the "New resume built" alerts (email, job title, source), "New friend" and waitlist alerts, contact and coaching messages, and payment alerts. These are copies of the data above and follow the owner's mail account.

## 6. Things to settle before the policy goes live

1. Retention for Anthropic, Resend, Netlify logs (see the tables).
2. A retention period for purchase records, contact messages, and coaching intake (suggested: purchase records 7 years for tax; contact and coaching 24 months; waitlist until the pack launches, then 12 months).
3. Confirm the keyword checker sends nothing to the server.
4. Confirm the Tech Jr. first-name box never leaves the browser (network panel check).
5. Decide the privacy request email address.
