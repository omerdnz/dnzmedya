'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function ServicesHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-[#0A1020] to-brand-black" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full bg-brand-cyan/[0.08] blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-24 bottom-1/4 h-[420px] w-[420px] rounded-full bg-brand-gold/[0.07] blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,206,209,0.14)_0%,transparent_55%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-cyan backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,206,209,0.8)]" />
            Premium Dijital Hizmetler
          </motion.span>

          <h1 className="mx-auto mt-8 max-w-4xl font-heading text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Dijital dünyada{' '}
            <span className="text-gradient-cyan">markanızı büyüten</span>{' '}
            çözümler
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-brand-gray-400 md:text-xl">
            Web tasarımdan yapay zeka otomasyonuna, SEO&apos;dan marka kimliğine kadar —
            markanızı uçtan uca büyüten premium dijital hizmetler sunuyoruz.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/teklif-al"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-gold to-brand-gold-light px-8 py-4 text-base font-semibold text-brand-black shadow-glow transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(212,175,55,0.35)]"
            >
              <span className="relative z-10">Teklif Al</span>
              <svg className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            <a
              href="#hizmetler-grid"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-base font-medium text-brand-gray-300 backdrop-blur-xl transition-all duration-300 hover:border-brand-cyan/30 hover:text-brand-white"
            >
              Hizmetleri Keşfet
              <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </a>
          </motion.div>

          <div className="mx-auto mt-16 flex max-w-lg items-center justify-center gap-8 text-center">
            {[
              { value: '10+', label: 'Hizmet Alanı' },
              { value: '150+', label: 'Proje' },
              { value: '360°', label: 'Dijital Çözüm' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                className="flex-1"
              >
                <p className="font-heading text-2xl font-bold text-brand-gold md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-brand-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-black to-transparent" />
    </section>
  );
}
