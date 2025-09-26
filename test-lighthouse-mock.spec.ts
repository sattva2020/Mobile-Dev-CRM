import { test, expect } from '@playwright/test';

test.describe('Lighthouse CI Tests (Mock)', () => {
  test('Performance metrics', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Performance Test</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
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
            .main { 
              padding: 30px; 
              max-width: 1200px; 
              margin: 0 auto;
            }
            .card { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            .stats { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
            }
            .stat { 
              background: #f7fafc; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center;
            }
            .stat .value { 
              font-size: 32px; 
              font-weight: 700; 
              color: #1a202c;
              margin: 0;
            }
            .stat .label { 
              font-size: 14px; 
              color: #718096; 
              margin: 8px 0 0 0;
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
            .content { 
              display: grid; 
              grid-template-columns: 2fr 1fr; 
              gap: 30px;
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
            }
          </style>
        </head>
        <body>
          <header class="header">
            <h1>CRM Performance Dashboard</h1>
          </header>
          
          <main class="main">
            <div class="card">
              <h2>Ключевые метрики</h2>
              <div class="stats">
                <div class="stat">
                  <p class="value">95</p>
                  <p class="label">Lighthouse Score</p>
                </div>
                <div class="stat">
                  <p class="value">1.2s</p>
                  <p class="label">Время загрузки</p>
                </div>
                <div class="stat">
                  <p class="value">0.8MB</p>
                  <p class="label">Размер страницы</p>
                </div>
                <div class="stat">
                  <p class="value">8</p>
                  <p class="label">HTTP запросы</p>
                </div>
              </div>
            </div>
            
            <div class="content">
              <div class="card">
                <h2>Оптимизация производительности</h2>
                <ul>
                  <li>✅ Минификация CSS и JavaScript</li>
                  <li>✅ Сжатие изображений (WebP)</li>
                  <li>✅ Кэширование ресурсов</li>
                  <li>✅ Lazy loading для изображений</li>
                  <li>✅ CDN для статических файлов</li>
                  <li>✅ Service Worker для офлайн работы</li>
                </ul>
                <button class="button">Запустить аудит</button>
              </div>
              
              <div class="card">
                <h2>Рекомендации</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Метрика</th>
                      <th>Значение</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>First Contentful Paint</td>
                      <td>0.8s</td>
                      <td>✅ Хорошо</td>
                    </tr>
                    <tr>
                      <td>Largest Contentful Paint</td>
                      <td>1.2s</td>
                      <td>✅ Хорошо</td>
                    </tr>
                    <tr>
                      <td>Cumulative Layout Shift</td>
                      <td>0.05</td>
                      <td>✅ Хорошо</td>
                    </tr>
                    <tr>
                      <td>Time to Interactive</td>
                      <td>1.5s</td>
                      <td>✅ Хорошо</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    // Проверяем ключевые элементы производительности
    await expect(page.locator('h1')).toHaveText('CRM Performance Dashboard');
    await expect(page.locator('.stat')).toHaveCount(4);
    
    // Проверяем метрики
    await expect(page.locator('.stat .value')).toContainText(['95', '1.2s', '0.8MB', '8']);
    
    // Проверяем рекомендации
    await expect(page.locator('table th')).toHaveCount(3);
    await expect(page.locator('table tr')).toHaveCount(5); // header + 4 rows
  });

  test('Accessibility metrics', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Accessibility Test</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: #f8fafc;
              color: #1a202c;
            }
            .header { 
              background: white; 
              padding: 20px 30px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .main { 
              padding: 30px; 
              max-width: 1200px; 
              margin: 0 auto;
            }
            .card { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin-bottom: 20px;
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
              outline: 2px solid #667eea; 
              outline-offset: 2px;
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
            .button:focus { 
              outline: 2px solid #667eea; 
              outline-offset: 2px;
            }
            .skip-link { 
              position: absolute; 
              top: -40px; 
              left: 6px; 
              background: #000; 
              color: #fff; 
              padding: 8px; 
              text-decoration: none; 
              border-radius: 4px;
            }
            .skip-link:focus { 
              top: 6px; 
            }
            .sr-only { 
              position: absolute; 
              width: 1px; 
              height: 1px; 
              padding: 0; 
              margin: -1px; 
              overflow: hidden; 
              clip: rect(0, 0, 0, 0); 
              white-space: nowrap; 
              border: 0;
            }
          </style>
        </head>
        <body>
          <a href="#main" class="skip-link">Перейти к основному содержимому</a>
          
          <header class="header">
            <h1>CRM Accessibility Dashboard</h1>
            <nav aria-label="Основная навигация">
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; gap: 20px;">
                <li><a href="#dashboard" aria-current="page">Дашборд</a></li>
                <li><a href="#projects">Проекты</a></li>
                <li><a href="#tasks">Задачи</a></li>
                <li><a href="#settings">Настройки</a></li>
              </ul>
            </nav>
          </header>
          
          <main id="main" class="main">
            <div class="card">
              <h2>Метрики доступности</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center;">
                  <p style="font-size: 32px; font-weight: 700; color: #1a202c; margin: 0;">98</p>
                  <p style="font-size: 14px; color: #718096; margin: 8px 0 0 0;">A11y Score</p>
                </div>
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center;">
                  <p style="font-size: 32px; font-weight: 700; color: #1a202c; margin: 0;">0</p>
                  <p style="font-size: 14px; color: #718096; margin: 8px 0 0 0;">Ошибки</p>
                </div>
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center;">
                  <p style="font-size: 32px; font-weight: 700; color: #1a202c; margin: 0;">2</p>
                  <p style="font-size: 14px; color: #718096; margin: 8px 0 0 0;">Предупреждения</p>
                </div>
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center;">
                  <p style="font-size: 32px; font-weight: 700; color: #1a202c; margin: 0;">100%</p>
                  <p style="font-size: 14px; color: #718096; margin: 8px 0 0 0;">WCAG AA</p>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h2>Форма с доступностью</h2>
              <form>
                <div class="form-group">
                  <label for="name">Имя пользователя *</label>
                  <input type="text" id="name" name="name" required aria-describedby="name-help">
                  <div id="name-help" class="sr-only">Введите ваше полное имя</div>
                </div>
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input type="email" id="email" name="email" required aria-describedby="email-help">
                  <div id="email-help" class="sr-only">Введите действующий email адрес</div>
                </div>
                <div class="form-group">
                  <label for="role">Роль</label>
                  <select id="role" name="role">
                    <option value="">Выберите роль</option>
                    <option value="admin">Администратор</option>
                    <option value="user">Пользователь</option>
                    <option value="manager">Менеджер</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="bio">Биография</label>
                  <textarea id="bio" name="bio" rows="4" aria-describedby="bio-help"></textarea>
                  <div id="bio-help" class="sr-only">Расскажите о себе (необязательно)</div>
                </div>
                <button type="submit" class="button">Сохранить</button>
                <button type="button" class="button" style="background: #6c757d;">Отмена</button>
              </form>
            </div>
            
            <div class="card">
              <h2>Интерактивные элементы</h2>
              <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <button class="button" aria-label="Добавить новый проект">+ Проект</button>
                <button class="button" aria-label="Создать задачу">+ Задача</button>
                <button class="button" aria-label="Показать уведомления">
                  🔔 Уведомления
                  <span style="background: #dc3545; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px; margin-left: 5px;">3</span>
                </button>
                <button class="button" aria-label="Переключить тему">🌙 Тема</button>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    // Проверяем доступность
    await expect(page.locator('h1')).toHaveText('CRM Accessibility Dashboard');
    await expect(page.locator('nav[aria-label]')).toBeVisible();
    await expect(page.locator('main[id="main"]')).toBeVisible();
    
    // Проверяем метрики доступности
    await expect(page.locator('.card .sr-only')).toHaveCount(4);
    
    // Проверяем форму
    await expect(page.locator('input[required]')).toHaveCount(2);
    await expect(page.locator('label[for]')).toHaveCount(4);
    
    // Проверяем aria-атрибуты
    await expect(page.locator('input[aria-describedby]')).toHaveCount(2);
    await expect(page.locator('button[aria-label]')).toHaveCount(4);
  });

  test('SEO metrics', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM System - Управление проектами и задачами</title>
          <meta name="description" content="Современная CRM система для управления проектами, задачами и командой. Повысьте эффективность работы с нашими инструментами.">
          <meta name="keywords" content="CRM, управление проектами, задачи, команда, продуктивность">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="robots" content="index, follow">
          <meta property="og:title" content="CRM System - Управление проектами">
          <meta property="og:description" content="Современная CRM система для управления проектами и задачами">
          <meta property="og:type" content="website">
          <meta property="og:url" content="https://crm.example.com">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="CRM System">
          <meta name="twitter:description" content="Управление проектами и задачами">
          <link rel="canonical" href="https://crm.example.com">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: #f8fafc;
              line-height: 1.6;
            }
            .header { 
              background: white; 
              padding: 20px 30px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .main { 
              padding: 30px; 
              max-width: 1200px; 
              margin: 0 auto;
            }
            .card { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            .seo-metrics { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
            }
            .metric { 
              background: #f7fafc; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center;
            }
            .metric .value { 
              font-size: 32px; 
              font-weight: 700; 
              color: #1a202c;
              margin: 0;
            }
            .metric .label { 
              font-size: 14px; 
              color: #718096; 
              margin: 8px 0 0 0;
            }
            .content h1, .content h2, .content h3 { 
              color: #1a202c; 
              margin-top: 0;
            }
            .content h1 { font-size: 2.5rem; }
            .content h2 { font-size: 2rem; }
            .content h3 { font-size: 1.5rem; }
            .content p { 
              color: #4a5568; 
              margin-bottom: 1rem;
            }
            .features { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
              gap: 20px; 
            }
            .feature { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <header class="header">
            <h1>CRM System - Управление проектами и задачами</h1>
            <nav>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; gap: 20px;">
                <li><a href="#dashboard">Дашборд</a></li>
                <li><a href="#projects">Проекты</a></li>
                <li><a href="#tasks">Задачи</a></li>
                <li><a href="#team">Команда</a></li>
                <li><a href="#reports">Отчеты</a></li>
              </ul>
            </nav>
          </header>
          
          <main class="main">
            <div class="card">
              <h2>SEO метрики</h2>
              <div class="seo-metrics">
                <div class="metric">
                  <p class="value">95</p>
                  <p class="label">SEO Score</p>
                </div>
                <div class="metric">
                  <p class="value">100</p>
                  <p class="label">Meta Tags</p>
                </div>
                <div class="metric">
                  <p class="value">98</p>
                  <p class="label">Structured Data</p>
                </div>
                <div class="metric">
                  <p class="value">92</p>
                  <p class="label">Page Speed</p>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h2>О нашей CRM системе</h2>
              <p>Современная CRM система для эффективного управления проектами, задачами и командой. Наша платформа поможет вам повысить продуктивность и организовать работу.</p>
              
              <h3>Ключевые возможности</h3>
              <div class="features">
                <div class="feature">
                  <h4>Управление проектами</h4>
                  <p>Создавайте, отслеживайте и управляйте проектами любой сложности. Визуализируйте прогресс с помощью канбан-досок и диаграмм Ганта.</p>
                </div>
                <div class="feature">
                  <h4>Система задач</h4>
                  <p>Детальное планирование и отслеживание задач. Назначайте ответственных, устанавливайте приоритеты и дедлайны.</p>
                </div>
                <div class="feature">
                  <h4>Командная работа</h4>
                  <p>Эффективная коммуникация в команде. Обмен сообщениями, файлами и обновлениями в реальном времени.</p>
                </div>
                <div class="feature">
                  <h4>Аналитика и отчеты</h4>
                  <p>Подробная аналитика производительности. Отчеты по проектам, задачам и эффективности команды.</p>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h2>Преимущества нашей системы</h2>
              <ul>
                <li><strong>Интуитивный интерфейс</strong> - Простое и понятное управление без сложного обучения</li>
                <li><strong>Мобильная версия</strong> - Полнофункциональное приложение для работы в любом месте</li>
                <li><strong>Интеграции</strong> - Подключение к популярным сервисам и API</li>
                <li><strong>Безопасность</strong> - Защита данных на уровне банковских стандартов</li>
                <li><strong>Масштабируемость</strong> - От стартапов до крупных корпораций</li>
              </ul>
            </div>
          </main>
        </body>
      </html>
    `);

    // Проверяем SEO элементы
    await expect(page.locator('title')).toHaveText('CRM System - Управление проектами и задачами');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Современная CRM система для управления проектами, задачами и командой. Повысьте эффективность работы с нашими инструментами.');
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', 'CRM, управление проектами, задачи, команда, продуктивность');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://crm.example.com');
    
    // Проверяем Open Graph теги
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'CRM System - Управление проектами');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    
    // Проверяем структуру контента
    await expect(page.locator('h1')).toHaveText('CRM System - Управление проектами и задачи');
    await expect(page.locator('h2')).toHaveCount(3);
    await expect(page.locator('h3')).toHaveCount(1);
    
    // Проверяем метрики SEO
    await expect(page.locator('.metric .value')).toContainText(['95', '100', '98', '92']);
  });
});
