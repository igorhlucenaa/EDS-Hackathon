const express = require('express');
const router = express.Router();

// Dados mockados em memória
let mockMissions = [];
let mockRewards = [];
let mockSummary = {
  profile: 'beginner',
  level: 1,
  currentXp: 0,
  nextLevelXp: 100,
  streak: 0,
  totalMissionsCompleted: 0,
  totalRewardsClaimed: 0,
};

// Templates de missões por perfil
const MISSION_TEMPLATES = {
  daily: {
    beginner: [
      {
        title: 'Primeiros Passos',
        description: 'Visualize 2 jogos diferentes',
        icon: '👁️',
        targetAction: 'view_match',
        targetCount: 2,
        rewards: [
          { type: 'badge', title: 'Explorador', description: 'Visualizou seus primeiros jogos', icon: '🥾' },
        ],
      },
      {
        title: 'Aposta Inicial',
        description: 'Faça sua primeira aposta simples',
        icon: '🎯',
        targetAction: 'place_bet_single',
        targetCount: 1,
        rewards: [
          { type: 'freebet', title: 'Freebet de Boas-vindas', description: 'R$ 5 para apostar', icon: '🎁', value: 5 },
        ],
      },
    ],
    casual: [
      {
        title: 'Explorador de Mercados',
        description: 'Explore 3 mercados diferentes hoje',
        icon: '🔍',
        targetAction: 'explore_new_market',
        targetCount: 3,
        rewards: [
          { type: 'odds_boost', title: 'Odds Boost', description: '+10% nas odds por 24h', icon: '⚡', value: 10 },
        ],
      },
      {
        title: 'Aposta ao Vivo',
        description: 'Visite a tela de jogos ao vivo',
        icon: '🔴',
        targetAction: 'visit_live_screen',
        targetCount: 1,
        rewards: [
          { type: 'badge', title: 'Ao Vivo', description: 'Explorou apostas em tempo real', icon: '📺' },
        ],
      },
    ],
    engaged: [
      {
        title: 'Mestre das Apostas',
        description: 'Faça 3 apostas hoje',
        icon: '🏆',
        targetAction: 'place_bet_single',
        targetCount: 3,
        rewards: [
          { type: 'freebet', title: 'Freebet Premium', description: 'R$ 15 para apostar', icon: '💎', value: 15 },
        ],
      },
      {
        title: 'Múltipla do Dia',
        description: 'Faça uma aposta múltipla',
        icon: '📊',
        targetAction: 'place_bet_multiple',
        targetCount: 1,
        rewards: [
          { type: 'odds_boost', title: 'Super Boost', description: '+15% nas odds por 24h', icon: '🚀', value: 15 },
        ],
      },
    ],
    returning: [
      {
        title: 'De Volta à Ação',
        description: 'Faça 1 aposta qualquer',
        icon: '🔥',
        targetAction: 'place_bet_single',
        targetCount: 1,
        rewards: [
          { type: 'freebet', title: 'Freebet de Retorno', description: 'R$ 10 para voltar com tudo', icon: '🎉', value: 10 },
        ],
      },
    ],
  },
  weekly: {
    beginner: [
      {
        title: 'Consistência Semanal',
        description: 'Abra o app 3 dias nesta semana',
        icon: '📅',
        targetAction: 'open_app',
        targetCount: 3,
        rewards: [
          { type: 'badge', title: 'Consistente', description: '3 dias de app na semana', icon: '📆' },
        ],
      },
    ],
    casual: [
      {
        title: 'Apostador da Semana',
        description: 'Aposte em 2 dias diferentes',
        icon: '📈',
        targetAction: 'place_bet_single',
        targetCount: 2,
        rewards: [
          { type: 'freebet', title: 'Freebet Semanal', description: 'R$ 20 de recompensa', icon: '💰', value: 20 },
        ],
      },
    ],
    engaged: [
      {
        title: 'Streak de Apostas',
        description: 'Aposte 4 dias seguidos',
        icon: '🔥',
        targetAction: 'place_bet_single',
        targetCount: 4,
        rewards: [
          { type: 'special_mission', title: 'Missão Secreta', description: 'Desbloqueie uma missão especial', icon: '🔓' },
        ],
      },
    ],
    returning: [
      {
        title: 'Retorno Completo',
        description: 'Volte por 2 dias seguidos',
        icon: '🔄',
        targetAction: 'open_app',
        targetCount: 2,
        rewards: [
          { type: 'odds_boost', title: 'Boost de Retorno', description: '+20% por 48h', icon: '🚀', value: 20 },
        ],
      },
    ],
  },
};

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateMission = (template, frequency, profile, order) => {
  const now = new Date();
  const expiresAt = frequency === 'daily'
    ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: `mission_${generateId()}`,
    title: template.title,
    description: template.description,
    icon: template.icon,
    frequency,
    targetProfile: [profile],
    targetAction: template.targetAction,
    targetCount: template.targetCount,
    currentCount: 0,
    status: 'available',
    progress: 0,
    rewards: template.rewards.map((r) => ({
      ...r,
      id: `reward_${generateId()}`,
      status: 'locked',
      expiresAt: frequency === 'daily'
        ? new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString()
        : new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    })),
    startsAt: now.toISOString(),
    expiresAt,
    order,
  };
};

const generateMissionsForProfile = (profile) => {
  const daily = MISSION_TEMPLATES.daily[profile] || [];
  const weekly = MISSION_TEMPLATES.weekly[profile] || [];

  return [
    ...daily.map((t, i) => generateMission(t, 'daily', profile, i)),
    ...weekly.map((t, i) => generateMission(t, 'weekly', profile, i)),
  ];
};

// GET /api-v2/missions - Retorna todas as missões do usuário
router.get('/missions', (req, res) => {
  const profile = req.query.profile || 'beginner';

  // Se não houver missões, gerar novas
  if (mockMissions.length === 0) {
    mockMissions = generateMissionsForProfile(profile);
  }

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      missions: mockMissions,
      summary: mockSummary,
    },
  });
});

// GET /api-v2/missions/summary - Retorna resumo para o card da home
router.get('/missions/summary', (req, res) => {
  const profile = req.query.profile || mockSummary.profile;
  const dailyMission = mockMissions.find((m) => m.frequency === 'daily' && (m.status === 'available' || m.status === 'in_progress'));
  const weeklyMission = mockMissions.find((m) => m.frequency === 'weekly' && (m.status === 'available' || m.status === 'in_progress'));
  const hasReward = mockRewards.some((r) => r.status === 'available') || mockMissions.some((m) => m.rewards?.some((r) => r.status === 'available'));

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      dailyMission: dailyMission || null,
      weeklyMission: weeklyMission || null,
      currentStreak: mockSummary.streak,
      level: mockSummary.level,
      xpProgress: Math.round((mockSummary.currentXp / mockSummary.nextLevelXp) * 100),
      totalXp: (mockSummary.level - 1) * 100 + mockSummary.currentXp,
      nextLevelXp: mockSummary.nextLevelXp,
      hasAvailableReward: hasReward,
      profile,
      totalMissionsCompleted: mockSummary.totalMissionsCompleted,
    },
  });
});

// POST /api-v2/missions/track - Registra uma ação do usuário
router.post('/missions/track', (req, res) => {
  const { action, metadata } = req.body;

  // Atualizar missões baseado na ação
  let updatedMissions = [];
  let completedMissionIds = [];
  let newlyAvailableRewards = [];

  mockMissions = mockMissions.map((mission) => {
    if (mission.status !== 'available' && mission.status !== 'in_progress') return mission;
    if (mission.targetAction !== action) return mission;

    const newCount = Math.min(mission.currentCount + 1, mission.targetCount);
    const progress = Math.round((newCount / mission.targetCount) * 100);
    const isCompleted = newCount >= mission.targetCount;

    if (isCompleted && mission.status !== 'completed') {
      completedMissionIds.push(mission.id);
      newlyAvailableRewards = [...newlyAvailableRewards, ...mission.rewards.map((r) => ({ ...r, status: 'available' }))];
      mockSummary.totalMissionsCompleted++;
    }

    return {
      ...mission,
      currentCount: newCount,
      progress,
      status: isCompleted ? 'completed' : 'in_progress',
      completedAt: isCompleted ? new Date().toISOString() : undefined,
      rewards: mission.rewards.map((r) => ({
        ...r,
        status: isCompleted ? 'available' : r.status,
      })),
    };
  });

  // Adicionar XP
  const xpGained = completedMissionIds.length * 20;
  mockSummary.currentXp += xpGained;
  if (mockSummary.currentXp >= mockSummary.nextLevelXp) {
    mockSummary.level++;
    mockSummary.currentXp = mockSummary.currentXp % mockSummary.nextLevelXp;
  }

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      xpGained,
      completedMissions: completedMissionIds.length,
      newRewards: newlyAvailableRewards.length,
      summary: mockSummary,
    },
  });
});

// POST /api-v2/missions/:id/claim - Resgata recompensas de uma missão
router.post('/missions/:id/claim', (req, res) => {
  const missionId = req.params.id;
  const mission = mockMissions.find((m) => m.id === missionId);

  if (!mission) {
    return res.status(404).json({
      success: false,
      responseCodes: [{ code: 'NOT_FOUND', message: 'Missão não encontrada' }],
      data: null,
    });
  }

  if (mission.status !== 'completed') {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'INVALID_STATE', message: 'Missão não está completada' }],
      data: null,
    });
  }

  // Atualizar status da missão e recompensas
  mockMissions = mockMissions.map((m) => {
    if (m.id === missionId) {
      return {
        ...m,
        status: 'claimed',
        rewards: m.rewards.map((r) => ({
          ...r,
          status: 'claimed',
          claimedAt: new Date().toISOString(),
        })),
      };
    }
    return m;
  });

  mockSummary.totalRewardsClaimed += mission.rewards.length;

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      missionId,
      claimedRewards: mission.rewards.length,
      summary: mockSummary,
    },
  });
});

// POST /api-v2/missions/refresh - Gera novas missões
router.post('/missions/refresh', (req, res) => {
  const { profile = 'beginner', type = 'daily' } = req.body;

  const templates = MISSION_TEMPLATES[type]?.[profile] || [];
  const newMissions = templates.map((t, i) => generateMission(t, type, profile, i));

  // Substituir missões antigas do mesmo tipo
  mockMissions = [...mockMissions.filter((m) => m.frequency !== type), ...newMissions];

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      missions: newMissions,
      count: newMissions.length,
    },
  });
});

// GET /api-v2/rewards - Retorna recompensas do usuário
router.get('/rewards', (req, res) => {
  const allRewards = mockMissions.flatMap((m) => m.rewards || []);

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      rewards: allRewards,
      available: allRewards.filter((r) => r.status === 'available').length,
      claimed: allRewards.filter((r) => r.status === 'claimed').length,
    },
  });
});

// POST /api-v2/rewards/:id/claim - Resgata uma recompensa
router.post('/rewards/:id/claim', (req, res) => {
  const rewardId = req.params.id;

  let claimed = false;
  mockMissions = mockMissions.map((m) => ({
    ...m,
    rewards: m.rewards.map((r) => {
      if (r.id === rewardId && r.status === 'available') {
        claimed = true;
        return { ...r, status: 'claimed', claimedAt: new Date().toISOString() };
      }
      return r;
    }),
  }));

  if (!claimed) {
    return res.status(400).json({
      success: false,
      responseCodes: [{ code: 'INVALID_STATE', message: 'Recompensa não disponível' }],
      data: null,
    });
  }

  mockSummary.totalRewardsClaimed++;

  res.json({
    success: true,
    responseCodes: [{ code: 'OK' }],
    data: {
      rewardId,
      claimed: true,
    },
  });
});

module.exports = router;
