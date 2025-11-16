.PHONY: build up down restart logs ps shell migrate seed clean

# Build Docker image
build:
	docker-compose build

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# Restart services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# View container status
ps:
	docker-compose ps

# Open shell in backend container
shell:
	docker-compose exec backend sh

# Run migrations
migrate:
	docker-compose run --rm backend npm run migration:run

# Seed data
seed:
	docker-compose run --rm backend npm run seed:all

# Create admin user
admin:
	docker-compose run --rm backend npm run create:admin admin@example.com password123 "Admin User"

# Clean up
clean:
	docker-compose down -v
	docker system prune -f

# Production build
build-prod:
	docker build -t movie-backend:latest .

# Development
dev:
	docker-compose -f docker-compose.dev.yml up -d

# Development logs
dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Development down
dev-down:
	docker-compose -f docker-compose.dev.yml down

