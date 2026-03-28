/**
 * Bet Routes
 * Mock endpoints for placing bets
 */

const express = require('express');
const router = express.Router();

// In-memory store for bets
const placedBets = new Map();

/**
 * POST /api/user/sportsBet/info
 * Place a new bet (endpoint usado pelo app mobile)
 */
router.post('/user/sportsBet/info', (req, res) => {
  const { selections, stake, expectedReturn } = req.body;

  if (!selections || selections.length === 0 || !stake || stake <= 0) {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'INVALID_REQUEST', message: 'Invalid bet data' }],
      data: null,
    });
  }

  // Generate bet ID
  const betId = `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate total odds
  const totalOdds = selections.reduce((acc, s) => acc * (s.odds || 1), 1);

  // Create bet object
  const bet = {
    id: betId,
    fixtureId: selections[0]?.eventId || 'unknown',
    fixture: selections.map(s => s.eventId).join(', '),
    outcomes: selections.map(s => ({
      id: s.outcomeId,
      marketId: s.marketId,
      marketType: 'Match Result',
      selection: s.outcomeId,
      odds: s.odds,
    })),
    totalStake: stake,
    potentialWin: expectedReturn || stake * totalOdds,
    totalOdds,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Store bet
  placedBets.set(betId, bet);

  console.log(`✅ Bet placed: ${betId}, Stake: R$ ${stake}, Return: R$ ${bet.potentialWin.toFixed(2)}`);

  res.json({
    success: true,
    responseCodes: [],
    betId,
    bet,
    message: 'Aposta realizada com sucesso!',
  });
});

/**
 * GET /api/user/sportsBet/history
 * Get bet history
 */
router.get('/user/sportsBet/history', (req, res) => {
  const bets = Array.from(placedBets.values()).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json({
    success: true,
    responseCodes: [],
    data: bets,
  });
});

module.exports = router;
