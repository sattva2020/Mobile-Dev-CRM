import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * 📊 OnlyTests Custom Reporter
 * Кастомный репортер для OnlyTests подхода
 * Основано на: https://github.com/e-semenyuk/onlytests-qa
 */

interface OnlyTestsResult {
  title: string;
  status: string;
  duration: number;
  approach: string;
  category: string;
  pageObject: string;
  description: string;
  steps: string[];
  expectedResult: string;
  actualResult: string;
  screenshots: string[];
  videos: string[];
  traces: string[];
}

interface OnlyTestsSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  approaches: Record<string, number>;
  categories: Record<string, number>;
  pageObjects: Record<string, number>;
  successRate: number;
  averageDuration: number;
}

class OnlyTestsReporter implements Reporter {
  private results: OnlyTestsResult[] = [];
  private startTime: number = 0;
  private config: FullConfig | undefined;

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.startTime = Date.now();
    
    console.log('🎭 Starting OnlyTests Playwright Tests');
    console.log('=====================================');
    console.log(`📊 Total tests: ${suite.allTests().length}`);
    console.log(`🌐 Base URL: ${config.use?.baseURL || 'http://localhost:3000'}`);
    console.log(`⚙️ Workers: ${config.workers || 'auto'}`);
    console.log(`🔄 Retries: ${config.retries || 0}`);
    console.log(`🏗️ Approach: OnlyTests Simplified Architecture`);
    console.log('');
  }

  onTestBegin(test: TestCase, result: TestResult) {
    const approach = this.extractApproach(test.title);
    const category = this.extractCategory(test.title);
    const pageObject = this.extractPageObject(test.title);
    
    console.log(`🧪 Running: ${test.title}`);
    console.log(`   🏗️ Approach: ${approach}`);
    console.log(`   📂 Category: ${category}`);
    console.log(`   📄 Page Object: ${pageObject}`);
    console.log(`   📍 File: ${test.location.file}:${test.location.line}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
    const duration = result.duration;
    const approach = this.extractApproach(test.title);
    const category = this.extractCategory(test.title);
    const pageObject = this.extractPageObject(test.title);
    
    console.log(`   ${status} ${test.title} (${duration}ms)`);
    
    // Сохранение результата
    this.results.push({
      title: test.title,
      status: result.status,
      duration: duration,
      approach: approach,
      category: category,
      pageObject: pageObject,
      description: this.extractDescription(test.title),
      steps: this.extractSteps(test.title),
      expectedResult: this.extractExpectedResult(test.title),
      actualResult: result.status === 'passed' ? 'Test passed successfully' : result.error?.message || 'Test failed',
      screenshots: result.attachments?.filter(a => a.name === 'screenshot').map(a => a.path || '') || [],
      videos: result.attachments?.filter(a => a.name === 'video').map(a => a.path || '') || [],
      traces: result.attachments?.filter(a => a.name === 'trace').map(a => a.path || '') || []
    });
  }

  onEnd(result: FullResult) {
    const totalDuration = Date.now() - this.startTime;
    const summary = this.generateSummary();
    
    console.log('');
    console.log('📊 OnlyTests Results Summary');
    console.log('============================');
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏭️ Skipped: ${summary.skipped}`);
    console.log(`⏱️ Duration: ${summary.duration}ms`);
    console.log(`📈 Success Rate: ${summary.successRate}%`);
    console.log(`📊 Average Duration: ${summary.averageDuration}ms`);
    console.log('');
    
    // Подходы
    console.log('🏗️ Results by Approach:');
    Object.entries(summary.approaches).forEach(([approach, count]) => {
      console.log(`   ${approach}: ${count} tests`);
    });
    console.log('');
    
    // Категории
    console.log('📂 Results by Category:');
    Object.entries(summary.categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} tests`);
    });
    console.log('');
    
    // Page Objects
    console.log('📄 Results by Page Object:');
    Object.entries(summary.pageObjects).forEach(([pageObject, count]) => {
      console.log(`   ${pageObject}: ${count} tests`);
    });
    console.log('');
    
    // Сохранение отчета
    this.saveReport(summary);
    
    // Рекомендации
    this.generateRecommendations(summary);
  }

  private extractApproach(title: string): string {
    if (title.includes('OnlyTests')) return 'OnlyTests';
    if (title.includes('Page Object')) return 'Page Object Model';
    if (title.includes('Direct')) return 'Direct Class Usage';
    if (title.includes('Simplified')) return 'Simplified Architecture';
    return 'OnlyTests';
  }

  private extractCategory(title: string): string {
    if (title.includes('Project')) return 'Project Management';
    if (title.includes('Task')) return 'Task Management';
    if (title.includes('AI') || title.includes('ai')) return 'AI Integration';
    if (title.includes('User') || title.includes('Auth')) return 'User Management';
    if (title.includes('Mobile') || title.includes('Responsive')) return 'Responsive Design';
    if (title.includes('Accessibility') || title.includes('Keyboard')) return 'Accessibility';
    if (title.includes('Performance') || title.includes('Load')) return 'Performance';
    if (title.includes('Error') || title.includes('Network')) return 'Error Handling';
    return 'General';
  }

  private extractPageObject(title: string): string {
    if (title.includes('Project')) return 'ProjectsPage';
    if (title.includes('Task')) return 'TasksPage';
    if (title.includes('AI')) return 'AISettingsPage';
    if (title.includes('User')) return 'UsersPage';
    if (title.includes('Home')) return 'HomePage';
    return 'BasePage';
  }

  private extractDescription(title: string): string {
    // Извлечение описания из названия теста
    return title.replace(/should|test|verify/gi, '').trim();
  }

  private extractSteps(title: string): string[] {
    // Базовые шаги на основе OnlyTests подхода
    return [
      'Navigate to the page using page object',
      'Perform actions using page object methods',
      'Verify results using page object assertions'
    ];
  }

  private extractExpectedResult(title: string): string {
    // Извлечение ожидаемого результата из названия теста
    if (title.includes('create')) return 'Item should be created successfully using page object';
    if (title.includes('delete')) return 'Item should be deleted successfully using page object';
    if (title.includes('update')) return 'Item should be updated successfully using page object';
    if (title.includes('display')) return 'Item should be displayed correctly using page object';
    return 'Test should pass without errors using OnlyTests approach';
  }

  private generateSummary(): OnlyTestsSummary {
    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    // Группировка по подходам
    const approaches: Record<string, number> = {};
    this.results.forEach(result => {
      approaches[result.approach] = (approaches[result.approach] || 0) + 1;
    });
    
    // Группировка по категориям
    const categories: Record<string, number> = {};
    this.results.forEach(result => {
      categories[result.category] = (categories[result.category] || 0) + 1;
    });
    
    // Группировка по Page Objects
    const pageObjects: Record<string, number> = {};
    this.results.forEach(result => {
      pageObjects[result.pageObject] = (pageObjects[result.pageObject] || 0) + 1;
    });
    
    return {
      totalTests,
      passed,
      failed,
      skipped,
      duration,
      approaches,
      categories,
      pageObjects,
      successRate: totalTests > 0 ? Math.round((passed / totalTests) * 100) : 0,
      averageDuration: totalTests > 0 ? Math.round(duration / totalTests) : 0
    };
  }

  private saveReport(summary: OnlyTestsSummary) {
    const report = {
      timestamp: new Date().toISOString(),
      testRun: 'OnlyTests Playwright Tests',
      approach: 'OnlyTests Simplified Architecture',
      summary,
      results: this.results,
      config: {
        baseURL: this.config?.use?.baseURL,
        workers: this.config?.workers,
        retries: this.config?.retries,
        timeout: this.config?.use?.actionTimeout
      }
    };
    
    const reportPath = join(__dirname, '..', '..', 'playwright-onlytests-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 OnlyTests report saved: ${reportPath}`);
  }

  private generateRecommendations(summary: OnlyTestsSummary) {
    console.log('💡 OnlyTests Recommendations:');
    
    if (summary.successRate < 80) {
      console.log('   ⚠️ Low success rate detected. Consider reviewing failed tests.');
    }
    
    if (summary.averageDuration > 5000) {
      console.log('   ⚠️ High average duration detected. Consider optimizing test performance.');
    }
    
    if (summary.failed > 0) {
      console.log('   🔍 Review failed tests and fix issues before next run.');
    }
    
    if (summary.categories['AI Integration'] && summary.categories['AI Integration'] > 0) {
      console.log('   🤖 AI Integration tests detected. Ensure AI services are properly configured.');
    }
    
    if (summary.categories['Performance'] && summary.categories['Performance'] > 0) {
      console.log('   ⚡ Performance tests detected. Monitor system performance metrics.');
    }
    
    console.log('');
    console.log('🎯 OnlyTests Next Steps:');
    console.log('   1. Review the detailed report in playwright-onlytests-report.json');
    console.log('   2. Check screenshots and videos for failed tests');
    console.log('   3. Analyze traces for debugging information');
    console.log('   4. Update page objects and test data as needed');
    console.log('   5. Consider OnlyTests architecture improvements');
    console.log('');
  }
}

export default OnlyTestsReporter;
