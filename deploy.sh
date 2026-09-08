#!/usr/bin/env bash
# Publish docs/ to GitHub Pages. Pages serves main:/docs directly, so this is
# just: verify, then push. No second branch, no force-push.
set -euo pipefail
cd "$(dirname "$0")"
git diff --quiet && git diff --cached --quiet || { echo "Commit your changes first."; exit 1; }
node --check docs/app.js
node --check docs/data.js
node --check docs/catalog.js
node --test screen-geometry.test.js >/dev/null
for img in docs/assets/*.webp; do
  file -b "$img" | grep -q "Web/P" || { echo "NOT A VALID WEBP: $img"; exit 1; }
done
git push origin main
echo "Deployed. Live at https://josh-gier.com within ~1 minute."
