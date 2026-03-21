import { mockLiveEvents, mockUpcomingEvents } from './events';
import { mockUser } from './user';
import type {
  CopilotProfileSuggestion,
  GamePressureMetrics,
  IntentTrail,
  OpportunityRadarItem,
  ResumeChangeSummary,
  UserIntentId,
} from '@/app/premium/types';
import type { SportEvent } from '@/app/data/models/types';

const ev = (id: string): SportEvent | undefined =>
  [...mockLiveEvents, ...mockUpcomingEvents].find((e) => e.id === id);

function quickFromEvent(e: SportEvent, marketIndex = 0) {
  const m = e.markets[marketIndex] ?? e.markets[0];
  return {
    marketName: m.name,
    outcomes: m.outcomes.slice(0, 3).map((o) => ({ id: o.id, name: o.name, odds: o.odds })),
  };
}

export const mockOpportunityRadar: OpportunityRadarItem[] = [
  {
    id: 'opp-1',
    kind: 'starting_soon',
    event: mockUpcomingEvents[0],
    sportLabel: 'Futebol',
    leagueLabel: mockUpcomingEvents[0].league.name,
    statusOrTime: 'Em 45 min',
    highlightReason: 'Clássico estadual com volume alto de apostas — linha pode fechar cedo.',
    urgency: 'high',
    quickMarket: quickFromEvent(mockUpcomingEvents[0]),
  },
  {
    id: 'opp-2',
    kind: 'decisive_moment',
    event: mockLiveEvents[2],
    sportLabel: 'Futebol',
    leagueLabel: mockLiveEvents[2].league.name,
    statusOrTime: `${mockLiveEvents[2].status.clock ?? ''} · ${mockLiveEvents[2].status.period ?? ''}`,
    highlightReason: 'Placar apertado no fim do jogo — mercados de próximo gol aquecidos.',
    urgency: 'critical',
    quickMarket: quickFromEvent(mockLiveEvents[2]),
  },
  {
    id: 'opp-3',
    kind: 'high_movement',
    event: mockLiveEvents[4],
    sportLabel: 'Tênis',
    leagueLabel: mockLiveEvents[4].league.name,
    statusOrTime: mockLiveEvents[4].status.clock ?? 'Ao vivo',
    highlightReason: 'Odds do favorito oscilaram 8% na última hora — liquidez alta.',
    urgency: 'medium',
    movementNote: 'Movimento acima da média',
    quickMarket: quickFromEvent(mockLiveEvents[4]),
  },
  {
    id: 'opp-4',
    kind: 'favorite_context',
    event: mockLiveEvents[0],
    sportLabel: 'Futebol',
    leagueLabel: mockLiveEvents[0].league.name,
    statusOrTime: mockLiveEvents[0].status.clock ?? 'Ao vivo',
    highlightReason: 'Flamengo em vantagem — alinhado aos seus times favoritos.',
    urgency: 'medium',
    favoriteContext: 'Time favorito em campo',
    quickMarket: quickFromEvent(mockLiveEvents[0]),
  },
  {
    id: 'opp-5',
    kind: 'profile_match',
    event: mockUpcomingEvents[1],
    sportLabel: 'Futebol',
    leagueLabel: mockUpcomingEvents[1].league.name,
    statusOrTime: 'Em 2 h',
    highlightReason: 'Champions com perfil de odds que você costuma buscar (1.8–2.4).',
    urgency: 'low',
    quickMarket: quickFromEvent(mockUpcomingEvents[1]),
  },
].filter((o) => o.event);

export const mockPressureByEventId: Record<string, GamePressureMetrics> = {
  'ev-live-1': {
    eventId: 'ev-live-1',
    intensity: 78,
    dominance: { side: 'home', value: 62 },
    pace: 72,
    phase: 'hot',
    pressureAcceleration: 15,
    recentEvents: ['Finalização perigosa (62′)', 'Escanteio + pressão alta'],
    momentSummary: 'Mandante no comando; ritmo intenso no último terço.',
  },
  'ev-live-2': {
    eventId: 'ev-live-2',
    intensity: 55,
    dominance: { side: 'away', value: 58 },
    pace: 48,
    phase: 'warming',
    pressureAcceleration: 4,
    recentEvents: ['Jogo truncado no meio', 'Transição rápida visitante'],
    momentSummary: 'Fase equilibrada; visitante cria mais nas bolas paradas.',
  },
  'ev-live-3': {
    eventId: 'ev-live-3',
    intensity: 92,
    dominance: { side: 'home', value: 55 },
    pace: 88,
    phase: 'critical',
    pressureAcceleration: 28,
    recentEvents: ['Gol recente (76′)', 'Ambos abertos ao contra-ataque'],
    momentSummary: 'Momento decisivo — ambas defesas expostas.',
  },
  'ev-live-4': {
    eventId: 'ev-live-4',
    intensity: 64,
    dominance: { side: 'away', value: 61 },
    pace: 70,
    phase: 'hot',
    pressureAcceleration: 6,
    recentEvents: ['Run de 8–0 visitante', 'Faltas acumuladas no garrafão'],
    momentSummary: 'NBA: visitante aquecido de fora da área.',
  },
  'ev-live-5': {
    eventId: 'ev-live-5',
    intensity: 71,
    dominance: { side: 'neutral', value: 50 },
    pace: 52,
    phase: 'warming',
    pressureAcceleration: 9,
    recentEvents: ['Quebra de serviço recente', 'Ritmo subindo no 2º set'],
    momentSummary: 'Sets curtos — pressão alternando entre sacadores.',
  },
};

export function getPressureForEvent(eventId: string): GamePressureMetrics | null {
  return mockPressureByEventId[eventId] ?? null;
}

const intent = (
  id: UserIntentId,
  title: string,
  subtitle: string,
  justification: string,
  eventIds: string[]
): IntentTrail => ({ intentId: id, title, subtitle, justification, eventIds });

export const mockIntentTrails: IntentTrail[] = [
  intent(
    'quick_bets',
    'Apostas rápidas',
    '1 toque, mercados principais',
    'Seleções com liquidez alta e confirmação imediata.',
    ['ev-live-1', 'ev-up-1', 'ev-live-4']
  ),
  intent(
    'high_odds',
    'Odds altas',
    'Retorno maior, risco moderado',
    'Mercados com linha acima da média para o perfil do evento.',
    ['ev-live-2', 'ev-up-2', 'ev-up-3']
  ),
  intent(
    'safer_options',
    'Mais segurança',
    'Favoritos e linhas estáveis',
    'Favorece probabilidade implícita maior e menor volatilidade.',
    ['ev-live-1', 'ev-up-1', 'ev-live-3']
  ),
  intent(
    'starting_now',
    'Começando agora',
    'Próximos minutos',
    'Jogos que entram em campo em instantes — não perca o fechamento.',
    ['ev-up-1', 'ev-up-2', 'ev-up-4']
  ),
  intent(
    'follow_live',
    'Acompanhar ao vivo',
    'Imersão + odds em movimento',
    'Eventos com ritmo e mercados reativos ao jogo.',
    ['ev-live-1', 'ev-live-3', 'ev-live-5']
  ),
  intent(
    'build_parlay',
    'Montar múltipla',
    'Combine com correlação baixa',
    'Sugestão de pernas com esportes e horários diferentes.',
    ['ev-up-1', 'ev-up-2', 'ev-live-4']
  ),
  intent(
    'see_favorites',
    'Ver favoritos',
    'Seus times e ligas',
    `Prioriza ${mockUser.favoriteTeams.includes('t-fla') ? 'Flamengo' : 'seus times'} e ligas que você segue.`,
    ['ev-live-1', 'ev-up-1', 'ev-up-3']
  ),
  intent(
    'moment_opportunities',
    'Oportunidades do momento',
    'Curadoria em tempo real',
    'Combina movimento de mercado + contexto do jogo.',
    ['ev-live-2', 'ev-live-3', 'ev-up-1']
  ),
];

export const mockCopilotProfiles: CopilotProfileSuggestion[] = [
  {
    id: 'conservative',
    label: 'Conservadora',
    stakeFactor: 0.65,
    summary: 'Reduz exposição e prioriza liquidez.',
    oddsHint: 'Prefira menos pernas ou stake menor.',
  },
  {
    id: 'balanced',
    label: 'Equilibrada',
    stakeFactor: 1,
    summary: 'Alinha risco e retorno ao seu padrão.',
    oddsHint: 'Mantém o cupom como está, com alertas ativos.',
  },
  {
    id: 'aggressive',
    label: 'Agressiva',
    stakeFactor: 1.35,
    summary: 'Maximiza retorno com volatilidade maior.',
    oddsHint: 'Considere incluir uma perna de valor.',
  },
];

export function mockResumeChangesSince(lastVisitIso: string | null): ResumeChangeSummary {
  if (!lastVisitIso) {
    return { lineMovements: 12, newFeaturedEvents: 4, promotionsAdded: 1 };
  }
  const hours = (Date.now() - new Date(lastVisitIso).getTime()) / 3600000;
  const scale = Math.min(1, hours / 6);
  return {
    lineMovements: Math.max(2, Math.round(14 * scale)),
    newFeaturedEvents: Math.max(1, Math.round(5 * scale)),
    promotionsAdded: hours > 24 ? 2 : 1,
  };
}
