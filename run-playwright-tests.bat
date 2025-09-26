@echo off
REM 🎭 Playwright CRM Tests Runner (Windows)
REM Скрипт для запуска тестов Playwright для CRM системы

echo 🎭 Starting Playwright CRM Tests
echo =================================

REM Проверка установки Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js and npm.
    exit /b 1
)

REM Проверка установки Playwright
npx playwright --version >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Playwright...
    npm install -D @playwright/test
    npx playwright install
)

REM Создание директорий для отчетов
if not exist "playwright-report" mkdir playwright-report
if not exist "test-results" mkdir test-results

echo 🔧 Configuration:
echo    - Test Directory: ./tests
echo    - Config File: playwright-crm.config.ts
echo    - Base URL: http://localhost:3000
echo.

REM Функция для запуска тестов
:run_tests
set test_type=%1
if "%test_type%"=="" set test_type=all

echo 🚀 Running %test_type% tests...
echo ----------------------------------------

if "%test_type%"=="all" (
    npx playwright test --config=playwright-crm.config.ts
) else if "%test_type%"=="ui" (
    npx playwright test --config=playwright-crm.config.ts --ui
) else if "%test_type%"=="headed" (
    npx playwright test --config=playwright-crm.config.ts --headed
) else if "%test_type%"=="debug" (
    npx playwright test --config=playwright-crm.config.ts --debug
) else if "%test_type%"=="chrome" (
    npx playwright test --config=playwright-crm.config.ts --project=chromium
) else if "%test_type%"=="firefox" (
    npx playwright test --config=playwright-crm.config.ts --project=firefox
) else if "%test_type%"=="safari" (
    npx playwright test --config=playwright-crm.config.ts --project=webkit
) else if "%test_type%"=="mobile" (
    npx playwright test --config=playwright-crm.config.ts --project="Mobile Chrome"
) else if "%test_type%"=="crm" (
    npx playwright test --config=playwright-crm.config.ts tests/playwright-crm-examples.spec.ts
) else if "%test_type%"=="api" (
    npx playwright test --config=playwright-crm.config.ts tests/api-only.spec.ts
) else if "%test_type%"=="help" (
    goto :show_help
) else (
    echo ❌ Unknown test type: %test_type%
    goto :show_help
)

if %errorlevel% equ 0 (
    echo ✅ Tests completed successfully
) else (
    echo ❌ Tests failed with exit code %errorlevel%
)

goto :generate_report

:show_help
echo Usage: %0 [OPTIONS]
echo.
echo Options:
echo   all       Run all tests (default)
echo   ui        Run tests in UI mode
echo   headed    Run tests in headed mode
echo   debug     Run tests in debug mode
echo   chrome    Run tests only in Chrome
echo   firefox   Run tests only in Firefox
echo   safari    Run tests only in Safari
echo   mobile    Run tests on mobile devices
echo   crm       Run CRM-specific tests
echo   api       Run API-only tests
echo   help      Show this help message
echo.
echo Examples:
echo   %0                # Run all tests
echo   %0 ui            # Run tests in UI mode
echo   %0 crm           # Run CRM tests only
echo   %0 mobile        # Run mobile tests
exit /b 0

:generate_report
echo.
echo 📊 Generating test report...

if exist "test-results.json" (
    echo    - JSON report: test-results.json
)

if exist "test-results.xml" (
    echo    - JUnit report: test-results.xml
)

if exist "playwright-report" (
    echo    - HTML report: playwright-report/index.html
    echo    - Open report: npx playwright show-report
)

echo.
echo 🧹 Cleaning up...
REM Очистка временных файлов
if exist "test-results\temp-*" del /q "test-results\temp-*"
echo ✅ Cleanup completed

echo.
if %errorlevel% equ 0 (
    echo 🎉 All tests completed successfully!
    echo 📊 Check the reports above for detailed results.
) else (
    echo 💥 Some tests failed. Check the output above for details.
)

exit /b %errorlevel%
