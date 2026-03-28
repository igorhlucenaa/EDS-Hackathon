import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import type { CashoutExecutionResult, CashoutType } from '@shared';

interface CashoutSuccessViewProps {
  result: CashoutExecutionResult | null;
  visible: boolean;
  onClose: () => void;
  onViewBets?: () => void;
  onExploreLive?: () => void;
}

export function CashoutSuccessView({
  result,
  visible,
  onClose,
  onViewBets,
  onExploreLive,
}: CashoutSuccessViewProps) {
  if (!visible || !result) return null;

  const isPartial = result.type === 'partial';
  const scaleAnim = new Animated.Value(0.9);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isPartial ? 'Cashout Parcial Realizado!' : 'Cashout Total Realizado!'}
          </Text>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Valor creditado</Text>
            <Text style={styles.amount}>
              R$ {result.amountCredited.toFixed(2)}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            {isPartial && result.remainingPotentialReturn > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Continua em jogo</Text>
                <Text style={styles.detailValue}>
                  R$ {result.remainingPotentialReturn.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo</Text>
              <Text style={styles.detailValue}>
                {isPartial ? 'Parcial' : 'Total'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Horário</Text>
              <Text style={styles.detailValue}>
                {new Date(result.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {/* Message */}
          <Text style={styles.message}>{result.message}</Text>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {isPartial && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onViewBets}
              >
                <Text style={styles.secondaryButtonText}>Acompanhar Aposta</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onExploreLive}
            >
              <Text style={styles.primaryButtonText}>Explorar Ao Vivo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tertiaryButton} onPress={onClose}>
              <Text style={styles.tertiaryButtonText}>Voltar para Apostas</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#171717',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  iconContainer: {
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
  icon: {
    fontSize: 36,
    color: '#22c55e',
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fafafa',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#22c55e',
    letterSpacing: -0.5,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#737373',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fafafa',
  },
  message: {
    fontSize: 13,
    color: '#a3a3a3',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  secondaryButtonText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  tertiaryButton: {
    padding: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#737373',
    fontSize: 14,
    fontWeight: '500',
  },
});
