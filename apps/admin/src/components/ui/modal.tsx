'use client';

import { useEffect, type ReactNode } from 'react';
import { Button, cn } from '@dnzmedya/ui';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex min-h-full justify-center p-4 py-8">
      <div
        className={cn(
          'relative flex w-full max-h-none flex-col rounded-2xl border border-white/10 bg-brand-dark shadow-soft',
          'animate-slide-up',
          sizes[size],
        )}
      >
        <div className="shrink-0 border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-brand-white">{title}</h2>
              {description && <p className="mt-1 text-sm text-brand-gray-500">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-brand-gray-500 transition-colors hover:bg-white/10 hover:text-brand-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
  confirmLabel = 'Sil',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <p className="text-sm text-brand-gray-300">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          İptal
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
