'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLAYERS } from '@/lib/players';
import { useWalletContext } from '@/components/wallet/WalletProvider';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainGrpcWasmApi, toBase64, fromBase64 } from '@injectivelabs/sdk-ts';
import { ENDPOINTS } from '@/lib/network';
import { NFT_BOOST_MULTIPLIER } from '@/hooks/useNFTBoost';
import { useProfile } from '@/hooks/useProfile';
import type { Player } from '@/types/squad';

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ?? '';

async function hasNFTBoost(address: string): Promise<boolean> {
  if (!NFT_CONTRACT) return false;
  try {
    const wasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
    const res = await wasmApi.fetchSmartContractState(
      NFT_CONTRACT,
      toBase64({ tokens: { owner: address, limit: 1 } }),
    );
    const data = fromBase64(res.data as unknown as string) as { ids?: string[] };
    return Array.isArray(data?.ids) && data.ids.length > 0;
  } catch {
    return false;
  }
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  formation: string;
  totalPoints: number;
  weekPoints: number;
  boosted: boolean;
  starterIds: string[];
  benchIds: string[];
}

const POSITION_DOT: Record<string, string> = {
  GK: 'bg-yellow-400', DEF: 'bg-blue-400', MID: 'bg-green-400', FWD: 'bg-red-400',
};

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const CONTRACT  = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';
const RPC       = 'https://testnet.sentry.tm.injective.network:443';

function shortAddr(addr: string) {
  if (addr.length < 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

function topPlayers(starterIds: string[]): Player[] {
  return starterIds.filter(Boolean).map(id => PLAYERS.find(p => p.id === id)).filter(Boolean) as Player[];
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <span className="text-xl leading-none">{RANK_MEDAL[rank]}</span>;
  return <span className="text-sm font-bold tabular-nums w-7 text-center text-emerald-400">{rank}</span>;
}

function TopCard({ entry, order }: { entry: LeaderboardEntry; order: number }) {
  const isFirst = entry.rank === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: order * 0.1 }}
      className={`relative rounded-2xl border overflow-hidden ${isFirst ? 'md:-mt-4' : ''} ${
        entry.rank === 1 ? 'border-yellow-400/50 bg-gradient-to-b from-yellow-500/10 to-white/3'
        : entry.rank === 2 ? 'border-slate-400/40 bg-gradient-to-b from-slate-400/8 to-white/3'
        : 'border-amber-600/30 bg-gradient-to-b from-amber-700/8 to-white/3'
      }`}
    >
      {isFirst && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />}
      <div className="p-3 sm:p-5 text-center space-y-1.5">
        <div className="text-2xl sm:text-3xl">{RANK_MEDAL[entry.rank]}</div>
        <div className="text-white/30 text-[10px] font-mono">{shortAddr(entry.address)}</div>
        <div className={`text-xl sm:text-3xl font-black tabular-nums ${isFirst ? 'text-yellow-400' : 'text-white'}`}>
          {entry.totalPoints}<span className="text-xs sm:text-sm font-normal text-white/40 ml-1">pts</span>
        </div>
        <div className="text-[10px] sm:text-xs text-emerald-400">+{entry.weekPoints} wk</div>
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ entry, isYou, username, avatar }: { entry: LeaderboardEntry; isYou?: boolean; username?: string; avatar?: string }) {
  const [expanded, setExpanded] = useState(false);
  const players = topPlayers(entry.starterIds);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: entry.rank * 0.04 }}
        onClick={() => setExpanded(v => !v)}
        className={`border-b cursor-pointer transition-colors ${
          isYou
            ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
            : 'border-white/8 hover:bg-white/4'
        }`}
      >
        <td className="py-3 pl-4 pr-2 w-10"><div className="flex justify-center"><RankBadge rank={entry.rank} /></div></td>
        <td className="py-3 px-2">
          <div className="font-semibold text-sm text-white flex items-center gap-2 flex-wrap">
            {avatar && (
              <img src={avatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0 border border-gray-700" />
            )}
            <span className={username ? 'text-white' : 'font-mono text-white/70'}>
              {username || shortAddr(entry.address)}
            </span>
            {isYou && <span className="text-xs font-normal text-emerald-400/70">(you)</span>}
            {entry.boosted && (
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.15em] text-blue-400 border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 rounded">
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                Boost Active
              </span>
            )}
          </div>
        </td>
        <td className="py-3 px-2 text-center hidden md:table-cell">
          <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{entry.formation}</span>
        </td>
        <td className="py-3 px-2 text-right">
          <span className="text-xs text-emerald-400/70">+{entry.weekPoints}</span>
        </td>
        <td className="py-3 pl-2 pr-4 text-right">
          <span className={`font-bold tabular-nums text-sm ${entry.rank <= 3 ? 'text-yellow-400' : 'text-white'}`}>
            {entry.totalPoints}
          </span>
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <td colSpan={5} className="px-4 pb-3 pt-1 bg-white/2 border-b border-white/5">
              <div className="flex flex-wrap gap-1.5 pt-1">
                {players.map(p => (
                  <span key={p.id} className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
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

export default function LeaderboardPage() {
  const { address } = useWalletContext();
  const { profile } = useProfile(address);
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState<'overall' | 'weekly'>('overall');

  useEffect(() => {
    if (!CONTRACT) { setLoading(false); return; }

    CosmWasmClient.connect(RPC).then(async client => {
      // Fetch all saved squads (everyone who signed up) + points overlay
      const [squadsResult, pointsResult] = await Promise.all([
        client.queryContractSmart(CONTRACT, { list_squads: { limit: 200 } }).catch(() => null),
        client.queryContractSmart(CONTRACT, { get_fantasy_leaderboard: { limit: 200 } }).catch(() => null),
      ]);

      const squads: { owner: string; formation: string; starter_ids: string[]; bench_ids: string[] }[] =
        Array.isArray(squadsResult) ? squadsResult :
        Array.isArray(squadsResult?.squads) ? squadsResult.squads : [];

      if (squads.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Build points lookup from leaderboard data
      const pointsMap: Record<string, number> = {};
      if (Array.isArray(pointsResult)) {
        for (const e of pointsResult) {
          if (e.address) pointsMap[e.address] = e.total_points ?? 0;
        }
      }

      const mapped: LeaderboardEntry[] = await Promise.all(
        squads.map(async (squad, idx) => {
          const boosted = await hasNFTBoost(squad.owner);
          const basePoints = pointsMap[squad.owner] ?? 0;
          return {
            rank:        idx + 1,
            address:     squad.owner,
            formation:   squad.formation ?? '—',
            totalPoints: boosted ? Math.round(basePoints * NFT_BOOST_MULTIPLIER) : basePoints,
            weekPoints:  0,
            starterIds:  squad.starter_ids ?? [],
            benchIds:    squad.bench_ids ?? [],
            boosted,
          };
        })
      );

      // Sort by points desc, re-rank
      mapped.sort((a, b) => b.totalPoints - a.totalPoints);
      mapped.forEach((e, i) => { e.rank = i + 1; });

      setEntries(mapped);
    }).catch(e => {
      setError(e.message);
    }).finally(() => setLoading(false));
  }, []);

  const sorted = [...entries].sort((a, b) =>
    tab === 'weekly' ? b.weekPoints - a.weekPoints : b.totalPoints - a.totalPoints,
  ).map((e, i) => ({ ...e, rank: i + 1 }));

  const display = search
    ? sorted.filter(e => e.address.includes(search))
    : sorted;

  const top3    = sorted.slice(0, 3);
  const myEntry = address ? sorted.find(e => e.address === address) : null;
  const isRegistered = address ? !!localStorage.getItem(`injmatch_registered_${address}`) : false;
  const showPendingRow = address && !myEntry && isRegistered;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-10 relative">
          <h1 className="text-3xl font-black tracking-tight">Leaderboard</h1>
          <p className="text-white/40 mt-1 text-sm">WC2026 · {entries.length} manager{entries.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-20 text-white/30">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-sm">Loading leaderboard…</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20 text-red-400/70 text-sm">{error}</div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">🏆</div>
            <h2 className="text-xl font-black text-white/60">No managers yet</h2>
            <p className="text-white/30 text-sm max-w-xs">Be the first to save your squad and climb the leaderboard.</p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            {/* Podium — 2nd | 1st | 3rd */}
            {!search && top3.length === 3 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
                <TopCard entry={top3[1]} order={1} />
                <TopCard entry={top3[0]} order={0} />
                <TopCard entry={top3[2]} order={2} />
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex rounded-lg overflow-hidden border border-white/10 text-sm">
                {(['overall', 'weekly'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2 transition-colors ${tab === t ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                    {t === 'overall' ? 'Overall' : 'This Week'}
                  </button>
                ))}
              </div>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search address…"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* My rank */}
            {myEntry && (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                <div><span className="text-xs text-emerald-400/70 block">Your rank</span><span className="font-bold text-emerald-400 text-lg">#{myEntry.rank}</span></div>
                <div className="text-right"><span className="text-xs text-white/40 block">Total points</span><span className="font-bold text-white text-lg">{myEntry.totalPoints}</span></div>
              </div>
            )}

            {/* Table */}
            <div className="rounded-2xl border border-white/8 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 text-xs text-white/30 uppercase tracking-wide">
                    <th className="py-2.5 pl-4 pr-2 text-center w-10">#</th>
                    <th className="py-2.5 px-2 text-left">Manager</th>
                    <th className="py-2.5 px-2 text-center hidden md:table-cell">Formation</th>
                    <th className="py-2.5 px-2 text-right">Week</th>
                    <th className="py-2.5 pl-2 pr-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {showPendingRow && (
                    <tr className="border-b border-white/5 bg-blue-500/5">
                      <td className="py-3 pl-4 pr-2 w-10"><div className="flex justify-center"><span className="text-sm font-bold text-gray-600">—</span></div></td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {profile.avatar && <img src={profile.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-gray-700" />}
                          <span className={`text-sm font-semibold ${profile.username ? 'text-white' : 'font-mono text-white/70'}`}>
                            {profile.username || shortAddr(address!)}
                          </span>
                          <span className="text-xs text-blue-400/70">(you)</span>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-0.5 pl-0">Build your squad to appear on the board</p>
                      </td>
                      <td className="py-3 px-2 text-center hidden md:table-cell"><span className="text-xs text-white/20">—</span></td>
                      <td className="py-3 px-2 text-right"><span className="text-xs text-white/20">—</span></td>
                      <td className="py-3 pl-2 pr-4 text-right"><span className="font-bold tabular-nums text-sm text-white/30">0</span></td>
                    </tr>
                  )}
                  {display.map(entry => (
                    <LeaderboardRow
                      key={entry.address}
                      entry={entry}
                      isYou={entry.address === address}
                      username={entry.address === address ? profile.username || undefined : undefined}
                      avatar={entry.address === address ? profile.avatar || undefined : undefined}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
