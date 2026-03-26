import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { SportEvent } from '@shared';
import { OddsCell } from './OddsCell';
import { useBetslipStore } from '../stores/betslipStore';

interface LiveSnapshotCardProps {
  event: SportEvent;
  onPress: () => void;
}

export function LiveSnapshotCard({ event, onPress }: LiveSnapshotCardProps) {
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];
  const momentumWidth =
    event.status.momentum === 'home' ? '70%' : event.status.momentum === 'away' ? '30%' : '50%';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.liveMeta}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
          <Text style={styles.clock}>{event.status.clock}</Text>
        </View>
        <Text style={styles.league} numberOfLines={1}>
          {event.league.name}
        </Text>
      </View>

      <View style={styles.teams}>
        <View style={styles.teamRow}>
          <Text style={[styles.teamName, event.status.momentum === 'home' && styles.teamHighlight]} numberOfLines={1}>
            {event.home.shortName}
          </Text>
          <Text style={styles.score}>{event.status.score?.home ?? 0}</Text>
        </View>
        <View style={styles.teamRow}>
          <Text style={[styles.teamName, event.status.momentum === 'away' && styles.teamHighlight]} numberOfLines={1}>
            {event.away.shortName}
          </Text>
          <Text style={styles.score}>{event.status.score?.away ?? 0}</Text>
        </View>
      </View>

      <View style={styles.momentumTrack}>
        <View style={[styles.momentumFill, { width: momentumWidth }]} />
      </View>

      {featured && (
        <View style={styles.oddsRow}>
          {featured.outcomes.map((outcome) => {
            const isSelected = selections.some((selection) => selection.outcomeId === outcome.id);

            return (
              <OddsCell
                key={outcome.id}
                outcome={outcome}
                isSelected={isSelected}
                compact
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
                    previousOdds: outcome.previousOdds,
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
    marginBottom: 10,
    gap: 8,
  },
  liveMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontWeight: '700',
    color: '#ef4444',
  },
  clock: {
    fontSize: 10,
    color: '#a3a3a3',
  },
  league: {
    fontSize: 10,
    color: '#737373',
    flex: 1,
    textAlign: 'right',
  },
  teams: {
    gap: 6,
    marginBottom: 10,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    flex: 1,
  },
  teamHighlight: {
    color: '#22c55e',
  },
  score: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fafafa',
  },
  momentumTrack: {
    height: 4,
    backgroundColor: '#262626',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
  },
  momentumFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  oddsRow: {
    flexDirection: 'row',
    gap: 6,
  },
});
