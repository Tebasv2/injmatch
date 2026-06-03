'use client';

import { useState } from 'react';
import { CreateLeagueModal } from '@/components/league/CreateLeagueModal';
import { useWalletContext } from '@/components/wallet/WalletProvider';

export default function HomePage() {
  const { isConnected } = useWalletContext();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-16 overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 100%), url('/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        {/* Decorative pitch circle */}
        <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none opacity-20">
          <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black leading-tight uppercase mb-6">
            PREDICT THE
            <br />
            <span className="text-green-400">WORLD CUP</span>
            <br />
            BETTER THAN
            <br />
            <span className="text-green-400">EVERYONE?</span>
            <br />
            TIME TO EARN FROM IT
          </h1>

          <p className="text-gray-300 text-base md:text-lg mb-2">Study the fixtures and form.</p>
          <p className="text-gray-300 text-base md:text-lg mb-2">Submit your score predictions before each match.</p>
          <p className="text-gray-300 text-base md:text-lg mb-8">
            The sharper your picks, the more INJ lands in your wallet.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg">
            {[
              { label: 'PRIZE POOL', sub: 'ACTIVE LEAGUES' },
              { label: 'PLAYERS', sub: 'REGISTERED' },
              { label: 'UNTIL DEADLINE', sub: '', value: 'Open now' },
            ].map((card) => (
              <div key={card.label} className="border border-gray-700 rounded-lg px-4 py-3 bg-black/40 backdrop-blur">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">{card.label}</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">{card.sub}</p>
                {'value' in card
                  ? <p className="text-sm font-bold text-white">{card.value}</p>
                  : <div className="w-6 h-0.5 bg-gray-600 mt-1" />}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => isConnected && setShowCreate(true)}
            className="inline-flex items-center gap-3 border-2 border-white hover:border-green-400 hover:text-green-400 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors text-sm"
          >
            START COMPETING <span className="text-lg">→</span>
          </button>
          {!isConnected && (
            <p className="text-gray-500 text-xs mt-3">Connect your wallet to get started</p>
          )}
        </div>

        <div className="absolute bottom-6 left-16 text-xs text-gray-500 uppercase tracking-widest">
          How it works ↓
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-950 border-t border-gray-800 py-16 px-6 md:px-16">
        <h2 className="text-2xl font-black uppercase tracking-wide mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
          {[
            { n: '01', title: 'Join a League', desc: 'Pay the entry fee in INJ and get access to all fixtures.' },
            { n: '02', title: 'Submit Predictions', desc: 'Predict the exact score of each World Cup match before kick-off.' },
            { n: '03', title: 'Win INJ', desc: 'Exact scores = 3 pts. Correct outcome = 1 pt. Top 3 split the prize pool.' },
          ].map((step) => (
            <div key={step.n} className="border border-gray-800 rounded-xl p-6">
              <p className="text-4xl font-black text-green-400 mb-3">{step.n}</p>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {showCreate && (
        <CreateLeagueModal onClose={() => setShowCreate(false)} onCreated={() => setShowCreate(false)} />
      )}
    </div>
  );
}
