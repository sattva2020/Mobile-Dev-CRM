@echo off
echo 🔍 Checking CRM application status...
echo.

REM Check if the app is running
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > status.txt

REM Read the status
set /p STATUS=<status.txt

if "%STATUS%"=="200" (
    echo ✅ Application is running
    echo 📊 Status: %STATUS%
    echo 🌐 URL: http://localhost:3000
    echo.
    echo 🧪 Ready for testing!
) else (
    echo ❌ Application is not running
    echo 📊 Status: %STATUS%
    echo.
    echo 💡 To start the application, run: start-app-background.bat
)

echo.
echo 📝 Recent logs:
type app.log | tail -10
