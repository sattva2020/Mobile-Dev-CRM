@echo off
echo 🚀 Starting CRM application and checking modern UI...
echo =================================================

echo.
echo ⚙️ Starting application on port 3001...
start /B npm start > app.log 2>&1

echo.
echo ⏳ Waiting for application to start...
timeout /t 20 > nul

echo.
echo 🔍 Checking application status...
set "APP_STATUS_CODE="
for /f "tokens=*" %%a in ('curl -s -o NUL -w "%%{http_code}" http://localhost:3001') do (
    set "APP_STATUS_CODE=%%a"
)

if "%APP_STATUS_CODE%"=="200" (
    echo ✅ Application is running successfully!
    echo Status: %APP_STATUS_CODE%
    echo.
    echo 🎨 Modern UI Features:
    echo - Beautiful gradient backgrounds
    echo - Glass morphism effects (backdrop-blur)
    echo - Animated buttons with hover effects
    echo - Modern navigation with search
    echo - Status indicators for integrations
    echo - Dark/light theme toggle
    echo.
    echo 🌐 Open in browser: http://localhost:3001
    echo.
    echo 💡 If you don't see the new design, try:
    echo 1. Hard refresh (Ctrl+F5)
    echo 2. Clear browser cache
    echo 3. Open in incognito/private mode
) else (
    echo ❌ Application is not running or returned an error
    echo Status: %APP_STATUS_CODE%
    echo.
    echo 📄 Checking logs...
    if exist app.log (
        echo Recent logs:
        type app.log
    ) else (
        echo No log file found
    )
)

echo.
echo 💡 To stop the application, run: taskkill /f /im node.exe
echo 💡 To check status, run: curl -s -o nul -w "%%{http_code}" http://localhost:3001

pause
