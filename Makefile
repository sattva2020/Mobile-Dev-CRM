# Mobile Dev CRM - Supabase Local Management

.PHONY: help install start stop reset status logs clean

# Default target
help: ## Show this help message
	@echo "Mobile Dev CRM - Supabase Local Management"
	@echo "=========================================="
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install Supabase CLI and dependencies
	@echo "Installing Supabase CLI..."
	@npm install -g supabase
	@echo "Installing Docker dependencies..."
	@docker-compose pull
	@echo "✅ Installation complete!"

start: ## Start local Supabase stack
	@echo "Starting Supabase local stack..."
	@supabase start
	@echo "✅ Supabase started!"
	@echo ""
	@echo "🌐 Services available at:"
	@echo "  - API URL: http://localhost:54321"
	@echo "  - Studio: http://localhost:54323"
	@echo "  - DB URL: postgresql://postgres:postgres@localhost:54322/postgres"
	@echo "  - Inbucket (Email): http://localhost:54325"

stop: ## Stop local Supabase stack
	@echo "Stopping Supabase local stack..."
	@supabase stop
	@echo "✅ Supabase stopped!"

reset: ## Reset local Supabase stack (WARNING: This will delete all data)
	@echo "⚠️  WARNING: This will delete all local data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	@supabase stop
	@supabase db reset
	@echo "✅ Supabase reset complete!"

status: ## Show status of local Supabase stack
	@supabase status

logs: ## Show logs from Supabase services
	@docker-compose logs -f

clean: ## Clean up all Supabase data and containers
	@echo "Cleaning up Supabase..."
	@supabase stop
	@docker-compose down -v
	@docker system prune -f
	@echo "✅ Cleanup complete!"

# Database management
db-migrate: ## Run database migrations
	@supabase db push

db-reset: ## Reset database schema
	@supabase db reset

db-seed: ## Seed database with initial data
	@supabase db seed

# Development helpers
dev-setup: install start db-migrate db-seed ## Complete development setup
	@echo "✅ Development environment ready!"

# Production helpers
prod-build: ## Build for production
	@npm run build

prod-start: ## Start production build
	@npm run start:prod

# Testing
test: ## Run tests
	@npm test

test-e2e: ## Run end-to-end tests
	@npm run test:e2e

# Monitoring
monitor: ## Monitor Supabase services
	@echo "Monitoring Supabase services..."
	@watch -n 5 'supabase status'

# Backup and restore
backup: ## Backup local database
	@supabase db dump --data-only > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backed up!"

restore: ## Restore database from backup
	@echo "Available backups:"
	@ls -la backup_*.sql 2>/dev/null || echo "No backups found"
	@read -p "Enter backup filename: " backup && supabase db reset && psql postgresql://postgres:postgres@localhost:54322/postgres < $$backup
	@echo "✅ Database restored!"

# Security
security-check: ## Run security checks
	@echo "Running security checks..."
	@npm audit
	@docker-compose config --quiet
	@echo "✅ Security checks complete!"

# Performance
perf-test: ## Run performance tests
	@echo "Running performance tests..."
	@npm run test:performance
	@echo "✅ Performance tests complete!"

# Documentation
docs: ## Generate documentation
	@echo "Generating documentation..."
	@npm run docs:generate
	@echo "✅ Documentation generated!"

# Health check
health: ## Check health of all services
	@echo "Checking service health..."
	@curl -s http://localhost:54321/health > /dev/null && echo "✅ API: Healthy" || echo "❌ API: Unhealthy"
	@curl -s http://localhost:54323 > /dev/null && echo "✅ Studio: Healthy" || echo "❌ Studio: Unhealthy"
	@pg_isready -h localhost -p 54322 > /dev/null && echo "✅ Database: Healthy" || echo "❌ Database: Unhealthy"
