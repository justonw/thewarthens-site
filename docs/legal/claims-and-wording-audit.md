# Claims and wording audit (resume pages and Tech Jr.)

Done Nov 19, 2026. I searched the resume pages, components, and guides for statements about results, privacy, and security. The rule behind every item: **say only what is true and what we can back up.**

## Fixed in this pass (code changed, not pushed)

| Where | Was | Now |
|---|---|---|
| `GeneralTarget.tsx` | "A resume matched to one job description gets read more often than a general one." (a flat results claim with no source) | "...tends to do better than a general one, though no one can promise a result." |
| `ResultView.tsx` (Email me a copy) | Said only where copies go | Adds: "Emailing sends your resume and cover letter through our email service (Resend)." |

## Already good (keep)
- The resume FAQ "Does tailoring really get more interviews?" and the tailoring guide are careful: they cite sources, say the numbers come from job-search companies, say no independent study was found, and say "we don't promise a number." This is the standard to match elsewhere.
- The scanner note in the result screen says a clean view "is a good sign, not a guarantee."
- The build button's notice already says the resume goes to Anthropic's Claude, that email copies go through Resend, and that we may send occasional resources.

## Needs your decision (not changed)

1. **Profile panel wording:** "Kept in this browser only. We never receive it." This is true of the saved profile file, but a person who later builds a resume from that content does send it to us to build. Suggested: "Kept in this browser only. We never receive it unless you use it to build." Low risk, easy to make.
2. **Tech Jr. privacy list:** "No sign-in, no accounts, and no forms." There is an optional first-name box. It appears to stay in the browser (the code makes no request with it), but "no forms" is a hair loose. Suggested: "No sign-in and no accounts. Nothing a child types is sent or saved." Confirm in a browser's network panel first.
3. **Reply-to-opt-out wording** at the build button: "Reply to any email from us to opt out." Replying is allowed as an opt-out for marketing email, but a one-click unsubscribe link is the safer practice. Check that the resource emails sent after builds include a link and the mailing address.
4. **"Free" and "no sign-up" claims:** keep them only where true. The first 2 builds are free per email; later builds are paid. The wording already says "first 2 builds are free." Keep it.
5. **Word "secure":** "You pay on Stripe's secure page" is fine because it is about Stripe's page. Avoid "bank-level", "military-grade", or "100% secure" anywhere.
6. **Pricing and results words to avoid going forward:** "guaranteed", "get hired", "beats the ATS", "#1", "proven". Keep "tends to", "can help", "built to".

## Rules for new copy
- A statistic needs a source and an honest note on its limits, as in the FAQ.
- Privacy statements must match data-map.md exactly. If the data map changes, change the statement.
- Never promise "anonymous", "never", or "private" unless it is literally true everywhere the data goes.
- Partner and affiliate mentions need a plain disclosure ("we may earn a commission").
