import { cn } from '@dnzmedya/ui';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-brand-gray-300 border-white/10',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  info: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/20',
  gold: 'bg-brand-gold/15 text-brand-gold border-brand-gold/20',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return active ? <Badge variant="success">Aktif</Badge> : <Badge variant="default">Pasif</Badge>;
}

export function PublishBadge({ published }: { published: boolean }) {
  return published ? <Badge variant="gold">Yayında</Badge> : <Badge variant="default">Taslak</Badge>;
}
