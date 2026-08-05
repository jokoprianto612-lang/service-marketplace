#!/bin/sh
# ─────────────────────────────────────────────
# Catalog Sync Script
# ─────────────────────────────────────────────
set -e

CATALOG_DIR="/app/catalog"
REPO_URL="${CATALOG_GIT_REPO}"
BRANCH="${CATALOG_GIT_BRANCH:-main}"
TOKEN="${CATALOG_GIT_TOKEN}"

echo "📥 Syncing catalog from ${REPO_URL} (branch: ${BRANCH})..."

# Configure git
git config --global user.email "svcmarket@bot"
git config --global user.name "Service Marketplace Bot"

# If token provided, use it for authentication
if [ -n "${TOKEN}" ]; then
    REPO_URL=$(echo "${REPO_URL}" | sed "s|https://|https://${TOKEN}@|")
fi

# Clone or pull
if [ -d "${CATALOG_DIR}/.git" ]; then
    cd "${CATALOG_DIR}"
    git fetch origin "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
else
    git clone --branch "${BRANCH}" --depth 1 "${REPO_URL}" "${CATALOG_DIR}"
fi

# Validate catalog structure
if [ -f "${CATALOG_DIR}/catalog.json" ]; then
    echo "✅ Catalog synced successfully"
    echo "📋 Services found: $(jq '.services | length' "${CATALOG_DIR}/catalog.json")"
else
    echo "⚠️  Warning: catalog.json not found in repository root"
    echo "   Expected structure: catalog.json with { services: [...] }"
fi