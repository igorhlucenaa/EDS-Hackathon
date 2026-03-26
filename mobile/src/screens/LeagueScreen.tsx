import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLeagues, mockLiveEvents, mockSports, mockUpcomingEvents } from '@shared';
import { EventCard } from '../components/EventCard';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type LeagueRoute = RouteProp<RootStackParamList, 'League'>;

export function LeagueScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<LeagueRoute>();
  const league = mockLeagues.find((item) => item.id === params.leagueId);
  const sport = league ? mockSports.find((item) => item.id === league.sportId) : undefined;

  const liveEvents = useMemo(
    () => mockLiveEvents.filter((event) => event.leagueId === params.leagueId),
    [params.leagueId]
  );
  const upcomingEvents = useMemo(
    () => mockUpcomingEvents.filter((event) => event.leagueId === params.leagueId),
    [params.leagueId]
  );

  if (!league) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Liga não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>
          {sport?.icon ?? '🌍'} {sport?.name ?? 'Esporte'}
        </Text>
        <Text style={styles.title}>{league.name}</Text>
        <Text style={styles.subtitle}>{league.country}</Text>
      </View>

      {liveEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ao vivo</Text>
          <View style={styles.stack}>
            {liveEvents.map((event) => (
              <LiveSnapshotCard key={event.id} event={event} onPress={() => navigation.navigate('Event', { id: event.id })} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos jogos</Text>
        <View style={styles.stack}>
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} onPress={() => navigation.navigate('Event', { id: event.id })} />
          ))}
          {upcomingEvents.length === 0 && liveEvents.length === 0 && (
            <Text style={styles.helper}>Nenhum evento listado para esta liga.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  hero: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 16,
  },
  kicker: { fontSize: 11, fontWeight: '600', color: '#737373', marginBottom: 6, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '700', color: '#fafafa' },
  subtitle: { fontSize: 13, color: '#737373', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fafafa', marginBottom: 10 },
  stack: { gap: 12 },
  helper: { color: '#737373', fontSize: 13 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' },
  emptyTitle: { color: '#fafafa', fontSize: 16, fontWeight: '600' },
});
