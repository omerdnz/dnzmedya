'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ServicesHero } from '@/components/services/services-hero';
import { ServicesStickyNav } from '@/components/services/services-sticky-nav';
import { ServiceCard } from '@/components/services/service-card';
import { ServiceModal } from '@/components/services/service-modal';
import type { ServiceDefinition } from '@/lib/services-data';

interface ServicesPageProps {
  services: ServiceDefinition[];
}

export function ServicesPage({ services }: ServicesPageProps) {
  const [selected, setSelected] = useState<ServiceDefinition | null>(null);

  return (
    <div className="relative overflow-hidden bg-brand-black">
      <ServicesHero />
      <ServicesStickyNav services={services} />

      <section id="hizmetler-grid" className="relative py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

        <div className="container relative mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center md:mb-20"
          >
            <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Hizmet Portföyü
            </span>
            <h2 className="mt-5 font-heading text-3xl font-bold md:text-5xl">
              Her biri <span className="text-gradient-gold">premium</span> bir çözüm
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-brand-gray-400">
              {services.length > 0
                ? `${services.length} farklı uzmanlık alanında, markanızın büyümesi için tasarlanmış uçtan uca dijital hizmetler.`
                : 'Hizmetler yükleniyor veya henüz yayınlanmış kayıt bulunmuyor.'}
            </p>
          </motion.div>

          {services.length === 0 ? (
            <p className="text-center text-brand-gray-500">
              Admin panelinden Servisler bölümüne hizmet ekleyebilirsiniz.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative border-t border-white/[0.06] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container relative mx-auto px-6 text-center"
        >
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Projenize <span className="text-gradient-cyan">hemen başlayalım</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-gray-400">
            Ücretsiz ön görüşme ile ihtiyaçlarınızı dinliyor, size özel teklif hazırlıyoruz.
          </p>
          <Link
            href="/teklif-al"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-gold-light px-10 py-4 font-semibold text-brand-black shadow-glow transition-transform hover:scale-[1.03]"
          >
            Ücretsiz Teklif Al
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </section>

      <ServiceModal service={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
