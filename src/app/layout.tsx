import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InjMatch — World Cup Prediction League',
  description: 'Predict World Cup match scores and win INJ on the Injective blockchain',
icons: '/favicon.ico', // This points to your public/favicon.ico
  
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
