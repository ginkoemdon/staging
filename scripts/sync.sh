#!/bin/bash
# Sync staging tenants with upstream.
# Usage:
#   ./scripts/sync.sh <name>        re-export one tenant from its experiment branch
#   ./scripts/sync.sh --all         re-export every tenant in experiments.json
#   ./scripts/sync.sh --check       report which tenants are behind upstream main (no changes)
# The experiment branch itself must first be rebased on upstream main
# in the production repo — see README.md. This script only re-copies it.
set -euo pipefail
UPSTREAM="ginkoemdon/ginkoemdon.github.io"
STAGING_DIR="$(pwd)"

check_one() {
  local name="$1"
  local branch_sha main_sha
  branch_sha="$(git ls-remote "https://github.com/$UPSTREAM.git" "refs/heads/experiment/$name" | cut -f1)"
  main_sha="$(git ls-remote "https://github.com/$UPSTREAM.git" "refs/heads/main" | cut -f1)"
  if [ -z "$branch_sha" ]; then echo "$name: experiment branch missing"; return; fi
  if git merge-base --is-ancestor "$main_sha" "$branch_sha" 2>/dev/null; then
    echo "$name: up to date with main (branch contains main)"
  else
    echo "$name: BEHIND main — rebase experiment/$name on main, then run sync.sh $name"
  fi
}

sync_one() {
  local name="$1"
  local tmp desc sha
  tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
  desc="$(python3 -c "import json; d=json.load(open('experiments.json')); print(next((e['description'] for e in d['experiments'] if e['name']=='$name'), 'Experiment $name'))")"
  git clone --quiet --depth 1 --branch "experiment/$name" "https://github.com/$UPSTREAM.git" "$tmp/site"
  sha="$(git -C "$tmp/site" rev-parse HEAD)"
  rm -rf "$STAGING_DIR/$name"
  mkdir -p "$STAGING_DIR/$name"
  cp -a "$tmp/site/." "$STAGING_DIR/$name/"
  rm -rf "$STAGING_DIR/$name/.git"
  touch "$STAGING_DIR/$name/.nojekyll"
  python3 "$STAGING_DIR/scripts/update-manifest.py" "$name" "$desc" "$sha"
  git add "$name" experiments.json index.html
  git commit -m "Sync $name tenant with upstream (experiment/$name @ $sha)" || echo "No changes for $name."
}

if [ "${1:-}" = "--check" ]; then
  python3 -c "import json; [print(e['name']) for e in json.load(open('experiments.json'))['experiments']]" | while read -r n; do check_one "$n"; done
  exit 0
fi
if [ "${1:-}" = "--all" ]; then
  python3 -c "import json; [print(e['name']) for e in json.load(open('experiments.json'))['experiments']]" | while read -r n; do sync_one "$n"; done
  echo "Sync done. Push with: git push origin main"
  exit 0
fi
NAME="${1:?Usage: sync.sh <name> | --all | --check}"
sync_one "$NAME"
echo "Synced $NAME. Push with: git push origin main"
