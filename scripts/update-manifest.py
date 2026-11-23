#!/usr/bin/env python3
"""Update experiments.json and regenerate the experiments list in index.html.

Usage:
  update-manifest.py <name> "<description>" <upstream_sha>
  update-manifest.py --remove <name>
"""
import json, re, sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "experiments.json"
INDEX = ROOT / "index.html"

def load():
    return json.loads(MANIFEST.read_text())

def save(data):
    MANIFEST.write_text(json.dumps(data, indent=2) + "\n")

def render_index(data):
    html = INDEX.read_text()
    if data["experiments"]:
        items = "\n".join(
            f'      <li>\n        <a href="{e["name"]}/">{e["name"]}/</a>\n'
            f'        <p>{e["description"]} (branch <code>experiment/{e["name"]}</code>)</p>\n      </li>'
            for e in data["experiments"]
        )
        block = f'    <ul class="previews">\n{items}\n    </ul>'
    else:
        block = (
            '    <ul class="previews">\n    </ul>\n'
            '    <p class="empty">No experiments staged yet. The first experiment will appear here '
            'once it is staged — see <a href="https://github.com/ginkoemdon/staging#readme">'
            'the staging README</a> for how to stage, sync, promote, and cut one.</p>'
        )
    html = re.sub(
        r"<!-- EXPERIMENTS:START -->.*?<!-- EXPERIMENTS:END -->",
        f"<!-- EXPERIMENTS:START -->\n{block}\n    <!-- EXPERIMENTS:END -->",
        html, flags=re.S,
    )
    INDEX.write_text(html)

if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "--remove":
        name = sys.argv[2]
        data = load()
        data["experiments"] = [e for e in data["experiments"] if e["name"] != name]
        save(data); render_index(data)
        print(f"Removed {name} from manifest.")
        sys.exit(0)
    name, desc, sha = sys.argv[1], sys.argv[2], sys.argv[3]
    data = load()
    entry = next((e for e in data["experiments"] if e["name"] == name), None)
    if entry is None:
        entry = {"name": name, "branch": f"experiment/{name}", "description": desc,
                 "upstream_sha": sha, "staged": str(date.today())}
        data["experiments"].append(entry)
    else:
        entry["description"] = desc
        entry["upstream_sha"] = sha
    save(data); render_index(data)
    print(f"Manifest updated for {name}.")
