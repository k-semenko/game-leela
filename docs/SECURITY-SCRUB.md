# Security scrub log

Historical cleanup notes for this monorepo (demo portfolio).

- Removed analytics / personal verification tags from the frontend
- Demo contacts and legal pages use placeholder data (`example.com`)
- JWT is stored in an httpOnly cookie; see root `SECURITY.md`
- Do not commit real `.env` files

Secrets that may have existed only in older private GitLab history should be rotated if they were ever used in production.
