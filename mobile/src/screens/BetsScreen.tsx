import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOpenBets } from '../hooks/useOpenBets';
import { OpenBetCard } from '../components/cashout/OpenBetCard';
import { CashoutBottomSheet } from '../components/cashout/CashoutBottomSheet';
import { CashoutSuccessView } from '../components/cashout/CashoutSuccessView';
import type { CashoutExecutionResult, OpenBet } from '@shared';
import type { RootStackParamList } from '../navigation/types';
import { brandColors, semanticColors, spacing, typography, radius } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function BetsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    bets,
    liveBets,
    cashoutAvailableBets,
    totalCount,
    totalCashoutAvailable,
    isLoading,
    error,
    refresh,
  } = useOpenBets();

  const [selectedBet, setSelectedBet] = useState<OpenBet | null>(null);
  const [cashoutVisible, setCashoutVisible] = useState(false);
  const [successResult, setSuccessResult] = useState<CashoutExecutionResult | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleCashoutPress = useCallback((bet: OpenBet) => {
    setSelectedBet(bet);
    setCashoutVisible(true);
  }, []);

  const handleCashoutClose = useCallback(() => {
    setCashoutVisible(false);
    setSelectedBet(null);
  }, []);

  const handleCashoutSuccess = useCallback((result: CashoutExecutionResult) => {
    setCashoutVisible(false);
    setSuccessResult(result);
    setSuccessVisible(true);
    refresh();
  }, [refresh]);

  const handleSuccessClose = useCallback(() => {
    setSuccessVisible(false);
    setSuccessResult(null);
    setSelectedBet(null);
  }, []);

  const handleViewLive = useCallback(() => {
    setSuccessVisible(false);
    navigation.navigate('MainTabs', { screen: 'Live' });
  }, [navigation]);

  const handleViewBets = useCallback(() => {
    setSuccessVisible(false);
    setSelectedBet(null);
  }, []);

  const openBets = bets.filter(b => b.status !== 'cashed_out');
  const sortedBets = [...openBets].sort((a, b) => {
    // Live bets first, then by cashout availability
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    if (a.cashoutOffer?.status === 'available' && b.cashoutOffer?.status !== 'available') return -1;
    if (b.cashoutOffer?.status === 'available' && a.cashoutOffer?.status !== 'available') return 1;
    return 0;
  });

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#22c55e" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Minhas Apostas</Text>
            <Text style={styles.subtitle}>
              {totalCount} {totalCount === 1 ? 'aposta em andamento' : 'apostas em andamento'}
            </Text>
          </View>
          {totalCashoutAvailable > 0 && (
            <View style={styles.totalCashoutBadge}>
              <Text style={styles.totalCashoutLabel}>Cashout total</Text>
              <Text style={styles.totalCashoutValue}>
                R$ {totalCashoutAvailable.toFixed(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refresh} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Live Bets Section */}
        {liveBets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Ao vivo</Text>
              </View>
              <Text style={styles.sectionCount}>{liveBets.length}</Text>
            </View>
            {liveBets.map((bet) => (
              <OpenBetCard
                key={bet.id}
                bet={bet}
                compact
                onCashoutPress={() => handleCashoutPress(bet)}
              />
            ))}
          </View>
        )}

        {/* Cashout Available Section */}
        {cashoutAvailableBets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cashout disponível</Text>
              <Text style={styles.sectionCount}>{cashoutAvailableBets.length}</Text>
            </View>
            {cashoutAvailableBets.map((bet) => (
              <OpenBetCard
                key={bet.id}
                bet={bet}
                compact
                onCashoutPress={() => handleCashoutPress(bet)}
              />
            ))}
          </View>
        )}

        {/* All Open Bets Section */}
        {openBets.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todas as apostas</Text>
            {sortedBets.map((bet) => (
              <OpenBetCard
                key={bet.id}
                bet={bet}
                onCashoutPress={() => handleCashoutPress(bet)}
              />
            ))}
          </View>
        ) : !isLoading && !error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>Nenhuma aposta em andamento</Text>
            <Text style={styles.emptyText}>
              Você não tem apostas abertas no momento. Explore os jogos ao vivo ou eventos futuros para começar.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}
            >
              <Text style={styles.exploreButtonText}>Explorar Eventos</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Cashout Bottom Sheet */}
      <CashoutBottomSheet
        betId={selectedBet?.id || null}
        visible={cashoutVisible}
        onClose={handleCashoutClose}
        onSuccess={handleCashoutSuccess}
        betTitle={selectedBet?.selections.map(s => s.outcomeName).join(', ')}
      />

      {/* Success Modal */}
      <CashoutSuccessView
        result={successResult}
        visible={successVisible}
        onClose={handleSuccessClose}
        onViewBets={handleViewBets}
        onExploreLive={handleViewLive}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.background.primary,
  },
  content: {
    padding: spacing[4],
  },
  header: {
    marginBottom: spacing[6],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
    fontFamily: typography.fontFamily.sans,
  },
  subtitle: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
  },
  totalCashoutBadge: {
    backgroundColor: `${brandColors.green[400]}1A`,
    borderRadius: radius.lg,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: `${brandColors.green[400]}33`,
    alignItems: 'center',
  },
  totalCashoutLabel: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  statBox: {
    flex: 1,
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: semanticColors.border.subtle,
  },
  statLabel: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  statValue: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans,
  },
  cashoutBox: {
    borderColor: `${brandColors.green[400]}4D`,
  },
  cashoutLabel: {
    color: brandColors.green[400],
  },
  cashoutValue: {
    color: brandColors.green[400],
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans,
  },
  totalCashoutValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: brandColors.green[400],
    fontFamily: typography.fontFamily.sans,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: semanticColors.state.error,
    textAlign: 'center',
    marginBottom: spacing[3],
    fontFamily: typography.fontFamily.sans,
  },
  retryButton: {
    backgroundColor: semanticColors.state.error,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
  },
  retryText: {
    color: '#fff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.sans,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.sans,
  },
  sectionCount: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: semanticColors.text.secondary,
    backgroundColor: semanticColors.surface.default,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    fontFamily: typography.fontFamily.sans,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: semanticColors.state.live,
  },
  liveText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.state.live,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.sans,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing[16],
    paddingHorizontal: spacing[6],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: semanticColors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 20,
    fontFamily: typography.fontFamily.sans,
  },
  exploreButton: {
    backgroundColor: brandColors.green[400],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3.5],
    borderRadius: radius.lg,
  },
  exploreButtonText: {
    color: semanticColors.background.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans,
  },
  bottomSpacing: {
    height: spacing[10],
  },
});
