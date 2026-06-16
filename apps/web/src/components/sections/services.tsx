'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@dnzmedya/ui';
import type { ServiceItem } from '@dnzmedya/types';
import { CodeBackground } from '@/components/effects/code-background';
interface ServicesProps {
  services: ServiceItem[];
}

const SERVICE_ICONS = [
  { emoji: '🌐', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'group-hover:border-cyan-500/40' },
  { emoji: '🔍', gradient: 'from-emerald-500/20 to-green-500/20', border: 'group-hover:border-emerald-500/40' },
  { emoji: '📊', gradient: 'from-purple-500/20 to-pink-500/20', border: 'group-hover:border-purple-500/40' },
  { emoji: '🛒', gradient: 'from-orange-500/20 to-amber-500/20', border: 'group-hover:border-orange-500/40' },
  { emoji: '📱', gradient: 'from-brand-cyan/20 to-blue-500/20', border: 'group-hover:border-brand-cyan/40' },
  { emoji: '⚙️', gradient: 'from-brand-gold/20 to-yellow-500/20', border: 'group-hover:border-brand-gold/40' },
];

export function ServicesSection({ services }: ServicesProps) {
  return (
    <section id="servisler" className="relative overflow-hidden py-28">
      <CodeBackground />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold"
          >
            Hizmetlerimiz
          </motion.span>
          <h2 className="mt-5 font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
            Size Özel <span className="text-gradient-gold">Dijital Çözümler</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-gray-400">
            Markanızı dijital dünyada öne çıkaracak profesyonel hizmetler sunuyoruz.
          </p>
          <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-2 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-6 py-3 text-sm font-semibold text-brand-gold transition-all duration-300 hover:border-brand-gold/50 hover:bg-brand-gold/15 hover:shadow-glow"
            >
              Tüm Hizmetleri Keşfet
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="perspective-1000"
              >
                <Card
                  hover
                  className={`group relative h-full overflow-hidden border-white/10 bg-brand-elevated/60 backdrop-blur-xl transition-all duration-500 ${icon.border}`}
                >
                  <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${icon.gradient} blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-50`} />

                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${icon.gradient} text-2xl shadow-soft`}
                    >
                      {icon.emoji}
                    </motion.div>

                    <h3 className="mb-2 font-heading text-xl font-bold transition-colors duration-300 group-hover:text-brand-gold">
                      {service.title}
                    </h3>

                    {service.subtitle && (
                      <p className="mb-3 text-sm font-medium text-brand-cyan">{service.subtitle}</p>
                    )}

                    {service.description && (
                      <p className="text-sm leading-relaxed text-brand-gray-400">{service.description}</p>
                    )}

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      className="mt-5 h-px bg-gradient-to-r from-brand-gold/50 via-brand-cyan/30 to-transparent"
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
