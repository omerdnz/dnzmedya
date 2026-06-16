export interface SiteSettings {
  site?: {
    title?: string;
    description?: string;
    phone?: string;
    phoneLink?: string;
    email?: string;
    address?: string;
    copyright?: string;
  };
  social?: Record<string, string>;
  theme?: Record<string, unknown>;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${apiUrl}/api/v1/settings/public`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return {};
    return (await res.json()) as SiteSettings;
  } catch {
    return {};
  }
}

export function str(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value == null) return fallback;
  return String(value);
}
