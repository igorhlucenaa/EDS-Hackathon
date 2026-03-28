/**
 * Open Bets & Cashout Store
 * Zustand store for managing open bets and cashout operations
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  OpenBet,
  CashoutOffer,
  CashoutPreview,
  CashoutExecutionResult,
  CashoutType,
  OpenBetsResponse,
} from '@shared';
import * as cashoutApi from '../api/cashout';

// Store State Interface
interface OpenBetsState {
  // Data
  bets: OpenBet[];
  totalCount: number;
  totalStaked: number;
  totalCashoutAvailable: number;
  
  // Loading & Error states
  isLoading: boolean;
  isLoadingOffer: boolean;
  isExecuting: boolean;
  error: string | null;
  
  // Selected bet for cashout
  selectedBetId: string | null;
  currentOffer: CashoutOffer | null;
  lastExecutionResult: CashoutExecutionResult | null;
  
  // Actions
  loadOpenBets: () => Promise<void>;
  loadBetDetails: (betId: string) => Promise<OpenBet | null>;
  addBet: (bet: OpenBet) => void;
  loadCashoutOffer: (betId: string) => Promise<CashoutOffer | null>;
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
  selectBetForCashout: (betId: string | null) => void;
  clearError: () => void;
  clearExecutionResult: () => void;
  refreshCashoutStatuses: () => Promise<void>;
  updateBetAfterCashout: (betId: string, result: CashoutExecutionResult) => void;
}

// Mock initial bets
const MOCK_BETS: OpenBet[] = [
  {
    id: 'bet-mock-1',
    status: 'open',
    betType: 'single',
    selections: [
      {
        id: 'sel-1',
        outcomeName: 'Flamengo vence',
        marketName: 'Match Result',
        eventName: 'Flamengo vs Palmeiras',
        odds: 2.1,
        eventId: 'evt-1',
      },
    ],
    stake: 50,
    potentialReturn: 105,
    placedAt: new Date(Date.now() - 3600000).toISOString(),
    cashoutOffer: {
      betId: 'bet-mock-1',
      status: 'available',
      availableAmount: 42.5,
      originalStake: 50,
      potentialReturn: 105,
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'bet-mock-2',
    status: 'cashout_available',
    betType: 'accumulator',
    selections: [
      { id: 'sel-2', outcomeName: 'Casa vence', marketName: 'Match Result', eventName: 'Arsenal vs Chelsea', odds: 1.8, eventId: 'evt-2' },
      { id: 'sel-3', outcomeName: 'Over 2.5', marketName: 'Total Goals', eventName: 'Real vs Barça', odds: 1.9, eventId: 'evt-3' },
      { id: 'sel-4', outcomeName: 'Sim', marketName: 'Ambas Marcam', eventName: 'Liverpool vs City', odds: 1.7, eventId: 'evt-4' },
    ],
    stake: 30,
    potentialReturn: 174.6,
    placedAt: new Date(Date.now() - 7200000).toISOString(),
    cashoutOffer: {
      betId: 'bet-mock-2',
      status: 'available',
      availableAmount: 45.3,
      originalStake: 30,
      potentialReturn: 174.6,
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'bet-mock-3',
    status: 'live',
    betType: 'single',
    selections: [
      {
        id: 'sel-5',
        outcomeName: 'Casa/Empate',
        marketName: 'Double Chance',
        eventName: 'Corinthians vs São Paulo',
        odds: 1.35,
        eventId: 'evt-5',
        score: { home: 1, away: 0 },
        minute: 67,
      },
    ],
    stake: 100,
    potentialReturn: 135,
    placedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const useOpenBetsStore = create<OpenBetsState>()(
  persist(
    (set, get) => ({
      // Initial state with mock bets
      bets: MOCK_BETS,
      totalCount: MOCK_BETS.length,
      totalStaked: MOCK_BETS.reduce((acc, b) => acc + (b.stake || 0), 0),
      totalCashoutAvailable: MOCK_BETS.reduce((acc, b) => acc + (b.cashoutOffer?.availableAmount || 0), 0),
      isLoading: false,
      isLoadingOffer: false,
      isExecuting: false,
      error: null,
      selectedBetId: null,
      currentOffer: null,
      lastExecutionResult: null,

      // Load all open bets
      loadOpenBets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cashoutApi.getOpenBets();
          set({
            bets: response.bets,
            totalCount: response.totalCount,
            totalStaked: response.totalStaked,
            totalCashoutAvailable: response.totalCashoutAvailable,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load open bets',
            isLoading: false,
          });
        }
      },

      // Load single bet details
      loadBetDetails: async (betId: string) => {
        try {
          const bet = await cashoutApi.getOpenBet(betId);
          // Update the bet in the list if it exists
          const currentBets = get().bets;
          const betIndex = currentBets.findIndex(b => b.id === betId);
          if (betIndex >= 0) {
            const updatedBets = [...currentBets];
            updatedBets[betIndex] = bet;
            set({ bets: updatedBets });
          }
          return bet;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load bet details',
          });
          return null;
        }
      },

      // Add bet to local state
      addBet: (bet: OpenBet) => {
        const currentBets = get().bets;
        const alreadyExists = currentBets.find(b => b.id === bet.id);
        if (!alreadyExists) {
          const updatedBets = [bet, ...currentBets];
          set({
            bets: updatedBets,
            totalCount: updatedBets.length,
            totalStaked: updatedBets.reduce((acc, b) => acc + (b.stake || 0), 0),
          });
        }
      },

      // Load cashout offer for a bet
      loadCashoutOffer: async (betId: string) => {
        set({ isLoadingOffer: true, error: null });
        try {
          const offer = await cashoutApi.getCashoutOffer(betId);
          set({
            currentOffer: offer,
            isLoadingOffer: false,
          });
          return offer;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load cashout offer',
            isLoadingOffer: false,
          });
          return null;
        }
      },

      // Preview cashout
      previewCashout: async (
        betId: string,
        type: CashoutType,
        percentage?: number
      ) => {
        try {
          const preview = await cashoutApi.previewCashout({
            betId,
            type,
            percentage,
          });
          return preview;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to preview cashout',
          });
          return null;
        }
      },

      // Execute cashout
      executeCashout: async (
        betId: string,
        type: CashoutType,
        percentage?: number
      ) => {
        set({ isExecuting: true, error: null });
        try {
          const result = await cashoutApi.executeCashout({
            betId,
            type,
            percentage,
          });
          
          // Update local state after successful cashout
          if (result.success) {
            get().updateBetAfterCashout(betId, result);
          }
          
          set({
            lastExecutionResult: result,
            isExecuting: false,
          });
          return result;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to execute cashout',
            isExecuting: false,
          });
          return null;
        }
      },

      // Select bet for cashout
      selectBetForCashout: (betId: string | null) => {
        set({
          selectedBetId: betId,
          currentOffer: null,
          lastExecutionResult: null,
          error: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear execution result
      clearExecutionResult: () => {
        set({ lastExecutionResult: null });
      },

      // Refresh cashout statuses
      refreshCashoutStatuses: async () => {
        const { bets } = get();
        if (bets.length === 0) return;
        
        try {
          // Refresh all bets to get updated cashout offers
          const response = await cashoutApi.getOpenBets();
          set({
            bets: response.bets,
            totalCashoutAvailable: response.totalCashoutAvailable,
          });
        } catch (err) {
          // Silent fail on refresh
          console.log('Failed to refresh cashout statuses:', err);
        }
      },

      // Update bet after cashout execution
      updateBetAfterCashout: (betId: string, result: CashoutExecutionResult) => {
        const currentBets = get().bets;
        const betIndex = currentBets.findIndex(b => b.id === betId);
        
        if (betIndex >= 0) {
          const updatedBets = [...currentBets];
          const bet = updatedBets[betIndex];
          
          if (result.type === 'full') {
            // Full cashout - mark as cashed out
            updatedBets[betIndex] = {
              ...bet,
              status: 'cashed_out',
              cashedOutAmount: result.amountCredited,
              remainingExposure: 0,
            };
          } else {
            // Partial cashout - update exposure
            updatedBets[betIndex] = {
              ...bet,
              status: 'partial_cashout',
              remainingExposure: result.remainingAmountInPlay,
              cashedOutAmount: (bet.cashedOutAmount || 0) + result.amountCredited,
              partialCashouts: [
                ...(bet.partialCashouts || []),
                {
                  percentage: result.type === 'partial' ? 50 : 100, // Approximate
                  amount: result.amountCredited,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          
          set({ bets: updatedBets });
        }
      },
    }),
    {
      name: 'open-bets-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist necessary data
        bets: state.bets,
        totalCount: state.totalCount,
        totalStaked: state.totalStaked,
        totalCashoutAvailable: state.totalCashoutAvailable,
      }),
    }
  )
);
