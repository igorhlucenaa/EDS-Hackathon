import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { UserBet, SportEvent } from '@shared';

interface ContinueSectionProps {
  openBets: UserBet[];
  recentEvents: SportEvent[];
  onBetPress: (betId: string) => void;
  onEventPress: (eventId: string) => void;
}

export function ContinueSection({
  openBets,
  recentEvents,
  onBetPress,
  onEventPress,
}: ContinueSectionProps) {
  const hasContent = openBets.length > 0 || recentEvents.length > 0;
  
  if (!hasContent) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Continue de onde parou</Text>
      </View>

      {openBets.length > 0 && (
        <View style={styles.betsContainer}>
          {openBets.slice(0, 2).map((bet) => (
            <TouchableOpacity
              key={bet.id}
              style={[styles.betCard, bet.status === 'live' && styles.betCardLive]}
              onPress={() => onBetPress(bet.id)}
              activeOpacity={0.8}
            >
              <View style={styles.betHeader}>
                <View style={[styles.betStatus, bet.status === 'live' ? styles.statusLive : styles.statusOpen]}>
                  <Text style={styles.betStatusText}>
                    {bet.status === 'live' ? '● Ao vivo' : '○ Aberta'}
                  </Text>
                </View>
                <Text style={styles.betType}>
                  {bet.betType === 'accumulator' ? 'Múltipla' : 'Simples'}
                </Text>
              </View>
              
              <Text style={styles.betSelection} numberOfLines={1}>
                {bet.selections[0]?.outcomeName}
                {bet.selections.length > 1 && ` +${bet.selections.length - 1}`}
              </Text>
              
              <View style={styles.betFooter}>
                <Text style={styles.betStake}>R$ {bet.stake.toFixed(0)}</Text>
                <Text style={styles.betReturn}>Ganho: R$ {bet.potentialReturn.toFixed(0)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {recentEvents.length > 0 && openBets.length === 0 && (
        <View style={styles.eventsContainer}>
          {recentEvents.slice(0, 2).map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => onEventPress(event.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.eventTeams}>
                {event.home.shortName} vs {event.away.shortName}
              </Text>
              <Text style={styles.eventLeague}>{event.league.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  betsContainer: {
    gap: 10,
  },
  betCard: {
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  betCardLive: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  betStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusLive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusOpen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  betStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fafafa',
  },
  betType: {
    fontSize: 11,
    color: '#737373',
    fontWeight: '500',
  },
  betSelection: {
    fontSize: 14,
    color: '#fafafa',
    fontWeight: '600',
    marginBottom: 10,
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  betStake: {
    fontSize: 12,
    color: '#737373',
  },
  betReturn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e',
  },
  eventsContainer: {
    gap: 10,
  },
  eventCard: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  eventTeams: {
    fontSize: 14,
    color: '#fafafa',
    fontWeight: '600',
    marginBottom: 4,
  },
  eventLeague: {
    fontSize: 12,
    color: '#737373',
  },
});
