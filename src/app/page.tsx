'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { CreateLeagueModal } from '@/components/league/CreateLeagueModal';
import { useWalletContext } from '@/components/wallet/WalletProvider';

/* ─── Reusable fade-up on scroll ─── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        {inView ? (
          <motion.span
            initial={0}
            animate={{ value: target } as any}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {target}
          </motion.span>
        ) : (
          '0'
        )}
        {suffix}
      </motion.span>
    </span>
  );
}

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Join a League',
    desc: 'Pay the entry fee in INJ. Choose from public leagues or create a private one with friends.',
  },
  {
    n: '02',
    title: 'Submit Predictions',
    desc: 'Predict the exact scoreline of every World Cup fixture before kick-off.',
  },
  {
    n: '03',
    title: 'Climb the Board',
    desc: '3 pts for an exact score. 1 pt for the correct outcome. Every match counts.',
  },
  {
    n: '04',
    title: 'Win INJ',
    desc: 'At full time the prize pool is split 60/30/10 between the top three on-chain, instantly.',
  },
];

const FAQS = [
  {
    q: 'Which wallet do I need?',
    a: 'Keplr browser extension. Install it, add the Injective testnet, and hit Connect.',
  },
  {
    q: 'When can I submit predictions?',
    a: 'Any time before the match kicks off. Once the referee blows the whistle the window closes.',
  },
  {
    q: 'How are prizes distributed?',
    a: 'Automatically via the smart contract — 60 % to first, 30 % to second, 10 % to third.',
  },
  {
    q: 'Is this on mainnet?',
    a: 'Currently on Injective testnet (injective-888). Mainnet launch follows a security audit.',
  },
];

export default function HomePage() {
  const { isConnected } = useWalletContext();
  const [showCreate, setShowCreate] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.4) 100%), url('/hero-bg.jpg')",
            y: heroY,
          } as any}
        />

        {/* Animated pitch lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white"
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="absolute right-[8%] top-1/2 -translate-y-1/2 w-6 h-6 -translate-x-3 -translate-y-3 rounded-full bg-white"
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 px-6 md:px-16 max-w-3xl pt-24"
        >
          {/* Tag line */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-6"
          >
            World Cup 2026 · On-chain · Injective
          </motion.p>

          {/* Headline — staggered words */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.0] uppercase mb-6">
            {['PREDICT THE', 'WORLD CUP', 'BETTER THAN', 'EVERYONE?', 'TIME TO', 'EARN FROM IT'].map(
              (line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${i === 1 || i === 3 || i === 5 ? 'text-green-400' : 'text-white'}`}
                >
                  {line}
                </motion.span>
              ),
            )}
          </h1>

          {/* Sub copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="text-gray-300 text-base md:text-lg mb-1">Study the fixtures and form.</p>
            <p className="text-gray-300 text-base md:text-lg mb-1">Submit your score predictions before kick-off.</p>
            <p className="text-gray-300 text-base md:text-lg mb-10">
              The sharper your picks, the more <span className="text-green-400 font-bold">INJ</span> lands in your wallet.
            </p>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-10 max-w-md"
          >
            {[
              { label: 'PRIZE POOL', sub: 'ACTIVE LEAGUES', val: '—' },
              { label: 'PLAYERS', sub: 'REGISTERED', val: '—' },
              { label: 'UNTIL DEADLINE', sub: '', val: 'Open' },
            ].map((c) => (
              <div
                key={c.label}
                className="border border-gray-700 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-sm"
              >
                <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-snug">{c.label}</p>
                <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">{c.sub}</p>
                <p className="text-sm font-bold text-white">{c.val}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.03, borderColor: '#4ade80', color: '#4ade80' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => isConnected && setShowCreate(true)}
              className="inline-flex items-center gap-3 border-2 border-white text-white font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full text-sm transition-colors"
            >
              START COMPETING <span>→</span>
            </motion.button>
            {!isConnected && (
              <p className="text-gray-600 text-xs mt-3 uppercase tracking-widest">
                Connect wallet to begin
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-6 md:left-16 flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.25em]"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            ↓
          </motion.div>
          How it works
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════ */}
      <div className="border-y border-gray-800 bg-green-400 py-3 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-black font-black uppercase text-sm tracking-widest">
              ⚽ InjMatch · Predict · Win INJ · World Cup 2026 · On Injective ·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-black">
        <FadeUp>
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">
            The game
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-16">How it works</h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800">
          {HOW_IT_WORKS.map((step, i) => (
            <FadeUp key={step.n} delay={i * 0.1}>
              <motion.div
                whileHover={{ backgroundColor: 'rgba(74,222,128,0.06)' }}
                className="bg-black p-8 h-full transition-colors"
              >
                <p className="text-5xl font-black text-green-400 mb-6">{step.n}</p>
                <h3 className="text-lg font-black uppercase mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          SCORING SYSTEM
      ══════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-gray-950 border-t border-gray-800">
        <FadeUp className="max-w-4xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Scoring</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Points system</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { pts: '3', label: 'Exact Score', desc: 'Nail the precise scoreline' },
              { pts: '1', label: 'Correct Outcome', desc: 'Right winner or draw, wrong score' },
              { pts: '0', label: 'Incorrect', desc: 'Wrong result entirely' },
            ].map((row, i) => (
              <motion.div
                key={row.pts}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="border border-gray-800 rounded-2xl p-8 text-center bg-black"
              >
                <p className="text-6xl font-black text-green-400 mb-3">{row.pts}</p>
                <p className="text-white font-bold uppercase tracking-wide mb-1">{row.label}</p>
                <p className="text-gray-500 text-sm">{row.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════
          PRIZES
      ══════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-black border-t border-gray-800">
        <FadeUp className="max-w-4xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Prizes</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Prize split</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { place: '🥇', pos: '1st', pct: '60%', col: 'border-yellow-400' },
              { place: '🥈', pos: '2nd', pct: '30%', col: 'border-gray-400' },
              { place: '🥉', pos: '3rd', pct: '10%', col: 'border-amber-600' },
            ].map((p, i) => (
              <motion.div
                key={p.pos}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className={`border-2 ${p.col} rounded-2xl p-8 text-center bg-black`}
              >
                <p className="text-4xl mb-3">{p.place}</p>
                <p className="text-white font-black text-xl uppercase mb-1">{p.pos} Place</p>
                <p className="text-green-400 font-black text-4xl">{p.pct}</p>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">of prize pool</p>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-gray-950 border-t border-gray-800">
        <FadeUp className="max-w-2xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Questions</h2>
          <div className="divide-y divide-gray-800">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-5 text-left group"
                >
                  <span className="font-bold text-white group-hover:text-green-400 transition-colors uppercase tracking-wide text-sm">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-green-400 text-xl font-light ml-4 flex-shrink-0"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 text-sm pb-5 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════
          FOOTER CTA
      ══════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-black border-t border-gray-800 text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
            Ready to <span className="text-green-400">compete?</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join a league, predict every game, win INJ — all on-chain.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: '#4ade80', color: '#000' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => isConnected && setShowCreate(true)}
            className="inline-flex items-center gap-3 bg-white text-black font-black uppercase tracking-[0.2em] px-10 py-5 rounded-full text-sm transition-colors"
          >
            START COMPETING →
          </motion.button>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer className="border-t border-gray-800 py-8 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs uppercase tracking-widest">
        <span className="font-black text-white text-sm">⚽ INJMATCH</span>
        <span>Injective Testnet · injective-888</span>
        <span>© 2026 InjMatch</span>
      </footer>

      {showCreate && (
        <CreateLeagueModal onClose={() => setShowCreate(false)} onCreated={() => setShowCreate(false)} />
      )}
    </div>
  );
}
