import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLiveEvents, mockUpcomingEvents } from '@shared';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type MarketCard = {
  eventId: string;
  eventLabel: string;
  leagueName: string;
  statusLabel: string;
  marketId: string;
  marketName: string;
  category: string;
  outcomes: Array<{ id: string; name: string; odds: number }>;
};

export function MarketExplorerScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const allMarkets = useMemo<MarketCard[]>(() => {
    return [...mockLiveEvents, ...mockUpcomingEvents].flatMap((event) =>
      event.markets.map((market) => ({
        eventId: event.id,
        eventLabel: `${event.home.shortName} x ${event.away.shortName}`,
        leagueName: event.league.name,
        statusLabel:
          event.status.type === 'live'
            ? event.status.clock ?? 'Ao vivo'
            : new Date(event.startTime).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
        marketId: market.id,
        marketName: market.name,
        category: market.category,
        outcomes: market.outcomes.map((outcome) => ({
          id: outcome.id,
          name: outcome.name,
          odds: outcome.odds,
        })),
      }))
    );
  }, []);

  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(allMarkets.map((market) => market.category)))],
    [allMarkets]
  );

  const visibleMarkets = useMemo(
    () =>
      allMarkets.filter((market) =>
        selectedCategory === 'Todas' ? true : market.category === selectedCategory
      ),
    [allMarkets, selectedCategory]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Explorer de mercados</Text>
        <Text style={styles.subtitle}>
          Leitura transversal dos principais mercados nativos do catalogo.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {categories.map((category) => {
          const active = category === selectedCategory;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.stack}>
        {visibleMarkets.map((market) => (
          <TouchableOpacity
            key={`${market.eventId}-${market.marketId}`}
            style={styles.card}
            onPress={() => navigation.navigate('Event', { id: market.eventId })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardCopy}>
                <Text style={styles.marketTitle}>{market.marketName}</Text>
                <Text style={styles.marketMeta}>
                  {market.eventLabel} · {market.leagueName}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{market.statusLabel}</Text>
              </View>
            </View>
            <View style={styles.outcomeRow}>
              {market.outcomes.slice(0, 3).map((outcome) => (
                <View key={outcome.id} style={styles.outcomeCard}>
                  <Text style={styles.outcomeName}>{outcome.name}</Text>
                  <Text style={styles.outcomeOdds}>{outcome.odds.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 16 },
  title: { color: '#fafafa', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#737373', fontSize: 13, lineHeight: 20 },
  filterScroll: { marginBottom: 16, marginHorizontal: -16 },
  filterChip: {
    backgroundColor: '#171717',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  filterText: { color: '#a3a3a3', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#22c55e' },
  stack: { gap: 12 },
  card: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  cardCopy: { flex: 1 },
  marketTitle: { color: '#fafafa', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  marketMeta: { color: '#737373', fontSize: 12, lineHeight: 18 },
  badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { color: '#22c55e', fontSize: 11, fontWeight: '700' },
  outcomeRow: { flexDirection: 'row', gap: 8 },
  outcomeCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.45)',
  },
  outcomeName: { color: '#a3a3a3', fontSize: 11, marginBottom: 4 },
  outcomeOdds: { color: '#fafafa', fontSize: 14, fontWeight: '700' },
});
