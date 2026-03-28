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
} from 'react-native';
import { CashoutValueCard } from './CashoutValueCard';
import { useCashout } from '../../hooks/useCashout';
import type { CashoutType, CashoutExecutionResult } from '@shared';

interface CashoutBottomSheetProps {
  betId: string | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: (result: CashoutExecutionResult) => void;
  betTitle?: string;
}

const { height } = Dimensions.get('window');
const PERCENTAGE_OPTIONS = [25, 50, 75, 100];

export function CashoutBottomSheet({
  betId,
  visible,
  onClose,
  onSuccess,
  betTitle,
}: CashoutBottomSheetProps) {
  const {
    offer,
    preview,
    isLoadingOffer,
    isExecuting,
    error,
    previewCashout,
    executeCashout,
    canCashout,
  } = useCashout(betId);

  const [selectedType, setSelectedType] = useState<CashoutType>('full');
  const [selectedPercentage, setSelectedPercentage] = useState<number>(100);
  const [step, setStep] = useState<'select' | 'preview' | 'confirm'>('select');

  const handleTypeChange = useCallback((type: CashoutType) => {
    setSelectedType(type);
    if (type === 'full') {
      setSelectedPercentage(100);
    } else {
      setSelectedPercentage(50);
    }
    setStep('select');
  }, []);

  const handlePreview = useCallback(async () => {
    if (!betId) return;
    const percentage = selectedType === 'full' ? 100 : selectedPercentage;
    await previewCashout(betId, selectedType, percentage);
    setStep('preview');
  }, [betId, selectedType, selectedPercentage, previewCashout]);

  const handleExecute = useCallback(async () => {
    if (!betId) return;
    const percentage = selectedType === 'full' ? 100 : selectedPercentage;
    const result = await executeCashout(betId, selectedType, percentage);
    if (result?.success) {
      onSuccess(result);
    }
  }, [betId, selectedType, selectedPercentage, executeCashout, onSuccess]);

  const handleClose = useCallback(() => {
    setStep('select');
    setSelectedType('full');
    setSelectedPercentage(100);
    onClose();
  }, [onClose]);

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
            <Text style={styles.title}>
              {step === 'confirm' ? 'Confirmar Cashout' : 'Cashout'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Bet Info */}
          {betTitle && (
            <View style={styles.betInfo}>
              <Text style={styles.betLabel}>Aposta</Text>
              <Text style={styles.betTitle} numberOfLines={2}>{betTitle}</Text>
            </View>
          )}

          {/* Content */}
          {isLoadingOffer ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#22c55e" />
              <Text style={styles.loadingText}>Carregando oferta...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.errorButton}>
                <Text style={styles.errorButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          ) : !canCashout ? (
            <View style={styles.unavailableContainer}>
              <Text style={styles.unavailableIcon}>−</Text>
              <Text style={styles.unavailableTitle}>Cashout Indisponível</Text>
              <Text style={styles.unavailableText}>
                O cashout não está disponível para esta aposta no momento.
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.unavailableButton}>
                <Text style={styles.unavailableButtonText}>Entendi</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Value Card */}
              <View style={styles.valueSection}>
                <CashoutValueCard offer={offer!} variant="full" />
              </View>

              {/* Type Selection */}
              <View style={styles.typeSection}>
                <Text style={styles.sectionLabel}>Tipo de cashout</Text>
                <View style={styles.typeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      selectedType === 'full' && styles.typeButtonActive,
                    ]}
                    onPress={() => handleTypeChange('full')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === 'full' && styles.typeButtonTextActive,
                      ]}
                    >
                      Total
                    </Text>
                    <Text
                      style={[
                        styles.typeButtonSubtext,
                        selectedType === 'full' && styles.typeButtonTextActive,
                      ]}
                    >
                      Encerrar tudo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      selectedType === 'partial' && styles.typeButtonActive,
                    ]}
                    onPress={() => handleTypeChange('partial')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === 'partial' && styles.typeButtonTextActive,
                      ]}
                    >
                      Parcial
                    </Text>
                    <Text
                      style={[
                        styles.typeButtonSubtext,
                        selectedType === 'partial' && styles.typeButtonTextActive,
                      ]}
                    >
                      Manter parte em jogo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Percentage Selection (for partial) */}
              {selectedType === 'partial' && (
                <View style={styles.percentageSection}>
                  <Text style={styles.sectionLabel}>Quanto deseja retirar?</Text>
                  <View style={styles.percentageButtons}>
                    {PERCENTAGE_OPTIONS.slice(0, -1).map((pct) => (
                      <TouchableOpacity
                        key={pct}
                        style={[
                          styles.percentageButton,
                          selectedPercentage === pct && styles.percentageButtonActive,
                        ]}
                        onPress={() => setSelectedPercentage(pct)}
                      >
                        <Text
                          style={[
                            styles.percentageButtonText,
                            selectedPercentage === pct && styles.percentageButtonTextActive,
                          ]}
                        >
                          {pct}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Preview Section */}
              {preview && step === 'preview' && (
                <View style={styles.previewSection}>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Você recebe agora</Text>
                    <Text style={styles.previewValue}>
                      R$ {preview.cashoutAmount.toFixed(2)}
                    </Text>
                  </View>
                  {selectedType === 'partial' && (
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Continua em jogo</Text>
                      <Text style={styles.previewValueSecondary}>
                        R$ {preview.remainingPotentialReturn.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.previewMessage}>{preview.message}</Text>
                </View>
              )}

              {/* Warning */}
              <View style={styles.warningSection}>
                <Text style={styles.warningIcon}>ⓘ</Text>
                <Text style={styles.warningText}>
                  Os valores podem mudar em tempo real. A confirmação é final.
                </Text>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  (isExecuting || isLoadingOffer) && styles.actionButtonDisabled,
                ]}
                onPress={step === 'select' ? handlePreview : handleExecute}
                disabled={isExecuting || isLoadingOffer}
              >
                {isExecuting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    {step === 'select' ? 'Ver Preview' : 'Confirmar Cashout'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
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
    maxHeight: height * 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 18,
    color: '#737373',
  },
  betInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 38, 38, 0.5)',
  },
  betLabel: {
    fontSize: 11,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  betTitle: {
    fontSize: 14,
    color: '#fafafa',
    fontWeight: '500',
  },
  valueSection: {
    marginBottom: 20,
  },
  typeSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a3a3a3',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 2,
  },
  typeButtonTextActive: {
    color: '#22c55e',
  },
  typeButtonSubtext: {
    fontSize: 11,
    color: '#737373',
  },
  percentageSection: {
    marginBottom: 20,
  },
  percentageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  percentageButton: {
    flex: 1,
    backgroundColor: '#171717',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  percentageButtonActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  percentageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#a3a3a3',
  },
  percentageButtonTextActive: {
    color: '#22c55e',
  },
  previewSection: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: '#a3a3a3',
  },
  previewValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  previewValueSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
  },
  previewMessage: {
    fontSize: 12,
    color: '#737373',
    marginTop: 8,
    fontStyle: 'italic',
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 14,
    color: '#f59e0b',
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: '#737373',
  },
  actionButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
  unavailableContainer: {
    padding: 40,
    alignItems: 'center',
  },
  unavailableIcon: {
    fontSize: 40,
    color: '#737373',
    marginBottom: 16,
  },
  unavailableTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 8,
  },
  unavailableText: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 24,
  },
  unavailableButton: {
    backgroundColor: '#171717',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  unavailableButtonText: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '600',
  },
});
