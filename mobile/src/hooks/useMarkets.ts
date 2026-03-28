import React from 'react';
import { useApi } from './useApi';
import { Market } from './useEvents';

export interface BetTypeGroup {
  id: string;
  name: string;
  icon?: string;
  betTypes: BetType[];
}

export interface BetType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface FixtureMarkets {
  fixtureId: string | number;
  marketsByType: Record<string, Market[]>;
  allMarkets: Market[];
}

export interface OddsRequest {
  fixtureId: number | string;
  marketIds: string[];
}

export interface OddsResponse {
  fixtureId: number | string;
  odds: Record<string, Record<string, number>>;
  timestamp: string;
}

/**
 * Hook para buscar grupos de tipos de aposta
 */
export function useBetTypeGroups(
  device: string = 'd',
  language: string = 'pt',
  trader: string = '1'
) {
  const endpoint = `/bet-type-groups/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi<{
    betTypeGroups: BetTypeGroup[];
  }>(endpoint);

  return {
    betTypeGroups: data?.betTypeGroups || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar mercados de um fixture específico
 */
export function useFixtureMarkets(
  fixtureId: string | number | null,
  device: string = 'd',
  language: string = 'pt',
  trader: string = '1'
) {
  const endpoint = `/markets/${fixtureId}`;
  const { data, loading, error, refetch } = useApi<{
    markets: Market[];
    fixtureId: string | number;
  }>(endpoint, false, !!fixtureId);

  return {
    markets: data?.markets || [],
    fixtureId: data?.fixtureId,
    loading: fixtureId ? loading : false,
    error,
    refetch,
  };
}

/**
 * Hook para buscar odds em tempo real
 */
export function useOdds(
  fixtureId: string | number | null,
  marketIds: string[] = []
) {
  const endpoint = '/get-odds';
  const body = {
    fixtureId,
    marketIds,
  };

  const { data, loading, error, refetch } = useApi<OddsResponse>(
    endpoint,
    false,
    !!fixtureId && marketIds.length > 0
  );

  return {
    odds: data?.odds || {},
    timestamp: data?.timestamp,
    loading: fixtureId && marketIds.length > 0 ? loading : false,
    error,
    refetch,
  };
}

/**
 * Hook para atualizar odds em tempo real com polling
 */
export function useOddsPolling(
  fixtureId: string | number | null,
  marketIds: string[] = [],
  intervalMs: number = 5000
) {
  const [odds, setOdds] = React.useState<Record<string, Record<string, number>>>({});
  const oddsResult = useOdds(fixtureId, marketIds);
  const [lastUpdate, setLastUpdate] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (oddsResult.odds && Object.keys(oddsResult.odds).length > 0) {
      setOdds(oddsResult.odds);
      setLastUpdate(new Date().toISOString());
    }
  }, [oddsResult.odds]);

  React.useEffect(() => {
    if (!fixtureId || marketIds.length === 0) return;

    const interval = setInterval(() => {
      oddsResult.refetch();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [fixtureId, marketIds, intervalMs, oddsResult]);

  return {
    odds,
    lastUpdate,
    loading: oddsResult.loading,
    error: oddsResult.error,
    refetch: oddsResult.refetch,
  };
}
