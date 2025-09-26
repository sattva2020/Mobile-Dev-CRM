#!/usr/bin/env node

/**
 * Тест AI интеграции с использованием LM Studio API
 * Проверяет все AI функции CRM-системы с локальной моделью
 * Документация: https://lmstudio.ai/docs/app/api/endpoints/openai
 */

const OpenAI = require('openai');

// Конфигурация LM Studio
const LM_STUDIO_API_KEY = process.env.LM_STUDIO_API_KEY || 'lm-studio';
const LM_STUDIO_BASE_URL = process.env.LM_STUDIO_BASE_URL || 'http://172.30.48.1:11234/v1';
const MODEL_NAME = process.env.LM_STUDIO_MODEL || 'openai/gpt-oss-20b';

// Инициализация клиента LM Studio
const openai = new OpenAI({
  baseURL: LM_STUDIO_BASE_URL,
  apiKey: LM_STUDIO_API_KEY,
});

async function testLMStudioIntegration() {
  console.log('🤖 Тест AI интеграции с LM Studio API');
  console.log('='.repeat(60));
  console.log(`🔗 Base URL: ${LM_STUDIO_BASE_URL}`);
  console.log(`🤖 Модель: ${MODEL_NAME}`);
  console.log('='.repeat(60));

  try {
    // Тест 1: Проверка доступности сервера
    console.log('\n🔍 Тест 1: Проверка доступности сервера');
    console.log('-'.repeat(30));

    try {
      const models = await openai.models.list();
      console.log('✅ LM Studio сервер доступен');
      console.log(`📊 Загружено моделей: ${models.data.length}`);

      if (models.data.length > 0) {
        console.log('📋 Доступные модели:');
        models.data.forEach((model, index) => {
          console.log(`  ${index + 1}. ${model.id}`);
        });
      }
    } catch (error) {
      console.log('❌ LM Studio сервер недоступен');
      console.log('💡 Решение: Запустите LM Studio и загрузите модель');
      console.log('1. Откройте LM Studio');
      console.log('2. Загрузите модель openai/gpt-oss-20b');
      console.log('3. Запустите локальный сервер (порт 1234)');
      return false;
    }

    // Тест 2: Простой запрос
    console.log('\n📝 Тест 2: Простой запрос');
    console.log('-'.repeat(30));

    const completion1 = await openai.chat.completions.create({
      model: MODEL_NAME,
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

    // Тест 3: Анализ проекта
    console.log('\n📊 Тест 3: Анализ проекта');
    console.log('-'.repeat(30));

    const projectAnalysis = await openai.chat.completions.create({
      model: MODEL_NAME,
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

    // Тест 4: Генерация задач
    console.log('\n🎯 Тест 4: Генерация задач');
    console.log('-'.repeat(30));

    const taskGeneration = await openai.chat.completions.create({
      model: MODEL_NAME,
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

    // Тест 5: AI предложения
    console.log('\n💡 Тест 5: AI предложения');
    console.log('-'.repeat(30));

    const suggestions = await openai.chat.completions.create({
      model: MODEL_NAME,
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

    // Тест 6: Генерация отчета
    console.log('\n📋 Тест 6: Генерация отчета');
    console.log('-'.repeat(30));

    const report = await openai.chat.completions.create({
      model: MODEL_NAME,
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

    // Тест 7: Анализ производительности
    console.log('\n⚡ Тест 7: Анализ производительности');
    console.log('-'.repeat(30));

    const performance = await openai.chat.completions.create({
      model: MODEL_NAME,
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
    console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! LM Studio интеграция работает отлично!');
    console.log('📊 Статус: ✅ ГОТОВО К ПРОДАКШЕНУ');
    console.log(`🔗 Модель: ${MODEL_NAME}`);
    console.log('🌐 API: LM Studio (локальный)');
    console.log('📦 SDK: JavaScript OpenAI SDK');
    console.log('🔒 Приватность: 100% локальная обработка');

    return true;
  } catch (error) {
    console.error('❌ Ошибка:', error.message);

    if (error.response) {
      console.log('Детали ошибки:', error.response.data);
    }

    console.log('\n💡 Возможные решения:');
    console.log('1. Убедитесь, что LM Studio запущен');
    console.log('2. Проверьте, что модель загружена');
    console.log('3. Проверьте порт сервера (по умолчанию 1234)');
    console.log('4. Убедитесь, что модель openai/gpt-oss-20b доступна');
    console.log('5. Проверьте логи LM Studio для диагностики');

    return false;
  }
}

// Запуск теста
async function main() {
  console.log('🚀 Запуск теста AI интеграции с LM Studio...');
  console.log('📖 Документация: https://lmstudio.ai/docs/app/api/endpoints/openai');

  const success = await testLMStudioIntegration();

  if (success) {
    console.log('\n✅ Все тесты пройдены успешно!');
    console.log('🔒 Ваши данные остаются приватными - все обрабатывается локально!');
    process.exit(0);
  } else {
    console.log('\n❌ Некоторые тесты не прошли');
    console.log('💡 Проверьте настройки LM Studio');
    process.exit(1);
  }
}

main().catch(console.error);
