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
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fafafa',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#737373',
  },
  totalCashoutBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    alignItems: 'center',
  },
  totalCashoutLabel: {
    fontSize: 10,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalCashoutValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22c55e',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a3a3a3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737373',
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  liveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
});
