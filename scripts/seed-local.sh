#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BFF="${BFF_URL:-http://127.0.0.1:3001}"
# Prefer nginx proxy if up
if curl --max-time 2 -sf -o /dev/null "$BFF/api/tariffs" 2>/dev/null; then
  :
elif curl --max-time 2 -sf -o /dev/null "http://127.0.0.1:4200/api/tariffs" 2>/dev/null; then
  BFF="http://127.0.0.1:4200"
fi

PASS_DEFAULT="${DEMO_PASS:-demo1234}"
JWT_SECRET="${JWT_SECRET:-}"
if [[ -z "$JWT_SECRET" && -f "$ROOT/.env" ]]; then
  # shellcheck disable=SC1091
  set -a
  # only pull JWT_SECRET
  JWT_SECRET="$(grep -E '^JWT_SECRET=' "$ROOT/.env" | head -1 | cut -d= -f2-)"
  set +a
fi

signup() {
  local user="$1" pass="$2" role="$3" email="$4"
  local extra="${5:-}"
  local body
  body=$(printf '{"username":"%s","password":"%s","role":"%s","email":"%s"%s}' \
    "$user" "$pass" "$role" "$email" "$extra")
  local code
  code=$(curl --max-time 10 -s -o /tmp/leela-signup.json -w '%{http_code}' -X POST "$BFF/api/signup" \
    -H 'Content-Type: application/json' \
    -d "$body" || true)
  echo "  signup $user ($role) HTTP $code $(cat /tmp/leela-signup.json 2>/dev/null | head -c 160)"
}

login_ok() {
  local user="$1" pass="$2"
  local code
  code=$(curl --max-time 10 -s -o /tmp/leela-login.json -w '%{http_code}' -X POST "$BFF/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"$user\",\"password\":\"$pass\"}" || true)
  if [[ "$code" != "200" && "$code" != "201" ]]; then
    echo "  login FAIL $user HTTP $code $(cat /tmp/leela-login.json)"
    return 1
  fi
  echo "  login OK $user"
}

echo "==> seed tariffs (idempotent)"
docker exec -i game-leela_postgres psql -U leela -d leela <<'SQL'
INSERT INTO tariffs (title, description, "orderDescription", "gamesCount", price)
SELECT 'Демо: 1 игра', 'Локальный тариф для разработки', '1 game', 1, 0
WHERE NOT EXISTS (SELECT 1 FROM tariffs WHERE title = 'Демо: 1 игра');

INSERT INTO tariffs (title, description, "orderDescription", "gamesCount", price)
SELECT 'Демо: 5 игр', 'Локальный пакет', '5 games', 5, 0
WHERE NOT EXISTS (SELECT 1 FROM tariffs WHERE title = 'Демо: 5 игр');
SQL


echo "==> seed game fields (idempotent)"
docker exec -i game-leela_postgres psql -U leela -d leela -c "DELETE FROM games WHERE \"fieldId\" IN (SELECT id FROM fields WHERE title = 'Поле 4'); DELETE FROM fields WHERE title = 'Поле 4';" >/dev/null || true

docker exec -i game-leela_postgres psql -U leela -d leela <<'SQL'
INSERT INTO fields (title, descriptions, url, interface, "isActive", "userId")
SELECT v.title, v.descriptions, v.url, v.iface, true, NULL
FROM (VALUES
  ('Поле 1', 'Демо-поле field1', $$url('assets/game-field/field1.jpg')$$, true),
  ('Поле 2', 'Демо-поле field2', $$url('assets/game-field/field2.jpg')$$, true),
  ('Поле 3', 'Демо-поле field3', $$url('assets/game-field/field3.jpg')$$, true),
  ('Поле 5', 'Демо-поле field5', $$url('assets/game-field/field5.jpg')$$, true)
) AS v(title, descriptions, url, iface)
WHERE NOT EXISTS (SELECT 1 FROM fields f WHERE f.title = v.title);


INSERT INTO cells (number, title, description)
SELECT g.n, 'Клетка ' || g.n, 'Демо-описание клетки ' || g.n
FROM generate_series(1, 72) AS g(n)
WHERE NOT EXISTS (SELECT 1 FROM cells c WHERE c.number = g.n);
SQL

echo "==> demo accounts via /api/signup"
signup "demo"    "$PASS_DEFAULT" "USER"    "demo@example.com"
signup "curator" "$PASS_DEFAULT" "CURATOR" "curator@example.com"
if [[ -n "$JWT_SECRET" ]]; then
  # ADMIN signup requires secret === JWT_SECRET
  signup "admin" "$PASS_DEFAULT" "ADMIN" "admin@example.com" ",\"secret\":\"${JWT_SECRET//\"/\\\"}\""
else
  echo "  WARN: JWT_SECRET missing — skip admin signup; set role via SQL if needed"
fi

echo "==> bump freeGames + ensure roles (idempotent SQL)"
docker exec -i game-leela_postgres psql -U leela -d leela <<'SQL'
UPDATE "user" SET "freeGames" = 50 WHERE username IN ('demo', 'curator', 'admin');
UPDATE "user" SET role = 'USER'    WHERE username = 'demo';
UPDATE "user" SET role = 'CURATOR' WHERE username = 'curator';
UPDATE "user" SET role = 'ADMIN'   WHERE username = 'admin';
SELECT username, role, "freeGames" FROM "user" WHERE username IN ('demo','curator','admin') ORDER BY username;
SQL

echo "==> login checks"
login_ok "demo"    "$PASS_DEFAULT"
login_ok "curator" "$PASS_DEFAULT"
login_ok "admin"   "$PASS_DEFAULT" || true

echo
echo "Accounts (password: $PASS_DEFAULT):"
echo "  demo     USER    — обычный игрок (создать игру нельзя)"
echo "  curator  CURATOR — создаёт игры, без админки"
echo "  admin    ADMIN   — админка /admin + создание игр"
echo "UI: http://localhost:4200"
