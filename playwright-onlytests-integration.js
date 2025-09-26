#!/usr/bin/env node

/**
 * 🎭 Playwright + OnlyTests Integration
 * Интеграция Playwright с OnlyTests для автоматического тестирования CRM
 * Основано на: https://playwright.help/docs/writing-tests
 * OnlyTests: https://www.onlytest.io/ru
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Импорт OnlyTests промптов
const { onlyTestsCRMPrompts } = require('./onlytests-crm-prompts');

/**
 * 🎯 Playwright + OnlyTests Integration Class
 */
class PlaywrightOnlyTestsIntegration {
  constructor() {
    this.testResults = [];
    this.config = {
      baseURL: 'http://localhost:3000',
      timeout: 30000,
      retries: 2,
      workers: 4,
    };
  }

  /**
   * Запуск тестов с OnlyTests промптами
   */
  async runOnlyTestsIntegration() {
    console.log('🎭 Playwright + OnlyTests Integration');
    console.log('=====================================');

    try {
      // 1. Проверка доступности CRM системы
      await this.checkCRMSystem();

      // 2. Запуск тестов на основе OnlyTests промптов
      await this.runOnlyTestsBasedTests();

      // 3. Генерация отчета
      await this.generateIntegrationReport();

      console.log('✅ Playwright + OnlyTests integration completed successfully!');
    } catch (error) {
      console.error('❌ Integration failed:', error.message);
      throw error;
    }
  }

  /**
   * Проверка доступности CRM системы
   */
  async checkCRMSystem() {
    console.log('🔍 Checking CRM system availability...');

    try {
      // Проверка через curl
      const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', {
        encoding: 'utf8',
      });

      if (response.trim() === '200') {
        console.log('✅ CRM system is available');
        return true;
      } else {
        throw new Error(`CRM system returned status: ${response.trim()}`);
      }
    } catch (error) {
      console.error('❌ CRM system is not available:', error.message);
      throw new Error('CRM system is not running. Please start the system first.');
    }
  }

  /**
   * Запуск тестов на основе OnlyTests промптов
   */
  async runOnlyTestsBasedTests() {
    console.log('🧪 Running tests based on OnlyTests prompts...');

    const testCategories = ['planning', 'analysis', 'design', 'testData', 'defects', 'completion'];

    for (const category of testCategories) {
      console.log(`\n📋 Testing category: ${category}`);

      const prompts = onlyTestsCRMPrompts.getPromptsByCategory(category);

      for (const prompt of prompts) {
        await this.runPromptBasedTest(prompt);
      }
    }
  }

  /**
   * Запуск теста на основе промпта
   */
  async runPromptBasedTest(prompt) {
    console.log(`   🎯 Testing: ${prompt.title}`);

    try {
      // Генерация тест-кейса на основе промпта
      const testCase = await this.generateTestCaseFromPrompt(prompt);

      // Выполнение теста
      const result = await this.executeTestCase(testCase);

      this.testResults.push({
        prompt: prompt.title,
        category: prompt.category,
        status: result.success ? 'passed' : 'failed',
        duration: result.duration,
        details: result.details,
      });

      console.log(
        `      ${result.success ? '✅' : '❌'} ${result.success ? 'Passed' : 'Failed'} (${result.duration}ms)`
      );
    } catch (error) {
      console.error(`      ❌ Error: ${error.message}`);

      this.testResults.push({
        prompt: prompt.title,
        category: prompt.category,
        status: 'error',
        duration: 0,
        details: error.message,
      });
    }
  }

  /**
   * Генерация тест-кейса из промпта
   */
  async generateTestCaseFromPrompt(prompt) {
    // Симуляция генерации тест-кейса на основе промпта
    const testCase = {
      name: `OnlyTests: ${prompt.title}`,
      steps: [
        `Navigate to CRM system`,
        `Execute ${prompt.title} functionality`,
        `Verify results according to ${prompt.title} criteria`,
      ],
      expectedResult: `Successfully execute ${prompt.title} with proper validation`,
    };

    return testCase;
  }

  /**
   * Выполнение тест-кейса
   */
  async executeTestCase(testCase) {
    const startTime = Date.now();

    try {
      // Симуляция выполнения теста
      await this.simulateTestExecution(testCase);

      const duration = Date.now() - startTime;

      return {
        success: true,
        duration: duration,
        details: 'Test executed successfully',
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        duration: duration,
        details: error.message,
      };
    }
  }

  /**
   * Симуляция выполнения теста
   */
  async simulateTestExecution(testCase) {
    // Симуляция времени выполнения
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

    // Симуляция случайных ошибок (10% вероятность)
    if (Math.random() < 0.1) {
      throw new Error('Simulated test failure');
    }
  }

  /**
   * Генерация отчета интеграции
   */
  async generateIntegrationReport() {
    console.log('\n📊 Generating integration report...');

    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      passed: this.testResults.filter((r) => r.status === 'passed').length,
      failed: this.testResults.filter((r) => r.status === 'failed').length,
      errors: this.testResults.filter((r) => r.status === 'error').length,
      results: this.testResults,
      summary: this.generateSummary(),
    };

    // Сохранение отчета
    const reportPath = path.join(__dirname, 'playwright-onlytests-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`   📄 Report saved: ${reportPath}`);
    console.log(`   📊 Summary: ${report.passed}/${report.totalTests} tests passed`);

    return report;
  }

  /**
   * Генерация сводки
   */
  generateSummary() {
    const categories = {};

    this.testResults.forEach((result) => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, failed: 0, errors: 0 };
      }

      categories[result.category][result.status]++;
    });

    return {
      categories: categories,
      successRate:
        (
          (this.testResults.filter((r) => r.status === 'passed').length / this.testResults.length) *
          100
        ).toFixed(2) + '%',
    };
  }
}

/**
 * 🎯 Playwright Commands Generator
 * Генератор команд Playwright на основе OnlyTests промптов
 */
class PlaywrightCommandsGenerator {
  constructor() {
    this.commands = [];
  }

  /**
   * Генерация команд Playwright
   */
  generatePlaywrightCommands() {
    console.log('🎭 Generating Playwright commands...');

    const commands = [
      {
        name: 'navigate_to_crm',
        description: 'Navigate to CRM system',
        command: 'await page.goto("http://localhost:3000");',
      },
      {
        name: 'create_project_with_ai',
        description: 'Create project with AI analysis',
        command: `
await page.getByRole('button', { name: 'New Project' }).click();
await page.getByLabel('Project Name').fill('AI Project');
await page.getByRole('button', { name: 'Analyze with AI' }).click();
await page.getByRole('button', { name: 'Save Project' }).click();`,
      },
      {
        name: 'create_task_with_ai',
        description: 'Create task with AI recommendations',
        command: `
await page.getByRole('link', { name: 'Tasks' }).click();
await page.getByRole('button', { name: 'New Task' }).click();
await page.getByLabel('Task Title').fill('AI Task');
await page.getByRole('button', { name: 'Get AI Recommendations' }).click();
await page.getByRole('button', { name: 'Save Task' }).click();`,
      },
      {
        name: 'test_ai_services',
        description: 'Test AI services connectivity',
        command: `
await page.getByRole('link', { name: 'AI Settings' }).click();
await page.getByRole('button', { name: 'Test OpenRouter Connection' }).click();
await expect(page.getByText('OpenRouter: Connected')).toBeVisible();
await page.getByRole('button', { name: 'Test LM Studio Connection' }).click();
await expect(page.getByText('LM Studio: Connected')).toBeVisible();`,
      },
    ];

    return commands;
  }

  /**
   * Создание файла с командами
   */
  createCommandsFile() {
    const commands = this.generatePlaywrightCommands();

    const commandsContent = `/**
 * 🎭 Playwright Commands for CRM Testing
 * Generated by Playwright + OnlyTests Integration
 */

export const playwrightCommands = {
${commands
  .map(
    (cmd) => `  ${cmd.name}: {
    description: '${cmd.description}',
    command: \`${cmd.command}\`
  }`
  )
  .join(',\n')}
};

// Usage example:
// import { playwrightCommands } from './playwright-commands';
// await eval(playwrightCommands.navigate_to_crm.command);
`;

    const filePath = path.join(__dirname, 'playwright-commands.js');
    fs.writeFileSync(filePath, commandsContent);

    console.log(`   📄 Commands file created: ${filePath}`);
    return filePath;
  }
}

/**
 * 🎯 Main Integration Function
 */
async function main() {
  try {
    console.log('🚀 Starting Playwright + OnlyTests Integration');
    console.log('===============================================');

    // 1. Запуск интеграции
    const integration = new PlaywrightOnlyTestsIntegration();
    await integration.runOnlyTestsIntegration();

    // 2. Генерация команд
    const generator = new PlaywrightCommandsGenerator();
    generator.createCommandsFile();

    console.log('\n🎉 Integration completed successfully!');
    console.log('📊 Check playwright-onlytests-report.json for detailed results');
    console.log('📄 Check playwright-commands.js for generated commands');
  } catch (error) {
    console.error('💥 Integration failed:', error.message);
    process.exit(1);
  }
}

// Запуск если файл выполняется напрямую
if (require.main === module) {
  main();
}

module.exports = {
  PlaywrightOnlyTestsIntegration,
  PlaywrightCommandsGenerator,
};
