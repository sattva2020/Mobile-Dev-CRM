@echo off
echo 🎭 Running Playwright Offline Tests (Improved)
echo ==============================================
echo.

echo 🧪 These tests don't require a running application
echo 📊 They demonstrate Playwright rules in isolation
echo.

REM Create test-results directory if it doesn't exist
if not exist test-results mkdir test-results

echo 🚀 Starting offline tests...
echo.

REM Run the offline tests with proper error handling
npx playwright test tests/playwright-offline-demo.spec.ts --config=playwright.config.ts --reporter=line

echo.
echo ✅ Offline tests completed!
echo 📊 Check the HTML report at: http://localhost:9323
echo 📸 Screenshots saved in: test-results/
echo.

echo 🎯 Test Summary:
echo - Tests: Playwright Offline Demo
echo - No external dependencies required
echo - Demonstrates all Playwright rules
echo - Report: http://localhost:9323
echo.

echo 💡 To run with application: run-playwright-tests-safe.bat
echo 💡 To check application status: check-app.bat
echo 💡 To stop HTML report server: Press Ctrl+C in the report window
