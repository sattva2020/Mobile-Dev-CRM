#!/bin/bash

# 🚀 Скрипт для запуска локальной CRM-системы с Supabase

echo "🚀 Запуск локальной CRM-системы с Supabase..."

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Создание .env.local если не существует
if [ ! -f .env.local ]; then
    echo "📝 Создание файла .env.local..."
    cat > .env.local << EOF
# CRM Development Environment Variables

# GitHub Integration
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_username
GITHUB_REPO=your_repository_name

# AI Integration (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=x-ai/grok-4-fast:free

# Supabase (локальный Docker)
REACT_APP_SUPABASE_URL=http://localhost:3000
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Development Settings
NODE_ENV=development
REACT_APP_ENV=development
EOF
    echo "✅ Файл .env.local создан. Пожалуйста, настройте ваши API ключи."
fi

# Запуск Supabase
echo "🐳 Запуск Supabase..."
docker-compose up -d

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверка статуса сервисов
echo "🔍 Проверка статуса сервисов..."
docker-compose ps

# Установка зависимостей Node.js
echo "📦 Установка зависимостей..."
npm install

# Запуск CRM приложения
echo "🚀 Запуск CRM приложения..."
npm start

echo "✅ Локальная CRM-система запущена!"
echo "📊 Supabase Studio: http://localhost:3001"
echo "🔗 CRM приложение: http://localhost:3000"
echo "📚 API документация: http://localhost:3000/rest/v1/"
