'use client';

import { motion } from 'framer-motion';
import type { ServiceDefinition } from '@/lib/services-data';
import { ACCENT_STYLES } from '@/lib/services-data';
import { ServiceIcon3D } from '@/components/services/service-icon';

interface ServiceCardProps {
  service: ServiceDefinition;
  index: number;
  onSelect: (service: ServiceDefinition) => void;
}

export function ServiceCard({ service, index, onSelect }: ServiceCardProps) {
  const styles = ACCENT_STYLES[service.accent];

  return (
    <motion.article
      id={`service-${service.id}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-1000 scroll-mt-36"
    >
      <motion.button
        type="button"
        onClick={() => onSelect(service)}
        whileHover={{ y: -10, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className={`group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 text-left backdrop-blur-xl transition-all duration-500 ${styles.border} ${styles.glow}`}
      >
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${styles.gradient} blur-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-80`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative mb-6">
          <ServiceIcon3D service={service} styles={styles} />
        </div>

        <div className="relative flex flex-1 flex-col">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan/80">
            {service.tagline}
          </p>
          <h3 className="mb-3 font-heading text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-brand-gold md:text-[1.35rem]">
            {service.title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-brand-gray-400">{service.description}</p>

          <ul className="mt-5 space-y-2">
            {service.highlights.slice(0, 2).map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-brand-gray-500">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-cyan/70" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
            <span className="text-sm font-medium text-brand-gray-400 transition-colors duration-300 group-hover:text-brand-white">
              Detayları gör
            </span>
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-cyan transition-all duration-300 group-hover:border-brand-cyan/30 group-hover:bg-brand-cyan/10"
              whileHover={{ x: 4 }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.button>
    </motion.article>
  );
}
