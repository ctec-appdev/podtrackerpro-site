#!/usr/bin/env python3
"""Extract index_alt_2.html body from agent transcript JSONL (one line per JSON object)."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
TRANSCRIPT = Path(
    r"C:\Users\User\.cursor\projects\c-Users-User-Documents-GitHub-podtrackerpro-site"
    r"\agent-transcripts\acbd9c57-ee7a-464c-8fea-848c35b36c46"
    r"\acbd9c57-ee7a-464c-8fea-848c35b36c46.jsonl"
)
OUT = REPO / "index_alt_2.html"


def main() -> int:
    if not TRANSCRIPT.is_file():
        print("Transcript not found:", TRANSCRIPT, file=sys.stderr)
        return 1

    needle = "create a 3rd alternate"
    with TRANSCRIPT.open(encoding="utf-8") as f:
        for line in f:
            if needle not in line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if obj.get("role") != "user":
                continue
            parts = obj.get("message", {}).get("content", [])
            if not parts or not isinstance(parts[0], dict):
                continue
            text = parts[0].get("text", "")
            if "index_alt_2" not in text:
                continue
            m = re.search(r"<!DOCTYPE html>.*?</html>", text, re.DOTALL | re.IGNORECASE)
            if not m:
                print("HTML block not found in matched line", file=sys.stderr)
                return 2
            html = m.group(0)
            # Unescape JSON string artifacts if any (line was parsed so should be raw)
            OUT.write_text(html, encoding="utf-8")
            print("Wrote", OUT, "bytes", len(html.encode("utf-8")))
            return 0

    print("No matching user message in transcript", file=sys.stderr)
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
