'use client';

import { Wallet } from '@injectivelabs/wallet-ts';
import { useWalletContext } from './WalletProvider';

export function WalletButton() {
  const { address, isConnected, isConnecting, balance, error, connect, disconnect } =
    useWalletContext();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400">Balance</p>
          <p className="text-sm font-semibold text-white">{balance} INJ</p>
        </div>
        <div className="bg-gray-800 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">Address</p>
          <p className="text-sm font-mono text-indigo-400">
            {address.slice(0, 8)}...{address.slice(-6)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          onClick={() => connect(Wallet.Keplr)}
          disabled={isConnecting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          {isConnecting ? 'Connecting…' : 'Keplr'}
        </button>
        <button
          onClick={() => connect(Wallet.Metamask)}
          disabled={isConnecting}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          MetaMask
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
