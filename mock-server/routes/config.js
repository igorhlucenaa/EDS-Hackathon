const express = require('express');
const router = express.Router();
const { applicationParameters, sportTypes } = require('../data/mockData');

/**
 * GET /api/generic/getApplicationParameters/{domain}/w
 * Retorna parâmetros gerais da aplicação
 */
router.get('/generic/getApplicationParameters/:domain/:device', (req, res) => {
  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      ...applicationParameters,
      domain: req.params.domain,
      device: req.params.device,
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      minBetAmount: 1.0,
      maxBetAmount: 50000.0
    }
  };

  res.json(response);
});

/**
 * GET /api/generic/getTraderDefaults/{domain}
 * Retorna configurações padrão do trader
 */
router.get('/generic/getTraderDefaults/:domain/:device', (req, res) => {
  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      traderId: applicationParameters.traderId,
      defaultLanguage: 1,
      defaultOddformat: 'decimal',
      features: applicationParameters.features,
      limits: {
        maxCombinations: 15,
        maxSelectionsPerBet: 20,
        dailyBetLimit: 100000
      }
    }
  };

  res.json(response);
});

/**
 * GET /api/generic/getTraderPages/{domain}/{device}/{language_id}
 * Retorna configuração de páginas do trader
 */
router.get('/generic/getTraderPages/:domain/:device/:language_id', (req, res) => {
  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      pages: [
        {
          id: 'home',
          name: 'Home',
          slug: 'home',
          enabled: true,
          order: 1
        },
        {
          id: 'live',
          name: 'Live Betting',
          slug: 'live',
          enabled: true,
          order: 2
        },
        {
          id: 'sports',
          name: 'Sports',
          slug: 'sports',
          enabled: true,
          order: 3
        },
        {
          id: 'mybets',
          name: 'My Bets',
          slug: 'mybets',
          enabled: true,
          order: 4
        },
        {
          id: 'account',
          name: 'Account',
          slug: 'account',
          enabled: true,
          order: 5
        }
      ]
    }
  };

  res.json(response);
});

/**
 * POST /api/generic/booking/bookabet
 * Faz booking de uma aposta (confirmação)
 */
router.post('/generic/booking/bookabet', (req, res) => {
  const { selections, stake, betType } = req.body;

  const bookingId = 'BET_' + Date.now();
  let totalOdds = 1;

  if (selections && selections.length > 0) {
    totalOdds = selections.reduce((acc, sel) => acc * (sel.odds || 1), 1);
  }

  const response = {
    success: true,
    responseCodes: [{ code: 'OK', message: 'Bet booked successfully' }],
    data: {
      bookingId,
      status: 'BOOKED',
      selections: selections || [],
      stake,
      totalOdds: parseFloat(totalOdds.toFixed(2)),
      potentialWin: parseFloat((stake * totalOdds).toFixed(2)),
      betType: betType || 'accumulator',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutos
      message: 'Bet booking confirmed. Place your bet to lock in these odds.'
    }
  };

  res.json(response);
});

/**
 * GET /api/generic/getTraderFavoriteTeamList/{domain}
 * Retorna times favoritos configurados
 */
router.get('/generic/getTraderFavoriteTeamList/:domain/:device', (req, res) => {
  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      favoriteTeams: [
        { id: 't1', name: 'Flamengo', country: 'BR' },
        { id: 't5', name: 'Manchester United', country: 'GB' }
      ]
    }
  };

  res.json(response);
});

/**
 * GET /api/generic/getContentByCode
 * Retorna conteúdo por código (CMS)
 */
router.post('/generic/getContentByCode', (req, res) => {
  const { code } = req.body;

  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      contentCode: code,
      title: 'Welcome to SwiftBet',
      body: 'Place your bets on your favorite sports events',
      html: '<h1>Welcome</h1><p>Bet now on live events</p>',
      createdAt: new Date().toISOString()
    }
  };

  res.json(response);
});

module.exports = router;
