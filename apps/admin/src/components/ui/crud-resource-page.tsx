'use client';

import { useState, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { FormField, AdminInput, Textarea, Select, CheckboxField } from '@/components/ui/form-fields';
import { useToast } from '@/components/ui/toast';
import { usePaginatedList } from '@/hooks/use-paginated-list';
import { apiFetch } from '@/lib/api';
import { formToPayload, rowToFormValues, type FormFieldDef } from '@/lib/payload';

export interface CrudField extends FormFieldDef {
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  showOnCreate?: boolean;
  showOnEdit?: boolean;
  colSpan?: 1 | 2;
}

export interface CrudColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface CrudResourcePageProps<T extends { id: string }> {
  title: string;
  description?: string;
  endpoint: string;
  queryKey: string;
  columns: CrudColumn<T>[];
  fields: CrudField[];
  createLabel?: string;
  emptyMessage?: string;
  getDefaultValues?: () => Record<string, unknown>;
  mapRowToForm?: (row: T) => Record<string, unknown>;
  mapFormToPayload?: (
    values: Record<string, unknown>,
    isEdit: boolean,
    form?: Record<string, unknown>,
  ) => Record<string, unknown>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function CrudResourcePage<T extends { id: string }>({
  title,
  description,
  endpoint,
  queryKey,
  columns,
  fields,
  createLabel = 'Yeni Ekle',
  emptyMessage,
  getDefaultValues,
  mapRowToForm,
  mapFormToPayload,
}: CrudResourcePageProps<T>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error, page, setPage, totalPages } = usePaginatedList<T>(endpoint, queryKey);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(payload), auth: true }),
    onSuccess: () => { invalidate(); setModalOpen(false); toast('Kayıt oluşturuldu'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      apiFetch<T>(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(payload), auth: true }),
    onSuccess: () => { invalidate(); setModalOpen(false); toast('Kayıt güncellendi'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`${endpoint}/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => { invalidate(); setDeleteOpen(false); setDeleting(null); toast('Kayıt silindi'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  function openCreate() {
    setEditing(null);
    setForm(getDefaultValues?.() ?? {});
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    setForm(
      mapRowToForm?.(row) ?? rowToFormValues(row as Record<string, unknown>, fields),
    );
    setModalOpen(true);
  }

  function openDelete(row: T) {
    setDeleting(row);
    setDeleteOpen(true);
  }

  function setField(name: string, value: unknown) {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'title' && !editing && fields.some((f) => f.name === 'slug') && !prev.slug) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = formToPayload(form, fields);
    const payload = mapFormToPayload?.(base, !!editing, form) ?? base;
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const visibleFields = fields.filter((f) =>
    editing ? f.showOnEdit !== false : f.showOnCreate !== false,
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const actionColumn: CrudColumn<T> = {
    key: '_actions',
    header: 'İşlemler',
    className: 'w-28 text-right',
    render: (row) => (
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={() => openEdit(row)}
          className="rounded-lg p-2 text-brand-gray-400 transition-colors hover:bg-brand-gold/10 hover:text-brand-gold"
          title="Düzenle"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => openDelete(row)}
          className="rounded-lg p-2 text-brand-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Sil"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    ),
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button size="sm" onClick={openCreate}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {createLabel}
          </Button>
        }
      />

      <DataTable<T>
        columns={[...columns, actionColumn]}
        data={data}
        loading={isLoading}
        error={error ? 'Veriler yüklenemedi' : null}
        emptyMessage={emptyMessage}
        getRowKey={(row) => row.id}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `${title} Düzenle` : createLabel}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visibleFields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              className={field.colSpan === 2 ? 'sm:col-span-2' : undefined}
            >
              {field.type === 'textarea' ? (
                <Textarea
                  value={String(form[field.name] ?? '')}
                  onChange={(e) => setField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <Select
                  value={String(form[field.name] ?? '')}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">Seçiniz</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              ) : field.type === 'checkbox' ? (
                <CheckboxField
                  label={field.placeholder ?? field.label}
                  checked={Boolean(form[field.name])}
                  onChange={(v) => setField(field.name, v)}
                />
              ) : (
                <AdminInput
                  type={field.type}
                  value={form[field.name] != null ? String(form[field.name]) : ''}
                  onChange={(e) =>
                    setField(
                      field.name,
                      field.type === 'number' ? Number(e.target.value) : e.target.value,
                    )
                  }
                  placeholder={field.placeholder}
                  required={field.required && !(editing && field.type === 'password')}
                />
              )}
            </FormField>
          ))}
          <div className="flex justify-end gap-3 sm:col-span-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editing ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Kaydı Sil"
        message="Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
