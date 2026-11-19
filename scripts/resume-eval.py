#!/usr/bin/env python3
"""Run the live Resume Builder several times on one resume and one job posting, and score each result.

Why: the AI's output changes a little every time, and a prompt change can make some resumes better and others
worse. This runs the same inputs N times (or two prompt versions, one after the other) so the results can be
compared side by side, without using up anyone's free builds: it uses the owner code, which skips the limits
and does not email anyone.

Usage (from the repo folder):
  python3 scripts/resume-eval.py --resume ~/Downloads/resume.pdf --posting job.txt --runs 3 --label baseline
  python3 scripts/resume-eval.py --resume ~/Downloads/resume.pdf --posting job.txt --runs 3 --label after-prompt-change --letter

The owner code is read from the RESUME_OWNER_CODE environment variable, or from the file given with
--owner-code-file (default ~/.resume-owner-code). It is never written anywhere. Results go to
./resume-evals/<label>-<time>/ (ignored by git, because they can contain a real resume): one JSON file and one
readable .md file per run, plus summary.md with a scorecard.

Checks per run (plain code, not the AI grading itself):
  - key terms from the posting that appear in the resume, and the ones that do not
  - numbers in the new resume that are NOT in the original (possible invention)
  - pronouns for the person, dashes, placeholders, and the length of the title under the name
  - how many experience entries came back (compare with how many the original has: --expect-entries)
"""
import argparse, base64, difflib, json, os, re, shutil, ssl, subprocess, sys, time, urllib.request, urllib.error
base64 = __import__("base64")
from pathlib import Path


def owner_code(path):
    code = os.environ.get("RESUME_OWNER_CODE", "").strip()
    if not code and Path(path).expanduser().exists():
        code = Path(path).expanduser().read_text().strip()
    if not code:
        sys.exit("No owner code. Set RESUME_OWNER_CODE or pass --owner-code-file.")
    return code


def load_resume(path):
    p = Path(path).expanduser()
    suffix = p.suffix.lower()
    if suffix == ".pdf":
        data = base64.b64encode(p.read_bytes()).decode()
        text = ""
        if shutil.which("pdftotext"):
            text = subprocess.run(["pdftotext", "-layout", str(p), "-"], capture_output=True, text=True).stdout
        return {"resumeText": "", "resumeFiles": [{"kind": "pdf", "mediaType": "application/pdf", "data": data}]}, text
    if suffix in (".png", ".jpg", ".jpeg", ".webp"):
        media = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"}[suffix[1:]]
        data = base64.b64encode(p.read_bytes()).decode()
        return {"resumeText": "", "resumeFiles": [{"kind": "image", "mediaType": media, "data": data}]}, ""
    text = p.read_text()
    return {"resumeText": text, "resumeFiles": []}, text


# Some Python installs on a Mac have no certificate list of their own; the system one works.
SSL_CONTEXT = ssl.create_default_context(cafile="/etc/ssl/cert.pem") if Path("/etc/ssl/cert.pem").exists() else None


def post(base, body, timeout=150):
    req = urllib.request.Request(
        f"{base}/api/resume-tailor",
        data=json.dumps(body).encode(),
        headers={"content-type": "application/json", "origin": base},
        method="POST",
    )
    started = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=SSL_CONTEXT) as r:
            return json.loads(r.read()), round(time.time() - started, 1)
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read()), round(time.time() - started, 1)
        except Exception:
            return {"error": f"HTTP {e.code}"}, round(time.time() - started, 1)


def resume_text(doc):
    out = [doc.get("name", ""), doc.get("headline", ""), " | ".join(doc.get("contact", [])), doc.get("summary", "")]
    for s in doc.get("skills", []):
        out.append(f"{s.get('label', '')}: {s.get('items', '')}")
    for j in doc.get("experience", []):
        out.append(f"{j.get('title', '')}, {j.get('company', '')} {j.get('location', '')} {j.get('dates', '')}")
        out.extend(j.get("bullets", []))
    for t in doc.get("training", []):
        out.append(f"{t.get('name', '')} {t.get('detail', '')} {t.get('dates', '')}")
    for e in doc.get("education", []):
        out.append(f"{e.get('school', '')} {e.get('credential', '')} {e.get('dates', '')}")
    return "\n".join(out)


NUM = re.compile(r"\$?\d[\d,]*\.?\d*\s?(?:[KkMm]\b|%|\+)?")


def numbers(text):
    return {re.sub(r"[\s,$+]", "", m.group(0)).lower() for m in NUM.finditer(text)} - {""}


def norm(s):
    return re.sub(r"[^a-z0-9+#./ ]+", " ", s.lower())


def original_bullets(text):
    """Best-effort list of the original's bullets, from its extracted text (lines that start with a bullet glyph)."""
    out, cur = [], None
    for line in (l.strip() for l in text.split("\n")):
        if re.match(r"^[\u25cf\u2022\u25aa\u2023*-]\s+", line):
            if cur:
                out.append(cur)
            cur = re.sub(r"^[\u25cf\u2022\u25aa\u2023*-]\s+", "", line)
        elif cur is not None and line and not re.search(r"\b20\d\d\b\s*[\u2013-]\s*(Present|20\d\d)", line):
            cur += " " + line
        elif cur:
            out.append(cur)
            cur = None
    if cur:
        out.append(cur)
    # a bold lead-in such as "Strategic Discovery:" is not part of the sentence
    return [re.sub(r"^[A-Z][A-Za-z &/\-]{2,40}:\s+", "", b) for b in out]


def change_profile(doc, original_text):
    """How much the bullets changed from the original: nearly the same, lightly reworded, or rewritten."""
    originals = original_bullets(original_text) if original_text else []
    if len(originals) < 5:
        return None
    words = lambda t: re.sub(r"[^a-z0-9 ]+", " ", t.lower()).split()
    bullets = [b for j in doc.get("experience", []) for b in j.get("bullets", [])]
    counts = {"same": 0, "light": 0, "rewritten": 0}
    for b in bullets:
        best = max(difflib.SequenceMatcher(None, words(b), words(o)).ratio() for o in originals)
        counts["same" if best >= 0.90 else "light" if best >= 0.60 else "rewritten"] += 1
    return {"bullets": len(bullets), "original_bullets": len(originals), **counts}


def score(result, original_text, expect_entries):
    doc = result["resume"]
    text = resume_text(doc)
    haystack = " " + re.sub(r"\s+", " ", norm(text)) + " "
    keys = result.get("postingKeywords", [])
    found = [k for k in keys if re.sub(r"\s+", " ", norm(k)).strip() and (" " + re.sub(r"\s+", " ", norm(k)).strip() + " ") in haystack]
    missing = [k for k in keys if k not in found]
    new_numbers = sorted(numbers(text) - numbers(original_text)) if original_text else []
    problems = []
    # "they" and "their" usually mean customers or stakeholders ("on their pain points"), so only he/she/his/her/him are flagged
    if re.search(r"\b(he|she|his|her|him)\b", text, re.I):
        problems.append("pronoun for the person")
    if re.search(r"\bI\b|\bmy\b", text):
        problems.append("first person")
    if "—" in text or "–" in text:
        problems.append("em or en dash")
    if re.search(r"\[[^\]]{2,40}\]|placeholder|lorem", text, re.I):
        problems.append("placeholder text")
    headline = doc.get("headline", "")
    if len(headline) > 50:
        problems.append(f"title is {len(headline)} characters")
    for j in doc.get("experience", []):
        t = j.get("title", "")
        if re.search(r"\bthen\b|\s/\s|\band\b.*\b(representative|manager|consultant|executive|specialist|associate)\b", t, re.I):
            problems.append(f"merged or sequenced title: {t!r}")
    entries = len(doc.get("experience", []))
    if expect_entries and entries < expect_entries:
        problems.append(f"{entries} of {expect_entries} entries kept")
    return {
        "headline": headline,
        "entries": entries,
        "keywords_found": found,
        "keywords_missing": missing,
        "new_numbers": new_numbers if original_text else None,
        "change": change_profile(doc, original_text),
        "problems": problems,
    }


def render(result, sc, seconds):
    doc = result["resume"]
    lines = [f"# {doc.get('name', '')}", f"**{doc.get('headline', '')}**", "", f"_{seconds}s_", "", "## Summary", doc.get("summary", ""), "", "## Skills"]
    lines += [f"- **{s.get('label', '')}:** {s.get('items', '')}" for s in doc.get("skills", [])]
    lines += ["", "## Experience"]
    for j in doc.get("experience", []):
        lines.append(f"### {j.get('title', '')}, {j.get('company', '')} ({j.get('dates', '')})")
        lines += [f"- {b}" for b in j.get("bullets", [])]
    lines += ["", "## Training"] + [f"- {t.get('name', '')} {t.get('detail', '')}" for t in doc.get("training", [])]
    lines += ["", "## Education"] + [f"- {e.get('school', '')}, {e.get('credential', '')}" for e in doc.get("education", [])]
    lines += ["", "## What we changed"] + [f"- {c}" for c in result.get("changes", [])]
    lines += ["", "## Gaps"] + [f"- {g.get('requirement', '')}: {g.get('note', '')}" for g in result.get("gaps", [])]
    lines += ["", "## Checks", f"- Key terms found ({len(sc['keywords_found'])}/{len(sc['keywords_found']) + len(sc['keywords_missing'])}): {', '.join(sc['keywords_found'])}"]
    lines.append(f"- Key terms missing: {', '.join(sc['keywords_missing']) or 'none'}")
    if sc["new_numbers"] is not None:
        lines.append(f"- Numbers not in the original (check each): {', '.join(sc['new_numbers']) or 'none'}")
    ch = sc.get("change")
    if ch:
        lines.append(f"- How much changed: of {ch['bullets']} bullets (the original had {ch['original_bullets']}): {ch['same']} nearly the same, {ch['light']} lightly reworded, {ch['rewritten']} rewritten")
    lines.append(f"- Problems: {', '.join(sc['problems']) or 'none'}")
    if result.get("coverLetter"):
        cl = result["coverLetter"]
        lines += ["", "## Cover letter", cl.get("greeting", "")] + cl.get("paragraphs", []) + [cl.get("closing", "")]
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--resume", required=True, help="the person's resume: .pdf, .png/.jpg, or .txt")
    ap.add_argument("--posting", required=True, help="the job posting as a .txt file")
    ap.add_argument("--notes", help="optional .txt file of notes about the person")
    ap.add_argument("--runs", type=int, default=3)
    ap.add_argument("--label", default="run")
    ap.add_argument("--letter", action="store_true", help="also write a cover letter")
    ap.add_argument("--match-design", action="store_true", help="ask for the original's look (PDF or image resumes)")
    ap.add_argument("--model", choices=["claude-sonnet-5-5", "claude-haiku-5-5"], help="default: the site's own choice")
    ap.add_argument("--expect-entries", type=int, default=0, help="how many jobs and projects the original has")
    ap.add_argument("--variant", choices=["v1", "v2"], default="v1", help="v1 is what visitors get; v2 is the newer formatting rules (owner only)")
    ap.add_argument("--base-url", default="https://thewarthens.com")
    ap.add_argument("--owner-code-file", default="~/.resume-owner-code")
    ap.add_argument("--out", default="resume-evals")
    a = ap.parse_args()

    code = owner_code(a.owner_code_file)
    resume_part, original_text = load_resume(a.resume)
    if not original_text and not resume_part["resumeText"]:
        print("Note: could not read the original's text here (install poppler for PDFs), so the invented-number check is off.")
    body = {
        **resume_part,
        "postingText": Path(a.posting).expanduser().read_text(),
        "notes": Path(a.notes).expanduser().read_text() if a.notes else "",
        "coverLetter": a.letter,
        "matchDesign": a.match_design,
        "email": "resume-eval@example.com",
        "source": "Other",
        "ownerCode": code,
        "promptVariant": a.variant,
    }
    if a.model:
        body["model"] = a.model

    out_dir = Path(a.out) / f"{a.label}-{time.strftime('%Y%m%d-%H%M%S')}"
    out_dir.mkdir(parents=True, exist_ok=True)
    rows = []
    for n in range(1, a.runs + 1):
        result, seconds = post(a.base_url.rstrip("/"), body)
        (out_dir / f"run-{n}.json").write_text(json.dumps(result, indent=1))
        if not result.get("ok"):
            print(f"run {n}: FAILED {result.get('error')} {result.get('message', '')}")
            rows.append((n, None))
            continue
        r = result["result"]
        sc = score(r, original_text, a.expect_entries)
        (out_dir / f"run-{n}.md").write_text(render(r, sc, seconds))
        rows.append((n, sc))
        found = len(sc["keywords_found"])
        total = found + len(sc["keywords_missing"])
        ch = sc.get("change")
        changed = f" | bullets same/light/rewritten {ch['same']}/{ch['light']}/{ch['rewritten']}" if ch else ""
        print(f"run {n}: {seconds}s | title: {sc['headline']!r} | entries {sc['entries']} | key terms {found}/{total}{changed} | problems: {', '.join(sc['problems']) or 'none'}")

    ok = [sc for _, sc in rows if sc]
    summary = [f"# {a.label}", "", "| run | title | entries | key terms | new numbers | problems |", "|---|---|---|---|---|---|"]
    for n, sc in rows:
        if not sc:
            summary.append(f"| {n} | failed | | | | |")
            continue
        total = len(sc["keywords_found"]) + len(sc["keywords_missing"])
        nn = "n/a" if sc["new_numbers"] is None else (", ".join(sc["new_numbers"]) or "none")
        summary.append(f"| {n} | {sc['headline']} | {sc['entries']} | {len(sc['keywords_found'])}/{total} | {nn} | {', '.join(sc['problems']) or 'none'} |")
    if ok:
        avg = sum(len(s["keywords_found"]) / max(1, len(s["keywords_found"]) + len(s["keywords_missing"])) for s in ok) / len(ok)
        summary += ["", f"Average key-term coverage: {avg:.0%} over {len(ok)} run(s)."]
    (out_dir / "summary.md").write_text("\n".join(summary))
    print(f"\nSaved to {out_dir}/ (open summary.md, then run-1.md)")


if __name__ == "__main__":
    main()
