import { useApi, usePaginatedApi } from './useApi';

/**
 * Dados de time
 */
export interface Team {
  id: number | string;
  name: string;
  shortName: string;
  logo?: string | null;
  crest?: string | null;
}

/**
 * Dados de evento/fixture
 */
export interface Fixture {
  id: number | string;
  fixtureId?: number | string;
  name: string;
  status: 'live' | 'upcoming' | 'finished';
  startTime: string;
  sportId: number;
  leagueId: number | string;
  homeTeam: Team;
  awayTeam: Team;
  score?: {
    home: number;
    away: number;
  } | null;
  markets: Market[];
  viewerCount?: number;
  statistics?: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
  };
  timeline?: any[];
}

export interface Market {
  id: string;
  type: string;
  outcomes: {
    id: string;
    name: string;
    odds: number | string;
  }[];
}

/**
 * Hook para buscar próximos eventos
 */
export function useUpcomingEvents(device: string = 'd', language: string = 'pt', trader: string = '1') {
  const endpoint = `/upcoming-events/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi<{
    fixtures: Fixture[];
    total: number;
    pageSize: number;
    currentPage: number;
  }>(endpoint);

  return {
    events: data?.fixtures || [],
    total: data?.total || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar eventos promovidos/ao vivo
 */
export function usePromotedEvents(device: string = 'd', language: string = 'pt', trader: string = '1') {
  const endpoint = `/promoted-events/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi<{
    promotedFixtures: Fixture[];
  }>(endpoint);

  return {
    promotedEvents: data?.promotedFixtures || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar eventos populares
 */
export function usePopularFixtures(device: string = 'd', language: string = 'pt', trader: string = '1') {
  const endpoint = `/popular-fixture/${device}/${language}/${trader}`;
  const { data, loading, error, refetch } = useApi<{
    popularFixtures: (Fixture & { rank: number; popularity: string })[];
  }>(endpoint);

  return {
    popularFixtures: data?.popularFixtures || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para buscar detalhes completos de um evento
 */
export function useFixtureDetail(
  fixtureId: string | number | null,
  device: string = 'd',
  language: string = 'pt',
  trader: string = '1'
) {
  const endpoint = `/detail-card/${device}/${language}/${trader}?fixtureId=${fixtureId}`;
  const { data, loading, error, refetch } = useApi<{
    fixture: Fixture & {
      allMarkets: Market[];
      timeline: any[];
    };
  }>(endpoint, true, !!fixtureId);

  return {
    fixture: data?.fixture || null,
    loading: fixtureId ? loading : false,
    error,
    refetch,
  };
}

/**
 * Hook para buscar fixtures por busca
 */
export function useFixtureSearch(
  query: string | null,
  device: string = 'd',
  language: string = 'pt',
  trader: string = '1'
) {
  const endpoint = `/fixture-search/${device}/${language}/${trader}?query=${query || ''}`;
  const { data, loading, error, refetch } = useApi<{
    fixtures: Fixture[];
    total: number;
  }>(endpoint, true, !!query);

  return {
    fixtures: data?.fixtures || [],
    total: data?.total || 0,
    loading: query ? loading : false,
    error,
    refetch,
  };
}

/**
 * Hook para buscar dados da liga com fixtures
 */
export interface LeagueData {
  id: string;
  name: string;
  fixtures: Fixture[];
  standings: Array<{
    position: number;
    team: Team;
    playedGames: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
  }>;
}

export function useLeagueCard(
  seasonIds: string | null,
  device: string = 'd',
  language: string = 'pt',
  trader: string = '1'
) {
  const endpoint = `/league-card/${device}/${language}/${trader}/${seasonIds || ''}`;
  const { data, loading, error, refetch } = useApi<{
    league: LeagueData;
  }>(endpoint, true, !!seasonIds);

  return {
    league: data?.league || null,
    loading: seasonIds ? loading : false,
    error,
    refetch,
  };
}
