@echo off
echo 🛑 Stopping CRM application...
echo.

REM Kill all Node.js processes (be careful with this!)
taskkill /F /IM node.exe > nul 2>&1

REM Also kill any processes using port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo ✅ Application stopped
echo 🧹 Cleaned up processes
echo.
echo 💡 To start again, run: start-app-background.bat
