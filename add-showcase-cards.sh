#!/bin/bash

# Script to add ShowcaseCard import to all showcase files
# This adds the import statement if it doesn't exist

SHOWCASE_DIR="src/components/showcases"

for file in "$SHOWCASE_DIR"/*Showcase.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")

    # Check if ShowcaseCard is already imported
    if ! grep -q "import { ShowcaseCard }" "$file"; then
      echo "Adding ShowcaseCard import to $filename"

      # Find the last import line and add after it
      # This uses sed to insert after the last import
      sed -i '' '/^import /a\
import { ShowcaseCard } from "../ShowcaseCard";
' "$file"

    else
      echo "ShowcaseCard already imported in $filename"
    fi
  fi
done

echo "Done! ShowcaseCard imports added to all showcase files."
echo ""
echo "NOTE: You still need to manually wrap components in <ShowcaseCard> tags."
echo "Use this pattern:"
echo ""
echo "<ShowcaseCard"
echo "  defaultName=\"Component Name\""
echo "  category=\"button\" // or card, form, hero, etc."
echo "  designIntent={designIntent}"
echo "  description=\"Description here\""
echo ">"
echo "  <YourComponent />"
echo "</ShowcaseCard>"
