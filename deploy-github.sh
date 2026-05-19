#!/usr/bash
# Публикация на GitHub Pages (после: gh auth login)
set -euo pipefail
REPO="${1:-yrist}"
USER="finmanager063-design"
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
  git branch -M main
fi

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin --push 2>/dev/null || true
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "git@github.com:${USER}/${REPO}.git"
fi

git add -A
git diff --staged --quiet || git commit -m "Update site"
git push -u origin main

echo ""
echo "Готово. Включите GitHub Pages:"
echo "  https://github.com/${USER}/${REPO}/settings/pages"
echo "  Source: branch main, folder / (root)"
echo "Сайт: https://${USER}.github.io/${REPO}/"
