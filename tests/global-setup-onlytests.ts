import { chromium, FullConfig } from '@playwright/test';

/**
 * 🎭 Global Setup for OnlyTests Approach
 * Глобальная настройка для OnlyTests подхода
 * Основано на: https://github.com/e-semenyuk/onlytests-qa
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting OnlyTests Global Setup...');
  
  // Создаем браузер для настройки
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Проверяем доступность CRM системы
    console.log('🔍 Checking CRM system availability...');
    const response = await page.goto('http://localhost:3001');
    
    if (response?.status() === 200) {
      console.log('✅ CRM system is available');
    } else {
      console.log('❌ CRM system is not available');
      throw new Error('CRM system is not available');
    }

    // Настраиваем аутентификацию (если нужно)
    console.log('🔐 Setting up authentication...');
    // Здесь можно добавить логику аутентификации
    
    // Настраиваем тестовые данные
    console.log('📊 Setting up test data...');
    // Здесь можно добавить логику создания тестовых данных
    
    console.log('✅ OnlyTests Global Setup completed successfully');
    
  } catch (error) {
    console.error('❌ OnlyTests Global Setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
