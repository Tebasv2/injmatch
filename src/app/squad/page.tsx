'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pitch } from '@/components/squad/Pitch';
import { PlayerPool } from '@/components/squad/PlayerPool';
import { FORMATIONS, SQUAD_BUDGET } from '@/lib/players';
import { useWalletContext } from '@/components/wallet/WalletProvider';
import { useSquad } from '@/hooks/useSquad';
import type { Player, Formation } from '@/types/squad';

interface TransferWindowState {
  open: boolean;
  round: number | null;
  reason: string;
}

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

function BudgetBar({ spent, budget }: { spent: number; budget: number }) {
  const pct = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOver = remaining < 0;
  const isLow = remaining >= 0 && remaining < 10;

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] text-gray-500 uppercase tracking-[0.25em] font-bold">Budget</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-lg font-black ${isOver ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-green-400'}`}>
            {Math.abs(remaining).toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500">INJ {isOver ? 'over' : 'left'}</span>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${isOver ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[9px] text-gray-600">{spent.toFixed(1)} INJ spent</span>
        <span className="text-[9px] text-gray-600">{budget} INJ total</span>
      </div>
    </div>
  );
}

export default function SquadPage() {
  const { address, isConnected } = useWalletContext();
  const {
    starters, setStarters,
    bench, setBench,
    formation, setFormation,
    saveStatus, lastSaved,
    saveSquad,
  } = useSquad(address);

  const [selectedSlot, setSelectedSlot] = useState<{ type: 'starter' | 'bench'; index: number } | null>(null);
  const [positionError, setPositionError] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [transferWindow, setTransferWindow] = useState<TransferWindowState | null>(null);

  useEffect(() => {
    fetch('/api/transfer-window')
      .then((r) => r.json())
      .then((d) => setTransferWindow(d))
      .catch(() => setTransferWindow({ open: true, round: null, reason: '' }));
  }, []);

  const windowLocked = transferWindow !== null && !transferWindow.open;

  const allPlayers = useMemo(() => [
    ...starters.filter(Boolean) as Player[],
    ...bench.filter(Boolean) as Player[],
  ], [starters, bench]);

  const selectedIds = allPlayers.map((p) => p.id);
  const totalSpent = allPlayers.reduce((sum, p) => sum + p.price, 0);
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
    // Deselect if already in squad
    if (selectedIds.includes(player.id)) {
      setStarters((prev) => prev.map((p) => (p?.id === player.id ? null : p)));
      setBench((prev) => prev.map((p) => (p?.id === player.id ? null : p)));
      return;
    }
    if (!selectedSlot) return;

    // Position enforcement for starter slots
    if (selectedSlot.type === 'starter') {
      const required = getSlotPositionHint(formation, selectedSlot.index);
      if (player.position !== required) {
        setPositionError(`This slot requires a ${required} — ${player.name} is a ${player.position}`);
        setTimeout(() => setPositionError(null), 3000);
        return;
      }
    }

    // Budget enforcement
    if (totalSpent + player.price > SQUAD_BUDGET) {
      setBudgetError(`Not enough budget — ${player.name} costs ${player.price.toFixed(1)} INJ (${(SQUAD_BUDGET - totalSpent).toFixed(1)} remaining)`);
      setTimeout(() => setBudgetError(null), 3500);
      return;
    }

    if (selectedSlot.type === 'starter') {
      setStarters((prev) => {
        const next = [...prev];
        next[selectedSlot.index] = player;
        return next;
      });
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
  }, [selectedSlot, selectedIds, starters, bench, formation, totalSpent]);

  const handleReset = () => {
    setStarters(Array(11).fill(null));
    setBench(Array(3).fill(null));
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {windowLocked && transferWindow && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 md:px-8 py-3 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">🔒</span>
          <div>
            <p className="text-red-400 font-black text-sm uppercase tracking-widest">Squad editing is locked</p>
            <p className="text-red-400/70 text-xs mt-0.5">
              {transferWindow.round !== null
                ? `Round ${transferWindow.round} is in progress. The transfer window opens once all Round ${transferWindow.round} matches finish.`
                : transferWindow.reason}
            </p>
          </div>
        </div>
      )}
      {/* Page header */}
      <div className="border-b border-gray-800 px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-green-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-0.5">World Cup 2026</p>
          <h1 className="text-xl font-black uppercase">Pick Your Squad</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Formation selector */}
          <div className="flex flex-wrap gap-1 bg-[#111] border border-gray-800 rounded-xl p-1">
            {FORMATION_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => { setFormation(f as Formation); setStarters(Array(11).fill(null)); setSelectedSlot(null); }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
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

        {/* Left — pitch + bench + budget */}
        <div className="lg:w-[420px] flex-shrink-0 flex flex-col gap-4">
          {/* Pitch */}
          <Pitch
            formation={formation}
            starters={starters}
            selectedSlot={selectedSlot?.type === 'starter' ? selectedSlot.index : null}
            onSlotClick={(i) => handleSlotClick('starter', i)}
          />

          {/* Budget bar */}
          <BudgetBar spent={totalSpent} budget={SQUAD_BUDGET} />

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
                  className={`flex-1 flex flex-col items-start gap-1 px-3 py-2 rounded-xl border text-left transition-all ${
                    selectedSlot?.type === 'bench' && selectedSlot.index === i
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-gray-700 bg-[#0d0d0d] hover:border-gray-600'
                  }`}
                >
                  {player ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                          player.position === 'GK' ? 'bg-yellow-500/20 text-yellow-400' :
                          player.position === 'DEF' ? 'bg-blue-500/20 text-blue-400' :
                          player.position === 'MID' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>{player.position}</span>
                        <span className="text-xs font-bold text-white truncate">{player.name.split(' ').slice(-1)[0]}</span>
                      </div>
                      <span className="text-[9px] text-green-400 font-bold">{player.price.toFixed(1)} INJ</span>
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
              {lastSaved && (
                <p className="text-[9px] text-gray-600 mt-0.5">
                  Last saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!isConnected ? (
                <span key="no-wallet" className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Connect wallet
                </span>
              ) : saveStatus === 'saving' ? (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  Saving…
                </motion.span>
              ) : saveStatus === 'saved' ? (
                <motion.span key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} className="text-green-400 text-sm font-black uppercase tracking-widest">
                  ✓ On-chain!
                </motion.span>
              ) : saveStatus === 'loading' ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-gray-400 text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Loading…
                </motion.span>
              ) : saveStatus === 'error' ? (
                <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400 text-xs font-bold uppercase tracking-widest">
                  ✗ Failed
                </motion.span>
              ) : windowLocked ? (
                <motion.button key="locked" disabled
                  className="bg-gray-800 text-gray-600 font-black uppercase tracking-widest text-xs px-6 py-2.5 rounded-xl cursor-not-allowed flex items-center gap-2">
                  <span>🔒</span> Locked
                </motion.button>
              ) : (
                <motion.button key="save" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={saveSquad}
                  disabled={totalSelected < 11 || totalSpent > SQUAD_BUDGET}
                  className="bg-green-500 disabled:bg-gray-800 disabled:text-gray-600 text-black font-black uppercase tracking-widest text-xs px-6 py-2.5 rounded-xl transition-colors">
                  Save Squad
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right — player pool */}
        <div className="flex-1 min-h-[500px]">
          {/* Banners */}
          <AnimatePresence>
            {selectedSlot && !positionError && !budgetError && (
              <motion.div
                key="hint"
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

          <AnimatePresence>
            {positionError && (
              <motion.div
                key="pos-error"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: [12, -8, 6, -4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <span>⛔</span> {positionError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {budgetError && (
              <motion.div
                key="budget-error"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: [12, -8, 6, -4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-3 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <span>💰</span> {budgetError}
              </motion.div>
            )}
          </AnimatePresence>

          <PlayerPool
            selectedIds={selectedIds}
            positionHint={positionHint}
            onSelect={handlePlayerSelect}
            formation={formation}
            remainingBudget={SQUAD_BUDGET - totalSpent}
          />
        </div>
      </div>
    </div>
  );
}
