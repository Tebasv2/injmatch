'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWalletContext } from './WalletProvider';

export function WalletButton() {
  const { address, isConnected, isConnecting, balance, error, connect, disconnect } =
    useWalletContext();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Balance</p>
          <p className="text-xs font-bold text-green-400">{balance} INJ</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Address</p>
          <p className="text-xs font-mono text-white">
            {address.slice(0, 8)}…{address.slice(-5)}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={disconnect}
          className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors px-2"
        >
          Disconnect
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: '#16a34a' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => connect('keplr')}
          disabled={isConnecting}
          className="bg-green-500 disabled:opacity-50 text-black text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors"
        >
          {isConnecting ? 'Connecting…' : 'Connect Wallet'}
        </motion.button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-[10px]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
