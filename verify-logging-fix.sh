#!/bin/bash

# Console Error Logging Fix - Verification Script
# This script helps verify that the logging fix is working correctly

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Console Error Logging Fix - Verification Script       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Checking file modifications..."
echo ""

# Check if logControl.js exists
if [ -f "/Users/evgenya/freelancer-task/frontend/src/utils/logControl.js" ]; then
    echo "✅ logControl.js created successfully"
    LOGCONTROL_LINES=$(wc -l < /Users/evgenya/freelancer-task/frontend/src/utils/logControl.js)
    echo "   └─ Size: $LOGCONTROL_LINES lines"
else
    echo "❌ logControl.js NOT FOUND"
fi

echo ""

# Check TaxSection.vue for logControl import
if grep -q "import.*logControl" /Users/evgenya/freelancer-task/frontend/src/dashboard/TaxSection.vue 2>/dev/null; then
    echo "✅ TaxSection.vue imports logControl"
else
    echo "❌ TaxSection.vue does NOT import logControl"
fi

# Check TaxSection.vue uses logControl
if grep -q "logControl.log" /Users/evgenya/freelancer-task/frontend/src/dashboard/TaxSection.vue 2>/dev/null; then
    echo "✅ TaxSection.vue uses logControl for logging"
    USAGE_COUNT=$(grep -c "logControl.log" /Users/evgenya/freelancer-task/frontend/src/dashboard/TaxSection.vue)
    echo "   └─ Uses logControl $USAGE_COUNT times"
else
    echo "❌ TaxSection.vue does NOT use logControl"
fi

echo ""

# Check financialService.js has no console.error
if grep -q "console\\.error" /Users/evgenya/freelancer-task/frontend/src/services/financialService.js 2>/dev/null; then
    echo "❌ financialService.js still has console.error calls"
    grep -n "console.error" /Users/evgenya/freelancer-task/frontend/src/services/financialService.js
else
    echo "✅ financialService.js has NO console.error calls (removed)"
fi

echo ""

# Check if frontend builds successfully
echo "🔨 Testing frontend build..."
cd /Users/evgenya/freelancer-task/frontend

if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Frontend builds successfully"
    # Check for any errors in the build output
    if grep -q "error" /tmp/build.log -i; then
        echo "⚠️  Build completed but with warnings"
    fi
else
    echo "❌ Frontend build FAILED"
    cat /tmp/build.log | head -20
fi

echo ""

# Check backend status
echo "🔗 Checking backend status..."
if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is running and responding"
    HEALTH=$(curl -s http://localhost:3002/api/health)
    echo "   └─ Response: $HEALTH"
else
    echo "⚠️  Backend API is not responding (app will use mock data)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  Verification Complete                                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3030 in your browser"
echo "2. Navigate to the Finance/Tax section"
echo "3. Open DevTools Console (F12)"
echo "4. Refresh the page and watch console output"
echo ""
echo "Expected result:"
echo "✅ Exactly ONE warning: 'Backend API unavailable, using mock data'"
echo "✅ No duplicate error logs"
echo "✅ Financial data displays correctly"
echo ""
