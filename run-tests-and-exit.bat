@echo off
echo 🎭 Running Playwright Tests and Auto-Exit
echo ==========================================
echo.

REM Create test-results directory if it doesn't exist
if not exist test-results mkdir test-results

echo 🚀 Starting tests...
echo.

REM Run tests with line reporter (no HTML server)
npx playwright test tests/playwright-offline-demo.spec.ts --config=playwright.config.ts --reporter=line

echo.
echo ✅ Tests completed!
echo 📊 Results shown above
echo 📸 Screenshots saved in: test-results/
echo.

echo 🎯 Test Summary:
echo - Tests: Playwright Offline Demo
echo - No HTML server blocking terminal
echo - All results shown in console
echo.

echo 💡 To run with HTML report: run-offline-tests.bat
echo 💡 To run with application: run-playwright-tests-safe.bat
