'use client';

import { createContext, useContext } from 'react';
import { useWallet } from '@/hooks/useWallet';

type WalletContextType = ReturnType<typeof useWallet>;

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used inside WalletProvider');
  return ctx;
}

// Safe version — returns null when called before WalletProvider has mounted
// (e.g. during dynamic-import loading). NavLinks uses this to avoid crashing.
export function useWalletContextSafe() {
  return useContext(WalletContext);
}
