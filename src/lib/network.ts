import { Network, getNetworkEndpoints } from '@injectivelabs/networks';

export const NETWORK = Network.TestnetK8s;
export const ENDPOINTS = getNetworkEndpoints(NETWORK);
export const CHAIN_ID = 'injective-888';
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
