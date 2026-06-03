'use client';

import { useState } from 'react';
import { useContract } from '@/hooks/useContract';
import { useWalletContext } from '@/components/wallet/WalletProvider';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  stage: string;
}

interface Props {
  leagueId: string;
  match: Match;
  onSubmitted: () => void;
}

export function PredictionForm({ leagueId, match, onSubmitted }: Props) {
  const { address } = useWalletContext();
  const contract = useContract(address);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contract.submitPrediction(leagueId, match.id, homeScore, awayScore);
      onSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{match.stage}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-white mb-2">{match.homeTeam}</p>
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
            min="0"
            max="20"
            className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-2 text-center text-white text-xl font-bold focus:outline-none focus:border-indigo-500"
          />
        </div>
        <span className="text-gray-500 text-xl font-bold">vs</span>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-white mb-2">{match.awayTeam}</p>
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
            min="0"
            max="20"
            className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-2 text-center text-white text-xl font-bold focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Prediction'}
      </button>
    </form>
  );
}
