import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username) {
      alert("Please enter your username.");
      return;
    }
    try {
      // 1. Get options from API
      const optionsRes = await fetch(`/api/v1/auth/login/options?username=${username}`);
      const options = await optionsRes.json();

      // 2. Trigger browser's biometric/hardware prompt
      const authResp = await startAuthentication(options);

      // 3. Send response back to Worker to verify
      const verificationRes = await fetch('/api/v1/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, authResp }),
      });
      const result = await verificationRes.json();

      if (result.verified && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('session_id', result.sessionId);
        alert('Login successful!');
        navigate('/dashboard'); // Redirect to a protected dashboard
      } else {
        alert('Login failed: ' + (result.error || 'Unknown error.'));
      }
    } catch (error: any) {
      alert('WebAuthn login error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Log In</h2>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="your_username"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:shadow-outline"
        >
          Login with Passkey
        </button>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account? <Link to="/" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}