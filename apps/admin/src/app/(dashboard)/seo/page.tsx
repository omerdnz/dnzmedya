'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';
import { FormField, AdminInput, Textarea, CheckboxField } from '@/components/ui/form-fields';
import { useToast } from '@/components/ui/toast';
import { apiFetch, ApiError } from '@/lib/api';

interface PageRow {
  id: string;
  title: string;
  slug: string;
}

interface SeoForm {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

const emptyForm: SeoForm = {
  title: '', description: '', keywords: '', canonical: '',
  robotsIndex: true, robotsFollow: true,
};

export default function SeoPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [form, setForm] = useState<SeoForm>(emptyForm);

  const pagesQuery = useQuery({
    queryKey: ['pages-seo'],
    queryFn: () => apiFetch<{ data: PageRow[] }>('/pages?limit=50', { auth: true }),
  });

  const seoQuery = useQuery({
    queryKey: ['seo', selectedPageId],
    queryFn: async () => {
      try {
        return await apiFetch<Record<string, unknown>>(
          `/seo?entityType=page&entityId=${selectedPageId}`,
          { auth: true },
        );
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
    },
    enabled: !!selectedPageId,
  });

  useEffect(() => {
    if (!selectedPageId) return;
    if (seoQuery.isLoading) return;
    if (!seoQuery.data) {
      setForm(emptyForm);
      return;
    }
    const d = seoQuery.data;
    setForm({
      title: String(d.title ?? ''),
      description: String(d.description ?? ''),
      keywords: Array.isArray(d.keywords) ? d.keywords.join(', ') : String(d.keywords ?? ''),
      canonical: String(d.canonical ?? ''),
      robotsIndex: d.robotsIndex !== false,
      robotsFollow: d.robotsFollow !== false,
    });
  }, [seoQuery.data, seoQuery.isLoading, selectedPageId]);

  const saveMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/seo?entityType=page&entityId=${selectedPageId}`, {
        method: 'PUT',
        auth: true,
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
          canonical: form.canonical,
          robotsIndex: form.robotsIndex,
          robotsFollow: form.robotsFollow,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo', selectedPageId] });
      toast('SEO kaydedildi');
    },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const pages = pagesQuery.data?.data ?? [];

  return (
    <div>
      <PageHeader title="SEO Yönetimi" description="Sayfa meta verilerini düzenleyin" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 lg:col-span-1">
          <h2 className="font-heading font-semibold text-brand-gold">Sayfa Seçin</h2>
          <div className="mt-4 max-h-[480px] space-y-2 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => { setSelectedPageId(page.id); setForm(emptyForm); }}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all ${
                  selectedPageId === page.id
                    ? 'bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/30'
                    : 'bg-white/5 text-brand-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{page.title}</span>
                <span className="mt-0.5 block text-xs opacity-60">/{page.slug}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="border-white/10 lg:col-span-2">
          {!selectedPageId ? (
            <p className="text-sm text-brand-gray-500">Düzenlemek için sol panelden bir sayfa seçin.</p>
          ) : seoQuery.isLoading ? (
            <div className="h-48 animate-pulse rounded-xl bg-white/5" />
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <h2 className="font-heading font-semibold text-brand-white">SEO Düzenle</h2>
              <FormField label="Meta Başlık"><AdminInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
              <FormField label="Meta Açıklama"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
              <FormField label="Anahtar Kelimeler"><AdminInput value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="seo, web tasarım, antalya" /></FormField>
              <FormField label="Canonical URL"><AdminInput value={form.canonical} onChange={(e) => setForm({ ...form, canonical: e.target.value })} /></FormField>
              <div className="flex flex-wrap gap-4">
                <CheckboxField label="Google index" checked={form.robotsIndex} onChange={(v) => setForm({ ...form, robotsIndex: v })} />
                <CheckboxField label="Link follow" checked={form.robotsFollow} onChange={(v) => setForm({ ...form, robotsFollow: v })} />
              </div>
              <Button type="submit" isLoading={saveMutation.isPending}>SEO Kaydet</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
