# Site-wide SEO playbook (Nov 16 2026)

What was done in the full-site SEO sweep, how to keep it healthy, and what only the owner can do.
Related: `resume-seo-playbook.md`, `techjr-seo-playbook.md`.

## What the audit found (51 indexable pages)

Already strong: every page had a canonical, one H1, social share images (except one index page), images with alt text,
and structured data (FAQ, Article, Breadcrumb, HowTo, VideoObject, WebApplication).

Gaps that were fixed:

| Gap | Fix |
| --- | --- |
| 10 titles over 60 characters (cut off in results) and 4 under 30 | Rewrote titles to 40 to 60 characters, led with the question people type. Search-only text lives in `src/lib/seo.ts`, the on-page headlines did not change. |
| 14 descriptions over 160 or under 110 characters | Rewrote all to 110 to 160. |
| Breadcrumbs pointed to `#fragments` of other pages | Added real listing pages: `/tech/guides`, `/tech/start-here`, `/faith/topical-study` (and `/faith/reflections`, `/faith/story-time` when they have pieces). Breadcrumbs now point to them. |
| No About page, no named authors/people in structured data | Added `/about` (who we are, how we work and are paid) and a site-wide `WebSite` + `Organization` + two `Person` graph in `src/lib/site-schema.ts`, rendered by the layout. Pages refer to it by `@id`. |
| `/#website` and `/#organization` were referenced but never defined | Defined in the site-wide graph. |
| `/resume/guides` had no share image; the leader guide had no structured data | Fixed both. |
| Thin internal linking | Footer now links About, Hype vs. Reality, Start Here, the scanner, and resume guides. Hub pages link down to every article; the Tech and Faith pages link to the hubs. |
| Content gap for long-tail searches | Six new resume and cover letter guides (keywords from a job description, resume summary, resume length, no experience, explaining a gap, short cover letter), each linking to the scanner and builder. |
| Heavy images (about 9 MB of team and Women Who Seek photos) | Resized to web size (saved about 7 MB). |
| `/ocr` files re-checked on every visit | Long cache header added in `next.config.ts`. |
| `llms.txt` out of date | Updated with the new pages. |

## Rules to keep

- Title 40 to 60 characters, description 110 to 160. Put the question or the thing people search for first.
- One H1 per page. Every image gets real alt text.
- No made-up ratings, reviews, or statistics in structured data. Only mark up what is visible on the page.
- New article: add it to its data file, it appears in the sitemap and its hub automatically. Add a line to `public/llms.txt`.
- After a push that adds pages: `python3 scripts/indexnow.py`.

## Owner to-dos (only you can do these)

1. **Google Search Console**: request indexing for the new pages: `/about`, `/tech/guides`, `/tech/start-here`, `/faith/topical-study`, the six new `/resume/guides/...` pages, `/resume/keyword-matcher`. Resubmit the sitemap.
2. **Bing Webmaster Tools**: same (IndexNow already pings Bing).
3. **Links back to the site** (the biggest ranking factor we cannot code): put thewarthens.com/resume, /resume/keyword-matcher and /tech in the YouTube descriptions and pinned comments, and in the Instagram and TikTok bios. Ask partners and guests to link to your guides.
4. **About page**: your background (hospitality, house cleaning, church, neighborhood and high school mentoring) is now on it. If you want more credibility, add specific roles and years later. Only true facts.
5. **Check weekly for 4 weeks**: Search Console, Performance, which queries and pages get impressions. Tell Claude which queries show up and it will write pages for the ones with impressions but no clicks.
6. **Core Web Vitals**: after the push, run PageSpeed Insights on `/`, `/tech`, `/resume`, and one guide, and send the scores if any are under 90.

## Not done on purpose

- No keyword stuffing, hidden text, or fake FAQs.
- No `AggregateRating` or review markup (there are no real reviews to mark up).
- No pages for the sake of pages: each new page answers a real question people search for.
