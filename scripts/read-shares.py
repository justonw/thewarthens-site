#!/usr/bin/env python3
"""Reads the resume builds whose owners checked "use my session to improve this web application".

  python3 scripts/read-shares.py                 who shared, when, and for which job (newest first)
  python3 scripts/read-shares.py --id <id>       one whole scrubbed copy: resume, posting, notes, and the finished resume
  python3 scripts/read-shares.py --base-url http://localhost:3000   test against a local server

People are shown as "d***@gmail.com". A copy that its owner stopped sharing shows as "stopped" and has nothing left in it.
The owner code is read from RESUME_OWNER_CODE or ~/.resume-owner-code and is never printed.
"""
import argparse, json, os, ssl, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--id")
ap.add_argument("--base-url", default="https://thewarthens.com")
ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
a = ap.parse_args()

code = os.environ.get("RESUME_OWNER_CODE", "").strip()
if not code and Path(a.owner_code_file).expanduser().exists():
    code = Path(a.owner_code_file).expanduser().read_text().strip()
if not code:
    sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")
ctx = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None
body = {"ownerCode": code}
if a.id:
    body["id"] = a.id
req = urllib.request.Request(a.base_url.rstrip("/") + "/api/resume-share-review", data=json.dumps(body).encode(), headers={"content-type": "application/json"})
with urllib.request.urlopen(req, timeout=120, context=ctx) as r:
    data = json.load(r)

if a.id:
    rec = data.get("record")
    if not rec:
        sys.exit("No copy with that id.")
    if rec.get("state") == "withdrawn":
        sys.exit("That person stopped sharing it. Nothing is kept.")
    at = rec["at"]
    if isinstance(at, (int, float)):
        at = datetime.fromtimestamp(at / 1000, timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    print(f"{rec['person']}  shared {at}  (files were attached: {rec['hadFiles']})\n")
    print("=== RESUME THEY PASTED ===\n" + (rec["resumeText"] or "(none: they attached a file, which is never kept)"))
    print("\n=== JOB POSTING ===\n" + (rec["postingText"] or "(none)"))
    print("\n=== THEIR NOTES ===\n" + (rec["notes"] or "(none)"))
    print("\n=== THE FINISHED BUILD ===\n" + json.dumps(rec["result"], indent=2))
else:
    shares = data.get("shares", [])
    live = [s for s in shares if s["state"] == "shared"]
    people = {s["who"] for s in live}
    print(f"{len(live)} shared builds from {len(people)} people ({len(shares) - len(live)} stopped)\n")
    for s in shares:
        if s["state"] == "withdrawn":
            print(f"  {s['at'][:10]}  stopped     {s['id']}")
        else:
            job = f"{s['title']} at {s['company']}".strip(" at") if s["title"] or s["company"] else "(general resume)"
            print(f"  {s['at'][:10]}  {s['person']:28s} {job[:50]:50s} {s['id']}")
    if live:
        print("\nRead one with: python3 scripts/read-shares.py --id <id>")
