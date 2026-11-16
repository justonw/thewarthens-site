# Resume Builder SEO playbook

Written Nov 16 2026. Scope: the Resume Builder (`/resume`) and the guides around it (`/resume/guides/*`). Everything marked **Built** is in the code. Everything marked **You** needs a person with the Google, Bing, or YouTube login.

## 1. The honest picture

The market for "tailor resume to job description" is crowded. I searched the results and found Kickresume, Enhancv, Huntr, Teal, Rezi, Jobscan and many smaller tools on the first pages for the main terms, plus dozens of "how to tailor your resume" guides from resume companies. I could not pull search volumes (no keyword-tool access), so everything below is a ranking-difficulty read from live results, not a traffic forecast.

What this means:

- **We will not win the head terms soon** ("resume builder", "ATS resume checker", "tailor resume to job description"). Those belong to companies with years of links.
- **We can win specific, honest, long-tail searches**, and we can win them with things the big players do not do: a builder that never invents experience, a sourced evidence section that admits what the data does and does not prove, and a clear explanation of every change.
- **Our natural audience is career changers**, which is where Tech Journey already has trust, a YouTube channel, and guides. That is the lane to own.
- Expect weeks to months for new pages to be indexed and start to rank. Nothing here is instant, and no one can promise a position.

## 2. Audit (before)

| Area | Before | Problem |
| --- | --- | --- |
| Title and description | Description was about 230 characters | Google cuts it off at about 160, so the sentence that sells the page was truncated. |
| Pages | One page (`/resume`) | A single page cannot rank for dozens of different questions. No pages answered "how do I tailor a resume" or "what do ATS systems read". |
| Structured data | WebApplication, FAQ, Breadcrumb | Missing last-modified date, feature list, and free-access flags. |
| Internal links | `/tech`, the toolkit, and the home page (now) | No guide pages to link to, so no topical cluster. |
| Sitemap | `/resume` only | New pages must be listed. |
| AI answer engines | `llms.txt` listed the builder only | Guides should be listed so assistants can cite them. |
| Bing | Sitemap submitted | No instant-notify (IndexNow). |

## 3. Strategy

One cluster, one hub, one job per page. Every guide answers a question people type, links to the builder, and links to two sibling guides. The hub page links to all of them, and `/resume` links to the hub. That gives search engines a clear topic ("resumes tailored to jobs") with the builder at the center.

### Keyword map

| Page | Primary query | Also targets |
| --- | --- | --- |
| `/resume` | tailor resume to job description (free) | resume and cover letter generator, AI resume tailor, free resume builder with cover letter |
| `/resume/guides` | resume and cover letter guides | (hub: passes authority to the guides) |
| `/resume/guides/tailor-resume-to-job-description` | how to tailor your resume to a job description | customize resume for each job, match resume to job description, resume keywords from job posting |
| `/resume/guides/ats-friendly-resume` | ATS friendly resume | ATS resume format, resume formatting for ATS, applicant tracking system resume tips |
| `/resume/guides/career-change-resume` | career change resume | resume for career change, career changer resume, transferable skills resume |
| `/resume/guides/who-to-address-a-cover-letter-to` | who to address a cover letter to | cover letter greeting no name, "to whom it may concern" alternative, how to start a cover letter |

## 4. What I built

**Built: technical**
- `/resume` title shortened to 55 characters with the main phrase first. Description cut to 147 characters.
- Structured data on `/resume` now has a last-modified date, a free-access flag, a feature list, and a plain description of the free offer. Nothing in it is a rating or a review, because we have none and will not invent them.
- Four guides and a hub, each with one H1, a canonical URL, Article, WebPage, Breadcrumb and FAQ structured data, a table of contents, related-guide links, and its own share preview image.
- Titles are 46 to 57 characters and descriptions 136 to 155.
- All pages are in the sitemap with real dates. `llms.txt` lists them for AI answer engines. `robots.txt` already welcomes search and AI crawlers.
- IndexNow: a key file in `public/` and `scripts/indexnow.py`, which tells Bing and other IndexNow engines about new or changed pages.

**Built: content (4 guides, about 3,500 words).** Every number in them comes from a source already on the site (the Huntr and Jobscan figures in "See the evidence"). The before-and-after example is labeled as made up. The guides say plainly that the evidence is not a controlled study. No em dashes, no promises about outcomes.

**Built: internal links.** A "Resume and cover letter guides" block on `/resume`, a breadcrumb on every guide that leads back through the hub to the builder, a call to action on every guide, and related-guide cards.

## 5. Things you need to do (I cannot log in for you)

Do these after the pages are live (after the push and deploy).

1. **Google Search Console**: open URL Inspection for each of these, press **Request indexing**:
   - `https://thewarthens.com/resume`
   - `https://thewarthens.com/resume/guides`
   - the four guide URLs
   Google limits how many you can request a day, so do these six today. Then check the **Sitemaps** report shows the sitemap as Success.
2. **Bing**: nothing manual if you run the IndexNow script (see below). In Bing Webmaster Tools, check the sitemap shows Success.
3. **YouTube**: add the `/resume` link, and a link to the tailoring guide, to the description of the resume video and pin a comment with it. YouTube links are one of the few fast sources of real visitors, and visitors who stay are a signal too.
4. **Share it where it is useful, not spammy**: a helpful answer in career-change communities (Reddit, LinkedIn groups) that links to the guide when it truly answers the question. One genuine mention beats ten drive-by links.
5. **Ask people who used it for a short quote** (real ones only). When you have three or four, tell me and I will add them to the page. I will never write one.
6. **Watch Search Console weekly** (Performance, then Pages, filter `/resume`). After 4 to 6 weeks, look at which queries show impressions with a low click rate, and tell me. That is the data that decides the next pages.

## 6. IndexNow (run once after each deploy)

```
python3 scripts/indexnow.py
```

It sends every URL in the sitemap. To send only some: `python3 scripts/indexnow.py /resume /resume/guides`. Google does not use IndexNow, so Search Console (step 1 above) is still how you tell Google.

## 7. What is next (not built yet)

In order of what I would do:

1. **A free keyword matcher** at `/resume/keyword-matcher`: paste a resume and a posting, see which of the posting's key phrases are and are not in the resume. It runs in the browser, so it costs nothing per use. Free tools like this earn links and searches ("resume keyword scanner" is a real query). The builder is then the natural next step. Risk: many competitors have one, so it must be clearly better (all keywords, not the top five).
2. **Role pages for the audiences we already reach**, written with real substance and not templated: for example a sales development resume with no experience, a cybersecurity or IT help desk career-change resume. These match Tech Journey's videos and guides, and they are the searches we have the best claim to.
3. **A comparison page** ("ChatGPT vs a resume builder for tailoring") only if it can be fair and sourced. A pure sales page would not help.
4. **Core Web Vitals check** on `/resume` (the page loads a large builder). Test it with PageSpeed Insights once it is live, and send me the numbers if any are red.
5. **Real reviews**: once there are paying customers, an optional review request in the receipt email. Only then can the page carry a rating, and only a true one.

## 8. What we will not do

- Fake testimonials, ratings, or live counters.
- Mass-produced pages with the same text and a different city or job title swapped in. Search engines treat them as thin, and they would hurt the pages that are good.
- Hidden text, keyword stuffing, or buying links.
- Claim an outcome ("get hired") the evidence does not support.
