#!/usr/bin/env python3
"""Shows what kinds of jobs people built resumes for, and which job titles have no role lens yet.

  python3 scripts/field-report.py            last 30 days
  python3 scripts/field-report.py --days 7

Counts only: no names, emails, or anything from a resume. The owner code is read from RESUME_OWNER_CODE or
~/.resume-owner-code and is never printed.
"""
import argparse, json, os, ssl, sys, urllib.request
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--days", type=int, default=30)
ap.add_argument("--base-url", default="https://thewarthens.com")
ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
a = ap.parse_args()

code = os.environ.get("RESUME_OWNER_CODE", "").strip()
if not code and Path(a.owner_code_file).expanduser().exists():
    code = Path(a.owner_code_file).expanduser().read_text().strip()
if not code:
    sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")
ctx = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None
req = urllib.request.Request(a.base_url.rstrip("/") + "/api/funnel", data=json.dumps({"ownerCode": code, "days": a.days, "fields": True}).encode(), headers={"content-type": "application/json"})
with urllib.request.urlopen(req, timeout=120, context=ctx) as r:
    rep = json.load(r)["report"]

print(f"Resume builds by kind of job, last {rep['days']} days: {rep['builds']} builds ({rep['general']} general, no job posting)\n")
for f in rep["fields"]:
    share = 100 * f["n"] // max(1, rep["builds"])
    print(f"  {f['n']:5d}  {share:3d}%  {f['name']}")
if rep["nolens"]:
    print("\nJob titles with no lens yet (the next lenses to write):")
    for t in rep["nolens"]:
        print(f"  {t['n']:5d}  {t['title']}")
