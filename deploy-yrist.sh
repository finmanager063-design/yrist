#!/bin/bash
# Публикация на СТАРЫЙ сайт: https://finmanager063-design.github.io/yrist/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [[ -z "${YRIST_DEPLOY_TOKEN:-}" ]]; then
  echo "Задайте токен GitHub от аккаунта finmanager063-design:"
  echo "  export YRIST_DEPLOY_TOKEN=ghp_..."
  echo "  ./deploy-yrist.sh"
  echo ""
  echo "Или добавьте секрет YRIST_DEPLOY_TOKEN в makarov-law → Actions — тогда push в makarov-backup сам обновит yrist."
  exit 1
fi

REMOTE="https://${YRIST_DEPLOY_TOKEN}@github.com/finmanager063-design/yrist.git"
git push "$REMOTE" main

echo ""
echo "Готово: https://finmanager063-design.github.io/yrist/"
echo "Подождите 1–2 минуты и обновите страницу (Ctrl+Shift+R)."
