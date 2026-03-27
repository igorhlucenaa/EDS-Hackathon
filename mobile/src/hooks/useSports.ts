import { useApi } from './useApi';

/**
 * Dados de esporte/categoria
 */
export interface Sport {
  id: number;
  name: string;
  slug: string;
  icon: string;
  eventCount: number;
  liveCount: number;
  categories?: any[];
  seasons?: any[];
  fixtures?: any[];
}

/**
 * Hook para buscar esportes/competições
 */
export function useSports(device: string = 'd', language: string = 'pt', trader: string = '1') {
  const endpoint = `/today-sport-types/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi<Sport[]>(endpoint);

  return {
    sports: data || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar menu lateral (estrutura completa)
 */
export interface League {
  id: string;
  name: string;
  slug: string;
  country: string;
  seasons?: any[];
}

export interface SportMenu extends Sport {
  categories: Array<{
    id: string;
    name: string;
    leagues: League[];
  }>;
}

export function useSportMenu(device: string = 'd', language: string = 'pt', trader: string = '1') {
  const endpoint = `/left-menu/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi<{ sports: SportMenu[] }>(endpoint);

  return {
    sports: data?.sports || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar apostas ante-post
 */
export function useAntePostSummary(device: string = 'd', language: string = 'pt', trader: string = '1') {
  const endpoint = `/antepost-summary/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi(endpoint);

  return {
    antePostData: data,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar ligas específicas
 */
export function useLeagues() {
  const { data, loading, error, refetch } = useApi<League[]>('/leagues', false);

  return {
    leagues: data || [],
    loading,
    error,
    refetch,
  };
}
