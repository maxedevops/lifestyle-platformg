import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/auth';
import { trustEngine } from './middleware/trust';

const app = new Hono<{ Bindings: Bindings }>();

// 1. Global Security Middlewares
app.use('*', secureHeaders());
app.use('*', cors({ origin: (origin) => origin.endsWith('.pages.dev') || origin === 'https://lifestyle.com' }));

// 2. Health & Public Discovery
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// 3. Authenticated API Group
const api = new Hono<{ Bindings: Bindings }>();
api.use('*', authMiddleware);
api.use('*', trustEngine);

// Messaging with E2EE Metadata handling
api.post('/messages/send', async (c) => {
  const { recipientId, encryptedPayload, signature } = await c.req.json();
  // Store encrypted blob in D1, notify via Durable Object
  return c.json({ success: true, messageId: 'msg_...' });
});

app.route('/api/v1', api);

export default app;