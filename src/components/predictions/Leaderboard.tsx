'use client';

import { LeaderboardEntry } from '@/types';

interface Props {
  entries: LeaderboardEntry[];
  userAddress?: string | null;
}

const medalColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
const medals = ['🥇', '🥈', '🥉'];

export function Leaderboard({ entries, userAddress }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No predictions submitted yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 text-xs text-gray-400 font-medium">#</th>
            <th className="pb-3 text-xs text-gray-400 font-medium">Player</th>
            <th className="pb-3 text-xs text-gray-400 font-medium text-right">Points</th>
            <th className="pb-3 text-xs text-gray-400 font-medium text-right">Exact</th>
            <th className="pb-3 text-xs text-gray-400 font-medium text-right">Outcome</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {entries.map((entry, i) => (
            <tr
              key={entry.address}
              className={entry.address === userAddress ? 'bg-indigo-900/20' : ''}
            >
              <td className="py-3 pr-3">
                <span className={`font-bold ${medalColors[i] ?? 'text-gray-400'}`}>
                  {i < 3 ? medals[i] : `${i + 1}`}
                </span>
              </td>
              <td className="py-3">
                <span className="font-mono text-sm text-white">
                  {entry.address.slice(0, 8)}...{entry.address.slice(-6)}
                </span>
                {entry.address === userAddress && (
                  <span className="ml-2 text-xs text-indigo-400">(you)</span>
                )}
              </td>
              <td className="py-3 text-right font-bold text-white">{entry.points}</td>
              <td className="py-3 text-right text-gray-400">{entry.correct_scores}</td>
              <td className="py-3 text-right text-gray-400">{entry.correct_outcomes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
