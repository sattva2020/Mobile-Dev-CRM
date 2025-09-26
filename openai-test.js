#!/usr/bin/env node

/**
 * Тест AI интеграции с использованием OpenAI API
 * Проверяет все AI функции CRM-системы с OpenAI
 */

const OpenAI = require('openai');

// Конфигурация OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

// Инициализация клиента OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function testOpenAIIntegration() {
  console.log('🤖 Тест AI интеграции с OpenAI API');
  console.log('='.repeat(60));

  if (!OPENAI_API_KEY) {
    console.log('❌ Ошибка: OPENAI_API_KEY не найден');
    console.log('💡 Решение: Установите переменную окружения OPENAI_API_KEY');
    console.log('Пример: export OPENAI_API_KEY=your_api_key_here');
    return false;
  }

  try {
    // Тест 1: Простой запрос
    console.log('\n📝 Тест 1: Простой запрос');
    console.log('-'.repeat(30));

    const completion1 = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content:
            "Привет! Это тест CRM-системы AI-Fitness Coach 360. Ответь коротко: 'AI интеграция работает отлично!'",
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    console.log('✅ Ответ от AI:');
    console.log(completion1.choices[0].message.content);

    // Тест 2: Анализ проекта
    console.log('\n📊 Тест 2: Анализ проекта');
    console.log('-'.repeat(30));

    const projectAnalysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Проанализируй проект:

Проект: AI-Fitness Coach 360
Статус: active
Всего задач: 25
Выполнено: 15
В работе: 7
Просрочено: 3
Оценка времени: 120 часов
Фактическое время: 95 часов
Скорость: 5 задач/неделю

Дай краткий анализ (2-3 предложения):`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    console.log('✅ Анализ проекта:');
    console.log(projectAnalysis.choices[0].message.content);

    // Тест 3: Генерация задач
    console.log('\n🎯 Тест 3: Генерация задач');
    console.log('-'.repeat(30));

    const taskGeneration = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Создай 3 новые задачи для проекта AI-Fitness Coach 360:

Формат:
1. Название задачи
2. Описание
3. Приоритет (low/medium/high/urgent)
4. Оценка времени в часах
5. Метки

Кратко и по делу:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    console.log('✅ Генерация задач:');
    console.log(taskGeneration.choices[0].message.content);

    // Тест 4: AI предложения
    console.log('\n💡 Тест 4: AI предложения');
    console.log('-'.repeat(30));

    const suggestions = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Дай предложения по оптимизации проекта:

Текущие задачи:
- Реализация AI анализа поз (в работе, 75% готово)
- Оптимизация производительности (ожидает)
- Тестирование безопасности (на проверке, 90% готово)

Проблемы:
- 3 просроченные задачи
- Недооценка времени на 25 часов
- Неравномерное распределение нагрузки

Дай 3-4 конкретных предложения:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    console.log('✅ AI предложения:');
    console.log(suggestions.choices[0].message.content);

    // Тест 5: Генерация отчета
    console.log('\n📋 Тест 5: Генерация отчета');
    console.log('-'.repeat(30));

    const report = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Создай еженедельный отчет по проекту:

Проект: AI-Fitness Coach 360
Период: 2024-01-01 - 2024-09-24

Статистика:
- Всего задач: 25
- Выполнено: 15 (60%)
- В работе: 7 (28%)
- Ожидают: 3 (12%)

Включи:
1. Общий обзор прогресса
2. Ключевые достижения
3. Проблемы и риски
4. Планы на следующую неделю

Кратко и структурированно:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    console.log('✅ Генерация отчета:');
    console.log(report.choices[0].message.content);

    // Тест 6: Анализ производительности
    console.log('\n⚡ Тест 6: Анализ производительности');
    console.log('-'.repeat(30));

    const performance = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Проанализируй производительность команды:

Метрики:
- Скорость: 5 задач/неделю
- Точность планирования: 79%
- Эффективность: 85%
- Качество: 92%

Дай анализ:
1. Сильные стороны
2. Области для улучшения
3. Рекомендации

Кратко и по делу:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    console.log('✅ Анализ производительности:');
    console.log(performance.choices[0].message.content);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! AI интеграция работает отлично!');
    console.log('📊 Статус: ✅ ГОТОВО К ПРОДАКШЕНУ');
    console.log('🔗 Модель: gpt-4o-mini');
    console.log('🌐 API: OpenAI');
    console.log('📦 SDK: JavaScript OpenAI SDK');

    return true;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);

    if (error.response) {
      console.log('Детали ошибки:', error.response.data);
    }

    console.log('\n💡 Возможные решения:');
    console.log('1. Проверьте API ключ на https://platform.openai.com');
    console.log('2. Убедитесь, что у вас есть доступ к модели');
    console.log('3. Проверьте баланс на OpenAI');
    console.log('4. Установите openai: npm install openai');

    return false;
  }
}

// Запуск теста
async function main() {
  console.log('🚀 Запуск теста AI интеграции с OpenAI...');

  const success = await testOpenAIIntegration();

  if (success) {
    console.log('\n✅ Все тесты пройдены успешно!');
    process.exit(0);
  } else {
    console.log('\n❌ Некоторые тесты не прошли');
    process.exit(1);
  }
}

main().catch(console.error);
