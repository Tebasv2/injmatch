'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWalletContext } from './WalletProvider';

export function WalletButton() {
  const { address, isConnected, isConnecting, balance, error, connect, disconnect } =
    useWalletContext();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Balance chip */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">Balance</span>
          <span className="text-xs font-bold text-blue-400">{balance} INJ</span>
        </div>

        {/* Address chip */}
        <div className="border border-gray-700 rounded-lg px-3 py-1.5 bg-gray-900">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Address</p>
          <p className="text-xs font-mono text-white leading-tight">
            {address.slice(0, 7)}…{address.slice(-5)}
          </p>
        </div>

        {/* Disconnect */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={disconnect}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors"
        >
          ✕
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <motion.button
        whileHover={{ scale: 1.04, backgroundColor: '#16a34a' }}
        whileTap={{ scale: 0.96 }}
        onClick={() => connect('keplr')}
        disabled={isConnecting}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-black font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-[9px] mt-1 uppercase tracking-widest"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
