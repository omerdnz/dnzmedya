const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch<T>(path: string, options?: RequestInit & { cache?: RequestCache }): Promise<T> {
  const { cache, ...fetchOptions } = options ?? {};
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...fetchOptions,
    cache: cache ?? 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export function getApiUrl() {
  return API_URL;
}
