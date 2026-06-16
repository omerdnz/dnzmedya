'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, accessToken, router, pathname]);

  if (!isAuthenticated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
          <p className="text-sm text-brand-gray-500">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
