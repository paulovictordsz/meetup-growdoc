#!/bin/bash
# =============================================================
# DEPLOY CENTRAL — meetup.growdoc.com.br
# =============================================================
# Uso:
#   ./deploy.sh              → builda tudo e faz deploy
#   ./deploy.sh growth       → builda só a LP "growth" e faz deploy
#   ./deploy.sh meetup       → builda só o site raiz e faz deploy
# =============================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$ROOT_DIR/site"
LPS_DIR="$ROOT_DIR/lps"
REDIRECTS_FILE="$SITE_DIR/_redirects"
CF_PROJECT="meetup-growdoc"

# =============================================================
# PROJETO RAIZ — vai para meetup.growdoc.com.br/
# Pasta estática (sem build). Deixe vazio ("") para não ter raiz.
# =============================================================
ROOT_PROJECT="meetup"

# =============================================================
# LPs — cada nome = subpath da URL
#   lps/growth/  →  meetup.growdoc.com.br/growth
# =============================================================
LPS=(
  "growth"
  # Adicione novas LPs aqui:
  # "evento"
  # "black-friday"
)

# =============================================================
# FUNÇÕES
# =============================================================

deploy_root() {
  local NAME="$1"
  local SRC="$LPS_DIR/$NAME"

  echo "  🏠 Raiz (/$NAME → /)"

  if [ ! -d "$SRC" ]; then
    echo "  ❌ Pasta não encontrada: lps/$NAME"
    exit 1
  fi

  rsync -a --exclude '.DS_Store' "$SRC/" "$SITE_DIR/"
  echo "     ✅ Pronto → meetup.growdoc.com.br/"
}

build_lp() {
  local NAME="$1"
  local SRC="$LPS_DIR/$NAME"
  local DEST="$SITE_DIR/$NAME"

  echo "  📦 /$NAME"

  if [ ! -d "$SRC" ]; then
    echo "  ❌ Pasta não encontrada: lps/$NAME"
    exit 1
  fi

  echo "     Buildando..."
  cd "$SRC"
  npm run build --silent

  echo "     Copiando para site/$NAME/..."
  rm -rf "$DEST"
  mkdir -p "$DEST"
  rsync -a --exclude '_redirects' "$SRC/dist/" "$DEST/"

  # Garante a regra _redirects para SPA
  local RULE="/$NAME/*  /$NAME/index.html  200"
  if [ -f "$REDIRECTS_FILE" ]; then
    if ! grep -q "^/$NAME/\*" "$REDIRECTS_FILE"; then
      echo "$RULE" >> "$REDIRECTS_FILE"
    fi
  else
    echo "$RULE" > "$REDIRECTS_FILE"
  fi

  echo "     ✅ Pronto → meetup.growdoc.com.br/$NAME"
}

# =============================================================
# EXECUÇÃO
# =============================================================

FILTER="$1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Deploy — meetup.growdoc.com.br"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Limpa o site/ antes de rebuildar tudo (só se não tiver filtro)
if [ -z "$FILTER" ]; then
  rm -rf "$SITE_DIR"
  mkdir -p "$SITE_DIR"
fi

# Projeto raiz
if [ -n "$ROOT_PROJECT" ]; then
  if [ -z "$FILTER" ] || [ "$FILTER" = "$ROOT_PROJECT" ]; then
    deploy_root "$ROOT_PROJECT"
  fi
fi

# LPs
for NAME in "${LPS[@]}"; do
  [[ "$NAME" =~ ^#.* ]] && continue

  if [ -n "$FILTER" ] && [ "$NAME" != "$FILTER" ]; then
    continue
  fi

  build_lp "$NAME"
done

echo ""
echo "  ☁️  Subindo para o Cloudflare Pages..."
cd "$SITE_DIR"
wrangler pages deploy . --project-name="$CF_PROJECT"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Deploy concluído!"
echo ""
echo "  🌐 meetup.growdoc.com.br"
for NAME in "${LPS[@]}"; do
  [[ "$NAME" =~ ^#.* ]] && continue
  echo "  🌐 meetup.growdoc.com.br/$NAME"
done
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
