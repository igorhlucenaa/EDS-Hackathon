/**
 * Guided Bets Hooks
 * Hooks for managing guided bet recommendations and builder flow
 */

import { useEffect, useCallback } from 'react';
import { useGuidedBetStore } from '../stores/guidedBetStore';
import type { GuidedBetSuggestion } from '@shared';

export function useGuidedBetRecommendations(eventId: string | null) {
  const {
    recommendations,
    isLoading,
    error,
    loadEventRecommendations,
    clearError,
  } = useGuidedBetStore();

  const eventData = eventId ? recommendations[eventId] : null;

  useEffect(() => {
    if (eventId && !eventData) {
      loadEventRecommendations(eventId);
    }
  }, [eventId, eventData, loadEventRecommendations]);

  return {
    suggestions: eventData?.suggestions || [],
    guidedQuestions: eventData?.guidedQuestions || [],
    eventName: eventData?.eventName || '',
    isLoading,
    error,
    refresh: () => eventId && loadEventRecommendations(eventId),
    clearError,
  };
}

export function useGuidedBetBuilder(eventId: string | null) {
  const {
    currentEventId,
    flowChoices,
    currentStep,
    generatedSuggestion,
    isGenerating,
    isLoading,
    error,
    startGuidedFlow,
    selectFlowChoice,
    generateGuidedSuggestion,
    removeSelection,
    recalculateOdds,
    resetFlow,
  } = useGuidedBetStore();

  const startFlow = useCallback(() => {
    if (eventId) {
      startGuidedFlow(eventId);
    }
  }, [eventId, startGuidedFlow]);

  const makeChoice = useCallback((stepId: string, optionValue: string) => {
    selectFlowChoice(stepId, optionValue);
  }, [selectFlowChoice]);

  const generateSuggestion = useCallback(async () => {
    await generateGuidedSuggestion();
  }, [generateGuidedSuggestion]);

  const removeSel = useCallback((selectionId: string) => {
    removeSelection(selectionId);
    recalculateOdds();
  }, [removeSelection, recalculateOdds]);

  const reset = useCallback(() => {
    resetFlow();
  }, [resetFlow]);

  return {
    isActive: currentEventId === eventId,
    currentStep,
    flowChoices,
    generatedSuggestion,
    isGenerating,
    isLoading,
    error,
    startFlow,
    makeChoice,
    generateSuggestion,
    removeSelection: removeSel,
    reset,
  };
}

export function useAddGuidedBetToSlip() {
  const addToSlip = useCallback((suggestion: GuidedBetSuggestion) => {
    // Import here to avoid circular dependency
    const { useBetslipStore } = require('../stores/betslipStore');
    const betslipStore = useBetslipStore.getState();

    // Add each selection to betslip
    suggestion.selections.forEach((selection) => {
      const betSelection = {
        id: selection.id,
        eventId: selection.eventId || suggestion.eventId,
        event: {
          id: selection.eventId || suggestion.eventId,
          home: { name: selection.eventName?.split(' vs ')[0] || 'Time Casa', shortName: selection.eventName?.split(' vs ')[0] || 'Casa' },
          away: { name: selection.eventName?.split(' vs ')[1] || 'Time Fora', shortName: selection.eventName?.split(' vs ')[1] || 'Fora' },
          league: { name: 'Liga' },
        },
        marketId: selection.marketType,
        marketName: selection.marketName,
        outcomeId: selection.id,
        outcomeName: selection.outcome,
        odds: selection.odds,
      };
      
      betslipStore.addSelection(betSelection);
    });

    // Set bet type to accumulator if multiple selections
    if (suggestion.selections.length > 1) {
      betslipStore.setBetType('accumulator');
    }

    return {
      success: true,
      addedCount: suggestion.selections.length,
      message: `${suggestion.selections.length} seleção(ões) adicionada(s) ao bet slip`,
    };
  }, []);

  return { addToSlip };
}
