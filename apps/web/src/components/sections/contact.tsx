'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '@dnzmedya/ui';
import { getApiUrl } from '@/lib/api';

const contactItems = [
  { icon: '📞', label: '0 533 616 94 84', href: 'tel:+905336169484' },
  { icon: '✉️', label: 'omerdeniz07@gmail.com', href: 'mailto:omerdeniz07@gmail.com' },
  { icon: '📍', label: 'Muratpaşa, Antalya, TR' },
];

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${getApiUrl()}/api/v1/forms/slug/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="iletisim" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,206,209,0.06)_0%,transparent_60%)]" />

      <div className="container relative mx-auto px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              İletişim
            </span>
            <h2 className="mt-5 font-heading text-4xl font-bold md:text-5xl">Bizimle İletişime Geçin</h2>
            <p className="mt-6 leading-relaxed text-brand-gray-400">
              Projeniz hakkında konuşmak veya ücretsiz danışmanlık almak için formu doldurun. En kısa sürede size dönüş yapacağız.
            </p>
            <div className="mt-8 space-y-4">
              {contactItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-brand-gold/20 hover:bg-brand-gold/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-lg">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} className="text-brand-gray-300 transition-colors hover:text-brand-gold">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-brand-gray-300">{item.label}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-white/10 bg-brand-elevated/50 p-8 shadow-3d backdrop-blur-xl"
          >
            <Input label="Ad Soyad" name="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="E-posta" name="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Telefon" name="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Konu" name="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-brand-gray-300">Mesaj</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-2xl border border-brand-gray-700 bg-brand-dark px-4 py-3 text-brand-white placeholder:text-brand-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>
            <Button type="submit" isLoading={status === 'loading'} className="w-full shadow-glow">
              Gönder
            </Button>
            {status === 'success' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-emerald-400">
                Mesajınız başarıyla gönderildi!
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-red-400">
                Bir hata oluştu. Lütfen tekrar deneyin.
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
