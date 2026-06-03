'use client';

import { useState, useCallback } from 'react';
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts';
import { ENDPOINTS, CHAIN_ID } from '@/lib/network';
import type { WalletState } from '@/types';

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
        if (walletType === 'keplr') {
          const keplr = (window as any).keplr;
          if (!keplr) throw new Error('Keplr extension not found. Please install it.');
          await keplr.enable(CHAIN_ID);
          const offlineSigner = keplr.getOfflineSigner(CHAIN_ID);
          const accounts = await offlineSigner.getAccounts();
          const address = accounts[0].address;
          setState((prev) => ({ ...prev, address, isConnected: true, isConnecting: false }));
          await fetchBalance(address);
        } else {
          // MetaMask / EVM wallet — use ethereum provider
          const ethereum = (window as any).ethereum;
          if (!ethereum) throw new Error('MetaMask not found. Please install it.');
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          // Convert EVM address to Injective bech32 using sdk-ts
          const { getInjectiveAddress } = await import('@injectivelabs/sdk-ts');
          const address = getInjectiveAddress(accounts[0]);
          setState((prev) => ({ ...prev, address, isConnected: true, isConnecting: false }));
          await fetchBalance(address);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
        setState((prev) => ({ ...prev, isConnecting: false, error: msg }));
      }
    },
    [fetchBalance],
  );

  const disconnect = useCallback(() => {
    setState({ address: null, isConnected: false, isConnecting: false, balance: null, error: null });
  }, []);

  const refreshBalance = useCallback(() => {
    if (state.address) fetchBalance(state.address);
  }, [state.address, fetchBalance]);

  return { ...state, connect, disconnect, refreshBalance };
}
