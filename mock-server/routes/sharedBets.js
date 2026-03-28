const express = require('express');
const router = express.Router();

// Armazenamento em memória para bilhetes compartilhados (em produção, use banco de dados)
const sharedBets = new Map();

/**
 * POST /api/shared-bets/create
 * Cria um novo bilhete compartilhado
 */
router.post('/create', (req, res) => {
  const { selections, stake, totalOdds, potentialReturn, createdBy } = req.body;

  // Gera código único de 8 caracteres
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const sharedBet = {
    id: `shared-${Date.now()}`,
    code,
    selections: selections || [],
    stake: stake || 10,
    totalOdds: totalOdds || 1,
    potentialReturn: potentialReturn || 0,
    createdBy: createdBy || 'anonymous',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    views: 0
  };

  sharedBets.set(code, sharedBet);

  // Gera URLs para compartilhamento
  const baseUrl = process.env.DEEP_LINK_BASE_URL || 'swiftbet://';
  const webUrl = process.env.WEB_URL || 'https://swiftbet.app';

  const response = {
    success: true,
    responseCodes: [{ code: 'OK', message: 'Shared bet created' }],
    data: {
      code,
      deepLink: `${baseUrl}shared-bet/${code}`,
      webLink: `${webUrl}/shared-bet/${code}`,
      shareMessage: generateShareMessage(sharedBet, code),
      bet: {
        id: sharedBet.id,
        selectionsCount: sharedBet.selections.length,
        totalOdds: sharedBet.totalOdds,
        potentialReturn: sharedBet.potentialReturn,
        stake: sharedBet.stake
      }
    }
  };

  res.json(response);
});

/**
 * GET /api/shared-bets/:code
 * Busca um bilhete compartilhado pelo código
 */
router.get('/:code', (req, res) => {
  const { code } = req.params;
  const upperCode = code.toUpperCase();

  const sharedBet = sharedBets.get(upperCode);

  if (!sharedBet) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Shared bet not found or expired' }],
      data: null
    });
  }

  // Verifica se expirou
  if (new Date(sharedBet.expiresAt) < new Date()) {
    sharedBets.delete(upperCode);
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'EXPIRED', message: 'Shared bet has expired' }],
      data: null
    });
  }

  // Incrementa visualizações
  sharedBet.views++;

  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      bet: sharedBet,
      shareLinks: {
        deepLink: `swiftbet://shared-bet/${upperCode}`,
        webLink: `https://swiftbet.app/shared-bet/${upperCode}`
      }
    }
  };

  res.json(response);
});

/**
 * GET /api/shared-bets/:code/stats
 * Retorna estatísticas de um bilhete compartilhado
 */
router.get('/:code/stats', (req, res) => {
  const { code } = req.params;
  const upperCode = code.toUpperCase();

  const sharedBet = sharedBets.get(upperCode);

  if (!sharedBet) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Shared bet not found' }],
      data: null
    });
  }

  const response = {
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      code: upperCode,
      views: sharedBet.views,
      createdAt: sharedBet.createdAt,
      expiresAt: sharedBet.expiresAt,
      daysRemaining: Math.ceil((new Date(sharedBet.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    }
  };

  res.json(response);
});

/**
 * DELETE /api/shared-bets/:code
 * Remove um bilhete compartilhado (apenas pelo criador)
 */
router.delete('/:code', (req, res) => {
  const { code } = req.params;
  const upperCode = code.toUpperCase();

  if (!sharedBets.has(upperCode)) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Shared bet not found' }],
      data: null
    });
  }

  sharedBets.delete(upperCode);

  res.json({
    success: true,
    responseCodes: [{ code: 'OK', message: 'Shared bet deleted' }],
    data: { code: upperCode }
  });
});

/**
 * Gera mensagem formatada para compartilhamento
 */
function generateShareMessage(bet, code) {
  const selectionsText = bet.selections
    .map((sel, idx) => {
      const teams = `${sel.event?.home?.name || sel.event?.homeTeam?.name || 'Time A'} × ${sel.event?.away?.name || sel.event?.awayTeam?.name || 'Time B'}`;
      return `${idx + 1}. ${teams}\n   ${sel.marketName} - ${sel.outcomeName} (@${sel.odds.toFixed(2)})`;
    })
    .join('\n\n');

  return `🎫 Bilhete SwiftBet #${code}\n\n` +
    `${selectionsText}\n\n` +
    `💰 Valor: R$ ${bet.stake.toFixed(2)}\n` +
    `📊 Odds: ${bet.totalOdds.toFixed(2)}\n` +
    `🎯 Retorno: R$ ${bet.potentialReturn.toFixed(2)}\n\n` +
    `👉 Abra no app: swiftbet://shared-bet/${code}\n` +
    `🌐 Ou no navegador: https://swiftbet.app/shared-bet/${code}\n\n` +
    `Aposte você também! 🍀`;
}

module.exports = router;
