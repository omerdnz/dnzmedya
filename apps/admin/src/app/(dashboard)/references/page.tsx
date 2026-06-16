'use client';

import { PublishBadge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface ReferenceRow {
  id: string;
  title: string;
  client: string;
  description?: string;
  url?: string;
  category?: string;
  logoUrl?: string;
  logoSlug?: string;
  isPublished: boolean;
  sortOrder: number;
}

export default function ReferencesPage() {
  return (
    <CrudResourcePage<ReferenceRow>
      title="Referanslar"
      description="Ana sayfadaki referans logosu grid'ini yönetin"
      endpoint="/references"
      queryKey="references"
      createLabel="Yeni Referans"
      getDefaultValues={() => ({
        title: '',
        client: '',
        description: '',
        url: '',
        category: '',
        logoUrl: '',
        logoSlug: '',
        isPublished: true,
        sortOrder: 0,
      })}
      mapRowToForm={(row) => ({
        title: row.title,
        client: row.client,
        description: row.description ?? '',
        url: row.url ?? '',
        category: row.category ?? '',
        logoUrl: row.logoUrl ?? '',
        logoSlug: row.logoSlug ?? '',
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
      })}
      columns={[
        { key: 'title', header: 'Firma / Proje' },
        { key: 'client', header: 'Alt Başlık' },
        { key: 'category', header: 'Kategori' },
        { key: 'isPublished', header: 'Durum', render: (r) => <PublishBadge published={r.isPublished} /> },
        { key: 'sortOrder', header: 'Sıra' },
      ]}
      fields={[
        { name: 'title', label: 'Firma / Proje Adı', type: 'text', required: true, colSpan: 2 },
        { name: 'client', label: 'Alt Başlık', type: 'text', required: true },
        { name: 'category', label: 'Kategori', type: 'text' },
        { name: 'url', label: 'Web Sitesi URL', type: 'text', colSpan: 2 },
        {
          name: 'logoUrl',
          label: 'Logo URL',
          type: 'text',
          colSpan: 2,
          placeholder: 'https://cdn.simpleicons.org/google/4285F4',
        },
        {
          name: 'logoSlug',
          label: 'SimpleIcons Slug',
          type: 'text',
          placeholder: 'google, microsoft, stripe... (logo URL yoksa kullanılır)',
        },
        { name: 'description', label: 'Açıklama', type: 'textarea', colSpan: 2 },
        { name: 'sortOrder', label: 'Sıra', type: 'number' },
        { name: 'isPublished', label: 'Yayında', type: 'checkbox', placeholder: 'Sitede göster' },
      ]}
    />
  );
}
