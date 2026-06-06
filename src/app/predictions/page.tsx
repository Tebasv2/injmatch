'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletContext } from '@/components/wallet/WalletProvider';
import { useContract } from '@/hooks/useContract';
import { ALL_FIXTURES } from '@/lib/wc2026-fixtures';
import { formatInj } from '@/lib/injective';
import type { League, Prediction } from '@/types';
import type { WCMatch } from '@/lib/wc2026-fixtures';

// ── helpers ──────────────────────────────────────────────────────────────────

function now() { return Math.floor(Date.now() / 1000); }
function matchOpen(m: WCMatch) {
  return new Date(m.utcDate).getTime() > Date.now() && m.status === 'SCHEDULED';
}
function formatKickoff(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
    + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
}
function shortAddr(a: string) { return a.length > 14 ? `${a.slice(0, 7)}…${a.slice(-5)}` : a; }

// ── sub-components ────────────────────────────────────────────────────────────

function ScoreInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-6 h-6 rounded bg-gray-800 text-white text-xs hover:bg-gray-700 transition-colors">−</button>
      <span className="w-7 text-center font-black text-lg text-white tabular-nums">{value}</span>
      <button onClick={() => onChange(Math.min(20, value + 1))}
        className="w-6 h-6 rounded bg-gray-800 text-white text-xs hover:bg-gray-700 transition-colors">+</button>
    </div>
  );
}

function MatchPredictionRow({
  match, leagueId, address, existing, onSubmitted,
}: {
  match: WCMatch; leagueId: string; address: string;
  existing: Prediction | null; onSubmitted: () => void;
}) {
  const contract = useContract(address);
  const [home, setHome] = useState(existing?.home_score ?? 1);
  const [away, setAway] = useState(existing?.away_score ?? 0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!!existing);
  const [error, setError] = useState('');

  const open = matchOpen(match);

  async function submit() {
    setLoading(true); setError('');
    try {
      await contract.submitPrediction(leagueId, String(match.id), home, away);
      setDone(true);
      onSubmitted();
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
      done ? 'border-green-500/20 bg-green-500/5' : 'border-gray-800 bg-[#0f0f0f]'
    }`}>
      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-white font-bold truncate">
          <span>{match.homeTeam.crest}</span>
          <span className="truncate">{match.homeTeam.shortName}</span>
          <span className="text-gray-600 font-normal">vs</span>
          <span className="truncate">{match.awayTeam.shortName}</span>
          <span>{match.awayTeam.crest}</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">{formatKickoff(match.utcDate)}</p>
      </div>

      {/* Prediction controls */}
      {open && !done ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreInput value={home} onChange={setHome} />
          <span className="text-gray-600 text-xs font-bold">–</span>
          <ScoreInput value={away} onChange={setAway} />
          <button
            onClick={submit}
            disabled={loading}
            className="ml-1 px-3 py-1.5 rounded-lg bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 disabled:opacity-50 transition-colors"
          >
            {loading ? '…' : 'Lock In'}
          </button>
        </div>
      ) : done ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-black text-white tabular-nums">
            {existing?.home_score ?? home} – {existing?.away_score ?? away}
          </span>
          <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest border border-green-500/30 px-1.5 py-0.5 rounded">Saved</span>
        </div>
      ) : (
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Locked</span>
      )}

      {error && <p className="text-red-400 text-[10px] absolute">{error}</p>}
    </div>
  );
}

function LeaguePredictions({ league, address }: { league: League; address: string }) {
  const contract = useContract(address);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ address: string; points: number; rank: number }[]>([]);
  const [tab, setTab] = useState<'predict' | 'standings'>('predict');

  const load = useCallback(async () => {
    try {
      const [preds, lb] = await Promise.all([
        contract.getPredictions(league.id, address).catch(() => []),
        contract.getLeaderboard(league.id).catch(() => []),
      ]);
      setPredictions(preds as Prediction[]);
      setLeaderboard(lb as any[]);
    } catch {}
  }, [contract, league.id, address]);

  useEffect(() => { load(); }, [load]);

  const upcoming = ALL_FIXTURES.filter(m => matchOpen(m)).slice(0, 20);
  const predMap = Object.fromEntries(predictions.map(p => [p.match_id, p]));

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
      {/* League header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">{league.name}</h3>
          <p className="text-[10px] text-gray-600 mt-0.5">
            {league.participants.length} player{league.participants.length !== 1 ? 's' : ''} · Prize pool {formatInj(league.prize_pool)} INJ
          </p>
        </div>
        <div className="flex gap-1">
          {(['predict', 'standings'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                tab === t ? 'bg-blue-500 text-black' : 'text-gray-500 hover:text-white'
              }`}>
              {t === 'predict' ? 'Predict' : 'Standings'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-2">
        {tab === 'predict' ? (
          upcoming.length > 0 ? upcoming.map(m => (
            <MatchPredictionRow
              key={m.id} match={m} leagueId={league.id}
              address={address} existing={predMap[String(m.id)] ?? null}
              onSubmitted={load}
            />
          )) : (
            <p className="text-center text-gray-600 text-sm py-6">No upcoming matches right now</p>
          )
        ) : (
          leaderboard.length > 0 ? leaderboard.slice(0, 10).map((e, i) => (
            <div key={e.address} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0f0f0f]">
              <span className="text-xs font-black w-5 text-center text-gray-500">{i + 1}</span>
              <span className={`flex-1 text-xs font-mono ${e.address === address ? 'text-blue-400' : 'text-white/70'}`}>
                {shortAddr(e.address)}{e.address === address ? ' (you)' : ''}
              </span>
              <span className="text-sm font-black text-white tabular-nums">{e.points} <span className="text-[10px] text-gray-600 font-normal">pts</span></span>
            </div>
          )) : (
            <p className="text-center text-gray-600 text-sm py-6">Standings update after each match</p>
          )
        )}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function PredictionsPage() {
  const { address, isConnected } = useWalletContext();
  const contract = useContract(address);

  const [leagues, setLeagues]     = useState<League[]>([]);
  const [loading, setLoading]     = useState(true);
  const [joining, setJoining]     = useState<string | null>(null);
  const [joinError, setJoinError] = useState('');
  const [creating, setCreating]   = useState(false);
  const [newName, setNewName]     = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const loadLeagues = useCallback(async () => {
    if (!isConnected) { setLoading(false); return; }
    try {
      const list = await contract.listLeagues().catch(() => []);
      setLeagues(list as League[]);
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected]);

  useEffect(() => { loadLeagues(); }, [loadLeagues]);

  const myLeagues  = leagues.filter(l => address && l.participants.includes(address));
  const openLeagues = leagues.filter(l => l.status === 'open' && !(address && l.participants.includes(address)));

  async function joinLeague(league: League) {
    if (!address) return;
    setJoining(league.id); setJoinError('');
    try {
      await contract.joinLeague(league.id, league.entry_fee);
      await loadLeagues();
    } catch (e: any) {
      setJoinError(e?.message ?? 'Join failed');
    } finally {
      setJoining(null);
    }
  }

  async function createLeague() {
    if (!address || !newName.trim()) return;
    setCreating(true);
    try {
      await contract.createLeague(newName.trim(), '0', 100);
      setNewName(''); setShowCreate(false);
      await loadLeagues();
    } catch (e: any) {
      setJoinError(e?.message ?? 'Create failed');
    } finally {
      setCreating(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-3xl">🏆</p>
          <h2 className="text-lg font-black text-white uppercase tracking-widest">Connect Wallet</h2>
          <p className="text-sm text-gray-500">Connect your wallet to submit predictions and compete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-8 max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-1">Predictions</p>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Score Predictor</h1>
        <p className="text-sm text-gray-500 mt-1">Predict exact scores. Correct scoreline = 3 pts · Correct result = 1 pt</p>
      </div>

      {/* Scoring guide */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Exact Score', pts: '+3', color: 'text-green-400 border-green-500/20 bg-green-500/5' },
          { label: 'Correct Result', pts: '+1', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
          { label: 'Wrong', pts: '0', color: 'text-gray-500 border-gray-700 bg-gray-900' },
        ].map(r => (
          <div key={r.label} className={`rounded-xl border p-3 text-center ${r.color}`}>
            <p className="text-lg font-black">{r.pts}</p>
            <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5">{r.label}</p>
          </div>
        ))}
      </div>

      {/* My leagues */}
      {myLeagues.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold">My Leagues</p>
          {myLeagues.map(l => (
            <LeaguePredictions key={l.id} league={l} address={address!} />
          ))}
        </div>
      )}

      {/* Open leagues to join */}
      {openLeagues.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold">Open Leagues</p>
          {openLeagues.map(l => (
            <div key={l.id} className="bg-[#111] border border-gray-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-white">{l.name}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {l.participants.length}/{l.max_participants} players
                  {Number(l.entry_fee) > 0 ? ` · ${formatInj(l.entry_fee)} INJ entry` : ' · Free'}
                </p>
              </div>
              <button
                onClick={() => joinLeague(l)}
                disabled={joining === l.id}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500 text-black hover:bg-blue-400 disabled:opacity-50 transition-colors"
              >
                {joining === l.id ? '…' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create league */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold">Start a League</p>
          <button onClick={() => setShowCreate(v => !v)}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest transition-colors">
            {showCreate ? 'Cancel' : '+ New League'}
          </button>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-[#111] border border-gray-800 rounded-2xl p-4 space-y-3">
              <input
                value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="League name (e.g. Office WC League)"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button onClick={createLeague} disabled={!newName.trim() || creating}
                className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-500 text-black hover:bg-blue-400 disabled:opacity-40 transition-colors">
                {creating ? 'Creating…' : 'Create League (Free)'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {joinError && (
        <p className="text-red-400 text-xs text-center">{joinError}</p>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && leagues.length === 0 && (
        <div className="text-center py-8 text-gray-600 text-sm">
          No leagues yet — create one and invite friends
        </div>
      )}
    </div>
  );
}
