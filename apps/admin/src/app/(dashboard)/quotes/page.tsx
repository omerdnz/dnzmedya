'use client';

import { Badge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface QuoteRow {
  id: string;
  number: string;
  title: string;
  status: string;
  total: number;
  customer?: { name: string };
  validUntil?: string;
}

const statusOptions = [
  { value: 'DRAFT', label: 'Taslak' },
  { value: 'SENT', label: 'Gönderildi' },
  { value: 'APPROVED', label: 'Onaylandı' },
  { value: 'REJECTED', label: 'Reddedildi' },
  { value: 'EXPIRED', label: 'Süresi Doldu' },
];

export default function QuotesPage() {
  return (
    <CrudResourcePage<QuoteRow>
      title="Teklifler"
      description="Müşteri tekliflerini oluşturun ve yönetin"
      endpoint="/quotes"
      queryKey="quotes"
      createLabel="Yeni Teklif"
      getDefaultValues={() => ({
        title: '', description: '', status: 'DRAFT', customerId: '', subtotal: 0, taxRate: 20,
      })}
      columns={[
        { key: 'number', header: 'No' },
        { key: 'title', header: 'Başlık' },
        { key: 'customer', header: 'Müşteri', render: (r) => r.customer?.name ?? '—' },
        {
          key: 'status', header: 'Durum',
          render: (r) => <Badge variant={r.status === 'APPROVED' ? 'success' : r.status === 'SENT' ? 'info' : 'default'}>{r.status}</Badge>,
        },
        { key: 'total', header: 'Toplam', render: (r) => `₺${Number(r.total).toLocaleString('tr-TR')}` },
      ]}
      fields={[
        { name: 'title', label: 'Teklif Başlığı', type: 'text', required: true, colSpan: 2 },
        { name: 'customerId', label: 'Müşteri ID', type: 'text', required: true, placeholder: 'Müşteri listesinden ID kopyalayın' },
        { name: 'status', label: 'Durum', type: 'select', options: statusOptions },
        { name: 'description', label: 'Açıklama', type: 'textarea', colSpan: 2 },
        { name: 'subtotal', label: 'Ara Toplam (₺)', type: 'number' },
        { name: 'taxRate', label: 'KDV (%)', type: 'number' },
      ]}
    />
  );
}
