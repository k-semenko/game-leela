# Security Policy

## Reporting a vulnerability

If this repository is public on GitHub, please use **GitHub Security Advisories**.

Otherwise, email `security@example.com` (placeholder for this demo portfolio).

Please do **not** open a public issue with exploit details or secrets.

## Auth model (intentional)

- **JWT** lives in an **httpOnly** cookie `access_token` (not readable from JS). Login: `POST /api/auth/login`. Logout: `POST /api/auth/logout`.
- Guards accept the cookie or `Authorization: Bearer` (for tools/Swagger).
- Authorization is **server-side only** (JWT claims). Changing anything in the browser storage does not grant API access.

### `localStorage.user` — UI cache, not a secret

The SPA keeps a small profile object in `localStorage` (`id`, `username`, `role`, `email`, `exp`) so the UI can show the header/menus without refetching on every route.

This is **not** treated as a vulnerability for this demo:

- It is not the session token.
- Role/email there are display hints; the API still verifies the cookie JWT.
- Hardening to memory-only session would touch many call sites — deferred on purpose.

### WebSocket

Realtime gateway identifies clients by `handshake.query.username` only — fine for local demo, not spoof-proof. Production forks should auth the socket with the same JWT/cookie session.

If you fork this for production: prefer sessionStorage/memory for profile, short-lived cookies, CSRF strategy if you leave cookie auth, and never put the JWT in `localStorage`.

## Notes for this demo

- Do not commit real `.env` files or production tokens.
- Rotate any credentials that may have existed in prior private GitLab history before going public.
