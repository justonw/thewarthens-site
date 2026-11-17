#!/usr/bin/env python3
"""Send an 'occasional note' to the people who asked for one on the Tech Journey or Faith Journey page.

  python3 scripts/send-note.py --stats                                     how many are on the list (sends nothing)
  python3 scripts/send-note.py --campaign NAME --subject "..." --body-file note.txt --dry-run
                                                                           how many would get it (sends nothing)
  python3 scripts/send-note.py --campaign NAME --subject "..." --body-file note.txt --test-to you@example.com
                                                                           sends ONE copy to that address only
  python3 scripts/send-note.py --campaign NAME --subject "..." --body-file note.txt --send [--audience tech|faith|all]
                                                                           sends to everyone it has not reached yet

NAME is a short label for this note (letters, numbers, dashes), such as nov-2026-note. The same NAME is never sent to
the same person twice, so it is safe to run again if it stops partway. Anyone who unsubscribed is skipped, and every
email has a working unsubscribe link. The body is plain text: blank lines make paragraphs and web addresses become links.
The owner code is read from RESUME_OWNER_CODE or from --owner-code-file. It is never printed.
"""
import argparse, json, os, ssl, sys, time, urllib.request, urllib.error
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--stats", action="store_true")
ap.add_argument("--dry-run", action="store_true")
ap.add_argument("--send", action="store_true")
ap.add_argument("--test-to")
ap.add_argument("--campaign")
ap.add_argument("--subject")
ap.add_argument("--body-file")
ap.add_argument("--audience", default="all", choices=["all", "tech", "faith"])
ap.add_argument("--base-url", default="https://thewarthens.com")
ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
a = ap.parse_args()

code = os.environ.get("RESUME_OWNER_CODE", "").strip()
if not code and Path(a.owner_code_file).expanduser().exists():
    code = Path(a.owner_code_file).expanduser().read_text().strip()
if not code:
    sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")

SSL_CONTEXT = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None

def call(body):
    req = urllib.request.Request(a.base_url.rstrip("/") + "/api/friends-send", data=json.dumps(body).encode(), headers={"content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60, context=SSL_CONTEXT) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        try:
            return json.load(e)
        except Exception:
            return {"error": f"http {e.code}"}

if a.stats:
    print(call({"ownerCode": code, "dryRun": True}))
    sys.exit(0)

if not (a.campaign and a.subject and a.body_file):
    sys.exit("Needs --campaign, --subject and --body-file (or use --stats).")
text = Path(a.body_file).expanduser().read_text()
base = {"ownerCode": code, "campaignId": a.campaign, "subject": a.subject, "text": text, "audience": a.audience}

if a.test_to:
    print(call({**base, "testTo": a.test_to}))
    sys.exit(0)
if a.dry_run or not a.send:
    print(call({**base, "dryRun": True}))
    if not a.dry_run:
        print("(Nothing sent. Add --send to send for real.)")
    sys.exit(0)

total = 0
for _ in range(60):
    r = call(base)
    print(r)
    if not r.get("ok"):
        sys.exit(1)
    total += r.get("sent", 0)
    if r.get("remaining", 0) == 0:
        break
    time.sleep(2)
print(f"Done. {total} emails sent.")
