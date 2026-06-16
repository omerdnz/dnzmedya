'use client';

import { Input, cn } from '@dnzmedya/ui';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function FormField({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-brand-gray-300">{label}</label>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-brand-gray-700 bg-brand-black px-4 py-3 text-brand-white',
        'placeholder:text-brand-gray-500 transition-colors',
        'focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold',
        'resize-none',
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-brand-gray-700 bg-brand-black px-4 py-3 text-brand-white',
        'focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-brand-black px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded accent-brand-gold"
      />
      <span className="text-sm text-brand-gray-300">{label}</span>
    </label>
  );
}

export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-brand-gray-700 bg-brand-black px-4 py-3 text-brand-white',
        'placeholder:text-brand-gray-500 transition-colors',
        'focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
