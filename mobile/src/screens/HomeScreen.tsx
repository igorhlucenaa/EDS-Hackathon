import React, { useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  mockSports,
  mockLiveEvents,
  mockUpcomingEvents,
  mockPromotions,
  mockBets,
} from '@shared';
import { semanticColors, brandColors, spacing, typography, radius } from '../theme';
import { useVisitStore } from '../stores/visitStore';
import { useMissionStore } from '../stores/missionStore';
import { useMissionSummary, useMissionTracking } from '../hooks/useMissions';
import { useHomeContext } from '../hooks/useHomeContext';
import { GuidedBetCard, GuidedBetBuilderSheet } from '../components/guided-bets';
import { useGuidedBetRecommendations, useAddGuidedBetToSlip } from '../hooks/useGuidedBets';
import { useState, useCallback } from 'react';
import { EventCard } from '../components/EventCard';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import {
  HomeHeader,
  HeroCard,
  ContinueSection,
  IntentChips,
  MissionActionCard,
} from '../components/home';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { recentEventIds } = useVisitStore();
  const { dailyMissions, level } = useMissionStore();
  const { summary, loading: summaryLoading } = useMissionSummary();
  const { trackAppOpen } = useMissionTracking();

  useEffect(() => {
    trackAppOpen();
  }, []);

  // Filter open bets
  const openBets = useMemo(
    () => mockBets.filter((b) => b.status === 'open' || b.status === 'live'),
    []
  );

  // Get recent events based on visit history
  const recentEvents = useMemo(() => {
    return recentEventIds
      .map((id) => mockLiveEvents.find((e) => e.id === id) || mockUpcomingEvents.find((e) => e.id === id))
      .filter(Boolean)
      .slice(0, 2);
  }, [recentEventIds]);

  // Determine if first visit (mocked logic)
  const isFirstVisit = recentEventIds.length === 0;

  const { addToSlip } = useAddGuidedBetToSlip();
  const [builderVisible, setBuilderVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Get guided bet recommendations for first upcoming event
  const featuredEventId = mockUpcomingEvents[0]?.id || null;
  const { 
    suggestions: guidedSuggestions, 
    isLoading: guidedLoading 
  } = useGuidedBetRecommendations(featuredEventId);

  const handleOpenBuilder = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setBuilderVisible(true);
  }, []);

  const handleAddGuidedBetToSlip = useCallback((suggestion: any) => {
    addToSlip(suggestion);
    // Open betslip
    const { useBetslipStore } = require('../stores/betslipStore');
    useBetslipStore.getState().setOpen(true);
  }, [addToSlip]);
  const homeContext = useHomeContext({
    openBets,
    dailyMissions,
    recentEventIds,
    liveEvents: mockLiveEvents,
    upcomingEvents: mockUpcomingEvents,
    isFirstVisit,
    currentLevel: level,
  });

  // Handle hero CTA press
  const handleHeroPress = () => {
    if (!homeContext.heroData) return;

    switch (homeContext.heroData.type) {
      case 'bet':
        navigation.navigate('MainTabs', { screen: 'Bets' });
        break;
      case 'mission':
        navigation.navigate('Missions');
        break;
      case 'event':
        navigation.navigate('Event', { id: homeContext.heroData.event.id });
        break;
      case 'promo':
        navigation.navigate('Promotions');
        break;
    }
  };

  // Handle intent chip navigation
  const handleIntentNavigate = (target: 'tab' | 'stack', screen: string) => {
    if (target === 'tab') {
      navigation.navigate('MainTabs', { screen: screen as keyof MainTabParamList });
    } else {
      navigation.navigate(screen as keyof RootStackParamList);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Contextual */}
      <HomeHeader
        context={homeContext}
        onMissionPress={() => navigation.navigate('Missions')}
      />

      {/* 2. Hero Dinâmico Principal */}
      <HeroCard context={homeContext} onPress={handleHeroPress} />

      {/* 3. Bloco de Missão/Progressão */}
      <MissionActionCard
        summary={summary}
        loading={summaryLoading}
        onPress={() => navigation.navigate('Missions')}
      />

      {/* 4. Continue de onde parou */}
      <ContinueSection
        openBets={openBets}
        recentEvents={recentEvents as any[]}
        onBetPress={() => navigation.navigate('MainTabs', { screen: 'Bets' })}
        onEventPress={(eventId) => navigation.navigate('Event', { id: eventId })}
      />

      {/* 5. Atalhos por Intenção */}
      <IntentChips onNavigate={handleIntentNavigate} />

      {/* 6. Apostas Prontas para Você */}
      <SectionHeader
        title="Apostas prontas para você"
        actionLabel="Ver todas"
        onAction={() => navigation.navigate('MainTabs', { screen: 'Explore' })}
      />
      {guidedLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#22c55e" />
        </View>
      ) : guidedSuggestions.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.guidedBetsScroll}
        >
          {guidedSuggestions.slice(0, 3).map((suggestion) => (
            <GuidedBetCard
              key={suggestion.id}
              suggestion={suggestion}
              compact
              onPress={() => navigation.navigate('Event', { id: suggestion.eventId })}
              onAddToSlip={() => handleAddGuidedBetToSlip(suggestion)}
            />
          ))}
          <TouchableOpacity
            style={styles.builderCard}
            onPress={() => handleOpenBuilder(featuredEventId || mockUpcomingEvents[0]?.id || '')}
          >
            <Text style={styles.builderIcon}>🎯</Text>
            <Text style={styles.builderTitle}>Montar com ajuda</Text>
            <Text style={styles.builderDesc}>Responda perguntas rápidas</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <Text style={styles.empty}>Nenhuma sugestão disponível no momento.</Text>
      )}

      {/* 7. Ao Vivo Agora */}
      <SectionHeader
        title="Ao vivo agora"
        actionLabel="Ver todos"
        onAction={() => navigation.navigate('MainTabs', { screen: 'Live' })}
      />
      {mockLiveEvents.length > 0 ? (
        <View style={styles.grid}>
          {mockLiveEvents.slice(0, 3).map((event) => (
            <LiveSnapshotCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('Event', { id: event.id })}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>Nenhum jogo ao vivo no momento.</Text>
      )}

      {/* 7. Começando em Breve */}
      <SectionHeader
        title="Começando em breve"
        actionLabel="Explorar"
        onAction={() => navigation.navigate('MainTabs', { screen: 'Explore' })}
      />
      <View style={styles.grid}>
        {mockUpcomingEvents.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate('Event', { id: event.id })}
          />
        ))}
      </View>

      {/* 8. Esportes */}
      <SectionHeader title="Esportes" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sportsScroll}
      >
        {mockSports.slice(0, 6).map((sport) => (
          <TouchableOpacity
            key={sport.id}
            style={styles.sportChip}
            onPress={() => navigation.navigate('Sport', { sportId: sport.id })}
          >
            <Text style={styles.sportIcon}>{sport.icon}</Text>
            <Text style={styles.sportName}>{sport.name}</Text>
            {sport.liveCount > 0 && (
              <Text style={styles.liveCount}>{sport.liveCount} ao vivo</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 9. Promoções Contextuais */}
      <SectionHeader
        title="Ofertas para você"
        actionLabel="Ver todas"
        onAction={() => navigation.navigate('Promotions')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promoScroll}
      >
        {mockPromotions.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={[
              styles.promoCard,
              promo.category === 'welcome' && styles.promoCardWelcome,
              promo.category === 'live' && styles.promoCardLive,
            ]}
            onPress={() => navigation.navigate('Promotions')}
          >
            <View style={styles.promoHeader}>
              <Text style={styles.promoCategory}>{getPromoLabel(promo.category)}</Text>
              {promo.category === 'welcome' && <Text style={styles.promoBadge}>🔥 Hot</Text>}
            </View>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDesc} numberOfLines={2}>
              {promo.description}
            </Text>
            <Text style={styles.promoCta}>{promo.ctaText} →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />

      {/* Guided Bet Builder Modal */}
      <GuidedBetBuilderSheet
        eventId={selectedEventId || ''}
        visible={builderVisible}
        onClose={() => setBuilderVisible(false)}
        eventName={mockUpcomingEvents.find(e => e.id === selectedEventId)?.home?.name + ' vs ' + mockUpcomingEvents.find(e => e.id === selectedEventId)?.away?.name}
      />
    </ScrollView>
  );
}

// Helper function for promo labels
function getPromoLabel(category: string): string {
  const labels: Record<string, string> = {
    welcome: 'Boas-vindas',
    live: 'Ao vivo',
    cashback: 'Cashback',
    bonus: 'Bônus',
  };
  return labels[category] || category;
}

// Section Header Component
function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{actionLabel} →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.background.primary,
  },
  scrollContent: {
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.primary,
    fontFamily: typography.fontFamily.sans,
  },
  sectionAction: {
    fontSize: typography.fontSize.sm,
    color: brandColors.blue[400],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.sans,
  },
  // Sports
  sportsScroll: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  sportItem: {
    alignItems: 'center',
    marginRight: spacing[5],
    paddingVertical: spacing[2],
  },
  sportIcon: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  sportName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: semanticColors.text.tertiary,
    fontFamily: typography.fontFamily.sans,
  },
  sportNameActive: {
    color: brandColors.green[400],
    fontWeight: typography.fontWeight.bold,
  },
  liveCount: {
    fontSize: typography.fontSize.xs,
    color: semanticColors.state.live,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.sans,
    marginTop: spacing[1],
  },
  // Events
  eventsScroll: {
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
    gap: spacing[3],
  },
  // Promos
  promoScroll: {
    paddingRight: spacing[4],
    gap: spacing[3],
  },
  promoCard: {
    width: 280,
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius.xl,
    padding: spacing[5],
    marginRight: spacing[3],
    borderWidth: 1,
    borderColor: semanticColors.border.subtle,
  },
  promoCardWelcome: {
    borderColor: `${brandColors.blue[500]}40`,
    backgroundColor: `${brandColors.blue[500]}10`,
  },
  promoCardLive: {
    borderColor: `${semanticColors.state.live}40`,
    backgroundColor: `${semanticColors.state.live}10`,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  promoCategory: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: brandColors.green[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.sans,
  },
  promoBadge: {
    fontSize: typography.fontSize.xs,
  },
  promoTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.primary,
    marginBottom: spacing[2],
    fontFamily: typography.fontFamily.sans,
  },
  promoDesc: {
    fontSize: typography.fontSize.sm,
    color: semanticColors.text.tertiary,
    marginBottom: spacing[4],
    lineHeight: 20,
    fontFamily: typography.fontFamily.sans,
  },
  promoCta: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: brandColors.green[400],
    fontFamily: typography.fontFamily.sans,
  },
  // Guided bets
  guidedBetsScroll: {
    paddingRight: spacing[4],
    gap: spacing[3],
  },
  builderCard: {
    width: 160,
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius.xl,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: `${brandColors.green[400]}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  builderIcon: {
    fontSize: 32,
    marginBottom: spacing[3],
  },
  builderTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticColors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  builderDesc: {
    fontSize: typography.fontSize.xs,
    color: semanticColors.text.tertiary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  // Misc
  bottomSpacing: {
    height: spacing[10],
  },
  loadingContainer: {
    padding: spacing[6],
    alignItems: 'center',
  },
});
