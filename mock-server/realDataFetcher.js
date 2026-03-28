// realDataFetcher.js - Integração com Football Data API (gratuita)
// Busca dados reais de futebol e mescla com dados mock

const axios = require('axios');

// Configuração da Football Data API (gratuita)
const FOOTBALL_DATA_API = {
  baseURL: 'https://api.football-data.org/v4',
  // Para usar a API gratuita, você precisa se registrar em https://www.football-data.org/client/register
  // e obter uma chave API gratuita
  apiKey: process.env.FOOTBALL_DATA_API_KEY || null,
  freeTier: true // true = gratuito (limitado), false = pago (ilimitado)
};

// Cache para evitar muitas requisições
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Faz requisição com cache
 */
async function cachedRequest(url, options = {}) {
  const cacheKey = url + JSON.stringify(options);

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await axios.get(url, options);
    const data = response.data;

    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error.message);
    return null;
  }
}

/**
 * Busca competições da Football Data API
 */
async function fetchRealCompetitions() {
  if (!FOOTBALL_DATA_API.apiKey) {
    console.log('Football Data API key não configurada, usando dados mock');
    return null;
  }

  try {
    const data = await cachedRequest(`${FOOTBALL_DATA_API.baseURL}/competitions`, {
      headers: { 'X-Auth-Token': FOOTBALL_DATA_API.apiKey }
    });

    if (data && data.competitions) {
      return data.competitions.map(comp => ({
        id: comp.id,
        name: comp.name,
        code: comp.code,
        country: comp.area?.name || 'International',
        logo: comp.emblem || null,
        isFeatured: ['PL', 'BL1', 'PD', 'SA', 'FL1', 'CL'].includes(comp.code)
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar competições reais:', error);
  }

  return null;
}

/**
 * Busca jogos da Football Data API
 */
async function fetchRealMatches(competitionCode = 'PL', status = 'SCHEDULED') {
  if (!FOOTBALL_DATA_API.apiKey) {
    return null;
  }

  try {
    const data = await cachedRequest(`${FOOTBALL_DATA_API.baseURL}/competitions/${competitionCode}/matches?status=${status}`, {
      headers: { 'X-Auth-Token': FOOTBALL_DATA_API.apiKey }
    });

    if (data && data.matches) {
      return data.matches.slice(0, 10).map(match => ({
        id: match.id,
        fixtureId: match.id,
        name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        status: match.status === 'SCHEDULED' ? 'upcoming' : 'live',
        startTime: match.utcDate,
        sportId: 1, // Football
        leagueId: match.competition?.id || 1,
        homeTeam: {
          id: match.homeTeam.id,
          name: match.homeTeam.name,
          shortName: match.homeTeam.shortName || match.homeTeam.name.substring(0, 3).toUpperCase(),
          logo: match.homeTeam.crest || null
        },
        awayTeam: {
          id: match.awayTeam.id,
          name: match.awayTeam.name,
          shortName: match.awayTeam.shortName || match.awayTeam.name.substring(0, 3).toUpperCase(),
          logo: match.awayTeam.crest || null
        },
        score: match.status === 'LIVE' || match.status === 'IN_PLAY' ? {
          home: match.score?.fullTime?.home || 0,
          away: match.score?.fullTime?.away || 0
        } : null,
        markets: generateMarketsForMatch(match)
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar jogos reais:', error);
  }

  return null;
}

/**
 * Gera mercados para um jogo real
 */
function generateMarketsForMatch(match) {
  const baseOdds = {
    home: 2.10 + (Math.random() - 0.5) * 0.6,
    draw: 3.20 + (Math.random() - 0.5) * 0.8,
    away: 3.50 + (Math.random() - 0.5) * 0.8
  };

  return [
    {
      id: `market_${match.id}_1`,
      type: 'Match Result',
      outcomes: [
        { id: `o${match.id}1`, name: 'Home', odds: baseOdds.home.toFixed(2) },
        { id: `o${match.id}2`, name: 'Draw', odds: baseOdds.draw.toFixed(2) },
        { id: `o${match.id}3`, name: 'Away', odds: baseOdds.away.toFixed(2) }
      ]
    },
    {
      id: `market_${match.id}_2`,
      type: 'Over/Under 2.5',
      outcomes: [
        { id: `o${match.id}4`, name: 'Over', odds: (2.05 + (Math.random() - 0.5) * 0.4).toFixed(2) },
        { id: `o${match.id}5`, name: 'Under', odds: (1.85 + (Math.random() - 0.5) * 0.3).toFixed(2) }
      ]
    }
  ];
}

/**
 * Busca classificações da Football Data API
 */
async function fetchRealStandings(competitionCode = 'PL') {
  if (!FOOTBALL_DATA_API.apiKey) {
    return null;
  }

  try {
    const data = await cachedRequest(`${FOOTBALL_DATA_API.baseURL}/competitions/${competitionCode}/standings`, {
      headers: { 'X-Auth-Token': FOOTBALL_DATA_API.apiKey }
    });

    if (data && data.standings && data.standings[0]?.table) {
      return data.standings[0].table.slice(0, 6).map(team => ({
        position: team.position,
        team: {
          id: team.team.id,
          name: team.team.name,
          shortName: team.team.shortName || team.team.name.substring(0, 3).toUpperCase(),
          logo: team.team.crest || null
        },
        playedGames: team.playedGames,
        won: team.won,
        draw: team.draw,
        lost: team.lost,
        points: team.points,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: team.goalDifference
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar classificações reais:', error);
  }

  return null;
}

/**
 * Busca times da Football Data API
 */
async function fetchRealTeams(competitionCode = 'PL') {
  if (!FOOTBALL_DATA_API.apiKey) {
    return null;
  }

  try {
    const data = await cachedRequest(`${FOOTBALL_DATA_API.baseURL}/competitions/${competitionCode}/teams`, {
      headers: { 'X-Auth-Token': FOOTBALL_DATA_API.apiKey }
    });

    if (data && data.teams) {
      return data.teams.slice(0, 6).map(team => ({
        id: team.id,
        name: team.name,
        shortName: team.shortName || team.name.substring(0, 3).toUpperCase(),
        logo: team.crest || null,
        address: team.address || null,
        website: team.website || null
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar times reais:', error);
  }

  return null;
}

/**
 * Mescla dados reais com dados mock
 */
function mergeRealAndMock(realData, mockData, priority = 'real') {
  if (!realData) return mockData;
  if (!mockData) return realData;

  if (priority === 'real') {
    return [...realData, ...mockData.slice(realData.length)];
  } else {
    return [...mockData, ...realData.slice(mockData.length)];
  }
}

/**
 * Classe principal para integração de dados reais
 */
class RealDataIntegrator {
  constructor() {
    this.enabled = !!FOOTBALL_DATA_API.apiKey;
    if (this.enabled) {
      console.log('🔗 Integração com Football Data API habilitada');
    } else {
      console.log('📝 Usando apenas dados mock (Football Data API não configurada)');
    }
  }

  /**
   * Busca esportes com dados reais quando possível
   */
  async getSports() {
    const realCompetitions = await fetchRealCompetitions();
    const mockData = require('./data/mockData');

    if (realCompetitions) {
      // Converte competições reais para formato mock
      const realSports = realCompetitions.reduce((acc, comp) => {
        const sportKey = comp.country;
        if (!acc[sportKey]) {
          acc[sportKey] = {
            id: acc.length + 1,
            name: sportKey,
            icon: '⚽',
            eventCount: Math.floor(Math.random() * 20) + 10,
            liveCount: Math.floor(Math.random() * 5) + 1
          };
        }
        return acc;
      }, {});

      return mergeRealAndMock(Object.values(realSports), mockData.sportTypes);
    }

    return mockData.sportTypes;
  }

  /**
   * Busca eventos com dados reais quando possível
   */
  async getEvents(status = 'upcoming') {
    const realMatches = await fetchRealMatches('PL', status === 'live' ? 'LIVE' : 'SCHEDULED');
    const mockData = require('./data/mockData');

    if (realMatches) {
      return mergeRealAndMock(realMatches, mockData.generateEvents());
    }

    return mockData.generateEvents();
  }

  /**
   * Busca times com dados reais quando possível
   */
  async getTeams() {
    const realTeams = await fetchRealTeams('PL');
    const mockData = require('./data/mockData');

    if (realTeams) {
      return mergeRealAndMock(realTeams, mockData.teams);
    }

    return mockData.teams;
  }

  /**
   * Busca ligas com dados reais quando possível
   */
  async getLeagues() {
    const realCompetitions = await fetchRealCompetitions();
    const mockData = require('./data/mockData');

    if (realCompetitions) {
      return mergeRealAndMock(realCompetitions, mockData.leagues);
    }

    return mockData.leagues;
  }
}

module.exports = new RealDataIntegrator();
