import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CashoutStatusBadge } from './CashoutStatusBadge';
import { CashoutValueCard } from './CashoutValueCard';
import type { OpenBet } from '@shared';

interface OpenBetCardProps {
  bet: OpenBet;
  onPress?: () => void;
  onCashoutPress?: () => void;
  showCashoutButton?: boolean;
  compact?: boolean;
}

export function OpenBetCard({
  bet,
  onPress,
  onCashoutPress,
  showCashoutButton = true,
  compact = false,
}: OpenBetCardProps) {
  const firstSelection = bet.selections[0];
  const isLive = bet.status === 'live';
  const hasCashout = bet.cashoutOffer && bet.cashoutOffer.status !== 'unavailable';

  const getStatusConfig = () => {
    switch (bet.status) {
      case 'live':
        return { label: 'Ao vivo', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
      case 'cashout_available':
        return { label: 'Cashout disponível', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' };
      case 'partial_cashout':
        return { label: 'Cashout parcial', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' };
      default:
        return { label: 'Aberta', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' };
    }
  };

  const statusConfig = getStatusConfig();

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, isLive && styles.compactContainerLive]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {isLive ? '● ' : ''}{statusConfig.label}
            </Text>
          </View>
          <Text style={styles.typeText}>
            {bet.betType === 'accumulator' ? 'Múltipla' : 'Simples'}
          </Text>
        </View>

        <Text style={styles.selectionText} numberOfLines={1}>
          {firstSelection?.outcomeName}
          {bet.selections.length > 1 && ` +${bet.selections.length - 1}`}
        </Text>

        <View style={styles.compactFooter}>
          <Text style={styles.stakeText}>R$ {bet.stake.toFixed(0)}</Text>
          {hasCashout && showCashoutButton ? (
            <TouchableOpacity
              style={styles.cashoutButtonCompact}
              onPress={(e) => {
                e.stopPropagation();
                onCashoutPress?.();
              }}
            >
              <Text style={styles.cashoutButtonTextCompact}>
                Cashout R$ {bet.cashoutOffer!.availableAmount.toFixed(0)}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.returnText}>Ganho: R$ {bet.potentialReturn.toFixed(0)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, isLive && styles.containerLive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {isLive ? '● ' : ''}{statusConfig.label}
            </Text>
          </View>
          <Text style={styles.typeText}>
            {bet.betType === 'accumulator' ? 'Múltipla' : 'Simples'}
          </Text>
        </View>
        {hasCashout && (
          <CashoutStatusBadge status={bet.cashoutOffer!.status} size="small" />
        )}
      </View>

      {/* Selections */}
      <View style={styles.selectionsContainer}>
        {bet.selections.map((sel, index) => (
          <View key={sel.id} style={styles.selectionRow}>
            <Text style={styles.selectionNumber}>{index + 1}</Text>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionName} numberOfLines={1}>
                {sel.outcomeName}
              </Text>
              <Text style={styles.selectionMarket} numberOfLines={1}>
                {sel.marketName} • {sel.eventName}
              </Text>
            </View>
            <Text style={styles.selectionOdds}>{sel.odds.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Cashout Value */}
      {hasCashout && bet.cashoutOffer && (
        <View style={styles.cashoutSection}>
          <CashoutValueCard offer={bet.cashoutOffer} variant="compact" />
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Apostado</Text>
            <Text style={styles.footerValue}>R$ {bet.stake.toFixed(2)}</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Retorno</Text>
            <Text style={[styles.footerValue, styles.footerValueHighlight]}>
              R$ {bet.potentialReturn.toFixed(2)}
            </Text>
          </View>
        </View>

        {hasCashout && showCashoutButton && (
          <TouchableOpacity
            style={styles.cashoutButton}
            onPress={(e) => {
              e.stopPropagation();
              onCashoutPress?.();
            }}
          >
            <Text style={styles.cashoutButtonText}>Cashout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Partial Cashout Info */}
      {bet.partialCashouts && bet.partialCashouts.length > 0 && (
        <View style={styles.partialInfo}>
          <Text style={styles.partialTitle}>Cashouts parciais anteriores:</Text>
          {bet.partialCashouts.map((pc, idx) => (
            <Text key={idx} style={styles.partialItem}>
              {pc.percentage}% retirado • R$ {pc.amount.toFixed(2)}
            </Text>
          ))}
          {bet.remainingExposure !== undefined && bet.remainingExposure > 0 && (
            <Text style={styles.partialRemaining}>
              R$ {bet.remainingExposure.toFixed(2)} ainda em jogo
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 12,
  },
  containerLive: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  compactContainer: {
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 10,
  },
  compactContainerLive: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typeText: {
    fontSize: 12,
    color: '#737373',
  },
  selectionsContainer: {
    marginBottom: 12,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  selectionNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#262626',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 11,
    fontWeight: '700',
    color: '#a3a3a3',
  },
  selectionInfo: {
    flex: 1,
  },
  selectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
  },
  selectionMarket: {
    fontSize: 11,
    color: '#737373',
    marginTop: 2,
  },
  selectionOdds: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22c55e',
  },
  cashoutSection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 10,
    color: '#737373',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fafafa',
  },
  footerValueHighlight: {
    color: '#22c55e',
  },
  footerDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
  },
  cashoutButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cashoutButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 10,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  stakeText: {
    fontSize: 12,
    color: '#737373',
  },
  returnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e',
  },
  cashoutButtonCompact: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  cashoutButtonTextCompact: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '600',
  },
  partialInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(168, 85, 247, 0.3)',
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    marginHorizontal: -16,
    marginBottom: -16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  partialTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a855f7',
    marginBottom: 4,
  },
  partialItem: {
    fontSize: 11,
    color: '#a3a3a3',
  },
  partialRemaining: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fafafa',
    marginTop: 4,
  },
});
