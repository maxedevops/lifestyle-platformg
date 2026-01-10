import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { useApi } from '~/hooks/useApi';
import { TrustBadge } from '~/components/TrustBadge';
import { Profile } from 'packages/shared-types'; // Assuming shared-types is linked

export default function Dashboard() {
  const navigate = useNavigate();
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const { data: profileData, error, loading } = useApi<Profile>('/profiles/me'); // Example endpoint

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    if (profileData) {
      setMyProfile(profileData);
    }
    if (error) {
      alert('Failed to load profile: ' + error);
      navigate('/login'); // Redirect if auth fails for profile
    }
  }, [profileData, error, navigate]);

  if (loading) return <div className="text-center p-8">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Dashboard</h1>
      {myProfile ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, {myProfile.username}!</h2>
          <TrustBadge score={myProfile.trustScore || 50} isVerified={myProfile.verified || false} />
          <p className="text-gray-700 mt-4">Your Public Key: <code className="break-all">{myProfile.publicKey}</code></p>
          <p className="text-gray-700 mt-2">{myProfile.bio || 'No bio set yet.'}</p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Messaging</h3>
          <p className="text-gray-600">Start a new end-to-end encrypted conversation:</p>
          {/* Placeholder for message component */}
          <Link to="/messages" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Go to Messages
          </Link>

          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="mt-8 block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-center text-red-500">Failed to load profile. Please try logging in again.</p>
      )}
    </div>
  );
}