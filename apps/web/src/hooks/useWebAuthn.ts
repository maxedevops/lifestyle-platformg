import { startRegistration } from '@simplewebauthn/browser';

export const useWebAuthn = () => {
  const registerPasskey = async (username: string) => {
    // 1. Get options from our Worker API
    const optionsRes = await fetch(`/api/v1/auth/register/options?username=${username}`);
    const options = await optionsRes.json();

    // 2. Trigger browser's biometric/hardware prompt
    const regResp = await startRegistration(options);

    // 3. Send response back to Worker to verify and store public key
    const verificationRes = await fetch('/api/v1/auth/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regResp),
    });

    return await verificationRes.json();
  };

  return { registerPasskey };
};