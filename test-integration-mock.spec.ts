import { test, expect } from '@playwright/test';

test.describe('Integration Tests (Mock)', () => {
  test('User authentication flow', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Integration Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .auth-form { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
            .dashboard { display: none; }
            .dashboard.active { display: block; }
            .user-info { background: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
            .logout-btn { background: #dc3545; }
          </style>
        </head>
        <body>
          <div id="auth-form" class="auth-form">
            <h2>Вход в систему</h2>
            <form onsubmit="handleLogin(event)">
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" required>
              </div>
              <div class="form-group">
                <label for="password">Пароль:</label>
                <input type="password" id="password" required>
              </div>
              <button type="submit">Войти</button>
            </form>
          </div>
          
          <div id="dashboard" class="dashboard">
            <div class="user-info">
              <h3>Добро пожаловать, <span id="user-name"></span>!</h3>
              <p>Email: <span id="user-email"></span></p>
            </div>
            <h2>Дашборд CRM</h2>
            <p>Вы успешно вошли в систему.</p>
            <button class="logout-btn" onclick="handleLogout()">Выйти</button>
          </div>
          
          <script>
            function handleLogin(event) {
              event.preventDefault();
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
              
              // Симуляция проверки учетных данных
              if (email === 'admin@crm.com' && password === 'password123') {
                // Сохраняем данные пользователя
                localStorage.setItem('user', JSON.stringify({
                  name: 'Администратор',
                  email: email
                }));
                
                // Переключаем на дашборд
                document.getElementById('auth-form').style.display = 'none';
                document.getElementById('dashboard').classList.add('active');
                document.getElementById('user-name').textContent = 'Администратор';
                document.getElementById('user-email').textContent = email;
              } else {
                alert('Неверные учетные данные');
              }
            }
            
            function handleLogout() {
              localStorage.removeItem('user');
              document.getElementById('auth-form').style.display = 'block';
              document.getElementById('dashboard').classList.remove('active');
              document.getElementById('email').value = '';
              document.getElementById('password').value = '';
            }
            
            // Проверяем, есть ли сохраненный пользователь
            window.addEventListener('load', () => {
              const user = localStorage.getItem('user');
              if (user) {
                const userData = JSON.parse(user);
                document.getElementById('auth-form').style.display = 'none';
                document.getElementById('dashboard').classList.add('active');
                document.getElementById('user-name').textContent = userData.name;
                document.getElementById('user-email').textContent = userData.email;
              }
            });
          </script>
        </body>
      </html>
    `);

    // Тест входа в систему
    await page.fill('#email', 'admin@crm.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    // Проверяем, что пользователь вошел
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('#user-name')).toHaveText('Администратор');
    await expect(page.locator('#user-email')).toHaveText('admin@crm.com');
    
    // Тест выхода из системы
    await page.click('.logout-btn');
    await expect(page.locator('#auth-form')).toBeVisible();
    await expect(page.locator('#dashboard')).not.toBeVisible();
  });

  test('Task management integration', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>Task Management</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .task-form { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; }
            .task-list { margin-top: 20px; }
            .task-item { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 10px; }
            .task-title { font-weight: bold; margin-bottom: 5px; }
            .task-status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-todo { background: #e9ecef; color: #495057; }
            .status-in-progress { background: #fff3cd; color: #856404; }
            .status-done { background: #d4edda; color: #155724; }
            .task-actions { margin-top: 10px; }
            .btn-sm { padding: 5px 10px; font-size: 12px; }
            .btn-success { background: #28a745; }
            .btn-warning { background: #ffc107; color: #212529; }
            .btn-danger { background: #dc3545; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Управление задачами</h1>
            
            <div class="task-form">
              <h3>Добавить задачу</h3>
              <form onsubmit="addTask(event)">
                <div class="form-group">
                  <label for="task-title">Название:</label>
                  <input type="text" id="task-title" required>
                </div>
                <div class="form-group">
                  <label for="task-description">Описание:</label>
                  <textarea id="task-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label for="task-priority">Приоритет:</label>
                  <select id="task-priority">
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
                <button type="submit">Добавить задачу</button>
              </form>
            </div>
            
            <div class="task-list" id="task-list">
              <!-- Задачи будут добавлены здесь -->
            </div>
          </div>
          
          <script>
            let tasks = [];
            let taskId = 1;
            
            function addTask(event) {
              event.preventDefault();
              const title = document.getElementById('task-title').value;
              const description = document.getElementById('task-description').value;
              const priority = document.getElementById('task-priority').value;
              
              const task = {
                id: taskId++,
                title: title,
                description: description,
                priority: priority,
                status: 'todo',
                createdAt: new Date().toLocaleString('ru-RU')
              };
              
              tasks.push(task);
              renderTasks();
              
              // Очищаем форму
              document.getElementById('task-title').value = '';
              document.getElementById('task-description').value = '';
              document.getElementById('task-priority').value = 'medium';
            }
            
            function updateTaskStatus(taskId, newStatus) {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                task.status = newStatus;
                renderTasks();
              }
            }
            
            function deleteTask(taskId) {
              tasks = tasks.filter(t => t.id !== taskId);
              renderTasks();
            }
            
            function renderTasks() {
              const taskList = document.getElementById('task-list');
              taskList.innerHTML = '';
              
              tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.innerHTML = \`
                  <div class="task-title">\${task.title}</div>
                  <div>\${task.description}</div>
                  <div>Приоритет: \${task.priority}</div>
                  <div>Создано: \${task.createdAt}</div>
                  <span class="task-status status-\${task.status}">
                    \${task.status === 'todo' ? 'К выполнению' : 
                      task.status === 'in-progress' ? 'В работе' : 'Завершено'}
                  </span>
                  <div class="task-actions">
                    \${task.status === 'todo' ? 
                      '<button class="btn-sm btn-warning" onclick="updateTaskStatus(' + task.id + ', \\'in-progress\\')">В работу</button>' : ''}
                    \${task.status === 'in-progress' ? 
                      '<button class="btn-sm btn-success" onclick="updateTaskStatus(' + task.id + ', \\'done\\')">Завершить</button>' : ''}
                    <button class="btn-sm btn-danger" onclick="deleteTask(' + task.id + ')">Удалить</button>
                  </div>
                \`;
                taskList.appendChild(taskElement);
              });
            }
          </script>
        </body>
      </html>
    `);

    // Добавляем задачу
    await page.fill('#task-title', 'Тестовая задача');
    await page.fill('#task-description', 'Описание тестовой задачи');
    await page.selectOption('#task-priority', 'high');
    await page.click('button[type="submit"]');
    
    // Проверяем, что задача добавилась
    await expect(page.locator('.task-item')).toHaveCount(1);
    await expect(page.locator('.task-title')).toHaveText('Тестовая задача');
    await expect(page.locator('.task-status')).toHaveText('К выполнению');
    
    // Переводим задачу в работу
    await page.click('button:has-text("В работу")');
    await expect(page.locator('.task-status')).toHaveText('В работе');
    
    // Завершаем задачу
    await page.click('button:has-text("Завершить")');
    await expect(page.locator('.task-status')).toHaveText('Завершено');
    
    // Удаляем задачу
    await page.click('button:has-text("Удалить")');
    await expect(page.locator('.task-item')).toHaveCount(0);
  });

  test('Data persistence integration', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>Data Persistence</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; }
            .data-display { background: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 20px; }
            .clear-btn { background: #dc3545; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Тест сохранения данных</h1>
            
            <div class="form-group">
              <label for="data-input">Введите данные:</label>
              <textarea id="data-input" rows="4" placeholder="Введите любые данные для сохранения..."></textarea>
            </div>
            
            <button onclick="saveData()">Сохранить</button>
            <button onclick="loadData()">Загрузить</button>
            <button class="clear-btn" onclick="clearData()">Очистить</button>
            
            <div class="data-display" id="data-display">
              <h3>Сохраненные данные:</h3>
              <div id="saved-data">Нет данных</div>
            </div>
          </div>
          
          <script>
            function saveData() {
              const data = document.getElementById('data-input').value;
              if (data.trim()) {
                localStorage.setItem('test-data', data);
                alert('Данные сохранены!');
                loadData();
              } else {
                alert('Введите данные для сохранения');
              }
            }
            
            function loadData() {
              const savedData = localStorage.getItem('test-data');
              const display = document.getElementById('saved-data');
              
              if (savedData) {
                display.textContent = savedData;
                display.style.color = '#28a745';
              } else {
                display.textContent = 'Нет сохраненных данных';
                display.style.color = '#6c757d';
              }
            }
            
            function clearData() {
              localStorage.removeItem('test-data');
              document.getElementById('data-input').value = '';
              loadData();
              alert('Данные очищены!');
            }
            
            // Загружаем данные при загрузке страницы
            window.addEventListener('load', loadData);
          </script>
        </body>
      </html>
    `);

    // Сохраняем данные
    await page.fill('#data-input', 'Тестовые данные для сохранения');
    await page.click('button:has-text("Сохранить")');
    
    // Проверяем, что данные сохранились
    await expect(page.locator('#saved-data')).toHaveText('Тестовые данные для сохранения');
    
    // Перезагружаем страницу для проверки персистентности
    await page.reload();
    await expect(page.locator('#saved-data')).toHaveText('Тестовые данные для сохранения');
    
    // Очищаем данные
    await page.click('button:has-text("Очистить")');
    await expect(page.locator('#saved-data')).toHaveText('Нет сохраненных данных');
  });

  test('API integration simulation', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>API Integration</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .api-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; margin-bottom: 10px; }
            .response { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-top: 15px; }
            .loading { color: #007bff; }
            .success { color: #28a745; }
            .error { color: #dc3545; }
            .user-list { margin-top: 15px; }
            .user-item { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 10px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Симуляция API интеграции</h1>
            
            <div class="api-section">
              <h3>Получить пользователей</h3>
              <button onclick="fetchUsers()">Загрузить пользователей</button>
              <div id="users-response" class="response" style="display: none;">
                <div id="users-content"></div>
              </div>
            </div>
            
            <div class="api-section">
              <h3>Создать пользователя</h3>
              <button onclick="createUser()">Создать тестового пользователя</button>
              <div id="create-response" class="response" style="display: none;">
                <div id="create-content"></div>
              </div>
            </div>
            
            <div class="api-section">
              <h3>Статистика API</h3>
              <button onclick="getStats()">Получить статистику</button>
              <div id="stats-response" class="response" style="display: none;">
                <div id="stats-content"></div>
              </div>
            </div>
          </div>
          
          <script>
            // Симуляция API задержки
            function delay(ms) {
              return new Promise(resolve => setTimeout(resolve, ms));
            }
            
            // Симуляция получения пользователей
            async function fetchUsers() {
              const responseDiv = document.getElementById('users-response');
              const contentDiv = document.getElementById('users-content');
              
              responseDiv.style.display = 'block';
              contentDiv.innerHTML = '<div class="loading">Загрузка пользователей...</div>';
              
              await delay(1000); // Симуляция сетевой задержки
              
              const users = [
                { id: 1, name: 'Иван Петров', email: 'ivan@example.com', role: 'admin' },
                { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', role: 'user' },
                { id: 3, name: 'Алексей Козлов', email: 'alex@example.com', role: 'manager' }
              ];
              
              contentDiv.innerHTML = \`
                <div class="success">✓ Пользователи загружены успешно</div>
                <div class="user-list">
                  \${users.map(user => \`
                    <div class="user-item">
                      <strong>\${user.name}</strong><br>
                      Email: \${user.email}<br>
                      Роль: \${user.role}
                    </div>
                  \`).join('')}
                </div>
              \`;
            }
            
            // Симуляция создания пользователя
            async function createUser() {
              const responseDiv = document.getElementById('create-response');
              const contentDiv = document.getElementById('create-content');
              
              responseDiv.style.display = 'block';
              contentDiv.innerHTML = '<div class="loading">Создание пользователя...</div>';
              
              await delay(800);
              
              const newUser = {
                id: Math.floor(Math.random() * 1000),
                name: 'Новый пользователь',
                email: 'newuser@example.com',
                role: 'user'
              };
              
              contentDiv.innerHTML = \`
                <div class="success">✓ Пользователь создан успешно</div>
                <div class="user-item">
                  <strong>\${newUser.name}</strong><br>
                  Email: \${newUser.email}<br>
                  Роль: \${newUser.role}<br>
                  ID: \${newUser.id}
                </div>
              \`;
            }
            
            // Симуляция получения статистики
            async function getStats() {
              const responseDiv = document.getElementById('stats-response');
              const contentDiv = document.getElementById('stats-content');
              
              responseDiv.style.display = 'block';
              contentDiv.innerHTML = '<div class="loading">Загрузка статистики...</div>';
              
              await delay(600);
              
              const stats = {
                totalUsers: Math.floor(Math.random() * 100) + 50,
                activeUsers: Math.floor(Math.random() * 50) + 20,
                apiCalls: Math.floor(Math.random() * 1000) + 500,
                responseTime: (Math.random() * 200 + 50).toFixed(2)
              };
              
              contentDiv.innerHTML = \`
                <div class="success">✓ Статистика загружена</div>
                <div>
                  <strong>Общее количество пользователей:</strong> \${stats.totalUsers}<br>
                  <strong>Активные пользователи:</strong> \${stats.activeUsers}<br>
                  <strong>API вызовов:</strong> \${stats.apiCalls}<br>
                  <strong>Среднее время ответа:</strong> \${stats.responseTime}мс
                </div>
              \`;
            }
          </script>
        </body>
      </html>
    `);

    // Тестируем получение пользователей
    await page.click('button:has-text("Загрузить пользователей")');
    await expect(page.locator('#users-response')).toBeVisible();
    await expect(page.locator('#users-content')).toContainText('Пользователи загружены успешно');
    await expect(page.locator('.user-item')).toHaveCount(3);
    
    // Тестируем создание пользователя
    await page.click('button:has-text("Создать тестового пользователя")');
    await expect(page.locator('#create-response')).toBeVisible();
    await expect(page.locator('#create-content')).toContainText('Пользователь создан успешно');
    
    // Тестируем получение статистики
    await page.click('button:has-text("Получить статистику")');
    await expect(page.locator('#stats-response')).toBeVisible();
    await expect(page.locator('#stats-content')).toContainText('Статистика загружена');
  });
});
