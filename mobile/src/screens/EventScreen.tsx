import React, { useMemo, useCallback, useEffect } from 'react';
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
import { GuidedBetCard, GuidedBetBuilderSheet } from '../components/guided-bets';
import { useGuidedBetRecommendations, useAddGuidedBetToSlip } from '../hooks/useGuidedBets';
import { useFixtureDetail, useFixtureMarkets, useOddsPolling } from '../hooks';
import { useMissionTracking } from '../hooks/useMissions';
import { OddsCell } from '../components/OddsCell';
import { useBetslipStore } from '../stores/betslipStore';
import { brandColors, semanticColors, spacing, typography, radius } from '../theme';

type EventRoute = RouteProp<RootStackParamList, 'Event'>;

export function EventScreen() {
  const { params } = useRoute<EventRoute>();
  const [activeMarketType, setActiveMarketType] = React.useState<string>('Match Result');
  const { trackViewMatch } = useMissionTracking();

  useEffect(() => {
    trackViewMatch(params.id);
  }, [params.id, trackViewMatch]);

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
  const setBetslipOpen = useBetslipStore((s) => s.setOpen);

  // Guided Bets integration
  const { 
    suggestions: guidedSuggestions, 
    isLoading: guidedLoading 
  } = useGuidedBetRecommendations(params.id);
  const { addToSlip } = useAddGuidedBetToSlip();
  const [builderVisible, setBuilderVisible] = React.useState(false);

  const handleAddGuidedBetToSlip = React.useCallback((suggestion: any) => {
    addToSlip(suggestion);
    setBetslipOpen(true);
  }, [addToSlip, setBetslipOpen]);

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

      {/* Apostas Prontas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Apostas prontas para este jogo</Text>
        <TouchableOpacity onPress={() => setBuilderVisible(true)}>
          <Text style={styles.builderLink}>Montar com ajuda →</Text>
        </TouchableOpacity>
      </View>
      
      {guidedLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#22c55e" />
        </View>
      ) : guidedSuggestions.length > 0 ? (
        <View style={styles.guidedBetsContainer}>
          {guidedSuggestions.slice(0, 2).map((suggestion) => (
            <GuidedBetCard
              key={suggestion.id}
              suggestion={suggestion}
              onAddToSlip={() => handleAddGuidedBetToSlip(suggestion)}
            />
          ))}
        </View>
      ) : null}

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
                  const rawOdds = odds.odds[market.id]?.[outcome.id];
                  const numericOdds: number = rawOdds ? parseFloat(String(rawOdds)) : (typeof outcome.odds === 'string' ? parseFloat(outcome.odds) : outcome.odds);
                  const currentOdds = numericOdds.toFixed(2);

                  return (
                    <OddsCell
                      key={outcome.id}
                      outcome={{ ...outcome, odds: numericOdds }}
                      isSelected={isSel}
                      onSelect={() =>
                        toggleSelection({
                          id: `${fixture.id}-${outcome.id}`,
                          eventId: String(fixture.id),
                          event: fixture as any,
                          marketId: market.id,
                          marketName: market.type,
                          outcomeId: outcome.id,
                          outcomeName: outcome.name,
                          odds: numericOdds,
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

      {/* Guided Bet Builder Modal */}
      <GuidedBetBuilderSheet
        eventId={params.id}
        visible={builderVisible}
        onClose={() => setBuilderVisible(false)}
        eventName={`${fixture.homeTeam?.name || 'Time Casa'} vs ${fixture.awayTeam?.name || 'Time Fora'}`}
      />
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
    paddingVertical: spacing[10],
  },
  error: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#00ff00',
    marginTop: spacing[3],
    fontSize: typography.fontSize.sm,
  },
  header: {
    marginBottom: spacing[4],
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  league: {
    fontSize: typography.fontSize.base,
    color: semanticColors.text.secondary,
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${semanticColors.state.error}20`,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: semanticColors.state.error,
    marginRight: spacing[2],
  },
  liveText: {
    color: semanticColors.state.error,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.sans,
  },
  teams: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing[6],
    paddingVertical: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.subtle,
  },
  team: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: semanticColors.text.primary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  teamInfo: {
    alignItems: 'center',
    gap: spacing[2],
  },
  teamLogo: {
    fontSize: 32,
  },
  score: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: brandColors.green[400],
    marginHorizontal: spacing[4],
    minWidth: 60,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  time: {
    fontSize: typography.fontSize.sm,
    color: semanticColors.text.tertiary,
    marginHorizontal: spacing[4],
    fontFamily: typography.fontFamily.sans,
  },
  marketTabs: {
    marginBottom: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.subtle,
  },
  tabScroll: {
    paddingHorizontal: spacing[2],
    gap: spacing[2],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: brandColors.green[400],
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: semanticColors.text.secondary,
    fontFamily: typography.fontFamily.sans,
  },
  tabTextActive: {
    color: brandColors.green[400],
    fontWeight: typography.fontWeight.bold,
  },
  markets: {
    marginBottom: spacing[6],
    gap: spacing[4],
  },
  marketSection: {
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: semanticColors.border.subtle,
    marginBottom: spacing[4],
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  marketTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.primary,
    fontFamily: typography.fontFamily.sans,
  },
  updateTime: {
    fontSize: typography.fontSize.xs,
    color: semanticColors.text.tertiary,
    fontFamily: typography.fontFamily.sans,
  },
  oddsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.primary,
    fontFamily: typography.fontFamily.sans,
  },
  builderLink: {
    fontSize: typography.fontSize.sm,
    color: brandColors.green[400],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.sans,
  },
  guidedBetsContainer: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  statistics: {
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginTop: spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: brandColors.green[400],
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
