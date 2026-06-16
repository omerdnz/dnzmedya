'use client';

import { PublishBadge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface ScriptRow {
  id: string;
  title: string;
  slug: string;
  description?: string;
  demoUrl?: string;
  price?: number;
  isPublished: boolean;
  sortOrder: number;
}

export default function ScriptsPage() {
  return (
    <CrudResourcePage<ScriptRow>
      title="Hazır Scriptler"
      description="Satışa sunulan hazır script ve dijital ürünler"
      endpoint="/scripts"
      queryKey="scripts"
      createLabel="Yeni Script"
      getDefaultValues={() => ({
        title: '', slug: '', description: '', demoUrl: '',
        isPublished: true, sortOrder: 0,
      })}
      columns={[
        { key: 'title', header: 'Başlık' },
        { key: 'slug', header: 'Slug' },
        { key: 'price', header: 'Fiyat', render: (r) => r.price != null ? `₺${Number(r.price).toLocaleString('tr-TR')}` : '—' },
        { key: 'isPublished', header: 'Durum', render: (r) => <PublishBadge published={r.isPublished} /> },
        { key: 'sortOrder', header: 'Sıra' },
      ]}
      fields={[
        { name: 'title', label: 'Başlık', type: 'text', required: true, colSpan: 2 },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'price', label: 'Fiyat (₺)', type: 'number' },
        { name: 'demoUrl', label: 'Demo URL', type: 'text', colSpan: 2 },
        { name: 'description', label: 'Açıklama', type: 'textarea', colSpan: 2 },
        { name: 'sortOrder', label: 'Sıra', type: 'number' },
        { name: 'isPublished', label: 'Yayında', type: 'checkbox', placeholder: 'Sitede yayınla' },
      ]}
    />
  );
}
