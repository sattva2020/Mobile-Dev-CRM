import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests (Mock)', () => {
  test('Auth page visual regression', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Auth</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .auth-container { 
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              width: 100%;
              max-width: 400px;
            }
            .logo { 
              text-align: center; 
              margin-bottom: 30px;
            }
            .logo h1 { 
              color: #333; 
              margin: 0; 
              font-size: 28px;
              font-weight: 700;
            }
            .form-group { 
              margin-bottom: 20px; 
            }
            label { 
              display: block; 
              margin-bottom: 8px; 
              font-weight: 600; 
              color: #333;
            }
            input { 
              width: 100%; 
              padding: 12px 16px; 
              border: 2px solid #e1e5e9; 
              border-radius: 8px; 
              box-sizing: border-box;
              font-size: 16px;
              transition: border-color 0.3s;
            }
            input:focus { 
              outline: none; 
              border-color: #667eea; 
            }
            button { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 14px 24px; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              width: 100%; 
              font-size: 16px;
              font-weight: 600;
              transition: transform 0.2s;
            }
            button:hover { 
              transform: translateY(-2px);
            }
            .links { 
              text-align: center; 
              margin-top: 20px; 
            }
            .links a { 
              color: #667eea; 
              text-decoration: none; 
              font-weight: 500;
            }
            .links a:hover { 
              text-decoration: underline; 
            }
          </style>
        </head>
        <body>
          <div class="auth-container">
            <div class="logo">
              <h1>CRM System</h1>
            </div>
            <form>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required>
              </div>
              <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
              </div>
              <button type="submit">Войти</button>
            </form>
            <div class="links">
              <a href="#">Забыли пароль?</a> • 
              <a href="#">Регистрация</a>
            </div>
          </div>
        </body>
      </html>
    `);

    // Скрываем анимации для стабильности скриншотов
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('auth-page.png');
  });

  test('Dashboard visual regression', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Dashboard</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: #f8fafc;
              min-height: 100vh;
            }
            .header { 
              background: white; 
              padding: 20px 30px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo { 
              font-size: 24px; 
              font-weight: 700; 
              color: #1a202c;
            }
            .nav { 
              display: flex; 
              gap: 30px; 
            }
            .nav a { 
              text-decoration: none; 
              color: #4a5568; 
              font-weight: 500;
              padding: 8px 16px;
              border-radius: 6px;
              transition: all 0.2s;
            }
            .nav a:hover { 
              background: #edf2f7; 
              color: #2d3748;
            }
            .nav a.active { 
              background: #667eea; 
              color: white;
            }
            .main { 
              padding: 30px; 
              max-width: 1200px; 
              margin: 0 auto;
            }
            .stats { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
              gap: 20px; 
              margin-bottom: 30px;
            }
            .stat-card { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border-left: 4px solid #667eea;
            }
            .stat-card h3 { 
              margin: 0 0 8px 0; 
              color: #2d3748; 
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .stat-card .value { 
              font-size: 32px; 
              font-weight: 700; 
              color: #1a202c;
              margin: 0;
            }
            .content { 
              display: grid; 
              grid-template-columns: 2fr 1fr; 
              gap: 30px;
            }
            .card { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .card h2 { 
              margin: 0 0 20px 0; 
              color: #2d3748; 
              font-size: 20px;
              font-weight: 600;
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            .table th, .table td { 
              padding: 12px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0;
            }
            .table th { 
              background: #f7fafc; 
              font-weight: 600; 
              color: #4a5568;
              font-size: 14px;
            }
            .table td { 
              color: #2d3748;
            }
            .status { 
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: 600;
            }
            .status.active { 
              background: #c6f6d5; 
              color: #22543d;
            }
            .status.completed { 
              background: #bee3f8; 
              color: #2a4365;
            }
            .button { 
              background: #667eea; 
              color: white; 
              padding: 8px 16px; 
              border: none; 
              border-radius: 6px; 
              cursor: pointer; 
              font-size: 14px;
              font-weight: 500;
            }
            .button:hover { 
              background: #5a67d8;
            }
          </style>
        </head>
        <body>
          <header class="header">
            <div class="logo">CRM System</div>
            <nav class="nav">
              <a href="#" class="active">Дашборд</a>
              <a href="#">Проекты</a>
              <a href="#">Задачи</a>
              <a href="#">Настройки</a>
            </nav>
          </header>
          
          <main class="main">
            <div class="stats">
              <div class="stat-card">
                <h3>Всего проектов</h3>
                <p class="value">24</p>
              </div>
              <div class="stat-card">
                <h3>Активные задачи</h3>
                <p class="value">156</p>
              </div>
              <div class="stat-card">
                <h3>Завершено</h3>
                <p class="value">89</p>
              </div>
              <div class="stat-card">
                <h3>Прогресс</h3>
                <p class="value">73%</p>
              </div>
            </div>
            
            <div class="content">
              <div class="card">
                <h2>Последние задачи</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Статус</th>
                      <th>Приоритет</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Разработка API</td>
                      <td><span class="status active">В работе</span></td>
                      <td>Высокий</td>
                      <td><button class="button">Редактировать</button></td>
                    </tr>
                    <tr>
                      <td>Тестирование</td>
                      <td><span class="status completed">Завершено</span></td>
                      <td>Средний</td>
                      <td><button class="button">Просмотр</button></td>
                    </tr>
                    <tr>
                      <td>Документация</td>
                      <td><span class="status active">В работе</span></td>
                      <td>Низкий</td>
                      <td><button class="button">Редактировать</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="card">
                <h2>Быстрые действия</h2>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <button class="button">Создать проект</button>
                  <button class="button">Добавить задачу</button>
                  <button class="button">Просмотреть отчеты</button>
                  <button class="button">Настройки</button>
                </div>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    // Скрываем анимации для стабильности скриншотов
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('Settings page visual regression', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Settings</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: #f8fafc;
              min-height: 100vh;
            }
            .header { 
              background: white; 
              padding: 20px 30px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header h1 { 
              margin: 0; 
              color: #1a202c; 
              font-size: 28px;
              font-weight: 700;
            }
            .main { 
              padding: 30px; 
              max-width: 800px; 
              margin: 0 auto;
            }
            .card { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            .card h2 { 
              margin: 0 0 20px 0; 
              color: #2d3748; 
              font-size: 20px;
              font-weight: 600;
            }
            .form-group { 
              margin-bottom: 20px; 
            }
            label { 
              display: block; 
              margin-bottom: 8px; 
              font-weight: 600; 
              color: #2d3748;
            }
            input, select, textarea { 
              width: 100%; 
              padding: 12px 16px; 
              border: 2px solid #e2e8f0; 
              border-radius: 8px; 
              box-sizing: border-box;
              font-size: 16px;
            }
            input:focus, select:focus, textarea:focus { 
              outline: none; 
              border-color: #667eea; 
            }
            .toggle { 
              display: flex; 
              align-items: center; 
              gap: 12px;
            }
            .toggle input[type="checkbox"] { 
              width: auto; 
              margin: 0;
            }
            .button { 
              background: #667eea; 
              color: white; 
              padding: 12px 24px; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 16px;
              font-weight: 600;
              margin-right: 12px;
            }
            .button:hover { 
              background: #5a67d8;
            }
            .button.secondary { 
              background: #e2e8f0; 
              color: #4a5568;
            }
            .button.secondary:hover { 
              background: #cbd5e0;
            }
          </style>
        </head>
        <body>
          <header class="header">
            <h1>Настройки</h1>
          </header>
          
          <main class="main">
            <div class="card">
              <h2>Общие настройки</h2>
              <div class="form-group">
                <label for="company">Название компании</label>
                <input type="text" id="company" value="Моя компания">
              </div>
              <div class="form-group">
                <label for="email">Email для уведомлений</label>
                <input type="email" id="email" value="admin@company.com">
              </div>
              <div class="form-group">
                <label for="timezone">Часовой пояс</label>
                <select id="timezone">
                  <option value="UTC+3">Москва (UTC+3)</option>
                  <option value="UTC+0">Лондон (UTC+0)</option>
                  <option value="UTC-5">Нью-Йорк (UTC-5)</option>
                </select>
              </div>
            </div>
            
            <div class="card">
              <h2>Уведомления</h2>
              <div class="form-group">
                <div class="toggle">
                  <input type="checkbox" id="email-notifications" checked>
                  <label for="email-notifications">Email уведомления</label>
                </div>
              </div>
              <div class="form-group">
                <div class="toggle">
                  <input type="checkbox" id="sms-notifications">
                  <label for="sms-notifications">SMS уведомления</label>
                </div>
              </div>
              <div class="form-group">
                <div class="toggle">
                  <input type="checkbox" id="desktop-notifications" checked>
                  <label for="desktop-notifications">Desktop уведомления</label>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h2>Безопасность</h2>
              <div class="form-group">
                <label for="current-password">Текущий пароль</label>
                <input type="password" id="current-password" placeholder="••••••••">
              </div>
              <div class="form-group">
                <label for="new-password">Новый пароль</label>
                <input type="password" id="new-password" placeholder="••••••••">
              </div>
              <div class="form-group">
                <label for="confirm-password">Подтвердите пароль</label>
                <input type="password" id="confirm-password" placeholder="••••••••">
              </div>
            </div>
            
            <div style="margin-top: 30px;">
              <button class="button">Сохранить изменения</button>
              <button class="button secondary">Отмена</button>
            </div>
          </main>
        </body>
      </html>
    `);

    // Скрываем анимации для стабильности скриншотов
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('settings.png');
  });

  test('Mobile responsive design', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Mobile</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: #f8fafc;
            }
            .header { 
              background: white; 
              padding: 16px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo { 
              font-size: 20px; 
              font-weight: 700; 
              color: #1a202c;
            }
            .menu-button { 
              background: none; 
              border: none; 
              font-size: 24px; 
              cursor: pointer;
            }
            .main { 
              padding: 16px; 
            }
            .card { 
              background: white; 
              padding: 20px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin-bottom: 16px;
            }
            .card h2 { 
              margin: 0 0 16px 0; 
              color: #2d3748; 
              font-size: 18px;
              font-weight: 600;
            }
            .stats { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 12px; 
              margin-bottom: 20px;
            }
            .stat { 
              background: #f7fafc; 
              padding: 16px; 
              border-radius: 8px; 
              text-align: center;
            }
            .stat .value { 
              font-size: 24px; 
              font-weight: 700; 
              color: #1a202c;
              margin: 0;
            }
            .stat .label { 
              font-size: 12px; 
              color: #718096; 
              margin: 4px 0 0 0;
            }
            .button { 
              background: #667eea; 
              color: white; 
              padding: 12px 20px; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              width: 100%;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .button:hover { 
              background: #5a67d8;
            }
          </style>
        </head>
        <body>
          <header class="header">
            <div class="logo">CRM</div>
            <button class="menu-button">☰</button>
          </header>
          
          <main class="main">
            <div class="card">
              <h2>Статистика</h2>
              <div class="stats">
                <div class="stat">
                  <p class="value">24</p>
                  <p class="label">Проекты</p>
                </div>
                <div class="stat">
                  <p class="value">156</p>
                  <p class="label">Задачи</p>
                </div>
                <div class="stat">
                  <p class="value">89</p>
                  <p class="label">Завершено</p>
                </div>
                <div class="stat">
                  <p class="value">73%</p>
                  <p class="label">Прогресс</p>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h2>Быстрые действия</h2>
              <button class="button">Создать проект</button>
              <button class="button">Добавить задачу</button>
              <button class="button">Просмотреть отчеты</button>
            </div>
          </main>
        </body>
      </html>
    `);

    // Устанавливаем мобильный размер экрана
    await page.setViewportSize({ width: 375, height: 667 });

    // Скрываем анимации для стабильности скриншотов
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('mobile-dashboard.png');
  });
});
