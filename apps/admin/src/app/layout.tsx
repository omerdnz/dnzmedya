import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DNZMEDYA Yönetim Paneli',
    template: '%s | DNZMEDYA Admin',
  },
  description: 'DNZMEDYA içerik ve CRM yönetim paneli',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className={`${montserrat.variable} ${inter.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
