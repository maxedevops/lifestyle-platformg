#!/bin/bash

echo "🔍 Verifying Monorepo Integrity..."

# 1. Check Root Workspaces
echo "Step 1: Checking root package.json workspaces..."
grep -q "\"workspaces\": \[" package.json && echo "✅ Workspaces defined" || echo "❌ Workspaces MISSING in root package.json"

# 2. Check Package Name
echo "Step 2: Checking shared-types name..."
grep -q "\"name\": \"@lifestyle/shared-types\"" packages/shared-types/package.json && echo "✅ Shared-types named correctly" || echo "❌ Shared-types name mismatch"

# 3. Check App Dependency
echo "Step 3: Checking web app dependency link..."
grep -q "\"@lifestyle/shared-types\": \"workspace:\*\"" apps/web/package.json && echo "✅ Web app linked to workspace" || echo "❌ Web app still looking for public 'packages-shared-types'"

# 4. Check for lockfiles
if [ -f "bun.lockb" ] || [ -f "package-lock.json" ]; then
  echo "⚠️ Lockfile found. If build fails, delete this and try again to clear the cache."
fi

echo "🏁 Verification complete."