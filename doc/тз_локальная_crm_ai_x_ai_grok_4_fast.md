# Техническое задание (ТЗ)

**Проект:** Локальная CRM для solo‑разработки мобильного приложения «AI‑Fitness Coach 360»\
**AI‑провайдер:** только xAI `grok-4-fast-reasoning` (через API)\
**Бэкенд:** локальный Supabase (Postgres + pgvector + Realtime + Storage)\
**Фронтенд:** React + Vite + Zustand + TanStack Query + React Flow + dnd-kit\
**Обёртка:** Tauri (опц.) для desktop‑first

---

## 1. Цели

- Создать изолированную CRM для управления разработкой.
- Поддержка полной цепочки: Idea → Scope → Features → Capabilities → Tasks.
- AI‑помощник (на базе xAI Grok‑4 Fast) для генерации Scope, декомпозиции на задачи, Issue‑текстов, саммари прогресса.
- Визуализация: mind‑map архитектуры и «мини‑Фигма» дерева экранов.
- Канбан‑доска как в Trello, синхронизированная с GitHub Issues.

---

## 2. Основные модули

1. **Idea/Scope Manager**

   - Поле ввода идеи (rich‑text).
   - Кнопка «Сгенерировать Scope» (через xAI).
   - Просмотр vision/goals/NFR/верхнеуровневых features.

2. **Mind‑map Архитектуры**

   - React Flow + Dagre auto‑layout.
   - Узлы: Features, Capabilities, Components.
   - Синхронизация при изменениях модели.

3. **Экранная карта (мини‑Фигма)**

   - Узлы: Screens (миниатюры), рёбра: переходы (Flows).
   - Импорт превью (PNG/iframe прототип).
   - Автогенерация из Capabilities.

4. **Канбан‑доска**

   - Колонки: Backlog / Ready / In Progress / In Review / Done + настраиваемые.
   - Карточки = Tasks, Subtasks (чек‑листы).
   - Drag‑and‑drop (dnd-kit), WIP‑лимиты, swimlanes, фильтры.
   - GitHub sync: изменение статуса карточки → обновление Issue.

5. **Task Manager**

   - CRUD эпиков/тасков/подтасков.
   - Массовые операции.
   - Кнопка «Опубликовать в GitHub».

6. **AI‑лаборатория**

   - Панель чата с xAI.
   - Кнопки: Idea→Scope, Scope→Tasks, Task→Issue, Daily Brief.
   - Structured Outputs (JSON‑ответы).

7. **Синхронизация GitHub**

   - Push: создание/обновление Issues.
   - Pull: обновление локальных Tasks из изменений в Issues/PR.
   - Скрытый блок метаданных в Issue body.

8. **Метрики и отчёты**

   - Burndown, CFD, Velocity.
   - Автоматический Daily/Weekly Brief.
   - Экспорт PDF/Markdown.

---

## 3. Архитектура

- **Supabase (локально):**
  - Таблицы: node/edge, task, group, board/column/card, diagram, changelog, embedding.
  - pgvector для семантического поиска.
  - Realtime подписки для канбана/диаграмм.
- **Фронтенд:**
  - React Flow для mind‑map/экранов.
  - dnd-kit для канбана.
  - Zustand для стейта, TanStack Query для данных.
- **AI‑адаптер:**
  - Вызовы к `https://api.x.ai/v1/chat/completions`.
  - Модель: `grok-4-fast-reasoning`.
  - Structured Outputs (function calling).

---

## 4. API (контракты tRPC)

```ts
idea.create({title, description}) -> Idea
scope.generateFromIdea({ideaId}) -> ProductScope
arch.generateFromScope({scopeId}) -> {features[], capabilities[], components[]}
screen.generateFromCapabilities({scopeId}) -> {screens[], flows[]}

task.create(dto) -> Task
task.group.create(dto) -> TaskGroup
kanban.card.move({cardId, toColumnId, position}) -> {ok:true}

sync.github.push({entityIds: string[]}) -> {created:[], updated:[]}
sync.github.pull({since}) -> {issues:[]}

ai.scope.fromIdea({ideaId}) -> ProductScope
ai.tasks.fromScope({scopeId}) -> Task[]
ai.issue.body({taskId}) -> {title, body, labels[]}
ai.summary.daily() -> string
```

---

## 5. Интеграция xAI (Grok‑4 Fast)

- Модель: `grok-4-fast-reasoning`.
- Убираем несовместимые параметры (`presencePenalty`, `frequencyPenalty`, `stop`).
- Используем Function Calling для JSON.
- Сценарии:
  - Idea → Scope.
  - Scope → Capabilities → Tasks.
  - Task → Issue body.
  - Daily Brief.

---

## 6. UI/UX требования

- Минималистичный интерфейс, тёмная тема.
- Реактивные доски (mind‑map, канбан).
- Превью экранов (мини‑Фигма) с drag‑and‑drop связями.
- Клавиатурные хоткеи (N/E/M/L/D).

---

## 7. Безопасность

- Хранение ключей xAI в системном хранилище (Keychain/Keyring).
- Данные — только локально в Supabase (docker‑инстанс).
- Опциональное шифрование бэкапов.

---

## 8. План работ

**Спринт 0:** Настройка Supabase локально, базовые таблицы, CRUD Idea/Task.\
**Спринт 1:** AI‑адаптер xAI (Idea→Scope), Mind‑map (React Flow).\
**Спринт 2:** Канбан (drag‑n‑drop, realtime, WIP‑лимиты).\
**Спринт 3:** Экранная карта (мини‑Фигма).\
**Спринт 4:** GitHub sync (push/pull, маппинг labels).\
**Спринт 5:** AI‑лаборатория (Scope→Tasks, Task→Issue, Brief).\
**Спринт 6:** Метрики, отчёты, экспорт.

---

## 9. Критерии приёмки

- Полный цикл Idea→Scope→Tasks→GitHub Issue работает.
- Mind‑map и экранная карта синхронизируются с моделью.
- Канбан drag‑and‑drop с WIP‑лимитами и realtime.
- AI отвечает структурированным JSON (Scope, Tasks, Issue body).
- Отчёты генерируются автоматически.

