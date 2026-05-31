'use client';

import { useState } from 'react';
import { CreateLeagueModal } from '@/components/league/CreateLeagueModal';
import { LeagueCard } from '@/components/league/LeagueCard';
import { useWalletContext } from '@/components/wallet/WalletProvider';
import { League } from '@/types';

// Mock data until contract is deployed
const MOCK_LEAGUES: League[] = [
  {
    id: '1',
    name: 'Champions Circle',
    admin: 'inj1abcdefghijklmnopqrstuvwxyz',
    entry_fee: '1000000000000000000',
    prize_pool: '5000000000000000000',
    max_participants: 20,
    participants: [],
    status: 'open',
    created_at: Date.now(),
  },
  {
    id: '2',
    name: 'World Cup Legends',
    admin: 'inj1defghijklmnopqrstuvwxyzabc',
    entry_fee: '5000000000000000000',
    prize_pool: '25000000000000000000',
    max_participants: 10,
    participants: [],
    status: 'active',
    created_at: Date.now(),
  },
];

export default function HomePage() {
  const { address, isConnected } = useWalletContext();
  const [showCreate, setShowCreate] = useState(false);
  const [leagues] = useState<League[]>(MOCK_LEAGUES);

  const handleJoin = (league: League) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    console.log('Joining league:', league.id);
  };

  const handleView = (league: League) => {
    console.log('Viewing league:', league.id);
  };

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12 mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          World Cup Prediction League
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Predict match scores, compete with friends, and win INJ — all on-chain on Injective testnet.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          {isConnected ? (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              + Create League
            </button>
          ) : (
            <p className="text-gray-500 text-sm">Connect your wallet to create or join leagues</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Leagues', value: '2' },
          { label: 'Total Prize Pool', value: '30 INJ' },
          { label: 'Predictions Made', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* League grid */}
      <h2 className="text-xl font-semibold text-white mb-4">Available Leagues</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <LeagueCard
            key={league.id}
            league={league}
            onJoin={handleJoin}
            onView={handleView}
            userAddress={address}
          />
        ))}
      </div>

      {showCreate && (
        <CreateLeagueModal
          onClose={() => setShowCreate(false)}
          onCreated={() => console.log('League created!')}
        />
      )}
    </div>
  );
}
