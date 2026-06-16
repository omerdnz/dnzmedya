'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceDefinition } from '@/lib/services-data';
import { ACCENT_STYLES } from '@/lib/services-data';
import { ServiceIcon } from '@/components/services/service-icon';

interface ServiceModalProps {
  service: ServiceDefinition | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const styles = service ? ACCENT_STYLES[service.accent] : null;

  return (
    <AnimatePresence>
      {service && styles && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-brand-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-h-[80vh] max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-brand-elevated/95 shadow-3d backdrop-blur-2xl md:inset-x-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <div className={`relative overflow-hidden p-8 md:p-10`}>
              <div
                className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${styles.gradient} blur-3xl`}
              />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-gray-400 transition-colors hover:text-brand-white"
                aria-label="Kapat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div
                className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${styles.icon} text-brand-white`}
              >
                <ServiceIcon serviceId={service.id} className="h-8 w-8" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">{service.tagline}</p>
              <h2 id="service-modal-title" className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                {service.title}
              </h2>
              <p className="mt-4 leading-relaxed text-brand-gray-400">{service.description}</p>

              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gold">Neler Sunuyoruz</h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.highlights.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.35 }}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-brand-gray-300"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-cyan/10 text-brand-cyan">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/teklif-al"
                  onClick={onClose}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-gold to-brand-gold-light px-6 py-3.5 text-center font-semibold text-brand-black transition-transform hover:scale-[1.02]"
                >
                  Bu Hizmet İçin Teklif Al
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 px-6 py-3.5 font-medium text-brand-gray-300 transition-colors hover:border-white/20 hover:text-brand-white"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
