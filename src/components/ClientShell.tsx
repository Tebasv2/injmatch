'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useWalletContextSafe } from '@/components/wallet/WalletProvider';
import { ProfilePanel } from '@/components/profile/ProfilePanel';

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

function AuthButton() {
  const { data: session, status } = useSession();
  const [panelOpen, setPanelOpen] = useState(false);

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn('discord')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#5865F2]/50 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors text-[11px] font-bold text-[#5865F2] uppercase tracking-wider"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
        Login
      </button>
    );
  }

  const user = session.user;
  return (
    <>
      <button
        onClick={() => setPanelOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-[#5865F2]/40 hover:border-[#5865F2] transition-colors overflow-hidden bg-gray-900"
        aria-label="Profile"
      >
        {user?.image ? (
          <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] font-black text-[#5865F2]">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        )}
      </button>

      <AnimatePresence>
        {panelOpen && <ProfilePanel onClose={() => setPanelOpen(false)} />}
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
            <AuthButton />
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
