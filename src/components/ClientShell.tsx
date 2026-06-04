'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const WalletProvider = dynamic(
  () => import('@/components/wallet/WalletProvider').then((m) => m.WalletProvider),
  { ssr: false },
);

const WalletButton = dynamic(
  () => import('@/components/wallet/WalletButton').then((m) => m.WalletButton),
  { ssr: false },
);

const NAV = [
  { label: 'World Cup',   href: '/',            soon: false },
  { label: 'Fixtures',    href: '/fixtures',    soon: false },
  { label: 'Squad',       href: '/squad',       soon: false },
  { label: 'Leaderboard', href: '/leaderboard', soon: false },
];

function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.soon ? '#' : item.href}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
              active ? 'text-green-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
            {item.soon && (
              <span className="absolute -top-2 -right-1 bg-green-500 text-black text-[8px] font-black uppercase px-1 py-0.5 rounded leading-none">
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'EN' | 'UA'>('EN');

  return (
    <WalletProvider>
      {/* Outer wrapper — full width with padding so the container floats */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full px-4 py-3 bg-transparent"
      >
        {/* Inner container — rounded pill with dark bg + border */}
        <header className="w-full rounded-2xl border border-gray-700/60 bg-[rgba(10,10,10,0.92)] backdrop-blur-xl px-5 py-3 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <span className="text-black font-black text-sm">⚽</span>
            </div>
            <span className="text-lg font-black tracking-tight leading-none">
              <span className="text-white">INJ</span>
              <span className="text-green-400">MATCH</span>
            </span>
          </a>

          {/* ── Nav links ── */}
          <NavLinks />

          {/* ── Right side controls ── */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Language toggle */}
            <div className="hidden sm:flex items-center rounded-lg overflow-hidden border border-gray-700">
              {(['EN', 'UA'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                    lang === l
                      ? 'bg-green-500 text-black'
                      : 'text-gray-400 hover:text-white bg-transparent'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Twitter / X link */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.84L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              
            </a>

            {/* Connect Wallet */}
            <WalletButton />
          </div>
        </header>
      </motion.div>

      <main>{children}</main>
    </WalletProvider>
  );
}
