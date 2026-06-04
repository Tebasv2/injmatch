'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PoolRow } from './PlayerCard';
import { PLAYERS } from '@/lib/players';
import type { Player } from '@/types/squad';

type PositionFilter = 'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD';
type SortMode = 'rating' | 'price_asc' | 'price_desc' | 'form';

const FILTERS: PositionFilter[] = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'rating',      label: 'Rating' },
  { value: 'price_desc',  label: 'Price ↓' },
  { value: 'price_asc',   label: 'Price ↑' },
  { value: 'form',        label: 'Form' },
];

interface Props {
  selectedIds: string[];
  positionHint?: 'GK' | 'DEF' | 'MID' | 'FWD' | null;
  onSelect: (player: Player) => void;
  formation: string;
  remainingBudget: number;
}

export function PlayerPool({ selectedIds, positionHint, onSelect, formation, remainingBudget }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PositionFilter>(positionHint ?? 'ALL');
  const [sort, setSort] = useState<SortMode>('rating');

  useEffect(() => {
    if (positionHint) setFilter(positionHint);
  }, [positionHint]);

  const filtered = useMemo(() => {
    const list = PLAYERS.filter((p) => {
      const matchPos = filter === 'ALL' || p.position === filter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.countryCode.toLowerCase().includes(search.toLowerCase()) ||
                          p.club.toLowerCase().includes(search.toLowerCase());
      return matchPos && matchSearch;
    });

    list.sort((a, b) => {
      if (sort === 'rating')     return b.rating - a.rating;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'price_asc')  return a.price - b.price;
      if (sort === 'form')       return b.form - a.form;
      return 0;
    });

    return list;
  }, [filter, search, sort]);

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
          placeholder="Search player, club or country..."
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
        />
      </div>

      {/* Position filters + sort */}
      <div className="flex gap-2 px-3 pt-3 pb-1">
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

      {/* Sort row */}
      <div className="flex gap-2 px-3 pb-2">
        {SORT_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSort(s.value)}
            className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors ${
              sort === s.value
                ? 'text-green-400 border border-green-500/40 bg-green-500/10'
                : 'text-gray-600 border border-gray-800 hover:text-gray-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-thin" style={{ maxHeight: '560px' }}>
        {filtered.map((player) => {
          const isSelected = selectedIds.includes(player.id);
          const canAfford = isSelected || player.price <= remainingBudget;
          return (
            <div key={player.id} className={!canAfford ? 'opacity-40 pointer-events-none' : undefined}>
              <PoolRow
                player={player}
                isSelected={isSelected}
                onClick={() => onSelect(player)}
              />
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 text-xs py-8 uppercase tracking-widest">No players found</p>
        )}
      </div>
    </div>
  );
}
