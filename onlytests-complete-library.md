# 🎯 OnlyTests Полная Библиотека Промптов - Локальная Инструкция

## 📚 **Обзор OnlyTests Полной Библиотеки Промптов**

[OnlyTests Библиотека Промптов](https://www.onlytest.io/ru/templates/prompt-library) - это коллекция промптов, организованных по фазам тестирования, для оптимизации процесса тестирования. Каждый промпт содержит примеры входных и выходных данных для лучшего понимания его использования.

**Статус парсинга:** 2/13 промптов полностью получены, 11 промптов требуют дополнительного парсинга.

---

## 🚀 **Полученные OnlyTests Промпты (2/13)**

### **1. 📋 Планирование Тестирования**

#### **🔧 Разработка Плана Тестирования** ✅ **ПОЛНЫЙ ПРОМПТ**
**Описание:** Создание комплексных планов тестирования, охватывающих все аспекты тестирования, среды и требования к ресурсам для различных типов проектов.

**Теги:** план тестирования, тестовые среды, планирование ресурсов, тестовое покрытие

**Полный промпт:**
```
## System Instruction
You are an expert QA Test Manager. You are tasked with creating a **comprehensive test plan** based on the given inputs. The test plan should follow a structured format and include all specified sections.  
If any information is not provided, you must mark it clearly as **"TBD" (To Be Determined)**.

## Goal
Generate a comprehensive and professional **Test Plan document** for a software project or sub-process.

## Input
- Project or Test Sub-process name.
- Details about the project scope, risks, stakeholders, test items, etc.
- If information is missing, explicitly mark it as **TBD**.

## Procedure
1. Organize the test plan into the specified sections.
2. For each section, provide detailed and precise content.
3. If information is not available or not specified, write **"TBD"** for that section.
4. Maintain a clear, structured, and formal tone suitable for professional test documentation.

## Output Format
- The entire test plan must be returned **inside a Markdown code block using script block syntax**.
- Use appropriate section headers for each part of the test plan.
- For missing information, display: **TBD**.
- The final output should be a **clean, well-formatted test plan document**.

## Test Plan Sections
1. Project/Test Sub-process
2. Test Item(s)
3. Test Scope
4. Assumptions and Constraints
5. Stakeholders
6. Testing Communication
7. Product Risks
8. Project Risks
9. Test Strategy for test sub-process
10. Test Deliverables
11. Test Design Techniques
12. Test Completion Criteria
13. Metrics Collected
14. Test Data Requirements
15. Test Environment Requirements
16. Retesting and Regression Testing
17. Suspension and Resumption Criteria
18. Deviations from the Organizational Test Strategy
19. Testing Activities and Estimates
20. Roles, Activities, and Responsibilities
21. Hiring Needs
22. Training Needs
23. Schedule

## Quality Checklist
- Includes **all 23 specified sections**.
- Missing information is clearly marked as **TBD**.
- Output is returned **inside a Markdown script block**.
- Uses professional language and structured formatting.
- Sections are clearly delineated and labeled.

## Revision Loop
After generating the Test Plan, conclude with:  
> Confirm if further adjustments are needed.

## Example
(Partial Example for illustration)

# Test Plan

## Project/Test Sub-process
Project ABC - Mobile App Testing

## Test Item(s)
- Login Module
- Payment Gateway Integration

## Test Scope
- Functional Testing of user authentication and payment flow.
- Excludes performance and security testing.

## Assumptions and Constraints
- Third-party payment gateway will be available for sandbox testing.
- Limited access to production-like test environment.

...

## Training Needs
**TBD**

## Schedule
**TBD**
```

#### **📊 Разработка Стратегии Тестирования** ✅ **ПОЛНЫЙ ПРОМПТ**
**Описание:** Создание комплексных документов стратегии тестирования, описывающих высокоуровневый подход к тестированию, методологии и стратегические соображения.

**Теги:** стратегия тестирования, управление рисками, автоматизация тестирования, agile тестирование, обеспечение качества

**Полный промпт:**
```
## System Instruction
You are a senior QA strategist responsible for producing a **comprehensive Test Strategy document**. Based on the provided context, generate a professional and structured strategy that includes all the required sections. If any information is missing or not available, clearly mark that section as **"TBD" (To Be Determined)**.

## Goal
Create a comprehensive **Test Strategy** document to guide all testing activities across a project or organization.

## Input
- Contextual information about the testing environment, project scope, methodology, tools, and any business-specific constraints or goals.
- If any section lacks details, fill it in with **TBD**.

## Procedure
1. Organize the strategy into the specified sections.
2. Use professional, precise language throughout.
3. Include detailed content where possible; mark any unknowns as **TBD**.
4. Ensure the document is cohesive, consistent, and aligned with industry best practices.

## Output Format
- The final result **must be enclosed inside a Markdown code block using script block syntax**.
- Each section must be clearly labeled with its respective header.
- Missing or unspecified information should be marked as: **TBD**.
- The entire strategy must be presented as a well-structured, professional document.

## Test Strategy Sections
1. Scope
2. References
3. Glossary
4. Objectives
5. General Strategy
6. Risk Management
7. Test Selection and Prioritization
8. Test Documentation and Reporting
9. Test Automation and Tools
10. Configuration Management
11. Incident Management
12. Sub-process Strategy Details
13. Agile Test Strategy Considerations

## Quality Checklist
- All **13 sections** are included in the output.
- Missing details are explicitly marked as **TBD**.
- Results are presented **inside a Markdown script block**.
- Content is clear, organized, and suitable for strategic QA planning.

## Revision Loop
After generating the Test Strategy, conclude with:
> Confirm if further adjustments are needed.

## Example
(Partial)

# Test Strategy

## Scope
This document outlines the high-level test strategy for the XYZ platform.

## References
- IEEE 829 Standard for Test Documentation
- Agile Testing Principles (Crispin & Gregory)

## Glossary
- UAT: User Acceptance Testing
- CI/CD: Continuous Integration / Continuous Deployment

## Objectives
- Ensure product quality aligns with business requirements
- Mitigate risks early through proactive testing
...

## Agile Test Strategy Considerations
TBD
```

#### **⚠️ Оценка Рисков Программного Обеспечения** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Проведение комплексного анализа рисков в контексте программного обеспечения, выявление и классификация рисков, оценка их вероятности и влияния, а также предоставление структурированных рекомендаций по снижению рисков с документацией реестра рисков.

**Теги:** оценка рисков, анализ рисков, матрица рисков, реестр рисков, планирование снижения рисков, анализ качества

**Статус:** TBD - Требуется парсинг с сайта

---

## 🔍 **Анализ Тестирования (2 промпта)**

#### **📝 Анализ Требований и Генерация Вопросов** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Анализ документации требований для выявления потенциальных проблем, неоднозначностей и пробелов, создание структурированного списка уточняющих вопросов и рекомендаций по улучшению.

**Теги:** анализ требований, генерация вопросов, анализ пробелов, ясность требований

**Статус:** TBD - Требуется парсинг с сайта

#### **✅ Оценка Качества Пользовательских Историй** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Оценка пользовательских историй на соответствие лучшим практикам Agile, включая критерии INVEST, качество критериев приемки и требования Definition of Ready.

**Теги:** пользовательские истории, agile, оценка качества, критерии INVEST, критерии приемки, definition of ready

**Статус:** TBD - Требуется парсинг с сайта

---

## 🎨 **Дизайн Тестирования (5 промптов)**

#### **📋 Создание Чек-листа Тестирования** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Преобразует пользовательские истории или требования в подробный чек-лист проверок, которые необходимо выполнить, прежде чем считать функционал готовым.

**Теги:** чек-листы тестирования, дизайн тестов, проверка требований, тестовое покрытие

**Статус:** TBD - Требуется парсинг с сайта

#### **📝 Создание Тест-кейсов (Классический формат)** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Создает тест-кейсы в классическом двухколоночном формате, где для каждого шага указан ожидаемый результат, включая предусловия, тестовые данные и четкие воспроизводимые шаги для ручных тестировщиков.

**Теги:** тест-кейсы, дизайн тестов, структурированное тестирование, документация тестов, выполнение тестов

**Статус:** TBD - Требуется парсинг с сайта

#### **📊 Создание Тест-кейсов (Табличный вид)** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Создает тест-кейсы в виде многоколоночной таблицы с ID, названием, предусловиями, шагами, ожидаемыми результатами, приоритетом и примечаниями - всё в одном представлении для удобного просмотра и управления.

**Теги:** тест-кейсы, дизайн тестов, приоритизация тестов, граничные случаи, документация тестов, обеспечение качества

**Статус:** TBD - Требуется парсинг с сайта

#### **🥒 Создание Тест-кейсов (Формат Gherkin)** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Создает тест-кейсы в формате Gherkin с конструкциями Дано/Когда/Тогда, делая их понятными как для бизнеса, так и для технических специалистов, идеально подходит для BDD и автоматизации.

**Теги:** тест-кейсы, пользовательские истории, gherkin, дизайн тестов, анализ требований

**Статус:** TBD - Требуется парсинг с сайта

#### **🔍 Проверка Качества Тест-кейсов** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Проверяет качество тест-кейсов, анализируя каждый раздел (заголовок, шаги, ожидаемые результаты) на соответствие лучшим практикам и предоставляет улучшенный пример, если требуются доработки.

**Теги:** тест-кейсы, проверка качества, лучшие практики, улучшение тестов, документация тестов

**Статус:** TBD - Требуется парсинг с сайта

---

## 📊 **Тестовые Данные (1 промпт)**

#### **🎲 Генерация Тестовых Данных** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Генерация наборов тестовых данных в различных форматах (CSV, JSON и др.) с реалистичными и граничными значениями для тестирования валидации ввода и обработки данных.

**Теги:** тестовые данные, генерация данных, граничные случаи, валидация ввода, форматы данных

**Статус:** TBD - Требуется парсинг с сайта

---

## 🐛 **Дефекты (1 промпт)**

#### **📋 Улучшение Отчетов об Ошибках** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Улучшите отчеты об ошибках в программном обеспечении, сделав их понятными, полными и удобными для разработчиков, следуя лучшим практикам отрасли.

**Теги:** отчеты об ошибках, обеспечение качества, документация, отслеживание ошибок, управление дефектами

**Статус:** TBD - Требуется парсинг с сайта

---

## 🎯 **Завершение Тестирования (1 промпт)**

#### **📈 Итоговый Отчет о Тестировании** ⏳ **ТРЕБУЕТ ПАРСИНГА**
**Описание:** Создание комплексных итоговых отчетов о тестировании с метриками и оценкой качества.

**Теги:** отчетность о тестировании, метрики, итоговый отчет, оценка качества, завершение тестирования

**Статус:** TBD - Требуется парсинг с сайта

---

## 🎯 **Готовые OnlyTests Команды для CRM**

### **📋 Создание плана тестирования CRM (ПОЛНЫЙ ПРОМПТ):**
```
Используй OnlyTests промпт "Разработка Плана Тестирования" для создания комплексного плана тестирования CRM системы "AI-Fitness Coach 360" со следующими модулями:

Модули CRM:
- Управление проектами
- Управление задачами (Kanban доска)
- Управление пользователями
- Система уведомлений
- Управление требованиями
- GitHub интеграция
- AI аналитика

Создай план тестирования с учетом:
- Функционального тестирования
- Интеграционного тестирования
- UI/UX тестирования
- API тестирования
- Производительности
- Безопасности
```

### **📊 Создание стратегии тестирования CRM (ПОЛНЫЙ ПРОМПТ):**
```
Используй OnlyTests промпт "Разработка Стратегии Тестирования" для создания стратегии тестирования CRM системы "AI-Fitness Coach 360":

Стратегические аспекты:
- Agile подход к тестированию
- Автоматизация тестирования (Playwright MCP)
- Управление рисками CRM
- Обеспечение качества
- Continuous Testing

Методологии:
- BDD (Behavior Driven Development)
- TDD (Test Driven Development)
- Risk-Based Testing
- Exploratory Testing
```

### **🔍 Анализ требований CRM (ТРЕБУЕТ ПАРСИНГА):**
```
Используй OnlyTests промпт "Анализ Требований и Генерация Вопросов" для анализа требований CRM системы "AI-Fitness Coach 360":

Документы требований:
- Функциональные требования CRM
- Технические требования
- Пользовательские истории
- API спецификации
- UI/UX требования

Создай список уточняющих вопросов и рекомендаций по улучшению требований.
```

### **📝 Создание тест-кейсов CRM (ТРЕБУЕТ ПАРСИНГА):**
```
Используй OnlyTests промпт "Создание Тест-кейсов (Классический формат)" для создания тест-кейсов CRM системы:

Функциональности для тестирования:
- Создание нового проекта
- Добавление задачи в проект
- Изменение статуса задачи
- Назначение пользователя на задачу
- Создание уведомления
- Синхронизация с GitHub
- Запуск AI анализа

Создай тест-кейсы в классическом двухколоночном формате.
```

### **🥒 BDD тест-кейсы CRM (ТРЕБУЕТ ПАРСИНГА):**
```
Используй OnlyTests промпт "Создание Тест-кейсов (Формат Gherkin)" для создания BDD тест-кейсов CRM:

Пользовательские сценарии:
- Сценарий: Создание проекта
- Сценарий: Управление задачами
- Сценарий: Работа с уведомлениями
- Сценарий: GitHub интеграция
- Сценарий: AI аналитика

Создай тест-кейсы в формате Gherkin с конструкциями Дано/Когда/Тогда.
```

### **📊 Генерация тестовых данных CRM (ТРЕБУЕТ ПАРСИНГА):**
```
Используй OnlyTests промпт "Генерация Тестовых Данных" для создания тестовых данных CRM системы:

Типы данных:
- Пользователи (имена, email, роли)
- Проекты (названия, описания, статусы)
- Задачи (заголовки, описания, приоритеты)
- Уведомления (типы, сообщения, статусы)
- GitHub Issues (названия, описания, метки)

Форматы:
- JSON для API тестирования
- CSV для импорта данных
- SQL для базы данных

Создай реалистичные и граничные тестовые данные.
```

### **🐛 Отчеты о багах CRM (ТРЕБУЕТ ПАРСИНГА):**
```
Используй OnlyTests промпт "Улучшение Отчетов об Ошибках" для создания отчетов о багах CRM системы:

Типы багов CRM:
- Функциональные ошибки (не работает создание проекта)
- UI/UX проблемы (некорректное отображение)
- API ошибки (неправильные ответы)
- Интеграционные проблемы (GitHub, AI)
- Производительность (медленная загрузка)

Создай стандартизированные отчеты о багах с:
- Описанием проблемы
- Шагами воспроизведения
- Ожидаемым и фактическим результатом
- Приоритетом и серьезностью
- Окружением и версией
```

### **📈 Итоговые отчеты CRM (ТРЕБУЕТ ПАРСИНГА):**
```
Используй OnlyTests промпт "Итоговый Отчет о Тестировании" для создания итогового отчета о тестировании CRM системы "AI-Fitness Coach 360":

Метрики для отчета:
- Общее количество тестов
- Процент прохождения тестов
- Покрытие кода
- Производительность
- Безопасность
- Пользовательский опыт

Включи:
- Статистику тестирования
- Найденные дефекты
- Рекомендации по улучшению
- Оценку готовности к продакшену
- План дальнейшего развития
```

---

## 🎉 **Заключение**

**OnlyTests Полная Библиотека Промптов** предоставляет профессиональные инструменты для всех фаз тестирования CRM системы:

- ✅ **Планирование** - 2/3 промптов получены (План тестирования, Стратегия тестирования)
- ⏳ **Анализ** - 0/2 промптов получены (требуют парсинга)
- ⏳ **Дизайн** - 0/5 промптов получены (требуют парсинга)
- ⏳ **Данные** - 0/1 промптов получены (требуют парсинга)
- ⏳ **Дефекты** - 0/1 промптов получены (требуют парсинга)
- ⏳ **Завершение** - 0/1 промптов получены (требуют парсинга)

**📊 Статистика парсинга:**
- **Всего промптов:** 13
- **Получено:** 2 (15%)
- **Требуют парсинга:** 11 (85%)

**🚀 OnlyTests + CRM = Профессиональное тестирование готово к использованию!**

**⚠️ Следующие шаги:**
1. Парсинг оставшихся 11 промптов с сайта OnlyTests
2. Создание полной локальной инструкции
3. Интеграция с CRM проектом
4. Тестирование всех промптов

---

## 📞 **Ссылки**

- **OnlyTests Библиотека Промптов:** [https://www.onlytest.io/ru/templates/prompt-library](https://www.onlytest.io/ru/templates/prompt-library)
- **OnlyTests Главная:** [https://www.onlytest.io/ru](https://www.onlytest.io/ru)
- **CRM Проект:** AI-Fitness Coach 360
- **Статус:** 2/13 промптов получены ✅
- **Готовность:** 15% ✅

**🎯 OnlyTests + Playwright MCP + CRM = Профессиональное тестирование!**
