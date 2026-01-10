# Engineering Deep Dive: The Lifestyle Platform

This platform is a "Serverless Monorepo" designed for maximum privacy and global scale. Here is how the core systems interact.

### 1. Identity & Authentication (WebAuthn)
We have eliminated passwords. 
- **Registration:** The Worker generates a challenge; the user’s device (FaceID/TouchID) signs it and creates a public/private key pair. We store only the **Public Key** and the **Authenticator Counter** in KV.
- **Security:** This is immune to phishing because the browser enforces that the domain (`rpId`) must match the origin.

### 2. End-to-End Encryption (E2EE)
We follow the "Zero-Knowledge" principle for messaging.
- **Key Exchange:** When Alice wants to message Bob, she fetches Bob's **public_key** from the D1 `profiles` table.
- **Encryption:** Alice’s browser generates a one-time symmetric AES-GCM key, encrypts the message, then "wraps" that key using Bob's public key.
- **Storage:** The Worker receives only the `ciphertext` and `iv`. It cannot read the content.

### 3. The Trust Engine (Edge Heuristics)
Reputation is computed at the Edge to prevent abuse before it hits the database.
- **Scoring:** A background Durable Object tracks "Velocity" (messages per second). If a user exceeds the limit, their `trust_score` in KV is decremented.
- **Enforcement:** The `trustEngine` middleware intercepts requests. If `trust_score < 20`, the request is dropped with a 403, saving D1 compute costs.

### 4. Media Pipeline
- **Upload:** Users get a short-lived **R2 Presigned URL**, allowing them to upload directly to R2 without taxing the Worker.
- **Delivery:** Images are served through an optimization worker that converts them to WebP/AVIF based on the user's `Accept` headers.