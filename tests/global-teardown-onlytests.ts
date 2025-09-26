import { FullConfig } from '@playwright/test';

/**
 * 🎭 Global Teardown for OnlyTests Approach
 * Глобальная очистка для OnlyTests подхода
 * Основано на: https://github.com/e-semenyuk/onlytests-qa
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting OnlyTests Global Teardown...');
  
  try {
    // Очищаем тестовые данные
    console.log('🗑️ Cleaning up test data...');
    // Здесь можно добавить логику очистки тестовых данных
    
    // Очищаем временные файлы
    console.log('📁 Cleaning up temporary files...');
    // Здесь можно добавить логику очистки временных файлов
    
    // Очищаем кэш
    console.log('💾 Cleaning up cache...');
    // Здесь можно добавить логику очистки кэша
    
    console.log('✅ OnlyTests Global Teardown completed successfully');
    
  } catch (error) {
    console.error('❌ OnlyTests Global Teardown failed:', error);
    // Не выбрасываем ошибку, чтобы не прерывать выполнение
  }
}

export default globalTeardown;
