'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pitch } from '@/components/squad/Pitch';
import { PlayerPool } from '@/components/squad/PlayerPool';
import { FORMATIONS } from '@/lib/players';
import type { Player, Formation } from '@/types/squad';

const FORMATION_OPTIONS: Formation[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];

function getSlotPositionHint(formation: Formation, slotIndex: number): 'GK' | 'DEF' | 'MID' | 'FWD' {
  const rows = FORMATIONS[formation]?.rows ?? FORMATIONS['4-3-3'].rows;
  let cursor = 0;
  for (const row of rows) {
    for (let i = 0; i < row.count; i++) {
      if (cursor === slotIndex) return row.position;
      cursor++;
    }
  }
  return 'MID';
}

export default function SquadPage() {
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [starters, setStarters] = useState<(Player | null)[]>(Array(11).fill(null));
  const [bench, setBench] = useState<(Player | null)[]>(Array(3).fill(null));
  const [selectedSlot, setSelectedSlot] = useState<{ type: 'starter' | 'bench'; index: number } | null>(null);
  const [saved, setSaved] = useState(false);

  const selectedIds = [
    ...starters.filter(Boolean).map((p) => p!.id),
    ...bench.filter(Boolean).map((p) => p!.id),
  ];

  const totalSelected = selectedIds.length;
  const startersCount = starters.filter(Boolean).length;
  const benchCount = bench.filter(Boolean).length;

  const positionHint = selectedSlot
    ? selectedSlot.type === 'starter'
      ? getSlotPositionHint(formation, selectedSlot.index)
      : null
    : null;

  const handleSlotClick = useCallback((type: 'starter' | 'bench', index: number) => {
    setSelectedSlot((prev) =>
      prev?.type === type && prev?.index === index ? null : { type, index },
    );
  }, []);

  const handlePlayerSelect = useCallback((player: Player) => {
    // If already selected, deselect
    if (selectedIds.includes(player.id)) {
      setStarters((prev) => prev.map((p) => (p?.id === player.id ? null : p)));
      setBench((prev) => prev.map((p) => (p?.id === player.id ? null : p)));
      return;
    }
    if (!selectedSlot) return;

    if (selectedSlot.type === 'starter') {
      setStarters((prev) => {
        const next = [...prev];
        next[selectedSlot.index] = player;
        return next;
      });
      // Advance to next empty starter slot
      setSelectedSlot((prev) => {
        if (!prev) return null;
        for (let i = prev.index + 1; i < 11; i++) {
          if (!starters[i]) return { type: 'starter', index: i };
        }
        return null;
      });
    } else {
      setBench((prev) => {
        const next = [...prev];
        next[selectedSlot.index] = player;
        return next;
      });
      setSelectedSlot((prev) => {
        if (!prev) return null;
        for (let i = prev.index + 1; i < 3; i++) {
          if (!bench[i]) return { type: 'bench', index: i };
        }
        return null;
      });
    }
  }, [selectedSlot, selectedIds, starters, bench]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setStarters(Array(11).fill(null));
    setBench(Array(3).fill(null));
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Page header */}
      <div className="border-b border-gray-800 px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-green-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-0.5">World Cup 2026</p>
          <h1 className="text-xl font-black uppercase">Pick Your Squad</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Formation selector */}
          <div className="flex gap-1 bg-[#111] border border-gray-800 rounded-xl p-1">
            {FORMATION_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => { setFormation(f); setStarters(Array(11).fill(null)); setSelectedSlot(null); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                  formation === f ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors px-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 md:p-6 max-w-[1400px] mx-auto">

        {/* Left — pitch + bench */}
        <div className="lg:w-[420px] flex-shrink-0 flex flex-col gap-4">
          {/* Pitch */}
          <Pitch
            formation={formation}
            starters={starters}
            selectedSlot={selectedSlot?.type === 'starter' ? selectedSlot.index : null}
            onSlotClick={(i) => handleSlotClick('starter', i)}
          />

          {/* Bench */}
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-4">
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.25em] font-bold mb-3">
              Bench ({benchCount}/3)
            </p>
            <div className="flex gap-2">
              {bench.map((player, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSlotClick('bench', i)}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                    selectedSlot?.type === 'bench' && selectedSlot.index === i
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-gray-700 bg-[#0d0d0d] hover:border-gray-600'
                  }`}
                >
                  {player ? (
                    <>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                        player.position === 'GK' ? 'bg-yellow-500/20 text-yellow-400' :
                        player.position === 'DEF' ? 'bg-blue-500/20 text-blue-400' :
                        player.position === 'MID' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{player.position}</span>
                      <span className="text-xs font-bold text-white truncate">{player.name}</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">+ Sub</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Progress + save */}
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className={`text-sm font-black ${totalSelected === 14 ? 'text-green-400' : 'text-white'}`}>
                {totalSelected}/14 players
              </p>
              <p className="text-[10px] text-gray-500">({startersCount} starters + {benchCount} bench)</p>
            </div>

            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400 text-sm font-black uppercase tracking-widest"
                >
                  ✓ Saved!
                </motion.span>
              ) : (
                <motion.button
                  key="save"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSave}
                  disabled={totalSelected < 11}
                  className="bg-green-500 disabled:bg-gray-800 disabled:text-gray-600 text-black font-black uppercase tracking-widest text-xs px-6 py-2.5 rounded-xl transition-colors"
                >
                  Save Squad
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right — player pool */}
        <div className="flex-1 min-h-[500px]">
          {/* Instruction banner */}
          <AnimatePresence>
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-3 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {selectedSlot.type === 'starter'
                  ? `Select a ${positionHint} for slot ${selectedSlot.index + 1}`
                  : `Select a substitute for bench slot ${selectedSlot.index + 1}`}
              </motion.div>
            )}
          </AnimatePresence>

          <PlayerPool
            selectedIds={selectedIds}
            positionHint={positionHint}
            onSelect={handlePlayerSelect}
            formation={formation}
          />
        </div>
      </div>
    </div>
  );
}
