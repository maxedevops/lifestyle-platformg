# Privacy & Data Sovereignty Policy

## 1. Zero-Knowledge Architecture
All personal messages and user-uploaded lifestyle media are encrypted client-side. The platform operator (Lifestyle Platform) holds no keys to decrypt this content.

## 2. Data Minimization (GDPR)
- **Profile Data:** Only a username and public key are required.
- **Retention:** Metadata logs (IPs, session durations) are purged after 14 days via Cloudflare Workers Scheduled Events.

## 3. Right to Erasure
Upon account deletion, the D1 entry and R2 bucket objects associated with the `userId` are cryptographically shredded (keys deleted from KV).