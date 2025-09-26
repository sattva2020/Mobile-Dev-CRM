#!/bin/bash

# 🎭 Playwright Advanced Tests Runner
# Скрипт для запуска расширенных тестов Playwright для CRM системы

set -e

echo "🎭 Playwright Advanced Tests Runner"
echo "=================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверка зависимостей
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        log_error "npx is not installed"
        exit 1
    fi
    
    log_success "All dependencies are available"
}

# Установка Playwright
install_playwright() {
    log_info "Installing Playwright..."
    
    if [ ! -d "node_modules/@playwright" ]; then
        npm install @playwright/test
        npx playwright install
        log_success "Playwright installed successfully"
    else
        log_info "Playwright is already installed"
    fi
}

# Проверка CRM системы
check_crm_system() {
    log_info "Checking CRM system availability..."
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        log_success "CRM system is available"
    else
        log_warning "CRM system is not available. Starting in simulation mode..."
        export PLAYWRIGHT_SIMULATION_MODE=true
    fi
}

# Запуск тестов
run_tests() {
    local test_type="$1"
    local browser="$2"
    local mode="$3"
    
    log_info "Running $test_type tests..."
    
    case $test_type in
        "all")
            log_info "Running all CRM tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts
            ;;
        "crm")
            log_info "Running CRM specific tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --grep "CRM"
            ;;
        "api")
            log_info "Running API tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --grep "API"
            ;;
        "ai")
            log_info "Running AI integration tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --grep "AI"
            ;;
        "mobile")
            log_info "Running mobile tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --project="CRM Mobile"
            ;;
        "desktop")
            log_info "Running desktop tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --project="CRM Desktop"
            ;;
        "accessibility")
            log_info "Running accessibility tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --grep "Accessibility"
            ;;
        "performance")
            log_info "Running performance tests..."
            npx playwright test --config=playwright-crm-advanced.config.ts --grep "Performance"
            ;;
        *)
            log_error "Unknown test type: $test_type"
            show_usage
            exit 1
            ;;
    esac
}

# Запуск тестов в UI режиме
run_ui_tests() {
    log_info "Running tests in UI mode..."
    npx playwright test --config=playwright-crm-advanced.config.ts --ui
}

# Запуск тестов в отладочном режиме
run_debug_tests() {
    log_info "Running tests in debug mode..."
    npx playwright test --config=playwright-crm-advanced.config.ts --debug
}

# Запуск тестов в headed режиме
run_headed_tests() {
    log_info "Running tests in headed mode..."
    npx playwright test --config=playwright-crm-advanced.config.ts --headed
}

# Генерация отчета
generate_report() {
    log_info "Generating test report..."
    
    if [ -f "playwright-report/index.html" ]; then
        log_success "HTML report generated: playwright-report/index.html"
        log_info "Opening report in browser..."
        npx playwright show-report
    else
        log_warning "No HTML report found"
    fi
    
    if [ -f "playwright-crm-report.json" ]; then
        log_success "CRM report generated: playwright-crm-report.json"
    fi
}

# Очистка результатов
cleanup() {
    log_info "Cleaning up test results..."
    
    rm -rf test-results/
    rm -rf playwright-report/
    rm -rf traces/
    rm -rf temp/
    
    log_success "Cleanup completed"
}

# Показать справку
show_usage() {
    echo "Usage: $0 [OPTIONS] [TEST_TYPE]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -u, --ui            Run tests in UI mode"
    echo "  -d, --debug         Run tests in debug mode"
    echo "  -H, --headed        Run tests in headed mode"
    echo "  -r, --report        Generate and show report"
    echo "  -c, --cleanup       Clean up test results"
    echo "  -i, --install       Install Playwright"
    echo ""
    echo "Test Types:"
    echo "  all                 Run all tests (default)"
    echo "  crm                 Run CRM specific tests"
    echo "  api                 Run API tests"
    echo "  ai                  Run AI integration tests"
    echo "  mobile              Run mobile tests"
    echo "  desktop             Run desktop tests"
    echo "  accessibility       Run accessibility tests"
    echo "  performance         Run performance tests"
    echo ""
    echo "Examples:"
    echo "  $0                  # Run all tests"
    echo "  $0 -u               # Run tests in UI mode"
    echo "  $0 crm              # Run CRM tests"
    echo "  $0 -d ai            # Debug AI tests"
    echo "  $0 -H mobile        # Run mobile tests in headed mode"
}

# Основная функция
main() {
    local test_type="all"
    local ui_mode=false
    local debug_mode=false
    local headed_mode=false
    local report_mode=false
    local cleanup_mode=false
    local install_mode=false
    
    # Парсинг аргументов
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -u|--ui)
                ui_mode=true
                shift
                ;;
            -d|--debug)
                debug_mode=true
                shift
                ;;
            -H|--headed)
                headed_mode=true
                shift
                ;;
            -r|--report)
                report_mode=true
                shift
                ;;
            -c|--cleanup)
                cleanup_mode=true
                shift
                ;;
            -i|--install)
                install_mode=true
                shift
                ;;
            all|crm|api|ai|mobile|desktop|accessibility|performance)
                test_type="$1"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Выполнение действий
    if [ "$install_mode" = true ]; then
        check_dependencies
        install_playwright
        exit 0
    fi
    
    if [ "$cleanup_mode" = true ]; then
        cleanup
        exit 0
    fi
    
    if [ "$report_mode" = true ]; then
        generate_report
        exit 0
    fi
    
    # Основной процесс
    check_dependencies
    check_crm_system
    
    if [ "$ui_mode" = true ]; then
        run_ui_tests
    elif [ "$debug_mode" = true ]; then
        run_debug_tests
    elif [ "$headed_mode" = true ]; then
        run_headed_tests
    else
        run_tests "$test_type"
    fi
    
    generate_report
    
    log_success "All tests completed successfully!"
}

# Запуск основной функции
main "$@"
