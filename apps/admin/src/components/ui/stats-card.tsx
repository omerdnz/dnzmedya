'use client';

import { motion } from 'framer-motion';
import { Card } from '@dnzmedya/ui';

interface StatsCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'gold' | 'cyan' | 'default';
  index?: number;
}

const accentStyles = {
  gold: {
    border: 'border-brand-gold/25',
    text: 'text-brand-gold',
    glow: 'from-brand-gold/10 to-transparent',
    dot: 'bg-brand-gold',
  },
  cyan: {
    border: 'border-brand-cyan/25',
    text: 'text-brand-cyan',
    glow: 'from-brand-cyan/10 to-transparent',
    dot: 'bg-brand-cyan',
  },
  default: {
    border: 'border-white/10',
    text: 'text-brand-white',
    glow: 'from-white/5 to-transparent',
    dot: 'bg-brand-gray-500',
  },
};

export function StatsCard({ label, value, hint, accent = 'default', index = 0 }: StatsCardProps) {
  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={`relative overflow-hidden border ${styles.border} bg-brand-elevated/60 shadow-card backdrop-blur-sm`}>
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow}`} />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot} animate-pulse-glow`} />
            <p className="text-sm font-medium text-brand-gray-400">{label}</p>
          </div>
          <p className={`mt-3 font-heading text-3xl font-bold ${styles.text}`}>{value}</p>
          {hint && <p className="mt-1.5 text-xs text-brand-gray-500">{hint}</p>}
        </div>
      </Card>
    </motion.div>
  );
}
