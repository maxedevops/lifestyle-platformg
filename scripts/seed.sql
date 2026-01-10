-- Create System User for Trust Orchestration
INSERT INTO profiles (id, username, public_key, trust_score, verified)
VALUES ('0000-sys-id', 'SystemReputation', 'RAW_PUB_KEY_HEX', 100, 1);

-- Initial Mock Data for Testing
INSERT INTO profiles (id, username, public_key, trust_score)
VALUES ('test-user-1', 'alice_crypto', 'ALICE_PUB_KEY', 85);