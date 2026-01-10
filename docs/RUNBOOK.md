Emergency Procedures
Incident: High Rate of Abuse Reports
Identify: Check KV_TRUST_SCORES for accounts with rapid score decay.

Mitigate: Use the scripts/ban-user.sh to set the score to 0 globally.

Scale: Update the wrangler.toml rate-limit thresholds if a coordinated bot attack is detected.

Deployment: Database Migration
Run wrangler d1 migrations list DB --remote.

Apply new schema via wrangler d1 migrations apply DB --remote --file=./db/schema.sql.