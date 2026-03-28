import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CashoutStatusBadge } from './CashoutStatusBadge';
import type { CashoutOffer } from '@shared';

interface CashoutValueCardProps {
  offer: CashoutOffer;
  onPress?: () => void;
  showStatus?: boolean;
  variant?: 'compact' | 'full';
}

export function CashoutValueCard({
  offer,
  showStatus = true,
  variant = 'compact',
}: CashoutValueCardProps) {
  const isUnavailable = offer.status === 'unavailable' || offer.availableAmount <= 0;

  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Cashout</Text>
          <Text style={[styles.valueAmount, isUnavailable && styles.unavailableText]}>
            {isUnavailable ? 'Indisponível' : `R$ ${offer.availableAmount.toFixed(2)}`}
          </Text>
        </View>
        {showStatus && (
          <CashoutStatusBadge status={offer.status} size="small" />
        )}
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <View style={styles.fullHeader}>
        <Text style={styles.fullTitle}>Valor de Cashout</Text>
        {showStatus && <CashoutStatusBadge status={offer.status} size="medium" />}
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[styles.fullAmount, isUnavailable && styles.unavailableText]}>
          {isUnavailable ? '−' : `R$ ${offer.availableAmount.toFixed(2)}`}
        </Text>
        {!isUnavailable && offer.message && (
          <Text style={styles.message}>{offer.message}</Text>
        )}
      </View>

      {!isUnavailable && (
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Apostado</Text>
            <Text style={styles.comparisonValue}>R$ {offer.originalStake.toFixed(2)}</Text>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Possível retorno</Text>
            <Text style={styles.comparisonValue}>R$ {offer.potentialReturn.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueLabel: {
    fontSize: 12,
    color: '#737373',
  },
  valueAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22c55e',
  },
  unavailableText: {
    color: '#737373',
  },
  fullContainer: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  fullHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a3a3a3',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fullAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#22c55e',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 12,
    color: '#737373',
    marginTop: 4,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.5)',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 11,
    color: '#737373',
    marginBottom: 2,
  },
  comparisonValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fafafa',
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
  },
});
