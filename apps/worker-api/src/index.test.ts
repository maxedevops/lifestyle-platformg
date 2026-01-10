import { describe, it, expect } from 'vitest';
import app from './index';

describe('API Security Gates', () => {
  it('should return 401 for unauthorized access to /api/v1/messages', async () => {
    const res = await app.request('/api/v1/messages/send', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(401);
  });

  it('health check should be public', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });
});