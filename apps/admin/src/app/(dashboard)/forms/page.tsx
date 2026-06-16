'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { usePaginatedList } from '@/hooks/use-paginated-list';
import { apiFetch } from '@/lib/api';
import { useState } from 'react';

interface FormRow {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface SubmissionRow {
  id: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  form?: { name: string };
}

export default function FormsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: submissions, isLoading, error, page, setPage, totalPages,
  } = usePaginatedList<SubmissionRow>('/forms/submissions', 'form-submissions');

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/forms/submissions/${id}/read`, { method: 'PUT', auth: true }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['form-submissions'] }); toast('Okundu olarak işaretlendi'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/forms/submissions/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['form-submissions'] }); setDeleteId(null); toast('Gönderim silindi'); },
  });

  return (
    <div>
      <CrudResourcePage<FormRow>
        title="Form Tanımları"
        description="İletişim ve teklif formlarını yönetin"
        endpoint="/forms"
        queryKey="forms"
        createLabel="Yeni Form"
        getDefaultValues={() => ({ name: '', slug: '', description: '', isActive: true, fields: [] })}
        mapFormToPayload={(values) => ({
          ...values,
          fields: values.fields ?? [
            { name: 'name', label: 'Ad', type: 'text', required: true },
            { name: 'email', label: 'E-posta', type: 'email', required: true },
            { name: 'message', label: 'Mesaj', type: 'textarea', required: true },
          ],
        })}
        columns={[
          { key: 'name', header: 'Form' },
          { key: 'slug', header: 'Slug' },
          { key: 'isActive', header: 'Durum', render: (r) => <Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? 'Aktif' : 'Pasif'}</Badge> },
        ]}
        fields={[
          { name: 'name', label: 'Form Adı', type: 'text', required: true, colSpan: 2 },
          { name: 'slug', label: 'Slug', type: 'text', required: true },
          { name: 'isActive', label: 'Aktif', type: 'checkbox', placeholder: 'Form aktif' },
          { name: 'description', label: 'Açıklama', type: 'textarea', colSpan: 2 },
        ]}
      />

      <div className="mt-10">
        <PageHeader title="Form Gönderimleri" description="Gelen form mesajları" />
        <DataTable<SubmissionRow>
          columns={[
            { key: 'form', header: 'Form', render: (r) => r.form?.name ?? '—' },
            {
              key: 'data', header: 'İçerik',
              render: (r) => <span className="max-w-xs truncate">{Object.values(r.data).slice(0, 2).join(' · ')}</span>,
            },
            {
              key: 'isRead', header: 'Durum',
              render: (r) => <Badge variant={r.isRead ? 'default' : 'gold'}>{r.isRead ? 'Okundu' : 'Yeni'}</Badge>,
            },
            { key: 'createdAt', header: 'Tarih', render: (r) => new Date(r.createdAt).toLocaleString('tr-TR') },
            {
              key: '_actions', header: 'İşlemler', className: 'text-right',
              render: (r) => (
                <div className="flex justify-end gap-1">
                  {!r.isRead && (
                    <button type="button" onClick={() => markReadMutation.mutate(r.id)} className="rounded-lg px-3 py-1.5 text-xs text-brand-cyan hover:bg-brand-cyan/10">Okundu</button>
                  )}
                  <button type="button" onClick={() => setDeleteId(r.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ),
            },
          ]}
          data={submissions}
          loading={isLoading}
          error={error ? 'Gönderimler yüklenemedi' : null}
          getRowKey={(r) => r.id}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Gönderimi Sil"
        message="Bu form gönderimini silmek istediğinize emin misiniz?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
