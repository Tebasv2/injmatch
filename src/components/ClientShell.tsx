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

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <header className="border-b border-gray-800 sticky top-0 z-40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="font-bold text-xl">InjMatch</span>
            <span className="text-xs text-gray-500 hidden sm:block ml-1">Testnet</span>
          </div>
          <WalletButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </WalletProvider>
  );
}
