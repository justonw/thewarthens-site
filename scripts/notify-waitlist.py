#!/usr/bin/env python3
"""Email everyone on the Resume Builder waitlist that paid builds are open. Run it ONCE, after the live Stripe test passes.

  python3 scripts/notify-waitlist.py --dry-run     shows how many are waiting and whether a pack is on sale (sends nothing)
  python3 scripts/notify-waitlist.py               sends the one email to everyone not yet told, repeating until done

The owner code is read from RESUME_OWNER_CODE or from the file given with --owner-code-file. It is never printed.
The site refuses to send until a pack is on sale, and never emails the same person twice.
"""
import argparse, json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--dry-run", action="store_true")
ap.add_argument("--base-url", default="https://thewarthens.com")
ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
a = ap.parse_args()

code = os.environ.get("RESUME_OWNER_CODE", "").strip()
if not code and Path(a.owner_code_file).expanduser().exists():
    code = Path(a.owner_code_file).expanduser().read_text().strip()
if not code:
    sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")

def call(body):
    req = urllib.request.Request(a.base_url.rstrip("/") + "/api/resume-waitlist-send", data=json.dumps(body).encode(), headers={"content-type": "application/json", "origin": a.base_url.rstrip("/")})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        try:
            return json.load(e)
        except Exception:
            return {"error": f"http {e.code}"}

if a.dry_run:
    print(call({"ownerCode": code, "dryRun": True}))
    sys.exit(0)

total = 0
for _ in range(30):
    r = call({"ownerCode": code})
    print(r)
    if not r.get("ok"):
        sys.exit(1)
    total += r.get("sent", 0)
    if r.get("remaining", 0) == 0:
        break
    time.sleep(2)
print(f"Done. {total} emails sent.")
