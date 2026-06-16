import type { PaginationMeta } from '@dnzmedya/types';
import { getAccessToken, getRefreshToken, useAuthStore } from '@/stores/auth';
import { parseApiErrorMessage } from '@/lib/payload';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
  skipRefresh?: boolean;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  const { auth = false, skipRefresh = false, ...fetchOptions } = options ?? {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...fetchOptions,
    headers,
  });

  if (res.status === 401 && auth && !skipRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, {
        ...options,
        skipRefresh: true,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
    useAuthStore.getState().clearAuth();
    throw new ApiError('Oturum süresi doldu', 401);
  }

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(parseApiErrorMessage(body, res.status), res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    throw new ApiError(`Yükleme hatası: ${res.status}`, res.status);
  }

  return res.json() as Promise<T>;
}

export function getApiUrl() {
  return API_URL;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
  };
}
