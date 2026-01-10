import { verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import { generateAuthenticationOptions, generateRegistrationOptions } from '@simplewebauthn/server';
import { Authenticator, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import { HonoContext } from 'hono';

interface Bindings {
  DB: D1Database;
  KV_USERS: KVNamespace; // Stores user metadata and authenticators
  SESSION_MANAGER: DurableObjectNamespace;
}

interface User {
  id: string;
  username: string;
  authenticators: Authenticator[];
}

const RP_NAME = 'Lifestyle Platform';
const RP_ID = 'lifestyle-platform.com'; // Must match domain, no http/s
const ORIGIN = 'https://lifestyle-platform.com';

export const authMiddleware = async (c: HonoContext<{ Bindings: Bindings }>, next: any) => {
  const token = c.req.header('Authorization')?.split('Bearer ')[1];
  if (!token) {
    // For protected routes, check token, otherwise allow for public WebAuthn setup
    if (c.req.url.includes('/api/v1/auth/')) {
      await next();
      return;
    }
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // TODO: Validate JWT token and extract user ID
  // For now, a placeholder for the user object
  c.set('user', { id: 'mock-user-id', username: 'mock-user', trustScore: 75 });
  await next();
};


// WebAuthn Registration Options
export const getRegistrationOptions = async (c: HonoContext<{ Bindings: Bindings }>) => {
  const { username } = c.req.query();
  if (!username) return c.json({ error: 'Username required' }, 400);

  let user: User | null = await c.env.KV_USERS.get<User>(`user:${username}`, 'json');

  const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: user?.id || crypto.randomUUID(),
    userName: username,
    attestationType: 'none',
    excludeCredentials: user?.authenticators.map(authenticator => ({
      id: authenticator.credentialID,
      type: 'public-key',
      transports: authenticator.transports,
    })) || [],
    authenticatorSelection: {
      residentKey: 'required', // Passkeys stored on device
      userVerification: 'preferred',
    },
  });

  // Store challenge for verification
  await c.env.KV_USERS.put(`challenge:${username}`, options.challenge, { expirationTtl: 60 * 5 }); // 5 min expiry
  return c.json(options);
};

// WebAuthn Registration Verification
export const verifyRegistration = async (c: HonoContext<{ Bindings: Bindings }>) => {
  const body = await c.req.json();
  const username = body.response?.clientExtensionResults?.username || body.username; // Derive username

  if (!username) return c.json({ error: 'Username required for verification' }, 400);

  const expectedChallenge = await c.env.KV_USERS.get(`challenge:${username}`);
  if (!expectedChallenge) return c.json({ error: 'Challenge expired or not found' }, 400);

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
      // requireUserPresence: true, // Only if you explicitly need presence (not common with modern passkeys)
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp, transports } = registrationInfo;

      let user: User | null = await c.env.KV_USERS.get<User>(`user:${username}`, 'json');
      if (!user) {
        user = {
          id: crypto.randomUUID(),
          username,
          authenticators: [],
        };
      }

      const newAuthenticator: Authenticator = {
        credentialID,
        credentialPublicKey,
        counter,
        // cloudflareWorkers will handle this as a buffer
        transports: transports || [],
        credentialDeviceType,
        credentialBackedUp,
      };

      user.authenticators.push(newAuthenticator);
      await c.env.KV_USERS.put(`user:${username}`, JSON.stringify(user));
      await c.env.KV_USERS.delete(`challenge:${username}`); // Clean up challenge

      // Update D1 profile
      await c.env.DB.prepare(`
        INSERT INTO profiles (id, username, public_key, verified)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(username) DO UPDATE SET
          public_key = EXCLUDED.public_key,
          verified = EXCLUDED.verified
      `).bind(user.id, user.username, btoa(String.fromCharCode(...new Uint8Array(credentialPublicKey)))).run();


      return c.json({ verified: true, userId: user.id });
    }
  } catch (error: any) {
    console.error('WebAuthn Registration Verification Error:', error);
    return c.json({ error: error.message || 'Verification failed' }, 400);
  }
  return c.json({ verified: false, error: 'Unknown verification error' }, 400);
};

// WebAuthn Login Options
export const getLoginOptions = async (c: HonoContext<{ Bindings: Bindings }>) => {
  const { username } = c.req.query();
  if (!username) return c.json({ error: 'Username required' }, 400);

  const user: User | null = await c.env.KV_USERS.get<User>(`user:${username}`, 'json');
  if (!user || user.authenticators.length === 0) {
    return c.json({ error: 'User not found or no authenticators registered' }, 404);
  }

  const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'preferred',
    allowCredentials: user.authenticators.map(authenticator => ({
      id: authenticator.credentialID,
      type: 'public-key',
      transports: authenticator.transports,
    })),
  });

  await c.env.KV_USERS.put(`challenge:${username}`, options.challenge, { expirationTtl: 60 * 5 }); // 5 min expiry
  return c.json(options);
};

// WebAuthn Login Verification
export const verifyLogin = async (c: HonoContext<{ Bindings: Bindings }>) => {
  const body = await c.req.json();
  const { username, authResp } = body;

  if (!username) return c.json({ error: 'Username required' }, 400);

  const user: User | null = await c.env.KV_USERS.get<User>(`user:${username}`, 'json');
  if (!user || user.authenticators.length === 0) {
    return c.json({ error: 'User not found or no authenticators registered' }, 404);
  }

  const expectedChallenge = await c.env.KV_USERS.get(`challenge:${username}`);
  if (!expectedChallenge) return c.json({ error: 'Challenge expired or not found' }, 400);

  let authenticator: Authenticator | undefined;
  try {
    authenticator = user.authenticators.find(auth =>
      auth.credentialID === authResp.id
    );

    if (!authenticator) {
      return c.json({ error: 'Authenticator not found for user' }, 400);
    }

    const verification = await verifyAuthenticationResponse({
      response: authResp,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator,
      requireUserVerification: true,
    });

    const { verified, authenticationInfo } = verification;

    if (verified) {
      // Update authenticator counter to prevent replay attacks
      authenticator.counter = authenticationInfo.newAuthenticatorCounter;
      await c.env.KV_USERS.put(`user:${username}`, JSON.stringify(user));
      await c.env.KV_USERS.delete(`challenge:${username}`); // Clean up challenge

      // Generate JWT (placeholder)
      const token = 'mock-jwt-token-for-' + user.id; // In production, use real JWT library
      const sessionId = crypto.randomUUID();

      // Notify Durable Object of active session
      const sessionManagerId = c.env.SESSION_MANAGER.idFromName('global_session_manager');
      const sessionManager = c.env.SESSION_MANAGER.get(sessionManagerId);
      await sessionManager.fetch(new Request(`${sessionManager.url}/heartbeat?userId=${user.id}`));

      return c.json({ verified: true, token, sessionId, userId: user.id });
    }
  } catch (error: any) {
    console.error('WebAuthn Login Verification Error:', error);
    return c.json({ error: error.message || 'Verification failed' }, 400);
  }
  return c.json({ verified: false, error: 'Unknown verification error' }, 400);
};