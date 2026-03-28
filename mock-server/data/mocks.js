/**
 * Local mocks for mock-server (JavaScript version)
 * Duplicated from shared/mocks to avoid TypeScript import issues
 */

// Mock User
const mockUser = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@example.com',
  balance: 1250.50,
  currency: 'BRL',
  level: 5,
  xp: 2450,
  nextLevelXp: 3000,
};

// Mock Bets (Open)
const mockBets = [
  {
    id: 'bet-1',
    status: 'live',
    type: 'single',
    fixture: 'Flamengo vs Palmeiras',
    selections: [
      {
        id: 'sel-1',
        market: 'Match Result',
        outcome: 'Flamengo vence',
        odds: 2.10,
        eventId: 'evt-1',
      },
    ],
    stake: 50.00,
    potentialReturn: 105.00,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'bet-2',
    status: 'cashout_available',
    type: 'accumulator',
    fixture: 'Multipla: 3 jogos',
    selections: [
      { id: 'sel-2', market: 'Match Result', outcome: 'Casa vence', odds: 1.80, eventId: 'evt-2' },
      { id: 'sel-3', market: 'Over 2.5', outcome: 'Over', odds: 1.90, eventId: 'evt-3' },
      { id: 'sel-4', market: 'Ambas Marcam', outcome: 'Sim', odds: 1.70, eventId: 'evt-4' },
    ],
    stake: 30.00,
    potentialReturn: 174.60,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'bet-3',
    status: 'open',
    type: 'single',
    fixture: 'Corinthians vs São Paulo',
    selections: [
      {
        id: 'sel-5',
        market: 'Double Chance',
        outcome: 'Casa/Empate',
        odds: 1.35,
        eventId: 'evt-5',
      },
    ],
    stake: 100.00,
    potentialReturn: 135.00,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Mock Events
const mockLiveEvents = [
  {
    id: 'evt-live-1',
    sportId: '1',
    leagueId: 'liga-brasileira',
    home: { id: 'team-1', name: 'Flamengo', shortName: 'FLA' },
    away: { id: 'team-2', name: 'Palmeiras', shortName: 'PAL' },
    status: { type: 'live', clock: '67\'', period: '2T', score: { home: 2, away: 1 }, momentum: 'home' },
    startTime: new Date().toISOString(),
    markets: [],
  },
  {
    id: 'evt-live-2',
    sportId: '1',
    leagueId: 'premier-league',
    home: { id: 'team-3', name: 'Arsenal', shortName: 'ARS' },
    away: { id: 'team-4', name: 'Chelsea', shortName: 'CHE' },
    status: { type: 'live', clock: '45\'', period: '1T', score: { home: 0, away: 0 }, momentum: 'neutral' },
    startTime: new Date().toISOString(),
    markets: [],
  },
];

const mockUpcomingEvents = [
  {
    id: 'evt-up-1',
    sportId: '1',
    leagueId: 'liga-brasileira',
    home: { id: 'team-5', name: 'Corinthians', shortName: 'COR' },
    away: { id: 'team-6', name: 'São Paulo', shortName: 'SAO' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 3600000).toISOString(),
    markets: [],
  },
  {
    id: 'evt-up-2',
    sportId: '1',
    leagueId: 'la-liga',
    home: { id: 'team-7', name: 'Real Madrid', shortName: 'RMA' },
    away: { id: 'team-8', name: 'Barcelona', shortName: 'BAR' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 7200000).toISOString(),
    markets: [],
  },
];

module.exports = {
  mockUser,
  mockBets,
  mockLiveEvents,
  mockUpcomingEvents,
};
