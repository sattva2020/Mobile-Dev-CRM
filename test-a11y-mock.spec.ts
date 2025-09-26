import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function checkA11y(page: any, name: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations, `${name} a11y violations`).toEqual([]);
}

test.describe('Accessibility Tests (Mock)', () => {
  test('Auth page accessibility', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Auth</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .auth-container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
            button:hover { background: #0056b3; }
            .error { color: red; font-size: 14px; margin-top: 5px; }
            .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
          </style>
        </head>
        <body>
          <div class="auth-container">
            <h1>Вход в CRM</h1>
            <form>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required aria-describedby="email-error">
                <div id="email-error" class="error" role="alert" aria-live="polite"></div>
              </div>
              <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" name="password" required aria-describedby="password-error">
                <div id="password-error" class="error" role="alert" aria-live="polite"></div>
              </div>
              <button type="submit" aria-label="Войти в систему">Войти</button>
            </form>
            <p>
              <a href="#" aria-label="Забыли пароль?">Забыли пароль?</a>
            </p>
          </div>
        </body>
      </html>
    `);

    await checkA11y(page, 'Auth page');
  });

  test('Dashboard accessibility', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Dashboard</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .header { background: white; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .nav { display: flex; gap: 20px; }
            .nav a { text-decoration: none; color: #333; padding: 10px 15px; border-radius: 4px; }
            .nav a:hover, .nav a:focus { background: #e9ecef; }
            .nav a[aria-current="page"] { background: #007bff; color: white; }
            .main { padding: 20px; }
            .card { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .button:hover { background: #0056b3; }
            .button:focus { outline: 2px solid #0056b3; outline-offset: 2px; }
            .table { width: 100%; border-collapse: collapse; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background: #f8f9fa; font-weight: bold; }
            .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
          </style>
        </head>
        <body>
          <header class="header">
            <nav class="nav" role="navigation" aria-label="Основная навигация">
              <a href="#" aria-current="page">Дашборд</a>
              <a href="#">Проекты</a>
              <a href="#">Задачи</a>
              <a href="#">Настройки</a>
            </nav>
          </header>
          
          <main class="main">
            <h1>Дашборд CRM</h1>
            
            <div class="card">
              <h2>Статистика</h2>
              <div role="region" aria-label="Статистика проектов">
                <p>Всего проектов: <span aria-label="5 проектов">5</span></p>
                <p>Активных задач: <span aria-label="12 задач">12</span></p>
                <p>Завершено: <span aria-label="8 задач">8</span></p>
              </div>
            </div>
            
            <div class="card">
              <h2>Последние задачи</h2>
              <table class="table" role="table" aria-label="Список последних задач">
                <thead>
                  <tr>
                    <th scope="col">Название</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Приоритет</th>
                    <th scope="col">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Разработка API</td>
                    <td>В работе</td>
                    <td>Высокий</td>
                    <td>
                      <button class="button" aria-label="Редактировать задачу 'Разработка API'">Редактировать</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Тестирование</td>
                    <td>Завершено</td>
                    <td>Средний</td>
                    <td>
                      <button class="button" aria-label="Редактировать задачу 'Тестирование'">Редактировать</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="card">
              <h2>Быстрые действия</h2>
              <div role="group" aria-label="Быстрые действия">
                <button class="button" aria-label="Создать новый проект">Создать проект</button>
                <button class="button" aria-label="Добавить новую задачу">Добавить задачу</button>
                <button class="button" aria-label="Просмотреть отчеты">Отчеты</button>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    await checkA11y(page, 'Dashboard');
  });

  test('Forms accessibility', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Forms</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .form-container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            input:focus, select:focus, textarea:focus { outline: 2px solid #007bff; outline-offset: 2px; }
            button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; }
            button:hover { background: #0056b3; }
            button:focus { outline: 2px solid #0056b3; outline-offset: 2px; }
            .error { color: red; font-size: 14px; margin-top: 5px; }
            .required { color: red; }
            .help-text { font-size: 14px; color: #666; margin-top: 5px; }
            .fieldset { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
            .legend { font-weight: bold; padding: 0 10px; }
          </style>
        </head>
        <body>
          <div class="form-container">
            <h1>Настройки CRM</h1>
            
            <form>
              <div class="form-group">
                <label for="company-name">Название компании <span class="required" aria-label="обязательное поле">*</span></label>
                <input type="text" id="company-name" name="companyName" required aria-describedby="company-help">
                <div id="company-help" class="help-text">Введите полное название вашей компании</div>
              </div>
              
              <div class="form-group">
                <label for="email">Email для уведомлений</label>
                <input type="email" id="email" name="email" aria-describedby="email-help">
                <div id="email-help" class="help-text">На этот email будут приходить уведомления</div>
              </div>
              
              <fieldset class="fieldset">
                <legend class="legend">Настройки уведомлений</legend>
                
                <div class="form-group">
                  <label>
                    <input type="checkbox" name="emailNotifications" checked>
                    Email уведомления
                  </label>
                </div>
                
                <div class="form-group">
                  <label>
                    <input type="checkbox" name="smsNotifications">
                    SMS уведомления
                  </label>
                </div>
                
                <div class="form-group">
                  <label for="notification-frequency">Частота уведомлений</label>
                  <select id="notification-frequency" name="frequency">
                    <option value="immediate">Немедленно</option>
                    <option value="daily">Ежедневно</option>
                    <option value="weekly">Еженедельно</option>
                  </select>
                </div>
              </fieldset>
              
              <div class="form-group">
                <label for="description">Описание проекта</label>
                <textarea id="description" name="description" rows="4" aria-describedby="description-help"></textarea>
                <div id="description-help" class="help-text">Опишите цели и задачи вашего проекта</div>
              </div>
              
              <div class="form-group">
                <button type="submit" aria-label="Сохранить настройки">Сохранить</button>
                <button type="button" aria-label="Отменить изменения">Отмена</button>
              </div>
            </form>
          </div>
        </body>
      </html>
    `);

    await checkA11y(page, 'Forms');
  });
});
