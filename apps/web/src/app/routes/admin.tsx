import { useApi } from '~/hooks/useApi';

export default function AdminDashboard() {
  const { data: risks, refetch } = useApi<any[]>('/admin/risk-report');

  const updateScore = async (userId: string, score: number) => {
    await fetch('/api/v1/admin/adjust-trust', {
      method: 'POST',
      body: JSON.stringify({ userId, newScore: score, reason: 'Manual audit' })
    });
    refetch();
  };

  return (
    <div className="p-8 bg-red-50 min-h-screen">
      <h1 className="text-2xl font-bold text-red-800 mb-6">Moderation Command Center</h1>
      <table className="w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-red-100">
          <tr>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Score</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {risks?.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-4 font-mono">{u.username}</td>
              <td className="p-4 font-bold">{u.trust_score}</td>
              <td className="p-4 flex gap-2">
                <button onClick={() => updateScore(u.id, 0)} className="btn-primary bg-red-600">Ban</button>
                <button onClick={() => updateScore(u.id, 100)} className="btn-primary bg-green-600">Verify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}