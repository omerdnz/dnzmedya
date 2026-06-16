'use client';

import { PublishBadge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isPublished: boolean;
  sortOrder: number;
}

export default function FaqsPage() {
  return (
    <CrudResourcePage<FaqRow>
      title="SSS"
      description="Ana sayfadaki SSS bölümünü yönetin — ekleme, düzenleme ve yayınlama"
      endpoint="/faqs"
      queryKey="faqs"
      createLabel="Yeni Soru"
      getDefaultValues={() => ({
        question: '', answer: '', category: '', isPublished: true, sortOrder: 0,
      })}
      columns={[
        { key: 'question', header: 'Soru' },
        { key: 'category', header: 'Kategori' },
        { key: 'isPublished', header: 'Durum', render: (r) => <PublishBadge published={r.isPublished} /> },
        { key: 'sortOrder', header: 'Sıra' },
      ]}
      fields={[
        { name: 'question', label: 'Soru', type: 'text', required: true, colSpan: 2 },
        { name: 'category', label: 'Kategori', type: 'text' },
        { name: 'sortOrder', label: 'Sıra', type: 'number' },
        { name: 'answer', label: 'Cevap', type: 'textarea', required: true, colSpan: 2 },
        { name: 'isPublished', label: 'Yayında', type: 'checkbox', placeholder: 'Sitede göster' },
      ]}
    />
  );
}
