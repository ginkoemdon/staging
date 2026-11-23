#!/bin/bash
# Stage an experiment: copy experiment/<name> from upstream into <name>/ here.
# Usage: ./scripts/stage.sh <name> "One-line description"
# Run from the root of this staging repo. Uses the gh CLI.
set -euo pipefail
NAME="${1:?Usage: stage.sh <name> \"description\"}"
DESC="${2:-Experiment $NAME}"
UPSTREAM="ginkoemdon/ginkoemdon.github.io"
STAGING_DIR="$(pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Fetch the experiment branch (or create it from upstream main if new).
if ! git ls-remote "https://github.com/$UPSTREAM.git" "refs/heads/experiment/$NAME" | grep -q .; then
  echo "No experiment/$NAME branch yet — creating it from upstream main."
  echo "Run this in a clone of $UPSTREAM first, then re-run stage.sh:"
  echo "  git checkout -b experiment/$NAME origin/main"
  echo "  git push -u origin experiment/$NAME"
  exit 1
fi

git clone --quiet --depth 1 --branch "experiment/$NAME" "https://github.com/$UPSTREAM.git" "$TMP/site"
rm -rf "$STAGING_DIR/$NAME"
mkdir -p "$STAGING_DIR/$NAME"
# Copy the whole site, excluding git metadata.
cp -a "$TMP/site/." "$STAGING_DIR/$NAME/"
rm -rf "$STAGING_DIR/$NAME/.git"
touch "$STAGING_DIR/$NAME/.nojekyll"

SHA="$(git -C "$TMP/site" rev-parse HEAD 2>/dev/null || echo unknown)"
python3 "$STAGING_DIR/scripts/update-manifest.py" "$NAME" "$DESC" "$SHA"
git add "$NAME" experiments.json index.html
git commit -m "Stage $NAME tenant: $DESC" || echo "Nothing new to commit."
echo "Staged $NAME. Push with: git push origin main"
echo "Live at: https://ginkoemdon.github.io/staging/$NAME/"
