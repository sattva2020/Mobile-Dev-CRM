import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

/**
 * 🚀 Global Setup for CRM Tests
 * Глобальная настройка для тестов CRM системы
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Setup for CRM Tests');
  
  try {
    // 1. Проверка доступности CRM системы
    await checkCRMSystem();
    
    // 2. Настройка тестовых данных
    await setupTestData();
    
    // 3. Настройка AI сервисов
    await setupAIServices();
    
    // 4. Настройка базы данных
    await setupDatabase();
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

/**
 * Проверка доступности CRM системы
 */
async function checkCRMSystem() {
  console.log('🔍 Checking CRM system availability...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Проверка доступности основного приложения
    await page.goto('http://localhost:3000', { timeout: 30000 });
    await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 10000 });
    
    // Проверка API endpoints
    const response = await page.request.get('/api/health');
    if (response.status() !== 200) {
      throw new Error('API health check failed');
    }
    
    console.log('✅ CRM system is available');
    
  } catch (error) {
    console.error('❌ CRM system is not available:', error);
    throw new Error('CRM system is not running. Please start the system first.');
  } finally {
    await browser.close();
  }
}

/**
 * Настройка тестовых данных
 */
async function setupTestData() {
  console.log('📊 Setting up test data...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Переход на страницу администрирования
    await page.goto('http://localhost:3000/admin');
    
    // Создание тестовых пользователей
    await createTestUsers(page);
    
    // Создание тестовых проектов
    await createTestProjects(page);
    
    // Создание тестовых задач
    await createTestTasks(page);
    
    console.log('✅ Test data setup completed');
    
  } catch (error) {
    console.error('❌ Test data setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Создание тестовых пользователей
 */
async function createTestUsers(page: any) {
  console.log('👥 Creating test users...');
  
  const users = [
    { username: 'testuser', password: 'testpass', role: 'user' },
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'guest', password: 'guest123', role: 'guest' }
  ];
  
  for (const user of users) {
    try {
      await page.goto('/admin/users');
      await page.getByRole('button', { name: 'New User' }).click();
      await page.getByLabel('Username').fill(user.username);
      await page.getByLabel('Password').fill(user.password);
      await page.getByRole('combobox', { name: 'Role' }).selectOption(user.role);
      await page.getByRole('button', { name: 'Save User' }).click();
      
      console.log(`   ✅ Created user: ${user.username}`);
    } catch (error) {
      console.log(`   ⚠️ User ${user.username} might already exist`);
    }
  }
}

/**
 * Создание тестовых проектов
 */
async function createTestProjects(page: any) {
  console.log('📁 Creating test projects...');
  
  const projects = [
    { name: 'Test Project 1', description: 'Test project 1', priority: 'high' },
    { name: 'Test Project 2', description: 'Test project 2', priority: 'medium' },
    { name: 'AI Integration Project', description: 'AI integration project', priority: 'critical' }
  ];
  
  for (const project of projects) {
    try {
      await page.goto('/projects');
      await page.getByRole('button', { name: 'New Project' }).click();
      await page.getByLabel('Project Name').fill(project.name);
      await page.getByLabel('Description').fill(project.description);
      await page.getByRole('combobox', { name: 'Priority' }).selectOption(project.priority);
      await page.getByRole('button', { name: 'Save Project' }).click();
      
      console.log(`   ✅ Created project: ${project.name}`);
    } catch (error) {
      console.log(`   ⚠️ Project ${project.name} might already exist`);
    }
  }
}

/**
 * Создание тестовых задач
 */
async function createTestTasks(page: any) {
  console.log('📋 Creating test tasks...');
  
  const tasks = [
    { title: 'Test Task 1', description: 'Test task 1', priority: 'high' },
    { title: 'Test Task 2', description: 'Test task 2', priority: 'medium' },
    { title: 'AI Model Training', description: 'AI model training task', priority: 'critical' }
  ];
  
  for (const task of tasks) {
    try {
      await page.goto('/tasks');
      await page.getByRole('button', { name: 'New Task' }).click();
      await page.getByLabel('Task Title').fill(task.title);
      await page.getByLabel('Description').fill(task.description);
      await page.getByRole('combobox', { name: 'Priority' }).selectOption(task.priority);
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      console.log(`   ✅ Created task: ${task.title}`);
    } catch (error) {
      console.log(`   ⚠️ Task ${task.title} might already exist`);
    }
  }
}

/**
 * Настройка AI сервисов
 */
async function setupAIServices() {
  console.log('🤖 Setting up AI services...');
  
  try {
    // Проверка доступности AI сервисов
    const aiServices = [
      { name: 'OpenRouter', url: 'http://localhost:3000/api/ai/openrouter' },
      { name: 'LM Studio', url: 'http://localhost:3000/api/ai/lmstudio' },
      { name: 'xAI', url: 'http://localhost:3000/api/ai/xai' }
    ];
    
    for (const service of aiServices) {
      try {
        const response = await fetch(service.url);
        if (response.ok) {
          console.log(`   ✅ ${service.name} is available`);
        } else {
          console.log(`   ⚠️ ${service.name} is not available (${response.status})`);
        }
      } catch (error) {
        console.log(`   ⚠️ ${service.name} is not available: ${error.message}`);
      }
    }
    
    console.log('✅ AI services setup completed');
    
  } catch (error) {
    console.error('❌ AI services setup failed:', error);
    // Не прерываем выполнение, так как AI сервисы не критичны
  }
}

/**
 * Настройка базы данных
 */
async function setupDatabase() {
  console.log('🗄️ Setting up database...');
  
  try {
    // Выполнение миграций базы данных
    execSync('npm run db:migrate', { stdio: 'inherit' });
    
    // Создание тестовых данных в базе
    execSync('npm run db:seed', { stdio: 'inherit' });
    
    console.log('✅ Database setup completed');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

export default globalSetup;