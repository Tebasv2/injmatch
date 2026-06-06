'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BARS = [
  { rank: '#1', pct: 30, color: 'from-yellow-400 to-yellow-600',   label: 'gold'   },
  { rank: '#2', pct: 20, color: 'from-gray-300 to-gray-500',       label: 'silver' },
  { rank: '#3', pct: 15, color: 'from-amber-500 to-amber-800',     label: 'bronze' },
  { rank: '#4', pct: 10, color: 'from-gray-700 to-gray-800',       label: ''       },
  { rank: '#5', pct: 8,  color: 'from-gray-700 to-gray-800',       label: ''       },
  { rank: '#6', pct: 6,  color: 'from-gray-700 to-gray-800',       label: ''       },
  { rank: '#7', pct: 5,  color: 'from-gray-700 to-gray-800',       label: ''       },
  { rank: '#8', pct: 3,  color: 'from-gray-700 to-gray-800',       label: ''       },
  { rank: '#9', pct: 2,  color: 'from-gray-700 to-gray-800',       label: ''       },
  { rank: '#10', pct: 1, color: 'from-gray-700 to-gray-800',       label: ''       },
];

const MAX_PCT = 30;
const MAX_BAR_HEIGHT = 200; // px

export function PrizeSplit() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-20 px-6 md:px-16 bg-[#0a0a0a] border-t border-gray-800/50">
      {/* Section header */}
      <div className="flex items-start justify-between mb-10 max-w-6xl mx-auto">
        <div>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-0.5 h-4 bg-blue-400 rounded-full inline-block" />
            Prize Pool
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-3">
            Top 10 Split the Pool
          </h2>
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
            Every entry fee flows into the round's on-chain pool. When the matches are settled,
            the ten best predictors take their cut — paid out in INJ, claimable straight from
            the leaderboard.
          </p>
        </div>
        <a
          href="/leaderboard"
          className="hidden md:inline-flex items-center gap-2 border border-gray-600 hover:border-white text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full transition-colors whitespace-nowrap ml-8 mt-1"
        >
          Leaderboard →
        </a>
      </div>

      {/* Main visualization container */}
      <div
        ref={ref}
        className="max-w-6xl mx-auto bg-[#111] border border-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* ── Sidebar ── */}
        <div className="relative md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-800 p-6 flex flex-col justify-between"
          style={{ borderLeft: '3px solid #4ade80' }}
        >
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.25em] mb-4">Current Round Pool</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-1 bg-gray-600 rounded-full" />
              <span className="text-white font-black text-lg tracking-wide">INJ</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
               Splits below update live as entries come in.
            </p>
          </div>
          <p className="text-[8px] text-blue-400/70 uppercase tracking-[0.15em] leading-relaxed mt-6 font-bold">
            · Payouts are on-chain — winners claim on the leaderboard
          </p>
        </div>

        {/* ── Chart area ── */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.25em]">Prize Split</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
              #1 · 30% of Pool
            </p>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-2 md:gap-3 h-[220px] relative">
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <div
                key={pct}
                className="absolute left-0 right-0 border-t border-gray-800/50"
                style={{ bottom: `${pct}%` }}
              />
            ))}

            {BARS.map((bar, i) => {
              const heightPct = (bar.pct / MAX_PCT) * 100;
              return (
                <div key={bar.rank} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                  {/* Percentage label */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className={`text-[10px] font-black ${
                      bar.label === 'gold' ? 'text-yellow-400' :
                      bar.label === 'silver' ? 'text-gray-300' :
                      bar.label === 'bronze' ? 'text-amber-500' :
                      'text-gray-400'
                    }`}
                  >
                    {bar.pct}%
                  </motion.p>

                  {/* Bar */}
                  <div className="w-full relative" style={{ height: `${MAX_BAR_HEIGHT}px` }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: `${heightPct}%`,
                        originY: 1,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                      className={`rounded-t-md bg-gradient-to-b ${bar.color}`}
                    />
                  </div>

                  {/* Rank label */}
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{bar.rank}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
