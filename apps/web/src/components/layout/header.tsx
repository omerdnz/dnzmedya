'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoInline } from '@dnzmedya/ui';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/#hakkimizda' },
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: 'Referanslar', href: '/#referanslar' },
  { label: 'Blog', href: '/blog' },
  { label: 'İletişim', href: '/iletisim' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-brand-black/80 py-3 shadow-soft backdrop-blur-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" aria-label="DNZMEDYA Ana Sayfa" className="shrink-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="drop-shadow-[0_0_22px_rgba(0,206,209,0.35)]"
          >
            <LogoInline className="h-14 md:h-16" />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href.replace('/#', '/'));
            return (
              <Link key={link.href} href={link.href} className="relative px-4 py-2">
                <motion.span
                  whileHover={{ y: -1 }}
                  className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-brand-gold' : 'text-brand-gray-300 hover:text-brand-white'
                  }`}
                >
                  {link.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-brand-gold/10 border border-brand-gold/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/teklif-al"
              className="ml-4 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-gold-light px-5 py-2.5 text-sm font-semibold text-brand-black shadow-glow transition-all duration-300 hover:shadow-glow"
            >
              Teklif Al
            </Link>
          </motion.div>
        </nav>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="rounded-xl p-2 text-brand-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10 bg-brand-black/95 backdrop-blur-2xl lg:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-brand-gray-300 transition-colors hover:bg-white/5 hover:text-brand-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/teklif-al"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-2xl bg-brand-gold py-3 text-center font-semibold text-brand-black"
              >
                Teklif Al
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
