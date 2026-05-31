'use client';

import { League } from '@/types';
import { formatInj } from '@/lib/injective';

interface Props {
  league: League;
  onJoin: (league: League) => void;
  onView: (league: League) => void;
  userAddress?: string | null;
}

const statusColors: Record<League['status'], string> = {
  open: 'bg-green-500/20 text-green-400 border-green-500/30',
  active: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  finished: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function LeagueCard({ league, onJoin, onView, userAddress }: Props) {
  const isParticipant = userAddress ? league.participants.includes(userAddress) : false;
  const isFull = league.participants.length >= league.max_participants;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-indigo-500/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">{league.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[league.status]}`}>
          {league.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500">Entry Fee</p>
          <p className="text-sm font-medium text-white">{formatInj(league.entry_fee)} INJ</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Prize Pool</p>
          <p className="text-sm font-medium text-indigo-400">{formatInj(league.prize_pool)} INJ</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Participants</p>
          <p className="text-sm font-medium text-white">
            {league.participants.length} / {league.max_participants}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Admin</p>
          <p className="text-sm font-mono text-gray-400">
            {league.admin.slice(0, 6)}…{league.admin.slice(-4)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(league)}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-lg transition-colors"
        >
          View Details
        </button>
        {league.status === 'open' && !isParticipant && !isFull && (
          <button
            onClick={() => onJoin(league)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition-colors"
          >
            Join
          </button>
        )}
        {isParticipant && (
          <span className="flex-1 text-center text-sm py-2 text-green-400 font-medium">
            ✓ Joined
          </span>
        )}
        {!isParticipant && isFull && (
          <span className="flex-1 text-center text-sm py-2 text-gray-500">Full</span>
        )}
      </div>
    </div>
  );
}
