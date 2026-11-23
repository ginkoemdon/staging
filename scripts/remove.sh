#!/bin/bash
# Remove a staging tenant after it ships or is cut.
# Usage: ./scripts/remove.sh <name> "shipped to production" | "cut by Ginko"
set -euo pipefail
NAME="${1:?Usage: remove.sh <name> \"reason\"}"
REASON="${2:-removed}"
python3 scripts/update-manifest.py --remove "$NAME"
rm -rf "$NAME"
git add -A
git commit -m "Remove $NAME tenant: $REASON" || echo "Nothing to commit."
echo "Removed $NAME. Push with: git push origin main"
echo "Remember, in the production repo: git push origin --delete experiment/$NAME"
