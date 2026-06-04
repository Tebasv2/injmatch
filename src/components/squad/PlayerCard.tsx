'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/types/squad';

const POS_COLORS: Record<string, string> = {
  GK:  'text-yellow-400',
  DEF: 'text-blue-400',
  MID: 'text-green-400',
  FWD: 'text-red-400',
};

interface PitchCardProps {
  player: Player | null;
  slotIndex: number;
  positionHint: 'GK' | 'DEF' | 'MID' | 'FWD';
  isSelected?: boolean;
  onClick: () => void;
}

export function PitchCard({ player, positionHint, isSelected, onClick }: PitchCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 group focus:outline-none`}
    >
      {/* Avatar circle */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all overflow-hidden ${
          isSelected
            ? 'border-green-400 bg-[#1a2a1a]'
            : player
            ? 'border-gray-600 bg-[#1a1a2a] group-hover:border-green-400/60'
            : 'border-dashed border-gray-600 bg-[#111] group-hover:border-green-400/40'
        }`}
      >
        {player ? (
          player.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.avatar}
              alt={player.shortName}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('hidden');
              }}
            />
          ) : null
        ) : (
          <span className="text-gray-600 text-lg">+</span>
        )}
        {player && (
          <span hidden={!!player.avatar} className="text-white text-[11px] font-black leading-none">{player.shortName}</span>
        )}
      </div>

      {/* Name label */}
      <span className={`text-[9px] font-bold uppercase tracking-wide leading-none ${player ? 'text-white' : 'text-gray-600'}`}>
        {player ? player.name.split(' ').slice(-1)[0] : positionHint}
      </span>
    </motion.button>
  );
}

interface PoolRowProps {
  player: Player;
  isSelected: boolean;
  onClick: () => void;
}

export function PoolRow({ player, isSelected, onClick }: PoolRowProps) {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(74,222,128,0.06)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
        isSelected
          ? 'border-green-500/60 bg-green-500/10'
          : 'border-gray-800 bg-[#111] hover:border-gray-700'
      }`}
    >
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 overflow-hidden ${
        isSelected ? 'bg-green-500/20 text-green-400' : 'bg-[#1a1a1a] text-gray-300'
      }`}>
        {player.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.avatar}
            alt={player.shortName}
            className="w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).replaceWith(Object.assign(document.createElement('span'), { textContent: player.shortName, className: 'text-[10px] font-black' })); }}
          />
        ) : player.shortName}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold leading-tight truncate">{player.name}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          {player.countryCode}
          <span className={`ml-2 font-bold ${POS_COLORS[player.position]}`}>{player.position}</span>
        </p>
      </div>

      {/* Checkmark */}
      {isSelected && (
        <span className="text-green-400 text-sm flex-shrink-0">✓</span>
      )}
    </motion.button>
  );
}
