/**
 * Cashout API Client
 * HTTP client for cashout feature endpoints
 */

import { buildApiV2Url } from './config';
import { requestJson, type ApiRequestOptions } from './http';
import type {
  OpenBetsResponse,
  OpenBet,
  CashoutOffer,
  CashoutPreview,
  CashoutExecutionResult,
  CashoutPreviewRequest,
  CashoutExecuteRequest,
} from '@shared';

import type { ApiEnvelope } from './public';

async function cashoutRequest<T>(
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
 * Get all open bets with cashout information
 */
export async function getOpenBets(): Promise<OpenBetsResponse> {
  return cashoutRequest<OpenBetsResponse>('/open-bets');
}

/**
 * Get single open bet details
 */
export async function getOpenBet(betId: string): Promise<OpenBet> {
  return cashoutRequest<OpenBet>(`/open-bets/${betId}`);
}

/**
 * Get cashout offer for a specific bet
 */
export async function getCashoutOffer(betId: string): Promise<CashoutOffer> {
  return cashoutRequest<CashoutOffer>(`/open-bets/${betId}/cashout`);
}

/**
 * Preview cashout (total or partial)
 */
export async function previewCashout(
  request: CashoutPreviewRequest
): Promise<CashoutPreview> {
  return cashoutRequest<CashoutPreview>(
    `/open-bets/${request.betId}/cashout/preview`,
    {
      method: 'POST',
      body: {
        type: request.type,
        percentage: request.percentage,
      },
    }
  );
}

/**
 * Execute cashout (total or partial)
 */
export async function executeCashout(
  request: CashoutExecuteRequest
): Promise<CashoutExecutionResult> {
  return cashoutRequest<CashoutExecutionResult>(
    `/open-bets/${request.betId}/cashout/execute`,
    {
      method: 'POST',
      body: {
        type: request.type,
        percentage: request.percentage,
      },
    }
  );
}
