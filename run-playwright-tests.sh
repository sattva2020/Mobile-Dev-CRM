#!/bin/bash

# 🎭 Playwright CRM Tests Runner
# Скрипт для запуска тестов Playwright для CRM системы

echo "🎭 Starting Playwright CRM Tests"
echo "================================="

# Проверка установки Playwright
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js and npm."
    exit 1
fi

# Проверка установки Playwright
if ! npx playwright --version &> /dev/null; then
    echo "📦 Installing Playwright..."
    npm install -D @playwright/test
    npx playwright install
fi

# Создание директории для отчетов
mkdir -p playwright-report
mkdir -p test-results

echo "🔧 Configuration:"
echo "   - Test Directory: ./tests"
echo "   - Config File: playwright-crm.config.ts"
echo "   - Base URL: http://localhost:3000"
echo ""

# Функция для запуска тестов
run_tests() {
    local test_type=$1
    local description=$2
    
    echo "🚀 Running $description..."
    echo "----------------------------------------"
    
    case $test_type in
        "all")
            npx playwright test --config=playwright-crm.config.ts
            ;;
        "ui")
            npx playwright test --config=playwright-crm.config.ts --ui
            ;;
        "headed")
            npx playwright test --config=playwright-crm.config.ts --headed
            ;;
        "debug")
            npx playwright test --config=playwright-crm.config.ts --debug
            ;;
        "chrome")
            npx playwright test --config=playwright-crm.config.ts --project=chromium
            ;;
        "firefox")
            npx playwright test --config=playwright-crm.config.ts --project=firefox
            ;;
        "safari")
            npx playwright test --config=playwright-crm.config.ts --project=webkit
            ;;
        "mobile")
            npx playwright test --config=playwright-crm.config.ts --project="Mobile Chrome"
            ;;
        "crm")
            npx playwright test --config=playwright-crm.config.ts tests/playwright-crm-examples.spec.ts
            ;;
        "api")
            npx playwright test --config=playwright-crm.config.ts tests/api-only.spec.ts
            ;;
        *)
            echo "❌ Unknown test type: $test_type"
            show_help
            exit 1
            ;;
    esac
    
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        echo "✅ $description completed successfully"
    else
        echo "❌ $description failed with exit code $exit_code"
    fi
    
    return $exit_code
}

# Функция для показа справки
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  all       Run all tests (default)"
    echo "  ui        Run tests in UI mode"
    echo "  headed    Run tests in headed mode"
    echo "  debug     Run tests in debug mode"
    echo "  chrome    Run tests only in Chrome"
    echo "  firefox   Run tests only in Firefox"
    echo "  safari    Run tests only in Safari"
    echo "  mobile    Run tests on mobile devices"
    echo "  crm       Run CRM-specific tests"
    echo "  api       Run API-only tests"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Run all tests"
    echo "  $0 ui            # Run tests in UI mode"
    echo "  $0 crm           # Run CRM tests only"
    echo "  $0 mobile        # Run mobile tests"
}

# Функция для генерации отчета
generate_report() {
    echo ""
    echo "📊 Generating test report..."
    
    if [ -f "test-results.json" ]; then
        echo "   - JSON report: test-results.json"
    fi
    
    if [ -f "test-results.xml" ]; then
        echo "   - JUnit report: test-results.xml"
    fi
    
    if [ -d "playwright-report" ]; then
        echo "   - HTML report: playwright-report/index.html"
        echo "   - Open report: npx playwright show-report"
    fi
}

# Функция для очистки
cleanup() {
    echo ""
    echo "🧹 Cleaning up..."
    
    # Очистка временных файлов
    rm -rf test-results/temp-*
    
    echo "✅ Cleanup completed"
}

# Основная логика
main() {
    local test_type=${1:-"all"}
    
    case $test_type in
        "help"|"-h"|"--help")
            show_help
            exit 0
            ;;
        "all")
            run_tests "all" "All Playwright Tests"
            ;;
        "ui")
            run_tests "ui" "Playwright Tests in UI Mode"
            ;;
        "headed")
            run_tests "headed" "Playwright Tests in Headed Mode"
            ;;
        "debug")
            run_tests "debug" "Playwright Tests in Debug Mode"
            ;;
        "chrome")
            run_tests "chrome" "Chrome Tests"
            ;;
        "firefox")
            run_tests "firefox" "Firefox Tests"
            ;;
        "safari")
            run_tests "safari" "Safari Tests"
            ;;
        "mobile")
            run_tests "mobile" "Mobile Tests"
            ;;
        "crm")
            run_tests "crm" "CRM-specific Tests"
            ;;
        "api")
            run_tests "api" "API-only Tests"
            ;;
        *)
            echo "❌ Unknown option: $test_type"
            show_help
            exit 1
            ;;
    esac
    
    local exit_code=$?
    
    # Генерация отчета
    generate_report
    
    # Очистка
    cleanup
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        echo "🎉 All tests completed successfully!"
        echo "📊 Check the reports above for detailed results."
    else
        echo "💥 Some tests failed. Check the output above for details."
    fi
    
    exit $exit_code
}

# Запуск основной функции
main "$@"
