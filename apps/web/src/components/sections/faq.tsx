'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const items = Array.isArray(faqs) ? faqs : [];

  return (
    <section id="sss" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-dark/50 to-brand-black" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="container relative mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
            SSS
          </span>
          <h2 className="mt-5 font-heading text-4xl font-bold md:text-5xl">Sıkça Sorulan Sorular</h2>
        </motion.div>

        <div className="space-y-3">
          {items.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-brand-gold/30 bg-brand-elevated/80 shadow-glow'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="pr-4 font-medium">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gold/10 text-lg text-brand-gold"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="border-t border-white/5 px-5 pb-5 pt-3 leading-relaxed text-brand-gray-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
