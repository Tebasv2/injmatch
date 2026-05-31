import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/wallet/WalletProvider';
import { WalletButton } from '@/components/wallet/WalletButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InjMatch — World Cup Prediction League',
  description: 'Predict World Cup match scores and win INJ on the Injective blockchain',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <WalletProvider>
          <header className="border-b border-gray-800 sticky top-0 z-40 bg-gray-950/80 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚽</span>
                <span className="font-bold text-xl">InjMatch</span>
                <span className="text-xs text-gray-500 hidden sm:block ml-1">Testnet</span>
              </div>
              <WalletButton />
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
