import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLeagues, mockLiveEvents, mockSports, mockUpcomingEvents } from '@shared';
import { useSearchHistoryStore } from '../stores/searchHistoryStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SearchRoute = RouteProp<RootStackParamList, 'Search'>;

type SearchResult =
  | { id: string; type: 'sport'; title: string; subtitle: string; route: ['Sport', { sportId: string; title?: string }] }
  | { id: string; type: 'league'; title: string; subtitle: string; route: ['League', { leagueId: string; title?: string }] }
  | { id: string; type: 'event'; title: string; subtitle: string; route: ['Event', { id: string }] };

function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  mockSports.forEach((sport) => {
    results.push({
      id: `sport-${sport.id}`,
      type: 'sport',
      title: `${sport.icon} ${sport.name}`,
      subtitle: `${sport.eventCount} eventos`,
      route: ['Sport', { sportId: sport.id, title: sport.name }],
    });
  });

  mockLeagues.forEach((league) => {
    results.push({
      id: `league-${league.id}`,
      type: 'league',
      title: league.name,
      subtitle: `${league.country} · Liga`,
      route: ['League', { leagueId: league.id, title: league.name }],
    });
  });

  [...mockLiveEvents, ...mockUpcomingEvents].forEach((event) => {
    results.push({
      id: `event-${event.id}`,
      type: 'event',
      title: `${event.home.shortName} × ${event.away.shortName}`,
      subtitle: event.league.name,
      route: ['Event', { id: event.id }],
    });
  });

  return results;
}

export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<SearchRoute>();
  const [query, setQuery] = useState(params?.initialQuery ?? '');
  const recentQueries = useSearchHistoryStore((s) => s.recentQueries);
  const pushQuery = useSearchHistoryStore((s) => s.pushQuery);
  const clearRecent = useSearchHistoryStore((s) => s.clear);

  const results = useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) return [];

    return buildSearchIndex().filter((item) =>
      normalizeText(`${item.title} ${item.subtitle}`).includes(normalized)
    );
  }, [query]);

  const openResult = (item: SearchResult) => {
    pushQuery(query || item.title);
    navigation.navigate(...item.route);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.inputWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Esportes, ligas, times, eventos..."
          placeholderTextColor="#737373"
          style={styles.input}
          autoFocus
        />
      </View>

      {!query && recentQueries.length > 0 && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>Recentes</Text>
            <TouchableOpacity onPress={clearRecent}>
              <Text style={styles.clearText}>Limpar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipWrap}>
            {recentQueries.map((item) => (
              <TouchableOpacity key={item} style={styles.chip} onPress={() => setQuery(item)}>
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{query ? `Resultados (${results.length})` : 'Comece a digitar'}</Text>
        <View style={styles.stack}>
          {results.map((item) => (
            <TouchableOpacity key={item.id} style={styles.resultCard} onPress={() => openResult(item)}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.resultType}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {query && results.length === 0 && <Text style={styles.helper}>Nenhum resultado encontrado.</Text>}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  inputWrap: {
    backgroundColor: '#171717',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  input: { color: '#fafafa', height: 48, fontSize: 15 },
  section: { marginBottom: 18 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionLabel: { color: '#a3a3a3', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  clearText: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { color: '#fafafa', fontSize: 12 },
  stack: { gap: 10, marginTop: 10 },
  resultCard: {
    backgroundColor: '#171717',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    padding: 14,
  },
  resultTitle: { color: '#fafafa', fontSize: 15, fontWeight: '600' },
  resultSubtitle: { color: '#737373', fontSize: 12, marginTop: 4 },
  resultType: { color: '#22c55e', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  helper: { color: '#737373', fontSize: 13, textAlign: 'center', marginTop: 16 },
});
