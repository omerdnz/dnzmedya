export interface ServiceDefinition {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  accent: 'cyan' | 'gold' | 'violet' | 'emerald' | 'rose' | 'amber' | 'sky' | 'indigo' | 'fuchsia' | 'teal';
}

export const ACCENT_STYLES: Record<
  ServiceDefinition['accent'],
  { gradient: string; glow: string; border: string; icon: string }
> = {
  cyan: {
    gradient: 'from-cyan-500/20 via-brand-cyan/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(0,206,209,0.25)]',
    border: 'group-hover:border-brand-cyan/40',
    icon: 'from-brand-cyan/30 to-cyan-600/20',
  },
  gold: {
    gradient: 'from-brand-gold/20 via-amber-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(212,175,55,0.25)]',
    border: 'group-hover:border-brand-gold/40',
    icon: 'from-brand-gold/30 to-amber-600/20',
  },
  violet: {
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]',
    border: 'group-hover:border-violet-500/40',
    icon: 'from-violet-500/30 to-purple-600/20',
  },
  emerald: {
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]',
    border: 'group-hover:border-emerald-500/40',
    icon: 'from-emerald-500/30 to-green-600/20',
  },
  rose: {
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]',
    border: 'group-hover:border-rose-500/40',
    icon: 'from-rose-500/30 to-pink-600/20',
  },
  amber: {
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    border: 'group-hover:border-amber-500/40',
    icon: 'from-amber-500/30 to-orange-600/20',
  },
  sky: {
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(14,165,233,0.25)]',
    border: 'group-hover:border-sky-500/40',
    icon: 'from-sky-500/30 to-blue-600/20',
  },
  indigo: {
    gradient: 'from-indigo-500/20 via-blue-600/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]',
    border: 'group-hover:border-indigo-500/40',
    icon: 'from-indigo-500/30 to-indigo-600/20',
  },
  fuchsia: {
    gradient: 'from-fuchsia-500/20 via-purple-500/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(217,70,239,0.25)]',
    border: 'group-hover:border-fuchsia-500/40',
    icon: 'from-fuchsia-500/30 to-fuchsia-600/20',
  },
  teal: {
    gradient: 'from-teal-500/20 via-cyan-600/10 to-transparent',
    glow: 'group-hover:shadow-[0_0_40px_rgba(20,184,166,0.25)]',
    border: 'group-hover:border-teal-500/40',
    icon: 'from-teal-500/30 to-teal-600/20',
  },
};
