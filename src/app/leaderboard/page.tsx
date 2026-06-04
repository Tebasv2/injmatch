'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLAYERS } from '@/lib/players';
import type { Player } from '@/types/squad';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  formation: string;
  totalPoints: number;
  weekPoints: number;
  squadValue: number;
  starterIds: string[];
  benchIds: string[];
  savedAt: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function shortAddr(addr: string) {
  if (addr.length < 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

function squadValue(starterIds: string[], benchIds: string[]) {
  const all = [...starterIds, ...benchIds].filter(Boolean);
  return all.reduce((sum, id) => {
    const p = PLAYERS.find((pl) => pl.id === id);
    return sum + (p?.price ?? 0);
  }, 0);
}

function topPlayers(starterIds: string[]): Player[] {
  return starterIds
    .filter(Boolean)
    .map((id) => PLAYERS.find((p) => p.id === id))
    .filter(Boolean) as Player[];
}

const POSITION_DOT: Record<string, string> = {
  GK: 'bg-yellow-400',
  DEF: 'bg-blue-400',
  MID: 'bg-green-400',
  FWD: 'bg-red-400',
};

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

// ─── Mock data — replace with on-chain query once contract has list_squads ─────

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    address: 'inj1abc123def456ghi789jkl012mno345pqr678stu',
    displayName: 'CryptoManager',
    formation: '4-3-3',
    totalPoints: 347,
    weekPoints: 62,
    squadValue: 98.5,
    starterIds: ['mbappe','ronaldo','bellingham','salah','vinicius','modric','pedri','trent','vandijk','militao','alisson'],
    benchIds: ['rashford','kimmich','dias'],
    savedAt: Date.now() / 1000 - 3600,
  },
  {
    rank: 2,
    address: 'inj1xyz987wvu654tsr321qpo098nml765kji432hgf',
    displayName: 'InjFPLKing',
    formation: '4-2-3-1',
    totalPoints: 331,
    weekPoints: 58,
    squadValue: 97.0,
    starterIds: ['haaland','mbappe','bellingham','salah','vinicius','kimmich','pedri','hakimi','vandijk','dias','courtois'],
    benchIds: ['rashford','modric','gvardiol'],
    savedAt: Date.now() / 1000 - 7200,
  },
  {
    rank: 3,
    address: 'inj1lmn456opq789rst012uvw345xyz678abc901def',
    displayName: 'WC2026Bull',
    formation: '3-5-2',
    totalPoints: 318,
    weekPoints: 55,
    squadValue: 99.5,
    starterIds: ['ronaldo','haaland','mbappe','vinicius','bellingham','modric','pedri','salah','vandijk','rudiger','alisson'],
    benchIds: ['oblak','cancelo','rashford'],
    savedAt: Date.now() / 1000 - 10800,
  },
  {
    rank: 4, address: 'inj1aaa111bbb222ccc333ddd444eee555fff666ggg', displayName: 'GalacticoFC',
    formation: '4-3-3', totalPoints: 304, weekPoints: 49, squadValue: 95.0,
    starterIds: ['mbappe','vinicius','bellingham','modric','pedri','kimmich','hakimi','vandijk','militao','gvardiol','courtois'],
    benchIds: ['salah','dias','rashford'], savedAt: Date.now() / 1000 - 14400,
  },
  {
    rank: 5, address: 'inj1bbb222ccc333ddd444eee555fff666ggg777hhh', displayName: 'TacticsMaster',
    formation: '4-4-2', totalPoints: 291, weekPoints: 47, squadValue: 94.0,
    starterIds: ['ronaldo','haaland','salah','vinicius','bellingham','modric','pedri','trent','vandijk','dias','alisson'],
    benchIds: ['oblak','hakimi','kimmich'], savedAt: Date.now() / 1000 - 18000,
  },
  {
    rank: 6, address: 'inj1ccc333ddd444eee555fff666ggg777hhh888iii', displayName: 'InjWinner',
    formation: '4-3-3', totalPoints: 279, weekPoints: 45, squadValue: 93.5,
    starterIds: ['mbappe','bellingham','salah','pedri','kimmich','modric','hakimi','vandijk','rudiger','dias','courtois'],
    benchIds: ['haaland','gvardiol','rashford'], savedAt: Date.now() / 1000 - 21600,
  },
  {
    rank: 7, address: 'inj1ddd444eee555fff666ggg777hhh888iii999jjj', displayName: 'Blockchain11',
    formation: '4-2-3-1', totalPoints: 265, weekPoints: 41, squadValue: 91.0,
    starterIds: ['haaland','mbappe','salah','vinicius','bellingham','modric','trent','vandijk','militao','gvardiol','alisson'],
    benchIds: ['pedri','hakimi','dias'], savedAt: Date.now() / 1000 - 25200,
  },
  {
    rank: 8, address: 'inj1eee555fff666ggg777hhh888iii999jjj000kkk', displayName: 'DefiSquad',
    formation: '3-5-2', totalPoints: 251, weekPoints: 38, squadValue: 90.5,
    starterIds: ['ronaldo','vinicius','salah','bellingham','pedri','kimmich','modric','vandijk','militao','dias','courtois'],
    benchIds: ['mbappe','hakimi','rashford'], savedAt: Date.now() / 1000 - 28800,
  },
  {
    rank: 9, address: 'inj1fff666ggg777hhh888iii999jjj000kkk111lll', displayName: 'Web3Gaffer',
    formation: '4-3-3', totalPoints: 238, weekPoints: 35, squadValue: 89.0,
    starterIds: ['mbappe','haaland','bellingham','salah','kimmich','pedri','hakimi','vandijk','rudiger','gvardiol','alisson'],
    benchIds: ['vinicius','modric','dias'], savedAt: Date.now() / 1000 - 32400,
  },
  {
    rank: 10, address: 'inj1ggg777hhh888iii999jjj000kkk111lll222mmm', displayName: 'TopElevenINJ',
    formation: '4-4-2', totalPoints: 224, weekPoints: 32, squadValue: 88.0,
    starterIds: ['ronaldo','salah','vinicius','bellingham','modric','pedri','trent','vandijk','militao','dias','courtois'],
    benchIds: ['mbappe','hakimi','gvardiol'], savedAt: Date.now() / 1000 - 36000,
  },
  {
    rank: 11, address: 'inj1hhh888iii999jjj000kkk111lll222mmm333nnn', displayName: 'FantasyChain',
    formation: '4-3-3', totalPoints: 211, weekPoints: 28, squadValue: 86.5,
    starterIds: ['haaland','mbappe','bellingham','kimmich','pedri','salah','hakimi','vandijk','rudiger','dias','alisson'],
    benchIds: ['vinicius','modric','cancelo'], savedAt: Date.now() / 1000 - 39600,
  },
  {
    rank: 12, address: 'inj1iii999jjj000kkk111lll222mmm333nnn444ooo', displayName: 'CosmosPick',
    formation: '4-2-3-1', totalPoints: 198, weekPoints: 25, squadValue: 85.0,
    starterIds: ['ronaldo','vinicius','salah','bellingham','modric','pedri','trent','vandijk','militao','gvardiol','courtois'],
    benchIds: ['haaland','kimmich','dias'], savedAt: Date.now() / 1000 - 43200,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function MiniSquad({ entry }: { entry: LeaderboardEntry }) {
  const players = topPlayers(entry.starterIds);
  const byPos = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const p of players) byPos[p.position]++;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {(['GK','DEF','MID','FWD'] as const).map((pos) =>
        byPos[pos] > 0 ? (
          <span key={pos} className="flex items-center gap-0.5 text-xs text-white/40">
            <span className={`w-1.5 h-1.5 rounded-full ${POSITION_DOT[pos]}`} />
            {byPos[pos]}{pos}
          </span>
        ) : null
      )}
      <span className="text-white/25 text-xs ml-1">· {entry.formation}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return <span className="text-xl leading-none">{RANK_MEDAL[rank]}</span>;
  }
  return (
    <span className={`text-sm font-bold tabular-nums w-7 text-center ${
      rank <= 10 ? 'text-emerald-400' : 'text-white/40'
    }`}>
      {rank}
    </span>
  );
}

function TopCard({ entry }: { entry: LeaderboardEntry }) {
  const sizeClass = entry.rank === 1
    ? 'col-span-1 md:col-span-1 order-first md:order-none scale-105'
    : '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (entry.rank - 1) * 0.1 }}
      className={`relative rounded-2xl border overflow-hidden ${sizeClass} ${
        entry.rank === 1
          ? 'border-yellow-400/50 bg-gradient-to-b from-yellow-500/10 to-white/3'
          : entry.rank === 2
          ? 'border-slate-400/40 bg-gradient-to-b from-slate-400/8 to-white/3'
          : 'border-amber-600/30 bg-gradient-to-b from-amber-700/8 to-white/3'
      }`}
    >
      {entry.rank === 1 && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      )}
      <div className="p-5 text-center space-y-2">
        <div className="text-3xl">{RANK_MEDAL[entry.rank]}</div>
        <div className="font-bold text-white text-base">{entry.displayName}</div>
        <div className="text-white/40 text-xs font-mono">{shortAddr(entry.address)}</div>
        <div className={`text-3xl font-black tabular-nums ${
          entry.rank === 1 ? 'text-yellow-400' : 'text-white'
        }`}>
          {entry.totalPoints}
          <span className="text-sm font-normal text-white/40 ml-1">pts</span>
        </div>
        <div className="text-xs text-emerald-400">+{entry.weekPoints} this week</div>
        <MiniSquad entry={entry} />
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ entry, isYou }: { entry: LeaderboardEntry; isYou?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const players = topPlayers(entry.starterIds);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(entry.rank * 0.03, 0.5) }}
        onClick={() => setExpanded(v => !v)}
        className={`border-b cursor-pointer transition-colors ${
          isYou
            ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
            : entry.rank <= 10
            ? 'border-white/8 hover:bg-white/4'
            : 'border-white/5 hover:bg-white/3'
        }`}
      >
        {/* Rank */}
        <td className="py-3 pl-4 pr-2 w-10">
          <div className="flex justify-center">
            <RankBadge rank={entry.rank} />
          </div>
        </td>
        {/* Name */}
        <td className="py-3 px-2">
          <div className="flex flex-col gap-0.5">
            <span className={`font-semibold text-sm ${
              isYou ? 'text-emerald-400' : entry.rank <= 10 ? 'text-white' : 'text-white/70'
            }`}>
              {entry.displayName}
              {isYou && <span className="ml-2 text-xs font-normal text-emerald-400/70">(you)</span>}
            </span>
            <span className="text-white/30 text-xs font-mono hidden sm:block">
              {shortAddr(entry.address)}
            </span>
          </div>
        </td>
        {/* Formation */}
        <td className="py-3 px-2 text-center hidden md:table-cell">
          <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
            {entry.formation}
          </span>
        </td>
        {/* Squad value */}
        <td className="py-3 px-2 text-right hidden lg:table-cell">
          <span className="text-xs text-white/40">
            {squadValue(entry.starterIds, entry.benchIds).toFixed(1)} INJ
          </span>
        </td>
        {/* Week pts */}
        <td className="py-3 px-2 text-right">
          <span className="text-xs text-emerald-400/70">+{entry.weekPoints}</span>
        </td>
        {/* Total */}
        <td className="py-3 pl-2 pr-4 text-right">
          <span className={`font-bold tabular-nums text-sm ${
            entry.rank <= 3 ? 'text-yellow-400' : entry.rank <= 10 ? 'text-white' : 'text-white/60'
          }`}>
            {entry.totalPoints}
          </span>
        </td>
      </motion.tr>

      {/* Expanded squad preview */}
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={6} className="px-4 pb-3 pt-0 bg-white/2">
              <div className="flex flex-wrap gap-1.5 pt-2">
                {players.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${POSITION_DOT[p.position]}`} />
                    <span className="text-white/70">{p.shortName}</span>
                    <span className="text-white/30">{p.price}◈</span>
                  </span>
                ))}
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'overall' | 'weekly'>('overall');

  // In production this would be the connected wallet address
  const myAddress = '';

  const sorted = [...MOCK_LEADERBOARD].sort((a, b) =>
    tab === 'weekly' ? b.weekPoints - a.weekPoints : b.totalPoints - a.totalPoints,
  );

  const filtered = search
    ? sorted.filter(
        (e) =>
          e.displayName.toLowerCase().includes(search.toLowerCase()) ||
          e.address.includes(search),
      )
    : sorted;

  const top3 = sorted.slice(0, 3);
  const rest  = filtered.slice(search ? 0 : 3);
  const myEntry = myAddress
    ? sorted.find((e) => e.address === myAddress)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-10 relative">
          <h1 className="text-3xl font-black text-white tracking-tight">Leaderboard</h1>
          <p className="text-white/40 mt-1 text-sm">
            FPL-style points across all WC2026 matches · {MOCK_LEADERBOARD.length} managers
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Top 3 podium */}
        {!search && (
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* Silver — 2nd */}
            <TopCard entry={top3[1]} />
            {/* Gold — 1st (center, taller) */}
            <TopCard entry={top3[0]} />
            {/* Bronze — 3rd */}
            <TopCard entry={top3[2]} />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-lg overflow-hidden border border-white/10 text-sm">
            {(['overall', 'weekly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 capitalize transition-colors ${
                  tab === t ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {t === 'overall' ? 'Overall' : 'This Week'}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manager or address…"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* My rank banner */}
        {myEntry && (
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
            <div>
              <span className="text-xs text-emerald-400/70 block">Your rank</span>
              <span className="font-bold text-emerald-400 text-lg">#{myEntry.rank}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/40 block">Total points</span>
              <span className="font-bold text-white text-lg">{myEntry.totalPoints}</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          {/* Top 10 section label */}
          {!search && (
            <div className="px-4 py-2 bg-emerald-500/8 border-b border-emerald-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                Top 10
              </span>
            </div>
          )}

          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/30 uppercase tracking-wide">
                <th className="py-2.5 pl-4 pr-2 text-center w-10">#</th>
                <th className="py-2.5 px-2 text-left">Manager</th>
                <th className="py-2.5 px-2 text-center hidden md:table-cell">Formation</th>
                <th className="py-2.5 px-2 text-right hidden lg:table-cell">Value</th>
                <th className="py-2.5 px-2 text-right">Week</th>
                <th className="py-2.5 pl-2 pr-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(search ? filtered : sorted.slice(0, 10)).map((entry) => (
                <LeaderboardRow
                  key={entry.address}
                  entry={entry}
                  isYou={entry.address === myAddress}
                />
              ))}
            </tbody>
          </table>

          {/* Divider between top 10 and rest */}
          {!search && sorted.length > 10 && (
            <>
              <div className="px-4 py-2 bg-white/3 border-y border-white/8 flex items-center gap-2">
                <span className="text-xs text-white/25 font-semibold tracking-wide uppercase">
                  Others
                </span>
              </div>
              <table className="w-full">
                <tbody>
                  {sorted.slice(10).map((entry) => (
                    <LeaderboardRow
                      key={entry.address}
                      entry={entry}
                      isYou={entry.address === myAddress}
                    />
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <p className="text-center text-xs text-white/20">
          Points calculated from live WC2026 match data · Updated after each match
        </p>
      </div>
    </div>
  );
}
