/**
 * Guided Bet Builder Store
 * Zustand store for managing guided bet flow and recommendations
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  GuidedBetSuggestion,
  GuidedBetFlowChoice,
  GuidedBetSelection,
  EventBetRecommendations,
} from '@shared';
import * as guidedBetsApi from '../api/guided-bets';

interface GuidedBetStore {
  // Data
  recommendations: Record<string, EventBetRecommendations>;
  currentEventId: string | null;
  currentSuggestion: GuidedBetSuggestion | null;
  generatedSuggestion: GuidedBetSuggestion | null;
  
  // Flow state
  flowChoices: Record<string, string>;
  currentStep: number;
  isGenerating: boolean;
  
  // Loading & Error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadEventRecommendations: (eventId: string) => Promise<void>;
  startGuidedFlow: (eventId: string) => void;
  selectFlowChoice: (stepId: string, optionValue: string) => void;
  generateGuidedSuggestion: () => Promise<void>;
  removeSelection: (selectionId: string) => void;
  recalculateOdds: () => Promise<void>;
  resetFlow: () => void;
  setCurrentSuggestion: (suggestion: GuidedBetSuggestion | null) => void;
  clearError: () => void;
}

export const useGuidedBetStore = create<GuidedBetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      recommendations: {},
      currentEventId: null,
      currentSuggestion: null,
      generatedSuggestion: null,
      flowChoices: {},
      currentStep: 0,
      isGenerating: false,
      isLoading: false,
      error: null,

      // Load event recommendations
      loadEventRecommendations: async (eventId: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await guidedBetsApi.getEventGuidedBets(eventId);
          set((state) => ({
            recommendations: {
              ...state.recommendations,
              [eventId]: data,
            },
            isLoading: false,
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load recommendations',
            isLoading: false,
          });
        }
      },

      // Start guided flow
      startGuidedFlow: (eventId: string) => {
        set({
          currentEventId: eventId,
          flowChoices: {},
          currentStep: 0,
          generatedSuggestion: null,
          error: null,
        });
      },

      // Select a choice in the flow
      selectFlowChoice: (stepId: string, optionValue: string) => {
        set((state) => ({
          flowChoices: {
            ...state.flowChoices,
            [stepId]: optionValue,
          },
          currentStep: state.currentStep + 1,
        }));
      },

      // Generate suggestion based on choices
      generateGuidedSuggestion: async () => {
        const { currentEventId, flowChoices } = get();
        if (!currentEventId) return;

        set({ isGenerating: true, error: null });
        try {
          const suggestion = await guidedBetsApi.generateGuidedBet(currentEventId, flowChoices);
          set({
            generatedSuggestion: suggestion,
            isGenerating: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to generate suggestion',
            isGenerating: false,
          });
        }
      },

      // Remove a selection from generated suggestion
      removeSelection: (selectionId: string) => {
        const { generatedSuggestion } = get();
        if (!generatedSuggestion) return;

        const updatedSelections = generatedSuggestion.selections.filter(
          (sel: GuidedBetSelection) => sel.id !== selectionId
        );

        // Recalculate total odds
        const totalOdds = updatedSelections.reduce((acc: number, sel: GuidedBetSelection) => acc * sel.odds, 1);

        set({
          generatedSuggestion: {
            ...generatedSuggestion,
            selections: updatedSelections,
            totalOdds: Math.round(totalOdds * 100) / 100,
          },
        });
      },

      // Recalculate odds after editing
      recalculateOdds: async () => {
        const { generatedSuggestion, currentEventId } = get();
        if (!generatedSuggestion || !currentEventId) return;

        try {
          const result = await guidedBetsApi.recalculateOdds(
            currentEventId,
            generatedSuggestion.selections
          );

          set({
            generatedSuggestion: {
              ...generatedSuggestion,
              totalOdds: result.totalOdds,
              riskLevel: result.riskLevel,
              explanation: result.explanation,
            },
          });
        } catch (err) {
          // Silent fail - odds remain as calculated locally
          console.log('Failed to recalculate odds:', err);
        }
      },

      // Reset flow
      resetFlow: () => {
        set({
          currentEventId: null,
          flowChoices: {},
          currentStep: 0,
          generatedSuggestion: null,
          error: null,
        });
      },

      // Set current suggestion (for viewing details)
      setCurrentSuggestion: (suggestion: GuidedBetSuggestion | null) => {
        set({ currentSuggestion: suggestion });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'guided-bet-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recommendations: state.recommendations,
      }),
    }
  )
);
