/**
 * Open Bets Hook
 * Hook for managing open bets data
 */

import { useEffect, useCallback } from 'react';
import { useOpenBetsStore } from '../stores/openBetsStore';
import type { OpenBet } from '@shared';

export function useOpenBets() {
  const {
    bets,
    totalCount,
    totalStaked,
    totalCashoutAvailable,
    isLoading,
    error,
    loadOpenBets,
    clearError,
    refreshCashoutStatuses,
  } = useOpenBetsStore();

  // Load on mount
  useEffect(() => {
    loadOpenBets();
  }, [loadOpenBets]);

  // Get live bets
  const liveBets = bets.filter(bet => bet.status === 'live');
  
  // Get bets with cashout available
  const cashoutAvailableBets = bets.filter(
    bet => bet.cashoutOffer?.status === 'available' || 
           bet.cashoutOffer?.status === 'rising'
  );

  // Refresh cashout statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCashoutStatuses();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [refreshCashoutStatuses]);

  return {
    bets,
    liveBets,
    cashoutAvailableBets,
    totalCount,
    totalStaked,
    totalCashoutAvailable,
    isLoading,
    error,
    refresh: loadOpenBets,
    clearError,
  };
}

/**
 * Hook for single open bet details
 */
export function useOpenBet(betId: string | null) {
  const {
    bets,
    loadBetDetails,
    isLoading,
    error,
  } = useOpenBetsStore();

  const bet = betId ? bets.find(b => b.id === betId) || null : null;

  const refresh = useCallback(async () => {
    if (!betId) return null;
    return loadBetDetails(betId);
  }, [betId, loadBetDetails]);

  return {
    bet,
    isLoading,
    error,
    refresh,
  };
}
