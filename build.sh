#!/bin/bash
# Build script para Cloudflare Pages (CI/CD via GitHub)
# O deploy é feito automaticamente pelo Cloudflare após este script.
#
# Configuração no Cloudflare Pages:
#   Build command:    ./build.sh
#   Output directory: site

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$ROOT_DIR/site"
LPS_DIR="$ROOT_DIR/lps"
REDIRECTS_FILE="$SITE_DIR/_redirects"

# =============================================================
# PROJETO RAIZ → meetup.growdoc.com.br/
# =============================================================
ROOT_PROJECT="meetup"

# =============================================================
# LPs registradas → nome da pasta = subpath da URL
# =============================================================
LPS=(
  "growth"
  # "evento"
)

# =============================================================
# FUNÇÕES
# =============================================================

deploy_root() {
  local SRC="$LPS_DIR/$1"
  echo "  🏠 Copiando site raiz..."
  rsync -a --exclude '.DS_Store' "$SRC/" "$SITE_DIR/"
}

build_lp() {
  local NAME="$1"
  local SRC="$LPS_DIR/$NAME"
  local DEST="$SITE_DIR/$NAME"

  echo "  📦 Buildando /$NAME..."
  cd "$SRC"

  npm install --silent
  npm run build --silent

  rm -rf "$DEST" && mkdir -p "$DEST"
  rsync -a --exclude '_redirects' "$SRC/dist/" "$DEST/"

  local RULE="/$NAME/*  /$NAME/index.html  200"
  if [ -f "$REDIRECTS_FILE" ]; then
    grep -q "^/$NAME/\*" "$REDIRECTS_FILE" || echo "$RULE" >> "$REDIRECTS_FILE"
  else
    echo "$RULE" > "$REDIRECTS_FILE"
  fi

  echo "     ✅ /$NAME pronto"
}

# =============================================================
# EXECUÇÃO
# =============================================================

echo ""
echo "🔨 Build — meetup.growdoc.com.br"
echo ""

rm -rf "$SITE_DIR" && mkdir -p "$SITE_DIR"

[ -n "$ROOT_PROJECT" ] && deploy_root "$ROOT_PROJECT"

for NAME in "${LPS[@]}"; do
  [[ "$NAME" =~ ^#.* ]] && continue
  build_lp "$NAME"
done

echo ""
echo "✅ Build concluído → site/"
echo ""
