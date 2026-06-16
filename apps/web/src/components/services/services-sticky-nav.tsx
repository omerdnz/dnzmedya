'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceDefinition } from '@/lib/services-data';

interface ServicesStickyNavProps {
  services: ServiceDefinition[];
}

export function ServicesStickyNav({ services }: ServicesStickyNavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <AnimatePresence>
      {visible && services.length > 0 && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-0 right-0 top-[72px] z-40 border-b border-white/[0.06] bg-brand-black/70 backdrop-blur-2xl"
        >
          <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-6 py-3">
            <button
              type="button"
              onClick={() => scrollTo('hizmetler-grid')}
              className="shrink-0 rounded-xl border border-brand-gold/20 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-gold transition-colors hover:bg-brand-gold/15"
            >
              Tüm Hizmetler
            </button>
            <div className="mx-1 h-5 w-px shrink-0 bg-white/10" />
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => scrollTo(`service-${service.id}`)}
                className="shrink-0 rounded-xl px-3 py-2 text-xs font-medium text-brand-gray-400 transition-colors hover:bg-white/[0.04] hover:text-brand-white"
              >
                {service.title.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
