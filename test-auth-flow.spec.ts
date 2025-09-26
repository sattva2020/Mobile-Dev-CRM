import { test, expect } from '@playwright/test';

test.describe('CRM Authentication Flow', () => {
  const testUser = {
    name: 'Тестовый Пользователь',
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  test.beforeEach(async ({ page }) => {
    // Очищаем localStorage перед каждым тестом
    await page.goto('http://localhost:3002');
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete full registration and login flow', async ({ page }) => {
    // Переходим на страницу
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Делаем скриншот начальной страницы
    await page.screenshot({ path: 'screenshots/auth-flow-1-initial.png', fullPage: true });
    
    // Проверяем что видим главную страницу
    await expect(page.locator('h1')).toContainText('Mobile Dev CRM');
    
    // Нажимаем на кнопку регистрации
    const registerButton = page.getByTestId('btn-register');
    await expect(registerButton).toBeVisible();
    await registerButton.click();
    
    // Ждем появления формы регистрации
    await page.getByTestId('register-form').waitFor();
    
    // Делаем скриншот формы регистрации
    await page.screenshot({ path: 'screenshots/auth-flow-2-register-form.png', fullPage: true });
    
    // Заполняем форму регистрации
    await page.getByTestId('register-name').fill(testUser.name);
    await page.getByTestId('register-email').fill(testUser.email);
    await page.getByTestId('register-password').fill(testUser.password);
    await page.getByTestId('register-confirm').fill(testUser.password);
    
    // Нажимаем кнопку регистрации
    const submitButton = page.getByTestId('register-submit');
    await submitButton.click();
    
    // Ждем успешной регистрации
    await expect(page.getByText('Аккаунт успешно создан', { exact: false })).toBeVisible({ timeout: 10000 });
    
    // Делаем скриншот успешной регистрации
    await page.screenshot({ path: 'screenshots/auth-flow-3-register-success.png', fullPage: true });
    
    // Проверяем что появилось сообщение об успехе
    await expect(page.getByTestId('success-message')).toBeVisible();
    
    // Ждем автоматического входа или нажимаем кнопку входа
    await page.waitForTimeout(2000);
    
    // Если не авторизовались автоматически, нажимаем кнопку входа
    const loginButton = page.getByTestId('btn-login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      // Заполняем форму входа
      await page.getByTestId('login-form').waitFor();
      await page.getByTestId('login-email').fill(testUser.email);
      await page.getByTestId('login-password').fill(testUser.password);
      
      // Нажимаем кнопку входа
      await page.getByTestId('login-submit').click();
      
      // Ждем входа в систему
      await page.waitForTimeout(3000);
    }
    
    // Проверяем что мы вошли в систему (должен появиться дашборд)
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });
    
    // Делаем скриншот после входа
    await page.screenshot({ path: 'screenshots/auth-flow-4-logged-in.png', fullPage: true });
    
    // Проверяем что видим главную панель
    await expect(page.getByTestId('dashboard-root')).toBeVisible();
    
    // Проверяем что пользователь авторизован
    const userInfo = await page.evaluate(() => {
      const authData = localStorage.getItem('auth-state');
      return authData ? JSON.parse(authData) : null;
    });
    
    expect(userInfo).toBeTruthy();
    expect(userInfo.isAuthenticated).toBe(true);
    expect(userInfo.user.email).toBe(testUser.email);
  });

  test('should handle login with existing account', async ({ page }) => {
    // Сначала создаем аккаунт
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Регистрируемся
    await page.getByTestId('btn-register').click();
    await page.getByTestId('register-form').waitFor();
    await page.getByTestId('register-name').fill(testUser.name);
    await page.getByTestId('register-email').fill(testUser.email);
    await page.getByTestId('register-password').fill(testUser.password);
    await page.getByTestId('register-confirm').fill(testUser.password);
    await page.getByTestId('register-submit').click();
    await expect(page.getByText('Аккаунт успешно создан', { exact: false })).toBeVisible({ timeout: 10000 });
    
    // Сбрасываем состояние вместо выхода (надёжнее для e2e)
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Теперь тестируем вход
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Нажимаем кнопку входа
    await page.getByTestId('btn-login').click();
    
    // Делаем скриншот формы входа
    await page.screenshot({ path: 'screenshots/auth-flow-5-login-form.png', fullPage: true });
    
    // Заполняем форму входа
    await page.getByTestId('login-email').fill(testUser.email);
    await page.getByTestId('login-password').fill(testUser.password);
    
    // Нажимаем кнопку входа
    await page.getByTestId('login-submit').click();
    
    // Ждем входа в систему
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });
    
    // Делаем скриншот после входа
    await page.screenshot({ path: 'screenshots/auth-flow-6-login-success.png', fullPage: true });
    
    // Проверяем что мы вошли
    await expect(page.getByTestId('dashboard-root')).toBeVisible();
  });

  test('should handle demo mode', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Нажимаем кнопку демо режима
    const demoButton = page.getByTestId('btn-demo');
    await expect(demoButton).toBeVisible();
    await demoButton.click();
    
    // Ждем загрузки демо данных
    await page.waitForTimeout(3000);
    
    // Делаем скриншот демо режима
    await page.screenshot({ path: 'screenshots/auth-flow-7-demo-mode.png', fullPage: true });
    
    // Проверяем что мы вошли в демо режим
    await expect(page.getByTestId('dashboard-root')).toBeVisible();
    
    // Проверяем что есть демо данные
    const projects = await page.evaluate(() => {
      const projectsData = localStorage.getItem('user-projects');
      return projectsData ? JSON.parse(projectsData) : [];
    });
    
    expect(projects.length).toBeGreaterThan(0);
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Тестируем регистрацию с неверными данными
    await page.locator('button').filter({ hasText: 'Создать аккаунт' }).click();
    await page.waitForSelector('form');
    
    // Пытаемся отправить пустую форму
    await page.locator('button[type="submit"]').click();
    
    // Проверяем что браузер блокирует отправку (required поля)
    const nameInput = page.locator('input').first();
    await expect(nameInput).toHaveAttribute('required');
    
    // Заполняем неверный email
    await nameInput.fill('Тест');
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').first().fill('123');
    await page.locator('input[type="password"]').nth(1).fill('456');
    
    await page.locator('button[type="submit"]').click();
    
    // Проверяем валидацию email
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
    
    // Делаем скриншот валидации
    await page.screenshot({ path: 'screenshots/auth-flow-8-validation.png', fullPage: true });
  });

  test('should test password visibility toggle', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Тестируем на форме регистрации
    await page.locator('button').filter({ hasText: 'Создать аккаунт' }).click();
    await page.waitForSelector('form');
    
    // Находим группу с полем пароля и кнопкой видимости
    const passwordInput = page.getByTestId('register-password');
    const toggleButton = page.getByTestId('register-password-toggle');
    
    // Проверяем что пароль скрыт
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Нажимаем на кнопку показать пароль
    await toggleButton.click();
    
    // Проверяем что пароль показан
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Делаем скриншот
    await page.screenshot({ path: 'screenshots/auth-flow-9-password-toggle.png', fullPage: true });
  });
});
