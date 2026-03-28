import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { GuidedBetRiskBadge } from './GuidedBetRiskBadge';
import { useGuidedBetBuilder, useAddGuidedBetToSlip } from '../../hooks/useGuidedBets';
import type { GuidedBetFlowChoice, GuidedBetSuggestion } from '@shared';

interface GuidedBetBuilderSheetProps {
  eventId: string;
  visible: boolean;
  onClose: () => void;
  onAddedToSlip?: () => void;
  eventName?: string;
}

const { height } = Dimensions.get('window');

export function GuidedBetBuilderSheet({
  eventId,
  visible,
  onClose,
  onAddedToSlip,
  eventName,
}: GuidedBetBuilderSheetProps) {
  const {
    currentStep,
    flowChoices,
    generatedSuggestion,
    isGenerating,
    isLoading,
    error,
    startFlow,
    makeChoice,
    generateSuggestion,
    removeSelection,
    reset,
  } = useGuidedBetBuilder(eventId);

  const { addToSlip } = useAddGuidedBetToSlip();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStart = useCallback(() => {
    startFlow();
  }, [startFlow]);

  const handleChoice = useCallback((stepId: string, optionValue: string) => {
    makeChoice(stepId, optionValue);
  }, [makeChoice]);

  const handleGenerate = useCallback(async () => {
    await generateSuggestion();
  }, [generateSuggestion]);

  const handleAddToSlip = useCallback(() => {
    if (generatedSuggestion) {
      addToSlip(generatedSuggestion);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onAddedToSlip?.();
        onClose();
        reset();
      }, 1500);
    }
  }, [generatedSuggestion, addToSlip, onAddedToSlip, onClose, reset]);

  const handleRemoveSelection = useCallback((selectionId: string) => {
    removeSelection(selectionId);
  }, [removeSelection]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
        
        <Animated.View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {generatedSuggestion ? 'Sua Aposta Montada' : 'Montar Aposta'}
              </Text>
              {eventName && (
                <Text style={styles.subtitle} numberOfLines={1}>{eventName}</Text>
              )}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#22c55e" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.errorButton}>
                <Text style={styles.errorButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          ) : showSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Adicionado ao Betslip!</Text>
              <Text style={styles.successText}>
                {generatedSuggestion?.selections.length} seleção(ões) adicionada(s)
              </Text>
            </View>
          ) : generatedSuggestion ? (
            <GeneratedSuggestionView
              suggestion={generatedSuggestion}
              onRemoveSelection={handleRemoveSelection}
              onAddToSlip={handleAddToSlip}
            />
          ) : currentStep === 0 ? (
            <StartView onStart={handleStart} />
          ) : (
            <GuidedFlowView
              currentStep={currentStep}
              flowChoices={flowChoices}
              onChoice={handleChoice}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// Sub-components
function StartView({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.startContainer}>
      <Text style={styles.startIcon}>🎯</Text>
      <Text style={styles.startTitle}>Montar Aposta com Ajuda</Text>
      <Text style={styles.startDescription}>
        Responda algumas perguntas rápidas e montaremos uma aposta sugerida para você.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

function GuidedFlowView({
  currentStep,
  flowChoices,
  onChoice,
  onGenerate,
  isGenerating,
}: {
  currentStep: number;
  flowChoices: Record<string, string>;
  onChoice: (stepId: string, optionValue: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  // Mock questions - in real app, these come from API
  const questions: GuidedBetFlowChoice[] = [
    {
      id: 'step-1',
      stepId: 'risk_preference',
      question: 'O que você prefere?',
      description: 'Escolha seu estilo de aposta',
      options: [
        { id: 'low_risk', label: 'Menor risco', description: 'Odds mais baixas, chance maior de acerto', icon: '🛡️', value: 'low' },
        { id: 'balanced_risk', label: 'Odd equilibrada', description: 'Equilíbrio entre risco e retorno', icon: '⚖️', value: 'medium' },
        { id: 'high_risk', label: 'Retorno mais alto', description: 'Maior risco, potencial de ganho maior', icon: '🚀', value: 'high' },
      ],
    },
    {
      id: 'step-2',
      stepId: 'game_expectation',
      question: 'Como você vê esse jogo?',
      description: 'Nos ajude a entender sua expectativa',
      options: [
        { id: 'many_goals', label: 'Jogo com gols', description: 'Espero muitos gols neste jogo', icon: '⚽', value: 'goals' },
        { id: 'balanced_game', label: 'Jogo equilibrado', description: 'Times bem pareados', icon: '🤝', value: 'balanced' },
        { id: 'favorite_strong', label: 'Favorito forte', description: 'Um time é claramente favorito', icon: '⭐', value: 'favorite' },
      ],
    },
    {
      id: 'step-3',
      stepId: 'bet_style',
      question: 'Qual seu estilo?',
      description: 'Como você gosta de apostar',
      options: [
        { id: 'simple', label: 'Simples e direta', description: 'Uma única seleção', icon: '✓', value: 'single' },
        { id: 'combined', label: 'Combinada', description: 'Múltiplas seleções', icon: '🔗', value: 'accumulator' },
      ],
    },
  ];

  const currentQuestion = questions[currentStep - 1];
  const isLastStep = currentStep >= questions.length;

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#22c55e" />
        <Text style={styles.loadingText}>Gerando sugestão...</Text>
      </View>
    );
  }

  return (
    <View style={styles.flowContainer}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        {questions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Question */}
        <Text style={styles.question}>{currentQuestion.question}</Text>
        <Text style={styles.questionDescription}>{currentQuestion.description}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                flowChoices[currentQuestion.stepId] === option.value && styles.optionButtonActive,
              ]}
              onPress={() => onChoice(currentQuestion.stepId, option.value)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionLabel,
                  flowChoices[currentQuestion.stepId] === option.value && styles.optionLabelActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      {isLastStep && flowChoices[currentQuestion.stepId] ? (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>Gerar Aposta</Text>
          )}
        </TouchableOpacity>
      ) : flowChoices[currentQuestion.stepId] ? (
        <View style={styles.nextHint}>
          <Text style={styles.nextHintText}>Continuando...</Text>
        </View>
      ) : null}
    </View>
  );
}

function GeneratedSuggestionView({
  suggestion,
  onRemoveSelection,
  onAddToSlip,
}: {
  suggestion: GuidedBetSuggestion;
  onRemoveSelection: (id: string) => void;
  onAddToSlip: () => void;
}) {
  return (
    <View style={styles.generatedContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.generatedHeader}>
          <Text style={styles.generatedTitle}>{suggestion.title}</Text>
          <GuidedBetRiskBadge level={suggestion.riskLevel} size="medium" />
        </View>

        <Text style={styles.generatedExplanation}>{suggestion.explanation}</Text>

        {/* Odds */}
        <View style={styles.oddsContainerLarge}>
          <Text style={styles.oddsLabelLarge}>Odd Total</Text>
          <Text style={styles.oddsValueXLarge}>{suggestion.totalOdds.toFixed(2)}</Text>
          {suggestion.potentialReturn && (
            <Text style={styles.potentialReturnLarge}>
              Retorno potencial: R$ {suggestion.potentialReturn.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Selections */}
        <Text style={styles.selectionsTitle}>Suas Seleções</Text>
        <View style={styles.selectionsList}>
          {suggestion.selections.map((sel, index) => (
            <View key={sel.id} style={styles.selectionItem}>
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionNumberLarge}>{index + 1}</Text>
                <View style={styles.selectionDetails}>
                  <Text style={styles.selectionMarket}>{sel.marketName}</Text>
                  <Text style={styles.selectionOutcome}>{sel.label}</Text>
                </View>
              </View>
              <View style={styles.selectionActions}>
                <Text style={styles.selectionOddsLarge}>{sel.odds.toFixed(2)}</Text>
                {sel.isEditable && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => onRemoveSelection(sel.id)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {suggestion.tags.map((tag, index) => (
            <View key={index} style={styles.tagLarge}>
              <Text style={styles.tagTextLarge}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Edit Note */}
        <Text style={styles.editNote}>
          💡 Você pode remover seleções acima. A odd será recalculada automaticamente.
        </Text>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addToSlipButton} onPress={onAddToSlip}>
        <Text style={styles.addToSlipButtonText}>Adicionar ao Betslip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: height * 0.9,
    minHeight: height * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#737373',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 20,
    color: '#737373',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#737373',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#171717',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '600',
  },
  successContainer: {
    padding: 40,
    alignItems: 'center',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  successIconText: {
    fontSize: 36,
    color: '#22c55e',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fafafa',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#737373',
  },
  startContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  startIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  startTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fafafa',
    marginBottom: 12,
    textAlign: 'center',
  },
  startDescription: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  flowContainer: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#262626',
  },
  progressDotActive: {
    backgroundColor: '#22c55e',
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionDescription: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    gap: 12,
  },
  optionButtonActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 2,
  },
  optionLabelActive: {
    color: '#22c55e',
  },
  optionDescription: {
    fontSize: 12,
    color: '#737373',
  },
  nextButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nextHint: {
    alignItems: 'center',
    marginTop: 20,
  },
  nextHintText: {
    fontSize: 14,
    color: '#737373',
  },
  generatedContainer: {
    flex: 1,
  },
  generatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  generatedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
    flex: 1,
  },
  generatedExplanation: {
    fontSize: 13,
    color: '#a3a3a3',
    marginBottom: 20,
    lineHeight: 18,
  },
  oddsContainerLarge: {
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  oddsLabelLarge: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 4,
  },
  oddsValueXLarge: {
    fontSize: 42,
    fontWeight: '800',
    color: '#22c55e',
    letterSpacing: -0.5,
  },
  potentialReturnLarge: {
    fontSize: 14,
    color: '#a3a3a3',
    marginTop: 4,
  },
  selectionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 12,
  },
  selectionsList: {
    gap: 10,
    marginBottom: 20,
  },
  selectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 10,
    padding: 12,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectionNumberLarge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#262626',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '700',
    color: '#a3a3a3',
    marginRight: 12,
  },
  selectionDetails: {
    flex: 1,
  },
  selectionMarket: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 2,
  },
  selectionOutcome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionOddsLarge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagLarge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagTextLarge: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '500',
  },
  editNote: {
    fontSize: 12,
    color: '#737373',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  addToSlipButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  addToSlipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
