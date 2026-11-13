#!/usr/bin/env python3
# betanyc-shared: whats_changed.py v1.2.1
# betanyc-shared-sha256: 26db6d4f6b777281093701a7c68b81c22f35f614ee489d04edfe2b5233280b7c
# Canonical copy: betanyc-ai-workspace scripts/whats_changed.py. Do not edit a copy in
# another repo; change the canonical file, re-stamp it, and copy it again.
# Drift check: scripts/whats_changed_drift.py. Standard: platform/system/whats-changed-standard.md.
"""Read, check and render a BetaNYC WHATS-CHANGED.md file. Stdlib only.

Subcommands:
  check   FILE  validate the file (exit 1 on any error)
  json    FILE  print the canonical parse as JSON (the contract shared with the TS module)
  render  FILE  write the accessible "What's changed" page or fragment
  notice  FILE  write the short correction notice for one page

Run `python3 whats_changed.py <subcommand> --help` for the options.
Exit codes: 0 ok, 1 errors found or output stale, 2 usage or I/O problem.
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

SCRIPT = "whats_changed"
TAGS = ("Site", "Data", "MCP", "Correction")
SUBJECT_TAGS = ("Site", "Data", "MCP")
FIELDS = {
    "Tags": "tags",
    "What changed": "summary",
    "If you used the old numbers": "if_you_used_the_old_numbers",
    "Who it affects": "who_it_affects",
    "MCP version": "mcp_version",
    "Notice on": "notice_on",
    "More detail": "more_detail",
}
PREAMBLE_FIELDS = {"History begins": "history_begins", "Data refresh": "data_refresh"}
MONTHS = (
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
)
NOTICE_DAYS = 30

DATE_RE = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
MIN_YEAR = 1990
H1_RE = re.compile(r"^# (.+?)[ \t]*$")
H2_RE = re.compile(r"^## (.*?)[ \t]*$")
DEEPER_RE = re.compile(r"^#{3,} ")
ENTRY_HEADING_RE = re.compile(r"^([0-9]{4}-[0-9]{2}-[0-9]{2}): ([^ \t].*)$")
# A version bump merges before its tag, so the newest entry may wait for its release date.
UNRELEASED_HEADING_RE = re.compile(r"^Unreleased: ([^ \t].*)$")
UNRELEASED = "Unreleased"
FIELD_RE = re.compile(r"^- \*\*(.+?):\*\*(?: (.*))?$")
UPDATE_LABEL_RE = re.compile(r"^Update ([^ \t]+)$")
CONT_RE = re.compile(r"^ {2,}[^ \t]")
# Link text may not contain brackets: that keeps matching linear on lines full of "[".
LINK_RE = re.compile(r"\[([^\[\]]+)\]\(([^() \t]+)\)")
# An optional "v" before the version ("v0.4.5") is allowed; it is not part of the version.
SEMVER_RE = re.compile(r"(?<![0-9A-Za-z.])v?([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]*[0-9A-Za-z])?)(?![0-9A-Za-z])")
# Characters GitHub treats as markup or entities in a heading, so its anchor would not match ours.
TITLE_MARKUP_RE = re.compile(r"[*`\[\]<>&_~#\\]")
FENCE_RE = re.compile(r"^(```|~~~)")
BARE_URL_RE = re.compile(r"(?<![(<])https?://")
HISTORY_RE = re.compile(r"^([0-9]{4}-[0-9]{2}-[0-9]{2})(?![0-9-])")
SCHEME_RE = re.compile(r"^([A-Za-z][A-Za-z0-9+.-]*):")
SAFE_SCHEMES = ("http", "https", "mailto")
CONTROL_RE = re.compile("[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f\u2028\u2029]")  # C0, DEL, C1, line/para separators
PLACEHOLDER_RE = re.compile(r"SITE OR SERVER NAME|HOW OFTEN THE DATA UPDATES|BetaNYC/REPO(?![A-Za-z0-9_-])")
EXAMPLE_TITLE_RE = re.compile(r"^example:", re.I)
TRIM = " \t\u00a0\ufeff"  # the one whitespace set both parsers trim
MAX_CHARS = 1_000_000
MAX_LINE = 5_000
# File-level problems: they do not make the entry they sit beside invalid.
FILE_LEVEL_CODES = ("unterminated-comment", "unterminated-fence", "no-h1", "missing-history-begins", "bad-history-begins",
                    "history-after-entry", "file-too-large")
TITLE_SOFT_MAX = 80

MARK_START = "<!-- whats-changed:start -->"
MARK_END = "<!-- whats-changed:end -->"
NOTICE_START = "<!-- whats-changed-notice:start -->"
NOTICE_END = "<!-- whats-changed-notice:end -->"


# --------------------------------------------------------------------------- parsing


def github_slug(text: str) -> str:
    """The anchor GitHub gives a heading (docs.github.com, "Section links"): lowercase,
    spaces become hyphens, other punctuation and whitespace removed. Letters, marks,
    numbers, underscores (connector punctuation) and hyphens are kept."""
    out = []
    for ch in text.strip(TRIM).lower():
        if ch == " " or ch == "-":
            out.append("-")
        else:
            cat = unicodedata.category(ch)
            if cat[0] in "LMN" or cat == "Pc":
                out.append(ch)
    return "".join(out)


def is_real_date(s: str) -> bool:
    """YYYY-MM-DD in ASCII digits, a real calendar day, year 1990 or later."""
    if not isinstance(s, str) or not DATE_RE.match(s):
        return False
    try:
        d = dt.date.fromisoformat(s)
    except ValueError:
        return False
    return d.year >= MIN_YEAR


def is_safe_url(url: str) -> bool:
    """Only http, https, mailto, relative paths and #fragments. Never javascript:, data:, or //host."""
    if url.startswith("#"):
        return True
    if url.startswith("//"):
        return False
    m = SCHEME_RE.match(url)
    return m is None or m.group(1).lower() in SAFE_SCHEMES


def _extract_links(values: list[str]) -> list[dict]:
    links: list[dict] = []
    seen: set[str] = set()
    for value in values:
        for m in LINK_RE.finditer(value):
            url = m.group(2)
            if url in seen or not is_safe_url(url):
                continue
            seen.add(url)
            links.append({"text": m.group(1), "url": url})
    return links


def _split_list(value: str) -> list[str]:
    return [t.strip(TRIM) for t in value.split(",") if t.strip(TRIM)]


def parse(text: str, today: str | None = None) -> dict:
    """Parse WHATS-CHANGED.md into the canonical structure. Never raises on bad input:
    problems are reported in `errors` as {code, line}, and each entry says whether it is
    `valid` (no error inside it). `today` (YYYY-MM-DD) is the date used for the future-date
    checks; default is the local date."""
    today = today or dt.date.today().isoformat()
    if len(text) > MAX_CHARS:
        return {"title": "", "history_begins": None, "data_refresh": None, "intro": "", "entries": [],
                "errors": [{"code": "file-too-large", "line": 1}]}
    if text.startswith("\ufeff"):
        text = text[1:]
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    errors: list[dict] = []

    def err(code: str, line: int) -> None:
        errors.append({"code": code, "line": line})

    i = 0
    # Optional YAML frontmatter (the workspace template carries one; repo files should not).
    if lines and lines[0].strip(TRIM) == "---":
        for j in range(1, len(lines)):
            if lines[j].strip(TRIM) == "---":
                i = j + 1
                break

    title = None
    intro: list[str] = []
    preamble: dict[str, str | None] = {"history_begins": None, "data_refresh": None}
    preamble_lines: dict[str, int] = {}
    entries: list[dict] = []
    h2_lines: list[int] = []
    current: dict | None = None
    skipping = False  # inside a malformed entry
    last_field: str | None = None
    in_comment = False
    comment_start = 0
    in_fence = False
    fence_start = 0

    def check_placeholders(value: str, lineno: int) -> None:
        if PLACEHOLDER_RE.search(value):
            err("template-placeholder", lineno)

    for idx in range(i, len(lines)):
        lineno = idx + 1
        raw = lines[idx]
        if len(raw) > MAX_LINE:
            err("line-too-long", lineno)
            continue
        if CONTROL_RE.search(raw):
            err("control-character", lineno)
        line = raw.rstrip(TRIM)

        if in_comment:
            if "-->" in line:
                in_comment = False
                if line.split("-->", 1)[1].strip(TRIM):
                    err("text-after-comment", lineno)  # GitHub shows it; we would drop it
            continue
        if not in_fence and line.lstrip(TRIM).startswith("<!--"):
            if "-->" not in line:
                in_comment = True
                comment_start = lineno
            elif line.split("-->", 1)[1].strip(TRIM):
                err("text-after-comment", lineno)
            continue
        if not in_fence and "<!--" in line:
            # GitHub hides everything after an unclosed comment; a comment inside text is not allowed.
            err("inline-comment", lineno)

        if title is None:
            if not line.strip(TRIM):
                continue
            m = H1_RE.match(line)
            if m:
                title = m.group(1).strip(TRIM)
                if TITLE_MARKUP_RE.search(title):
                    # The page title reaches Jekyll and Quarto front matter, and layouts print it.
                    err("title-markup", lineno)
                continue
            err("no-h1", lineno)
            title = ""
            # fall through: treat this line as preamble/entry content

        if FENCE_RE.match(line.strip(TRIM)):
            in_fence = not in_fence
            fence_start = lineno
            if current is not None and not skipping:
                err("stray-text", lineno)
            elif current is None:
                intro.append(line)
            continue
        if in_fence:
            if current is None:
                intro.append(line)
            elif not skipping:
                err("stray-text", lineno)
            continue

        h2 = H2_RE.match(line)
        if h2:
            last_field = None
            h2_lines.append(lineno)
            m = ENTRY_HEADING_RE.match(h2.group(1))
            um = None if m else UNRELEASED_HEADING_RE.match(h2.group(1))
            if not m and not um:
                err("bad-heading", lineno)
                current = None
                skipping = True
                continue
            skipping = False
            if m:
                date, etitle = m.group(1), m.group(2).strip(TRIM)
            else:
                date, etitle = None, um.group(1).strip(TRIM)
                if any(e["unreleased"] for e in entries):
                    err("duplicate-unreleased", lineno)
                elif entries:
                    err("unreleased-not-first", lineno)
            current = {
                "date": date,
                "unreleased": date is None,
                "title": etitle,
                "anchor": github_slug(f"{date or UNRELEASED}: {etitle}"),
                "tags": [],
                "summary": None,
                "if_you_used_the_old_numbers": None,
                "who_it_affects": None,
                "mcp_version": None,
                "notice_on": [],
                "more_detail": None,
                "updates": [],
                "links": [],
                "line": lineno,
                "valid": True,
                "_seen": set(),
                "_raw_tags": None,
            }
            if date is None:
                pass
            elif not is_real_date(date):
                err("bad-date", lineno)
            elif date > today:
                err("future-date", lineno)
            if TITLE_MARKUP_RE.search(etitle):
                err("title-markup", lineno)
            if EXAMPLE_TITLE_RE.match(etitle):
                err("template-placeholder", lineno)
            else:
                check_placeholders(etitle, lineno)
            entries.append(current)
            continue

        if skipping:
            continue

        if current is None:
            # Preamble: free prose, plus the two preamble fields.
            check_placeholders(line, lineno)
            fm = FIELD_RE.match(line)
            if fm and fm.group(1) in PREAMBLE_FIELDS:
                key = PREAMBLE_FIELDS[fm.group(1)]
                preamble[key] = (fm.group(2) or "").strip(TRIM)
                preamble_lines[key] = lineno
            intro.append(line)
            continue

        # Inside an entry.
        if not line.strip(TRIM):
            continue
        if DEEPER_RE.match(line) or H1_RE.match(line):
            err("stray-text", lineno)
            last_field = None
            continue
        fm = FIELD_RE.match(line)
        if fm:
            label, value = fm.group(1), (fm.group(2) or "").strip(TRIM)
            check_placeholders(value, lineno)
            um = UPDATE_LABEL_RE.match(label)
            if um:
                udate = um.group(1)
                if not is_real_date(udate) or udate < (current["date"] or "") or udate > today:
                    err("bad-update-date", lineno)
                if not value:
                    err("empty-field", lineno)
                current["updates"].append({"date": udate, "text": value, "_line": lineno})
                last_field = "update"
                continue
            if label not in FIELDS:
                err("unknown-field", lineno)
                last_field = None
                continue
            key = FIELDS[label]
            if key in current["_seen"]:
                err("duplicate-field", lineno)
                last_field = None
                continue
            current["_seen"].add(key)
            if not value:
                err("empty-field", lineno)
            if key == "tags":
                current["_raw_tags"] = (value, lineno)
            elif key == "notice_on":
                current["notice_on"] = _split_list(value)
            else:
                current[key] = value
                current["_line_" + key] = lineno
            last_field = key
            continue
        if CONT_RE.match(raw) and last_field is not None:
            extra = line.strip(TRIM)
            check_placeholders(extra, lineno)
            if last_field == "update":
                u = current["updates"][-1]
                u["text"] = (u["text"] + " " + extra).strip(TRIM)
            elif last_field == "tags":
                v, ln = current["_raw_tags"]
                current["_raw_tags"] = ((v + " " + extra).strip(TRIM), ln)
            elif last_field == "notice_on":
                current["notice_on"] += _split_list(extra)
            else:
                current[last_field] = ((current[last_field] or "") + " " + extra).strip(TRIM)
            continue
        err("stray-text", lineno)
        last_field = None

    if in_comment:
        err("unterminated-comment", comment_start)
    if in_fence:
        err("unterminated-fence", fence_start)  # GitHub shows everything after it as code
    if title is None:
        err("no-h1", 1)
        title = ""

    # Entry-level checks.
    seen_anchors: set[str] = set()
    prev_date: str | None = None
    for e in entries:
        ln = e["line"]
        raw_tags = e.pop("_raw_tags")
        e.pop("_seen")
        field_lines = {k[len("_line_"):]: e.pop(k) for k in [k for k in e if k.startswith("_line_")]}
        if raw_tags is None:
            err("missing-tags", ln)
        else:
            value, tln = raw_tags
            for t in _split_list(value):
                if t not in TAGS:
                    err("bad-tag", tln)
                elif t in e["tags"]:
                    err("duplicate-tag", tln)
                else:
                    e["tags"].append(t)
        if not e["summary"]:
            err("missing-summary", ln)
        if "Correction" in e["tags"]:
            if not any(t in e["tags"] for t in SUBJECT_TAGS):
                err("correction-alone", ln)
            if not e["if_you_used_the_old_numbers"]:
                err("missing-old-numbers", ln)
        elif e["notice_on"]:
            err("notice-without-correction", ln)
        if "MCP" in e["tags"]:
            if not e["mcp_version"]:
                err("missing-mcp-version", ln)
        if e["mcp_version"] and not SEMVER_RE.search(e["mcp_version"]):
            err("bad-mcp-version", ln)
        if e["anchor"] in seen_anchors:
            err("duplicate-anchor", ln)
        seen_anchors.add(e["anchor"])
        if e["date"] and prev_date and is_real_date(e["date"]) and is_real_date(prev_date) and e["date"] > prev_date:
            err("out-of-order", ln)
        if e["date"] and is_real_date(e["date"]):
            prev_date = e["date"]
        for key in ("summary", "if_you_used_the_old_numbers", "who_it_affects", "mcp_version", "more_detail"):
            if e[key] and any(not is_safe_url(m.group(2)) for m in LINK_RE.finditer(e[key])):
                err("unsafe-link", field_lines.get(key, ln))
        for u in e["updates"]:
            uln = u.pop("_line")
            if any(not is_safe_url(m.group(2)) for m in LINK_RE.finditer(u["text"])):
                err("unsafe-link", uln)
        e["links"] = _extract_links(
            [v for v in (e["summary"], e["if_you_used_the_old_numbers"], e["who_it_affects"],
                         e["mcp_version"], e["more_detail"]) if v]
            + [u["text"] for u in e["updates"]]
        )

    hb = preamble["history_begins"]
    hb_date = None
    if hb is None:
        err("missing-history-begins", 1)
    else:
        hm = HISTORY_RE.match(hb)
        if not hm or not is_real_date(hm.group(1)):
            err("bad-history-begins", preamble_lines["history_begins"])
        else:
            hb_date = hm.group(1)
            dated = [e["date"] for e in entries if e["date"] and is_real_date(e["date"])]
            if dated and hb_date > min(dated):
                err("history-after-entry", preamble_lines["history_begins"])

    # An entry is valid when no entry-level error falls between its heading and the next one.
    bounds = sorted(h2_lines)
    for e in entries:
        nxt = [b for b in bounds if b > e["line"]]
        end = nxt[0] if nxt else len(lines) + 1
        e["valid"] = not any(e["line"] <= x["line"] < end and x["code"] not in FILE_LEVEL_CODES
                             for x in errors)

    errors.sort(key=lambda x: (x["line"], x["code"]))
    # Trim blank lines around the intro.
    while intro and not intro[0].strip(TRIM):
        intro.pop(0)
    while intro and not intro[-1].strip(TRIM):
        intro.pop()
    return {
        "title": title,
        "history_begins": hb_date,
        "data_refresh": preamble["data_refresh"],
        "intro": "\n".join(intro),
        "entries": entries,
        "errors": errors,
    }


def warnings_for(parsed: dict) -> list[dict]:
    """Advisory findings, not shared with the TS module and never fatal unless --strict."""
    out = []
    for e in parsed["entries"]:
        if len(e["title"]) > TITLE_SOFT_MAX:
            out.append({"code": "title-long", "line": e["line"]})
        for v in (e["summary"], e["if_you_used_the_old_numbers"], e["more_detail"]):
            if v and BARE_URL_RE.search(LINK_RE.sub("", v)):
                out.append({"code": "bare-url", "line": e["line"]})
                break
    return out


# --------------------------------------------------------------------------- repo checks


def _git(args: list[str], cwd: Path) -> tuple[int, str]:
    try:
        p = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, check=False)
    except FileNotFoundError:
        return 127, ""
    return p.returncode, p.stdout


def _repo_rel(path: Path) -> tuple[Path, str] | None:
    code, top = _git(["rev-parse", "--show-toplevel"], path.parent)
    if code != 0:
        return None
    root = Path(top.strip())
    return root, path.resolve().relative_to(root.resolve()).as_posix()


def _trailer_present(root: Path, base_ref: str, trailer: str) -> bool:
    code, out = _git(["log", "--format=%B", f"{base_ref}..HEAD"], root)
    if code != 0:
        return False
    return any(line.strip().lower().startswith(trailer.lower() + ":") for line in out.splitlines())


# A version heading in CHANGELOG.md or RELEASES.md: "## 1.2.3", "## v1.2.3", "## [1.2.3]",
# "## [v1.2.3]", each optionally followed by " - date", " — date", " – date" or " — Unreleased".
_VER = r"[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]*[0-9A-Za-z])?"
VERSION_HEADING_RE = re.compile(
    r"^#{1,6}[ \t]+(?:\[v?(" + _VER + r")\]|v?(" + _VER + r"))"  # brackets balanced or absent
    r"(?:[ \t]+(?:-|\u2013|\u2014)[ \t]+[^\n]*)?[ \t]*$")
VERSION_FILES = ("CHANGELOG.md", "RELEASES.md")


def versions_in(text: str) -> set[str]:
    """Every version a CHANGELOG.md or RELEASES.md gives a heading of its own. Headings inside a
    code fence or an HTML comment do not count."""
    found = set()
    in_fence = in_comment = False
    for line in text.splitlines():
        t = line.strip()
        if in_comment:
            in_comment = "-->" not in t
            continue
        if FENCE_RE.match(t):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if t.startswith("<!--"):
            in_comment = "-->" not in t
            continue
        m = VERSION_HEADING_RE.match(line.rstrip())
        if m:
            found.add(m.group(1) or m.group(2))
    return found


def check_mcp_versions(parsed: dict, package_json: Path | None, changelogs: list[Path]) -> list[dict]:
    """Check 6: every MCP version named exists in package.json or a version file (CHANGELOG.md,
    RELEASES.md). Version files are read with VERSION_HEADING_RE."""
    known: set[str] = set()
    sources = 0
    if package_json and package_json.is_file():
        sources += 1
        try:
            v = json.loads(package_json.read_text(encoding="utf-8")).get("version")
            if v:
                known.add(v)
        except json.JSONDecodeError:
            return [{"code": "package-json-unreadable", "line": 0}]
    for changelog in changelogs:
        if changelog.is_file():
            sources += 1
            known |= versions_in(changelog.read_text(encoding="utf-8"))
    if not sources:
        return []
    out = []
    for e in parsed["entries"]:
        if e["mcp_version"]:
            m = SEMVER_RE.search(e["mcp_version"])
            if m and m.group(1) not in known:
                out.append({"code": "mcp-version-unknown", "line": e["line"]})
    return out


def check_append_only(path: Path, text: str, base_ref: str) -> list[dict]:
    """Check 7: old entries survive; their lines survive in order; lines added inside an old dated
    entry are Update lines. The Unreleased entry is exempt until it has a date.
    Override: a `Whats-changed-edit: <reason>` trailer in base..HEAD, or WHATS_CHANGED_EDIT_OK=1."""
    rel = _repo_rel(path)
    if rel is None:
        return [{"code": "not-a-git-repo", "line": 0}]
    root, relpath = rel
    code, old = _git(["show", f"{base_ref}:{relpath}"], root)
    if code != 0:
        return []  # the file is new on this branch
    if os.environ.get("WHATS_CHANGED_EDIT_OK") == "1" or _trailer_present(root, base_ref, "Whats-changed-edit"):
        return []
    # Every entry that parsed at the base must still parse now. A raw-line comparison alone
    # misses an entry hidden by an unclosed comment opened above it.
    new_entries = parse(text)["entries"]
    old_entries = parse(old)["entries"]
    new_anchors = {e["anchor"] for e in new_entries}
    old_lines = [ln.rstrip() for ln in old.replace("\r\n", "\n").split("\n")]
    new_lines = [ln.rstrip() for ln in text.replace("\r\n", "\n").split("\n")]
    # An "Unreleased:" entry is not published yet, so its whole body may change while it is
    # Unreleased, including in the commit that gives it a date. It may not disappear or change
    # title: at the new ref it is still Unreleased with the same title, or newly dated with it. Everything
    # else (one Unreleased, first; dates in order and not in the future) is checked by parse().
    old_anchors = {e["anchor"] for e in old_entries}
    unreleased_spans: list[tuple[int, int]] = []
    errors = []
    for oe in old_entries:
        if not oe["unreleased"]:
            if oe["anchor"] not in new_anchors:
                errors.append({"code": "old-entry-missing", "line": 0, "anchor": oe["anchor"]})
            continue
        # Same title either way: still Unreleased, or newly dated. Any other Unreleased entry
        # (a throwaway "Dummy") does not count.
        kept = any(ne["title"] == oe["title"] and (ne["unreleased"] or ne["anchor"] not in old_anchors)
                   for ne in new_entries)
        if not kept:
            errors.append({"code": "old-entry-missing", "line": 0, "anchor": oe["anchor"]})
        start = oe["line"] - 1
        end = next((k for k in range(start + 1, len(old_lines)) if old_lines[k].startswith("## ")), len(old_lines))
        unreleased_spans.append((start, end))
    if unreleased_spans:
        old_lines = [ln for k, ln in enumerate(old_lines) if not any(a <= k < b for a, b in unreleased_spans)]
    old_headings = {ln for ln in old_lines if ln.startswith("## ")
                    and (ENTRY_HEADING_RE.match(ln[3:]) or UNRELEASED_HEADING_RE.match(ln[3:]))}
    line_errors: list[dict] = []
    j = 0
    matched = [False] * len(new_lines)
    for ol in old_lines:
        start = j
        while j < len(new_lines) and new_lines[j] != ol:
            j += 1
        if j == len(new_lines):
            line_errors.append({"code": "old-line-changed", "line": 0, "text": ol})
            j = start  # this old line is gone; keep matching the rest from the same place
            continue
        matched[j] = True
        j += 1
    if line_errors:
        more = [{"code": "old-line-changed", "line": 0, "more": len(line_errors) - 1}] if len(line_errors) > 1 else []
        return errors + line_errors[:1] + more
    heading = None
    in_update = False
    for n, ln in enumerate(new_lines):
        if ln.startswith("## "):
            heading = ln
            in_update = False
            continue
        if matched[n] or not ln.strip() or heading not in old_headings:
            if matched[n]:
                in_update = False
            continue
        fm = FIELD_RE.match(ln)
        if fm and UPDATE_LABEL_RE.match(fm.group(1)):
            in_update = True
            continue
        if in_update and CONT_RE.match(ln):
            continue
        errors.append({"code": "old-entry-edited", "line": n + 1})
    return errors


def check_version_bump(path: Path, parsed: dict, package_json: Path, base_ref: str) -> list[dict]:
    """Check 8: a version bump in package.json needs an MCP entry naming the new version,
    or a `No-whats-changed: <reason>` trailer (or NO_WHATS_CHANGED=1)."""
    if not package_json.is_file():
        return []
    rel = _repo_rel(package_json)
    if rel is None:
        return []
    root, relpath = rel
    code, old = _git(["show", f"{base_ref}:{relpath}"], root)
    if code != 0:
        return []
    try:
        old_v = json.loads(old).get("version")
        new_v = json.loads(package_json.read_text(encoding="utf-8")).get("version")
    except json.JSONDecodeError:
        return [{"code": "package-json-unreadable", "line": 0}]
    if not new_v or old_v == new_v:
        return []
    for e in parsed["entries"]:
        if "MCP" in e["tags"] and e["mcp_version"]:
            m = SEMVER_RE.search(e["mcp_version"])
            if m and m.group(1) == new_v:
                return []
    if os.environ.get("NO_WHATS_CHANGED") == "1" or _trailer_present(root, base_ref, "No-whats-changed"):
        return []
    return [{"code": "version-bump-needs-entry", "line": 0, "version": new_v}]


# --------------------------------------------------------------------------- rendering


def human_date(iso: str) -> str:
    d = dt.date.fromisoformat(iso)
    return f"{MONTHS[d.month - 1]} {d.day}, {d.year}"


def time_tag(iso: str) -> str:
    if not is_real_date(iso):
        return html.escape(iso)
    return f'<time datetime="{iso}">{human_date(iso)}</time>'


class LinkMap:
    """Where a link in the file points on the rendered page.

    - absolute URLs, mailto: and #anchors are left alone;
    - a repo-relative path under `site_prefix` becomes site-relative (prefix stripped,
      `link_base` prepended), because the page lives inside the site;
    - any other repo-relative path goes to the file on GitHub when `repo_url` is set."""

    def __init__(self, repo_url: str | None = None, site_prefix: str | None = None, link_base: str = ""):
        self.repo_url = repo_url.rstrip("/") if repo_url else None
        self.site_prefix = site_prefix.strip("/") + "/" if site_prefix else None
        self.link_base = link_base

    def __call__(self, url: str) -> str | None:
        """The href to use, or None for a link that must not be rendered as a link."""
        if not is_safe_url(url):
            return None
        if SCHEME_RE.match(url) or url.startswith("#"):
            return url
        path = url[2:] if url.startswith("./") else url
        if self.site_prefix and path.startswith(self.site_prefix):
            return self.link_base + path[len(self.site_prefix):]
        if self.repo_url:
            return f"{self.repo_url}/blob/HEAD/{path.lstrip('/')}"
        return url


INLINE_RE = re.compile(r"`([^`]+)`|\[([^\[\]]+)\]\(([^() \t]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*")


def inline(md: str, link_map: LinkMap) -> str:
    """Markdown inline subset: code, links, bold, italic. Everything else is escaped text,
    so raw HTML in the file is shown as text, never run."""
    out = []
    pos = 0
    for m in INLINE_RE.finditer(md):
        out.append(html.escape(md[pos:m.start()]))
        if m.group(1) is not None:
            out.append(f"<code>{html.escape(m.group(1))}</code>")
        elif m.group(2) is not None:
            href = link_map(m.group(3))
            if href is None:  # unsafe scheme: show the words, never the link
                out.append(html.escape(m.group(2)))
            else:
                out.append(f'<a href="{html.escape(href)}">{html.escape(m.group(2))}</a>')
        elif m.group(4) is not None:
            out.append(f"<strong>{html.escape(m.group(4))}</strong>")
        else:
            out.append(f"<em>{html.escape(m.group(5))}</em>")
        pos = m.end()
    out.append(html.escape(md[pos:]))
    return "".join(out)


def render_blocks(md: str, link_map: LinkMap) -> str:
    """Paragraphs and flat bullet lists, for the file's intro text."""
    out: list[str] = []
    para: list[str] = []
    items: list[str] = []

    def flush():
        if para:
            out.append(f"<p>{inline(' '.join(para), link_map)}</p>")
            para.clear()
        if items:
            out.append("<ul>" + "".join(f"<li>{inline(i, link_map)}</li>" for i in items) + "</ul>")
            items.clear()

    for line in md.split("\n"):
        s = line.strip()
        if not s:
            flush()
        elif s.startswith("- ") or s.startswith("* "):
            if para:
                flush()
            items.append(s[2:])
        elif items and line.startswith("  "):
            items[-1] += " " + s
        else:
            if items:
                flush()
            para.append(s)
    flush()
    return "\n".join(out)


STYLE = """<style>
.whats-changed{color:#414141;font-size:1.0625rem;line-height:1.76;max-width:750px;overflow-wrap:anywhere}
.whats-changed a{color:#2359a8;text-decoration:underline}
.whats-changed a:focus-visible,.whats-changed input:focus-visible{outline:3px solid #2359a8;outline-offset:2px}
.whats-changed fieldset{border:1px solid #949494;border-radius:4px;margin:1.5rem 0 .5rem;padding:.25rem 1rem .5rem}
.whats-changed legend{font-weight:700;padding:0 .25rem}
.whats-changed .wc-option{display:inline-flex;align-items:center;gap:.5rem;min-height:44px;margin-right:1.25rem;cursor:pointer}
.whats-changed .wc-option input{width:1.25rem;height:1.25rem;margin:0;accent-color:#2359a8}
.whats-changed .wc-status{font-style:italic}
.whats-changed .wc-entry{border-top:1px solid #949494;padding:1.5rem 0 .5rem}
.whats-changed .wc-entry[hidden]{display:none}
.whats-changed .wc-entry h2{font-size:1.5rem;line-height:1.35;margin:0 0 .25rem}
.whats-changed .wc-meta{margin:0 0 .75rem}
.whats-changed .wc-tag{display:inline-block;border:1px solid #414141;border-radius:4px;padding:0 .5rem;margin:0 .375rem .25rem 0;line-height:1.6}
.whats-changed .wc-tag-correction{border:2px solid #2359a8;color:#2359a8;font-weight:700}
.whats-changed .wc-old-numbers{background:#EEF4FF;border-left:4px solid #2359a8;padding:.75rem 1rem;margin:1rem 0}
.whats-changed .wc-old-numbers p{margin:0}
.whats-changed .wc-permalink a{display:inline-block;min-height:44px;line-height:44px}
.whats-changed .wc-visually-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media (max-width:600px){.whats-changed .wc-entry h2{font-size:1.25rem}}
</style>"""

# Progressive enhancement: the filter starts hidden and only appears when this runs, so with
# JavaScript off every entry shows and there is no dead control.
SCRIPT_JS = """<script>
(function () {
  var roots = document.querySelectorAll("[data-whats-changed]");
  Array.prototype.forEach.call(roots, function (root) {
    var box = root.querySelector(".wc-filters");
    var status = root.querySelector(".wc-status");
    var entries = root.querySelectorAll(".wc-entry");
    if (!box || !status || !entries.length) return;
    var tagBoxes = box.querySelectorAll("input[name='wc-tag']");
    var corrBox = box.querySelector("input[name='wc-corrections']");
    var total = entries.length;
    var noun = total === 1 ? "change" : "changes";
    function apply() {
      var on = {};
      Array.prototype.forEach.call(tagBoxes, function (b) { on[b.value] = b.checked; });
      var shown = 0;
      Array.prototype.forEach.call(entries, function (el) {
        var tags = (el.getAttribute("data-tags") || "").split(" ");
        var ok = tags.some(function (t) { return on[t]; });
        if (corrBox.checked && tags.indexOf("Correction") < 0) ok = false;
        el.hidden = !ok;
        if (ok) shown++;
      });
      status.textContent = shown === total
        ? "Showing all " + total + " " + noun + "."
        : "Showing " + shown + " of " + total + " " + noun + ".";
    }
    function reveal() {
      var id = decodeURIComponent(location.hash.slice(1));
      var el = id && document.getElementById(id);
      if (el && root.contains(el) && el.closest(".wc-entry[hidden]")) {
        Array.prototype.forEach.call(tagBoxes, function (b) { b.checked = true; });
        corrBox.checked = false;
        apply();
        el.scrollIntoView();
      }
    }
    box.addEventListener("change", apply);
    window.addEventListener("hashchange", reveal);
    box.hidden = false;
  });
})();
</script>"""


def _field_p(label: str, value: str, link_map: LinkMap) -> str:
    return f"<p><strong>{html.escape(label)}:</strong> {inline(value, link_map)}</p>"


def render_entry(e: dict, link_map: LinkMap) -> str:
    a = html.escape(e["anchor"])
    tags_html = '<span class="wc-visually-hidden">, </span>'.join(
        f'<span class="wc-tag{" wc-tag-correction" if t == "Correction" else ""}">{t}</span>' for t in e["tags"]
    )
    parts = [
        f'<article class="wc-entry" id="{a}" data-tags="{" ".join(e["tags"])}" aria-labelledby="{a}-title">',
        f'<h2 id="{a}-title">{html.escape(e["title"])}</h2>',
        f'<p class="wc-meta">{"Not released yet" if e["unreleased"] else time_tag(e["date"])}</p>',
        f'<p class="wc-tags"><span class="wc-visually-hidden">Tags: </span>{tags_html}</p>',
    ]
    if e["summary"]:
        parts.append(f"<p>{inline(e['summary'], link_map)}</p>")
    if e["if_you_used_the_old_numbers"]:
        parts.append('<div class="wc-old-numbers">'
                     + _field_p("If you used the old numbers", e["if_you_used_the_old_numbers"], link_map)
                     + "</div>")
    if e["who_it_affects"]:
        parts.append(_field_p("Who it affects", e["who_it_affects"], link_map))
    if e["mcp_version"]:
        parts.append(_field_p("MCP version", e["mcp_version"], link_map))
    if e["more_detail"]:
        parts.append(_field_p("More detail", e["more_detail"], link_map))
    for u in e["updates"]:
        parts.append(f'<p class="wc-update"><strong>Update, {time_tag(u["date"])}:</strong> '
                     f"{inline(u['text'], link_map)}</p>")
    parts.append(f'<p class="wc-permalink"><a href="#{a}">Link to this change'
                 f'<span class="wc-visually-hidden">: {html.escape(e["title"])}</span></a></p>')
    parts.append("</article>")
    return "\n".join(parts)


def render_fragment(parsed: dict, link_map: LinkMap, *, with_h1: bool = True, with_style: bool = True,
                    with_script: bool = True) -> str:
    entries = [e for e in parsed["entries"] if e.get("valid", True)]
    n = len(entries)
    parts = ['<div class="whats-changed" data-whats-changed>']
    if with_style:
        parts.append(STYLE)
    if with_h1:
        parts.append(f"<h1>{html.escape(parsed['title'] or 'What' + chr(39) + 's changed')}</h1>")
    if parsed["intro"]:
        parts.append(f'<div class="wc-intro">\n{render_blocks(parsed["intro"], link_map)}\n</div>')
    if not n:
        parts.append('<p class="wc-empty">No changes are recorded yet.</p>')
        parts.append("</div>")
        return "\n".join(parts)
    parts.append(
        '<div class="wc-filters" hidden>\n<fieldset>\n<legend>Show changes to</legend>\n'
        + "\n".join(
            f'<label class="wc-option"><input type="checkbox" name="wc-tag" value="{t}" checked> {t}</label>'
            for t in SUBJECT_TAGS
        )
        + '\n<label class="wc-option"><input type="checkbox" name="wc-corrections" value="Correction">'
        " Corrections only</label>\n</fieldset>\n</div>"
    )
    noun = "change" if n == 1 else "changes"
    parts.append(f'<p class="wc-status" role="status" aria-live="polite" aria-atomic="true">'
                 f"Showing all {n} {noun}.</p>")
    parts.extend(render_entry(e, link_map) for e in entries)
    if with_script:
        parts.append(SCRIPT_JS)
    parts.append("</div>")
    return "\n".join(parts)


def render_page(parsed: dict, link_map: LinkMap, site_name: str, home_url: str, repo_url: str | None) -> str:
    title = parsed["title"] or "What's changed"
    issues = f'<a href="{html.escape(repo_url.rstrip("/") + "/issues")}">Report a bug on this site or ask for a new feature</a>' \
        if repo_url else ""
    return "\n".join([
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f"<title>{html.escape(title)} - {html.escape(site_name)}</title>",
        "<style>",
        "body{margin:0;font-family:Poppins,system-ui,sans-serif;color:#414141;background:#fff}",
        ".wc-skip{position:absolute;left:-999px;top:0;background:#2359a8;color:#fff;padding:.75rem 1rem}",
        ".wc-skip:focus{left:0}",
        "header,main,footer{max-width:750px;margin:0 auto;padding:1rem}",
        "header a,footer a{color:#2359a8}",
        "h1,h2{font-family:Roboto,system-ui,sans-serif}",
        "</style>",
        "</head>",
        "<body>",
        '<a class="wc-skip" href="#main">Skip to main content</a>',
        "<header>",
        f'<nav aria-label="Site"><a href="{html.escape(home_url)}">{html.escape(site_name)} home</a></nav>',
        "</header>",
        '<main id="main">',
        render_fragment(parsed, link_map),
        "</main>",
        "<footer>",
        "<p>Built by BetaNYC, a project of the Fund for the City of New York. " + issues + "</p>",
        "</footer>",
        "</body>",
        "</html>",
        "",
    ])


def _yaml_title(parsed: dict) -> str:
    """The page title as a YAML double-quoted string. JSON string syntax is valid YAML, so quotes,
    backslashes and control characters are escaped; the parser already rejects markup in it."""
    return json.dumps(parsed["title"] or "What's changed", ensure_ascii=False)


def render_quarto(parsed: dict, link_map: LinkMap) -> str:
    title = _yaml_title(parsed)
    body = render_fragment(parsed, link_map, with_h1=False)
    return f'---\ntitle: {title}\n---\n\n```{{=html}}\n{body}\n```\n'


def liquid_safe(body: str) -> str:
    """Wrap HTML so Jekyll's Liquid never runs anything in it. The whole fragment goes inside
    {% raw %}...{% endraw %}; a raw block ends at the first {% endraw %}, so every "{%" inside the
    body is first written as "&#123;%", which a browser shows as "{%" but Liquid does not see.
    The fragment's own style and script contain no "{%" (a test checks), so only text changes."""
    return "{% raw %}" + body.replace("{%", "&#123;%") + "{% endraw %}"


def render_jekyll(parsed: dict, link_map: LinkMap, layout: str) -> str:
    title = _yaml_title(parsed)
    body = render_fragment(parsed, link_map, with_h1=False)
    return f'---\nlayout: {layout}\ntitle: {title}\n---\n{liquid_safe(body)}\n'


def active_notices(parsed: dict, page: str, today: str, days: int = NOTICE_DAYS) -> list[dict]:
    t = dt.date.fromisoformat(today)
    out = []
    for e in parsed["entries"]:
        if (not e.get("valid", True) or e.get("unreleased") or "Correction" not in e["tags"] or page not in e["notice_on"]
                or not is_real_date(e["date"])):
            continue
        age = (t - dt.date.fromisoformat(e["date"])).days
        if 0 <= age < days:
            out.append(e)
    return out


def render_notice(entries: list[dict], page_url: str) -> str:
    out = []
    for e in entries:
        out.append(
            f'<p class="wc-notice" role="note" style="background:#EEF4FF;border-left:4px solid #2359a8;'
            f'color:#414141;padding:.75rem 1rem"><strong>Correction, {time_tag(e["date"])}:</strong> '
            f'<a href="{html.escape(page_url)}#{html.escape(e["anchor"])}" style="color:#2359a8">'
            f"{html.escape(e['title'])}</a></p>"
        )
    return "\n".join(out)


# --------------------------------------------------------------------------- CLI


def _replace_between(doc: str, start: str, end: str, body: str) -> str | None:
    a = doc.find(start)
    b = doc.find(end, a + len(start)) if a >= 0 else -1
    if a < 0 or b < 0:
        return None
    return doc[: a + len(start)] + "\n" + body + "\n" + doc[b:]


def _write_or_check(target: Path, content: str, *, into: bool, start: str, end: str, check: bool) -> int:
    if into:
        if not target.is_file():
            print(f"{SCRIPT}: {target} does not exist", file=sys.stderr)
            return 2
        current = target.read_text(encoding="utf-8")
        new = _replace_between(current, start, end, content)
        if new is None:
            print(f"{SCRIPT}: {target} has no {start} ... {end} markers", file=sys.stderr)
            return 2
    else:
        current = target.read_text(encoding="utf-8") if target.is_file() else None
        new = content
    if check:
        if current != new:
            print(f"{SCRIPT}: {target} is stale; re-run without --check", file=sys.stderr)
            return 1
        print(f"{SCRIPT}: {target} is current")
        return 0
    if current != new:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(new, encoding="utf-8")
        print(f"{SCRIPT}: wrote {target}")
    else:
        print(f"{SCRIPT}: {target} already current")
    return 0


def _load(path: Path, today: str | None) -> tuple[str, dict] | None:
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"{SCRIPT}: {path} not found", file=sys.stderr)
        return None
    return text, parse(text, today)


HINTS = {
    "title-markup": "write the title (the # page title or an entry title) in plain words: no * ` [ ] < > & _ ~ # or backslash (write 'and' for &)",
    "unsafe-link": "links may only be http, https, mailto, a repo path or a #anchor",
    "template-placeholder": "replace the starter file's placeholder text and example entries",
    "unterminated-comment": "close the <!-- comment; everything after it is hidden on GitHub",
    "unterminated-fence": "close the ``` or ~~~ code block; everything after it is shown as code",
    "text-after-comment": "put nothing after --> on the same line; start the text on a new line",
    "inline-comment": "an HTML comment must be on its own lines, not inside text",
    "control-character": "remove the invisible control character",
    "line-too-long": f"lines are limited to {MAX_LINE} characters",
    "file-too-large": f"the file is limited to {MAX_CHARS} characters",
    "old-entry-missing": "an entry published at the base ref no longer appears; never delete or hide an entry",
    "unreleased-entry": "at release, change '## Unreleased: Title' to '## YYYY-MM-DD: Title' with the release date",
    "duplicate-unreleased": "only one 'Unreleased:' entry is allowed",
    "unreleased-not-first": "the 'Unreleased:' entry must be the first entry",
}


def _report(path: Path, errors: list[dict], warnings: list[dict]) -> None:
    for e in errors:
        extra = "".join(f" {k}={v}" for k, v in e.items() if k not in ("code", "line"))
        hint = f" ({HINTS[e['code']]})" if e["code"] in HINTS else ""
        print(f"{path}:{e['line']}: error {e['code']}{extra}{hint}", file=sys.stderr)
    for w in warnings:
        print(f"{path}:{w['line']}: warning {w['code']}", file=sys.stderr)


def _today(arg: str | None) -> str | None:
    if arg and not is_real_date(arg):
        raise SystemExit(f"{SCRIPT}: --today must be YYYY-MM-DD")
    return arg


def cmd_check(a: argparse.Namespace) -> int:
    loaded = _load(a.file, _today(a.today))
    if loaded is None:
        return 2
    text, parsed = loaded
    errors = list(parsed["errors"])
    pkg = a.package_json or (a.file.parent / "package.json")
    chg = a.changelog or [a.file.parent / name for name in VERSION_FILES]
    errors += check_mcp_versions(parsed, pkg, chg)
    if a.release:
        errors += [{"code": "unreleased-entry", "line": e["line"]} for e in parsed["entries"] if e["unreleased"]]
    if a.base_ref:
        errors += check_append_only(a.file, text, a.base_ref)
        errors += check_version_bump(a.file, parsed, pkg, a.base_ref)
    warns = warnings_for(parsed)
    _report(a.file, errors, warns)
    failed = bool(errors) or (a.strict and bool(warns))
    n = len(parsed["entries"])
    print(f"{SCRIPT}: {a.file}: {n} entries, {len(errors)} errors, {len(warns)} warnings"
          f" -> {'FAIL' if failed else 'OK'}")
    return 1 if failed else 0


def cmd_json(a: argparse.Namespace) -> int:
    loaded = _load(a.file, _today(a.today))
    if loaded is None:
        return 2
    print(json.dumps(loaded[1], indent=2, ensure_ascii=False))
    return 0


def cmd_render(a: argparse.Namespace) -> int:
    loaded = _load(a.file, _today(a.today))
    if loaded is None:
        return 2
    _, parsed = loaded
    if parsed["errors"]:
        _report(a.file, parsed["errors"], [])
        if not a.allow_errors:
            print(f"{SCRIPT}: refusing to render a file with errors; run `check` first", file=sys.stderr)
            return 1
        dropped = sum(1 for e in parsed["entries"] if not e["valid"])
        print(f"{SCRIPT}: --allow-errors: leaving out {dropped} entries with errors", file=sys.stderr)
    lm = LinkMap(a.repo_url, a.site_prefix, a.link_base)
    if a.format == "fragment":
        out = render_fragment(parsed, lm, with_h1=not a.no_h1, with_style=not a.no_style)
    elif a.format == "page":
        out = render_page(parsed, lm, a.site_name, a.home_url, a.repo_url)
    elif a.format == "quarto":
        out = render_quarto(parsed, lm)
    else:
        out = render_jekyll(parsed, lm, a.layout)
    if not a.out and not a.into:
        sys.stdout.write(out)
        return 0
    if a.into and a.format != "fragment":
        print(f"{SCRIPT}: --into only takes --format fragment", file=sys.stderr)
        return 2
    return _write_or_check(a.into or a.out, out, into=bool(a.into), start=MARK_START, end=MARK_END, check=a.check)


def cmd_notice(a: argparse.Namespace) -> int:
    loaded = _load(a.file, _today(a.today))
    if loaded is None:
        return 2
    _, parsed = loaded
    if parsed["errors"]:
        _report(a.file, parsed["errors"], [])
        return 1
    today = a.today or dt.date.today().isoformat()
    out = render_notice(active_notices(parsed, a.page, today, a.days), a.page_url)
    if not a.into:
        if out:
            print(out)
        return 0
    return _write_or_check(a.into, out, into=True, start=NOTICE_START, end=NOTICE_END, check=a.check)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="whats_changed.py", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    def common(sp):
        sp.add_argument("file", type=Path, help="path to WHATS-CHANGED.md")
        sp.add_argument("--today", help="YYYY-MM-DD used for date checks (default: today)")

    c = sub.add_parser("check", help="validate the file")
    common(c)
    c.add_argument("--package-json", type=Path, help="package.json for the MCP version check "
                   "(default: CHANGELOG.md and RELEASES.md next to the file, whichever exist)")
    c.add_argument("--changelog", type=Path, action="append",
                   help="a version file (CHANGELOG.md or RELEASES.md) for the MCP version check; repeatable "
                   "(default: CHANGELOG.md and RELEASES.md next to the file, whichever exist)")
    c.add_argument("--base-ref", help="git ref to compare against (append-only and version-bump checks)")
    c.add_argument("--strict", action="store_true", help="warnings fail too")
    c.add_argument("--release", action="store_true",
                   help="release gate: fail if an 'Unreleased:' entry is left (run before npm publish)")
    c.set_defaults(func=cmd_check)

    j = sub.add_parser("json", help="print the canonical parse as JSON")
    common(j)
    j.set_defaults(func=cmd_json)

    r = sub.add_parser("render", help="write the What's changed page or fragment")
    common(r)
    r.add_argument("--format", choices=["fragment", "page", "quarto", "jekyll"], default="fragment")
    r.add_argument("--out", type=Path, help="write to this file (default: stdout)")
    r.add_argument("--into", type=Path, help=f"replace the text between {MARK_START} and {MARK_END} in this HTML file")
    r.add_argument("--check", action="store_true", help="exit 1 if the output file is stale; write nothing")
    r.add_argument("--repo-url", help="https://github.com/BetaNYC/<repo>; repo-relative links outside the site go here")
    r.add_argument("--site-prefix", help="repo folder the site is built from (e.g. viz/); links under it become site-relative")
    r.add_argument("--link-base", default="", help="prefix for site-relative links (e.g. ../ when the page is one level down)")
    r.add_argument("--no-h1", action="store_true", help="fragment without its h1 (the host page supplies one)")
    r.add_argument("--no-style", action="store_true", help="fragment without its <style> block")
    r.add_argument("--site-name", default="BetaNYC", help="page format: site name for <title> and nav")
    r.add_argument("--home-url", default="./", help="page format: link to the site's home page")
    r.add_argument("--layout", default="default", help="jekyll format: layout name")
    r.add_argument("--allow-errors", action="store_true",
                   help="render anyway, leaving out every entry that has an error (default: refuse)")
    r.set_defaults(func=cmd_render)

    n = sub.add_parser("notice", help="the correction notice for one page")
    common(n)
    n.add_argument("--page", required=True, help="the page as written in the entry's 'Notice on' field")
    n.add_argument("--page-url", default="whats-changed.html", help="link to the What's changed page, from this page")
    n.add_argument("--days", type=int, default=NOTICE_DAYS, help=f"days a notice stays up (default {NOTICE_DAYS})")
    n.add_argument("--into", type=Path, help=f"replace the text between {NOTICE_START} and {NOTICE_END} in this file")
    n.add_argument("--check", action="store_true", help="exit 1 if the file is stale; write nothing")
    n.set_defaults(func=cmd_notice)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
