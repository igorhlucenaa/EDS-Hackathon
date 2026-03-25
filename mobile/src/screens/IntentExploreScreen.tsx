import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLiveEvents, mockUpcomingEvents } from '@shared';
import { EventCard } from '../components/EventCard';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const intents = [
  {
    id: 'live',
    title: 'Entrar em jogos ao vivo',
    description: 'Partidas acontecendo agora com leitura rapida de placar e mercado.',
    route: { screen: 'Live' } as const,
  },
  {
    id: 'soon',
    title: 'Montar apostas para os proximos jogos',
    description: 'Eventos pre-match organizados para decidir com calma.',
    route: { screen: 'Explore' } as const,
  },
  {
    id: 'favorites',
    title: 'Voltar para meus favoritos',
    description: 'Feed filtrado pelos times, ligas e esportes seguidos.',
    stackRoute: 'Favorites' as const,
  },
  {
    id: 'markets',
    title: 'Comparar mercados',
    description: 'Ir direto para o explorer de mercados.',
    stackRoute: 'MarketExplorer' as const,
  },
];

export function IntentExploreScreen() {
  const navigation = useNavigation<Nav>();

  const highOddsEvents = useMemo(
    () =>
      mockUpcomingEvents.filter((event) =>
        event.markets.some((market) =>
          market.outcomes.some((outcome) => outcome.odds >= 2.2)
        )
      ).slice(0, 3),
    []
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Explorar por intencao</Text>
        <Text style={styles.subtitle}>
          Escolha o que voce quer fazer e o app leva voce para o fluxo certo.
        </Text>
      </View>

      <View style={styles.stack}>
        {intents.map((intent) => (
          <TouchableOpacity
            key={intent.id}
            style={styles.intentCard}
            onPress={() => {
              if (intent.route) {
                navigation.navigate('MainTabs', intent.route);
                return;
              }

              navigation.navigate(intent.stackRoute);
            }}
          >
            <Text style={styles.intentTitle}>{intent.title}</Text>
            <Text style={styles.intentDescription}>{intent.description}</Text>
            <Text style={styles.intentAction}>Abrir</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jogos quentes agora</Text>
        <View style={styles.stack}>
          {mockLiveEvents.slice(0, 3).map((event) => (
            <LiveSnapshotCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('Event', { id: event.id })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Odds mais agressivas</Text>
        <View style={styles.stack}>
          {highOddsEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('Event', { id: event.id })}
            />
          ))}
        </View>
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
  stack: { gap: 12 },
  section: { marginTop: 20 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  intentCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  intentTitle: { color: '#fafafa', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  intentDescription: { color: '#a3a3a3', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  intentAction: { color: '#22c55e', fontSize: 12, fontWeight: '700' },
});
