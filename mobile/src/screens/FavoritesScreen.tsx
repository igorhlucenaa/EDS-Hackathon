import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLeagues, mockLiveEvents, mockSports, mockUpcomingEvents } from '@shared';
import { EventCard } from '../components/EventCard';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import { useUserStore } from '../stores/userStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const favoriteSports = useUserStore((s) => s.favoriteSports);
  const favoriteLeagues = useUserStore((s) => s.favoriteLeagues);
  const favoriteTeams = useUserStore((s) => s.favoriteTeams);
  const toggleSport = useUserStore((s) => s.toggleFavoriteSport);
  const toggleLeague = useUserStore((s) => s.toggleFavoriteLeague);

  const liveFavorites = useMemo(
    () =>
      mockLiveEvents.filter(
        (event) =>
          favoriteTeams.includes(event.home.id) ||
          favoriteTeams.includes(event.away.id) ||
          favoriteLeagues.includes(event.leagueId)
      ),
    [favoriteLeagues, favoriteTeams]
  );

  const upcomingFavorites = useMemo(
    () =>
      mockUpcomingEvents.filter(
        (event) =>
          favoriteTeams.includes(event.home.id) ||
          favoriteTeams.includes(event.away.id) ||
          favoriteLeagues.includes(event.leagueId)
      ),
    [favoriteLeagues, favoriteTeams]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>Feed ao vivo e próximos jogos dos seus times e ligas.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ao vivo · seus favoritos</Text>
        <View style={styles.stack}>
          {liveFavorites.length > 0 ? (
            liveFavorites.map((event) => (
              <LiveSnapshotCard key={event.id} event={event} onPress={() => navigation.navigate('Event', { id: event.id })} />
            ))
          ) : (
            <Text style={styles.helper}>Nenhum jogo ao vivo dos favoritos agora.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Começando em breve</Text>
        <View style={styles.stack}>
          {upcomingFavorites.length > 0 ? (
            upcomingFavorites.map((event) => (
              <EventCard key={event.id} event={event} onPress={() => navigation.navigate('Event', { id: event.id })} />
            ))
          ) : (
            <Text style={styles.helper}>Sem partidas próximas dos favoritos.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gerir favoritos</Text>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Esportes</Text>
          {mockSports.slice(0, 6).map((sport) => {
            const active = favoriteSports.includes(sport.id);
            return (
              <TouchableOpacity
                key={sport.id}
                style={[styles.rowItem, active && styles.rowItemActive]}
                onPress={() => toggleSport(sport.id)}
              >
                <Text style={styles.rowText}>
                  {sport.icon} {sport.name}
                </Text>
                <Text style={styles.rowAction}>{active ? 'Seguindo' : 'Seguir'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.panel, { marginTop: 12 }]}>
          <Text style={styles.panelTitle}>Ligas</Text>
          {mockLeagues.filter((league) => league.isFeatured).map((league) => {
            const active = favoriteLeagues.includes(league.id);
            return (
              <TouchableOpacity
                key={league.id}
                style={[styles.rowItem, active && styles.rowItemActive]}
                onPress={() => toggleLeague(league.id)}
              >
                <Text style={styles.rowText}>{league.name}</Text>
                <Text style={styles.rowAction}>{active ? 'Seguindo' : 'Seguir'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.primaryOutline} onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}>
        <Text style={styles.primaryOutlineText}>Explorar mais eventos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#fafafa' },
  subtitle: { fontSize: 13, color: '#737373', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fafafa', marginBottom: 10 },
  stack: { gap: 12 },
  helper: { color: '#737373', fontSize: 13 },
  panel: {
    backgroundColor: '#171717',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    overflow: 'hidden',
  },
  panelTitle: {
    color: '#737373',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.35)',
  },
  rowItemActive: { backgroundColor: 'rgba(34, 197, 94, 0.08)' },
  rowText: { color: '#fafafa', fontSize: 14, flex: 1 },
  rowAction: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  primaryOutline: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryOutlineText: { color: '#22c55e', fontSize: 14, fontWeight: '700' },
});
