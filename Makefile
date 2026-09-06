.PHONY: env deps up up-bot down logs build seed wait-api dev-up

env:
	@test -f .env || cp .env.example .env
	@echo ".env ready"

deps:
	npm run ci:deps

wait-api:
	@echo "Waiting for API..."
	@ok=0; for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 30; do \
	  if curl --max-time 2 -sf http://127.0.0.1:3001/api/tariffs >/dev/null; then ok=1; break; fi; \
	  sleep 2; \
	done; \
	if [ "$$ok" != "1" ]; then echo "API not ready"; exit 1; fi; \
	echo "API ready"

# Build & start; BFF seeds fields/cells/tariffs/users on boot
up: env
	docker compose up -d --build
	@$(MAKE) wait-api
	@echo "Seed runs automatically inside BFF. Optional re-check: make seed"
	@echo "UI: http://localhost:4200  (demo/curator/admin / demo1234)"

up-bot: env
	docker compose --profile bot up -d --build bot

down:
	docker compose --profile bot down

logs:
	docker compose logs -f --tail=200

build:
	docker compose build

seed:
	bash scripts/seed-local.sh

dev-up: env
	docker compose up -d postgres
	@echo "Start apps in separate terminals or tmux:"
	@echo "  npm run start:bff"
	@echo "  npm run start:frontend"
	@echo "  make seed"
	@echo "Or full hot-reload stack:"
	@echo "  docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build"
