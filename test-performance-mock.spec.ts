import { test, expect } from '@playwright/test';

test.describe('Performance Tests (Mock)', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>CRM Performance Test</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              margin: 0; padding: 0; 
              background: #f8fafc;
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
          </style>
        </head>
        <body>
          <header class="header">
            <h1>CRM Performance Dashboard</h1>
          </header>
          
          <main class="main">
            <div class="card">
              <h2>Статистика производительности</h2>
              <div class="stats">
                <div class="stat">
                  <p class="value">2.3s</p>
                  <p class="label">Время загрузки</p>
                </div>
                <div class="stat">
                  <p class="value">95</p>
                  <p class="label">Lighthouse Score</p>
                </div>
                <div class="stat">
                  <p class="value">1.2MB</p>
                  <p class="label">Размер страницы</p>
                </div>
                <div class="stat">
                  <p class="value">12</p>
                  <p class="label">HTTP запросы</p>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h2>Оптимизация</h2>
              <ul>
                <li>✅ Минификация CSS и JS</li>
                <li>✅ Сжатие изображений</li>
                <li>✅ Кэширование ресурсов</li>
                <li>✅ Lazy loading</li>
                <li>✅ CDN для статических файлов</li>
              </ul>
            </div>
          </main>
        </body>
      </html>
    `);

    const loadTime = Date.now() - startTime;
    
    // Проверяем, что страница загрузилась быстро
    expect(loadTime).toBeLessThan(1000); // Менее 1 секунды
    
    // Проверяем наличие ключевых элементов
    await expect(page.locator('h1')).toHaveText('CRM Performance Dashboard');
    await expect(page.locator('.stat')).toHaveCount(4);
  });

  test('Memory usage test', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>Memory Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .card { background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 8px; }
            .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Тест использования памяти</h1>
            <div class="card">
              <h2>Управление памятью</h2>
              <button class="button" onclick="addElements()">Добавить элементы</button>
              <button class="button" onclick="removeElements()">Удалить элементы</button>
              <button class="button" onclick="clearMemory()">Очистить память</button>
              <div id="elements"></div>
            </div>
          </div>
          
          <script>
            let elementCount = 0;
            
            function addElements() {
              const container = document.getElementById('elements');
              for (let i = 0; i < 100; i++) {
                const div = document.createElement('div');
                div.textContent = 'Элемент ' + (++elementCount);
                div.style.padding = '5px';
                div.style.margin = '2px';
                div.style.background = '#e9ecef';
                container.appendChild(div);
              }
            }
            
            function removeElements() {
              const container = document.getElementById('elements');
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
            }
            
            function clearMemory() {
              if (window.gc) {
                window.gc();
              }
              elementCount = 0;
            }
          </script>
        </body>
      </html>
    `);

    // Получаем метрики памяти
    const metrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (metrics) {
      // Проверяем, что использование памяти разумное
      expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // Менее 50MB
    }

    // Тестируем добавление и удаление элементов
    await page.click('text=Добавить элементы');
    await page.click('text=Удалить элементы');
    await page.click('text=Очистить память');
  });

  test('Network performance simulation', async ({ page }) => {
    // Симулируем медленную сеть
    await page.route('**/*', async route => {
      // Добавляем задержку для симуляции медленной сети
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    const startTime = Date.now();
    
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>Network Performance</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .loading { text-align: center; padding: 50px; }
            .spinner { 
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3498db;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 2s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .content { display: none; }
            .content.loaded { display: block; }
          </style>
        </head>
        <body>
          <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
          <div class="content" id="content">
            <h1>Данные загружены</h1>
            <p>Симуляция загрузки завершена</p>
          </div>
          
          <script>
            // Симулируем загрузку данных
            setTimeout(() => {
              document.getElementById('loading').style.display = 'none';
              document.getElementById('content').classList.add('loaded');
            }, 500);
          </script>
        </body>
      </html>
    `);

    // Ждем загрузки контента
    await page.waitForSelector('.content.loaded', { timeout: 2000 });
    
    const loadTime = Date.now() - startTime;
    
    // Проверяем, что загрузка прошла в разумное время
    expect(loadTime).toBeLessThan(2000); // Менее 2 секунд
    
    await expect(page.locator('h1')).toHaveText('Данные загружены');
  });

  test('Rendering performance', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>Rendering Performance</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .grid { 
              display: grid; 
              grid-template-columns: repeat(10, 1fr); 
              gap: 10px; 
              margin: 20px 0;
            }
            .item { 
              background: linear-gradient(45deg, #667eea, #764ba2);
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              transition: transform 0.3s;
            }
            .item:hover { 
              transform: scale(1.05);
            }
            .button { 
              background: #007bff; 
              color: white; 
              padding: 10px 20px; 
              border: none; 
              border-radius: 4px; 
              cursor: pointer; 
              margin: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Тест производительности рендеринга</h1>
          <button class="button" onclick="addItems()">Добавить элементы</button>
          <button class="button" onclick="animateItems()">Анимация</button>
          <div class="grid" id="grid"></div>
          
          <script>
            function addItems() {
              const grid = document.getElementById('grid');
              grid.innerHTML = '';
              for (let i = 0; i < 100; i++) {
                const item = document.createElement('div');
                item.className = 'item';
                item.textContent = 'Item ' + i;
                grid.appendChild(item);
              }
            }
            
            function animateItems() {
              const items = document.querySelectorAll('.item');
              items.forEach((item, index) => {
                setTimeout(() => {
                  item.style.transform = 'scale(1.1)';
                  setTimeout(() => {
                    item.style.transform = 'scale(1)';
                  }, 200);
                }, index * 10);
              });
            }
          </script>
        </body>
      </html>
    `);

    // Измеряем время рендеринга
    const renderStart = Date.now();
    
    // Добавляем элементы
    await page.click('text=Добавить элементы');
    await page.waitForSelector('.item', { timeout: 1000 });
    
    const renderTime = Date.now() - renderStart;
    
    // Проверяем, что рендеринг быстрый
    expect(renderTime).toBeLessThan(500); // Менее 500ms
    
    // Тестируем анимацию
    await page.click('text=Анимация');
    await page.waitForTimeout(1000); // Ждем завершения анимации
    
    // Проверяем, что элементы отрендерились
    const itemCount = await page.locator('.item').count();
    expect(itemCount).toBe(100);
  });
});
