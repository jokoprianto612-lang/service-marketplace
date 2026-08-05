# ─────────────────────────────────────────────
# Service Marketplace - Makefile
# ─────────────────────────────────────────────

.PHONY: help install dev build test lint typecheck clean \
        docker-build docker-up docker-down docker-logs docker-ps \
        db-generate db-push db-migrate db-studio db-seed \
        catalog-sync

# Default target
help:
	@echo "Service Marketplace - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install       Install all dependencies"
	@echo "  make dev           Start all dev servers (API + Web + Worker)"
	@echo "  make build         Build all packages for production"
	@echo "  make test          Run all tests"
	@echo "  make lint          Lint all packages"
	@echo "  make typecheck     Type-check all packages"
	@echo "  make clean         Clean build artifacts and node_modules"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build  Build all Docker images"
	@echo "  make docker-up     Start production stack"
	@echo "  make docker-down   Stop production stack"
	@echo "  make docker-logs   View production logs"
	@echo "  make docker-ps     List production containers"
	@echo ""
	@echo "Database:"
	@echo "  make db-generate   Generate Prisma client"
	@echo "  make db-push       Push schema to database (dev)"
	@echo "  make db-migrate    Create and run migration (dev)"
	@echo "  make db-studio     Open Prisma Studio"
	@echo "  make db-seed       Seed database with sample data"
	@echo ""
	@echo "Catalog:"
	@echo "  make catalog-sync  Sync catalog from Git repository"

# Development
install:
	pnpm install
	pnpm db:generate

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck

clean:
	pnpm clean

# Docker
docker-build:
	docker compose -f docker/docker-compose.yml build

docker-up:
	docker compose -f docker/docker-compose.yml up -d

docker-down:
	docker compose -f docker/docker-compose.yml down

docker-logs:
	docker compose -f docker/docker-compose.yml logs -f

docker-ps:
	docker compose -f docker/docker-compose.yml ps

docker-up-monitoring:
	docker compose -f docker/docker-compose.yml --profile monitoring up -d

docker-up-backup:
	docker compose -f docker/docker-compose.yml --profile backup up -d

docker-dev:
	docker compose -f docker/docker-compose.dev.yml up -d

docker-dev-down:
	docker compose -f docker/docker-compose.dev.yml down

# Database
db-generate:
	pnpm db:generate

db-push:
	pnpm db:push

db-migrate:
	pnpm db:migrate

db-migrate-prod:
	pnpm db:migrate:prod

db-studio:
	pnpm db:studio

db-seed:
	pnpm db:seed

# Catalog
catalog-sync:
	./scripts/sync-catalog.sh

# Quick start for new developers
quickstart: install docker-up
	@echo ""
	@echo "✅ Quickstart complete!"
	@echo "📱 Web: http://localhost:5173"
	@echo "🔌 API: http://localhost:3000"
	@echo "📚 Docs: http://localhost:3000/docs"
	@echo ""
	@echo "Register a new account to get started."