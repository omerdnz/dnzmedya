import { cn } from './lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, hover, glow, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-gray-800 bg-brand-dark p-6 shadow-soft',
        hover && 'transition-all duration-300 hover:border-brand-gold/30 hover:shadow-glow',
        glow && 'shadow-glow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
