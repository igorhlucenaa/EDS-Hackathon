/**
 * Guided Bet Builder Routes
 * Mock endpoints for guided bet recommendations
 */

const express = require('express');
const router = express.Router();

// Import mocks
const { mockLiveEvents, mockUpcomingEvents } = require('../data/mocks');

// In-memory store for generated suggestions
const generatedSuggestions = new Map();

// Risk configuration by strategy
const STRATEGY_CONFIG = {
  conservative: {
    riskLevel: 'low',
    titlePrefix: 'Começar com segurança',
    explanation: 'Aposta com menor risco, boa para começar',
    tags: ['Baixo Risco', 'Iniciante'],
  },
  balanced: {
    riskLevel: 'medium',
    titlePrefix: 'Boa para odd equilibrada',
    explanation: 'Equilíbrio entre risco e retorno',
    tags: ['Equilibrada', 'Popular'],
  },
  aggressive: {
    riskLevel: 'high',
    titlePrefix: 'Mais agressiva',
    explanation: 'Maior risco com potencial de retorno mais alto',
    tags: ['Alto Risco', 'Experiente'],
  },
  first_bet: {
    riskLevel: 'low',
    titlePrefix: 'Boa para primeira aposta',
    explanation: 'Aposta simples e segura para começar',
    tags: ['Primeira Aposta', 'Simples'],
  },
  goals_focused: {
    riskLevel: 'medium',
    titlePrefix: 'Foco em gols',
    explanation: 'Mercados relacionados a gols no jogo',
    tags: ['Gols', 'Emoção'],
  },
  live_focused: {
    riskLevel: 'medium',
    titlePrefix: 'Para apostar ao vivo',
    explanation: 'Mercados que funcionam bem durante o jogo',
    tags: ['Ao Vivo', 'Dinâmica'],
  },
  favorites_combo: {
    riskLevel: 'medium',
    titlePrefix: 'Favoritos do jogo',
    explanation: 'Combinação dos favoritos deste evento',
    tags: ['Favoritos', 'Combinada'],
  },
};

/**
 * Generate mock selections based on event and strategy
 */
function generateMockSelections(event, strategy) {
  const selections = [];
  
  const homeTeam = event.home?.name || 'Time Casa';
  const awayTeam = event.away?.name || 'Time Fora';
  
  switch (strategy) {
    case 'conservative':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Match Result',
        marketName: 'Resultado Final',
        label: 'Dupla Chance Casa/Empate',
        outcome: `${homeTeam} ou Empate`,
        odds: 1.35,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
      
    case 'balanced':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Match Result',
        marketName: 'Resultado Final',
        label: 'Casa Vence',
        outcome: homeTeam,
        odds: 1.85,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      selections.push({
        id: `sel-${event.id}-2`,
        marketType: 'Over/Under',
        marketName: 'Mais/Menos 2.5 Gols',
        label: 'Over 2.5',
        outcome: 'Mais de 2.5 gols',
        odds: 1.90,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
      
    case 'aggressive':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Correct Score',
        marketName: 'Placar Exato',
        label: '2-1 Casa',
        outcome: `${homeTeam} 2-1`,
        odds: 8.50,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      selections.push({
        id: `sel-${event.id}-2`,
        marketType: 'Both Teams To Score',
        marketName: 'Ambas Marcam',
        label: 'Sim + Over 3.5',
        outcome: 'Ambas marcam e Over 3.5',
        odds: 3.20,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
      
    case 'first_bet':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Match Result',
        marketName: 'Resultado Final',
        label: 'Casa Vence',
        outcome: homeTeam,
        odds: 1.65,
        isEditable: false,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
      
    case 'goals_focused':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Over/Under',
        marketName: 'Mais/Menos 2.5 Gols',
        label: 'Over 2.5',
        outcome: 'Mais de 2.5 gols',
        odds: 1.75,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      selections.push({
        id: `sel-${event.id}-2`,
        marketType: 'Both Teams To Score',
        marketName: 'Ambas Marcam',
        label: 'Sim',
        outcome: 'Ambas marcam',
        odds: 1.85,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
      
    case 'live_focused':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Next Goal',
        marketName: 'Próximo Gol',
        label: 'Casa Marca',
        outcome: `${homeTeam} marca próximo`,
        odds: 2.10,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
      
    case 'favorites_combo':
      selections.push({
        id: `sel-${event.id}-1`,
        marketType: 'Match Result',
        marketName: 'Resultado Final',
        label: 'Casa Vence',
        outcome: homeTeam,
        odds: 1.75,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      selections.push({
        id: `sel-${event.id}-2`,
        marketType: 'Over/Under',
        marketName: 'Mais/Menos 1.5 Gols',
        label: 'Over 1.5',
        outcome: 'Mais de 1.5 gols',
        odds: 1.30,
        isEditable: true,
        eventId: event.id,
        eventName: `${homeTeam} vs ${awayTeam}`,
      });
      break;
  }
  
  return selections;
}

/**
 * Calculate total odds from selections
 */
function calculateTotalOdds(selections) {
  return selections.reduce((acc, sel) => acc * sel.odds, 1);
}

/**
 * Generate suggestions for an event
 */
function generateEventSuggestions(event) {
  const strategies = ['conservative', 'balanced', 'aggressive', 'first_bet', 'goals_focused'];
  const suggestions = [];
  
  strategies.forEach((strategy, index) => {
    const config = STRATEGY_CONFIG[strategy];
    const selections = generateMockSelections(event, strategy);
    const totalOdds = calculateTotalOdds(selections);
    
    suggestions.push({
      id: `sugg-${event.id}-${index}`,
      eventId: event.id,
      eventName: `${event.home?.name || 'Time Casa'} vs ${event.away?.name || 'Time Fora'}`,
      title: config.titlePrefix,
      subtitle: config.explanation,
      strategy,
      riskLevel: config.riskLevel,
      selections,
      totalOdds: Math.round(totalOdds * 100) / 100,
      explanation: config.explanation,
      tags: config.tags,
      recommendedForProfile: strategy === 'conservative' || strategy === 'first_bet' ? 'beginner' : 'casual',
      potentialReturn: Math.round(totalOdds * 10 * 100) / 100, // Assuming stake of 10
    });
  });
  
  return suggestions;
}

/**
 * Guided bet flow questions
 */
const GUIDED_QUESTIONS = [
  {
    id: 'step-1',
    stepId: 'risk_preference',
    question: 'O que você prefere?',
    description: 'Escolha seu estilo de aposta',
    options: [
      { id: 'low_risk', label: 'Menor risco', description: 'Odds mais baixas, chance maior de acerto', icon: '🛡️', value: 'low' },
      { id: 'balanced_risk', label: 'Odd equilibrada', description: 'Equilíbrio entre risco e retorno', icon: '⚖️', value: 'medium' },
      { id: 'high_risk', label: 'Retorno mais alto', description: 'Maior risco, potencial de ganho maior', icon: '🚀', value: 'high' },
    ],
  },
  {
    id: 'step-2',
    stepId: 'game_expectation',
    question: 'Como você vê esse jogo?',
    description: 'Nos ajude a entender sua expectativa',
    options: [
      { id: 'many_goals', label: 'Jogo com gols', description: 'Espero muitos gols neste jogo', icon: '⚽', value: 'goals' },
      { id: 'balanced_game', label: 'Jogo equilibrado', description: 'Times bem pareados', icon: '🤝', value: 'balanced' },
      { id: 'favorite_strong', label: 'Favorito forte', description: 'Um time é claramente favorito', icon: '⭐', value: 'favorite' },
    ],
  },
  {
    id: 'step-3',
    stepId: 'bet_style',
    question: 'Qual seu estilo?',
    description: 'Como você gosta de apostar',
    options: [
      { id: 'simple', label: 'Simples e direta', description: 'Uma única seleção', icon: '✓', value: 'single' },
      { id: 'combined', label: 'Combinada', description: 'Múltiplas seleções', icon: '🔗', value: 'accumulator' },
    ],
  },
];

/**
 * Generate suggestion based on user choices
 */
function generateSuggestionFromChoices(event, choices) {
  const riskPreference = choices.risk_preference;
  const gameExpectation = choices.game_expectation;
  const betStyle = choices.bet_style;
  
  let strategy = 'balanced';
  
  // Simple logic to determine strategy
  if (riskPreference === 'low') {
    strategy = betStyle === 'single' ? 'conservative' : 'first_bet';
  } else if (riskPreference === 'high') {
    strategy = 'aggressive';
  } else {
    if (gameExpectation === 'goals') {
      strategy = 'goals_focused';
    } else if (gameExpectation === 'favorite') {
      strategy = 'favorites_combo';
    } else {
      strategy = 'balanced';
    }
  }
  
  const config = STRATEGY_CONFIG[strategy];
  const selections = generateMockSelections(event, strategy);
  const totalOdds = calculateTotalOdds(selections);
  
  return {
    id: `generated-${event.id}-${Date.now()}`,
    eventId: event.id,
    eventName: `${event.home?.name || 'Time Casa'} vs ${event.away?.name || 'Time Fora'}`,
    title: 'Aposta Montada para Você',
    subtitle: `Baseado em: ${config.titlePrefix}`,
    strategy,
    riskLevel: config.riskLevel,
    selections,
    totalOdds: Math.round(totalOdds * 100) / 100,
    explanation: `Esta aposta foi montada considerando suas escolhas: preferência por ${riskPreference === 'low' ? 'menor risco' : riskPreference === 'high' ? 'maior retorno' : 'equilíbrio'}, expectativa de ${gameExpectation === 'goals' ? 'jogo com gols' : gameExpectation === 'favorite' ? 'favorito forte' : 'jogo equilibrado'}.`,
    tags: ['Montada para Você', ...config.tags],
    recommendedForProfile: 'casual',
    potentialReturn: Math.round(totalOdds * 10 * 100) / 100,
  };
}

/**
 * GET /api-v2/events/:id/guided-bets
 * Get ready-made bet suggestions for an event
 */
router.get('/events/:id/guided-bets', (req, res) => {
  const eventId = req.params.id;
  
  // Find event in mocks
  const allEvents = [...mockLiveEvents, ...mockUpcomingEvents];
  const event = allEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Event not found' }],
      data: null,
    });
  }
  
  const suggestions = generateEventSuggestions(event);
  
  res.json({
    success: true,
    responseCodes: [],
    data: {
      eventId,
      eventName: `${event.home?.name || 'Time Casa'} vs ${event.away?.name || 'Time Fora'}`,
      suggestions,
      guidedQuestions: GUIDED_QUESTIONS,
    },
  });
});

/**
 * GET /api-v2/events/:id/guided-bets/strategies
 * Get available strategies
 */
router.get('/events/:id/guided-bets/strategies', (req, res) => {
  const strategies = Object.entries(STRATEGY_CONFIG).map(([key, config]) => ({
    id: key,
    ...config,
  }));
  
  res.json({
    success: true,
    responseCodes: [],
    data: strategies,
  });
});

/**
 * POST /api-v2/events/:id/guided-bets/generate
 * Generate a suggestion based on user choices
 */
router.post('/events/:id/guided-bets/generate', (req, res) => {
  const eventId = req.params.id;
  const { choices } = req.body;
  
  // Find event in mocks
  const allEvents = [...mockLiveEvents, ...mockUpcomingEvents];
  const event = allEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Event not found' }],
      data: null,
    });
  }
  
  if (!choices || Object.keys(choices).length === 0) {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'INVALID_CHOICES', message: 'No choices provided' }],
      data: null,
    });
  }
  
  const suggestion = generateSuggestionFromChoices(event, choices);
  
  // Store generated suggestion
  generatedSuggestions.set(suggestion.id, suggestion);
  
  res.json({
    success: true,
    responseCodes: [],
    data: suggestion,
  });
});

/**
 * POST /api-v2/events/:id/guided-bets/recalculate
 * Recalculate odds after editing selections
 */
router.post('/events/:id/guided-bets/recalculate', (req, res) => {
  const { selections } = req.body;
  
  if (!selections || selections.length === 0) {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'INVALID_SELECTIONS', message: 'No selections provided' }],
      data: null,
    });
  }
  
  const totalOdds = calculateTotalOdds(selections);
  
  // Determine risk level based on odds
  let riskLevel = 'medium';
  if (totalOdds < 2.0) riskLevel = 'low';
  else if (totalOdds > 5.0) riskLevel = 'high';
  
  res.json({
    success: true,
    responseCodes: [],
    data: {
      selections,
      totalOdds: Math.round(totalOdds * 100) / 100,
      riskLevel,
      explanation: riskLevel === 'low' ? 'Aposta mais conservadora' : riskLevel === 'high' ? 'Aposta mais agressiva' : 'Aposta equilibrada',
    },
  });
});

module.exports = router;
