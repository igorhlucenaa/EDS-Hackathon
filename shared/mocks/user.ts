import type { User, UserBet, Transaction, Promotion, Notification } from '../types';
import { mockLiveEvents, mockUpcomingEvents } from './events';

export const mockUser: User = {
  id: 'u-1',
  name: 'Lucas Silva',
  email: 'lucas.silva@email.com',
  balance: 1247.5,
  bonusBalance: 50,
  currency: 'BRL',
  experienceMode: 'pro',
  favoriteSports: ['football', 'basketball'],
  favoriteLeagues: ['brasileirao-a', 'champions-league', 'nba'],
  favoriteTeams: ['t-fla', 't-lal'],
};

export const mockBets: UserBet[] = [
  {
    id: 'bet-1',
    selections: [{
      id: 'sel-1', eventId: 'ev-live-1', event: mockLiveEvents[0],
      marketId: 'm-1', marketName: 'Resultado Final',
      outcomeId: 'o-h-1', outcomeName: 'Flamengo', odds: 1.85,
    }],
    stake: 100, potentialReturn: 185, status: 'live',
    placedAt: new Date(Date.now() - 60 * 60000).toISOString(), betType: 'single',
  },
  {
    id: 'bet-2',
    selections: [
      {
        id: 'sel-2', eventId: 'ev-live-2', event: mockLiveEvents[1],
        marketId: 'm-2', marketName: 'Mais/Menos 2.5 Gols',
        outcomeId: 'o-under-1', outcomeName: 'Menos de 2.5', odds: 1.9,
      },
      {
        id: 'sel-3', eventId: 'ev-up-1', event: mockUpcomingEvents[0],
        marketId: 'm-3', marketName: 'Resultado Final',
        outcomeId: 'o-h-2', outcomeName: 'Corinthians', odds: 2.3,
      },
    ],
    stake: 50, potentialReturn: 218.5, status: 'cashout_available', cashoutValue: 42.3,
    placedAt: new Date(Date.now() - 120 * 60000).toISOString(), betType: 'accumulator',
  },
  {
    id: 'bet-3',
    selections: [{
      id: 'sel-4', eventId: 'ev-fin-1',
      event: { ...mockUpcomingEvents[0], id: 'ev-fin-1', status: { type: 'finished', score: { home: 1, away: 0 } } },
      marketId: 'm-4', marketName: 'Resultado Final',
      outcomeId: 'o-h-3', outcomeName: 'Corinthians', odds: 2.1,
    }],
    stake: 75, potentialReturn: 157.5, status: 'won',
    placedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    settledAt: new Date(Date.now() - 22 * 3600000).toISOString(), betType: 'single',
  },
];

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', type: 'deposit', amount: 500, status: 'completed', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'PIX' },
  { id: 'tx-2', type: 'bet', amount: -100, status: 'completed', createdAt: new Date(Date.now() - 60 * 60000).toISOString(), description: 'Flamengo vs Palmeiras' },
  { id: 'tx-3', type: 'win', amount: 157.5, status: 'completed', createdAt: new Date(Date.now() - 22 * 3600000).toISOString(), description: 'Aposta #bet-3' },
  { id: 'tx-4', type: 'bet', amount: -50, status: 'completed', createdAt: new Date(Date.now() - 120 * 60000).toISOString(), description: 'Acumulada 2 seleções' },
  { id: 'tx-5', type: 'withdrawal', amount: -200, status: 'pending', createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), description: 'Saque PIX' },
];

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-1', title: 'Bônus de Boas-Vindas', description: 'Ganhe até R$500 no seu primeiro depósito. Bônus de 100% até R$500.',
    image: '', category: 'welcome', expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(), ctaText: 'Depositar Agora', isActive: true,
  },
  {
    id: 'promo-2', title: 'Aposta Grátis Ao Vivo', description: 'Aposte R$50 em jogos ao vivo e ganhe R$10 em aposta grátis.',
    image: '', category: 'live', expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), ctaText: 'Apostar Ao Vivo', isActive: true,
  },
  {
    id: 'promo-3', title: 'Cashback Semanal', description: 'Receba 10% de cashback nas suas apostas da semana, até R$100.',
    image: '', category: 'cashback', expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(), ctaText: 'Ver Detalhes', isActive: true,
  },
];

export const mockNotifications: Notification[] = [
  { id: 'n-1', type: 'bet_result', title: 'Aposta Ganha! 🎉', message: 'Sua aposta em Corinthians ganhou R$157,50', isRead: false, createdAt: new Date(Date.now() - 22 * 3600000).toISOString(), actionUrl: '/bets' },
  { id: 'n-2', type: 'event_start', title: 'Jogo Começando', message: 'Flamengo x Palmeiras está ao vivo agora!', isRead: true, createdAt: new Date(Date.now() - 67 * 60000).toISOString(), actionUrl: '/event/ev-live-1' },
  { id: 'n-3', type: 'promotion', title: 'Nova Promoção', message: 'Cashback semanal de 10% disponível', isRead: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), actionUrl: '/promotions' },
];
