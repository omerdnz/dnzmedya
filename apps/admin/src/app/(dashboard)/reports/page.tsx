'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';
import { StatsCard } from '@/components/ui/stats-card';
import { DataTable } from '@/components/ui/data-table';
import { usePaginatedList } from '@/hooks/use-paginated-list';
import { apiFetch } from '@/lib/api';

interface AnalyticsStats {
  totalPageviews: number;
  uniquePages: number;
  topPages: { path: string; count: number }[];
  trafficSources: { source: string; count: number }[];
}

interface EventRow {
  id: string;
  type: string;
  path?: string;
  source?: string;
  country?: string;
  createdAt: string;
}

export default function ReportsPage() {
  const statsQuery = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: () => apiFetch<AnalyticsStats>('/analytics/stats', { auth: true }),
  });

  const {
    data: events,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
  } = usePaginatedList<EventRow>('/analytics/events', 'analytics-events');

  return (
    <div>
      <PageHeader
        title="Raporlar"
        description="Site analitik ve trafik raporları"
      />

      {statsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-28 animate-pulse rounded-2xl bg-brand-dark" />
          <div className="h-28 animate-pulse rounded-2xl bg-brand-dark" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatsCard
            label="Toplam Sayfa Görüntüleme"
            value={statsQuery.data?.totalPageviews ?? 0}
            accent="cyan"
          />
          <StatsCard
            label="Benzersiz Sayfa"
            value={statsQuery.data?.uniquePages ?? 0}
            accent="gold"
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10">
          <h2 className="font-heading text-lg font-semibold">En Çok Ziyaret Edilen</h2>
          <div className="mt-4 space-y-2">
            {statsQuery.data?.topPages?.map((item) => (
              <div key={item.path} className="flex justify-between text-sm">
                <span className="text-brand-gray-300">{item.path}</span>
                <span className="text-brand-gold">{item.count}</span>
              </div>
            )) ?? (
              <p className="text-sm text-brand-gray-500">Veri yok</p>
            )}
          </div>
        </Card>

        <Card className="border-white/10">
          <h2 className="font-heading text-lg font-semibold">Trafik Kaynakları</h2>
          <div className="mt-4 space-y-2">
            {statsQuery.data?.trafficSources?.map((item) => (
              <div key={item.source} className="flex justify-between text-sm">
                <span className="text-brand-gray-300">{item.source}</span>
                <span className="text-brand-cyan">{item.count}</span>
              </div>
            )) ?? (
              <p className="text-sm text-brand-gray-500">Veri yok</p>
            )}
          </div>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 font-heading text-lg font-semibold">Olay Günlüğü</h2>
      <DataTable<EventRow>
        columns={[
          { key: 'type', header: 'Tür' },
          { key: 'path', header: 'Yol' },
          { key: 'source', header: 'Kaynak' },
          { key: 'country', header: 'Ülke' },
          {
            key: 'createdAt',
            header: 'Tarih',
            render: (row) => new Date(row.createdAt).toLocaleString('tr-TR'),
          },
        ]}
        data={events}
        loading={isLoading}
        error={error ? 'Olaylar yüklenemedi' : null}
        getRowKey={(row) => row.id}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
