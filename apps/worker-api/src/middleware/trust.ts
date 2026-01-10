export const trustEngine = async (c: any, next: any) => {
  const user = c.get('user');
  const trustData = await c.env.KV_TRUST_SCORES.get(user.id);
  
  const score = trustData ? JSON.parse(trustData).score : 0;

  if (score < 20) {
    return c.json({ error: 'Account restricted. High risk detected.' }, 403);
  }

  await next();
};