# SOC2 & GDPR Security Control Mapping

This document outlines the specific technical controls implemented within the `lifestyle-platform` architecture to satisfy security, confidentiality, and privacy criteria.

## 1. Access Control (Identity & Authentication)
- **Control:** All administrative and user access must be authenticated using multi-factor credentials.
- **Implementation:** Integrated **WebAuthn (Passkeys)** via `apps/worker-api/src/middleware/auth.ts`. This eliminates shared secrets (passwords) and uses hardware-backed cryptographic signatures (FIDO2) for all sessions.
- **Audit Path:** See `KV_USERS` namespace for public key storage and `SessionManager` Durable Object for active session tracking.

## 2. Protection of Data at Rest (Confidentiality)
- **Control:** Sensitive user data and communications must be encrypted at rest.
- **Implementation:** **End-to-End Encryption (E2EE)** using `AES-256-GCM` via the Web Crypto API in `packages/crypto-lib`.
- **Zero-Knowledge Architecture:** The platform does not possess decryption keys. Data is encrypted in the user's browser before transmission to Cloudflare D1 or R2.
- **Audit Path:** Review `apps/web/src/crypto/crypto.test.ts` for encryption logic verification.

## 3. Boundary Protection & Edge Security
- **Control:** The platform must protect against common web attacks and automated abuse.
- **Implementation:** - **Trust Engine:** Middleware in `apps/worker-api/src/middleware/trust.ts` enforces heuristic-based scoring.
  - **Rate Limiting:** Implemented via Durable Objects to prevent brute-force and Sybil attacks.
  - **WAF:** All traffic is proxied through Cloudflare with strict **CSP Headers** and **TLS 1.3** enforced.
- **Audit Path:** See `wrangler.toml` for header configurations and `infrastructure/main.tf` for WAF rules.

## 4. Media & Object Security
- **Control:** Media assets must be isolated and protected from unauthorized access.
- **Implementation:** Uses **R2 Presigned URLs** for uploads and an **Image Optimization Worker** (`optimizer.ts`) for delivery. This prevents direct bucket exposure and ensures only authenticated users can generate valid upload paths.

## 5. Data Minimization & Retention (GDPR)
- **Control:** Personal data must not be stored longer than necessary.
- **Implementation:** - **Scheduled Cleanup:** A `scheduled` event in `apps/worker-api/src/index.ts` automatically prunes metadata logs and messages older than 90 days.
  - **Cryptographic Shredding:** Deleting a user profile removes their entry from the `profiles` table and their specific key from `KV_USERS`, rendering any archived encrypted data permanently unreadable.