'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PoolRow } from './PlayerCard';
import { PLAYERS } from '@/lib/players';
import type { Player } from '@/types/squad';

type PositionFilter = 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD';

const FILTERS: PositionFilter[] = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];

interface Props {
  selectedIds: string[];
  positionHint?: 'GK' | 'DEF' | 'MID' | 'FWD' | null;
  onSelect: (player: Player) => void;
  formation: string;
}

export function PlayerPool({ selectedIds, positionHint, onSelect, formation }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PositionFilter>(positionHint ?? 'ALL');

  // When positionHint changes (user clicked a slot), auto-switch filter
  useEffect(() => {
    if (positionHint) setFilter(positionHint);
  }, [positionHint]);

  const filtered = useMemo(() =>
    PLAYERS.filter((p) => {
      const matchPos = filter === 'ALL' || p.position === filter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.countryCode.toLowerCase().includes(search.toLowerCase());
      return matchPos && matchSearch;
    }),
    [filter, search],
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-800">
        <p className="text-[9px] text-gray-500 uppercase tracking-[0.25em] font-bold">Player Pool</p>
        <span className="text-[9px] text-gray-600 border border-gray-700 rounded px-1.5 py-0.5 font-bold">{formation}</span>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search player..."
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
        />
      </div>

      {/* Position filters */}
      <div className="flex gap-2 px-3 pt-3 pb-2">
        {FILTERS.map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.94 }}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
              filter === f
                ? 'bg-green-500 text-black'
                : 'bg-[#1a1a1a] text-gray-500 hover:text-white border border-gray-800'
            }`}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin" style={{ maxHeight: '400px' }}>
        {filtered.map((player) => (
          <PoolRow
            key={player.id}
            player={player}
            isSelected={selectedIds.includes(player.id)}
            onClick={() => onSelect(player)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 text-xs py-8 uppercase tracking-widest">No players found</p>
        )}
        <p className="text-center text-gray-700 text-[9px] pt-2 uppercase tracking-widest">
          + Hundreds more from every squad
        </p>
      </div>
    </div>
  );
}
