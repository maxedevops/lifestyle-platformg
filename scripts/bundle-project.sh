#!/bin/bash
# Bundle the project while respecting .gitignore
echo "📦 Packaging lifestyle-platform for hand-off..."

ZIP_NAME="lifestyle-platform-v1-production.zip"

# Clean previous builds
npm run clean

# Archive current directory excluding node_modules and local envs
zip -r $ZIP_NAME . -x "**/node_modules/*" "**/.venv/*" "**/dist/*" "**/.DS_Store" ".env"

echo "✅ Project bundled: $ZIP_NAME"