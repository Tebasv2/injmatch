'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const WalletProvider = dynamic(
  () => import('@/components/wallet/WalletProvider').then((m) => m.WalletProvider),
  { ssr: false },
);

const WalletButton = dynamic(
  () => import('@/components/wallet/WalletButton').then((m) => m.WalletButton),
  { ssr: false },
);

const NAV = ['Leagues', 'Leaderboard', 'Fixtures', 'FAQ'];

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800"
      >
        <div className="mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight">
              <span className="text-green-400">⚽</span>
              <span className="text-white ml-1">INJ</span>
              <span className="text-green-400">MATCH</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href="https://testnet.hub.injective.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              Testnet
            </a>
            <WalletButton />
          </div>
        </div>
      </motion.header>

      <main>{children}</main>
    </WalletProvider>
  );
}
