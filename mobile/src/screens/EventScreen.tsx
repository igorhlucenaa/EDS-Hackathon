import React, { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useFixtureDetail, useFixtureMarkets, useOddsPolling } from '../hooks';
import { OddsCell } from '../components/OddsCell';
import { useBetslipStore } from '../stores/betslipStore';

type EventRoute = RouteProp<RootStackParamList, 'Event'>;

export function EventScreen() {
  const { params } = useRoute<EventRoute>();
  const [activeMarketType, setActiveMarketType] = React.useState<string>('Match Result');

  // Buscar dados reais da API
  const { fixture, loading: fixtureLoading } = useFixtureDetail(params.id);
  const { markets, loading: marketsLoading } = useFixtureMarkets(params.id);
  const odds = useOddsPolling(
    params.id,
    markets.map((m) => m.id),
    5000
  );

  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);

  // Agrupar mercados por tipo
  const marketsByType = useMemo(() => {
    const grouped: Record<string, typeof markets> = {};
    markets.forEach((market) => {
      if (!grouped[market.type]) {
        grouped[market.type] = [];
      }
      grouped[market.type].push(market);
    });
    return grouped;
  }, [markets]);

  if (fixtureLoading && !fixture) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Carregando evento...</Text>
      </View>
    );
  }

  if (!fixture) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>❌ Evento não encontrado</Text>
      </View>
    );
  }

  const marketTypesAvailable = Object.keys(marketsByType);
  const activeMarkets = marketsByType[activeMarketType] || [];
  const featured = activeMarkets[0];

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.league}>⚽ {fixture.homeTeam.name}</Text>
        {fixture.status === 'live' && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
      </View>

      {/* Times e Placar */}
      <View style={styles.teams}>
        <View style={styles.teamInfo}>
          {fixture.homeTeam.logo && (
            <Text style={styles.teamLogo}>{fixture.homeTeam.logo}</Text>
          )}
          <Text style={styles.team}>{fixture.homeTeam.name}</Text>
        </View>

        {fixture.score ? (
          <Text style={styles.score}>
            {fixture.score.home} - {fixture.score.away}
          </Text>
        ) : (
          <Text style={styles.time}>{formatTime(fixture.startTime)}</Text>
        )}

        <View style={styles.teamInfo}>
          <Text style={styles.team}>{fixture.awayTeam.name}</Text>
          {fixture.awayTeam.logo && (
            <Text style={styles.teamLogo}>{fixture.awayTeam.logo}</Text>
          )}
        </View>
      </View>

      {/* Tabs de Mercados */}
      {marketTypesAvailable.length > 0 && (
        <View style={styles.marketTabs}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScroll}
          >
            {marketTypesAvailable.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.tab,
                  activeMarketType === type && styles.tabActive,
                ]}
                onPress={() => setActiveMarketType(type)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeMarketType === type && styles.tabTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Mercados */}
      {featured && marketsLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#00ff00" />
        </View>
      ) : (
        <View style={styles.markets}>
          {activeMarkets.map((market) => (
            <View key={market.id} style={styles.marketSection}>
              <View style={styles.marketHeader}>
                <Text style={styles.marketTitle}>{market.type}</Text>
                {odds.lastUpdate && (
                  <Text style={styles.updateTime}>
                    🔄 {new Date(odds.lastUpdate).toLocaleTimeString('pt-BR')}
                  </Text>
                )}
              </View>
              <View style={styles.oddsRow}>
                {market.outcomes.map((outcome) => {
                  const isSel = selections.some((s) => s.outcomeId === outcome.id);
                  const currentOdds =
                    odds.odds[market.id] && odds.odds[market.id][outcome.id]
                      ? parseFloat(odds.odds[market.id][outcome.id]).toFixed(2)
                      : outcome.odds;

                  return (
                    <OddsCell
                      key={outcome.id}
                      outcome={{ ...outcome, odds: currentOdds }}
                      isSelected={isSel}
                      onSelect={() =>
                        toggleSelection({
                          id: `${fixture.id}-${outcome.id}`,
                          eventId: fixture.id,
                          event: fixture,
                          marketId: market.id,
                          marketName: market.type,
                          outcomeId: outcome.id,
                          outcomeName: outcome.name,
                          odds: parseFloat(String(currentOdds)),
                        })
                      }
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Estatísticas (se disponível) */}
      {fixture.statistics && (
        <View style={styles.statistics}>
          <Text style={styles.statsTitle}>📊 Estatísticas</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Posse de Bola</Text>
            <Text style={styles.statValue}>
              {fixture.statistics.possession.home}% - {fixture.statistics.possession.away}%
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Chutes</Text>
            <Text style={styles.statValue}>
              {fixture.statistics.shots.home} - {fixture.statistics.shots.away}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Chutes no Alvo</Text>
            <Text style={styles.statValue}>
              {fixture.statistics.shotsOnTarget.home} - {fixture.statistics.shotsOnTarget.away}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  error: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#00ff00',
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    marginBottom: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  league: {
    fontSize: 16,
    color: '#888',
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teams: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  team: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  teamInfo: {
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    fontSize: 32,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ff00',
    marginHorizontal: 16,
    minWidth: 60,
    textAlign: 'center',
  },
  time: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 16,
  },
  marketTabs: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tabScroll: {
    paddingHorizontal: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#00ff00',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
  },
  tabTextActive: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
  markets: {
    marginBottom: 32,
    gap: 16,
  },
  marketSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff00',
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  marketTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff00',
  },
  updateTime: {
    fontSize: 11,
    color: '#666',
  },
  oddsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statistics: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff00',
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});
