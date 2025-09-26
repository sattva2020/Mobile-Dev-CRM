@echo off
echo 🎭 Running Playwright Tests Safely
echo ===================================
echo.

REM Check if application is running
echo 🔍 Checking application status...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > status.txt
set /p STATUS=<status.txt

if "%STATUS%"=="200" (
    echo ✅ Application is running (Status: %STATUS%)
    echo.
    echo 🧪 Starting Playwright tests...
    echo.
    
    REM Run the tests
    npx playwright test tests/playwright-rules-demo.spec.ts --config=playwright.config.ts
    
    echo.
    echo ✅ Tests completed!
    echo 📊 Check the HTML report at: http://localhost:9323
) else (
    echo ❌ Application is not running (Status: %STATUS%)
    echo.
    echo 💡 Starting application first...
    call start-app-background.bat
    
    echo.
    echo ⏳ Waiting for application to start...
    timeout /t 10 /nobreak > nul
    
    REM Check again
    curl -s -o nul -w "%%{http_code}" http://localhost:3000 > status.txt
    set /p STATUS=<status.txt
    
    if "%STATUS%"=="200" (
        echo ✅ Application started successfully!
        echo.
        echo 🧪 Starting Playwright tests...
        echo.
        
        REM Run the tests
        npx playwright test tests/playwright-rules-demo.spec.ts --config=playwright.config.ts
        
        echo.
        echo ✅ Tests completed!
        echo 📊 Check the HTML report at: http://localhost:9323
    ) else (
        echo ❌ Failed to start application
        echo 📊 Status: %STATUS%
        echo 📝 Check logs: app.log
        echo.
        echo 💡 Try running: start-app-background.bat manually
    )
)

echo.
echo 🎯 Test Summary:
echo - Application Status: %STATUS%
echo - Tests: Playwright Rules Demo
echo - Report: http://localhost:9323
echo.
echo 💡 To stop the application: stop-app.bat
echo 💡 To check status: check-app.bat
echo 💡 To view logs: view-logs.bat
