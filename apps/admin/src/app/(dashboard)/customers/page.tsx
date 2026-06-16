'use client';

import { Badge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';

interface CustomerRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  notes?: string;
}

const statusOptions = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'PROSPECT', label: 'Potansiyel' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'INACTIVE', label: 'Pasif' },
  { value: 'LOST', label: 'Kayıp' },
];

const statusVariant: Record<string, 'info' | 'gold' | 'success' | 'default' | 'danger'> = {
  LEAD: 'info', PROSPECT: 'gold', ACTIVE: 'success', INACTIVE: 'default', LOST: 'danger',
};

export default function CustomersPage() {
  return (
    <CrudResourcePage<CustomerRow>
      title="Müşteriler"
      description="CRM müşteri kayıtları ve iletişim bilgileri"
      endpoint="/customers"
      queryKey="customers"
      createLabel="Yeni Müşteri"
      getDefaultValues={() => ({ name: '', email: '', phone: '', company: '', status: 'LEAD', notes: '' })}
      columns={[
        { key: 'name', header: 'Ad' },
        { key: 'email', header: 'E-posta' },
        { key: 'phone', header: 'Telefon' },
        { key: 'company', header: 'Şirket' },
        {
          key: 'status', header: 'Durum',
          render: (r) => <Badge variant={statusVariant[r.status] ?? 'default'}>{r.status}</Badge>,
        },
      ]}
      fields={[
        { name: 'name', label: 'Ad Soyad', type: 'text', required: true, colSpan: 2 },
        { name: 'email', label: 'E-posta', type: 'email' },
        { name: 'phone', label: 'Telefon', type: 'text' },
        { name: 'company', label: 'Şirket', type: 'text', colSpan: 2 },
        { name: 'status', label: 'Durum', type: 'select', options: statusOptions },
        { name: 'notes', label: 'Notlar', type: 'textarea', colSpan: 2 },
      ]}
    />
  );
}
