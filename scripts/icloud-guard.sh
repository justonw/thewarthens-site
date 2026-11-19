#!/bin/sh
# Run at the start of a work session. If the project sits in an iCloud-synced folder (like the Desktop), macOS can empty
# ("evict") thousands of files after a restart or when space runs low. Emptied files read as blank, which makes the type
# checker hang, the linter crash, and the dev server exit silently. This counts them and downloads them back.
#   sh scripts/icloud-guard.sh
cd "$(dirname "$0")/.." || exit 1
count() { find node_modules src scripts public docs -type f -flags +dataless 2>/dev/null | wc -l | tr -d ' '; }
left=$(count)
echo "Emptied (iCloud) files: $left"
pass=1
while [ "$left" -gt 0 ] && [ "$pass" -le 4 ]; do
  echo "Downloading them back, pass $pass..."
  find node_modules src scripts public docs -type f -flags +dataless -print0 2>/dev/null | xargs -0 -n 1 -P 16 brctl download >/dev/null 2>&1
  left=$(count)
  echo "Left: $left"
  pass=$((pass + 1))
done
if [ "$left" -eq 0 ]; then
  echo "All files are here."
else
  echo "Some files could not be downloaded (they may no longer exist in iCloud). The first few:"
  find node_modules src scripts public docs -type f -flags +dataless 2>/dev/null | head -5
  echo "Check your internet connection and iCloud, then run this again."
  exit 1
fi
