import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * 📊 CRM Custom Reporter
 * Кастомный репортер для тестов CRM системы
 */

interface CRMTestResult {
  title: string;
  status: string;
  duration: number;
  category: string;
  priority: string;
  description: string;
  steps: string[];
  expectedResult: string;
  actualResult: string;
  screenshots: string[];
  videos: string[];
  traces: string[];
}

interface CRMTestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  categories: Record<string, number>;
  priorities: Record<string, number>;
  successRate: number;
  averageDuration: number;
}

class CRMReporter implements Reporter {
  private results: CRMTestResult[] = [];
  private startTime: number = 0;
  private config: FullConfig | undefined;

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.startTime = Date.now();
    
    console.log('🚀 Starting CRM Playwright Tests');
    console.log('================================');
    console.log(`📊 Total tests: ${suite.allTests().length}`);
    console.log(`🌐 Base URL: ${config.use?.baseURL || 'http://localhost:3000'}`);
    console.log(`⚙️ Workers: ${config.workers || 'auto'}`);
    console.log(`🔄 Retries: ${config.retries || 0}`);
    console.log('');
  }

  onTestBegin(test: TestCase, result: TestResult) {
    const category = this.extractCategory(test.title);
    const priority = this.extractPriority(test.title);
    
    console.log(`🧪 Running: ${test.title}`);
    console.log(`   📂 Category: ${category}`);
    console.log(`   ⚡ Priority: ${priority}`);
    console.log(`   📍 File: ${test.location.file}:${test.location.line}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
    const duration = result.duration;
    const category = this.extractCategory(test.title);
    const priority = this.extractPriority(test.title);
    
    console.log(`   ${status} ${test.title} (${duration}ms)`);
    
    // Сохранение результата
    this.results.push({
      title: test.title,
      status: result.status,
      duration: duration,
      category: category,
      priority: priority,
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
    console.log('📊 CRM Test Results Summary');
    console.log('============================');
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏭️ Skipped: ${summary.skipped}`);
    console.log(`⏱️ Duration: ${summary.duration}ms`);
    console.log(`📈 Success Rate: ${summary.successRate}%`);
    console.log(`📊 Average Duration: ${summary.averageDuration}ms`);
    console.log('');
    
    // Категории
    console.log('📂 Results by Category:');
    Object.entries(summary.categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} tests`);
    });
    console.log('');
    
    // Приоритеты
    console.log('⚡ Results by Priority:');
    Object.entries(summary.priorities).forEach(([priority, count]) => {
      console.log(`   ${priority}: ${count} tests`);
    });
    console.log('');
    
    // Сохранение отчета
    this.saveReport(summary);
    
    // Рекомендации
    this.generateRecommendations(summary);
  }

  private extractCategory(title: string): string {
    if (title.includes('Project')) return 'Project Management';
    if (title.includes('Task')) return 'Task Management';
    if (title.includes('AI') || title.includes('ai')) return 'AI Integration';
    if (title.includes('User') || title.includes('Auth')) return 'User Management';
    if (title.includes('Mobile') || title.includes('Responsive')) return 'Responsive Design';
    if (title.includes('Accessibility') || title.includes('Keyboard')) return 'Accessibility';
    if (title.includes('Performance') || title.includes('Load')) return 'Performance';
    if (title.includes('API')) return 'API Testing';
    return 'General';
  }

  private extractPriority(title: string): string {
    if (title.includes('Critical') || title.includes('critical')) return 'Critical';
    if (title.includes('High') || title.includes('high')) return 'High';
    if (title.includes('Medium') || title.includes('medium')) return 'Medium';
    if (title.includes('Low') || title.includes('low')) return 'Low';
    return 'Medium';
  }

  private extractDescription(title: string): string {
    // Извлечение описания из названия теста
    return title.replace(/should|test|verify/gi, '').trim();
  }

  private extractSteps(title: string): string[] {
    // Базовые шаги на основе названия теста
    return [
      'Navigate to the application',
      'Perform the required action',
      'Verify the expected result'
    ];
  }

  private extractExpectedResult(title: string): string {
    // Извлечение ожидаемого результата из названия теста
    if (title.includes('create')) return 'Item should be created successfully';
    if (title.includes('delete')) return 'Item should be deleted successfully';
    if (title.includes('update')) return 'Item should be updated successfully';
    if (title.includes('display')) return 'Item should be displayed correctly';
    return 'Test should pass without errors';
  }

  private generateSummary(): CRMTestSummary {
    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    // Группировка по категориям
    const categories: Record<string, number> = {};
    this.results.forEach(result => {
      categories[result.category] = (categories[result.category] || 0) + 1;
    });
    
    // Группировка по приоритетам
    const priorities: Record<string, number> = {};
    this.results.forEach(result => {
      priorities[result.priority] = (priorities[result.priority] || 0) + 1;
    });
    
    return {
      totalTests,
      passed,
      failed,
      skipped,
      duration,
      categories,
      priorities,
      successRate: totalTests > 0 ? Math.round((passed / totalTests) * 100) : 0,
      averageDuration: totalTests > 0 ? Math.round(duration / totalTests) : 0
    };
  }

  private saveReport(summary: CRMTestSummary) {
    const report = {
      timestamp: new Date().toISOString(),
      testRun: 'CRM Playwright Tests',
      summary,
      results: this.results,
      config: {
        baseURL: this.config?.use?.baseURL,
        workers: this.config?.workers,
        retries: this.config?.retries,
        timeout: this.config?.use?.actionTimeout
      }
    };
    
    const reportPath = join(__dirname, '..', '..', 'playwright-crm-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 CRM report saved: ${reportPath}`);
  }

  private generateRecommendations(summary: CRMTestSummary) {
    console.log('💡 Recommendations:');
    
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
    console.log('🎯 Next Steps:');
    console.log('   1. Review the detailed report in playwright-crm-report.json');
    console.log('   2. Check screenshots and videos for failed tests');
    console.log('   3. Analyze traces for debugging information');
    console.log('   4. Update test data and configurations as needed');
    console.log('');
  }
}

export default CRMReporter;
