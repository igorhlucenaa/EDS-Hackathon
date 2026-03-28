// Dados mockados centralizados com integração de APIs reais
const realDataIntegrator = require('../realDataFetcher');

// Flag para controlar uso de dados reais vs mock
const USE_REAL_DATA = process.env.USE_REAL_DATA === 'true';
const sportTypes = [
  { id: '1', name: 'Football', slug: 'football', icon: '⚽', eventCount: 150, liveCount: 12 },
  { id: '2', name: 'Basketball', slug: 'basketball', icon: '🏀', eventCount: 45, liveCount: 3 },
  { id: '3', name: 'Tennis', slug: 'tennis', icon: '🎾', eventCount: 32, liveCount: 8 },
  { id: '4', name: 'MMA', slug: 'mma', icon: '🥊', eventCount: 12, liveCount: 1 },
  { id: '5', name: 'Volleyball', slug: 'volleyball', icon: '🏐', eventCount: 20, liveCount: 2 },
];

const leagues = [
  { id: '10', name: 'Brasileirão', slug: 'brasileirao', sportId: '1', country: 'Brazil', countryCode: 'BR', isFeatured: true },
  { id: '11', name: 'Premier League', slug: 'premier-league', sportId: '1', country: 'England', countryCode: 'GB', isFeatured: true },
  { id: '12', name: 'La Liga', slug: 'la-liga', sportId: '1', country: 'Spain', countryCode: 'ES', isFeatured: true },
  { id: '13', name: 'Champions League', slug: 'champions-league', sportId: '1', country: 'Europe', countryCode: 'EU', isFeatured: true },
  { id: '20', name: 'NBA', slug: 'nba', sportId: '2', country: 'USA', countryCode: 'US', isFeatured: true },
];

const teams = [
  { id: 't1', name: 'Flamengo', shortName: 'FLA', logo: '🔴' },
  { id: 't2', name: 'Palmeiras', shortName: 'PAL', logo: '🟢' },
  { id: 't3', name: 'São Paulo', shortName: 'SPA', logo: '⚪' },
  { id: 't4', name: 'Corinthians', shortName: 'COR', logo: '⚫' },
  { id: 't5', name: 'Manchester United', shortName: 'MUN', logo: '🔴' },
  { id: 't6', name: 'Liverpool', shortName: 'LIV', logo: '🔴' },
];

const generateEvents = () => {
  const now = Date.now();
  const events = [];

  // Eventos ao vivo
  for (let i = 0; i < 8; i++) {
    events.push({
      id: `live-${i}`,
      sportId: '1',
      leagueId: i % 2 === 0 ? '10' : '11',
      league: i % 2 === 0 ? leagues[0] : leagues[1],
      home: teams[i % teams.length],
      away: teams[(i + 1) % teams.length],
      status: {
        type: 'live',
        clock: `${45 + Math.floor(Math.random() * 45)}'`,
        period: Math.floor(Math.random() * 2) + 1,
        score: { home: Math.floor(Math.random() * 3), away: Math.floor(Math.random() * 3) },
        momentum: ['home', 'away', 'neutral'][Math.floor(Math.random() * 3)]
      },
      startTime: new Date(now - 3600000).toISOString(),
      markets: generateMarkets(),
      featuredMarket: { id: 'm1', name: 'Match Result', slug: 'match-result' },
      viewerCount: Math.floor(Math.random() * 10000) + 1000
    });
  }

  // Eventos futuros
  for (let i = 0; i < 12; i++) {
    const startTime = new Date(now + (i + 1) * 3600000);
    events.push({
      id: `upcoming-${i}`,
      sportId: '1',
      leagueId: i % 2 === 0 ? '10' : '11',
      league: i % 2 === 0 ? leagues[0] : leagues[1],
      home: teams[i % teams.length],
      away: teams[(i + 1) % teams.length],
      status: {
        type: 'pre_match',
        clock: null,
        period: null,
        score: { home: 0, away: 0 },
        momentum: null
      },
      startTime: startTime.toISOString(),
      markets: generateMarkets(),
      featuredMarket: { id: 'm1', name: 'Match Result', slug: 'match-result' }
    });
  }

  return events;
};

const generateMarkets = () => {
  return [
    {
      id: 'm1',
      name: 'Match Result',
      slug: 'match-result',
      category: 'main',
      outcomes: [
        { id: 'o1', name: 'Home', odds: 1.85 + Math.random() * 0.3, previousOdds: 1.8, isLocked: false },
        { id: 'o2', name: 'Draw', odds: 3.4 + Math.random() * 0.2, previousOdds: 3.35, isLocked: false },
        { id: 'o3', name: 'Away', odds: 4.2 + Math.random() * 0.3, previousOdds: 4.15, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: true
    },
    {
      id: 'm2',
      name: 'Over/Under 2.5 Goals',
      slug: 'over-under',
      category: 'goals',
      outcomes: [
        { id: 'o4', name: 'Over 2.5', odds: 1.95 + Math.random() * 0.2, previousOdds: 1.92, isLocked: false },
        { id: 'o5', name: 'Under 2.5', odds: 1.85 + Math.random() * 0.2, previousOdds: 1.82, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: false
    },
  ];
};

const betTypeGroups = [
  {
    id: 'btg1',
    name: 'Match Result',
    slug: 'match-result',
    markets: [
      { id: 'm1', name: 'Win/Draw/Loss', outcomes: 3 },
      { id: 'm2', name: 'Double Chance', outcomes: 3 },
    ]
  },
  {
    id: 'btg2',
    name: 'Goals',
    slug: 'goals',
    markets: [
      { id: 'm3', name: 'Over/Under 2.5', outcomes: 2 },
      { id: 'm4', name: 'Both Teams Score', outcomes: 2 },
    ]
  },
  {
    id: 'btg3',
    name: 'Corners',
    slug: 'corners',
    markets: [
      { id: 'm5', name: 'Total Corners', outcomes: 2 },
    ]
  },
];

const applicationParameters = {
  domain: 'esportesdasorte.bet.br',
  device: 'mobile',
  languageCode: 'pt-BR',
  languageId: '1',
  traderId: '12345',
  timeoutMs: 15000,
  apiBaseUrl: 'https://esportesdasorte.bet.br/api',
  features: {
    liveStreaming: true,
    inGameBetting: true,
    quickBets: true,
    accumulators: true,
    cashOut: true
  }
};

// Funções que integram dados reais com mock
const getSports = async () => {
  if (USE_REAL_DATA && realDataIntegrator.enabled) {
    try {
      return await realDataIntegrator.getSports();
    } catch (error) {
      console.error('Erro ao buscar esportes reais, usando mock:', error.message);
    }
  }
  return sportTypes;
};

const getLeagues = async () => {
  if (USE_REAL_DATA && realDataIntegrator.enabled) {
    try {
      return await realDataIntegrator.getLeagues();
    } catch (error) {
      console.error('Erro ao buscar ligas reais, usando mock:', error.message);
    }
  }
  return leagues;
};

const getTeams = async () => {
  if (USE_REAL_DATA && realDataIntegrator.enabled) {
    try {
      return await realDataIntegrator.getTeams();
    } catch (error) {
      console.error('Erro ao buscar times reais, usando mock:', error.message);
    }
  }
  return teams;
};

const getEvents = async (status = 'all') => {
  if (USE_REAL_DATA && realDataIntegrator.enabled) {
    try {
      const realEvents = await realDataIntegrator.getEvents(status);
      if (realEvents && realEvents.length > 0) {
        return realEvents;
      }
    } catch (error) {
      console.error('Erro ao buscar eventos reais, usando mock:', error.message);
    }
  }
  return generateEvents();
};

module.exports = {
  sportTypes,
  leagues,
  teams,
  generateEvents,
  generateMarkets,
  betTypeGroups,
  applicationParameters,
  // Funções com integração de dados reais
  getSports,
  getLeagues,
  getTeams,
  getEvents,
  // Utilitários
  USE_REAL_DATA,
  realDataIntegrator
};
