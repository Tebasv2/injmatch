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
import { PrizeSplit } from '@/components/PrizeSplit';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

const FAQS = [
  { q: 'Which wallet do I need?', a: 'Keplr browser extension. Install it, add the Injective testnet, and hit Connect.' },
  { q: 'When can I submit predictions?', a: 'Any time before the match kicks off. Once the referee blows the whistle the window closes.' },
  { q: 'How are prizes distributed?', a: 'Automatically via the smart contract — 60% to first, 30% to second, 10% to third.' },
  { q: 'Is this on mainnet?', a: 'Currently on Injective testnet (injective-888). Mainnet launch follows a security audit.' },
];

export default function HomePage() {
  const { isConnected } = useWalletContext();
  const [showCreate, setShowCreate] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const trophyY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">

        {/* hero-bg.jpg with parallax + left-side dark gradient */}
        <motion.div
          style={{ y: trophyY }}
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(10,10,10,0.92) 38%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.15) 100%), url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            y: trophyY,
          } as any}
        />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 px-6 md:px-16 max-w-2xl pt-8">

          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-green-500/40 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Fantasy Season Is Live
          </motion.div>

          {/* Headline */}
          <h1 className="text-[clamp(48px,7vw,88px)] font-black leading-[0.95] uppercase mb-8">
            {[
              { text: 'PREDICT THE', green: false },
              { text: 'WORLD CUP', green: true },
              { text: 'BETTER THAN', green: false },
              { text: 'EVERYONE?', green: true },
              { text: 'TIME TO EARN', green: false },
              { text: 'FROM IT', green: false },
            ].map((line, i) => (
              <motion.span
                key={line.text}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`block ${line.green ? 'text-green-400' : 'text-white'}`}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          {/* Stat info blocks */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {[
              
              { label: 'UNTIL DEADLINE', sub: '', val: 'JUN 11,19:00 UTC' },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-[#1a1a1a]/80 border border-gray-700/50 backdrop-blur rounded-xl px-5 py-3 min-w-[120px]"
              >
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-snug">{c.label}</p>
                {c.sub && <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">{c.sub}</p>}
                {c.val
                  ? <p className="text-sm font-bold text-white mt-1">{c.val}</p>
                  : <div className="w-5 h-0.5 bg-gray-700 mt-2" />
                }
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.button
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => isConnected && setShowCreate(true)}
              className="inline-flex items-center gap-3 border-2 border-white text-white font-black uppercase tracking-[0.18em] px-8 py-4 rounded-full text-sm transition-colors"
            >
              START COMPETING <span className="text-base">→</span>
            </motion.button>
          </motion.div>
        </motion.div>

        
      </section>

  
      
      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-20 px-6 md:px-16 bg-[#0a0a0a]">
        <FadeUp className="mb-10">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">World Cup 2026</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white">How It Works</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              n: '01',
              text: 'Pick 11 + 3 from real World Cup squads before the tournament deadline.',
            },
            {
              n: '02',
              text: 'Submit predictions. Earn points from real match actions, goals, assists, clean sheets, ratings.',
            },
            {
              n: '03',
              text: 'Top 10 of tournament split the INJ prize pool. Claim on the leaderboard.',
            },
          ].map((step, i) => (
            <FadeUp key={step.n} delay={i * 0.1}>
              <motion.div
                whileHover={{ borderColor: 'rgba(74,222,128,0.35)', y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-[#141414] border border-gray-800 rounded-2xl p-8 h-full"
              >
                {/* Glowing green number */}
                <p
                  className="text-7xl font-black text-green-400 mb-5 leading-none"
                  style={{ textShadow: '0 0 40px rgba(74,222,128,0.5), 0 0 80px rgba(74,222,128,0.2)' }}
                >
                  {step.n}
                </p>
                <p className="text-white text-sm leading-relaxed">{step.text}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════ SCORING ══════════ */}
      <section className="py-20 px-6 md:px-16 bg-[#0d0d0d] border-t border-gray-800/50">
        <FadeUp className="max-w-4xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Scoring</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Points System</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { pts: '3', label: 'Exact Score', desc: 'Nail the precise scoreline of the match.' },
              { pts: '1', label: 'Correct Outcome', desc: 'Right winner or draw, wrong score.' },
              { pts: '0', label: 'Incorrect', desc: 'Wrong result — back to the drawing board.' },
            ].map((row, i) => (
              <motion.div
                key={row.pts}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(74,222,128,0.3)' }}
                className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center"
              >
                <p
                  className="text-6xl font-black text-green-400 mb-3"
                  style={{ textShadow: '0 0 30px rgba(74,222,128,0.4)' }}
                >
                  {row.pts}
                </p>
                <p className="text-white font-bold uppercase tracking-wide mb-1 text-sm">{row.label}</p>
                <p className="text-gray-500 text-xs">{row.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ══════════ PRIZES ══════════ */}
      <PrizeSplit />

      {/* ══════════ FAQ ══════════ */}
      <section className="py-20 px-6 md:px-16 bg-[#0d0d0d] border-t border-gray-800/50">
        <FadeUp className="max-w-2xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">FAQ</p>
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
                    className="text-green-400 text-xl ml-4 flex-shrink-0"
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

      {/* ══════════ FOOTER CTA ══════════ */}
      <section className="py-24 px-6 md:px-16 bg-[#0a0a0a] border-t border-gray-800/50 text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
            Ready to <span className="text-green-400">compete?</span>
          </h2>
          <p className="text-gray-500 mb-10 text-base">
            Join a league, predict every game, win INJ — all on-chain.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: '#16a34a' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => isConnected && setShowCreate(true)}
            className="inline-flex items-center gap-3 bg-green-500 text-black font-black uppercase tracking-[0.2em] px-10 py-5 rounded-full text-sm transition-colors"
          >
            START COMPETING →
          </motion.button>
        </FadeUp>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-gray-800/50 py-8 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-700 text-[10px] uppercase tracking-widest bg-[#0a0a0a]">
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
