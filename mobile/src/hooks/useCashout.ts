/**
 * Cashout Hook
 * Hook for managing cashout operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useOpenBetsStore } from '../stores/openBetsStore';
import type {
  CashoutOffer,
  CashoutPreview,
  CashoutExecutionResult,
  CashoutType,
  CashoutStatus,
} from '@shared';

export interface UseCashoutReturn {
  // State
  offer: CashoutOffer | null;
  preview: CashoutPreview | null;
  result: CashoutExecutionResult | null;
  isLoadingOffer: boolean;
  isExecuting: boolean;
  error: string | null;
  
  // Actions
  loadOffer: (betId: string) => Promise<CashoutOffer | null>;
  previewCashout: (
    betId: string,
    type: CashoutType,
    percentage?: number
  ) => Promise<CashoutPreview | null>;
  executeCashout: (
    betId: string,
    type: CashoutType,
    percentage?: number
  ) => Promise<CashoutExecutionResult | null>;
  clearResult: () => void;
  clearError: () => void;
  canCashout: boolean;
  cashoutStatus: CashoutStatus | null;
}

export function useCashout(betId: string | null): UseCashoutReturn {
  const store = useOpenBetsStore();
  const [localPreview, setLocalPreview] = useState<CashoutPreview | null>(null);

  // Load offer when betId changes
  useEffect(() => {
    if (betId) {
      store.loadCashoutOffer(betId);
    }
  }, [betId]);

  const loadOffer = useCallback(
    async (id: string) => {
      return store.loadCashoutOffer(id);
    },
    [store]
  );

  const previewCashout = useCallback(
    async (id: string, type: CashoutType, percentage?: number) => {
      const preview = await store.previewCashout(id, type, percentage);
      if (preview) {
        setLocalPreview(preview);
      }
      return preview;
    },
    [store]
  );

  const executeCashout = useCallback(
    async (id: string, type: CashoutType, percentage?: number) => {
      const result = await store.executeCashout(id, type, percentage);
      if (result) {
        setLocalPreview(null);
      }
      return result;
    },
    [store]
  );

  const clearResult = useCallback(() => {
    store.clearExecutionResult();
    setLocalPreview(null);
  }, [store]);

  const clearError = useCallback(() => {
    store.clearError();
  }, [store]);

  const offer = store.currentOffer;
  const canCashout = offer?.status !== 'unavailable' && (offer?.availableAmount ?? 0) > 0;
  const cashoutStatus = offer?.status || null;

  return {
    offer,
    preview: localPreview,
    result: store.lastExecutionResult,
    isLoadingOffer: store.isLoadingOffer,
    isExecuting: store.isExecuting,
    error: store.error,
    loadOffer,
    previewCashout,
    executeCashout,
    clearResult,
    clearError,
    canCashout,
    cashoutStatus,
  };
}

/**
 * Hook for cashout status display
 */
export function useCashoutStatus(betId: string | null) {
  const { useOpenBetsStore } = require('../stores/openBetsStore');
  const store = useOpenBetsStore();
  
  const bet = betId ? store.bets.find((b: { id: string }) => b.id === betId) : null;
  const offer = bet?.cashoutOffer;

  const getStatusLabel = (status: CashoutStatus | undefined): string => {
    switch (status) {
      case 'available':
        return 'Disponível agora';
      case 'rising':
        return 'Valor em alta';
      case 'fluctuating':
        return 'Oscilando';
      case 'unavailable':
        return 'Temporariamente indisponível';
      default:
        return 'Indisponível';
    }
  };

  const getStatusColor = (status: CashoutStatus | undefined): string => {
    switch (status) {
      case 'available':
        return '#22c55e';
      case 'rising':
        return '#22c55e';
      case 'fluctuating':
        return '#f59e0b';
      case 'unavailable':
        return '#737373';
      default:
        return '#737373';
    }
  };

  const getStatusIcon = (status: CashoutStatus | undefined): string => {
    switch (status) {
      case 'available':
        return '✓';
      case 'rising':
        return '↑';
      case 'fluctuating':
        return '~';
      case 'unavailable':
        return '−';
      default:
        return '−';
    }
  };

  return {
    offer,
    status: offer?.status || 'unavailable',
    label: getStatusLabel(offer?.status),
    color: getStatusColor(offer?.status),
    icon: getStatusIcon(offer?.status),
    availableAmount: offer?.availableAmount || 0,
    isAvailable: offer?.status !== 'unavailable' && (offer?.availableAmount || 0) > 0,
  };
}
