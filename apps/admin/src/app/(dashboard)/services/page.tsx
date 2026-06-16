'use client';

import { PublishBadge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  features?: unknown;
  content?: unknown;
  isFeatured: boolean;
  isPublished: boolean;
  price?: number;
  sortOrder: number;
}

const accentOptions = [
  { value: 'cyan', label: 'Cyan' },
  { value: 'gold', label: 'Gold' },
  { value: 'violet', label: 'Violet' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'rose', label: 'Rose' },
  { value: 'amber', label: 'Amber' },
  { value: 'sky', label: 'Sky' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'fuchsia', label: 'Fuchsia' },
  { value: 'teal', label: 'Teal' },
];

function parseHighlights(features: unknown): string {
  if (!Array.isArray(features)) return '';
  return features.filter((item): item is string => typeof item === 'string').join('\n');
}

function parseAccent(content: unknown): string {
  if (!content || typeof content !== 'object') return 'cyan';
  const accent = (content as { accent?: string }).accent;
  return accent ?? 'cyan';
}

export default function ServicesPage() {
  return (
    <CrudResourcePage<ServiceRow>
      title="Hizmetler"
      description="Ana sayfa ve /hizmetler sayfasında görünen tüm hizmet kartlarını yönetin"
      endpoint="/services"
      queryKey="services"
      createLabel="Yeni Hizmet"
      getDefaultValues={() => ({
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        highlights: '',
        accent: 'cyan',
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
      })}
      mapRowToForm={(row) => ({
        title: row.title,
        slug: row.slug,
        subtitle: row.subtitle ?? '',
        description: row.description ?? '',
        highlights: parseHighlights(row.features),
        accent: parseAccent(row.content),
        isFeatured: row.isFeatured,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
        price: row.price ?? '',
      })}
      mapFormToPayload={(values) => {
        const highlightsText = String(values.highlights ?? '');
        const highlights = highlightsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        return {
          title: values.title,
          slug: values.slug,
          subtitle: values.subtitle || undefined,
          description: values.description || undefined,
          features: highlights,
          content: { accent: values.accent || 'cyan' },
          isFeatured: Boolean(values.isFeatured),
          isPublished: Boolean(values.isPublished),
          sortOrder: Number(values.sortOrder) || 0,
          ...(values.price !== '' && values.price != null ? { price: Number(values.price) } : {}),
        };
      }}
      columns={[
        { key: 'title', header: 'Başlık' },
        { key: 'slug', header: 'Slug' },
        { key: 'isPublished', header: 'Durum', render: (r) => <PublishBadge published={r.isPublished} /> },
        { key: 'isFeatured', header: 'Öne Çıkan', render: (r) => (r.isFeatured ? '⭐' : '—') },
        { key: 'sortOrder', header: 'Sıra' },
      ]}
      fields={[
        { name: 'title', label: 'Başlık', type: 'text', required: true, colSpan: 2 },
        { name: 'slug', label: 'Slug (ikon anahtarı)', type: 'text', required: true, placeholder: 'web, uiux, seo...' },
        { name: 'sortOrder', label: 'Sıra', type: 'number' },
        { name: 'accent', label: 'Renk Teması', type: 'select', options: accentOptions },
        { name: 'subtitle', label: 'Tagline / Alt Başlık', type: 'text', colSpan: 2 },
        { name: 'description', label: 'Açıklama', type: 'textarea', colSpan: 2 },
        {
          name: 'highlights',
          label: 'Öne Çıkan Maddeler',
          type: 'textarea',
          colSpan: 2,
          placeholder: 'Her satıra bir madde yazın',
        },
        { name: 'price', label: 'Fiyat (₺)', type: 'number' },
        { name: 'isFeatured', label: 'Öne Çıkan', type: 'checkbox', placeholder: 'Ana sayfada öne çıkar' },
        { name: 'isPublished', label: 'Yayında', type: 'checkbox', placeholder: 'Sitede yayınla' },
      ]}
    />
  );
}
