'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card } from '@dnzmedya/ui';
import { PageHeader } from '@/components/ui/page-header';
import { FormField, AdminInput, Textarea, CheckboxField } from '@/components/ui/form-fields';
import { useToast } from '@/components/ui/toast';
import { apiFetch } from '@/lib/api';

interface Hero {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  counterValue?: number;
  counterLabel?: string;
  isActive: boolean;
}

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  description: '',
  ctaText: '',
  ctaUrl: '/iletisim',
  secondaryCtaText: '',
  secondaryCtaUrl: '/teklif-al',
  counterValue: 150,
  counterLabel: 'Tamamlanan Proje',
  isActive: true,
};

function heroToForm(hero: Hero): Record<string, unknown> {
  return {
    id: hero.id,
    title: hero.title ?? '',
    subtitle: hero.subtitle ?? '',
    description: hero.description ?? '',
    ctaText: hero.ctaText ?? '',
    ctaUrl: hero.ctaUrl ?? '',
    secondaryCtaText: hero.secondaryCtaText ?? '',
    secondaryCtaUrl: hero.secondaryCtaUrl ?? '',
    counterValue: hero.counterValue ?? 0,
    counterLabel: hero.counterLabel ?? '',
    isActive: hero.isActive,
  };
}

function formToPayload(form: Record<string, unknown>): Record<string, unknown> {
  const title = String(form.title ?? '').trim();
  if (!title) {
    throw new Error('Ana başlık (ör. "dijital düşün") zorunludur.');
  }

  return {
    title,
    subtitle: String(form.subtitle ?? '').trim() || undefined,
    description: String(form.description ?? '').trim() || undefined,
    ctaText: String(form.ctaText ?? '').trim() || undefined,
    ctaUrl: String(form.ctaUrl ?? '').trim() || undefined,
    secondaryCtaText: String(form.secondaryCtaText ?? '').trim() || undefined,
    secondaryCtaUrl: String(form.secondaryCtaUrl ?? '').trim() || undefined,
    counterValue: Number(form.counterValue) || 0,
    counterLabel: String(form.counterLabel ?? '').trim() || undefined,
    isActive: Boolean(form.isActive),
  };
}

function HeroEditForm({
  form,
  setField,
  onSubmit,
  isSaving,
  isNew,
}: {
  form: Record<string, unknown>;
  setField: (name: string, value: unknown) => void;
  onSubmit: () => void;
  isSaving: boolean;
  isNew?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {/* Ana başlık — sitedeki büyük "dijital düşün" yazısı */}
      <div className="rounded-2xl border border-brand-gold/30 bg-brand-black/60 p-5">
        <FormField label="Ana Başlık (sitedeki büyük yazı) *">
          <AdminInput
            name="hero-title"
            type="text"
            value={String(form.title ?? '')}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="dijital düşün"
            required
            className="!py-4 !text-lg !font-semibold"
          />
        </FormField>
        <p className="mt-2 text-xs text-brand-gray-500">
          Ana sayfada büyük cyan renkte görünen metin. Örnek: <span className="text-brand-cyan">dijital düşün</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Alt Başlık (üst etiket)">
          <AdminInput
            name="hero-subtitle"
            type="text"
            value={String(form.subtitle ?? '')}
            onChange={(e) => setField('subtitle', e.target.value)}
            placeholder="Dijital Ajans"
          />
        </FormField>

        <FormField label="Sayaç">
          <AdminInput
            name="hero-counter"
            type="number"
            value={form.counterValue != null ? String(form.counterValue) : ''}
            onChange={(e) => setField('counterValue', Number(e.target.value))}
          />
        </FormField>

        <FormField label="Açıklama" className="sm:col-span-2">
          <Textarea
            value={String(form.description ?? '')}
            onChange={(e) => setField('description', e.target.value)}
            rows={4}
            placeholder="Hero altında görünen açıklama metni"
          />
        </FormField>

        <FormField label="CTA Metni">
          <AdminInput
            type="text"
            value={String(form.ctaText ?? '')}
            onChange={(e) => setField('ctaText', e.target.value)}
          />
        </FormField>

        <FormField label="CTA URL">
          <AdminInput
            type="text"
            value={String(form.ctaUrl ?? '')}
            onChange={(e) => setField('ctaUrl', e.target.value)}
          />
        </FormField>

        <FormField label="İkincil CTA">
          <AdminInput
            type="text"
            value={String(form.secondaryCtaText ?? '')}
            onChange={(e) => setField('secondaryCtaText', e.target.value)}
          />
        </FormField>

        <FormField label="İkincil CTA URL">
          <AdminInput
            type="text"
            value={String(form.secondaryCtaUrl ?? '')}
            onChange={(e) => setField('secondaryCtaUrl', e.target.value)}
          />
        </FormField>

        <FormField label="Sayaç Etiketi" className="sm:col-span-2">
          <AdminInput
            type="text"
            value={String(form.counterLabel ?? '')}
            onChange={(e) => setField('counterLabel', e.target.value)}
          />
        </FormField>

        <div className="sm:col-span-2">
          <CheckboxField
            label="Aktif hero olarak göster (sitede görünmesi için işaretli olmalı)"
            checked={Boolean(form.isActive)}
            onChange={(v) => setField('isActive', v)}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-white/10 pt-4">
        <Button type="submit" isLoading={isSaving}>
          {isNew ? 'Hero Oluştur' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </form>
  );
}

export default function HeroPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, unknown>>({ ...EMPTY_FORM });

  const { data: heroes, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: () => apiFetch<Hero[]>('/hero', { auth: true }),
  });

  const activeHero = heroes?.[0];

  useEffect(() => {
    if (activeHero) {
      setForm(heroToForm(activeHero));
    } else if (heroes && heroes.length === 0) {
      setForm({ ...EMPTY_FORM });
    }
  }, [activeHero?.id, heroes?.length]);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => {
      const editing = form.id as string | undefined;
      if (editing) {
        return apiFetch(`/hero/${editing}`, { method: 'PUT', body: JSON.stringify(payload), auth: true });
      }
      return apiFetch('/hero', { method: 'POST', body: JSON.stringify(payload), auth: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
      toast('Hero güncellendi');
    },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  function setField(name: string, value: unknown) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    try {
      saveMutation.mutate(formToPayload(form));
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Kayıt hatası', 'error');
    }
  }

  return (
    <div>
      <PageHeader
        title="Hero Bölümü"
        description='Ana sayfadaki "dijital düşün" başlığı ve hero alanını buradan düzenleyin'
      />

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-brand-dark" />
      ) : (
        <div className="space-y-6">
          {activeHero && (
            <Card className="border-white/10 bg-brand-elevated/40">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-gray-500">
                Sitede şu an görünen
              </p>
              <p className="text-xs font-medium uppercase tracking-wider text-brand-gold">
                {activeHero.subtitle || '—'}
              </p>
              <h3 className="font-heading text-3xl font-bold text-gradient-cyan md:text-4xl">
                {activeHero.title}
              </h3>
              <p className="mt-3 text-sm text-brand-gray-400">{activeHero.description}</p>
            </Card>
          )}

          <Card className="border-white/10">
            <h2 className="mb-6 font-heading text-lg font-semibold text-brand-white">
              {activeHero ? 'Hero Düzenle' : 'Yeni Hero Oluştur'}
            </h2>
            <HeroEditForm
              form={form}
              setField={setField}
              onSubmit={handleSave}
              isSaving={saveMutation.isPending}
              isNew={!activeHero}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
