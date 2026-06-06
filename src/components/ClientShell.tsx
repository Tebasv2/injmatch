'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useWalletContextSafe } from '@/components/wallet/WalletProvider';
import { useProfile } from '@/hooks/useProfile';
import { ProfileModal } from '@/components/profile/ProfileModal';

const WalletProvider = dynamic(
  () => import('@/components/wallet/WalletProvider').then((m) => m.WalletProvider),
  { ssr: false },
);

const WalletButton = dynamic(
  () => import('@/components/wallet/WalletButton').then((m) => m.WalletButton),
  { ssr: false },
);

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS ?? '';

const NAV = [
  { label: 'World Cup',   href: '/',             soon: false, adminOnly: false },
  { label: 'Fixtures',    href: '/fixtures',     soon: false, adminOnly: false },
  { label: 'Squad',       href: '/squad',        soon: false, adminOnly: false },
  { label: 'Predictions', href: '/predictions',  soon: false, adminOnly: false },
  { label: 'Leaderboard', href: '/leaderboard',  soon: false, adminOnly: false },
  { label: 'FAQ',         href: '/faq',          soon: false, adminOnly: false },
  { label: 'Scores',      href: '/scores',       soon: false, adminOnly: true  },
  { label: 'Admin',       href: '/admin',        soon: false, adminOnly: true  },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const ctx = useWalletContextSafe();
  const address = ctx?.address ?? null;
  const isAdmin = !!(ADMIN_ADDRESS && address && address === ADMIN_ADDRESS);

  const links = NAV.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {links.map((item) => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.soon ? '#' : item.href}
            onClick={onClose}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
              item.adminOnly
                ? active ? 'text-yellow-300' : 'text-yellow-500/70 hover:text-yellow-300'
                : active ? 'text-blue-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
            {item.soon && (
              <span className="absolute -top-2 -right-1 bg-blue-500 text-black text-[8px] font-black uppercase px-1 py-0.5 rounded leading-none">
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}


function ProfileButton() {
  const ctx = useWalletContextSafe();
  const address = ctx?.address ?? null;
  const { profile, saveProfile } = useProfile(address);
  const [profileOpen, setProfile] = useState(false);

  if (!address) return null;

  function handleSave(p: import('@/hooks/useProfile').UserProfile) {
    saveProfile(p);
    // Mark as registered locally — leaderboard page reads this to show the user even before on-chain squad
    if (address) localStorage.setItem(`injmatch_registered_${address}`, '1');
    setProfile(false);
  }

  return (
    <>
      <button
        onClick={() => setProfile(true)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-700 hover:border-blue-500 transition-colors overflow-hidden bg-gray-900"
        aria-label="Profile"
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] font-black text-gray-400">
            {profile.username ? profile.username[0].toUpperCase() : '?'}
          </span>
        )}
      </button>

      <AnimatePresence>
        {profileOpen && (
          <ProfileModal
            profile={profile}
            address={address}
            onSave={handleSave}
            onClose={() => setProfile(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenu] = useState(false);

  return (
    <WalletProvider>
      {/* Nav */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full px-3 py-3 bg-transparent"
      >
        <header className="w-full rounded-2xl border border-gray-700/60 bg-[rgba(10,10,10,0.92)] backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg- rounded-md flex items-center justify-center">
              <img src="../favicon.jpg" alt="injlogo" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-base font-black tracking-tight leading-none">
              <span className="text-white">INJ</span>
              <span className="text-blue-400">MATCH</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLinks />
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Profile button — only when connected */}
            <ProfileButton />

            {/* Wallet */}
            <WalletButton />

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setMenu(v => !v)}
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </header>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="lg:hidden mt-2 rounded-2xl border border-gray-700/60 bg-[rgba(10,10,10,0.96)] backdrop-blur-xl px-2 py-3 flex flex-col"
            >
              <NavLinks onClose={() => setMenu(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <main>{children}</main>
    </WalletProvider>
  );
}
