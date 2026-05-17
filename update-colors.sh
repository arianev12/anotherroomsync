#!/bin/bash

# Script to replace all sage green colors with teal colors in TypeScript files

# Color mappings (sage -> teal)
declare -A colors
colors["87af87"]="14b8a6"  # teal-500
colors["6b9b6b"]="0d9488"  # teal-600
colors["567d56"]="0f766e"  # teal-700
colors["415e41"]="115e59"  # teal-800
colors["2c3f2c"]="134e4a"  # teal-900
colors["e1ebe1"]="ccfbf1"  # teal-100
colors["c3d7c3"]="99f6e4"  # teal-200
colors["a5c3a5"]="5eead4"  # teal-300
colors["f0f4f0"]="f0fdfa"  # teal-50

# Find all TypeScript files and replace colors
find /src/app -name "*.tsx" -type f | while read -r file; do
  for sage in "${!colors[@]}"; do
    teal="${colors[$sage]}"
    # Replace with case-insensitive pattern
    sed -i "s/#${sage}/#${teal}/gI" "$file"
    sed -i "s/#${sage^^}/#${teal}/gI" "$file"
  done
  echo "Updated: $file"
done

echo "Color replacement complete!"
