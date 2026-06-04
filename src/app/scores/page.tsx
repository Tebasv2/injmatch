'use client';

import { useState } from 'react';
import type { ScoredPlayer } from '@/types/scoring';

interface MatchResult {
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  score: { home: number; away: number };
  players: ScoredPlayer[];
}

const POSITION_COLOR: Record<string, string> = {
  GK:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  DEF: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  MID: 'bg-green-500/20 text-green-300 border-green-500/30',
  FWD: 'bg-red-500/20 text-red-300 border-red-500/30',
};

function BreakdownRow({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  return (
    <div className="flex justify-between text-xs">
      <span className="text-white/50">{label}</span>
      <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
        {value > 0 ? '+' : ''}{value}
      </span>
    </div>
  );
}

function PlayerRow({ p }: { p: ScoredPlayer }) {
  const [open, setOpen] = useState(false);
  const b = p.breakdown;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${POSITION_COLOR[p.position]}`}>
          {p.position}
        </span>
        <span className="flex-1 font-medium text-white/90 text-sm">{p.playerName}</span>
        {b.missingFields.length > 0 && (
          <span className="text-xs text-yellow-400/70" title={`Missing: ${b.missingFields.join(', ')}`}>⚠</span>
        )}
        <span className={`text-lg font-bold tabular-nums ${b.total >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {b.total}
        </span>
        <span className="text-white/30 text-xs ml-1">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-3 pt-1 bg-white/2 space-y-1 border-t border-white/5">
          <BreakdownRow label="Appearance"        value={b.appearance} />
          <BreakdownRow label="Goals"             value={b.goals} />
          <BreakdownRow label="Assists"           value={b.assists} />
          <BreakdownRow label="Clean Sheet"       value={b.cleanSheet} />
          <BreakdownRow label="GK Saves (÷3)"    value={b.saves} />
          <BreakdownRow label="Penalty Saves"     value={b.penaltySaves} />
          <BreakdownRow label="Def. Actions (÷10)" value={b.defensiveActions} />
          <BreakdownRow label="BPS Bonus"         value={b.bpsBonus} />
          <BreakdownRow label="Goals Conceded"    value={b.goalsConceded} />
          <BreakdownRow label="Penalty Misses"    value={b.penaltyMisses} />
          <BreakdownRow label="Yellow Card"       value={b.yellowCards} />
          <BreakdownRow label="Red Card"          value={b.redCards} />
          <BreakdownRow label="Own Goals"         value={b.ownGoals} />
          <div className="pt-1 flex justify-between font-bold text-sm border-t border-white/10 mt-1">
            <span className="text-white/60">Total</span>
            <span className={b.total >= 0 ? 'text-emerald-400' : 'text-red-400'}>{b.total} pts</span>
          </div>
          {b.missingFields.length > 0 && (
            <p className="text-xs text-yellow-400/60 pt-1">
              ⚠ Missing data: {b.missingFields.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScoresPage() {
  const [matchId, setMatchId]   = useState('');
  const [homeGoals, setHome]    = useState('');
  const [awayGoals, setAway]    = useState('');
  const [result, setResult]     = useState<MatchResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');

  async function fetchScores() {
    if (!matchId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams();
      if (homeGoals !== '' && awayGoals !== '') {
        params.set('homeGoals', homeGoals);
        params.set('awayGoals', awayGoals);
      }
      const res = await fetch(`/api/score-match/${matchId.trim()}?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const players = result
    ? (filter === 'ALL' ? result.players : result.players.filter(p => p.position === filter))
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Match Scores</h1>
          <p className="text-white/50 text-sm mt-1">
            Enter an API-Football fixture ID to calculate FPL-style points for every player.
          </p>
        </div>

        {/* Lookup form */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-white/50 block mb-1">API-Football Fixture ID</label>
            <input
              type="number"
              value={matchId}
              onChange={e => setMatchId(e.target.value)}
              placeholder="e.g. 1035029"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-white/50 block mb-1">Home Goals</label>
              <input
                type="number"
                value={homeGoals}
                onChange={e => setHome(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-white/50 block mb-1">Away Goals</label>
              <input
                type="number"
                value={awayGoals}
                onChange={e => setAway(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <p className="text-xs text-white/30">
            Score is required to compute clean sheets and goals-conceded deductions.
            If you have a football-data.org match ID, add <code className="text-white/50">?fdMatchId=ID</code> to the URL instead.
          </p>
          <button
            onClick={fetchScores}
            disabled={loading || !matchId.trim()}
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
          >
            {loading ? 'Calculating…' : 'Calculate Points'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">
                Fixture <span className="text-white font-mono">{result.fixtureId}</span>
                {' · '}
                <span className="text-white font-semibold">{result.score.home} – {result.score.away}</span>
                {' · '}
                {result.players.length} players
              </div>
              <div className="flex gap-1">
                {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map(pos => (
                  <button
                    key={pos}
                    onClick={() => setFilter(pos)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      filter === pos
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {players.map(p => (
                <PlayerRow key={p.playerId} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
