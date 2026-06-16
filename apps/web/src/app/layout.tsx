import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AiChatWidget } from '@/components/chat/ai-chat-widget';
import { PageviewTracker } from '@/components/analytics/pageview-tracker';
import { getSiteSettings } from '@/lib/site-settings';
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
    default: 'DNZMEDYA | Yazılım, SEO ve Dijital Reklam Ajansı',
    template: '%s | DNZMEDYA',
  },
  description: 'DNZMEDYA, proje bazlı web yazılım geliştirme, kurumsal web sitesi tasarımı, e-ticaret çözümleri, SEO, dijital reklam yönetimi ve bilgi teknolojileri danışmanlığı alanlarında profesyonel hizmetler sunan yenilikçi bir dijital çözüm ortağıdır.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'DNZMEDYA',
  },
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="tr" className="dark">
      <body className={`${montserrat.variable} ${inter.variable} font-body`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer settings={settings} />
          <AiChatWidget />
          <PageviewTracker />
        </Providers>
      </body>
    </html>
  );
}
