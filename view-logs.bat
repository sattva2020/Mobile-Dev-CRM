@echo off
echo 📝 CRM Application Logs
echo ======================
echo.

if exist app.log (
    echo 📄 Showing last 20 lines of logs:
    echo.
    type app.log | tail -20
) else (
    echo ❌ No log file found
    echo 💡 Start the application first: start-app-background.bat
)

echo.
echo 💡 To see all logs, run: type app.log
echo 💡 To clear logs, run: del app.log
