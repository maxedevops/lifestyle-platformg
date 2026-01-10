import { Hono } from 'hono';

const admin = new Hono<{ Bindings: Bindings }>();

// 1. Fetch High-Risk Users (Low Trust Scores)
admin.get('/risk-report', async (c) => {
  // Query D1 for profiles with low scores or many reports
  const { results } = await c.env.DB.prepare(`
    SELECT id, username, trust_score 
    FROM profiles 
    WHERE trust_score < 30 
    ORDER BY trust_score ASC 
    LIMIT 50
  `).all();
  
  return c.json(results);
});

// 2. Manually Adjust Trust Score (Manual Override)
admin.post('/adjust-trust', async (c) => {
  const { userId, newScore, reason } = await c.req.json();
  
  await c.env.KV_TRUST_SCORES.put(userId, JSON.stringify({
    score: newScore,
    lastUpdated: new Date().toISOString(),
    reason: `Admin Action: ${reason}`
  }));

  return c.json({ success: true });
});

export { admin };