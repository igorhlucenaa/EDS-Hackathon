/**
 * Guided Bets API Client
 * HTTP client for guided bet builder endpoints
 */

import { buildApiV2Url } from './config';
import { requestJson, type ApiRequestOptions } from './http';
import type {
  EventBetRecommendations,
  GuidedBetSuggestion,
  GenerateGuidedBetRequest,
  RecalculateOddsRequest,
  RecalculateOddsResponse,
} from '@shared';

import type { ApiEnvelope } from './public';

async function guidedBetsRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const url = buildApiV2Url(`/api-v2${endpoint}`);
  const response = await requestJson<ApiEnvelope<T>>(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response.data;
}

/**
 * Get ready-made bet suggestions for an event
 */
export async function getEventGuidedBets(eventId: string): Promise<EventBetRecommendations> {
  return guidedBetsRequest<EventBetRecommendations>(`/events/${eventId}/guided-bets`);
}

/**
 * Get available strategies
 */
export async function getGuidedBetStrategies(eventId: string): Promise<Array<{ id: string; riskLevel: string; titlePrefix: string; explanation: string; tags: string[] }>> {
  return guidedBetsRequest(`/events/${eventId}/guided-bets/strategies`);
}

/**
 * Generate a suggestion based on user choices
 */
export async function generateGuidedBet(
  eventId: string,
  choices: Record<string, string>
): Promise<GuidedBetSuggestion> {
  return guidedBetsRequest<GuidedBetSuggestion>(
    `/events/${eventId}/guided-bets/generate`,
    {
      method: 'POST',
      body: { choices },
    }
  );
}

/**
 * Recalculate odds after editing selections
 */
export async function recalculateOdds(
  eventId: string,
  selections: RecalculateOddsRequest['selections']
): Promise<RecalculateOddsResponse> {
  return guidedBetsRequest<RecalculateOddsResponse>(
    `/events/${eventId}/guided-bets/recalculate`,
    {
      method: 'POST',
      body: { selections },
    }
  );
}
