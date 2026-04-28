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
DASHBOARD_BASE="/move-website/project/phd-dashboard/out"

echo "==> Checking source directory..."
if [ ! -d "$SRC" ]; then
  echo "ERROR: Could not find PhD dashboard at:"
  echo "  $SRC"
  echo "Please check the path and try again."
  exit 1
fi

echo "==> Copying dashboard (excluding node_modules and git metadata)..."
mkdir -p "$DEST"
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='out' "$SRC/" "$DEST/"

echo "==> Patching next.config.ts for static export..."
CFG="$DEST/next.config.ts"
if ! grep -q "output.*export" "$CFG" 2>/dev/null; then
  # Insert output: 'export' into the nextConfig object
  sed -i.bak "s/const nextConfig: NextConfig = {/const nextConfig: NextConfig = {\n  output: 'export',\n  trailingSlash: true,\n  images: { unoptimized: true },\n  assetPrefix: '$DASHBOARD_BASE',/" "$CFG"
  echo "    -> Added output: 'export' to next.config.ts"
else
  echo "    -> output: 'export' already present"
fi

if ! grep -q "assetPrefix.*$DASHBOARD_BASE" "$CFG" 2>/dev/null; then
  if grep -q "assetPrefix:" "$CFG" 2>/dev/null; then
    sed -i.bak "s#assetPrefix: .*#assetPrefix: '$DASHBOARD_BASE',#" "$CFG"
  else
    sed -i.bak "s/images: { unoptimized: true },/images: { unoptimized: true },\n  assetPrefix: '$DASHBOARD_BASE',/" "$CFG"
  fi
  echo "    -> Added nested asset prefix"
fi
rm -f "$CFG.bak"

echo "==> Patching copied dashboard for iframe/static export..."
LAYOUT="$DEST/app/layout.tsx"
SIDEBAR="$DEST/components/sidebar.tsx"
OVERVIEW="$DEST/app/page.tsx"
QUIZ="$DEST/app/quiz/page.tsx"

perl -0pi -e "s/import \\{ Geist, Geist_Mono \\} from 'next\\/font\\/google'\\n//; s/\\nconst geist = Geist\\(\\{ subsets: \\['latin'\\], variable: '--font-geist' \\}\\)\\nconst geistMono = Geist_Mono\\(\\{ subsets: \\['latin'\\], variable: '--font-mono' \\}\\)\\n//; s/<html lang=\"en\" className=\\{`\\$\\{geist\\.variable\\} \\$\\{geistMono\\.variable\\}`\\}>/<html lang=\"en\">/" "$LAYOUT"

perl -0pi -e "s/import Link from 'next\\/link'\\n//; s/const NAV = \\[/const DASHBOARD_BASE = '$DASHBOARD_BASE'\\n\\nconst NAV = [/; s/\\{ href: '\\/',\\s+icon:/\\{ href: '\\/',            exportHref: `\\$\\{DASHBOARD_BASE\\}\\/`,             icon:/; s/\\{ href: '\\/map',\\s+icon:/\\{ href: '\\/map',         exportHref: `\\$\\{DASHBOARD_BASE\\}\\/map\\/`,         icon:/; s/\\{ href: '\\/analytics',\\s+icon:/\\{ href: '\\/analytics',   exportHref: `\\$\\{DASHBOARD_BASE\\}\\/analytics\\/`,   icon:/; s/\\{ href: '\\/review',\\s+icon:/\\{ href: '\\/review',      exportHref: `\\$\\{DASHBOARD_BASE\\}\\/review\\/`,      icon:/; s/\\{ href: '\\/schools',\\s+icon:/\\{ href: '\\/schools',     exportHref: `\\$\\{DASHBOARD_BASE\\}\\/schools\\/`,     icon:/; s/\\{ href: '\\/leaderboard',\\s+icon:/\\{ href: '\\/leaderboard', exportHref: `\\$\\{DASHBOARD_BASE\\}\\/leaderboard\\/`, icon:/; s/\\{ href: '\\/quiz',\\s+icon:/\\{ href: '\\/quiz',        exportHref: `\\$\\{DASHBOARD_BASE\\}\\/quiz\\/`,        icon:/; s/\\{ href: '\\/users',\\s+icon:/\\{ href: '\\/users',       exportHref: `\\$\\{DASHBOARD_BASE\\}\\/users\\/`,       icon:/; s/NAV\\.map\\(\\(\\{ href, icon: Icon, label \\}\\)/NAV.map(({ href, exportHref, icon: Icon, label })/; s/<Link key=\\{href\\} href=\\{href\\}/<a key={href} href={exportHref}/; s/<Link key=\\{href\\} href=\\{exportHref\\}/<a key={href} href={exportHref}/; s#</Link>#</a>#g" "$SIDEBAR"

perl -0pi -e "s#href=\"\\/review\"#href=\"$DASHBOARD_BASE/review/\"#g; s#href=\"\\.\\/review\\/\"#href=\"$DASHBOARD_BASE/review/\"#g" "$OVERVIEW"

if ! grep -q "DIFFICULTY_COLORS" "$QUIZ" 2>/dev/null; then
  perl -0pi -e "s/import \\{ HelpCircle, Plus, Play, Eye, EyeOff, BookOpen \\} from 'lucide-react'\\n/import { HelpCircle, Plus, Play, Eye, EyeOff, BookOpen } from 'lucide-react'\\n\\nconst DIFFICULTY_COLORS: Record<string, string> = {\\n  EASY: '#22c55e',\\n  MEDIUM: '#f59e0b',\\n  HARD: '#ef4444',\\n}\\n/" "$QUIZ"
  perl -0pi -e "s/\\n\\s+const colors = \\{ EASY: '#22c55e', MEDIUM: '#f59e0b', HARD: '#ef4444' \\}//; s/colors\\[diff\\]/DIFFICULTY_COLORS[diff]/g; s/const diffColors = \\{ EASY: '#22c55e', MEDIUM: '#f59e0b', HARD: '#ef4444' \\}/const diffColor = DIFFICULTY_COLORS[q.difficulty] || '#64748b'/; s/diffColors\\[q\\.difficulty\\]/diffColor/g" "$QUIZ"
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
