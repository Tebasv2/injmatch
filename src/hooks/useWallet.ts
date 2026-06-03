'use client';

import { useState, useCallback } from 'react';
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts';
import { CHAIN_ID, ENDPOINTS } from '@/lib/network';
import type { WalletState } from '@/types';

// Lazily instantiated so wallet-ts is never statically bundled
let _strategy: any = null;
export async function getStrategy() {
  if (_strategy) return _strategy;
  const { WalletStrategy } = await import('@injectivelabs/wallet-ts');
  _strategy = new WalletStrategy({ chainId: CHAIN_ID });
  return _strategy;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
    error: null,
  });

  const fetchBalance = useCallback(async (address: string) => {
    try {
      const api = new ChainGrpcBankApi(ENDPOINTS.grpc);
      const { balances } = await api.fetchBalances(address);
      const inj = balances.find((b: any) => b.denom === 'inj');
      const formatted = (parseFloat(inj?.amount ?? '0') / 1e18).toFixed(4);
      setState((prev) => ({ ...prev, balance: formatted }));
    } catch {
      setState((prev) => ({ ...prev, balance: '0.0000' }));
    }
  }, []);

  const connect = useCallback(
    async (walletType: 'keplr' | 'metamask' = 'keplr') => {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));
      try {
        const { Wallet } = await import('@injectivelabs/wallet-ts');
        const strategy = await getStrategy();
        strategy.setWallet(walletType === 'metamask' ? Wallet.Metamask : Wallet.Keplr);
        const addresses = await strategy.getAddresses();
        const address = addresses[0];
        setState((prev) => ({ ...prev, address, isConnected: true, isConnecting: false }));
        await fetchBalance(address);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
        setState((prev) => ({ ...prev, isConnecting: false, error: msg }));
      }
    },
    [fetchBalance],
  );

  const disconnect = useCallback(async () => {
    const strategy = await getStrategy();
    strategy.disconnect();
    _strategy = null;
    setState({ address: null, isConnected: false, isConnecting: false, balance: null, error: null });
  }, []);

  const refreshBalance = useCallback(() => {
    if (state.address) fetchBalance(state.address);
  }, [state.address, fetchBalance]);

  return { ...state, connect, disconnect, refreshBalance };
}
