import React from 'react';

interface TrustBadgeProps {
  score: number;
  isVerified: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ score, isVerified }) => {
  const getColor = () => {
    if (score > 80) return 'text-green-500';
    if (score > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-slate-50">
      <span className={`font-bold ${getColor()}`}>Reputation: {score}</span>
      {isVerified && (
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          Identity Verified
        </span>
      )}
    </div>
  );
};