'use client';

import { useCallback, useMemo } from 'react';
import {
  ChainGrpcWasmApi,
  toBase64,
  fromBase64,
} from '@injectivelabs/sdk-ts';
import { ENDPOINTS, CONTRACT_ADDRESS, CHAIN_ID } from '@/lib/network';
import type { League, LeaderboardEntry, Prediction } from '@/types';

async function broadcastTx(address: string, msg: any) {
  const keplr = (window as any).keplr;
  if (!keplr) throw new Error('Keplr not connected');

  const { MsgExecuteContractCompat, toBase64 } = await import('@injectivelabs/sdk-ts');
  const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const offlineSigner = keplr.getOfflineSignerOnlyAmino(CHAIN_ID);
  const client = await SigningCosmWasmClient.connectWithSigner(
    ENDPOINTS.rpc as string,
    offlineSigner,
    { gasPrice: '500000000inj' as any },
  );

  return client.execute(address, CONTRACT_ADDRESS, msg.msg, 'auto', undefined, msg.funds ?? []);
}

export function useContract(address: string | null) {
  const wasmApi = useMemo(() => new ChainGrpcWasmApi(ENDPOINTS.grpc), []);

  const query = useCallback(
    async <T>(queryMsg: object): Promise<T> => {
      const res = await wasmApi.fetchSmartContractState(CONTRACT_ADDRESS, toBase64(queryMsg));
      return fromBase64(res.data as unknown as string) as unknown as T;
    },
    [wasmApi],
  );

  const execute = useCallback(
    async (msg: object, funds?: { denom: string; amount: string }[]) => {
      if (!address) throw new Error('Wallet not connected');
      return broadcastTx(address, { msg, funds });
    },
    [address],
  );

  return {
    getLeague: (leagueId: string) =>
      query<League>({ get_league: { league_id: leagueId } }),
    getLeaderboard: (leagueId: string) =>
      query<LeaderboardEntry[]>({ get_leaderboard: { league_id: leagueId } }),
    getPredictions: (leagueId: string, predictor?: string) =>
      query<Prediction[]>({ get_predictions: { league_id: leagueId, predictor } }),
    listLeagues: (startAfter?: string, limit?: number) =>
      query<League[]>({ list_leagues: { start_after: startAfter, limit } }),
    createLeague: (name: string, entryFee: string, maxParticipants: number) =>
      execute({ create_league: { name, entry_fee: entryFee, max_participants: maxParticipants } }),
    joinLeague: (leagueId: string, entryFee: string) =>
      execute({ join_league: { league_id: leagueId } }, [{ denom: 'inj', amount: entryFee }]),
    submitPrediction: (leagueId: string, matchId: string, homeScore: number, awayScore: number) =>
      execute({ submit_prediction: { league_id: leagueId, match_id: matchId, home_score: homeScore, away_score: awayScore } }),
    submitResult: (leagueId: string, matchId: string, homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) =>
      execute({ submit_result: { league_id: leagueId, match_id: matchId, home_team: homeTeam, away_team: awayTeam, home_score: homeScore, away_score: awayScore } }),
    distributePrizes: (leagueId: string) =>
      execute({ distribute_prizes: { league_id: leagueId } }),
    startLeague: (leagueId: string) =>
      execute({ start_league: { league_id: leagueId } }),
    finishLeague: (leagueId: string) =>
      execute({ finish_league: { league_id: leagueId } }),
  };
}
