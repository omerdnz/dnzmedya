'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch, type PaginatedResponse } from '@/lib/api';

export function usePaginatedList<T>(
  endpoint: string,
  queryKey: string,
) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: [queryKey, page],
    queryFn: async () => {
      const result = await apiFetch<PaginatedResponse<T> | T[]>(
        `${endpoint}?page=${page}&limit=20`,
        { auth: true },
      );
      if (Array.isArray(result)) {
        return { data: result, meta: { total: result.length, page: 1, limit: result.length, totalPages: 1 } };
      }
      return result;
    },
  });

  return {
    ...query,
    page,
    setPage,
    data: query.data?.data ?? [],
    meta: query.data?.meta,
    totalPages: query.data?.meta?.totalPages ?? 1,
  };
}
