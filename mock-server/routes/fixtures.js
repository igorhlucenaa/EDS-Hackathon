const express = require('express');
const router = express.Router();
const { getEvents } = require('../data/mockData');

/**
 * GET /api-v2/upcoming-events/{device}/{language}/{trader}
 * Retorna próximos eventos
 */
router.get('/upcoming-events/:device/:language/:trader', async (req, res) => {
  try {
    const events = await getEvents('upcoming');
    const upcomingEvents = events.filter(e => e.status.type !== 'live').slice(0, 10);

    const response = {
      success: true,
      responseCodes: [{ code: 'OK' }],
      data: {
        fixtures: upcomingEvents,
        total: upcomingEvents.length,
        pageSize: 10,
        currentPage: 1
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve upcoming events' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/promoted-events/{device}/{language}/{trader}
 * Retorna eventos promovidos/destacados
 */
router.get('/promoted-events/:device/:language/:trader', async (req, res) => {
  try {
    const events = await getEvents('live');
    const liveEvents = events.filter(e => e.status.type === 'live').slice(0, 3);

    const response = {
      success: true,
      responseCodes: [{ code: 'OK' }],
      data: {
        promotedFixtures: liveEvents.map(event => ({
          ...event,
          promoted: true,
          promotionTitle: 'Featured Match',
          promotionBadge: 'LIVE'
        }))
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve promoted events' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/popular-fixture/{device}/{language}/{trader}
 * Retorna eventos populares com mais acesso
 */
router.get('/popular-fixture/:device/:language/:trader', async (req, res) => {
  try {
    const events = await getEvents();
    const popularEvents = events
      .filter(e => e.viewerCount)
      .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
      .slice(0, 5);

    const response = {
      success: true,
      responseCodes: [{ code: 'OK' }],
      data: {
        popularFixtures: popularEvents.map(event => ({
          ...event,
          rank: popularEvents.indexOf(event) + 1,
          popularity: 'high'
        }))
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve popular fixtures' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/detail-card/{device}/{language}/{trader}
 * Retorna detalhe completo de um evento
 */
router.get('/detail-card/:device/:language/:trader', async (req, res) => {
  try {
    const { fixtureId } = req.query;
    const events = await getEvents();
    const event = events.find(e => e.id === fixtureId) || events[0];

    const response = {
      success: true,
      responseCodes: [{ code: 'OK' }],
      data: {
        fixture: {
          ...event,
          statistics: {
            possession: { home: 55, away: 45 },
            shots: { home: 12, away: 8 },
            shotsOnTarget: { home: 5, away: 3 },
            corners: { home: 8, away: 6 },
            fouls: { home: 10, away: 12 }
          },
          timeline: [
            { minute: 15, type: 'goal', team: 'home', player: 'John Doe' },
            { minute: 32, type: 'yellow', team: 'away', player: 'Jane Smith' },
          ],
          allMarkets: event.markets
        }
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve fixture details' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/fixture-search/{device}/{language}/{trader}
 * Busca fixtures
 */
router.get('/fixture-search/:device/:language/:trader', async (req, res) => {
  try {
    const { query } = req.query;
    const events = await getEvents();

    const filteredEvents = events.filter(e =>
      e.home.name.toLowerCase().includes(query?.toLowerCase() || '') ||
      e.away.name.toLowerCase().includes(query?.toLowerCase() || '')
    );

    const response = {
      success: true,
      responseCodes: [{ code: 'OK' }],
      data: {
        fixtures: filteredEvents.slice(0, 10),
        total: filteredEvents.length
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to search fixtures' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/league-card/{device}/{language}/{trader}/{seasonIds}/{encodedbody}
 * Retorna dados de liga com fixtures
 */
router.get('/league-card/:device/:language/:trader/:seasonIds/:encodedbody', async (req, res) => {
  try {
    const events = await getEvents();
    const fixturesInLeague = events.slice(0, 8);

  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      league: {
        id: 'league-1',
        name: 'Brazilian Championship',
        fixtures: fixturesInLeague,
        standings: [
          { position: 1, team: 'Palmeiras', played: 25, wins: 18, draws: 3, losses: 4, points: 57 },
          { position: 2, team: 'Flamengo', played: 25, wins: 17, draws: 4, losses: 4, points: 55 },
          { position: 3, team: 'Corinthians', played: 25, wins: 15, draws: 6, losses: 4, points: 51 },
        ]
      }
    }
  };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve league data' }],
      data: null
    });
  }
});

module.exports = router;
