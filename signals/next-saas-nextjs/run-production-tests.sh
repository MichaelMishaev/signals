#!/bin/bash

echo "🧪 Production Test Suite Runner"
echo "================================"
echo ""
echo "This script runs comprehensive Playwright tests on production"
echo "URL: https://www.pipguru.club"
echo ""

# Ask user which test to run
echo "Select test suite to run:"
echo "  1) Quick Tests (6 tests, ~30s)"
echo "  2) Complete Tests (11 tests, ~60s)"
echo "  3) Comprehensive Tests (11 detailed tests, ~5min)"
echo "  4) All Tests"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Running Quick Production Tests..."
    npx playwright test tests/e2e/production-quick-test.spec.ts \
      --config=playwright.config.production.ts \
      --reporter=list \
      --timeout=60000
    ;;
  2)
    echo ""
    echo "🚀 Running Complete Production Tests..."
    npx playwright test tests/e2e/production-complete-test.spec.ts \
      --config=playwright.config.production.ts \
      --reporter=list \
      --timeout=60000
    ;;
  3)
    echo ""
    echo "🚀 Running Comprehensive Signal Tests..."
    npx playwright test tests/e2e/comprehensive-signal-tests.spec.ts \
      --config=playwright.config.production.ts \
      --reporter=list \
      --timeout=120000
    ;;
  4)
    echo ""
    echo "🚀 Running ALL Production Tests..."
    npx playwright test tests/e2e/production-*.spec.ts \
      --config=playwright.config.production.ts \
      --reporter=list \
      --timeout=60000
    ;;
  *)
    echo ""
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "✅ Tests complete!"
echo ""
echo "📸 Screenshots saved to: tests/screenshots/"
echo "📄 Test report: TEST-REPORT.md"
echo ""
