'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '@dnzmedya/ui';
import { getApiUrl } from '@/lib/api';

export default function TeklifAlPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${getApiUrl()}/api/v1/forms/slug/quote-request/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Teklif Al</span>
          </h1>
          <p className="text-brand-gray-400">Projeniz için ücretsiz teklif alın. En kısa sürede size dönüş yapacağız.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-4"
        >
          <Input label="Ad Soyad" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="E-posta" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefon" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Şirket" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-gray-300">Hizmet</label>
            <select
              required
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full rounded-2xl border border-brand-gray-700 bg-brand-dark px-4 py-3 text-brand-white focus:border-brand-gold focus:outline-none"
            >
              <option value="">Seçiniz</option>
              {['Web Tasarım', 'SEO', 'Google Ads', 'E-Ticaret', 'Sosyal Medya', 'Yazılım'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-gray-300">Proje Detayları</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-2xl border border-brand-gray-700 bg-brand-dark px-4 py-3 text-brand-white focus:border-brand-gold focus:outline-none resize-none"
            />
          </div>
          <Button type="submit" isLoading={status === 'loading'} className="w-full" size="lg">
            Teklif Talep Et
          </Button>
          {status === 'success' && <p className="text-green-400 text-center">Talebiniz alındı! En kısa sürede dönüş yapacağız.</p>}
          {status === 'error' && <p className="text-red-400 text-center">Bir hata oluştu. Lütfen tekrar deneyin.</p>}
        </motion.form>
      </div>
    </div>
  );
}
