@echo off
REM 🚀 Скрипт для запуска локальной CRM-системы с Supabase (Windows)

echo 🚀 Запуск локальной CRM-системы с Supabase...

REM Проверка наличия Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker не установлен. Пожалуйста, установите Docker Desktop.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose.
    pause
    exit /b 1
)

REM Создание .env.local если не существует
if not exist .env.local (
    echo 📝 Создание файла .env.local...
    (
        echo # CRM Development Environment Variables
        echo.
        echo # GitHub Integration
        echo GITHUB_TOKEN=your_github_token_here
        echo GITHUB_OWNER=your_username
        echo GITHUB_REPO=your_repository_name
        echo.
        echo # AI Integration ^(OpenRouter^)
        echo OPENROUTER_API_KEY=your_openrouter_api_key_here
        echo AI_MODEL=x-ai/grok-4-fast:free
        echo.
        echo # Supabase ^(локальный Docker^)
        echo REACT_APP_SUPABASE_URL=http://localhost:3000
        echo REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
        echo.
        echo # Development Settings
        echo NODE_ENV=development
        echo REACT_APP_ENV=development
    ) > .env.local
    echo ✅ Файл .env.local создан. Пожалуйста, настройте ваши API ключи.
)

REM Запуск Supabase
echo 🐳 Запуск Supabase...
docker-compose up -d

REM Ожидание запуска сервисов
echo ⏳ Ожидание запуска сервисов...
timeout /t 10 /nobreak >nul

REM Проверка статуса сервисов
echo 🔍 Проверка статуса сервисов...
docker-compose ps

REM Установка зависимостей Node.js
echo 📦 Установка зависимостей...
npm install

REM Запуск CRM приложения
echo 🚀 Запуск CRM приложения...
npm start

echo ✅ Локальная CRM-система запущена!
echo 📊 Supabase Studio: http://localhost:3001
echo 🔗 CRM приложение: http://localhost:3000
echo 📚 API документация: http://localhost:3000/rest/v1/

pause
