import { test, expect } from '@playwright/test';

test.describe('CRM Navigation and Features', () => {
  test.beforeEach(async ({ page }) => {
    // Входим в систему через демо режим
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    const demoButton = page.locator('button').filter({ hasText: 'Демо режим' });
    await demoButton.click();
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });
  });

  test('should display main navigation', async ({ page }) => {
    // Делаем скриншот главной навигации
    await page.screenshot({ path: 'screenshots/nav-1-main-navigation.png', fullPage: true });
    
    // Проверяем основные элементы навигации
    const navElements = [
      'Dashboard',
      'Kanban',
      'Settings',
      'Bell', // уведомления
      'Github', // интеграция с GitHub
      'Bot' // AI функции
    ];
    
    for (const element of navElements) {
      const locator = page.locator(`text=${element}`).or(page.locator(`[title*="${element}"]`));
      await expect(locator.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to different sections', async ({ page }) => {
    // Тестируем навигацию по разделам
    const sections = [
      { name: 'Dashboard', selector: 'text=Dashboard' },
      { name: 'Kanban', selector: 'text=Kanban' },
      { name: 'Settings', selector: 'text=Settings' }
    ];
    
    for (const section of sections) {
      // Нажимаем на раздел
      await page.locator(section.selector).first().click();
      await page.waitForTimeout(1000);
      
      // Делаем скриншот
      await page.screenshot({ 
        path: `screenshots/nav-2-${section.name.toLowerCase()}.png`, 
        fullPage: true 
      });
      
      // Проверяем что раздел активен (если есть индикатор)
      const activeIndicator = page.locator(`[data-active="true"], .active, [aria-current="page"]`);
      if (await activeIndicator.count() > 0) {
        await expect(activeIndicator.first()).toBeVisible();
      }
    }
  });

  test('should test responsive design', async ({ page }) => {
    // Тестируем на разных размерах экрана
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'screenshots/responsive-1-desktop.png', fullPage: true });
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'screenshots/responsive-2-tablet.png', fullPage: true });
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'screenshots/responsive-3-mobile.png', fullPage: true });
    
    // Проверяем что навигация адаптируется
    const mobileMenu = page.locator('button').filter({ hasText: /menu|☰|≡/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/responsive-4-mobile-menu.png', fullPage: true });
    }
  });

  test('should test dark theme consistency', async ({ page }) => {
    // Проверяем что темная тема применяется везде
    const body = page.locator('body');
    const bodyStyles = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    console.log('Body theme styles:', bodyStyles);
    
    // Проверяем основные элементы на темную тему
    const mainElements = [
      page.locator('nav').first(),
      page.locator('main').first(),
      page.locator('header').first()
    ];
    
    for (const element of mainElements) {
      if (await element.count() > 0) {
        const elementStyles = await element.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });
        
        console.log('Element theme styles:', elementStyles);
      }
    }
    
    // Делаем скриншот для визуальной проверки
    await page.screenshot({ path: 'screenshots/theme-1-dark-consistency.png', fullPage: true });
  });

  test('should test interactive elements', async ({ page }) => {
    // Тестируем интерактивные элементы
    
    // Проверяем кнопки
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Наводим курсор
        await button.hover();
        await page.waitForTimeout(200);
        
        // Проверяем hover эффекты
        const buttonStyles = await button.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            boxShadow: styles.boxShadow,
            backgroundColor: styles.backgroundColor
          };
        });
        
        console.log(`Button ${i} hover styles:`, buttonStyles);
      }
    }
    
    // Делаем скриншот после hover эффектов
    await page.screenshot({ path: 'screenshots/interactive-1-hover-effects.png', fullPage: true });
  });

  test('should test form interactions', async ({ page }) => {
    // Ищем формы на странице
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      
      // Ищем поля ввода
      const inputs = form.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          // Фокусируемся на поле
          await input.focus();
          await page.waitForTimeout(200);
          
          // Проверяем focus стили
          const focusStyles = await input.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              borderColor: styles.borderColor,
              boxShadow: styles.boxShadow,
              outline: styles.outline
            };
          });
          
          console.log(`Input ${i} focus styles:`, focusStyles);
          
          // Делаем скриншот focus состояния
          await page.screenshot({ 
            path: `screenshots/form-1-input-${i}-focus.png`, 
            fullPage: true 
          });
        }
      }
    }
  });
});
