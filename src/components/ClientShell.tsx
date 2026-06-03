'use client';

import dynamic from 'next/dynamic';

const WalletProvider = dynamic(
  () => import('@/components/wallet/WalletProvider').then((m) => m.WalletProvider),
  { ssr: false },
);

const WalletButton = dynamic(
  () => import('@/components/wallet/WalletButton').then((m) => m.WalletButton),
  { ssr: false },
);

const NAV_LINKS = ['Leagues', 'Leaderboard', 'Fixtures', 'FAQ'];

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-gray-800">
        <div className="mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-2xl font-black tracking-tight">⚽ INJMATCH</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest ml-1 hidden sm:block">
              Testnet
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Wallet */}
          <WalletButton />
        </div>
      </header>

      <main>{children}</main>
    </WalletProvider>
  );
}
