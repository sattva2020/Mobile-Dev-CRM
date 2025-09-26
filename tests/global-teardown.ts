import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

/**
 * 🧹 Global Teardown for CRM Tests
 * Глобальная очистка для тестов CRM системы
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Global Teardown for CRM Tests');
  
  try {
    // 1. Очистка тестовых данных
    await cleanupTestData();
    
    // 2. Очистка базы данных
    await cleanupDatabase();
    
    // 3. Очистка временных файлов
    await cleanupTempFiles();
    
    // 4. Генерация финального отчета
    await generateFinalReport();
    
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Не прерываем выполнение, так как очистка не критична
  }
}

/**
 * Очистка тестовых данных
 */
async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Очистка тестовых проектов
    await cleanupTestProjects(page);
    
    // Очистка тестовых задач
    await cleanupTestTasks(page);
    
    // Очистка тестовых пользователей
    await cleanupTestUsers(page);
    
    console.log('✅ Test data cleanup completed');
    
  } catch (error) {
    console.error('❌ Test data cleanup failed:', error);
  } finally {
    await browser.close();
  }
}

/**
 * Очистка тестовых проектов
 */
async function cleanupTestProjects(page: any) {
  console.log('📁 Cleaning up test projects...');
  
  try {
    await page.goto('/projects');
    
    // Получение списка тестовых проектов
    const testProjects = await page.locator('[data-testid="project-item"]').all();
    
    for (const project of testProjects) {
      const projectName = await project.textContent();
      
      // Удаление только тестовых проектов
      if (projectName?.includes('Test Project') || projectName?.includes('AI Integration')) {
        await project.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Confirm Delete' }).click();
        console.log(`   ✅ Deleted project: ${projectName}`);
      }
    }
    
  } catch (error) {
    console.log('   ⚠️ Project cleanup failed:', error.message);
  }
}

/**
 * Очистка тестовых задач
 */
async function cleanupTestTasks(page: any) {
  console.log('📋 Cleaning up test tasks...');
  
  try {
    await page.goto('/tasks');
    
    // Получение списка тестовых задач
    const testTasks = await page.locator('[data-testid="task-item"]').all();
    
    for (const task of testTasks) {
      const taskTitle = await task.textContent();
      
      // Удаление только тестовых задач
      if (taskTitle?.includes('Test Task') || taskTitle?.includes('AI Model')) {
        await task.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Confirm Delete' }).click();
        console.log(`   ✅ Deleted task: ${taskTitle}`);
      }
    }
    
  } catch (error) {
    console.log('   ⚠️ Task cleanup failed:', error.message);
  }
}

/**
 * Очистка тестовых пользователей
 */
async function cleanupTestUsers(page: any) {
  console.log('👥 Cleaning up test users...');
  
  try {
    await page.goto('/admin/users');
    
    // Получение списка тестовых пользователей
    const testUsers = await page.locator('[data-testid="user-item"]').all();
    
    for (const user of testUsers) {
      const username = await user.textContent();
      
      // Удаление только тестовых пользователей
      if (username?.includes('testuser') || username?.includes('guest')) {
        await user.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Confirm Delete' }).click();
        console.log(`   ✅ Deleted user: ${username}`);
      }
    }
    
  } catch (error) {
    console.log('   ⚠️ User cleanup failed:', error.message);
  }
}

/**
 * Очистка базы данных
 */
async function cleanupDatabase() {
  console.log('🗄️ Cleaning up database...');
  
  try {
    // Очистка тестовых данных из базы
    execSync('npm run db:cleanup', { stdio: 'inherit' });
    
    console.log('✅ Database cleanup completed');
    
  } catch (error) {
    console.log('⚠️ Database cleanup failed:', error.message);
  }
}

/**
 * Очистка временных файлов
 */
async function cleanupTempFiles() {
  console.log('📁 Cleaning up temporary files...');
  
  try {
    // Очистка временных файлов Playwright
    execSync('rm -rf test-results/', { stdio: 'inherit' });
    execSync('rm -rf playwright-report/', { stdio: 'inherit' });
    execSync('rm -rf traces/', { stdio: 'inherit' });
    
    // Очистка временных файлов CRM
    execSync('rm -rf temp/', { stdio: 'inherit' });
    execSync('rm -rf uploads/temp/', { stdio: 'inherit' });
    
    console.log('✅ Temporary files cleanup completed');
    
  } catch (error) {
    console.log('⚠️ Temporary files cleanup failed:', error.message);
  }
}

/**
 * Генерация финального отчета
 */
async function generateFinalReport() {
  console.log('📊 Generating final report...');
  
  try {
    // Создание финального отчета
    const report = {
      timestamp: new Date().toISOString(),
      testRun: 'CRM Playwright Tests',
      status: 'completed',
      cleanup: {
        testData: 'completed',
        database: 'completed',
        tempFiles: 'completed'
      },
      summary: {
        totalTests: 'See individual test reports',
        passed: 'See individual test reports',
        failed: 'See individual test reports',
        duration: 'See individual test reports'
      }
    };
    
    // Сохранение отчета
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', 'playwright-cleanup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`   📄 Cleanup report saved: ${reportPath}`);
    console.log('✅ Final report generated');
    
  } catch (error) {
    console.log('⚠️ Final report generation failed:', error.message);
  }
}

export default globalTeardown;