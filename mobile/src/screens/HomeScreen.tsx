import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SportEvent } from '@shared';
import {
  mockSports,
  mockLiveEvents,
  mockUpcomingEvents,
  mockPromotions,
  mockBets,
  pickHeroLiveEvent,
} from '@shared';
import { useUserStore } from '../stores/userStore';
import { useVisitStore } from '../stores/visitStore';
import { EventCard } from '../components/EventCard';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import { useBetslipStore } from '../stores/betslipStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_CHIPS: { emoji: string; label: string; screen: keyof RootStackParamList }[] = [
  { emoji: '⚡', label: 'Odds altas', screen: 'IntentExplore' },
  { emoji: '🔥', label: 'Ao vivo', screen: 'Live' },
  { emoji: '⏰', label: 'Começando', screen: 'Explore' },
  { emoji: '🎯', label: 'Mercados', screen: 'MarketExplorer' },
  { emoji: '⭐', label: 'Favoritos', screen: 'Favorites' },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const isPro = useUserStore((s) => s.experienceMode === 'pro');
  const welcomeDismissed = useVisitStore((s) => s.homeWelcomeDismissed);

  const heroEvent = pickHeroLiveEvent(mockLiveEvents);
  const liveGridEvents = mockLiveEvents.filter(
    (e) => !heroEvent || e.id !== heroEvent.id
  ).slice(0, 3);
  const openBets = mockBets.filter((b) => b.status === 'open' || b.status === 'live');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {!welcomeDismissed && (
        <TouchableOpacity
          style={styles.welcomeBanner}
          onPress={() => useVisitStore.getState().dismissHomeWelcome()}
        >
          <Text style={styles.welcomeTitle}>Bem-vindo ao SwiftBet</Text>
          <Text style={styles.welcomeSub}>Apostas esportivas com inteligência. Toque para continuar.</Text>
        </TouchableOpacity>
      )}

      {heroEvent && (
        <HeroFeaturedCard
          event={heroEvent}
          onPress={() => navigation.navigate('Event', { id: heroEvent.id })}
        />
      )}

      <SectionHeader
        title="Apostas rápidas"
        description="Atalhos por objetivo."
        actionLabel="Por intenção"
        onAction={() => navigation.navigate('IntentExplore')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {QUICK_CHIPS.map((item) => (
          <TouchableOpacity
            key={item.screen + item.label}
            style={styles.chip}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
            <Text style={styles.chipLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader title="Esportes" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
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

      {openBets.length > 0 && (
        <>
          <SectionHeader
            title="Suas apostas abertas"
            actionLabel="Ver todas"
            onAction={() => navigation.navigate('MainTabs', { screen: 'Bets' })}
          />
          {openBets.slice(0, 2).map((bet) => (
            <View key={bet.id} style={styles.betCard}>
              <View style={styles.betHeader}>
                <View
                  style={[
                    styles.betStatus,
                    bet.status === 'live' ? styles.betLive : styles.betOpen,
                  ]}
                >
                  <Text style={styles.betStatusText}>
                    {bet.status === 'live' ? 'Ao vivo' : 'Aberta'}
                  </Text>
                </View>
                <Text style={styles.betType}>
                  {bet.betType === 'accumulator' ? 'Acumulada' : 'Simples'}
                </Text>
              </View>
              {bet.selections.map((sel) => (
                <Text key={sel.id} style={styles.betSelection}>
                  <Text style={styles.betSelectionName}>{sel.outcomeName}</Text>
                  {' — '}
                  {sel.marketName}
                </Text>
              ))}
              <View style={styles.betFooter}>
                <Text style={styles.betStake}>Stake: R${bet.stake.toFixed(2)}</Text>
                <Text style={styles.betReturn}>R${bet.potentialReturn.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      <SectionHeader
        title="Mais jogos ao vivo"
        actionLabel="Ver todos"
        onAction={() => navigation.navigate('Live')}
      />
      {liveGridEvents.length > 0 ? (
        <View style={styles.grid}>
          {liveGridEvents.map((event) => (
            <LiveSnapshotCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('Event', { id: event.id })}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>Não há outros jogos ao vivo no momento.</Text>
      )}

      <SectionHeader
        title="Começando em breve"
        actionLabel="Explorar"
        onAction={() => navigation.navigate('Explore')}
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

      <SectionHeader
        title="Promoções"
        actionLabel="Ver todas"
        onAction={() => navigation.navigate('Promotions')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {mockPromotions.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={styles.promoCard}
            onPress={() => navigation.navigate('Promotions')}
          >
            <Text style={styles.promoCategory}>{promo.category}</Text>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDesc} numberOfLines={2}>
              {promo.description}
            </Text>
            <Text style={styles.promoCta}>{promo.ctaText} →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function HeroFeaturedCard({
  event,
  onPress,
}: {
  event: SportEvent;
  onPress: () => void;
}) {
  const m = event.markets[0];
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);

  return (
    <View style={styles.heroSection}>
      <Text style={styles.heroLabel}>Destaque da home</Text>
      <TouchableOpacity style={styles.heroCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroBadge}>Jogo em destaque</Text>
          <View style={styles.heroLive}>
            <View style={styles.heroLiveDot} />
            <Text style={styles.heroLiveText}>Ao vivo</Text>
          </View>
          <Text style={styles.heroClock}>{event.status.clock}</Text>
          <Text style={styles.heroLeague}>{event.league.name}</Text>
        </View>
        <View style={styles.heroScore}>
          <View style={styles.heroTeam}>
            <Text style={styles.heroTeamName}>{event.home.shortName}</Text>
            <Text style={styles.heroTeamFull}>{event.home.name}</Text>
          </View>
          <View style={styles.heroScoreBox}>
            <Text style={styles.heroScoreText}>
              {event.status.score?.home} - {event.status.score?.away}
            </Text>
            <Text style={styles.heroPeriod}>{event.status.period}</Text>
          </View>
          <View style={styles.heroTeam}>
            <Text style={styles.heroTeamName}>{event.away.shortName}</Text>
            <Text style={styles.heroTeamFull}>{event.away.name}</Text>
          </View>
        </View>
        {m && (
          <View style={styles.heroOdds}>
            {m.outcomes.map((o) => {
              const isSel = selections.some((sel) => sel.outcomeId === o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={[styles.heroOddsBtn, isSel && styles.heroOddsSelected]}
                  onPress={() =>
                    toggleSelection({
                      id: `${event.id}-${o.id}`,
                      eventId: event.id,
                      event,
                      marketId: m.id,
                      marketName: m.name,
                      outcomeId: o.id,
                      outcomeName: o.name,
                      odds: o.odds,
                    })
                  }
                >
                  <Text style={[styles.heroOddsLabel, isSel && styles.heroOddsSelectedText]}>
                    {o.name}
                  </Text>
                  <Text style={[styles.heroOddsValue, isSel && styles.heroOddsSelectedText]}>
                    {o.odds.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
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
      {description && (
        <Text style={styles.sectionDesc}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  welcomeBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  welcomeTitle: { fontSize: 16, fontWeight: '700', color: '#22c55e', marginBottom: 4 },
  welcomeSub: { fontSize: 12, color: '#737373' },
  heroSection: { marginBottom: 20 },
  heroLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  heroHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  heroBadge: { fontSize: 12, fontWeight: '600', color: '#22c55e' },
  heroLive: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroLiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  heroLiveText: { fontSize: 12, fontWeight: '600', color: '#ef4444' },
  heroClock: { fontSize: 12, color: '#737373' },
  heroLeague: { fontSize: 12, color: '#737373', marginLeft: 'auto' },
  heroScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroTeam: { flex: 1, alignItems: 'center' },
  heroTeamName: { fontSize: 24, fontWeight: '700', color: '#fafafa' },
  heroTeamFull: { fontSize: 12, color: '#737373', marginTop: 4 },
  heroScoreBox: { paddingHorizontal: 16, alignItems: 'center' },
  heroScoreText: { fontSize: 28, fontWeight: '800', color: '#22c55e' },
  heroPeriod: { fontSize: 10, color: '#737373', marginTop: 4 },
  heroOdds: { flexDirection: 'row', gap: 8 },
  heroOddsBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(38, 38, 38, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  heroOddsSelected: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  heroOddsLabel: { fontSize: 10, color: '#737373' },
  heroOddsValue: { fontSize: 14, fontWeight: '700', color: '#fafafa' },
  heroOddsSelectedText: { color: 'rgba(255,255,255,0.9)' },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fafafa', marginBottom: 4 },
  sectionAction: { fontSize: 12, color: '#22c55e', fontWeight: '500' },
  sectionDesc: { fontSize: 12, color: '#737373' },
  chipsScroll: { marginBottom: 16, marginHorizontal: -16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  chipEmoji: { fontSize: 14 },
  chipLabel: { fontSize: 12, fontWeight: '500', color: '#a3a3a3' },
  sportChip: {
    alignItems: 'center',
    backgroundColor: '#171717',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    minWidth: 72,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  sportIcon: { fontSize: 18, marginBottom: 4 },
  sportName: { fontSize: 10, fontWeight: '500', color: '#737373' },
  liveCount: { fontSize: 9, color: '#ef4444', fontWeight: '500' },
  betCard: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  betHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  betStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  betLive: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  betOpen: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
  betStatusText: { fontSize: 10, fontWeight: '500' },
  betType: { fontSize: 12, color: '#737373' },
  betSelection: { fontSize: 12, color: '#737373', marginBottom: 4 },
  betSelectionName: { color: '#fafafa', fontWeight: '500' },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  betStake: { fontSize: 12, color: '#737373' },
  betReturn: { fontSize: 14, fontWeight: '600', color: '#22c55e' },
  grid: { gap: 12 },
  empty: { fontSize: 12, color: '#737373', marginBottom: 16 },
  promoCard: {
    width: 260,
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  promoCategory: { fontSize: 10, fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', marginBottom: 4 },
  promoTitle: { fontSize: 14, fontWeight: '700', color: '#fafafa', marginBottom: 4 },
  promoDesc: { fontSize: 12, color: '#737373', marginBottom: 8 },
  promoCta: { fontSize: 12, fontWeight: '600', color: '#22c55e' },
});
