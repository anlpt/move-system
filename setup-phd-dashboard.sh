#!/usr/bin/env bash
# ============================================================
# setup-phd-dashboard.sh
# Copies and builds the PhD LELP Platform dashboard so it runs
# as a static site embedded inside the MOVE website.
# Run once from the move-website directory:
#   bash setup-phd-dashboard.sh
# ============================================================

set -e

SRC="/Users/lptan/Documents/ISCM/An_Career/PhD/LELP Platform - PhD/dashboard"
DEST="$(dirname "$0")/project/phd-dashboard"
OUT="$DEST/out"
EMBED="$(dirname "$0")/project/labs/see.html"

echo "==> Checking source directory..."
if [ ! -d "$SRC" ]; then
  echo "ERROR: Could not find PhD dashboard at:"
  echo "  $SRC"
  echo "Please check the path and try again."
  exit 1
fi

echo "==> Copying dashboard (excluding node_modules)..."
mkdir -p "$DEST"
rsync -av --exclude='node_modules' --exclude='.next' --exclude='out' "$SRC/" "$DEST/"

echo "==> Patching next.config.ts for static export..."
CFG="$DEST/next.config.ts"
if ! grep -q "output.*export" "$CFG" 2>/dev/null; then
  # Insert output: 'export' into the nextConfig object
  sed -i.bak "s/const nextConfig: NextConfig = {/const nextConfig: NextConfig = {\n  output: 'export',\n  trailingSlash: true,\n  images: { unoptimized: true },/" "$CFG"
  echo "    -> Added output: 'export' to next.config.ts"
else
  echo "    -> output: 'export' already present"
fi

echo "==> Installing dependencies..."
cd "$DEST"
npm install --legacy-peer-deps

echo "==> Building static export..."
npm run build

echo "==> Done! Static files are in:"
echo "  $OUT"
echo ""
echo "==> The see.html iframe will now load from:"
echo "  project/phd-dashboard/out/index.html"
echo ""
echo "All done! Refresh the MOVE website to see the embedded dashboard."
