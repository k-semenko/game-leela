# Game Leela

Monorepo демо психологической игры «Лила» (Game Leela): веб-клиент, BFF и Telegram-бот.

Раньше — несколько отдельных репозиториев; сейчас единый monorepo.

## Layout

| Path | Роль | Стек |
| --- | --- | --- |
| `apps/frontend` | Web UI (nginx SPA) | Angular + Taiga UI |
| `apps/bff` | API + WebSocket | NestJS + TypeORM + Postgres |
| `apps/bot` | Telegram | NestJS + Telegraf |
| `infra/sql` | SQL helpers | — |
| `scripts/seed-local.sh` | демо-данные | — |

## Требования

- Docker / Docker Compose
- Node.js 20+ (опционально — для seed с хоста или hot-reload без контейнеров)
- npm

## Быстрый старт (рекомендуемый путь)

Полный стек в Docker: **nginx** отдаёт фронт, проксирует `/api`, `/docs`, `/socket.io` на BFF.

### 1. Env

```bash
cd game-leela
cp .env.example .env
```

По умолчанию `TARGET_*=run` (prod-like образы без bind mounts).

### 2. Поднять стек

```bash
docker compose up --build -d
# или: make up   # ждёт API; сид полей/клеток/аккаунтов делает BFF при старте
```

После старта BFF сам кладёт демо-поля, **72 клетки**, тарифы и учётки.

Сервисы:

| URL | Что |
| --- | --- |
| http://localhost:4200 | Frontend (nginx) |
| http://localhost:4200/api/... | API через nginx → BFF |
| http://localhost:3001/api/... | BFF напрямую |
| http://localhost:4000/tg | Bot — только с `--profile bot` |

Postgres volume сохраняется между перезапусками.

### 3. Демо-данные

Сид обычно уже на старте BFF. Повторно / проверить:

```bash
make seed
# или: npm run seed
```

Демо-аккаунты (пароль у всех **`demo1234`**):

| Логин | Роль | Зачем |
| --- | --- | --- |
| `demo` | USER | обычный игрок (создать игру нельзя) |
| `curator` | CURATOR | создаёт игры |
| `admin` | ADMIN | `/admin` + создание игр |

`make seed` поднимает тарифы и эти учётки (`freeGames=50`).

Auth: JWT в **httpOnly** cookie (`access_token`). Logout: `POST /api/auth/logout`. В `localStorage` может лежать только профиль для UI (`user`) — это кэш, не сессия; см. `SECURITY.md`.

Проверки:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4200/
curl -s http://127.0.0.1:4200/api/tariffs
curl -s -X POST http://127.0.0.1:4200/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"demo","password":"demo1234"}'
```

Регистрация: `POST /api/signup` с `{"username","password","role":"USER","email?"}`.  
Уведомление в Telegram при signup необязательно — без бота регистрация не должна падать.

### 4. Остановить

```bash
make down
# или: docker compose down   # volume Postgres сохраняется
```

## Dev с hot reload

Оверлей `docker-compose.dev.yml` — targets `run_dev`, bind mounts, anonymous `node_modules` volumes:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
# с ботом: добавьте --profile bot
```

Либо только Postgres в Docker, приложения на хосте:

```bash
make dev-up          # поднимает postgres
npm run ci:deps      # один раз
npm run start:bff
npm run start:frontend   # ng serve, configuration development/local
# npm run start:bot      # нужен реальный TG_BOT_TOKEN, иначе 401/restart
make seed
```

Для host-npm в `.env` временно: `POSTGRES_HOST=localhost` (compose для контейнеров всё равно выставляет `postgres`).

Frontend local env: `apps/frontend/src/environments/environment.local.ts` → `apiUrl: 'http://localhost:3001/'`.  
Docker/nginx env: `environment.docker.ts` → `apiUrl: 'http://localhost:4200/'` (HTTP relative `api/...`, WS через тот же origin).

## Telegram bot

По умолчанию **не поднимается** (compose profile `bot`), чтобы не жечь CPU на restart loop без токена.

```bash
# в .env — реальный TG_BOT_TOKEN, затем:
make up-bot
# или: docker compose --profile bot up -d --build bot
```

BFF без бота работает: signup/оплаты просто не шлют Telegram-уведомления.


## License

MIT — см. `LICENSE`.
