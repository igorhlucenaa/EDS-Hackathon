/**
 * Cashout & Open Bets Routes
 * Mock endpoints for cashout feature
 */

const express = require('express');
const router = express.Router();

// Import mocks
const { mockBets, mockUser } = require('../../shared/mocks/user');
const { mockLiveEvents } = require('../../shared/mocks/events');

// In-memory store for cashout simulation (session-based)
const cashoutStore = new Map();

/**
 * Generate cashout offer based on bet status
 */
function generateCashoutOffer(bet) {
  const now = Date.now();
  const betAge = now - new Date(bet.placedAt).getTime();
  const isLive = bet.status === 'live' || (betAge < 90 * 60000 && Math.random() > 0.3);
  
  // Determine status based on mock logic
  let status = 'unavailable';
  let availableAmount = 0;
  let message = 'Cashout indisponível';

  const random = Math.random();
  
  if (bet.status === 'cashed_out') {
    status = 'unavailable';
    availableAmount = 0;
    message = 'Aposta já encerrada';
  } else if (isLive || bet.status === 'cashout_available') {
    if (random > 0.7) {
      status = 'rising';
      availableAmount = bet.potentialReturn * 0.75;
      message = 'Valor em alta';
    } else if (random > 0.4) {
      status = 'fluctuating';
      availableAmount = bet.stake * 1.1;
      message = 'Oscilando';
    } else {
      status = 'available';
      availableAmount = bet.stake * 0.9;
      message = 'Disponível agora';
    }
  } else if (bet.status === 'open') {
    status = 'available';
    availableAmount = bet.stake * 0.95;
    message = 'Disponível agora';
  }

  return {
    betId: bet.id,
    status,
    availableAmount: Math.round(availableAmount * 100) / 100,
    originalStake: bet.stake,
    potentialReturn: bet.potentialReturn,
    message,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Transform UserBet to OpenBet with cashout info
 */
function transformToOpenBet(bet) {
  const selections = bet.selections.map(sel => ({
    id: sel.id,
    eventId: sel.eventId,
    eventName: sel.event ? `${sel.event.home.name} vs ${sel.event.away.name}` : 'Evento',
    marketName: sel.marketName,
    outcomeName: sel.outcomeName,
    odds: sel.odds,
    leagueName: sel.event?.league?.name,
    homeTeam: sel.event?.home?.name,
    awayTeam: sel.event?.away?.name,
    score: sel.event?.status?.score,
    minute: sel.event?.status?.clock ? parseInt(sel.event.status.clock) : undefined,
  }));

  return {
    id: bet.id,
    selections,
    stake: bet.stake,
    potentialReturn: bet.potentialReturn,
    status: bet.status === 'cashout_available' ? 'cashout_available' : 
            bet.status === 'live' ? 'live' : 'open',
    placedAt: bet.placedAt,
    betType: bet.betType,
    cashoutOffer: generateCashoutOffer(bet),
    partialCashouts: cashoutStore.get(bet.id)?.partialCashouts || [],
    remainingExposure: cashoutStore.get(bet.id)?.remainingExposure || bet.stake,
    cashedOutAmount: cashoutStore.get(bet.id)?.cashedOutAmount || 0,
  };
}

/**
 * GET /api-v2/open-bets
 * List all open bets for the user
 */
router.get('/open-bets', (req, res) => {
  const openBets = mockBets.filter(bet => 
    bet.status === 'open' || 
    bet.status === 'live' || 
    bet.status === 'cashout_available'
  );

  const transformedBets = openBets.map(transformToOpenBet);
  const totalCashoutAvailable = transformedBets.reduce(
    (sum, bet) => sum + (bet.cashoutOffer?.availableAmount || 0), 
    0
  );

  res.json({
    success: true,
    responseCodes: [],
    data: {
      bets: transformedBets,
      totalCount: transformedBets.length,
      totalStaked: transformedBets.reduce((sum, bet) => sum + bet.stake, 0),
      totalCashoutAvailable: Math.round(totalCashoutAvailable * 100) / 100,
    },
  });
});

/**
 * GET /api-v2/open-bets/:id
 * Get single open bet details
 */
router.get('/open-bets/:id', (req, res) => {
  const bet = mockBets.find(b => b.id === req.params.id);
  
  if (!bet) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Bet not found' }],
      data: null,
    });
  }

  const openBet = transformToOpenBet(bet);
  
  res.json({
    success: true,
    responseCodes: [],
    data: openBet,
  });
});

/**
 * GET /api-v2/open-bets/:id/cashout
 * Get cashout offer for a specific bet
 */
router.get('/open-bets/:id/cashout', (req, res) => {
  const bet = mockBets.find(b => b.id === req.params.id);
  
  if (!bet) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Bet not found' }],
      data: null,
    });
  }

  const offer = generateCashoutOffer(bet);
  
  res.json({
    success: true,
    responseCodes: [],
    data: offer,
  });
});

/**
 * POST /api-v2/open-bets/:id/cashout/preview
 * Preview cashout (total or partial)
 */
router.post('/open-bets/:id/cashout/preview', (req, res) => {
  const bet = mockBets.find(b => b.id === req.params.id);
  
  if (!bet) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Bet not found' }],
      data: null,
    });
  }

  const { type, percentage = 100 } = req.body;
  const offer = generateCashoutOffer(bet);
  
  if (offer.status === 'unavailable') {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'CASHOUT_UNAVAILABLE', message: 'Cashout not available for this bet' }],
      data: null,
    });
  }

  // Calculate preview amounts
  const selectedPercentage = type === 'partial' ? Math.min(percentage, 100) : 100;
  const cashoutAmount = (offer.availableAmount * selectedPercentage) / 100;
  const remainingAmountInPlay = type === 'partial' 
    ? bet.potentialReturn * (1 - selectedPercentage / 100)
    : 0;
  const remainingPotentialReturn = type === 'partial'
    ? bet.potentialReturn * (1 - selectedPercentage / 100)
    : 0;

  const preview = {
    betId: bet.id,
    type,
    selectedPercentage,
    cashoutAmount: Math.round(cashoutAmount * 100) / 100,
    remainingAmountInPlay: Math.round(remainingAmountInPlay * 100) / 100,
    remainingPotentialReturn: Math.round(remainingPotentialReturn * 100) / 100,
    message: type === 'partial' 
      ? `Retire R$ ${cashoutAmount.toFixed(2)} agora e mantenha R$ ${remainingPotentialReturn.toFixed(2)} em jogo`
      : `Receba R$ ${cashoutAmount.toFixed(2)} agora e encerre sua aposta`,
  };

  res.json({
    success: true,
    responseCodes: [],
    data: preview,
  });
});

/**
 * POST /api-v2/open-bets/:id/cashout/execute
 * Execute cashout (total or partial)
 */
router.post('/open-bets/:id/cashout/execute', (req, res) => {
  const bet = mockBets.find(b => b.id === req.params.id);
  
  if (!bet) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Bet not found' }],
      data: null,
    });
  }

  const { type, percentage = 100 } = req.body;
  const offer = generateCashoutOffer(bet);
  
  if (offer.status === 'unavailable') {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'CASHOUT_UNAVAILABLE', message: 'Cashout not available for this bet' }],
      data: null,
    });
  }

  const selectedPercentage = type === 'partial' ? Math.min(percentage, 100) : 100;
  const cashoutAmount = (offer.availableAmount * selectedPercentage) / 100;
  const remainingAmountInPlay = type === 'partial' 
    ? bet.potentialReturn * (1 - selectedPercentage / 100)
    : 0;
  const remainingPotentialReturn = type === 'partial'
    ? bet.potentialReturn * (1 - selectedPercentage / 100)
    : 0;

  // Store partial cashout info
  const existingData = cashoutStore.get(bet.id) || {
    partialCashouts: [],
    remainingExposure: bet.stake,
    cashedOutAmount: 0,
  };

  if (type === 'partial') {
    existingData.partialCashouts.push({
      percentage: selectedPercentage,
      amount: cashoutAmount,
      timestamp: new Date().toISOString(),
    });
    existingData.remainingExposure = remainingAmountInPlay;
    existingData.cashedOutAmount += cashoutAmount;
    cashoutStore.set(bet.id, existingData);
  } else {
    // Full cashout - mark as cashed out
    existingData.cashedOutAmount += cashoutAmount;
    existingData.remainingExposure = 0;
    cashoutStore.set(bet.id, existingData);
    bet.status = 'cashed_out';
  }

  const result = {
    success: true,
    type,
    amountCredited: Math.round(cashoutAmount * 100) / 100,
    remainingAmountInPlay: Math.round(remainingAmountInPlay * 100) / 100,
    remainingPotentialReturn: Math.round(remainingPotentialReturn * 100) / 100,
    message: type === 'partial'
      ? `Cashout parcial realizado! R$ ${cashoutAmount.toFixed(2)} creditados. R$ ${remainingPotentialReturn.toFixed(2)} continuam em jogo.`
      : `Cashout total realizado! R$ ${cashoutAmount.toFixed(2)} creditados na sua conta.`,
    timestamp: new Date().toISOString(),
    newBalance: mockUser.balance + cashoutAmount,
  };

  res.json({
    success: true,
    responseCodes: [],
    data: result,
  });
});

module.exports = router;
