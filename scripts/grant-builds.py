#!/usr/bin/env python3
"""Give particular email addresses extra Resume Builder builds (on top of the 2 free ones).

  python3 scripts/grant-builds.py --email friend@example.com --builds 10 [--note "beta tester"]
  python3 scripts/grant-builds.py --email friend@example.com --status

The person just uses the normal build form with that email. The 2 free builds are used first, then the extra ones.
"Unlimited" in practice means a big number such as 500. Each build costs real money (the AI), so keep it sensible.
The owner code is read from RESUME_OWNER_CODE or ~/.resume-owner-code. It is never printed.
"""
import argparse, json, os, ssl, sys, urllib.request, urllib.error
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--email", required=True)
ap.add_argument("--builds", type=int)
ap.add_argument("--note", default="")
ap.add_argument("--status", action="store_true")
ap.add_argument("--base-url", default="https://thewarthens.com")
ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
a = ap.parse_args()
if not a.status and not a.builds:
    sys.exit("Give --builds N to grant builds, or --status to look.")

code = os.environ.get("RESUME_OWNER_CODE", "").strip()
if not code and Path(a.owner_code_file).expanduser().exists():
    code = Path(a.owner_code_file).expanduser().read_text().strip()
if not code:
    sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")

ctx = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None
body = {"ownerCode": code, "email": a.email, "statusOnly": a.status, "builds": a.builds, "note": a.note}
req = urllib.request.Request(a.base_url.rstrip("/") + "/api/resume-grant", data=json.dumps(body).encode(), headers={"content-type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
        print(json.load(r))
except urllib.error.HTTPError as e:
    print(json.load(e))
    sys.exit(1)
