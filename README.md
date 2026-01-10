# Lifestyle Platform Monorepo

## Quickstart
1. **Install Dependencies:** `npm install`
2. **Authenticate CF:** `npx wrangler login`
3. **Database Init:** `npm run db:setup`
4. **Local Dev:** `npm run dev`

## Architecture Highlights
- **E2EE:** Messages are encrypted in the browser via `packages/crypto-lib`.
- **Identity:** Passwordless auth via WebAuthn.
- **Trust:** Heuristic-based reputation system running on Edge Middleware.