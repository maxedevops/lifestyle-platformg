import { CloudflareAPI } from './utils/cf-api';

async function rotateTrustKeys() {
  const newSecret = crypto.randomUUID();
  // Update KV Config for the Trust Engine
  await CloudflareAPI.updateKV('KV_CONFIG', 'TRUST_SIGNING_KEY', newSecret);
  console.log("✅ Trust Engine signing key rotated. Workers will pick up change in < 60s.");
}

rotateTrustKeys();