-- Profiles and Trust
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  public_key TEXT NOT NULL, -- For E2EE key exchange
  trust_score INTEGER DEFAULT 50,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE
);

-- Messaging Metadata
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  participant_a TEXT NOT NULL,
  participant_b TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(participant_a) REFERENCES profiles(id),
  FOREIGN KEY(participant_b) REFERENCES profiles(id)
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  encrypted_content TEXT NOT NULL, -- AES-GCM Ciphertext
  nonce TEXT NOT NULL,             -- IV
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(conversation_id) REFERENCES conversations(id)
);

CREATE INDEX idx_messages_conv ON messages(conversation_id);