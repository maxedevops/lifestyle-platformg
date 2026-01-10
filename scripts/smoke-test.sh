#!/bin/bash
set -e

echo "📡 Starting Production Smoke Test..."

# 1. Test API Reachability
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.lifestyle-platform.com/health)
if [ $STATUS -eq 200 ]; then
    echo "✅ API is online."
else
    echo "❌ API Unreachable (Status: $STATUS)"
    exit 1
fi

# 2. Test Frontend Asset Loading
FRONTEND=$(curl -s -I https://lifestyle-platform.com | grep "content-type: text/html")
if [ -z "$FRONTEND" ]; then
    echo "❌ Frontend failed to serve HTML."
    exit 1
fi

echo "🎉 All systems green. Platform is LIVE."