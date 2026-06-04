'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GROUPS, STAGES } from '@/lib/wc2026-fixtures';
import type { WCMatch } from '@/lib/wc2026-fixtures';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
}
function groupByDate(matches: WCMatch[]) {
  const map = new Map<string, WCMatch[]>();
  for (const m of matches) {
    const key = m.utcDate.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return map;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: 'Upcoming',  className: 'text-gray-400 border-gray-700' },
  TIMED:     { label: 'Upcoming',  className: 'text-gray-400 border-gray-700' },
  LIVE:      { label: '● LIVE',    className: 'text-green-400 border-green-500/50 animate-pulse' },
  PAUSED:    { label: 'HT',        className: 'text-yellow-400 border-yellow-500/50' },
  FINISHED:  { label: 'FT',        className: 'text-gray-500 border-gray-700' },
};

const HOST_COLORS: Record<string, string> = {
  USA: 'text-blue-400', CAN: 'text-red-400', MEX: 'text-green-400',
};

function Crest({ src, name }: { src: string; name: string }) {
  if (src.startsWith('http')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className="w-7 h-7 object-contain flex-shrink-0"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
    );
  }
  return <span className="text-2xl leading-none">{src}</span>;
}

// ── MatchCard ─────────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: WCMatch }) {
  const badge = STATUS_BADGE[match.status] ?? STATUS_BADGE.SCHEDULED;
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE' || match.status === 'PAUSED';
  const hasScore = match.score.fullTime.home !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#111] border rounded-2xl p-4 transition-all ${
        isLive ? 'border-green-500/40 shadow-[0_0_20px_rgba(74,222,128,0.08)]' : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Top meta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {match.group && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-green-400 border border-green-500/30 rounded px-1.5 py-0.5">
              {match.group}
            </span>
          )}
          {!match.group && match.stage && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30 rounded px-1.5 py-0.5">
              {STAGES[match.stage] ?? match.stage}
            </span>
          )}
          {match.matchday && (
            <span className="text-[9px] text-gray-600 uppercase tracking-widest">MD {match.matchday}</span>
          )}
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-widest border rounded px-1.5 py-0.5 ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <span className="text-sm font-bold text-white text-right truncate">{match.homeTeam.shortName}</span>
          <Crest src={match.homeTeam.crest} name={match.homeTeam.name} />
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center w-20 flex-shrink-0">
          {hasScore ? (
            <div className={`text-2xl font-black tabular-nums ${isLive ? 'text-green-400' : isFinished ? 'text-white' : 'text-gray-300'}`}>
              {match.score.fullTime.home} – {match.score.fullTime.away}
            </div>
          ) : (
            <div className="text-[11px] text-gray-500 text-center font-bold uppercase tracking-widest">
              {formatTime(match.utcDate)}
            </div>
          )}
          {isLive && match.score.halfTime.home !== null && (
            <span className="text-[9px] text-gray-500 tabular-nums">
              HT {match.score.halfTime.home}–{match.score.halfTime.away}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex items-center justify-start gap-2">
          <Crest src={match.awayTeam.crest} name={match.awayTeam.name} />
          <span className="text-sm font-bold text-white truncate">{match.awayTeam.shortName}</span>
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <div className="mt-2.5 text-center">
          <span className="text-[9px] text-gray-600 uppercase tracking-widest">
            📍 {match.city ? `${match.city} · ` : ''}{match.venue}
            {match.country && <span className={` ml-1 ${HOST_COLORS[match.country] ?? ''}`}>({match.country})</span>}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ViewMode = 'dates' | 'groups';
type StageFilter = 'all' | 'GROUP_STAGE' | 'knockout';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<WCMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('dates');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/fixtures')
      .then((r) => r.json())
      .then((d) => {
        setFixtures(d.fixtures ?? []);
        setSource(d.source ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return fixtures.filter((m) => {
      if (stageFilter === 'GROUP_STAGE' && m.stage !== 'GROUP_STAGE') return false;
      if (stageFilter === 'knockout' && m.stage === 'GROUP_STAGE') return false;
      if (groupFilter !== 'all' && m.group !== groupFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.city?.toLowerCase().includes(q) ||
          m.venue?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [fixtures, stageFilter, groupFilter, search]);

  const byDate = useMemo(() => groupByDate(filtered), [filtered]);
  const sortedDates = useMemo(() => [...byDate.keys()].sort(), [byDate]);

  const byGroup = useMemo(() => {
    const map = new Map<string, WCMatch[]>();
    for (const m of filtered) {
      const key = m.group ?? STAGES[m.stage] ?? m.stage;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return map;
  }, [filtered]);

  const liveCount = fixtures.filter((m) => m.status === 'LIVE' || m.status === 'PAUSED').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Page header */}
      <div className="border-b border-gray-800 px-4 md:px-8 py-5">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-green-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-0.5">FIFA</p>
            <h1 className="text-2xl font-black uppercase tracking-tight">World Cup 2026 Fixtures</h1>
            <p className="text-gray-500 text-xs mt-1">
              June 11 – July 19, 2026 · USA, Canada & Mexico
              {liveCount > 0 && (
                <span className="ml-2 text-green-400 font-bold animate-pulse">● {liveCount} LIVE</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Data source badge */}
            <span className={`text-[9px] font-bold uppercase tracking-widest border rounded px-2 py-1 ${
              source === 'live' ? 'text-green-400 border-green-500/40' : 'text-gray-500 border-gray-700'
            }`}>
              {source === 'live' ? '● Live · football-data.org' : '📋 Static data'}
            </span>

            {/* View toggle */}
            <div className="flex bg-[#111] border border-gray-800 rounded-xl p-1">
              {(['dates', 'groups'] as ViewMode[]).map((v) => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                    viewMode === v ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-white'
                  }`}>
                  {v === 'dates' ? 'By Date' : 'By Group'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6">
        {/* Filters row */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team or city…"
            className="bg-[#111] border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 w-52 transition-colors"
          />

          {/* Stage filter */}
          <div className="flex gap-1 bg-[#111] border border-gray-800 rounded-xl p-1">
            {([['all','All'],['GROUP_STAGE','Group Stage'],['knockout','Knockout']] as [StageFilter,string][]).map(([v,l]) => (
              <button key={v} onClick={() => { setStageFilter(v); setGroupFilter('all'); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                  stageFilter === v ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-white'
                }`}>{l}</button>
            ))}
          </div>

          {/* Group filter — only when group stage selected */}
          {stageFilter !== 'knockout' && (
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-[#111] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500/50 transition-colors"
            >
              <option value="all">All Groups</option>
              {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          )}
        </div>

        {/* Results count */}
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">
          {loading ? 'Loading fixtures…' : `${filtered.length} matches`}
        </p>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600 py-20 uppercase tracking-widest text-sm">No matches found</p>
        ) : viewMode === 'dates' ? (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date}>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-3 flex items-center gap-3">
                  {formatDate(date + 'T00:00:00Z')}
                  <span className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-600">{byDate.get(date)!.length} match{byDate.get(date)!.length > 1 ? 'es' : ''}</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {byDate.get(date)!.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {[...byGroup.keys()].map((group) => (
              <div key={group}>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-green-400 mb-3 flex items-center gap-3">
                  {group}
                  <span className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-600">{byGroup.get(group)!.length} matches</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {byGroup.get(group)!.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
