import { useMemo } from 'react';
import type { SportEvent, UserBet, Mission } from '@shared';

export type HeroType = 
  | 'open_bet'
  | 'mission_almost'
  | 'favorite_event'
  | 'promo_welcome'
  | 'live_event'
  | null;

export interface HomeContextState {
  heroType: HeroType;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroData: 
    | { type: 'bet'; bet: UserBet }
    | { type: 'mission'; mission: Mission }
    | { type: 'event'; event: SportEvent }
    | { type: 'promo'; title: string; description: string }
    | null;
  hasOpenBets: boolean;
  hasAlmostCompletedMission: boolean;
  hasFavoriteEventStarting: boolean;
  recentEventIds: string[];
}

interface UseHomeContextProps {
  openBets: UserBet[];
  dailyMissions: Mission[];
  recentEventIds: string[];
  liveEvents: SportEvent[];
  upcomingEvents: SportEvent[];
  isFirstVisit: boolean;
  currentLevel: number;
}

export function useHomeContext({
  openBets,
  dailyMissions,
  recentEventIds,
  liveEvents,
  upcomingEvents,
  isFirstVisit,
  currentLevel,
}: UseHomeContextProps): HomeContextState {
  return useMemo(() => {
    // Priority 1: Open bet being live (highest priority for retention)
    const liveBet = openBets.find((b) => b.status === 'live');
    if (liveBet) {
      return {
        heroType: 'open_bet',
        heroTitle: 'Sua aposta está ao vivo!',
        heroSubtitle: `${liveBet.selections[0]?.outcomeName || 'Sua seleção'} está em jogo`,
        heroCta: 'Acompanhar agora',
        heroData: { type: 'bet', bet: liveBet },
        hasOpenBets: true,
        hasAlmostCompletedMission: false,
        hasFavoriteEventStarting: false,
        recentEventIds,
      };
    }

    // Priority 2: Mission almost completed (engagement)
    const almostMission = dailyMissions.find(
      (m) => m.status === 'in_progress' && m.progress >= 60 && m.progress < 100
    );
    if (almostMission) {
      return {
        heroType: 'mission_almost',
        heroTitle: 'Missão quase completa!',
        heroSubtitle: `Falta pouco: ${almostMission.title}`,
        heroCta: 'Completar missão',
        heroData: { type: 'mission', mission: almostMission },
        hasOpenBets: openBets.length > 0,
        hasAlmostCompletedMission: true,
        hasFavoriteEventStarting: false,
        recentEventIds,
      };
    }

    // Priority 3: Promo for new users (acquisition)
    if (isFirstVisit || currentLevel <= 2) {
      return {
        heroType: 'promo_welcome',
        heroTitle: 'Bônus de Boas-Vindas',
        heroSubtitle: 'Ganhe até R$500 no seu primeiro depósito',
        heroCta: 'Aproveitar agora',
        heroData: { 
          type: 'promo', 
          title: 'Bônus de Boas-Vindas', 
          description: '100% até R$500 no primeiro depósito' 
        },
        hasOpenBets: openBets.length > 0,
        hasAlmostCompletedMission: false,
        hasFavoriteEventStarting: false,
        recentEventIds,
      };
    }

    // Priority 4: Event starting soon (discovery)
    const eventStarting = upcomingEvents[0];
    if (eventStarting) {
      return {
        heroType: 'favorite_event',
        heroTitle: 'Jogo começando em breve',
        heroSubtitle: `${eventStarting.home.name} vs ${eventStarting.away.name}`,
        heroCta: 'Ver pré-jogo',
        heroData: { type: 'event', event: eventStarting },
        hasOpenBets: openBets.length > 0,
        hasAlmostCompletedMission: false,
        hasFavoriteEventStarting: true,
        recentEventIds,
      };
    }

    // Priority 5: Best live event (default)
    const bestLive = liveEvents[0];
    if (bestLive) {
      return {
        heroType: 'live_event',
        heroTitle: 'Destaque ao vivo',
        heroSubtitle: `${bestLive.home.name} vs ${bestLive.away.name}`,
        heroCta: 'Apostar agora',
        heroData: { type: 'event', event: bestLive },
        hasOpenBets: openBets.length > 0,
        hasAlmostCompletedMission: false,
        hasFavoriteEventStarting: false,
        recentEventIds,
      };
    }

    // No hero
    return {
      heroType: null,
      heroTitle: '',
      heroSubtitle: '',
      heroCta: '',
      heroData: null,
      hasOpenBets: openBets.length > 0,
      hasAlmostCompletedMission: false,
      hasFavoriteEventStarting: false,
      recentEventIds,
    };
  }, [openBets, dailyMissions, recentEventIds, liveEvents, upcomingEvents, isFirstVisit, currentLevel]);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function getContextualSubtitle(context: HomeContextState): string {
  if (context.hasOpenBets) {
    return 'Você tem apostas em andamento';
  }
  if (context.hasAlmostCompletedMission) {
    return 'Complete sua missão do dia';
  }
  if (context.hasFavoriteEventStarting) {
    return 'Seu time joga em breve';
  }
  return 'Pronto para apostar?';
}
