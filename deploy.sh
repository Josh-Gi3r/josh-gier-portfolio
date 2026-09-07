#!/usr/bin/env bash
# Publish dist/ to GitHub Pages (gh-pages branch). Run after committing on main.
set -euo pipefail
cd "$(dirname "$0")"
git diff --quiet && git diff --cached --quiet || { echo "Commit your changes first."; exit 1; }
node --check dist/app.js && node --check dist/data.js && node --test screen-geometry.test.js >/dev/null
git push origin main
git push origin --force "$(git subtree split --prefix dist main):refs/heads/gh-pages"
echo "Deployed. Live at https://josh-gier.com within ~1 minute."
