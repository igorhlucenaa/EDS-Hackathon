import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLeagues, mockLiveEvents, mockSports, mockUpcomingEvents } from '@shared';
import { EventCard } from '../components/EventCard';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SportRoute = RouteProp<RootStackParamList, 'Sport'>;

export function SportScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<SportRoute>();
  const sport = mockSports.find((item) => item.id === params.sportId);

  const leagues = useMemo(
    () => mockLeagues.filter((league) => league.sportId === params.sportId),
    [params.sportId]
  );
  const liveEvents = useMemo(
    () => mockLiveEvents.filter((event) => event.sportId === params.sportId),
    [params.sportId]
  );
  const upcomingEvents = useMemo(
    () => mockUpcomingEvents.filter((event) => event.sportId === params.sportId),
    [params.sportId]
  );

  if (!sport) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Esporte não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.icon}>{sport.icon}</Text>
        <Text style={styles.title}>{sport.name}</Text>
        <Text style={styles.subtitle}>
          {sport.liveCount} ao vivo · {sport.eventCount} eventos
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Competições</Text>
        <View style={styles.chipWrap}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              style={styles.chip}
              onPress={() => navigation.navigate('League', { leagueId: league.id, title: league.name })}
            >
              <Text style={styles.chipText}>{league.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
        <Text style={styles.sectionTitle}>Em breve</Text>
        <View style={styles.stack}>
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} onPress={() => navigation.navigate('Event', { id: event.id })} />
          ))}
          {upcomingEvents.length === 0 && <Text style={styles.helper}>Sem jogos próximos neste esporte.</Text>}
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
  icon: { fontSize: 28, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '700', color: '#fafafa' },
  subtitle: { fontSize: 13, color: '#737373', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fafafa', marginBottom: 10 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  chipText: { color: '#fafafa', fontSize: 12, fontWeight: '500' },
  stack: { gap: 12 },
  helper: { color: '#737373', fontSize: 13 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' },
  emptyTitle: { color: '#fafafa', fontSize: 16, fontWeight: '600' },
});
