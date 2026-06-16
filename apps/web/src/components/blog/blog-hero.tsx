'use client';

import { motion } from 'framer-motion';

export function BlogHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-[#0A1020] to-brand-black" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <motion.div
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-brand-cyan/[0.07] blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-brand-gold/[0.06] blur-3xl"
        />
      </div>

      <div className="container relative mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            Teknoloji & Dijital İçgörüler
          </span>
          <h1 className="mx-auto mt-8 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-6xl">
            Dijital dünyadan{' '}
            <span className="text-gradient-cyan">güncel yazılar</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-gray-400">
            Next.js, AWS, Shopify, OpenAI ve daha fazlası — hizmetlerimizle örtüşen teknoloji
            altyapıları, trendler ve uzman rehberleri.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
