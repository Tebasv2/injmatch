'use client';

import { useState, useCallback } from 'react';
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts';
import { ChainId } from '@injectivelabs/ts-types';
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts';
import { CHAIN_ID, ENDPOINTS } from '@/lib/network';
import { WalletState } from '@/types';

const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID as ChainId,
});

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
      const inj = balances.find((b) => b.denom === 'inj');
      const formatted = ((parseFloat(inj?.amount ?? '0')) / 1e18).toFixed(4);
      setState((prev) => ({ ...prev, balance: formatted }));
    } catch {
      setState((prev) => ({ ...prev, balance: '0.0000' }));
    }
  }, []);

  const connect = useCallback(
    async (wallet: Wallet = Wallet.Keplr) => {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));
      try {
        walletStrategy.setWallet(wallet);
        const addresses = await walletStrategy.getAddresses();
        const address = addresses[0];
        setState((prev) => ({
          ...prev,
          address,
          isConnected: true,
          isConnecting: false,
        }));
        await fetchBalance(address);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
        setState((prev) => ({ ...prev, isConnecting: false, error: msg }));
      }
    },
    [fetchBalance],
  );

  const disconnect = useCallback(() => {
    walletStrategy.disconnect();
    setState({ address: null, isConnected: false, isConnecting: false, balance: null, error: null });
  }, []);

  const refreshBalance = useCallback(() => {
    if (state.address) fetchBalance(state.address);
  }, [state.address, fetchBalance]);

  return { ...state, connect, disconnect, refreshBalance, walletStrategy };
}
