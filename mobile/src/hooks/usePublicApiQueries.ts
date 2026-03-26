import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/config';
import {
  type ApiV2RequestBody,
  type PublicApiOptions,
  getApplicationParameters,
  getBetTypeGroups,
  getLeftMenu,
  getPopularFixtures,
  getPromotedEvents,
  getTodaySportTypes,
  getTraderDefaults,
  getTraderPages,
  getUpcomingEvents,
  getWebMultilanguages,
  inferTraderContextFromPages,
} from '../api/public';

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

export function useApiBootstrapQueries(options?: PublicApiOptions) {
  const domain = options?.domain ?? apiConfig.domain;
  const languageCode = options?.languageCode ?? apiConfig.languageCode;

  const applicationParametersQuery = useQuery({
    queryKey: ['api', 'application-parameters', domain],
    queryFn: () => getApplicationParameters(options),
    staleTime: FIVE_MINUTES,
  });

  const traderDefaultsQuery = useQuery({
    queryKey: ['api', 'trader-defaults', domain],
    queryFn: () => getTraderDefaults(options),
    staleTime: FIVE_MINUTES,
  });

  const traderPagesQuery = useQuery({
    queryKey: [
      'api',
      'trader-pages',
      domain,
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
    ],
    queryFn: () => getTraderPages(options),
    staleTime: FIVE_MINUTES,
  });

  const multilanguageQuery = useQuery({
    queryKey: ['api', 'multilanguages', domain, languageCode],
    queryFn: () => getWebMultilanguages(options),
    staleTime: FIVE_MINUTES,
  });

  const resolvedTraderContext = useMemo(
    () => inferTraderContextFromPages(traderPagesQuery.data?.data),
    [traderPagesQuery.data]
  );

  return {
    applicationParametersQuery,
    traderDefaultsQuery,
    traderPagesQuery,
    multilanguageQuery,
    resolvedTraderContext,
  };
}

interface ApiV2QueryOptions extends PublicApiOptions {
  enabled?: boolean;
  requestBody?: ApiV2RequestBody;
}

export function useTodaySportTypesQuery(options?: ApiV2QueryOptions) {
  return useQuery({
    queryKey: [
      'api-v2',
      'today-sport-types',
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
      options?.traderId ?? apiConfig.traderId,
      options?.requestBody?.startDate,
      options?.requestBody?.timeRangeInHours,
    ],
    queryFn: () => getTodaySportTypes(options?.requestBody, options),
    staleTime: ONE_MINUTE,
    enabled: options?.enabled ?? true,
  });
}

export function useBetTypeGroupsQuery(options?: ApiV2QueryOptions) {
  return useQuery({
    queryKey: [
      'api-v2',
      'bet-type-groups',
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
      options?.traderId ?? apiConfig.traderId,
      options?.requestBody?.startDate,
      options?.requestBody?.timeRangeInHours,
    ],
    queryFn: () => getBetTypeGroups(options?.requestBody, options),
    staleTime: ONE_MINUTE,
    enabled: options?.enabled ?? true,
  });
}

export function useLeftMenuQuery(options?: ApiV2QueryOptions) {
  return useQuery({
    queryKey: [
      'api-v2',
      'left-menu',
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
      options?.traderId ?? apiConfig.traderId,
      options?.requestBody?.startDate,
      options?.requestBody?.timeRangeInHours,
    ],
    queryFn: () => getLeftMenu(options?.requestBody, options),
    staleTime: ONE_MINUTE,
    enabled: options?.enabled ?? true,
  });
}

export function useUpcomingEventsQuery(options?: ApiV2QueryOptions) {
  return useQuery({
    queryKey: [
      'api-v2',
      'upcoming-events',
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
      options?.traderId ?? apiConfig.traderId,
      options?.requestBody?.startDate,
      options?.requestBody?.timeRangeInHours,
    ],
    queryFn: () => getUpcomingEvents(options?.requestBody, options),
    staleTime: ONE_MINUTE,
    enabled: options?.enabled ?? true,
  });
}

export function usePopularFixturesQuery(options?: ApiV2QueryOptions) {
  return useQuery({
    queryKey: [
      'api-v2',
      'popular-fixture',
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
      options?.traderId ?? apiConfig.traderId,
      options?.requestBody?.startDate,
      options?.requestBody?.timeRangeInHours,
    ],
    queryFn: () => getPopularFixtures(options?.requestBody, options),
    staleTime: ONE_MINUTE,
    enabled: options?.enabled ?? true,
  });
}

export function usePromotedEventsQuery(options?: ApiV2QueryOptions) {
  return useQuery({
    queryKey: [
      'api-v2',
      'promoted-events',
      options?.device ?? apiConfig.device,
      options?.languageId ?? apiConfig.languageId,
      options?.traderId ?? apiConfig.traderId,
      options?.requestBody?.startDate,
      options?.requestBody?.timeRangeInHours,
    ],
    queryFn: () => getPromotedEvents(options?.requestBody, options),
    staleTime: ONE_MINUTE,
    enabled: options?.enabled ?? true,
  });
}
