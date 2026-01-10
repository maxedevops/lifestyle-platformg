Threat Model Summary

Data at Rest: All PII and messages are encrypted with AES-256-GCM.

Data in Transit: TLS 1.3 mandatory. CSP policies prevent XSS.

Identity: Support for WebAuthn (Passkeys) to eliminate credential stuffing.

Abuse: Rate limiting via Cloudflare Durable Objects per IP and per User ID.