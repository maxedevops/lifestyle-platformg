import { describe, it, expect, beforeEach } from 'vitest';
import { encryptEnvelope } from 'packages/crypto-lib/src/envelope';

describe('End-to-End Encryption Logic', () => {
  it('should encrypt and allow for a valid envelope structure', async () => {
    const mockKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const plaintext = "Secret lifestyle message";
    const envelope = await encryptEnvelope(plaintext, mockKey);
    
    expect(envelope).toHaveProperty('ciphertext');
    expect(envelope).toHaveProperty('iv');
    expect(typeof envelope.ciphertext).toBe('string');
  });

  it('should produce unique IVs for every encryption call', async () => {
    const mockKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
    const env1 = await encryptEnvelope("test", mockKey);
    const env2 = await encryptEnvelope("test", mockKey);
    
    expect(env1.iv).not.toBe(env2.iv);
  });
});