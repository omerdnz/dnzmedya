'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@dnzmedya/ui';
import type { HeroData } from '@dnzmedya/types';
import { Grid3DBackground, ParticleField } from '@/components/effects/code-background';

interface HeroProps {
  data: HeroData | null;
}

export function HeroSection({ data }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const rotateX = useTransform(springY, [-50, 50], [3, -3]);
  const rotateY = useTransform(springX, [-50, 50], [-3, 3]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!data?.counterValue) return;
    const target = data.counterValue;
    const duration = 2200;
    const start = performance.now();
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [data?.counterValue]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 25);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 25);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  if (!data) return null;

  return (
    <section ref={containerRef} id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden perspective-1000">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-black via-[#0A0F1A] to-brand-black">
        {data.videoUrl ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-25" poster={data.image?.url}>
            <source src={data.videoUrl} type="video/mp4" />
          </video>
        ) : null}
        <Grid3DBackground />
        <ParticleField />
      </div>

      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,206,209,0.12)_0%,transparent_55%)]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_80%_80%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />

      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none absolute top-1/4 left-1/4 z-[2] h-[420px] w-[420px] rounded-full bg-brand-gold/[0.06] blur-3xl"
      />
      <motion.div
        style={{ x: springY, y: springX }}
        className="pointer-events-none absolute bottom-1/3 right-1/4 z-[2] h-80 w-80 rounded-full bg-brand-cyan/[0.07] blur-3xl"
      />

      <motion.div
        style={{ rotateX, rotateY }}
        className="relative z-10 container mx-auto px-6 py-32 text-center preserve-3d"
      >
        {data.subtitle && (
          <motion.span
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 px-5 py-2 text-sm font-medium text-brand-cyan backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-cyan shadow-glow-cyan" />
            {data.subtitle}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 font-heading text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="text-gradient-cyan">{data.title}</span>
        </motion.h1>

        {data.description && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-brand-gray-400 md:text-xl"
          >
            {data.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {data.ctaText && data.ctaUrl && (
            <Link href={data.ctaUrl}>
              <Button size="lg" className="shadow-glow hover:scale-105 transition-transform duration-300">
                {data.ctaText}
              </Button>
            </Link>
          )}
          {data.secondaryCtaText && data.secondaryCtaUrl && (
            <Link href={data.secondaryCtaUrl}>
              <Button variant="outline" size="lg" className="border-brand-cyan/30 hover:border-brand-cyan/60 hover:bg-brand-cyan/5">
                {data.secondaryCtaText}
              </Button>
            </Link>
          )}
        </motion.div>

        {data.counterValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, rotateX: -2 }}
            className="inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-12 py-7 shadow-3d backdrop-blur-xl hover-glow"
          >
            <span className="font-heading text-5xl font-bold text-gradient-gold md:text-6xl">{count}+</span>
            {data.counterLabel && (
              <span className="mt-2 text-sm tracking-wide text-brand-gray-400">{data.counterLabel}</span>
            )}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="flex h-11 w-6 justify-center rounded-full border-2 border-brand-gold/40 pt-2"
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], height: ['8px', '14px', '8px'] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="w-1 rounded-full bg-brand-gold"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
