import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useSports,
  useSportMenu,
  useUpcomingEvents,
  usePromotedEvents,
} from '../hooks';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedSport, setSelectedSport] = useState<number | null>(null);

  // Buscar dados reais da API
  const { sports, loading: sportsLoading } = useSports();
  const { sports: sportMenu, loading: menuLoading } = useSportMenu();
  const { promotedEvents, loading: promotedLoading } = usePromotedEvents();
  const { events: upcomingEvents, loading: upcomingLoading } = useUpcomingEvents();

  const isLoading = sportsLoading || menuLoading || promotedLoading || upcomingLoading;

  // Filtrar eventos pelo esporte selecionado
  const filteredEvents = selectedSport
    ? upcomingEvents.filter((e) => e.sportId === selectedSport)
    : upcomingEvents;

  const handleEventPress = (eventId: string | number) => {
    navigation.navigate('Event', { id: String(eventId) });
  };

  if (isLoading && sports.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Carregando esportes e eventos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Explorar</Text>

      {/* Eventos Promovidos */}
      {promotedEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Ao Vivo</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {promotedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.promotedCard}
                onPress={() => handleEventPress(event.id)}
              >
                <View style={styles.promotedContent}>
                  <Text style={styles.promotedBadge}>{event.status.toUpperCase()}</Text>
                  <Text style={styles.matchText}>{event.name}</Text>
                  {event.score && (
                    <Text style={styles.scoreText}>
                      {event.score.home} - {event.score.away}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Filtro de Esportes */}
      {sports.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esportes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <TouchableOpacity
              style={[
                styles.sportFilter,
                selectedSport === null && styles.sportFilterActive,
              ]}
              onPress={() => setSelectedSport(null)}
            >
              <Text
                style={[
                  styles.sportFilterText,
                  selectedSport === null && styles.sportFilterTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportFilter,
                  selectedSport === sport.id && styles.sportFilterActive,
                ]}
                onPress={() => setSelectedSport(sport.id)}
              >
                <Text style={styles.sportFilterText}>{sport.icon} {sport.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Próximos Eventos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedSport
              ? sports.find((s) => s.id === selectedSport)?.name || 'Eventos'
              : 'Próximos Jogos'}
          </Text>
          {upcomingLoading && <ActivityIndicator size="small" color="#00ff00" />}
        </View>

        {filteredEvents.length > 0 ? (
          <View style={styles.grid}>
            {filteredEvents.slice(0, 10).map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event.id)}
              >
                <View style={styles.eventCardContent}>
                  <View style={styles.teams}>
                    <Text style={styles.team}>{event.homeTeam.name}</Text>
                    <Text style={styles.vs}>×</Text>
                    <Text style={styles.team}>{event.awayTeam.name}</Text>
                  </View>
                  {event.score ? (
                    <Text style={styles.score}>
                      {event.score.home} - {event.score.away}
                    </Text>
                  ) : (
                    <Text style={styles.time}>
                      {new Date(event.startTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhum evento encontrado para este esporte
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 100 },
  
  // Header
  title: { fontSize: 28, fontWeight: '700', color: '#fafafa', marginBottom: 16 },
  loadingText: { fontSize: 14, color: '#737373', marginTop: 12 },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fafafa', marginBottom: 12 },

  // Promoted Events
  horizontalScroll: { gap: 12, paddingBottom: 8 },
  promotedCard: {
    minWidth: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff0000',
    overflow: 'hidden',
  },
  promotedContent: { padding: 12, gap: 8 },
  promotedBadge: { fontSize: 10, fontWeight: '700', color: '#ff0000', letterSpacing: 1 },
  matchText: { fontSize: 13, fontWeight: '600', color: '#fafafa' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#00ff00' },

  // Sport Filter
  sportFilter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sportFilterActive: { backgroundColor: '#00ff00', borderColor: '#00ff00' },
  sportFilterText: { fontSize: 12, fontWeight: '600', color: '#737373' },
  sportFilterTextActive: { color: '#000000' },

  // Grid
  grid: { gap: 12 },

  // Event Card
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff00',
  },
  eventCardContent: {
    gap: 8,
  },
  teams: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  team: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fafafa',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 14,
    color: '#737373',
    marginHorizontal: 8,
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00ff00',
    textAlign: 'center',
  },
  time: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
  },

  // Empty State
  emptyState: { paddingVertical: 32, alignItems: 'center' },
  emptyStateText: { fontSize: 14, color: '#737373' },
});
