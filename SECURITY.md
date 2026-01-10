# Security Policy & Bug Bounty Program

## 1. Our Commitment
Privacy is our product. We welcome the security community to audit our E2EE implementation and infrastructure.

## 2. Reporting a Vulnerability
Please do not open GitHub issues for security vulnerabilities. Send an encrypted report to `security@lifestyle-platform.com` using our PGP key (see below).

## 3. Scope
| Asset | Type | Severity |
| :--- | :--- | :--- |
| `worker-api` | Cloudflare Worker | High (RCE, Auth Bypass) |
| `crypto-lib` | E2EE Logic | Critical (Encryption Weakness) |
| `web` | React Application | Medium (XSS, CSRF) |

## 4. Rewards (Example Tiers)
- **Critical ($2,500+):** Breaking the E2EE envelope or unauthorized access to D1 raw data.
- **High ($1,000):** Circumventing the Trust Engine to perform Sybil attacks.
- **Medium ($500):** Bypassing WebAuthn verification logic.

## 5. Exclusions
- DoS/DDoS attacks (Cloudflare handles this).
- Social engineering of platform admins.
- Attacks requiring physical access to a user's unlocked hardware key.