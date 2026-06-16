'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/pages': 'Sayfalar',
  '/blog': 'Blog',
  '/services': 'Servisler',
  '/references': 'Referanslar',
  '/scripts': 'Hazır Scriptler',
  '/faqs': 'SSS',
  '/hero': 'Hero',
  '/media': 'Medya Merkezi',
  '/seo': 'SEO',
  '/customers': 'Müşteriler',
  '/quotes': 'Teklifler',
  '/forms': 'Formlar',
  '/reports': 'Raporlar',
  '/users': 'Kullanıcılar',
  '/settings': 'Ayarlar',
  '/backup': 'Yedekleme',
  '/system': 'Sistem',
};

export function Topbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const title = routeTitles[pathname] ?? 'Panel';

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] glass-elevated">
      <div className="flex h-[72px] items-center justify-between px-6">
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-cyan/80">DNZMEDYA Admin</p>
          <h1 className="font-heading text-xl font-bold text-brand-white">{title}</h1>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
              target="_blank"
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-brand-gray-300 transition-all duration-300 hover:border-brand-cyan/30 hover:bg-brand-cyan/5 hover:text-brand-cyan sm:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Siteyi Görüntüle
            </Link>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-gold/25 to-brand-cyan/15 font-heading text-sm font-bold text-brand-gold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-brand-white">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-brand-gray-500">{user.role}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
