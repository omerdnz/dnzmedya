'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  type ReferenceItem,
  getReferenceInitials,
  getReferenceLogoUrl,
} from '@/lib/references';

interface ReferencesProps {
  references: ReferenceItem[];
}

function ReferenceLogoCard({
  ref: item,
  index,
}: {
  ref: ReferenceItem;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = getReferenceLogoUrl(item);

  const inner = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex h-16 items-center justify-center md:h-20">
        {logoUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`${item.title} logo`}
            className="h-10 w-auto max-w-[120px] object-contain opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 md:h-12"
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="font-heading text-2xl font-bold text-brand-gray-500 transition-colors group-hover:text-brand-cyan">
            {getReferenceInitials(item.title)}
          </span>
        )}
      </div>
      <div className="relative mt-3 text-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <p className="text-xs font-semibold text-brand-white">{item.title}</p>
        <p className="text-[10px] text-brand-gray-500">{item.client}</p>
      </div>
    </>
  );

  const className =
    'group relative flex h-full min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand-cyan/25 hover:shadow-[0_0_30px_rgba(0,206,209,0.15)]';

  if (item.url) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45, delay: (index % 10) * 0.04 }}
      >
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          title={item.title}
        >
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: (index % 10) * 0.04 }}
      className={className}
    >
      {inner}
    </motion.div>
  );
}

export function ReferencesSection({ references }: ReferencesProps) {
  if (!references.length) return null;

  const row1 = references.slice(0, 10);
  const row2 = references.slice(10, 20);

  return (
    <section id="referanslar" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-black via-brand-elevated/20 to-brand-black" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand-cyan/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-brand-gold/[0.04] blur-3xl" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-block rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">
            Referanslar
          </span>
          <h2 className="mt-5 font-heading text-4xl font-bold md:text-5xl">
            Dünya Devleriyle{' '}
            <span className="text-gradient-cyan">Aynı Teknoloji</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-gray-400">
            Projelerimizde kullandığımız altyapı ve teknolojiler — global teknoloji
            liderlerinin ekosistemleriyle uyumlu, enterprise düzeyinde çözümler.
          </p>
        </motion.div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {row1.map((ref, i) => (
              <ReferenceLogoCard key={ref.id} ref={ref} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {row2.map((ref, i) => (
              <ReferenceLogoCard key={ref.id} ref={ref} index={i + 10} />
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-xs text-brand-gray-500"
        >
          Google, Microsoft, AWS, OpenAI ve daha fazlası — modern dijital projelerin temel taşları.
        </motion.p>
      </div>
    </section>
  );
}
