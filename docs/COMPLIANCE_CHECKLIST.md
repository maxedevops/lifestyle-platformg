## Production Readiness Gate
- [ ] **Encryption:** Web Crypto API verified in `crypto.test.ts`.
- [ ] **Data Residency:** R2 Bucket location set to `ENAM` or `WNAM` based on user jurisdiction.
- [ ] **Secret Management:** No Cloudflare API keys in `wrangler.toml`.
- [ ] **Rate Limiting:** Durable Objects configured for per-IP leak-bucket limits.
- [ ] **Audit Logs:** All Trust Score changes logged to a separate, read-only D1 table.