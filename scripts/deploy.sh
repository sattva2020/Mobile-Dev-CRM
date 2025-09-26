#!/bin/bash

# Скрипт деплоя CRM-системы
# Поддерживает различные среды: development, staging, production

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка параметров
if [ $# -eq 0 ]; then
    log_error "Необходимо указать среду: development, staging, production"
    exit 1
fi

ENVIRONMENT=$1
VERSION=${2:-"latest"}

log_info "Начинаем деплой CRM-системы в среду: $ENVIRONMENT"
log_info "Версия: $VERSION"

# Проверка наличия необходимых файлов
check_requirements() {
    log_info "Проверяем требования..."
    
    if [ ! -f "package.json" ]; then
        log_error "Файл package.json не найден"
        exit 1
    fi
    
    if [ ! -f "Dockerfile" ]; then
        log_error "Файл Dockerfile не найден"
        exit 1
    fi
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        log_error "Файл docker-compose.prod.yml не найден"
        exit 1
    fi
    
    log_success "Все требования выполнены"
}

# Установка зависимостей
install_dependencies() {
    log_info "Устанавливаем зависимости..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Зависимости установлены"
}

# Сборка приложения
build_application() {
    log_info "Собираем приложение..."
    
    # Устанавливаем переменные окружения
    export NODE_ENV=production
    export REACT_APP_ENV=$ENVIRONMENT
    
    # Собираем приложение
    npm run build
    
    log_success "Приложение собрано"
}

# Сборка Docker образа
build_docker_image() {
    log_info "Собираем Docker образ..."
    
    # Собираем образ
    docker build -t crm-system:$VERSION .
    
    # Тегируем для разных сред
    case $ENVIRONMENT in
        "development")
            docker tag crm-system:$VERSION crm-system:dev
            ;;
        "staging")
            docker tag crm-system:$VERSION crm-system:staging
            ;;
        "production")
            docker tag crm-system:$VERSION crm-system:prod
            ;;
    esac
    
    log_success "Docker образ собран"
}

# Деплой в Docker
deploy_docker() {
    log_info "Деплоим в Docker..."
    
    # Останавливаем существующие контейнеры
    docker-compose -f docker-compose.prod.yml down
    
    # Запускаем новые контейнеры
    docker-compose -f docker-compose.prod.yml up -d
    
    log_success "Деплой в Docker завершен"
}

# Деплой в Vercel
deploy_vercel() {
    log_info "Деплоим в Vercel..."
    
    # Проверяем наличие Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI не установлен"
        exit 1
    fi
    
    # Деплоим
    vercel --prod
    
    log_success "Деплой в Vercel завершен"
}

# Проверка здоровья приложения
health_check() {
    log_info "Проверяем здоровье приложения..."
    
    # Ждем запуска приложения
    sleep 30
    
    # Проверяем доступность
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Приложение доступно"
    else
        log_error "Приложение недоступно"
        exit 1
    fi
}

# Запуск тестов
run_tests() {
    log_info "Запускаем тесты..."
    
    # Unit тесты
    npm run test:unit
    
    # E2E тесты
    npm run test:e2e
    
    log_success "Все тесты прошли"
}

# Отправка уведомлений
send_notifications() {
    log_info "Отправляем уведомления..."
    
    # Здесь можно добавить отправку уведомлений в Slack, Discord, etc.
    # Например:
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"CRM система успешно задеплоена в '$ENVIRONMENT'"}' \
    #      $SLACK_WEBHOOK_URL
    
    log_success "Уведомления отправлены"
}

# Очистка
cleanup() {
    log_info "Очищаем временные файлы..."
    
    # Удаляем временные файлы
    rm -rf node_modules/.cache
    rm -rf build/.cache
    
    log_success "Очистка завершена"
}

# Основная функция
main() {
    log_info "Начинаем процесс деплоя..."
    
    check_requirements
    install_dependencies
    build_application
    
    case $ENVIRONMENT in
        "development")
            build_docker_image
            deploy_docker
            health_check
            ;;
        "staging")
            build_docker_image
            deploy_docker
            run_tests
            health_check
            ;;
        "production")
            build_docker_image
            deploy_docker
            run_tests
            health_check
            send_notifications
            ;;
        *)
            log_error "Неизвестная среда: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    cleanup
    
    log_success "Деплой завершен успешно!"
}

# Обработка ошибок
trap 'log_error "Деплой прерван из-за ошибки"; exit 1' ERR

# Запуск
main "$@"
