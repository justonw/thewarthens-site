#!/usr/bin/env python3
"""Shows what people did on the resume tools: how many reached each step, per day and in total.

  python3 scripts/funnel.py            last 14 days
  python3 scripts/funnel.py --days 30

Counts only: no names, emails, or anything people typed. The owner code is read from RESUME_OWNER_CODE or
~/.resume-owner-code and is never printed.
"""
import argparse, json, os, ssl, sys, urllib.request, urllib.error
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--days", type=int, default=14)
ap.add_argument("--base-url", default="https://thewarthens.com")
ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
a = ap.parse_args()

code = os.environ.get("RESUME_OWNER_CODE", "").strip()
if not code and Path(a.owner_code_file).expanduser().exists():
    code = Path(a.owner_code_file).expanduser().read_text().strip()
if not code:
    sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")
ctx = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None
req = urllib.request.Request(a.base_url.rstrip("/") + "/api/funnel", data=json.dumps({"ownerCode": code, "days": a.days}).encode(), headers={"content-type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=90, context=ctx) as r:
        data = json.load(r)
except urllib.error.HTTPError as e:
    sys.exit(f"Error: {e.code} {e.read()[:200]!r}")

steps = [("resume-visit", "Opened the builder"), ("resume-added", "Added a resume"), ("job-added", "Added a job"), ("email-entered", "Filled in email"),
         ("build-started", "Pressed Build"), ("build-finished", "Got a resume"), ("gap-answered", "Answered a gap question"), ("download", "Downloaded"),
         ("profile-saved", "Saved a profile file"), ("returning-visit", "Returned with a saved profile"), ("scanner-visit", "Opened the scanner"), ("scanner-checked", "Ran the scanner")]
days = data["days"]
total = {k: sum(d["counts"].get(k, 0) for d in days) for k, _ in steps}
print(f"Last {a.days} days\n")
print(f"{'Step':32} {'Total':>7} {'% of opens':>11}")
base = total["resume-visit"] or 0
for k, label in steps:
    pct = f"{round(100 * total[k] / base)}%" if base and k in ("resume-added", "job-added", "email-entered", "build-started", "build-finished", "download") else ""
    print(f"{label:32} {total[k]:>7} {pct:>11}")
print("\nBy day (opened / got a resume / downloaded)")
for d in days:
    c = d["counts"]
    if any(c.values()):
        print(f"  {d['day']}:  {c.get('resume-visit', 0):>4} / {c.get('build-finished', 0):>3} / {c.get('download', 0):>3}")
