const express = require('express');
const router = express.Router();
const { getSports, getLeagues, getEvents } = require('../data/mockData');

/**
 * GET /api-v2/today-sport-types/{device}/{language}/{trader}
 * Retorna lista de esportes com eventos do dia
 */
router.get('/today-sport-types/:device/:language/:trader', async (req, res) => {
  const { device, language, trader } = req.params;

  try {
    const sports = await getSports();

    const response = {
      success: true,
      responseCodes: [{ code: 'OK', message: 'Sports retrieved successfully' }],
      data: {
        sports: sports.map(sport => ({
          ...sport,
          categories: device === 'd' ? [] : [], // Desktop vs Mobile diferente
          seasons: [],
          fixtures: []
        })),
        timestamp: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve sports' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/left-menu/{device}/{language}/{trader}
 * Retorna menu com estrutura completa sports/categories/seasons/fixtures
 */
router.get('/left-menu/:device/:language/:trader', async (req, res) => {
  try {
    const [sports, leagues, events] = await Promise.all([
      getSports(),
      getLeagues(),
      getEvents()
    ]);

    const liveEvents = events.filter(e => e.status.type === 'live');
  
  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
        sports: sports.map(sport => ({
        id: sport.id,
        name: sport.name,
        slug: sport.slug,
        icon: sport.icon,
        categories: [
          {
            id: `cat-${sport.id}-1`,
            name: 'All Leagues',
            leagues: leagues.filter(l => l.sportId === sport.id).map(league => ({
              id: league.id,
              name: league.name,
              slug: league.slug,
              country: league.country,
              seasons: [
                {
                  id: `season-${league.id}-2025`,
                  name: '2025/2026',
                  fixtures: events
                    .filter(e => e.leagueId === league.id)
                    .slice(0, 5)
                    .map(f => ({
                      id: f.id,
                      homeTeam: f.home.name,
                      awayTeam: f.away.name,
                      startTime: f.startTime,
                      status: f.status.type
                    }))
                }
              ]
            }))
          }
        ]
      })),
      totalFixtures: events.length,
      totalLiveFixtures: liveEvents.length
    }
  };

  res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve menu data' }],
      data: null
    });
  }
});

/**
 * GET /api-v2/antepost-summary/{device}/{language}/{trader}
 * Retorna apostas de longo prazo (ante-post)
 */
router.get('/antepost-summary/:device/:language/:trader', async (req, res) => {
  try {
    const sports = await getSports();

    const response = {
      success: true,
      responseCodes: [{ code: 'OK' }],
      data: {
        sports: sports.map(sport => ({
          id: sport.id,
          name: sport.name,
          markets: [
            {
              id: `ante-${sport.id}-1`,
              name: 'League Winner',
              outcomes: sports.map((s, idx) => ({
                id: `ante-${sport.id}-${idx}`,
                name: s.name,
                odds: 5.5 + Math.random() * 3
              }))
            }
          ]
        })),
        tournament: 'Brazilian Championship 2025/2026'
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCodes: [{ code: 'ERROR', message: 'Failed to retrieve antepost data' }],
      data: null
    });
  }
});

module.exports = router;
