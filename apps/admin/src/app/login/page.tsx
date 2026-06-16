'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, Input, LogoInline } from '@dnzmedya/ui';
import { apiFetch, type LoginResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.replace('/');
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      router.replace(searchParams.get('redirect') || '/');
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('API sunucusuna bağlanılamadı. Port 4000\'de API\'nin çalıştığından emin olun.');
      } else {
        setError(err instanceof Error ? err.message : 'Giriş başarısız');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-white/10 bg-brand-elevated/80 shadow-card backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-posta"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@dnzmedya.com"
            required
            autoComplete="email"
          />
          <Input
            label="Şifre"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Giriş Yap
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 admin-grid-bg opacity-40" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-brand-cyan/10 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl animate-pulse-glow" />

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <LogoInline className="h-16 md:h-[4.5rem] drop-shadow-[0_0_24px_rgba(0,206,209,0.35)]" />
          <p className="mt-4 text-sm text-brand-gray-400">Kurumsal yönetim paneline giriş yapın</p>
          <div className="mt-3 h-px w-24 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        </motion.div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-brand-elevated" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
