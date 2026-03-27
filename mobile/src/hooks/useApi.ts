import { useState, useEffect, useCallback } from 'react';
import { apiConfig, buildApiV2Url } from '../api/config';
import { requestJson, ApiRequestError } from '../api/http';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiRequestError | null;
  refetch: () => Promise<void>;
}

/**
 * Hook genérico para fazer requisições à API
 * @param endpoint - Endpoint da API (ex: '/today-sport-types/d/pt/1')
 * @param useV2 - Se deve usar API v2 (padrão: true)
 * @param autoFetch - Se deve fazer fetch automático (padrão: true)
 */
export function useApi<T>(
  endpoint: string,
  useV2: boolean = true,
  autoFetch: boolean = true
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiRequestError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = useV2
        ? buildApiV2Url(endpoint)
        : endpoint.startsWith('http')
          ? endpoint
          : `${apiConfig.apiBasePath}${endpoint}`;

      console.log(`📡 Fetching: ${url}`);

      const response = await requestJson<any>(url);

      if (response && response.data) {
        setData(response.data as T);
      } else if (Array.isArray(response)) {
        setData(response as T);
      } else {
        setData(response);
      }
    } catch (err) {
      const apiError =
        err instanceof ApiRequestError
          ? err
          : new ApiRequestError(
              'Erro ao buscar dados',
              0,
              endpoint,
              err
            );
      setError(apiError);
      console.error(`❌ Erro na API:`, apiError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, useV2]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook para requisições com paginação
 */
export interface UsePaginatedApiState<T> extends UseApiState<T[]> {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
}

export function usePaginatedApi<T>(
  endpoint: string,
  pageSize: number = 10,
  useV2: boolean = true
): UsePaginatedApiState<T> {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiRequestError | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        setError(null);

        const url = useV2
          ? buildApiV2Url(endpoint)
          : endpoint;

        const response = await requestJson<any>(url);

        if (response && response.data && Array.isArray(response.data.items)) {
          setItems(response.data.items);
          setTotal(response.data.total || response.data.items.length);
          setPage(pageNum);
        } else if (Array.isArray(response)) {
          setItems(response);
          setTotal(response.length);
        }
      } catch (err) {
        const apiError =
          err instanceof ApiRequestError
            ? err
            : new ApiRequestError('Erro ao buscar página', 0, endpoint, err);
        setError(apiError);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, useV2]
  );

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  const nextPage = useCallback(async () => {
    if (page * pageSize + pageSize < total) {
      await fetchPage(page + 1);
    }
  }, [page, pageSize, total, fetchPage]);

  const previousPage = useCallback(async () => {
    if (page > 0) {
      await fetchPage(page - 1);
    }
  }, [page, fetchPage]);

  return {
    data: items,
    loading,
    error,
    refetch: () => fetchPage(page),
    page,
    pageSize,
    total,
    hasMore: (page + 1) * pageSize < total,
    nextPage,
    previousPage,
  };
}
