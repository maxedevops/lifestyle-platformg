#!/bin/bash
echo "🔍 Starting Security Audit for lifestyle-platform..."

# 1. Check for exposed secrets in codebase
npx gitleaks detect --source . -v

# 2. Verify D1 Database Integrity
npx wrangler d1 execute DB --remote --command="SELECT COUNT(*) FROM profiles;"

# 3. Test E2EE Crypto primitives
npm test apps/web/src/crypto/crypto.test.ts

echo "✅ Audit Complete."