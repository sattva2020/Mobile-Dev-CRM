# 🎭 Playwright MCP Команды для CRM

## 🚀 **Готовые команды для тестирования**

### **1. Базовое тестирование CRM**

```bash
# Открыть CRM и проверить загрузку
use playwright mcp to open http://localhost:3001
and verify that the CRM dashboard loads correctly
with all main sections visible:
- Dashboard
- Tasks
- Projects
- GitHub Integration
- AI Analytics
```

### **2. Тестирование управления задачами**

```bash
# Создание и управление задачами
use playwright mcp to test task management:
- Navigate to Tasks section
- Create a new task with title "Playwright Test Task"
- Set priority to "high"
- Set category to "testing"
- Assign to "Test User"
- Add labels: ["playwright", "test", "automation"]
- Set estimated hours to 2
- Save the task
- Verify task appears in the task list
- Update task status to "in-progress"
- Verify status change is reflected
```

### **3. Тестирование проектов**

```bash
# Управление проектами
use playwright mcp to test project management:
- Navigate to Projects section
- Create a new project named "Playwright Test Project"
- Set description to "Project for testing Playwright MCP"
- Set status to "active"
- Save the project
- Verify project appears in the list
- Add tasks to the project
- Verify project metrics update
```

### **4. Тестирование GitHub интеграции**

```bash
# GitHub интеграция
use playwright mcp to test GitHub integration:
- Navigate to GitHub Integration section
- Enter repository: "sattva2020/Ai-fitness-Coach-360"
- Click "Load Issues" button
- Verify GitHub issues are loaded
- Check that issues are displayed with correct information
- Test filtering by status and labels
```

### **5. Тестирование AI аналитики**

```bash
# AI функции
use playwright mcp to test AI analytics:
- Navigate to AI Analytics section
- Click "Analyze Project" button
- Wait for AI response
- Verify AI insights are displayed
- Check that recommendations are shown
- Test "Generate Report" functionality
- Verify report is generated and displayed
```

### **6. Тестирование responsive дизайна**

```bash
# Адаптивный дизайн
use playwright mcp to test responsive design:
- Test on desktop viewport (1920x1080)
- Test on tablet viewport (768x1024)
- Test on mobile viewport (375x667)
- Verify all elements are visible and functional
- Check navigation works on all screen sizes
- Test form interactions on mobile
```

### **7. Тестирование производительности**

```bash
# Производительность
use playwright mcp to test performance:
- Measure page load times
- Test API response times
- Check for memory leaks
- Verify smooth animations
- Test with multiple concurrent users
- Monitor resource usage
```

### **8. Тестирование безопасности**

```bash
# Безопасность
use playwright mcp to test security:
- Test input validation on all forms
- Check for XSS vulnerabilities
- Verify CSRF protection
- Test authentication flows
- Check for sensitive data exposure
- Verify HTTPS enforcement
```

### **9. Exploratory тестирование**

```bash
# Исследовательское тестирование
use playwright mcp to perform exploratory testing:
- Explore all sections of the CRM
- Test edge cases and error conditions
- Try to break the application
- Find usability issues
- Test with invalid data
- Check error handling
```

### **10. Создание новых тестов**

```bash
# Автоматическое создание тестов
use playwright mcp to create comprehensive test suite:
- Analyze the CRM application structure
- Create page objects for all components
- Write test cases for all functionality
- Add utility functions for common operations
- Ensure tests follow best practices
- Create data-driven tests
- Add performance tests
- Include accessibility tests
```

## 🎯 **Специальные команды для нашего CRM**

### **Тестирование с реальными данными:**
```bash
use playwright mcp to test with real data:
- Load actual GitHub issues from our repository
- Create realistic project scenarios
- Test with various task priorities and categories
- Verify AI analytics with real project data
- Test all CRUD operations with realistic data
```

### **Интеграционное тестирование:**
```bash
use playwright mcp to test full integration:
- Start with empty CRM
- Create a project
- Add multiple tasks
- Connect GitHub repository
- Run AI analysis
- Generate reports
- Verify all data persists
- Test complete workflow
```

### **Нагрузочное тестирование:**
```bash
use playwright mcp to test under load:
- Create multiple projects simultaneously
- Add many tasks quickly
- Test API rate limits
- Monitor performance degradation
- Check for memory leaks
- Verify system stability
```

## 📊 **Ожидаемые результаты**

### **Успешные тесты:**
- ✅ Все основные функции работают
- ✅ Производительность соответствует требованиям
- ✅ UI/UX работает корректно
- ✅ Интеграции функционируют
- ✅ AI функции отвечают

### **Метрики качества:**
- **Время загрузки:** < 3 секунд
- **API ответ:** < 200ms
- **AI ответ:** < 10 секунд
- **Покрытие тестами:** 100%
- **Успешность:** 100%

## 🚀 **Запуск тестов**

### **Быстрый старт:**
```bash
# Запуск всех тестов
npx playwright test

# Запуск конкретных тестов
npx playwright test tests/api-only.spec.ts

# Запуск с отчетом
npx playwright test --reporter=html
```

### **С Playwright MCP:**
```bash
# Используйте команды выше в чате с Playwright MCP
# Агент автоматически выполнит все тесты
# И создаст отчеты о результатах
```

## 🎉 **Заключение**

Наша CRM система полностью готова для тестирования с Playwright MCP! Все команды протестированы и работают корректно.

**🚀 Система готова к автоматизированному тестированию!**
