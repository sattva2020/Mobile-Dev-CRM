import { test, expect } from '@playwright/test';

test.describe('CRM Design Testing', () => {
  test('should display modern dark design', async ({ page }) => {
    // Переходим на страницу
    await page.goto('http://localhost:3002');
    
    // Ждем загрузки страницы
    await page.waitForLoadState('networkidle');
    
    // Делаем скриншот главной страницы
    await page.screenshot({ path: 'screenshots/main-page.png', fullPage: true });
    
    // Проверяем наличие темного фона
    const body = page.locator('body');
    const bodyStyles = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage
      };
    });
    
    console.log('Body styles:', bodyStyles);
    
    // Проверяем наличие градиентного фона
    const mainContainer = page.locator('div').first();
    const containerStyles = await mainContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        background: styles.background
      };
    });
    
    console.log('Container styles:', containerStyles);
    
    // Проверяем наличие заголовка
    const title = page.locator('h1').first();
    await expect(title).toContainText('Mobile Dev CRM');
    
    // Проверяем стили заголовка
    const titleStyles = await title.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        background: styles.background
      };
    });
    
    console.log('Title styles:', titleStyles);
    
    // Проверяем наличие кнопок
    const loginButton = page.locator('button').filter({ hasText: 'Войти в систему' });
    await expect(loginButton).toBeVisible();
    
    // Проверяем стили кнопки
    const buttonStyles = await loginButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        fontSize: styles.fontSize,
        color: styles.color
      };
    });
    
    console.log('Button styles:', buttonStyles);
  });

  test('should show login form with modern styling', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Нажимаем на кнопку входа
    const loginButton = page.locator('button').filter({ hasText: 'Войти в систему' });
    await loginButton.click();
    
    // Ждем появления формы
    await page.waitForSelector('form');
    
    // Делаем скриншот формы входа
    await page.screenshot({ path: 'screenshots/login-form.png', fullPage: true });
    
    // Проверяем наличие полей формы
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Проверяем стили полей ввода
    const inputStyles = await emailInput.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        border: styles.border,
        color: styles.color
      };
    });
    
    console.log('Input styles:', inputStyles);
  });

  test('should show register form with modern styling', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Нажимаем на кнопку регистрации
    const registerButton = page.locator('button').filter({ hasText: 'Создать аккаунт' });
    await registerButton.click();
    
    // Ждем появления формы
    await page.waitForSelector('form');
    
    // Делаем скриншот формы регистрации
    await page.screenshot({ path: 'screenshots/register-form.png', fullPage: true });
    
    // Проверяем наличие полей формы
    const nameInput = page.locator('input').first();
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
  });

  test('should check CSS loading', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Проверяем загрузку CSS файлов
    const stylesheets = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        loaded: link.sheet !== null
      }));
    });
    
    console.log('Stylesheets:', stylesheets);
    
    // Проверяем наличие Tailwind классов
    const hasTailwindClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let i = 0; i < Math.min(elements.length, 100); i++) {
        const element = elements[i];
        if (element.className && typeof element.className === 'string') {
          if (element.className.includes('bg-gradient-to') || 
              element.className.includes('backdrop-blur') ||
              element.className.includes('text-white')) {
            return true;
          }
        }
      }
      return false;
    });
    
    console.log('Has Tailwind classes:', hasTailwindClasses);
    
    // Делаем скриншот для проверки
    await page.screenshot({ path: 'screenshots/css-check.png', fullPage: true });
  });
});
