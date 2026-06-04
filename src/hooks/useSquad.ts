'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChainGrpcWasmApi, toBase64, fromBase64 } from '@injectivelabs/sdk-ts';
import { ENDPOINTS, CONTRACT_ADDRESS, CHAIN_ID } from '@/lib/network';
import { PLAYERS } from '@/lib/players';
import type { Player, Formation } from '@/types/squad';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'loading' | 'error';

interface OnChainSquad {
  owner: string;
  formation: string;
  starter_ids: string[];
  bench_ids: string[];
  saved_at: number;
}

// Resolve player IDs back to Player objects (null if slot is empty / ID not found)
function idsToPlayers(ids: string[]): (Player | null)[] {
  return ids.map((id) => (id ? PLAYERS.find((p) => p.id === id) ?? null : null));
}

export function useSquad(address: string | null) {
  const [starters, setStarters] = useState<(Player | null)[]>(Array(11).fill(null));
  const [bench, setBench] = useState<(Player | null)[]>(Array(3).fill(null));
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load the squad stored on-chain for this wallet when address changes
  const loadSquad = useCallback(async () => {
    if (!address || !CONTRACT_ADDRESS) return;
    setSaveStatus('loading');
    try {
      const wasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
      const res = await wasmApi.fetchSmartContractState(
        CONTRACT_ADDRESS,
        toBase64({ get_squad: { owner: address } }),
      );
      const data: OnChainSquad | null = fromBase64(res.data as unknown as string) as any;
      if (data) {
        setFormation((data.formation as Formation) ?? '4-3-3');
        // Pad arrays to correct lengths with nulls
        const starterSlots = Array(11).fill(null);
        const benchSlots = Array(3).fill(null);
        data.starter_ids.forEach((id, i) => { if (i < 11) starterSlots[i] = PLAYERS.find((p) => p.id === id) ?? null; });
        data.bench_ids.forEach((id, i) => { if (i < 3) benchSlots[i] = PLAYERS.find((p) => p.id === id) ?? null; });
        setStarters(starterSlots);
        setBench(benchSlots);
        setLastSaved(new Date(data.saved_at * 1000));
      }
      setSaveStatus('idle');
    } catch {
      // No squad saved yet — that's fine
      setSaveStatus('idle');
    }
  }, [address]);

  useEffect(() => {
    loadSquad();
  }, [loadSquad]);

  // Save squad on-chain — signed by the connected wallet
  const saveSquad = useCallback(async () => {
    if (!address) return;
    setSaveStatus('saving');
    try {
      const keplr = (window as any).keplr;
      if (!keplr) throw new Error('Keplr not found');

      const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
      const offlineSigner = keplr.getOfflineSignerOnlyAmino(CHAIN_ID);
      const client = await SigningCosmWasmClient.connectWithSigner(
        ENDPOINTS.rpc as string,
        offlineSigner,
        { gasPrice: '500000000inj' as any },
      );

      // Represent empty slots as empty strings so the array length stays fixed
      const starterIds = starters.map((p) => p?.id ?? '');
      const benchIds = bench.map((p) => p?.id ?? '');

      await client.execute(
        address,
        CONTRACT_ADDRESS,
        { save_squad: { formation, starter_ids: starterIds, bench_ids: benchIds } },
        'auto',
      );

      setSaveStatus('saved');
      setLastSaved(new Date());
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Save squad failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }, [address, starters, bench, formation]);

  return {
    starters, setStarters,
    bench, setBench,
    formation, setFormation,
    saveStatus, lastSaved,
    saveSquad, loadSquad,
  };
}
