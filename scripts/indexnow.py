#!/usr/bin/env python3
"""Tell Bing, Yandex, and other IndexNow search engines that pages are new or changed, so they are crawled in hours
instead of days. Google does not use IndexNow: for Google, use Search Console (URL Inspection, then Request indexing).

  python3 scripts/indexnow.py                      sends every URL in the sitemap
  python3 scripts/indexnow.py /resume /resume/guides   sends only these paths

Run it AFTER a deploy has finished, because the engines fetch the pages straight away. The key file that proves we
own the site is in public/ (its name is the key).
"""
import json, re, ssl, sys, urllib.request
from pathlib import Path

HOST = "thewarthens.com"
KEY = "9c2a378aaf3dbd78e6779298331528c5"
ctx = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None

def get(url):
    with urllib.request.urlopen(url, timeout=30, context=ctx) as r:
        return r.read().decode()

paths = sys.argv[1:]
if paths:
    urls = [f"https://{HOST}{p if p.startswith('/') else '/' + p}" for p in paths]
else:
    urls = re.findall(r"<loc>([^<]+)</loc>", get(f"https://{HOST}/sitemap.xml"))

body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/IndexNow", data=body, headers={"content-type": "application/json; charset=utf-8"})
try:
    with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
        print(f"IndexNow accepted {len(urls)} URLs (HTTP {r.status}).")
except urllib.error.HTTPError as e:
    print(f"IndexNow answered HTTP {e.code}: {e.read().decode()[:200]}")
    sys.exit(1)
