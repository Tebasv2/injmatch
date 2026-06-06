'use client';

import { useState, useEffect } from 'react';
import { ChainGrpcWasmApi, toBase64, fromBase64 } from '@injectivelabs/sdk-ts';
import { ENDPOINTS } from '@/lib/network';

export const NFT_BOOST_MULTIPLIER = 1.3;

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ?? '';

export function useNFTBoost(address: string | null): boolean {
  const [hasBoost, setHasBoost] = useState(false);

  useEffect(() => {
    if (!address || !NFT_CONTRACT) {
      setHasBoost(false);
      return;
    }

    let cancelled = false;

    async function check() {
      try {
        const wasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
        const res = await wasmApi.fetchSmartContractState(
          NFT_CONTRACT,
          toBase64({ tokens: { owner: address, limit: 1 } }),
        );
        const data = fromBase64(res.data as unknown as string) as { ids?: string[] };
        if (!cancelled) setHasBoost(Array.isArray(data?.ids) && data.ids.length > 0);
      } catch {
        if (!cancelled) setHasBoost(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, [address]);

  return hasBoost;
}
