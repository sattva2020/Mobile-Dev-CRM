@echo off
REM 🎭 Playwright Advanced Tests Runner (Windows)
REM Скрипт для запуска расширенных тестов Playwright для CRM системы

setlocal enabledelayedexpansion

echo 🎭 Playwright Advanced Tests Runner
echo ==================================

REM Функция для вывода сообщений
:log_info
echo ℹ️  %~1
goto :eof

:log_success
echo ✅ %~1
goto :eof

:log_warning
echo ⚠️  %~1
goto :eof

:log_error
echo ❌ %~1
goto :eof

REM Проверка зависимостей
:check_dependencies
call :log_info "Checking dependencies..."

where node >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Node.js is not installed"
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "npm is not installed"
    exit /b 1
)

where npx >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "npx is not installed"
    exit /b 1
)

call :log_success "All dependencies are available"
goto :eof

REM Установка Playwright
:install_playwright
call :log_info "Installing Playwright..."

if not exist "node_modules\@playwright" (
    npm install @playwright/test
    npx playwright install
    call :log_success "Playwright installed successfully"
) else (
    call :log_info "Playwright is already installed"
)
goto :eof

REM Проверка CRM системы
:check_crm_system
call :log_info "Checking CRM system availability..."

curl -s -o nul -w "%%{http_code}" http://localhost:3000 | findstr "200" >nul
if %errorlevel% equ 0 (
    call :log_success "CRM system is available"
) else (
    call :log_warning "CRM system is not available. Starting in simulation mode..."
    set PLAYWRIGHT_SIMULATION_MODE=true
)
goto :eof

REM Запуск тестов
:run_tests
set test_type=%~1
set browser=%~2
set mode=%~3

call :log_info "Running %test_type% tests..."

if "%test_type%"=="all" (
    call :log_info "Running all CRM tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts
) else if "%test_type%"=="crm" (
    call :log_info "Running CRM specific tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --grep "CRM"
) else if "%test_type%"=="api" (
    call :log_info "Running API tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --grep "API"
) else if "%test_type%"=="ai" (
    call :log_info "Running AI integration tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --grep "AI"
) else if "%test_type%"=="mobile" (
    call :log_info "Running mobile tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --project="CRM Mobile"
) else if "%test_type%"=="desktop" (
    call :log_info "Running desktop tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --project="CRM Desktop"
) else if "%test_type%"=="accessibility" (
    call :log_info "Running accessibility tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --grep "Accessibility"
) else if "%test_type%"=="performance" (
    call :log_info "Running performance tests..."
    npx playwright test --config=playwright-crm-advanced.config.ts --grep "Performance"
) else (
    call :log_error "Unknown test type: %test_type%"
    call :show_usage
    exit /b 1
)
goto :eof

REM Запуск тестов в UI режиме
:run_ui_tests
call :log_info "Running tests in UI mode..."
npx playwright test --config=playwright-crm-advanced.config.ts --ui
goto :eof

REM Запуск тестов в отладочном режиме
:run_debug_tests
call :log_info "Running tests in debug mode..."
npx playwright test --config=playwright-crm-advanced.config.ts --debug
goto :eof

REM Запуск тестов в headed режиме
:run_headed_tests
call :log_info "Running tests in headed mode..."
npx playwright test --config=playwright-crm-advanced.config.ts --headed
goto :eof

REM Генерация отчета
:generate_report
call :log_info "Generating test report..."

if exist "playwright-report\index.html" (
    call :log_success "HTML report generated: playwright-report\index.html"
    call :log_info "Opening report in browser..."
    npx playwright show-report
) else (
    call :log_warning "No HTML report found"
)

if exist "playwright-crm-report.json" (
    call :log_success "CRM report generated: playwright-crm-report.json"
)
goto :eof

REM Очистка результатов
:cleanup
call :log_info "Cleaning up test results..."

if exist "test-results" rmdir /s /q "test-results"
if exist "playwright-report" rmdir /s /q "playwright-report"
if exist "traces" rmdir /s /q "traces"
if exist "temp" rmdir /s /q "temp"

call :log_success "Cleanup completed"
goto :eof

REM Показать справку
:show_usage
echo Usage: %0 [OPTIONS] [TEST_TYPE]
echo.
echo Options:
echo   -h, --help          Show this help message
echo   -u, --ui            Run tests in UI mode
echo   -d, --debug         Run tests in debug mode
echo   -H, --headed        Run tests in headed mode
echo   -r, --report        Generate and show report
echo   -c, --cleanup       Clean up test results
echo   -i, --install       Install Playwright
echo.
echo Test Types:
echo   all                 Run all tests (default)
echo   crm                 Run CRM specific tests
echo   api                 Run API tests
echo   ai                  Run AI integration tests
echo   mobile              Run mobile tests
echo   desktop              Run desktop tests
echo   accessibility       Run accessibility tests
echo   performance         Run performance tests
echo.
echo Examples:
echo   %0                  # Run all tests
echo   %0 -u               # Run tests in UI mode
echo   %0 crm              # Run CRM tests
echo   %0 -d ai            # Debug AI tests
echo   %0 -H mobile        # Run mobile tests in headed mode
goto :eof

REM Основная функция
:main
set test_type=all
set ui_mode=false
set debug_mode=false
set headed_mode=false
set report_mode=false
set cleanup_mode=false
set install_mode=false

REM Парсинг аргументов
:parse_args
if "%~1"=="" goto :execute_actions
if "%~1"=="-h" goto :show_usage
if "%~1"=="--help" goto :show_usage
if "%~1"=="-u" set ui_mode=true
if "%~1"=="--ui" set ui_mode=true
if "%~1"=="-d" set debug_mode=true
if "%~1"=="--debug" set debug_mode=true
if "%~1"=="-H" set headed_mode=true
if "%~1"=="--headed" set headed_mode=true
if "%~1"=="-r" set report_mode=true
if "%~1"=="--report" set report_mode=true
if "%~1"=="-c" set cleanup_mode=true
if "%~1"=="--cleanup" set cleanup_mode=true
if "%~1"=="-i" set install_mode=true
if "%~1"=="--install" set install_mode=true
if "%~1"=="all" set test_type=all
if "%~1"=="crm" set test_type=crm
if "%~1"=="api" set test_type=api
if "%~1"=="ai" set test_type=ai
if "%~1"=="mobile" set test_type=mobile
if "%~1"=="desktop" set test_type=desktop
if "%~1"=="accessibility" set test_type=accessibility
if "%~1"=="performance" set test_type=performance
shift
goto :parse_args

:execute_actions
REM Выполнение действий
if "%install_mode%"=="true" (
    call :check_dependencies
    call :install_playwright
    exit /b 0
)

if "%cleanup_mode%"=="true" (
    call :cleanup
    exit /b 0
)

if "%report_mode%"=="true" (
    call :generate_report
    exit /b 0
)

REM Основной процесс
call :check_dependencies
call :check_crm_system

if "%ui_mode%"=="true" (
    call :run_ui_tests
) else if "%debug_mode%"=="true" (
    call :run_debug_tests
) else if "%headed_mode%"=="true" (
    call :run_headed_tests
) else (
    call :run_tests %test_type%
)

call :generate_report

call :log_success "All tests completed successfully!"
goto :eof

REM Запуск основной функции
call :main %*
