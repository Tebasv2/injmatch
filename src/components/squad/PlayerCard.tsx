'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/types/squad';
import { PlayerAvatar } from './PlayerAvatar';

const POS_COLORS: Record<string, string> = {
  GK:  'text-yellow-400',
  DEF: 'text-blue-400',
  MID: 'text-green-400',
  FWD: 'text-red-400',
};

const FORM_COLOR = (f: number) =>
  f >= 8 ? 'text-green-400' : f >= 6 ? 'text-yellow-400' : 'text-red-400';

interface PitchCardProps {
  player: Player | null;
  slotIndex: number;
  positionHint: 'GK' | 'DEF' | 'MID' | 'FWD';
  isSelected?: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  onClick: () => void;
}

export function PitchCard({ player, positionHint, isSelected, isCaptain, isViceCaptain, onClick }: PitchCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1 group focus:outline-none relative"
    >
      {/* Captain / VC badge */}
      {(isCaptain || isViceCaptain) && (
        <span className={`absolute -top-1 -right-1 z-10 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none ${
          isCaptain ? 'bg-yellow-400 text-black' : 'bg-white/80 text-black'
        }`}>
          {isCaptain ? 'C' : 'V'}
        </span>
      )}

      {/* Avatar circle */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all overflow-hidden ${
          isSelected
            ? 'border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]'
            : isCaptain
            ? 'border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.35)]'
            : isViceCaptain
            ? 'border-white/60'
            : player
            ? 'border-gray-600 group-hover:border-green-400/60'
            : 'border-dashed border-gray-600 bg-[#111] group-hover:border-green-400/40'
        }`}
      >
        {player ? (
          <PlayerAvatar player={player} size="md" />
        ) : (
          <span className="text-gray-600 text-lg">+</span>
        )}
      </div>

      {/* Name label */}
      <span className={`text-[9px] font-bold uppercase tracking-wide leading-none ${player ? 'text-white' : 'text-gray-600'}`}>
        {player ? player.name.split(' ').slice(-1)[0] : positionHint}
      </span>
      {/* Price */}
      {player && (
        <span className="text-[8px] text-green-400 font-black leading-none">{player.price.toFixed(1)} INJ</span>
      )}
    </motion.button>
  );
}

interface PoolRowProps {
  player: Player;
  isSelected: boolean;
  onClick: () => void;
}

const STAT_LABELS = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'] as const;
const STAT_KEYS = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;

export function PoolRow({ player, isSelected, onClick }: PoolRowProps) {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(74,222,128,0.06)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex flex-col gap-2 px-4 py-3 rounded-xl border transition-all text-left ${
        isSelected
          ? 'border-green-500/60 bg-green-500/10'
          : 'border-gray-800 bg-[#111] hover:border-gray-700'
      }`}
    >
      {/* Top row: avatar + info + price */}
      <div className="flex items-center gap-3">
        <PlayerAvatar player={player} size="sm" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold leading-tight truncate">{player.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{player.countryCode}</span>
            <span className={`text-[10px] font-bold ${POS_COLORS[player.position]}`}>{player.position}</span>
            <span className={`text-[10px] font-bold ${FORM_COLOR(player.form)}`}>
              Form {player.form.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Price + rating */}
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <span className="text-green-400 text-sm font-black">{player.price.toFixed(1)}</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">INJ</span>
        </div>

        {isSelected && (
          <span className="text-green-400 text-sm flex-shrink-0">✓</span>
        )}
      </div>

      {/* Stats mini row */}
      <div className="grid grid-cols-6 gap-1">
        {STAT_KEYS.map((key, i) => (
          <div key={key} className="flex flex-col items-center">
            <span className={`text-[11px] font-black ${player.stats[key] >= 85 ? 'text-green-400' : player.stats[key] >= 70 ? 'text-white' : 'text-gray-500'}`}>
              {player.stats[key]}
            </span>
            <span className="text-[8px] text-gray-600 uppercase">{STAT_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </motion.button>
  );
}
