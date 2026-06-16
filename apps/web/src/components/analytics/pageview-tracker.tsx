'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    fetch(`${API_URL}/api/v1/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {
      // analytics should not block UX
    });
  }, [pathname]);

  return null;
}
