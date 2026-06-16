'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';
import { FormField, AdminInput, Textarea, CheckboxField } from '@/components/ui/form-fields';
import { useToast } from '@/components/ui/toast';
import { apiFetch } from '@/lib/api';

interface SettingGroup {
  [key: string]: unknown;
}

const GROUP_LABELS: Record<string, string> = {
  site: 'Site Bilgileri (footer & iletişim)',
  social: 'Sosyal Medya Linkleri',
  theme: 'Tema',
};

const FIELD_LABELS: Record<string, Record<string, string>> = {
  site: {
    title: 'Site başlığı (SEO)',
    description: 'Footer açıklama metni',
    phone: 'Telefon (görünen)',
    phoneLink: 'Telefon linki (tel:+90...)',
    email: 'E-posta',
    address: 'Adres',
    copyright: 'Telif satırı',
  },
  social: {
    facebook: 'Facebook URL',
    twitter: 'X (Twitter) URL',
    instagram: 'Instagram URL',
    linkedin: 'LinkedIn URL',
    youtube: 'YouTube URL',
  },
};

function fieldLabel(group: string, key: string) {
  return FIELD_LABELS[group]?.[key] ?? key;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [editing, setEditing] = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch<Record<string, SettingGroup>>('/settings', { auth: true }),
  });

  useEffect(() => {
    if (data) setEditing(data);
  }, [data]);

  async function saveGroup(group: string) {
    setSaving(group);
    try {
      await apiFetch(`/settings/${group}`, {
        method: 'PUT',
        body: JSON.stringify(editing[group]),
        auth: true,
      });
      toast(`${GROUP_LABELS[group] ?? group} kaydedildi`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Kayıt hatası', 'error');
    } finally {
      setSaving(null);
    }
  }

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-brand-dark" />;

  return (
    <div>
      <PageHeader
        title="Ayarlar"
        description="Footer, iletişim ve sosyal medya bilgilerini düzenleyin — kaydettikten sonra site otomatik güncellenir"
      />

      <div className="space-y-6">
        {Object.entries(editing).map(([group, values]) => (
          <div key={group} className="rounded-2xl border border-white/10 bg-brand-dark p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-brand-gold">
                {GROUP_LABELS[group] ?? group}
              </h2>
              <Button size="sm" onClick={() => saveGroup(group)} isLoading={saving === group}>
                Kaydet
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(values).map(([key, value]) => (
                <FormField
                  key={key}
                  label={fieldLabel(group, key)}
                  className={String(value).length > 80 ? 'sm:col-span-2' : undefined}
                >
                  {typeof value === 'boolean' ? (
                    <CheckboxField
                      label={fieldLabel(group, key)}
                      checked={Boolean(value)}
                      onChange={(v) => setEditing((prev) => ({
                        ...prev,
                        [group]: { ...prev[group], [key]: v },
                      }))}
                    />
                  ) : String(value).length > 80 ? (
                    <Textarea
                      value={String(value ?? '')}
                      onChange={(e) => setEditing((prev) => ({
                        ...prev,
                        [group]: { ...prev[group], [key]: e.target.value },
                      }))}
                      rows={3}
                    />
                  ) : (
                    <AdminInput
                      value={String(value ?? '')}
                      onChange={(e) => setEditing((prev) => ({
                        ...prev,
                        [group]: { ...prev[group], [key]: e.target.value },
                      }))}
                      placeholder={group === 'social' ? 'https://...' : undefined}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
