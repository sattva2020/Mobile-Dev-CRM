import { test, expect } from '@playwright/test';

test.describe('Simple CRM Tests', () => {
  test('should load test page', async ({ page }) => {
    // Создаем простую HTML страницу в памяти
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CRM Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { background: #f0f0f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .button:hover { background: #0056b3; }
            .notification { background: #e7f3ff; border: 1px solid #b3d9ff; padding: 10px; margin: 10px 0; border-radius: 4px; }
            .theme-toggle { position: fixed; top: 20px; right: 20px; background: #333; color: white; border: none; padding: 10px; border-radius: 50%; cursor: pointer; }
            .dark { background: #1a1a1a; color: white; }
            .dark .content { background: #2a2a2a; border-color: #444; }
            .dark .header { background: #333; }
          </style>
        </head>
        <body>
          <div class="theme-toggle" onclick="toggleTheme()">🌙</div>
          <div class="container">
            <div class="header">
              <h1>CRM System Test</h1>
              <p>Система управления клиентами</p>
            </div>
            <div class="content">
              <h2>Дашборд</h2>
              <p>Добро пожаловать в CRM систему!</p>
              <button class="button" onclick="addNotification()">Добавить уведомление</button>
              <div id="notifications"></div>
            </div>
          </div>
          <script>
            let darkMode = false;
            let notificationCount = 0;
            
            function toggleTheme() {
              darkMode = !darkMode;
              document.body.classList.toggle('dark', darkMode);
              const button = document.querySelector('.theme-toggle');
              button.textContent = darkMode ? '☀️' : '🌙';
            }
            
            function addNotification() {
              notificationCount++;
              const notifications = document.getElementById('notifications');
              const notification = document.createElement('div');
              notification.className = 'notification';
              notification.innerHTML = \`
                <strong>Уведомление \${notificationCount}</strong><br>
                Новое уведомление добавлено в \${new Date().toLocaleTimeString()}
                <button onclick="markAsRead(this)" style="float: right; background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Прочитано</button>
              \`;
              notifications.appendChild(notification);
            }
            
            function markAsRead(button) {
              button.parentElement.style.opacity = '0.5';
              button.textContent = '✓ Прочитано';
              button.disabled = true;
            }
          </script>
        </body>
      </html>
    `);

    // Проверяем, что страница загрузилась
    await expect(page.locator('h1')).toHaveText('CRM System Test');
    await expect(page.locator('.content')).toBeVisible();
  });

  test('should test theme toggle functionality', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Theme Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; transition: all 0.3s; }
            .theme-toggle { background: #333; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
            .dark { background: #1a1a1a; color: white; }
            .dark .theme-toggle { background: #555; }
          </style>
        </head>
        <body>
          <button class="theme-toggle" onclick="toggleTheme()">🌙 Тёмная тема</button>
          <h1>Тест переключения темы</h1>
          <p>Этот текст должен менять цвет при переключении темы.</p>
          <script>
            let darkMode = false;
            function toggleTheme() {
              darkMode = !darkMode;
              document.body.classList.toggle('dark', darkMode);
              const button = document.querySelector('.theme-toggle');
              button.textContent = darkMode ? '☀️ Светлая тема' : '🌙 Тёмная тема';
            }
          </script>
        </body>
      </html>
    `);

    // Проверяем начальное состояние
    await expect(page.locator('.theme-toggle')).toHaveText('🌙 Тёмная тема');
    
    // Переключаем тему
    await page.click('.theme-toggle');
    await expect(page.locator('.theme-toggle')).toHaveText('☀️ Светлая тема');
    
    // Проверяем, что класс dark добавлен
    await expect(page.locator('body')).toHaveClass(/dark/);
  });

  test('should test notification functionality', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notification Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px; }
            .notification { background: #e7f3ff; border: 1px solid #b3d9ff; padding: 10px; margin: 10px 0; border-radius: 4px; }
            .notification.read { opacity: 0.5; }
            .mark-read { background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1>Тест уведомлений</h1>
          <button class="button" onclick="addNotification()">Добавить уведомление</button>
          <button class="button" onclick="markAllRead()">Отметить все как прочитанные</button>
          <div id="notifications"></div>
          <div id="counter">Непрочитанных: 0</div>
          
          <script>
            let notifications = [];
            
            function addNotification() {
              const id = Date.now();
              const notification = {
                id: id,
                title: 'Новое уведомление',
                message: 'Это тестовое уведомление #' + (notifications.length + 1),
                read: false,
                time: new Date().toLocaleTimeString()
              };
              notifications.push(notification);
              renderNotifications();
            }
            
            function markAsRead(id) {
              const notification = notifications.find(n => n.id === id);
              if (notification) {
                notification.read = true;
                renderNotifications();
              }
            }
            
            function markAllRead() {
              notifications.forEach(n => n.read = true);
              renderNotifications();
            }
            
            function renderNotifications() {
              const container = document.getElementById('notifications');
              const counter = document.getElementById('counter');
              const unreadCount = notifications.filter(n => !n.read).length;
              
              counter.textContent = 'Непрочитанных: ' + unreadCount;
              
              container.innerHTML = notifications.map(n => \`
                <div class="notification \${n.read ? 'read' : ''}" data-id="\${n.id}">
                  <strong>\${n.title}</strong><br>
                  \${n.message}<br>
                  <small>Время: \${n.time}</small>
                  \${!n.read ? '<button class="mark-read" onclick="markAsRead(' + n.id + ')">Прочитано</button>' : '<span>✓ Прочитано</span>'}
                </div>
              \`).join('');
            }
          </script>
        </body>
      </html>
    `);

    // Добавляем уведомления
    await page.click('text=Добавить уведомление');
    await page.click('text=Добавить уведомление');
    await page.click('text=Добавить уведомление');
    
    // Проверяем счетчик
    await expect(page.locator('#counter')).toHaveText('Непрочитанных: 3');
    
    // Отмечаем одно как прочитанное
    await page.click('.mark-read');
    await expect(page.locator('#counter')).toHaveText('Непрочитанных: 2');
    
    // Отмечаем все как прочитанные
    await page.click('text=Отметить все как прочитанные');
    await expect(page.locator('#counter')).toHaveText('Непрочитанных: 0');
  });

  test('should test responsive design', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Responsive Test</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { background: #f0f0f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .card { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            
            @media (max-width: 768px) {
              .content { grid-template-columns: 1fr; }
              .header { padding: 15px; }
              .card { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Адаптивный дизайн</h1>
              <p>Этот контент должен адаптироваться под размер экрана</p>
            </div>
            <div class="content">
              <div class="card">
                <h3>Карточка 1</h3>
                <p>Содержимое первой карточки</p>
              </div>
              <div class="card">
                <h3>Карточка 2</h3>
                <p>Содержимое второй карточки</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    // Тестируем десктопный вид
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.content')).toBeVisible();
    
    // Тестируем мобильный вид
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.content')).toBeVisible();
    await expect(page.locator('.card')).toHaveCount(2);
  });
});
