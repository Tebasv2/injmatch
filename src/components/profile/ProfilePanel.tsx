'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useWalletContextSafe } from '@/components/wallet/WalletProvider';

interface Props {
  onClose: () => void;
}

export function ProfilePanel({ onClose }: Props) {
  const { data: session } = useSession();
  const ctx = useWalletContextSafe();
  const [linkedWallet, setLinkedWallet] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [error, setError] = useState('');

  const connectedWallet = ctx?.address ?? null;

  useEffect(() => {
    fetch('/api/user/wallet')
      .then(r => r.json())
      .then(d => setLinkedWallet(d.walletAddress ?? null))
      .catch(() => {});
  }, []);

  async function linkWallet() {
    if (!connectedWallet) return;
    setLinking(true);
    setError('');
    try {
      const res = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: connectedWallet }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to link');
      setLinkedWallet(data.walletAddress);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to link wallet');
    } finally {
      setLinking(false);
    }
  }

  async function unlinkWallet() {
    setUnlinking(true);
    setError('');
    try {
      await fetch('/api/user/wallet', { method: 'DELETE' });
      setLinkedWallet(null);
    } catch {
      setError('Failed to unlink wallet');
    } finally {
      setUnlinking(false);
    }
  }

  const user = session?.user;
  const shortAddr = (addr: string) =>
    addr.length > 16 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-sm space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        {/* Discord identity */}
        <div className="flex items-center gap-3 bg-[#1a1a2e] border border-[#5865F2]/30 rounded-xl p-4">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name ?? 'avatar'}
              className="w-12 h-12 rounded-full border-2 border-[#5865F2]/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#5865F2]/20 border-2 border-[#5865F2]/50 flex items-center justify-center">
              <span className="text-[#5865F2] font-black text-lg">
                {user?.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <div>
            <p className="text-white font-bold text-sm">{user?.name}</p>
            {user?.email && (
              <p className="text-gray-500 text-[11px]">{user.email}</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3 h-3 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              <span className="text-[#5865F2] text-[10px] font-bold uppercase tracking-wider">Discord</span>
            </div>
          </div>
        </div>

        {/* Wallet linking */}
        <div>
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-bold mb-3">Injective Wallet</p>
          {linkedWallet ? (
            <div className="space-y-2">
              <div className="bg-gray-900 rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">Linked</p>
                  <p className="text-xs font-mono text-green-400">{shortAddr(linkedWallet)}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <button
                onClick={unlinkWallet}
                disabled={unlinking}
                className="w-full py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest border border-gray-700 text-gray-500 hover:text-red-400 hover:border-red-800 transition-colors disabled:opacity-40"
              >
                {unlinking ? 'Unlinking…' : 'Unlink Wallet'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {connectedWallet ? (
                <>
                  <div className="bg-gray-900 rounded-lg px-3 py-2">
                    <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">Connected (not linked)</p>
                    <p className="text-xs font-mono text-gray-400">{shortAddr(connectedWallet)}</p>
                  </div>
                  <button
                    onClick={linkWallet}
                    disabled={linking}
                    className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-500 text-black hover:bg-blue-400 transition-colors disabled:opacity-40"
                  >
                    {linking ? 'Linking…' : 'Link This Wallet'}
                  </button>
                </>
              ) : (
                <p className="text-[11px] text-gray-500 text-center py-3">
                  Connect your Injective wallet (top right) to link it to your account
                </p>
              )}
            </div>
          )}
          {error && <p className="text-red-400 text-[11px] mt-2">{error}</p>}
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut()}
          className="w-full py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-gray-800 text-gray-600 hover:text-white hover:border-gray-600 transition-colors"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
