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
# Full DECODE, not a header read: truncated webp files keep a valid RIFF header
# (they report the right dimensions to file(1) and to the browser) but render
# as garbage. This is what shipped the broken JEDSTAR/CBRE/Coliseum covers.
for img in docs/assets/*.webp; do
  dwebp -quiet "$img" -o /dev/null 2>/dev/null || { echo "CORRUPT/TRUNCATED WEBP: $img"; exit 1; }
done
git push origin main
echo "Deployed. Live at https://josh-gier.com within ~1 minute."
