const express = require('express');
const router = express.Router();
const { betTypeGroups } = require('../data/mockData');

/**
 * GET /api-v2/bet-type-groups/{device}/{language}/{trader}
 * Retorna grupos de tipos de apostas (mercados disponíveis)
 */
router.get('/bet-type-groups/:device/:language/:trader', (req, res) => {
  const response = {
    success: true,
    responseCodes: [{ code: 'OK', message: 'Bet type groups retrieved' }],
    data: {
      betTypeGroups: betTypeGroups.map(group => ({
        id: group.id,
        name: group.name,
        slug: group.slug,
        marketCount: group.markets.length,
        markets: group.markets.map(market => ({
          id: market.id,
          name: market.name,
          outcomesCount: market.outcomes
        }))
      })),
      totalGroups: betTypeGroups.length
    }
  };

  res.json(response);
});

/**
 * GET /api-v2/markets/{fixtureId}
 * Retorna todos os mercados de um fixture
 */
router.get('/markets/:fixtureId', (req, res) => {
  const { fixtureId } = req.params;

  const markets = [
    {
      id: 'm1',
      name: 'Match Result',
      slug: 'match-result',
      category: 'main',
      outcomes: [
        { id: 'o1', name: 'Home Win', odds: 2.10, previousOdds: 2.05, isLocked: false },
        { id: 'o2', name: 'Draw', odds: 3.30, previousOdds: 3.25, isLocked: false },
        { id: 'o3', name: 'Away Win', odds: 3.50, previousOdds: 3.45, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: true
    },
    {
      id: 'm2',
      name: 'Over/Under 2.5 Goals',
      slug: 'over-under-2-5',
      category: 'goals',
      outcomes: [
        { id: 'o4', name: 'Over 2.5', odds: 2.05, previousOdds: 2.02, isLocked: false },
        { id: 'o5', name: 'Under 2.5', odds: 1.80, previousOdds: 1.78, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: false
    },
    {
      id: 'm3',
      name: 'Both Teams Score',
      slug: 'both-score',
      category: 'goals',
      outcomes: [
        { id: 'o6', name: 'Yes', odds: 1.95, previousOdds: 1.92, isLocked: false },
        { id: 'o7', name: 'No', odds: 1.95, previousOdds: 1.92, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: false
    },
    {
      id: 'm4',
      name: 'Double Chance',
      slug: 'double-chance',
      category: 'main',
      outcomes: [
        { id: 'o8', name: 'Home or Draw', odds: 1.45, previousOdds: 1.43, isLocked: false },
        { id: 'o9', name: 'Away or Draw', odds: 1.50, previousOdds: 1.48, isLocked: false },
        { id: 'o10', name: 'Home or Away', odds: 1.05, previousOdds: 1.05, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: false
    },
    {
      id: 'm5',
      name: 'Total Corners',
      slug: 'total-corners',
      category: 'corners',
      outcomes: [
        { id: 'o11', name: 'Over 9.5', odds: 1.90, previousOdds: 1.88, isLocked: false },
        { id: 'o12', name: 'Under 9.5', odds: 1.95, previousOdds: 1.93, isLocked: false },
      ],
      isSuspended: false,
      isFeatured: false
    }
  ];

  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      fixtureId,
      markets,
      totalMarkets: markets.length,
      lastUpdated: new Date().toISOString()
    }
  };

  res.json(response);
});

/**
 * POST /api-v2/get-odds
 * Retorna odds em tempo real para múltiplos mercados
 */
router.post('/get-odds', (req, res) => {
  const { marketIds } = req.body;

  const odds = (marketIds || []).map(marketId => ({
    marketId,
    outcomes: [
      { id: 'o1', odds: 1.85 + Math.random() * 0.3, movement: Math.random() > 0.5 ? 'up' : 'down' },
      { id: 'o2', odds: 3.40 + Math.random() * 0.2, movement: Math.random() > 0.5 ? 'up' : 'down' },
    ],
    lastUpdated: new Date().toISOString()
  }));

  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      odds: odds.length > 0 ? odds : [],
      quotesCount: odds.length
    }
  };

  res.json(response);
});

module.exports = router;
