import { Link } from '@remix-run/react';
import { useWebAuthn } from '~/hooks/useWebAuthn'; // Assuming Remix handles aliases for Vite

export default function Index() {
  const { registerPasskey } = useWebAuthn();

  const handleRegister = async () => {
    const username = prompt("Enter a username to register:");
    if (username) {
      try {
        const result = await registerPasskey(username);
        if (result.verified) {
          alert('Registration successful! You can now log in with your passkey.');
        } else {
          alert('Registration failed: ' + (result.error || 'Unknown error.'));
        }
      } catch (error: any) {
        alert('WebAuthn registration error: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to Lifestyle Platform</h1>
      <p className="text-xl text-gray-600 mb-8">Connect, share, and live your best life, securely.</p>
      <div className="flex space-x-4">
        <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Log In
        </Link>
        <button
          onClick={handleRegister}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Register with Passkey
        </button>
      </div>
      <div className="mt-8 text-gray-500 text-sm">
        <p>Built on Cloudflare, secured with WebAuthn & E2EE.</p>
      </div>
    </div>
  );
}