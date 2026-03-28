import React, { useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  mockSports,
  mockLiveEvents,
  mockUpcomingEvents,
  mockPromotions,
  mockBets,
} from '@shared';
import { useVisitStore } from '../stores/visitStore';
import { useMissionStore } from '../stores/missionStore';
import { useMissionSummary, useMissionTracking } from '../hooks/useMissions';
import { useHomeContext } from '../hooks/useHomeContext';
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

  // Compute home context for dynamic hero
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

      {/* 6. Ao Vivo Agora */}
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
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fafafa',
  },
  sectionAction: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: '600',
  },
  grid: {
    gap: 12,
  },
  empty: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sportsScroll: {
    paddingRight: 16,
    gap: 10,
  },
  sportChip: {
    alignItems: 'center',
    backgroundColor: '#171717',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginRight: 10,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  sportIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  sportName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a3a3a3',
  },
  liveCount: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '500',
    marginTop: 2,
  },
  promoScroll: {
    paddingRight: 16,
    gap: 12,
  },
  promoCard: {
    width: 270,
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  promoCardWelcome: {
    borderColor: 'rgba(168, 85, 247, 0.4)',
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  promoCardLive: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promoBadge: {
    fontSize: 11,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 6,
  },
  promoDesc: {
    fontSize: 13,
    color: '#a3a3a3',
    marginBottom: 12,
    lineHeight: 18,
  },
  promoCta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22c55e',
  },
  bottomSpacing: {
    height: 40,
  },
});
