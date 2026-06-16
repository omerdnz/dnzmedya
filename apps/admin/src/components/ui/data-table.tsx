'use client';

import type { ReactNode } from 'react';
import { Button } from '@dnzmedya/ui';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  getRowKey: (row: T) => string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  error,
  emptyMessage = 'Kayıt bulunamadı.',
  getRowKey,
  page = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-brand-dark p-12 text-center text-brand-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-elevated/40 shadow-card backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-gradient-to-r from-brand-gold/[0.06] via-brand-cyan/[0.03] to-transparent">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-4 font-heading text-xs font-semibold uppercase tracking-wider text-brand-gray-400 ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={getRowKey(row)}
                className={`border-b border-white/[0.04] transition-all duration-300 hover:bg-brand-gold/[0.04] ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 text-brand-gray-300 ${col.className ?? ''}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <span className="text-sm text-brand-gray-500">
            Sayfa {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
