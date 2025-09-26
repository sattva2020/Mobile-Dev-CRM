@echo off
echo 🎨 Checking Modern UI Design
echo =============================

echo.
echo 🔍 Checking if React app is running...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:3001
if %errorlevel% neq 0 (
    echo ❌ React app is not running
    echo 💡 Please run: npm start
    exit /b 1
)

echo.
echo ✅ React app is running on http://localhost:3001
echo.
echo 🎨 Modern UI Features:
echo - Beautiful gradient backgrounds
echo - Glass morphism effects
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
echo 3. Check browser console for errors
echo.
pause
