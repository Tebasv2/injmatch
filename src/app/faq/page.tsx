'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  icon: string;
  title: string;
  items: FAQItem[];
}

const CATEGORIES: FAQCategory[] = [
  {
    icon: '⚽',
    title: 'Getting Started',
    items: [
      {
        q: 'What is InjMatch?',
        a: 'InjMatch is a fantasy football manager game built on the Injective blockchain. Pick your squad of 15 players from the 2026 World Cup, set your formation, and earn points based on real match performances.',
      },
      {
        q: 'Is InjMatch free to play?',
        a: 'Joining is free — you only need a small amount of INJ to cover the gas fee when saving your squad to the blockchain. There are no entry fees to participate.',
      },
      {
        q: 'Which tournament does InjMatch cover?',
        a: 'InjMatch is built around the 2026 FIFA World Cup. Player prices and availability reflect the squads heading into that tournament.',
      },
      {
        q: 'Do I need any prior blockchain experience?',
        a: 'No. If you can install a browser wallet and connect it, you can play. Everything else — team selection, scoring, leaderboard — works like a normal web app.',
      },
    ],
  },
  {
    icon: '👛',
    title: 'Wallet & Connection',
    items: [
      {
        q: 'Which wallet do I need?',
        a: 'InjMatch supports Keplr wallet, the most widely used wallet for the Injective ecosystem. Install the Keplr browser extension, create or import an account, and connect from the top-right corner of the site.',
      },
      {
        q: 'How do I connect my Keplr wallet?',
        a: 'Click "Connect Wallet" in the top-right corner. Keplr will prompt you to approve the connection. Once approved, your address will appear and you can start building your squad.',
      },
      {
        q: 'What network should my wallet be on?',
        a: 'InjMatch currently runs on Injective Testnet (injective-888). Make sure Keplr has the Injective Testnet network added. You can get free testnet INJ from the Injective faucet.',
      },
      {
        q: 'Why do I need INJ in my wallet?',
        a: 'A tiny amount of INJ is needed to pay the gas fee when you submit your squad to the smart contract. Typical gas costs are fractions of a cent worth of INJ.',
      },
    ],
  },
  {
    icon: '🧩',
    title: 'Building Your Squad',
    items: [
      {
        q: 'How many players do I pick?',
        a: 'You select 14 players in total: 11 starters and 3 bench players. Your starters score points each gameweek; bench players provide cover if a starter does not play.',
      },
      {
        q: 'Is there a budget limit?',
        a: 'Yes. You have a budget of 100 $INJ to spend across all 15 players. Each player has a price based on their expected World Cup impact — balance star players with budget options.',
      },
      {
        q: 'What formations are available?',
        a: 'You can choose from 4-3-3, 4-4-2, 3-5-2, 3-4-3, and 5-3-2. The formation determines how many defenders, midfielders, and forwards you must field in your starting XI.',
      },
      {
        q: 'Can I change my squad after saving it?',
        a: 'During the transfer window (before the tournament starts) you can update your squad freely. Once the window closes and matches begin, transfers are locked until the next window opens.',
      },
      {
        q: 'What is the transfer window?',
        a: 'The transfer window is the period before each round of matches when you can make changes to your squad. Between gameweeks there may be a limited number of free transfers available.',
      },
    ],
  },
  {
    icon: '📊',
    title: 'Points & Scoring',
    items: [
      {
        q: 'How are points calculated?',
        a: 'Points are awarded for real-world performances in World Cup matches. Scoring events include goals, assists, clean sheets (for defenders and goalkeepers), saves, and more. Negative points apply for yellow cards, red cards, and own goals.',
      },
      {
        q: 'When are points updated?',
        a: 'Points are updated after each official match result is processed and submitted to the smart contract. You can track live standings on the Leaderboard page.',
      },
      {
        q: 'Do bench players score points?',
        a: 'Bench players score points only as automatic substitutes — if one of your starters did not play at all in a gameweek, the first eligible bench player is brought in.',
      },
      {
        q: 'How do the captain and vice-captain work?',
        a: 'You assign a captain (C) and a vice-captain (V) from your starting XI. Your captain\'s points are multiplied by 2× for that round, while your vice-captain\'s points are multiplied by 1.5×. Choose your highest-scoring starter wisely — the armband can make or break a gameweek.',
      },
    ],
  },
  {
    icon: '🏆',
    title: 'Leaderboard & Prizes',
    items: [
      {
        q: 'How does the leaderboard work?',
        a: 'The leaderboard ranks all managers by total accumulated points. Weekly rankings let you see how you performed in the most recent gameweek compared to the field.',
      },
      {
        q: 'Are there prizes?',
        a: 'Prize details will be announced before the tournament kicks off. Follow our official channels for the latest updates on rewards.',
      },
      {
        q: 'Can I see which players other managers picked?',
        a: 'Yes. Click on any manager\'s row in the leaderboard to expand their squad and see which players they have in their starting XI.',
      },
    ],
  },
  {
    icon: '⛓️',
    title: 'Blockchain & Smart Contract',
    items: [
      {
        q: 'Why is InjMatch on the blockchain?',
        a: 'Storing squads and scores on-chain means the game is transparent and trustless — no central server can alter your squad or manipulate the leaderboard. Everything is verifiable on Injective.',
      },
      {
        q: 'Where is my squad stored?',
        a: 'Your squad is stored in a CosmWasm smart contract deployed on Injective. Your wallet address is the key — only you can update your squad by signing a transaction.',
      },
      {
        q: 'Is the smart contract audited?',
        a: 'We are pursuing a security audit ahead of the mainnet launch. Contract source code will be open-sourced so the community can inspect it independently.',
      },
    ],
  },
  {
    icon: '🛟',
    title: 'Troubleshooting',
    items: [
      {
        q: 'My wallet won\'t connect — what should I do?',
        a: 'Make sure Keplr is installed and unlocked. Try refreshing the page. If Keplr prompts you to approve a chain, accept it. If problems persist, try disabling other wallet extensions that might conflict.',
      },
      {
        q: 'My squad save transaction failed — what happened?',
        a: 'Transaction failures are usually caused by insufficient INJ for gas, or a network timeout. Check your Keplr balance, wait a moment, and try again. The transfer window must also be open for squad saves to succeed.',
      },
      {
        q: 'I saved my squad but I don\'t see it — is it lost?',
        a: 'Squad data lives on-chain, so it is never lost. If it does not appear immediately, give the page a refresh. The RPC node may take a few seconds to index your transaction.',
      },
      {
        q: 'How do I report a bug or get help?',
        a: 'Tag @tebasv2 on X, Include your wallet address and a description of the issue so the team can investigate.',
      },
    ],
  },
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
          {item.q}
        </span>
        <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-transform ${open ? 'rotate-45 border-emerald-500 text-emerald-400' : 'text-white/40'}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-white/50 leading-relaxed pr-8">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryCard({ cat, index }: { cat: FAQCategory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden"
    >
      <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-white/6">
        <span className="text-2xl">{cat.icon}</span>
        <h2 className="font-bold text-base text-white">{cat.title}</h2>
        <span className="ml-auto text-xs text-white/30">{cat.items.length} questions</span>
      </div>
      <div className="px-5">
        {cat.items.map((item, i) => (
          <FAQAccordion key={i} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(
          item =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter(cat => cat.items.length > 0)
    : CATEGORIES;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 py-10 relative">
          <h1 className="text-3xl font-black tracking-tight">FAQ</h1>
          <p className="text-white/40 mt-1 text-sm">Frequently asked questions about InjMatch</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30 text-sm">No results for "{search}"</div>
        )}

        {filtered.map((cat, i) => (
          <CategoryCard key={cat.title} cat={cat} index={i} />
        ))}
      </div>
    </div>
  );
}
