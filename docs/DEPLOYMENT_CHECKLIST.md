# 🚀 Production Deployment Checklist

## Phase 1: Infrastructure & Environment
- [ ] **Terraform State:** Verify `terraform.tfstate` is stored in a secure, remote backend (e.g., Terraform Cloud or an encrypted S3 bucket).
- [ ] **D1 Migrations:** Run `wrangler d1 migrations list DB --remote` to ensure the production schema matches `apps/worker-api/db/schema.sql`.
- [ ] **KV Namespaces:** Ensure `KV_USERS`, `KV_TRUST_SCORES`, and `KV_CONFIG` are provisioned and IDs are correctly mapped in `wrangler.toml`.
- [ ] **R2 CORS:** Verify R2 bucket CORS policies allow `PUT` and `GET` requests from your production domain.

## Phase 2: Security & Identity
- [ ] **WebAuthn Origin:** Confirm `RP_ID` and `ORIGIN` in `wrangler.toml` are set to `lifestyle-platform.com` (not localhost).
- [ ] **JWT Secrets:** Ensure the signing secret for session tokens is generated as a Cloudflare Secret: 
  `wrangler secret put AUTH_TOKEN_SECRET`.
- [ ] **CSP Headers:** Audit `apps/worker-api/src/index.ts` to ensure the `Content-Security-Policy` allows your R2 media domain but blocks all unauthorized scripts.
- [ ] **Trust Engine Seed:** Populate `KV_CONFIG` with the baseline trust heuristics (e.g., `INITIAL_SCORE: 50`).

## Phase 3: Performance & Monitoring
- [ ] **Logpush:** Enable Cloudflare Logpush to send Worker logs to your observability tool (Datadog/Logtail) for incident response.
- [ ] **Rate Limiting:** Check that the Durable Object `SessionManager` is correctly tracking active VUs and applying the "leak-bucket" algorithm.
- [ ] **Health Check:** Ping `https://api.lifestyle-platform.com/health` and verify the `200 OK` response.

## Phase 4: Final Legal & Support
- [ ] **Security.txt:** Verify the `.well-known/security.txt` file is accessible.
- [ ] **Terms of Service:** Ensure the "Privacy-First" clause is clearly visible during the WebAuthn registration flow.