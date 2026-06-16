'use client';

import { useQuery } from '@tanstack/react-query';
import type { DashboardStats } from '@dnzmedya/types';
import { Card } from '@dnzmedya/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { StatsCard } from '@/components/ui/stats-card';
import { apiFetch } from '@/lib/api';

const quickLinks = [
  { href: '/services', label: 'Servisler', desc: 'Hizmet kartları' },
  { href: '/blog', label: 'Blog', desc: 'Yazı yönetimi' },
  { href: '/hero', label: 'Hero', desc: 'Ana sayfa hero' },
  { href: '/customers', label: 'Müşteriler', desc: 'CRM kayıtları' },
  { href: '/forms', label: 'Formlar', desc: 'Gelen mesajlar' },
  { href: '/media', label: 'Medya', desc: 'Dosya yükleme' },
];

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiFetch<DashboardStats>('/dashboard/stats', { auth: true }),
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Son 30 günlük site performans özeti"
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-brand-dark" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
          {error instanceof Error ? error.message : 'Veriler yüklenemedi'}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Ziyaretçiler"
              value={data?.visitors ?? 0}
              hint="Sayfa görüntüleme"
              accent="cyan"
              index={0}
            />
            <StatsCard
              label="Formlar"
              value={data?.forms ?? 0}
              hint="Form gönderimi"
              accent="gold"
              index={1}
            />
            <StatsCard
              label="Teklifler"
              value={data?.quotes ?? 0}
              hint="Oluşturulan teklif"
              index={2}
            />
            <StatsCard
              label="Dönüşüm"
              value={`${data?.conversionRate ?? 0}%`}
              hint="Onaylanan teklif oranı"
              accent="gold"
              index={3}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="border-white/[0.08] bg-brand-elevated/50 shadow-card backdrop-blur-sm lg:col-span-2">
              <h2 className="font-heading text-lg font-semibold text-brand-white">Trafik Kaynakları</h2>
              <div className="mt-4 space-y-3">
                {data?.trafficSources?.length ? (
                  data.trafficSources.map((item) => (
                    <div key={item.source} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2">
                      <span className="text-sm text-brand-gray-300">{item.source}</span>
                      <span className="font-mono text-sm font-semibold text-brand-gold">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-brand-gray-500">Henüz veri yok</p>
                )}
              </div>
            </Card>

            <Card className="border-white/[0.08] bg-brand-elevated/50 shadow-card backdrop-blur-sm">
              <h2 className="font-heading text-lg font-semibold text-brand-white">Hızlı Erişim</h2>
              <div className="mt-4 space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-brand-gold/10 hover:text-brand-gold"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-white">{link.label}</p>
                      <p className="text-xs text-brand-gray-500">{link.desc}</p>
                    </div>
                    <span className="text-brand-gold">→</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
