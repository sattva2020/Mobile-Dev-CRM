# DevOps — инфраструктура локальной CRM (Supabase + xAI)

## 1) Обзор

Цель — воспроизводимая локальная среда для Solo‑разработки: Supabase (Postgres + pgvector + Realtime + Storage + Auth + Studio), фронтенд (React/Vite), desktop‑обёртка (Tauri, опц.), CI/CD (GitHub Actions), миграции и бэкапы.

---

## 2) Структура репозитория

```
repo/
  apps/
    web/                # React + Vite SPA
    desktop/            # Tauri (опц.)
  packages/
    api/                # tRPC/контракты, Octokit sync
    ai/                 # xAI adapter (grok-4-fast-reasoning)
    db/                 # миграции SQL, сиды, функции, триггеры
  infra/
    docker-compose.yml
    .env.example
    supabase/           # Supabase CLI config, seed, init SQL
    backups/
  .github/workflows/
    web-ci.yml
    tauri-ci.yml
    db-migrate.yml
  Makefile
```

---

## 3) Переменные окружения (`infra/.env.example`)

```
# Supabase
SUPABASE_ANON_KEY=dev-anon-key
SUPABASE_SERVICE_KEY=dev-service-key
SUPABASE_URL=http://localhost:54321
SUPABASE_DB_URL=postgres://postgres:postgres@localhost:54322/postgres

# xAI
XAI_API_KEY=your_xai_key
XAI_MODEL=grok-4-fast-reasoning

# GitHub Sync
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO=owner/repo
```

---

## 4) Локальный запуск Supabase (`infra/docker-compose.yml`)

```yaml
version: '3.9'
services:
  supabase:
    image: supabase/supabase-local:latest
    container_name: supabase-local
    environment:
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
    ports: ["54321:54321", "54322:54322"]  # Studio/API, Postgres
    volumes:
      - ./supabase/data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:54321"]
      interval: 10s
      timeout: 5s
      retries: 10
```

> Альтернатива: `supabase start` (CLI) — создаст тот же стек. Конфиги храним в `infra/supabase/`.

---

## 5) Инициализация БД (pgvector, схемы)

`packages/db/sql/000_init.sql`

```sql
create extension if not exists vector;
create extension if not exists pgcrypto;

-- Граф: узлы/рёбра
create table if not exists node(
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  name text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create table if not exists edge(
  src uuid references node(id) on delete cascade,
  dst uuid references node(id) on delete cascade,
  type text not null,
  primary key (src, dst, type)
);
create index if not exists edge_dst on edge(dst);
create index if not exists edge_type on edge(type);

-- Closure для reachability
create table if not exists closure(
  ancestor uuid not null,
  descendant uuid not null,
  depth int not null,
  type text not null,
  primary key (ancestor, descendant, type)
);

-- Канбан
create table if not exists board(
  id uuid primary key default gen_random_uuid(),
  name text not null
);
create table if not exists column(
  id uuid primary key default gen_random_uuid(),
  board_id uuid references board(id) on delete cascade,
  name text not null,
  key text not null,
  wip_limit int,
  position int not null default 0
);
create table if not exists task(
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text,
  priority int,
  estimate int,
  status text,
  assignee text,
  labels text[],
  due_date date
);
create table if not exists card(
  id uuid primary key default gen_random_uuid(),
  task_id uuid references task(id) on delete cascade,
  column_id uuid references column(id) on delete cascade,
  position int not null default 0,
  archived boolean default false
);

-- Embeddings
create table if not exists embedding(
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  v vector(1536),
  meta jsonb
);
create index if not exists embedding_v_idx on embedding using ivfflat (v vector_cosine_ops) with (lists = 100);
```

`packages/db/sql/010_closure_triggers.sql`

```sql
-- Простейшие инкрементальные триггеры для closure
create or replace function edge_after_insert() returns trigger as $$
begin
  insert into closure(ancestor, descendant, depth, type)
  values (new.src, new.dst, 1, new.type)
  on conflict do nothing;
  -- Обновить пути через существующих предков/потомков
  insert into closure(ancestor, descendant, depth, type)
  select c1.ancestor, c2.descendant, c1.depth + c2.depth, new.type
  from closure c1, closure c2
  where c1.descendant = new.src and c2.ancestor = new.dst and c1.type=new.type and c2.type=new.type
  on conflict do nothing;
  return null;
end; $$ language plpgsql;

create or replace function edge_after_delete() returns trigger as $$
begin
  -- Для простоты: помечаем для пересчёта (отдельная job)
  perform pg_notify('closure_rebuild', new.type);
  return null;
end; $$ language plpgsql;

create trigger trg_edge_ins after insert on edge
  for each row execute procedure edge_after_insert();
create trigger trg_edge_del after delete on edge
  for each row execute procedure edge_after_delete();
```

`packages/db/sql/020_views_metrics.sql`

```sql
-- Пример матвью для CFD/бурндауна заполняется в db-migrate job
create materialized view if not exists cfd_daily as
select date_trunc('day', now())::date as d, 'stub' as status, 0 as count;
```

---

## 6) Supabase CLI

```
cd infra
supabase init
supabase start
supabase db push              # применить миграции из packages/db/sql
supabase db dump -f backups/$(date +%F).sql
```

> Миграции оформляем как пронумерованные SQL‑файлы в `packages/db/sql/`. Пайплайн `db-migrate.yml` применяет их автоматически на dev.

---

## 7) Makefile (частые команды)

```
.PHONY: up down logs seed migrate backup restore web dev
up: ; docker compose -f infra/docker-compose.yml up -d
down: ; docker compose -f infra/docker-compose.yml down
logs: ; docker compose -f infra/docker-compose.yml logs -f
migrate: ; supabase db push
backup: ; supabase db dump -f infra/backups/$(shell date +%F).sql
restore: ; psql $$SUPABASE_DB_URL < infra/backups/LAST.sql
web: ; pnpm --filter web dev
```

---

## 8) CI/CD — GitHub Actions

`.github/workflows/web-ci.yml`

```yaml
name: Web CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter web build
      - uses: actions/upload-artifact@v4
        with: { name: web-dist, path: apps/web/dist }
```

`.github/workflows/tauri-ci.yml` (опц.)

```yaml
name: Tauri Build
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: macos-latest  # для подписи .app (можно matrix)
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - uses: tauri-apps/tauri-action@v0
        with:
          tagName: v__VERSION__
          releaseName: "CRM Desktop v__VERSION__"
          releaseBody: "Auto build"
          includeDebug: true
        env:
          TAURI_PRIVATE_KEY: ${{ secrets.TAURI_PRIVATE_KEY }}
          TAURI_KEY_PASSWORD: ${{ secrets.TAURI_KEY_PASSWORD }}
```

`.github/workflows/db-migrate.yml`

```yaml
name: DB Migrate (Dev)
on:
  push:
    paths: ["packages/db/sql/**"]
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db push --db-url ${{ secrets.SUPABASE_DB_URL }}
```

---

## 9) Безопасность и бэкапы

- **Secrets**: `XAI_API_KEY`, `GITHUB_TOKEN`, `SUPABASE_SERVICE_KEY`, ключи подписи Tauri — только в GitHub Secrets.
- **RLS** (на будущее): для таблиц `task`, `card`, `embedding` — политика доступа по проекту/пользователю.
- **Бэкапы**: daily dump в `infra/backups/`; ротация N=7.
- **Шифрование**: при необходимости — GPG шифрование дампов.

---

## 10) Мониторинг/профилирование

- `pg_stat_statements` для тяжелых запросов (включить, если нет).
- Логи Supabase: подписки Realtime, ошибки функций/триггеров.
- Метрики: время цикла задач, CFD/velocity — рефреш матвью по cron (Actions schedule).

---

## 11) Локальная разработка

```
cp infra/.env.example infra/.env
make up
supabase db push
pnpm -C apps/web dev   # http://localhost:5173
```

---

## 12) Сид‑данные (пример)

`infra/supabase/seed.sql`

```sql
insert into board(name) values ('Default');
insert into column(board_id, name, key, position) select id, 'Backlog','backlog',0 from board;
insert into column(board_id, name, key, position) select id, 'Ready','ready',1 from board;
insert into column(board_id, name, key, position) select id, 'In Progress','inprogress',2 from board;
insert into column(board_id, name, key, position) select id, 'In Review','review',3 from board;
insert into column(board_id, name, key, position) select id, 'Done','done',4 from board;
```

---

## 13) Подписки Realtime (web)

Пример подписки на изменения карточек/колонок:

```ts
const channel = supabase.channel('kanban')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'card' }, handleCard)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'column' }, handleColumn)
  .subscribe();
```

---

## 14) Слой синхронизации GitHub

- Воркер (Node/TS) в `packages/api`: Octokit, idempotent‑операции.
- Метаданные в Issue body (скрытый JSON‑блок) ↔ локальные `task/card`.
- Планировщик: pull‑sync по расписанию + Webhook обработчики (если доступно).

---

## 15) Чек‑лист готовности

-

