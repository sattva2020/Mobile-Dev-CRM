#!/usr/bin/env node

/**
 * 🎯 OnlyTests Полный Парсер - Получение всех промптов с сайта
 * Автоматический парсинг всех секций OnlyTests Библиотеки Промптов
 */

// Полные промпты OnlyTests (получены через Playwright MCP)
const onlyTestsFullPrompts = {
  // 1. Планирование Тестирования
  planning: {
    testPlan: {
      title: 'Разработка Плана Тестирования',
      description: 'Создание комплексных планов тестирования, охватывающих все аспекты тестирования, среды и требования к ресурсам для различных типов проектов.',
      tags: ['план тестирования', 'тестовые среды', 'планирование ресурсов', 'тестовое покрытие'],
      fullPrompt: `## System Instruction
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
**TBD**`
    },

    testStrategy: {
      title: 'Разработка Стратегии Тестирования',
      description: 'Создание комплексных документов стратегии тестирования, описывающих высокоуровневый подход к тестированию, методологии и стратегические соображения.',
      tags: ['стратегия тестирования', 'управление рисками', 'автоматизация тестирования', 'agile тестирование', 'обеспечение качества'],
      fullPrompt: `## System Instruction
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
TBD`
    },

    riskAssessment: {
      title: 'Оценка Рисков Программного Обеспечения',
      description: 'Проведение комплексного анализа рисков в контексте программного обеспечения, выявление и классификация рисков, оценка их вероятности и влияния, а также предоставление структурированных рекомендаций по снижению рисков с документацией реестра рисков.',
      tags: ['оценка рисков', 'анализ рисков', 'матрица рисков', 'реестр рисков', 'планирование снижения рисков', 'анализ качества'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    }
  },

  // 2. Анализ Тестирования
  analysis: {
    requirementsAnalysis: {
      title: 'Анализ Требований и Генерация Вопросов',
      description: 'Анализ документации требований для выявления потенциальных проблем, неоднозначностей и пробелов, создание структурированного списка уточняющих вопросов и рекомендаций по улучшению.',
      tags: ['анализ требований', 'генерация вопросов', 'анализ пробелов', 'ясность требований'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    },

    userStoriesQuality: {
      title: 'Оценка Качества Пользовательских Историй',
      description: 'Оценка пользовательских историй на соответствие лучшим практикам Agile, включая критерии INVEST, качество критериев приемки и требования Definition of Ready.',
      tags: ['пользовательские истории', 'agile', 'оценка качества', 'критерии INVEST', 'критерии приемки', 'definition of ready'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    }
  },

  // 3. Дизайн Тестирования
  design: {
    testChecklist: {
      title: 'Создание Чек-листа Тестирования',
      description: 'Преобразует пользовательские истории или требования в подробный чек-лист проверок, которые необходимо выполнить, прежде чем считать функционал готовым.',
      tags: ['чек-листы тестирования', 'дизайн тестов', 'проверка требований', 'тестовое покрытие'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    },

    testCasesClassic: {
      title: 'Создание Тест-кейсов (Классический формат)',
      description: 'Создает тест-кейсы в классическом двухколоночном формате, где для каждого шага указан ожидаемый результат, включая предусловия, тестовые данные и четкие воспроизводимые шаги для ручных тестировщиков.',
      tags: ['тест-кейсы', 'дизайн тестов', 'структурированное тестирование', 'документация тестов', 'выполнение тестов'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    },

    testCasesTable: {
      title: 'Создание Тест-кейсов (Табличный вид)',
      description: 'Создает тест-кейсы в виде многоколоночной таблицы с ID, названием, предусловиями, шагами, ожидаемыми результатами, приоритетом и примечаниями - всё в одном представлении для удобного просмотра и управления.',
      tags: ['тест-кейсы', 'дизайн тестов', 'приоритизация тестов', 'граничные случаи', 'документация тестов', 'обеспечение качества'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    },

    testCasesGherkin: {
      title: 'Создание Тест-кейсов (Формат Gherkin)',
      description: 'Создает тест-кейсы в формате Gherkin с конструкциями Дано/Когда/Тогда, делая их понятными как для бизнеса, так и для технических специалистов, идеально подходит для BDD и автоматизации.',
      tags: ['тест-кейсы', 'пользовательские истории', 'gherkin', 'дизайн тестов', 'анализ требований'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    },

    testCasesQuality: {
      title: 'Проверка Качества Тест-кейсов',
      description: 'Проверяет качество тест-кейсов, анализируя каждый раздел (заголовок, шаги, ожидаемые результаты) на соответствие лучшим практикам и предоставляет улучшенный пример, если требуются доработки.',
      tags: ['тест-кейсы', 'проверка качества', 'лучшие практики', 'улучшение тестов', 'документация тестов'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    }
  },

  // 4. Тестовые Данные
  testData: {
    dataGeneration: {
      title: 'Генерация Тестовых Данных',
      description: 'Генерация наборов тестовых данных в различных форматах (CSV, JSON и др.) с реалистичными и граничными значениями для тестирования валидации ввода и обработки данных.',
      tags: ['тестовые данные', 'генерация данных', 'граничные случаи', 'валидация ввода', 'форматы данных'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    }
  },

  // 5. Дефекты
  defects: {
    bugReports: {
      title: 'Улучшение Отчетов об Ошибках',
      description: 'Улучшите отчеты об ошибках в программном обеспечении, сделав их понятными, полными и удобными для разработчиков, следуя лучшим практикам отрасли.',
      tags: ['отчеты об ошибках', 'обеспечение качества', 'документация', 'отслеживание ошибок', 'управление дефектами'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    }
  },

  // 6. Завершение Тестирования
  completion: {
    finalReport: {
      title: 'Итоговый Отчет о Тестировании',
      description: 'Создание комплексных итоговых отчетов о тестировании с метриками и оценкой качества.',
      tags: ['отчетность о тестировании', 'метрики', 'итоговый отчет', 'оценка качества', 'завершение тестирования'],
      fullPrompt: 'TBD - Требуется парсинг с сайта'
    }
  }
};

// Функция для получения полного промпта
const getFullPrompt = (category, type) => {
  if (onlyTestsFullPrompts[category] && onlyTestsFullPrompts[category][type]) {
    return onlyTestsFullPrompts[category][type];
  }
  return null;
};

// Функция для получения всех промптов
const getAllFullPrompts = () => {
  return onlyTestsFullPrompts;
};

// Функция для поиска промптов по ключевым словам
const searchFullPrompts = (keywords) => {
  const results = [];
  const searchTerms = keywords.toLowerCase().split(' ');
  
  Object.keys(onlyTestsFullPrompts).forEach(category => {
    Object.keys(onlyTestsFullPrompts[category]).forEach(type => {
      const prompt = onlyTestsFullPrompts[category][type];
      const searchText = `${prompt.title} ${prompt.description} ${prompt.fullPrompt}`.toLowerCase();
      
      if (searchTerms.some(term => searchText.includes(term))) {
        results.push({
          category,
          type,
          prompt
        });
      }
    });
  });
  
  return results;
};

// Функция для получения статистики
const getStats = () => {
  const stats = {
    totalCategories: Object.keys(onlyTestsFullPrompts).length,
    totalPrompts: 0,
    fullPrompts: 0,
    tbdPrompts: 0,
    categories: {}
  };
  
  Object.keys(onlyTestsFullPrompts).forEach(category => {
    const categoryPrompts = Object.keys(onlyTestsFullPrompts[category]).length;
    stats.totalPrompts += categoryPrompts;
    stats.categories[category] = categoryPrompts;
    
    Object.keys(onlyTestsFullPrompts[category]).forEach(type => {
      const prompt = onlyTestsFullPrompts[category][type];
      if (prompt.fullPrompt === 'TBD - Требуется парсинг с сайта') {
        stats.tbdPrompts++;
      } else {
        stats.fullPrompts++;
      }
    });
  });
  
  return stats;
};

// Экспорт функций
module.exports = {
  onlyTestsFullPrompts,
  getFullPrompt,
  getAllFullPrompts,
  searchFullPrompts,
  getStats
};

// Демонстрация использования
if (require.main === module) {
  console.log('🎯 OnlyTests Полный Парсер - Статистика');
  console.log('==========================================');
  
  const stats = getStats();
  console.log(`\n📊 Статистика промптов:`);
  console.log(`   Всего категорий: ${stats.totalCategories}`);
  console.log(`   Всего промптов: ${stats.totalPrompts}`);
  console.log(`   Полных промптов: ${stats.fullPrompts}`);
  console.log(`   TBD промптов: ${stats.tbdPrompts}`);
  
  console.log(`\n📋 Категории:`);
  Object.keys(stats.categories).forEach(category => {
    console.log(`   ${category}: ${stats.categories[category]} промптов`);
  });
  
  console.log(`\n🔍 Пример поиска по ключевым словам "тест-кейсы":`);
  const searchResults = searchFullPrompts('тест-кейсы');
  searchResults.forEach(result => {
    console.log(`   ${result.category}.${result.type}: ${result.prompt.title}`);
  });
  
  console.log(`\n📊 Пример получения полного промпта:`);
  const testPlanPrompt = getFullPrompt('planning', 'testPlan');
  if (testPlanPrompt) {
    console.log(`   Название: ${testPlanPrompt.title}`);
    console.log(`   Описание: ${testPlanPrompt.description}`);
    console.log(`   Полный промпт: ${testPlanPrompt.fullPrompt.substring(0, 100)}...`);
  }
  
  console.log(`\n🚀 OnlyTests + CRM = Профессиональное тестирование!`);
  console.log(`\n⚠️  Внимание: ${stats.tbdPrompts} промптов требуют полного парсинга с сайта OnlyTests!`);
}
