'use client';

import { PublishBadge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface PageRow {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  isPublished: boolean;
  sortOrder: number;
}

export default function PagesPage() {
  return (
    <CrudResourcePage<PageRow>
      title="Sayfalar"
      description="Dinamik site sayfalarını yönetin"
      endpoint="/pages"
      queryKey="pages"
      createLabel="Yeni Sayfa"
      getDefaultValues={() => ({
        title: '', slug: '', subtitle: '', isPublished: false, sortOrder: 0, template: 'default',
      })}
      mapFormToPayload={(values) => ({
        ...values,
        content: values.content ?? {},
      })}
      columns={[
        { key: 'title', header: 'Başlık' },
        { key: 'slug', header: 'Slug' },
        { key: 'isPublished', header: 'Durum', render: (r) => <PublishBadge published={r.isPublished} /> },
        { key: 'sortOrder', header: 'Sıra' },
      ]}
      fields={[
        { name: 'title', label: 'Başlık', type: 'text', required: true, colSpan: 2 },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'sortOrder', label: 'Sıra', type: 'number' },
        { name: 'subtitle', label: 'Alt Başlık', type: 'text', colSpan: 2 },
        { name: 'isPublished', label: 'Yayında', type: 'checkbox', placeholder: 'Sayfayı yayınla' },
      ]}
    />
  );
}
