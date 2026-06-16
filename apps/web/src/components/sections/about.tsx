'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

const stats = [
  { value: '150+', label: 'Tamamlanan Proje', icon: '🚀' },
  { value: '98%', label: 'Müşteri Memnuniyeti', icon: '⭐' },
  { value: '5+', label: 'Yıllık Deneyim', icon: '🏆' },
  { value: '24/7', label: 'Teknik Destek', icon: '💬' },
];

export function AboutSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section id="hakkimizda" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-brand-gold/[0.04] blur-3xl"
      />

      <div className="container relative mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Hakkımızda
            </span>
            <h2 className="mt-5 font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
              Dijital Dünyada{' '}
              <span className="text-gradient-cyan">Fark Yaratan</span> Çözümler
            </h2>
            <p className="mt-6 leading-relaxed text-brand-gray-400">
              DNZMEDYA olarak fikirlerinizi dijital başarıya dönüştüren yenilikçi teknolojiler ve profesyonel çözümler sunuyoruz. Proje bazlı web yazılım geliştirmeden SEO ve dijital reklam yönetimine kadar geniş bir yelpazede hizmet veriyoruz.
            </p>
            <p className="mt-4 leading-relaxed text-brand-gray-400">
              Antalya merkezli ekibimiz, her projeye özel yaklaşım ve müşteri memnuniyeti odaklı çalışma prensibiyle dijitalde büyümenize katkı sağlıyor.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-brand-elevated/50 p-6 text-center backdrop-blur-xl transition-all duration-500 hover:border-brand-gold/30 hover:shadow-glow"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="text-2xl">{stat.icon}</span>
                <div className="mt-2 font-heading text-3xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="mt-1 text-sm text-brand-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
