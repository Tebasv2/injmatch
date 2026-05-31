import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts';
import { ENDPOINTS } from './network';

export const bankApi = new ChainGrpcBankApi(ENDPOINTS.grpc);

export const formatInj = (amount: string): string => {
  const num = parseFloat(amount) / 1e18;
  return num.toFixed(4);
};

export const toMicroInj = (amount: string): string => {
  const num = parseFloat(amount) * 1e18;
  return Math.floor(num).toString();
};
