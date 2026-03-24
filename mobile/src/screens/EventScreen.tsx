import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { mockLiveEvents, mockUpcomingEvents } from '@shared';
import { OddsCell } from '../components/OddsCell';
import { useBetslipStore } from '../stores/betslipStore';

type EventRoute = RouteProp<RootStackParamList, 'Event'>;

export function EventScreen() {
  const { params } = useRoute<EventRoute>();
  const allEvents = [...mockLiveEvents, ...mockUpcomingEvents];
  const event = allEvents.find((e) => e.id === params.id);
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Evento não encontrado</Text>
      </View>
    );
  }

  const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.league}>{event.league.name}</Text>
        {event.status.type === 'live' && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{event.status.clock}</Text>
          </View>
        )}
      </View>
      <View style={styles.teams}>
        <Text style={styles.team}>{event.home.name}</Text>
        {event.status.score && (
          <Text style={styles.score}>
            {event.status.score.home} - {event.status.score.away}
          </Text>
        )}
        <Text style={styles.team}>{event.away.name}</Text>
      </View>
      {featured && (
        <View style={styles.markets}>
          <Text style={styles.marketTitle}>{featured.name}</Text>
          <View style={styles.oddsRow}>
            {featured.outcomes.map((outcome) => {
              const isSel = selections.some((s) => s.outcomeId === outcome.id);
              return (
                <OddsCell
                  key={outcome.id}
                  outcome={outcome}
                  isSelected={isSel}
                  onSelect={() =>
                    toggleSelection({
                      id: `${event.id}-${outcome.id}`,
                      eventId: event.id,
                      event,
                      marketId: featured.id,
                      marketName: featured.name,
                      outcomeId: outcome.id,
                      outcomeName: outcome.name,
                      odds: outcome.odds,
                    })
                  }
                />
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#fafafa', fontSize: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  league: { fontSize: 14, color: '#737373' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  liveText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
  teams: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#171717',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  team: { fontSize: 18, fontWeight: '600', color: '#fafafa', marginVertical: 4 },
  score: { fontSize: 28, fontWeight: '800', color: '#22c55e', marginVertical: 8 },
  markets: { marginTop: 16 },
  marketTitle: { fontSize: 16, fontWeight: '600', color: '#fafafa', marginBottom: 12 },
  oddsRow: { flexDirection: 'row', gap: 8 },
});
