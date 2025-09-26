@echo off
echo 🚀 Starting CRM application in background...
echo.

REM Start the application in background
start /B npm start > app.log 2>&1

REM Wait a bit for the app to start
timeout /t 5 /nobreak > nul

REM Check if the app is running
echo 🔍 Checking if application is running...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > status.txt

REM Read the status
set /p STATUS=<status.txt

if "%STATUS%"=="200" (
    echo ✅ Application is running successfully!
    echo 📊 Status: %STATUS%
    echo 🌐 URL: http://localhost:3000
    echo 📝 Logs: app.log
) else (
    echo ❌ Application failed to start
    echo 📊 Status: %STATUS%
    echo 📝 Check logs: app.log
)

echo.
echo 💡 To stop the application, run: stop-app.bat
echo 💡 To check status, run: check-app.bat
echo 💡 To view logs, run: view-logs.bat
