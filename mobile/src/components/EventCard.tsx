import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { SportEvent } from '@shared';
import { timeUntil } from '@shared';
import { OddsCell } from './OddsCell';
import { useBetslipStore } from '../stores/betslipStore';

interface EventCardProps {
  event: SportEvent;
  onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];
  const isLive = event.status.type === 'live';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <Text style={styles.league} numberOfLines={1}>
          {event.league.name}
        </Text>
        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{event.status.clock}</Text>
          </View>
        ) : (
          <Text style={styles.time}>{timeUntil(event.startTime)}</Text>
        )}
      </View>

      <View style={styles.teams}>
        <View style={styles.teamRow}>
          <Text style={styles.teamName} numberOfLines={1}>
            {event.home.name}
          </Text>
          {isLive && (
            <Text style={styles.score}>{event.status.score?.home}</Text>
          )}
        </View>
        <View style={styles.teamRow}>
          <Text style={styles.teamName} numberOfLines={1}>
            {event.away.name}
          </Text>
          {isLive && (
            <Text style={styles.score}>{event.status.score?.away}</Text>
          )}
        </View>
      </View>

      {featured && (
        <View style={styles.oddsRow}>
          {featured.outcomes.map((outcome) => {
            const isSel = selections.some((sel) => sel.outcomeId === outcome.id);
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
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  league: {
    fontSize: 10,
    color: '#737373',
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ef4444',
  },
  time: {
    fontSize: 10,
    color: '#737373',
  },
  teams: {
    marginBottom: 8,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fafafa',
    flex: 1,
  },
  score: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fafafa',
  },
  oddsRow: {
    flexDirection: 'row',
    gap: 6,
  },
});
