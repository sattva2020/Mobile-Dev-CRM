# 🐳 Локальная настройка Supabase с Docker

## 📋 Обзор

Для локальной разработки мы используем Docker Compose для запуска полного стека Supabase локально.

## 🚀 Быстрый старт

### 1. Запуск Supabase

```bash
# Запуск всех сервисов Supabase
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 2. Проверка сервисов

После запуска будут доступны следующие сервисы:

- **Supabase Studio**: http://localhost:3001 (веб-интерфейс)
- **REST API**: http://localhost:3000
- **Realtime**: http://localhost:4000
- **Storage**: http://localhost:5000
- **Auth**: http://localhost:9999
- **Database**: localhost:54322

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# CRM Development Environment Variables

# GitHub Integration
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_username
GITHUB_REPO=your_repository_name

# AI Integration (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=x-ai/grok-4-fast:free

# Supabase (локальный Docker)
SUPABASE_URL=http://localhost:3000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Development Settings
NODE_ENV=development
REACT_APP_ENV=development

# Database (локальный PostgreSQL)
DATABASE_URL=postgres://postgres:your-super-secret-and-long-postgres-password@localhost:54322/postgres
```

## 🗄️ Настройка базы данных

### 1. Подключение к базе данных

```bash
# Подключение через psql
psql -h localhost -p 54322 -U postgres -d postgres

# Или через Docker
docker exec -it supabase-db psql -U postgres
```

### 2. Создание таблиц для CRM

```sql
-- Таблица задач
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  assignee TEXT,
  labels TEXT[],
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  github_issue_id INTEGER,
  github_url TEXT,
  project_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица уведомлений
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'error', 'info')),
  read BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'system' CHECK (source IN ('github', 'ai', 'system')),
  project_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица проектов
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица требований
CREATE TABLE requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'in-progress', 'completed', 'rejected')),
  version INTEGER DEFAULT 1,
  project_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assignee ON tasks(assignee);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_source ON notifications(source);
```

### 3. Настройка RLS (Row Level Security)

```sql
-- Включение RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;

-- Политики для анонимного доступа (для разработки)
CREATE POLICY "Allow all operations for tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations for projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for requirements" ON requirements FOR ALL USING (true);
```

## 🔧 Управление сервисами

### Остановка сервисов

```bash
# Остановка всех сервисов
docker-compose down

# Остановка с удалением данных
docker-compose down -v
```

### Перезапуск сервисов

```bash
# Перезапуск конкретного сервиса
docker-compose restart supabase-db

# Перезапуск всех сервисов
docker-compose restart
```

### Просмотр логов

```bash
# Логи всех сервисов
docker-compose logs

# Логи конкретного сервиса
docker-compose logs supabase-db
```

## 🛠️ Разработка

### 1. Запуск CRM приложения

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start
```

### 2. Тестирование API

```bash
# Тест подключения к Supabase
curl http://localhost:3000/rest/v1/tasks

# Тест аутентификации
curl -X POST http://localhost:3000/auth/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 📊 Мониторинг

### Supabase Studio

Откройте http://localhost:3001 для доступа к веб-интерфейсу Supabase Studio, где вы можете:

- Просматривать и редактировать данные
- Выполнять SQL запросы
- Настраивать аутентификацию
- Управлять хранилищем файлов

### Проверка здоровья сервисов

```bash
# Проверка статуса всех контейнеров
docker-compose ps

# Проверка логов на ошибки
docker-compose logs --tail=50
```

## 🚨 Устранение проблем

### Проблема: Порт уже используется

```bash
# Найти процесс, использующий порт
netstat -ano | findstr :3000

# Остановить процесс
taskkill /PID <PID> /F
```

### Проблема: База данных не запускается

```bash
# Очистить данные и перезапустить
docker-compose down -v
docker-compose up -d
```

### Проблема: Не удается подключиться к API

1. Проверьте, что все сервисы запущены: `docker-compose ps`
2. Проверьте логи: `docker-compose logs supabase-rest`
3. Убедитесь, что порты не заняты другими приложениями

## 📝 Полезные команды

```bash
# Просмотр всех контейнеров
docker ps

# Очистка неиспользуемых ресурсов
docker system prune

# Просмотр использования ресурсов
docker stats

# Бэкап базы данных
docker exec supabase-db pg_dump -U postgres postgres > backup.sql

# Восстановление из бэкапа
docker exec -i supabase-db psql -U postgres postgres < backup.sql
```

## 🎯 Следующие шаги

1. **Настройте переменные окружения** в `.env.local`
2. **Запустите Supabase**: `docker-compose up -d
3. **Создайте таблицы** через Supabase Studio или SQL
4. **Запустите CRM**: `npm start`
5. **Протестируйте интеграцию** с локальным Supabase

---

**Готово!** Теперь у вас есть полнофункциональная локальная среда разработки с Supabase.
