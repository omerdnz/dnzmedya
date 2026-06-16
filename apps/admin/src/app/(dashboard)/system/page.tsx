'use client';

import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { usePaginatedList } from '@/hooks/use-paginated-list';

interface AuditRow {
  id: string;
  action: string;
  module: string;
  entityId?: string;
  ip?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
}

export default function SystemPage() {
  const { data, isLoading, error, page, setPage, totalPages } = usePaginatedList<AuditRow>(
    '/audit',
    'audit',
  );

  return (
    <div>
      <PageHeader
        title="Sistem"
        description="Denetim günlükleri ve sistem aktiviteleri"
      />

      <DataTable<AuditRow>
        columns={[
          {
            key: 'user',
            header: 'Kullanıcı',
            render: (row) =>
              row.user
                ? `${row.user.firstName} ${row.user.lastName}`
                : 'Sistem',
          },
          { key: 'action', header: 'İşlem' },
          { key: 'module', header: 'Modül' },
          { key: 'entityId', header: 'Kayıt ID' },
          { key: 'ip', header: 'IP' },
          {
            key: 'createdAt',
            header: 'Tarih',
            render: (row) => new Date(row.createdAt).toLocaleString('tr-TR'),
          },
        ]}
        data={data}
        loading={isLoading}
        error={error ? 'Denetim günlükleri yüklenemedi' : null}
        getRowKey={(row) => row.id}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
