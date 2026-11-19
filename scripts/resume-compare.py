#!/usr/bin/env python3
"""Compares the live Resume Builder with a plain "rewrite this resume for this job" request, across people from many industries.

Why: one resume and one job say little. This runs a set of fictional US job seekers (restaurant, nursing, trades, trucking,
teaching, accounting, call center, entry level, and more) through three requests each, and checks them:

  tailored  the real tailored build (what visitors get)
  baseline  the same model with a plain one-line prompt, the way someone would ask a general chatbot (owner only)
  general   the real general-resume build (no posting, just a target role)

Plain-code checks on every result (no AI grading): numbers, credentials, and tools that are NOT in the person's resume
(possible invention), dashes, pronouns, the title under the name, how many jobs were kept, how many of the posting's key terms
show up, and for general resumes whether the summary announces an "aiming to" move.

It also writes a BLIND sheet: for each person the tailored and baseline resumes as "A" and "B" in random order, with the key
in a separate file, so the two can be read and scored without knowing which is which.

  python3 scripts/resume-compare.py                       # everyone, against https://thewarthens.com
  python3 scripts/resume-compare.py --only nurse,trades
  python3 scripts/resume-compare.py --variant v2          # compare the owner-only v2 prompt instead of v1

The owner code is read like scripts/resume-eval.py (RESUME_OWNER_CODE, or ~/.resume-owner-code). Nothing is counted against
anyone's builds and nothing is emailed. Results go to ./resume-evals/compare-<time>/ (ignored by git).
"""
import argparse, importlib.util, json, os, random, re, ssl, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

CTX = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None
HERE = Path(__file__).resolve().parent

spec = importlib.util.spec_from_file_location("scenarios", HERE / "resume-scenarios.py")
sc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sc)

# ---------- more people, so the set covers many kinds of work ----------
RESUME_TEACHER = """Priya Nair, Columbus OH, 614-555-0123, priya.nair@example.com
Fourth grade teacher, Maple Grove Elementary, Columbus OH, Aug 2016 to present. Teach 26 students across all subjects, write weekly lesson plans, run parent conferences twice a year, and lead the school's reading night. Raised the class's average reading scores by two grade levels over a school year (2023). Mentor two student teachers each fall. Teaching assistant, Westerville City Schools, 2014 to 2016.
B.S. Elementary Education, Ohio University, 2014. Ohio teaching license. Skills: Google Classroom, Microsoft PowerPoint, classroom management, public speaking."""
POST_TRAINER = "Corporate Trainer at a regional healthcare company. Design and deliver onboarding and compliance training to new employees, build slide decks and short guides, run live sessions and virtual classes, and track completion. Requirements: 2+ years teaching or training experience, strong presentation skills, comfort with learning platforms and PowerPoint."
RESUME_CDL = """Terrence Bell
Memphis, TN | 901-555-0190 | terrence.bell@example.com
CDL-A driver, Mid-South Freight, 2017 - present. Run regional routes 5 days a week, about 2,400 miles. Pre-trip inspections, DOT log books, on-time delivery record, loading and securing freight, talk with dispatch daily. No at-fault accidents.
Forklift operator, Delta Distribution, 2013 - 2017. Loaded and unloaded trucks, scanned inventory with handheld scanner.
CDL Class A, HazMat and tanker endorsements. High school diploma. Forklift certified."""
POST_DISPATCH = "Freight Dispatcher at Riverbend Logistics, Memphis TN. Plan and assign loads to drivers, track shipments, talk with drivers and customers, solve delays, keep records in the transportation management system. Requirements: 1+ year in trucking, logistics, or warehouse work, clear communication, comfort with computers, able to work some evenings."
RESUME_CPA = """MICHAEL OKAFOR
Charlotte, NC 28202 | michael.okafor@example.com | 704-555-0177 | linkedin.com/in/mokafor-example
PROFESSIONAL EXPERIENCE
Senior Accountant, Carolina Home Supply (retail, 600 employees), Charlotte NC, 2018 - Present
- Prepare monthly close for 4 entities, reconcile bank and credit accounts, and post journal entries
- Built an Excel workbook that cut the monthly accrual process from 3 days to 1 day
- Support the annual audit with schedules and documents; no material findings in 2022 or 2023
- Train and review the work of 2 staff accountants
Staff Accountant, Brennan & Cole CPAs, Charlotte NC, 2012 - 2018
- Prepared tax returns for 120 individuals and 30 small businesses each season
- Performed bookkeeping and payroll for small business clients
Accounts Payable Clerk, Piedmont Textiles, 2009 - 2012
- Processed about 300 invoices a week and handled vendor questions
EDUCATION
B.S. Accounting, UNC Charlotte, 2009
CERTIFICATIONS: Certified Public Accountant (CPA), North Carolina, 2014
SKILLS: QuickBooks, NetSuite, Excel (pivot tables, VLOOKUP), GAAP, reconciliations, month-end close"""
POST_ANALYST = "Financial Analyst at a mid-size manufacturer. Build monthly financial reports and budgets, analyze variances, support forecasting, and present findings to managers. Requirements: bachelor's degree in accounting or finance, 3+ years in accounting or finance, strong Excel, experience with an ERP such as NetSuite, clear writing."
POST_SALESMGR = "Sales Manager at a regional distributor in Miami. Lead a team of sales reps, set monthly targets, coach on closing, and report results to the owner. Requirements: 3+ years in sales, 1+ year leading people, strong negotiation, Excel."

PEOPLE = [
    # key, label, resume, posting, general target, expected number of jobs in the original
    ("restaurant", "Restaurant manager -> account executive", sc.RESUME_RETAIL, sc.POST_SALES, "Sales Representative", 2),
    ("nurse", "Nurse -> cardiac RN (same field)", sc.RESUME_NURSE, sc.POST_NURSE, "Registered Nurse", 2),
    ("trades", "Cabinet installer -> electrician apprentice", sc.RESUME_TRADES, sc.POST_ELEC, "Electrician Apprentice", 2),
    ("entry", "New graduate -> social media coordinator", sc.RESUME_ENTRY, sc.POST_MARKETING, "Social Media Coordinator", 1),
    ("callcenter", "Call center, no dates, messy posting paste", sc.RESUME_NODATES, sc.POST_WEBPAGE, "Customer Service Representative", 2),
    ("teacher", "Teacher -> corporate trainer", RESUME_TEACHER, POST_TRAINER, "Corporate Trainer", 2),
    ("trucker", "CDL driver -> freight dispatcher", RESUME_CDL, POST_DISPATCH, "Dispatcher", 2),
    ("accountant", "Senior accountant -> financial analyst (long)", RESUME_CPA, POST_ANALYST, "Financial Analyst", 3),
    ("spanish", "Spanish-language resume -> sales manager", sc.RESUME_SPANISH, POST_SALESMGR, "Sales Manager", 2),
]

THIS_YEAR = time.localtime().tm_year
TERMS = r"\b(CPA|CDL|RN|LPN|BSN|MBA|PMP|PhD|CNA|BLS|ACLS|OSHA|HazMat|forklift|Six Sigma|Scrum|Python|SQL|Salesforce|HubSpot|NetSuite|QuickBooks|Excel|Canva|Epic|Zendesk|Jira|Google Classroom|PowerPoint|Photoshop|AWS|Tableau)\b"
PRON = re.compile(r"\b(he|she|his|her|him|they|their)\b", re.I)
INTENT = re.compile(r"\b(aiming to|aims to|looking to|seeking to|seeks to|eager to|hoping to)\b", re.I)
NUM = re.compile(r"\$?\d[\d,]*\.?\d*")


def post(base, body, timeout=170):
    req = urllib.request.Request(f"{base}/api/resume-tailor", data=json.dumps(body).encode(), headers={"content-type": "application/json", "origin": base})
    started = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
            return r.status, json.loads(r.read()), round(time.time() - started, 1)
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read()), round(time.time() - started, 1)
        except Exception:
            return e.code, {"error": f"HTTP {e.code}"}, round(time.time() - started, 1)
    except Exception as e:  # a dropped connection or a timeout
        return 0, {"error": str(e)[:100]}, round(time.time() - started, 1)


def flat(doc):
    out = [doc.get("name", ""), doc.get("headline", ""), " | ".join(doc.get("contact", [])), doc.get("summary", "")]
    for s in doc.get("skills", []):
        out.append(f"{s.get('label', '')}: {s.get('items', '')}")
    for j in doc.get("experience", []):
        out.append(f"{j.get('title', '')}, {j.get('company', '')}, {j.get('location', '')}, {j.get('dates', '')}")
        out.extend(f"- {b}" for b in j.get("bullets", []))
    for t in doc.get("training", []):
        out.append(f"{t.get('name', '')} {t.get('detail', '')} {t.get('dates', '')}")
    for e in doc.get("education", []):
        out.append(f"{e.get('school', '')}, {e.get('credential', '')}, {e.get('dates', '')}")
    return "\n".join(out)


def norm_num(s):
    return re.sub(r"[,$]", "", s).rstrip(".")


WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10}


def checks(result, source, kind, expect_jobs, posting=""):
    """Plain-code checks. Returns a list of problems (empty means clean) and a few numbers."""
    doc = result["resume"]
    text = flat(doc)
    problems = []
    src_nums = {norm_num(n) for n in NUM.findall(source)} | {str(v) for w, v in WORDS.items() if re.search(rf"\b{w}\b", source, re.I)}
    # "11 years of experience" worked out from the dates in the resume is arithmetic, not invention: allow any whole number
    # of years between two years the resume gives (or from one of them to this year), give or take one.
    years = sorted({int(y) for y in re.findall(r"\b(19[6-9]\d|20[0-4]\d)\b", source)})
    span = {str(abs(x - y) + d) for x in years + [THIS_YEAR] for y in years + [THIS_YEAR] for d in (-1, 0, 1)}
    new_nums = sorted({norm_num(n) for n in NUM.findall(text)} - src_nums - {""} - {"0", "1"} - span)
    # a 4-digit year the source also has, or a phone number, is not new; dates of a school or job come from the source
    new_nums = [n for n in new_nums if n not in {norm_num(x) for x in NUM.findall(posting)}]
    if new_nums:
        problems.append(f"numbers not in the resume: {new_nums[:6]}")
    src_terms = {t.lower() for t in re.findall(TERMS, source, re.I)}
    new_terms = sorted({t for t in re.findall(TERMS, text, re.I) if t.lower() not in src_terms})
    # a term is only a problem if it is also not just echoing the posting for a skill the person lists
    if new_terms:
        problems.append(f"credentials or tools not in the resume: {new_terms}")
    if re.search(r"[—–]", text):
        problems.append("dash")
    if PRON.search(doc.get("summary", "") + " " + " ".join(b for j in doc.get("experience", []) for b in j.get("bullets", []))):
        problems.append("pronoun about the person")
    if len(doc.get("headline", "")) > 50:
        problems.append(f"headline over 50: {len(doc['headline'])}")
    jobs = len(doc.get("experience", []))
    if jobs < expect_jobs:
        problems.append(f"kept {jobs} of {expect_jobs} jobs")
    if kind == "general":
        if INTENT.search(doc.get("summary", "")):
            problems.append("summary announces an intent to move")
        if result.get("general") is not True or result.get("postingCompany") or result.get("gaps") or result.get("fit") or result.get("coverLetter"):
            problems.append("general result has company, gaps, fit, or a letter")
    keys = result.get("postingKeywords", [])
    low = re.sub(r"[^a-z0-9 ]+", " ", text.lower())
    hit = [k for k in keys if re.sub(r"[^a-z0-9 ]+", " ", k.lower()).strip() and re.sub(r"[^a-z0-9 ]+", " ", k.lower()).strip() in low]
    words = len(text.split())
    return problems, {"keywords": f"{len(hit)}/{len(keys)}", "words": words, "jobs": jobs, "bullets": sum(len(j.get("bullets", [])) for j in doc.get("experience", []))}


def render(doc):
    return flat(doc)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base-url", default="https://thewarthens.com")
    ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
    ap.add_argument("--only", default="", help="comma-separated person keys")
    ap.add_argument("--variant", default="v1", help="prompt version for the tailored run (v1, v2, or v3)")
    ap.add_argument("--skip", default="", help="comma-separated kinds to skip: tailored, baseline, general")
    ap.add_argument("--out", default="resume-evals")
    ap.add_argument("--jobs", type=int, default=3, help="requests at the same time")
    a = ap.parse_args()
    code = os.environ.get("RESUME_OWNER_CODE", "").strip() or Path(a.owner_code_file).expanduser().read_text().strip()
    only = {k for k in a.only.split(",") if k}
    skip = {k for k in a.skip.split(",") if k}
    people = [p for p in PEOPLE if not only or p[0] in only]
    out = Path(a.out) / f"compare-{time.strftime('%Y%m%d-%H%M%S')}"
    out.mkdir(parents=True, exist_ok=True)

    tasks = []
    for key, label, resume, posting, target, expect in people:
        base = {"email": "compare-eval@example.com", "source": "YouTube", "resumeText": resume, "ownerCode": code}
        if "tailored" not in skip:
            tasks.append((key, "tailored", {**base, "postingText": posting, "coverLetter": False, "promptVariant": a.variant}))
        if "baseline" not in skip:
            tasks.append((key, "baseline", {**base, "postingText": posting, "coverLetter": False, "promptVariant": "baseline"}))
        if "general" not in skip:
            tasks.append((key, "general", {**base, "general": True, "targetRole": target}))

    def run(task):
        key, kind, body = task
        status, data, secs = post(a.base_url, body)
        return key, kind, status, data, secs

    results = {}
    with ThreadPoolExecutor(max_workers=a.jobs) as pool:
        for key, kind, status, data, secs in pool.map(run, tasks):
            results[(key, kind)] = (status, data, secs)
            print(f"  done {key:11} {kind:9} HTTP {status} {secs}s", flush=True)

    summary = ["# Resume comparison\n", f"Tailored prompt: {a.variant}. Baseline: plain one-line prompt. General: no posting.\n"]
    totals = {}
    blind, key_lines = [], []
    rng = random.Random(7)
    for key, label, resume, posting, target, expect in people:
        summary.append(f"\n## {label}\n")
        for kind in ("tailored", "baseline", "general"):
            if (key, kind) not in results:
                continue
            status, data, secs = results[(key, kind)]
            if status != 200 or not data.get("ok"):
                summary.append(f"- **{kind}**: FAILED ({status} {str(data)[:140]})")
                totals.setdefault(kind, [0, 0])[1] += 1
                continue
            r = data["result"]
            problems, stats = checks(r, resume, kind, expect, posting)
            t = totals.setdefault(kind, [0, 0])
            t[0] += 1
            t[1] += 1 if problems else 0
            summary.append(f"- **{kind}** ({secs}s, {stats['words']} words, {stats['bullets']} bullets, keywords {stats['keywords']}): " + ("clean" if not problems else "PROBLEMS: " + "; ".join(problems)))
            (out / f"{key}-{kind}.json").write_text(json.dumps(r, indent=2))
            (out / f"{key}-{kind}.txt").write_text(render(r["resume"]) + "\n\nCHANGES:\n" + "\n".join(f"- {c}" for c in r.get("changes", [])))
        if (key, "tailored") in results and (key, "baseline") in results:
            ok = all(results[(key, k)][0] == 200 and results[(key, k)][1].get("ok") for k in ("tailored", "baseline"))
            if ok:
                pair = [("tailored", render(results[(key, "tailored")][1]["result"]["resume"])), ("baseline", render(results[(key, "baseline")][1]["result"]["resume"]))]
                rng.shuffle(pair)
                blind.append(f"\n\n==================== {label} ====================\nTHE JOB:\n{posting}\n\nTHE ORIGINAL RESUME:\n{resume}\n\n---------- RESUME A ----------\n{pair[0][1]}\n\n---------- RESUME B ----------\n{pair[1][1]}")
                key_lines.append(f"{label}: A = {pair[0][0]}, B = {pair[1][0]}")
    summary.append("\n## Totals\n")
    for kind, (done, bad) in totals.items():
        summary.append(f"- {kind}: {done} built, {bad} with problems")
    (out / "summary.md").write_text("\n".join(summary))
    (out / "blind.txt").write_text("".join(blind))
    (out / "blind-key.txt").write_text("\n".join(key_lines))
    print("\n".join(summary))
    print(f"\nFiles in {out}  (read blind.txt first; blind-key.txt says which is which)")


if __name__ == "__main__":
    main()
