# Migration notes

This project started as several separate GitLab repositories and was consolidated into a single monorepo:

- `apps/frontend` — Angular web client
- `apps/bff` — NestJS API + WebSocket
- `apps/bot` — Telegram bot

Legacy scaffolding and nested `.git` histories were removed; this tree is intended as a clean portfolio OSS snapshot (no upstream GitLab history).
