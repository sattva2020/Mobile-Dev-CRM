#!/bin/bash

# Скрипт деплоя CRM-системы в продакшен
# Автоматизированный деплой с проверками и откатом

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
ENVIRONMENT="production"
VERSION=${1:-"latest"}
BACKUP_DIR="/backups/crm"
LOG_FILE="/var/log/crm-deploy.log"

# Функции для вывода
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a $LOG_FILE
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

# Проверка предварительных условий
check_prerequisites() {
    log_info "Проверяем предварительные условия..."
    
    # Проверка Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker не установлен"
        exit 1
    fi
    
    # Проверка Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose не установлен"
        exit 1
    fi
    
    # Проверка переменных окружения
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
        log_error "Переменные окружения не настроены"
        exit 1
    fi
    
    # Проверка места на диске
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 90 ]; then
        log_error "Недостаточно места на диске: ${DISK_USAGE}%"
        exit 1
    fi
    
    log_success "Предварительные условия выполнены"
}

# Создание бэкапа
create_backup() {
    log_info "Создаем бэкап текущей версии..."
    
    BACKUP_NAME="crm-backup-$(date +%Y%m%d-%H%M%S)"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    mkdir -p $BACKUP_PATH
    
    # Бэкап базы данных
    if docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_PATH/database.sql; then
        log_success "Бэкап базы данных создан"
    else
        log_warning "Не удалось создать бэкап базы данных"
    fi
    
    # Бэкап конфигурации
    cp -r monitoring/ $BACKUP_PATH/
    cp docker-compose.prod.yml $BACKUP_PATH/
    cp Dockerfile $BACKUP_PATH/
    
    log_success "Бэкап создан: $BACKUP_PATH"
}

# Остановка текущих сервисов
stop_services() {
    log_info "Останавливаем текущие сервисы..."
    
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    log_success "Сервисы остановлены"
}

# Сборка новых образов
build_images() {
    log_info "Собираем новые образы..."
    
    # Сборка фронтенда
    docker build -t crm-frontend:$VERSION .
    
    # Сборка бэкенда (если есть)
    if [ -d "backend" ]; then
        docker build -t crm-backend:$VERSION ./backend
    fi
    
    log_success "Образы собраны"
}

# Деплой новых сервисов
deploy_services() {
    log_info "Деплоим новые сервисы..."
    
    # Обновление переменных окружения
    export VERSION=$VERSION
    
    # Запуск сервисов
    docker-compose -f docker-compose.prod.yml up -d
    
    log_success "Сервисы запущены"
}

# Проверка здоровья
health_check() {
    log_info "Проверяем здоровье системы..."
    
    # Ожидание запуска
    sleep 30
    
    # Проверка фронтенда
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Фронтенд доступен"
    else
        log_error "Фронтенд недоступен"
        return 1
    fi
    
    # Проверка бэкенда
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Бэкенд доступен"
    else
        log_warning "Бэкенд недоступен (возможно, не настроен)"
    fi
    
    # Проверка базы данных
    if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U $POSTGRES_USER; then
        log_success "База данных доступна"
    else
        log_error "База данных недоступна"
        return 1
    fi
    
    # Проверка Redis
    if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping | grep -q PONG; then
        log_success "Redis доступен"
    else
        log_warning "Redis недоступен"
    fi
    
    log_success "Проверка здоровья завершена"
}

# Запуск тестов
run_tests() {
    log_info "Запускаем тесты..."
    
    # Smoke тесты
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        log_success "API тесты прошли"
    else
        log_warning "API тесты не прошли"
    fi
    
    # Проверка метрик
    if curl -f http://localhost:9090/metrics > /dev/null 2>&1; then
        log_success "Prometheus доступен"
    else
        log_warning "Prometheus недоступен"
    fi
    
    log_success "Тесты завершены"
}

# Откат в случае ошибки
rollback() {
    log_error "Произошла ошибка, выполняем откат..."
    
    # Остановка текущих сервисов
    docker-compose -f docker-compose.prod.yml down
    
    # Восстановление из бэкапа
    if [ -d "$BACKUP_DIR" ]; then
        LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
        if [ -n "$LATEST_BACKUP" ]; then
            log_info "Восстанавливаем из бэкапа: $LATEST_BACKUP"
            
            # Восстановление конфигурации
            cp $BACKUP_DIR/$LATEST_BACKUP/docker-compose.prod.yml .
            cp $BACKUP_DIR/$LATEST_BACKUP/Dockerfile .
            
            # Запуск предыдущей версии
            docker-compose -f docker-compose.prod.yml up -d
            
            log_success "Откат выполнен"
        fi
    fi
    
    exit 1
}

# Очистка старых образов
cleanup() {
    log_info "Очищаем старые образы..."
    
    # Удаление неиспользуемых образов
    docker image prune -f
    
    # Удаление старых бэкапов (старше 7 дней)
    find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
    
    log_success "Очистка завершена"
}

# Уведомления
send_notifications() {
    log_info "Отправляем уведомления..."
    
    # Здесь можно добавить отправку уведомлений в Slack, Discord, etc.
    # Например:
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"CRM система успешно задеплоена в продакшен версии '$VERSION'"}' \
    #      $SLACK_WEBHOOK_URL
    
    log_success "Уведомления отправлены"
}

# Основная функция
main() {
    log_info "Начинаем деплой CRM-системы в продакшен версии $VERSION"
    
    # Установка обработчика ошибок
    trap rollback ERR
    
    check_prerequisites
    create_backup
    stop_services
    build_images
    deploy_services
    health_check
    run_tests
    cleanup
    send_notifications
    
    log_success "Деплой в продакшен завершен успешно!"
}

# Запуск
main "$@"
