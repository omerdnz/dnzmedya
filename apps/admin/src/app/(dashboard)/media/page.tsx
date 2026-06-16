'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { usePaginatedList } from '@/hooks/use-paginated-list';
import { apiFetch, apiUpload, getApiUrl } from '@/lib/api';

interface MediaRow {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
  alt?: string;
  folder?: string;
  createdAt: string;
}

export default function MediaPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, page, setPage, totalPages } = usePaginatedList<MediaRow>(
    '/media',
    'media',
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/media/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setDeleteId(null);
      toast('Dosya silindi');
    },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'uploads');
      await apiUpload('/media/upload', formData);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast('Dosya yüklendi');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Yükleme hatası', 'error');
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div>
      <PageHeader
        title="Medya Merkezi"
        description="Görseller, videolar ve dosyaları yönetin"
        actions={
          <>
            <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,.pdf,.svg" onChange={handleUpload} />
            <Button size="sm" onClick={() => fileRef.current?.click()}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Dosya Yükle
            </Button>
          </>
        }
      />

      <DataTable<MediaRow>
        columns={[
          {
            key: 'preview',
            header: 'Önizleme',
            render: (row) =>
              row.mimeType.startsWith('image/') ? (
                <Image src={`${getApiUrl()}${row.url}`} alt={row.alt ?? row.originalName} width={56} height={56} className="rounded-xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-xs text-brand-gray-500">{row.mimeType.split('/')[1]}</div>
              ),
          },
          { key: 'originalName', header: 'Dosya Adı' },
          { key: 'folder', header: 'Klasör' },
          { key: 'mimeType', header: 'Tür' },
          { key: 'createdAt', header: 'Yükleme', render: (row) => new Date(row.createdAt).toLocaleDateString('tr-TR') },
          {
            key: '_actions',
            header: 'İşlemler',
            className: 'text-right',
            render: (row) => (
              <button
                type="button"
                onClick={() => setDeleteId(row.id)}
                className="rounded-lg p-2 text-brand-gray-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            ),
          },
        ]}
        data={data}
        loading={isLoading}
        error={error ? 'Medya dosyaları yüklenemedi' : null}
        getRowKey={(row) => row.id}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Dosyayı Sil"
        message="Bu medya dosyasını silmek istediğinize emin misiniz?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
