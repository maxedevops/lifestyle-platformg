import { describe, it, expect } from 'vitest';
import { trustEngine } from './middleware/trust';

describe('Trust & Reputation Engine', () => {
  const mockContext = (score: number) => ({
    get: () => ({ id: 'user_123' }),
    env: {
      KV_TRUST_SCORES: {
        get: async () => JSON.stringify({ score })
      }
    },
    json: (data: any, status: number) => ({ data, status })
  });

  it('should block users with a score below 20', async () => {
    const c = mockContext(15) as any;
    const next = vi.fn();
    const result = await trustEngine(c, next);
    
    expect(result.status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow users with a high score', async () => {
    const c = mockContext(90) as any;
    const next = vi.fn();
    await trustEngine(c, next);
    
    expect(next).toHaveBeenCalled();
  });
});