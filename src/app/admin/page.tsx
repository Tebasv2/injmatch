'use client';

import { useState, useEffect } from 'react';
import { useWalletContext } from '@/components/wallet/WalletProvider';
import { useContract } from '@/hooks/useContract';
import type { ScoredPlayer } from '@/types/scoring';

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS ?? '';

// ─── Auth gate ─────────────────────────────────────────────────────────────────

function AccessDenied({ address }: { address: string | null }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="text-5xl">🔒</div>
        <h1 className="text-xl font-bold text-white">Admin only</h1>
        <p className="text-white/40 text-sm">
          {address
            ? 'This wallet does not have admin access.'
            : 'Connect your admin wallet to continue.'}
        </p>
        {address && (
          <p className="text-xs font-mono text-white/20 break-all">{address}</p>
        )}
      </div>
    </div>
  );
}

// ─── Match scorer panel ────────────────────────────────────────────────────────

interface MatchResult {
  fixtureId: number;
  score: { home: number; away: number };
  players: ScoredPlayer[];
}

const POS_COLOR: Record<string, string> = {
  GK: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  DEF: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  MID: 'text-green-400 bg-green-400/10 border-green-400/20',
  FWD: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function ScoreRow({ p }: { p: ScoredPlayer }) {
  const [open, setOpen] = useState(false);
  const b = p.breakdown;
  return (
    <div className="border border-white/8 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/4 transition-colors text-left"
      >
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${POS_COLOR[p.position]}`}>
          {p.position}
        </span>
        <span className="flex-1 text-sm text-white/80">{p.playerName}</span>
        {b.missingFields.length > 0 && (
          <span className="text-yellow-400/60 text-xs" title={`Missing: ${b.missingFields.join(', ')}`}>⚠</span>
        )}
        <span className={`font-bold tabular-nums ${b.total >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {b.total} pts
        </span>
        <span className="text-white/20 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 bg-white/2 border-t border-white/5 space-y-1 text-xs">
          {[
            ['Appearance',        b.appearance],
            ['Goals',             b.goals],
            ['Assists',           b.assists],
            ['Clean Sheet',       b.cleanSheet],
            ['GK Saves (÷3)',     b.saves],
            ['Penalty Saves',     b.penaltySaves],
            ['Def. Actions (÷10)', b.defensiveActions],
            ['BPS Bonus',         b.bpsBonus],
            ['Goals Conceded',    b.goalsConceded],
            ['Penalty Misses',    b.penaltyMisses],
            ['Yellow Card',       b.yellowCards],
            ['Red Card',          b.redCards],
            ['Own Goals',         b.ownGoals],
          ].filter(([, v]) => (v as number) !== 0).map(([label, v]) => (
            <div key={label as string} className="flex justify-between">
              <span className="text-white/40">{label}</span>
              <span className={(v as number) > 0 ? 'text-emerald-400' : 'text-red-400'}>
                {(v as number) > 0 ? '+' : ''}{v as number}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-1 border-t border-white/10">
            <span className="text-white/50">Total</span>
            <span className={b.total >= 0 ? 'text-emerald-400' : 'text-red-400'}>{b.total}</span>
          </div>
          {b.missingFields.length > 0 && (
            <p className="text-yellow-400/50 pt-1">⚠ Missing: {b.missingFields.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
}

function MatchScorer({ adminAddress }: { adminAddress: string }) {
  const [matchId,   setMatchId]  = useState('');
  const [homeGoals, setHome]     = useState('');
  const [awayGoals, setAway]     = useState('');
  const [result,    setResult]   = useState<MatchResult | null>(null);
  const [loading,   setLoading]  = useState(false);
  const [error,     setError]    = useState<string | null>(null);
  const [filter,    setFilter]   = useState<'ALL'|'GK'|'DEF'|'MID'|'FWD'>('ALL');
  const [submitStatus, setSubmitStatus] = useState<'idle'|'submitting'|'done'|'error'>('idle');
  const [submitTx,     setSubmitTx]     = useState<string | null>(null);
  const contract = useContract(adminAddress);

  async function run() {
    if (!matchId.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const params = new URLSearchParams();
      if (homeGoals !== '' && awayGoals !== '') {
        params.set('homeGoals', homeGoals);
        params.set('awayGoals', awayGoals);
      }
      const res  = await fetch(`/api/score-match/${matchId.trim()}?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitOnChain() {
    if (!result) return;
    setSubmitStatus('submitting');
    setSubmitTx(null);
    try {
      const playerScores = result.players.map(p => ({
        player_id: p.playerId,
        points: p.breakdown.total,
      }));
      const tx = await contract.submitPlayerScores(String(result.fixtureId), playerScores);
      setSubmitTx((tx as any).transactionHash ?? 'submitted');
      setSubmitStatus('done');
    } catch (e: any) {
      setError(e.message ?? 'Submit failed');
      setSubmitStatus('error');
    }
  }

  async function runCron() {
    setLoading(true); setError(null);
    try {
      const res  = await fetch('/api/cron/check-matches');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Cron failed');
      alert(JSON.stringify(data, null, 2));
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
    <div className="space-y-6">
      {/* Manual match scorer */}
      <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-white text-sm uppercase tracking-wide">Score a Match</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs text-white/40 block mb-1">API-Football Fixture ID</label>
            <input
              type="number" value={matchId} onChange={e => setMatchId(e.target.value)}
              placeholder="e.g. 1035029"
              className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Home Goals</label>
            <input
              type="number" value={homeGoals} onChange={e => setHome(e.target.value)}
              min="0" placeholder="0"
              className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Away Goals</label>
            <input
              type="number" value={awayGoals} onChange={e => setAway(e.target.value)}
              min="0" placeholder="0"
              className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={run}
            disabled={loading || !matchId.trim()}
            className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 font-semibold text-sm transition-colors"
          >
            {loading ? 'Calculating…' : 'Calculate Points'}
          </button>
          <button
            onClick={runCron}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-white/8 hover:bg-white/12 disabled:opacity-40 text-sm text-white/70 transition-colors border border-white/10"
            title="Manually trigger the match-check cron"
          >
            Run Cron
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}</div>
      )}

      {result && (
        <div className="space-y-3">
          {/* Submit on-chain banner */}
          <div className="bg-white/4 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Ready to submit on-chain?</p>
              <p className="text-xs text-white/40 mt-0.5">
                This will sign a transaction crediting every manager's squad with points from fixture {result.fixtureId}.
                Captain gets ×2, vice-captain gets ×1.5.
              </p>
              {submitTx && (
                <p className="text-xs text-emerald-400 mt-1 font-mono break-all">✓ TX: {submitTx}</p>
              )}
            </div>
            <button
              onClick={submitOnChain}
              disabled={submitStatus === 'submitting' || submitStatus === 'done'}
              className={`flex-shrink-0 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                submitStatus === 'done'
                  ? 'bg-emerald-700 text-emerald-200 cursor-default'
                  : submitStatus === 'error'
                  ? 'bg-red-600/30 border border-red-500/40 text-red-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50'
              }`}
            >
              {submitStatus === 'submitting' ? 'Signing…' : submitStatus === 'done' ? '✓ Submitted' : 'Submit On-Chain'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/50">
              Fixture <span className="text-white font-mono">{result.fixtureId}</span>
              {' · '}
              <span className="text-white font-semibold">{result.score.home} – {result.score.away}</span>
              {' · '}{result.players.length} players
            </div>
            <div className="flex gap-1">
              {(['ALL','GK','DEF','MID','FWD'] as const).map(pos => (
                <button key={pos} onClick={() => setFilter(pos)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${filter === pos ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {pos}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            {players.map(p => <ScoreRow key={p.playerId} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Transfer window card ──────────────────────────────────────────────────────

function TransferWindowCard() {
  const [status, setStatus] = useState<{ open: boolean; round: number | null; reason: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch('/api/transfer-window');
    const data = await res.json();
    setStatus(data);
  }

  useEffect(() => { refresh(); }, []);

  async function setOverride(value: 'open' | 'closed' | 'auto') {
    setLoading(true);
    try {
      await fetch('/api/transfer-window', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET ?? '',
        },
        body: JSON.stringify({ override: value }),
      });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-4">
      <h2 className="font-bold text-white text-sm uppercase tracking-wide">Transfer Window</h2>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
          status === null
            ? 'border-white/10 text-white/30 bg-white/5'
            : status.open
              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
              : 'border-red-500/30 text-red-400 bg-red-500/10'
        }`}>
          {status === null ? 'Loading…' : status.open ? 'Open' : 'Closed'}
        </span>
        {status && (
          <span className="text-xs text-white/40">{status.reason}</span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setOverride('open')}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wide disabled:opacity-40 transition-colors"
        >
          Force Open
        </button>
        <button
          onClick={() => setOverride('closed')}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wide disabled:opacity-40 transition-colors"
        >
          Force Close
        </button>
        <button
          onClick={() => setOverride('auto')}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-white/8 hover:bg-white/12 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wide disabled:opacity-40 transition-colors"
        >
          Auto
        </button>
      </div>
    </div>
  );
}

// ─── Stats overview cards ──────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/4 border border-white/10 rounded-xl p-4">
      <div className="text-xs text-white/40 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className="text-xs text-white/30 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { address } = useWalletContext();
  const isAdmin = ADMIN_ADDRESS ? address === ADMIN_ADDRESS : false;

  if (!isAdmin) return <AccessDenied address={address} />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="border-b border-white/8">
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Admin Panel</h1>
            <p className="text-white/30 text-xs mt-1 font-mono">{address}</p>
          </div>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full">
            ✓ Authenticated
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Matches Scored" value="0"    sub="WC2026 so far" />
          <StatCard label="Managers"        value="0"    sub="Squads saved" />
          <StatCard label="API Calls Left"  value="100"  sub="Today (free tier)" />
          <StatCard label="Last Cron"       value="—"    sub="Never run" />
        </div>

        {/* Transfer window */}
        <TransferWindowCard />

        {/* Match scorer */}
        <MatchScorer adminAddress={address!} />
      </div>
    </div>
  );
}
