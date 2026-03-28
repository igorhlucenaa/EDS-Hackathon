import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Mission,
  MissionSummary,
  UserGamificationState,
  UserProfile,
  UserActionType,
  UserActionEvent,
  Reward,
} from '../../../shared/types';

interface MissionStore extends UserGamificationState {
  // Actions
  setProfile: (profile: UserProfile) => void;
  loadMissions: (missions: Mission[]) => void;
  trackAction: (action: UserActionType, metadata?: Record<string, unknown>) => void;
  completeMission: (missionId: string) => void;
  claimReward: (rewardId: string) => void;
  updateStreak: () => void;
  refreshDailyMissions: () => void;
  refreshWeeklyMissions: () => void;
  calculateProfile: () => UserProfile;
  getSummary: () => MissionSummary;
  addXp: (amount: number) => void;
  checkLevelUp: () => boolean;
  // Computed
  getAvailableRewards: () => Reward[];
  getCompletedMissionsCount: () => number;
}

const XP_PER_LEVEL = 100;
const STREAK_DAYS_FOR_BONUS = 7;

const calculateLevel = (xp: number): { level: number; currentXp: number; nextLevelXp: number } => {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentXp = xp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  return { level, currentXp, nextLevelXp };
};

const generateMissionId = (): string => {
  return `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRewardId = (): string => {
  return `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Missões padrão por perfil
const DEFAULT_DAILY_MISSIONS: Record<UserProfile, Partial<Mission>[]> = {
  beginner: [
    {
      title: 'Primeiros Passos',
      description: 'Visualize 2 jogos diferentes',
      icon: '👁️',
      targetAction: 'view_match',
      targetCount: 2,
      rewards: [
        { type: 'badge', title: 'Explorador', description: 'Visualizou seus primeiros jogos', icon: '🥾', status: 'locked' },
      ],
    },
    {
      title: 'Aposta Inicial',
      description: 'Faça sua primeira aposta simples',
      icon: '🎯',
      targetAction: 'place_bet_single',
      targetCount: 1,
      rewards: [
        { type: 'freebet', title: 'Freebet de Boas-vindas', description: 'R$ 5 para apostar', icon: '🎁', value: 5, status: 'locked' },
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
        { type: 'odds_boost', title: 'Odds Boost', description: '+10% nas odds por 24h', icon: '⚡', value: 10, status: 'locked' },
      ],
    },
    {
      title: 'Aposta ao Vivo',
      description: 'Visite a tela de jogos ao vivo',
      icon: '🔴',
      targetAction: 'visit_live_screen',
      targetCount: 1,
      rewards: [
        { type: 'badge', title: 'Ao Vivo', description: 'Explorou apostas em tempo real', icon: '📺', status: 'locked' },
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
        { type: 'freebet', title: 'Freebet Premium', description: 'R$ 15 para apostar', icon: '💎', value: 15, status: 'locked' },
      ],
    },
    {
      title: 'Múltipla do Dia',
      description: 'Faça uma aposta múltipla',
      icon: '📊',
      targetAction: 'place_bet_multiple',
      targetCount: 1,
      rewards: [
        { type: 'odds_boost', title: 'Super Boost', description: '+15% nas odds por 24h', icon: '🚀', value: 15, status: 'locked' },
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
        { type: 'freebet', title: 'Freebet de Retorno', description: 'R$ 10 para voltar com tudo', icon: '🎉', value: 10, status: 'locked' },
      ],
    },
    {
      title: 'Retorno Triunfal',
      description: 'Complete 2 missões hoje',
      icon: '⭐',
      targetAction: 'claim_reward',
      targetCount: 2,
      rewards: [
        { type: 'surprise', title: 'Recompensa Surpresa', description: 'Algo especial te espera', icon: '🎁', status: 'locked' },
      ],
    },
  ],
};

const DEFAULT_WEEKLY_MISSIONS: Record<UserProfile, Partial<Mission>[]> = {
  beginner: [
    {
      title: 'Consistência Semanal',
      description: 'Abra o app 3 dias nesta semana',
      icon: '📅',
      targetAction: 'open_app',
      targetCount: 3,
      rewards: [
        { type: 'badge', title: 'Consistente', description: '3 dias de app na semana', icon: '📆', status: 'locked' },
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
        { type: 'freebet', title: 'Freebet Semanal', description: 'R$ 20 de recompensa', icon: '💰', value: 20, status: 'locked' },
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
        { type: 'special_mission', title: 'Missão Secreta', description: 'Desbloqueie uma missão especial', icon: '🔓', status: 'locked' },
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
        { type: 'odds_boost', title: 'Boost de Retorno', description: '+20% por 48h', icon: '🚀', value: 20, status: 'locked' },
      ],
    },
  ],
};

const generateMissionFromTemplate = (
  template: Partial<Mission>,
  frequency: 'daily' | 'weekly',
  profile: UserProfile,
  order: number
): Mission => {
  const now = new Date();
  const expiresAt = frequency === 'daily'
    ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: generateMissionId(),
    title: template.title!,
    description: template.description!,
    icon: template.icon!,
    frequency,
    targetProfile: [profile],
    targetAction: template.targetAction!,
    targetCount: template.targetCount!,
    currentCount: 0,
    status: 'available',
    progress: 0,
    rewards: template.rewards?.map((r) => ({
      ...r,
      id: generateRewardId(),
      expiresAt: frequency === 'daily'
        ? new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString()
        : new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    })) || [],
    startsAt: now.toISOString(),
    expiresAt,
    order,
  };
};

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      profile: 'beginner',
      level: 1,
      currentXp: 0,
      nextLevelXp: XP_PER_LEVEL,
      streak: 0,
      lastActiveAt: new Date().toISOString(),
      totalMissionsCompleted: 0,
      totalRewardsClaimed: 0,
      dailyMissions: [],
      weeklyMissions: [],
      specialMissions: [],
      rewards: [],
      completedMissionIds: [],
      claimedRewardIds: [],

      setProfile: (profile) => set({ profile }),

      loadMissions: (missions) => {
        const daily = missions.filter((m) => m.frequency === 'daily');
        const weekly = missions.filter((m) => m.frequency === 'weekly');
        const special = missions.filter((m) => m.frequency === 'special');
        set({ dailyMissions: daily, weeklyMissions: weekly, specialMissions: special });
      },

      trackAction: (action, metadata) => {
        const state = get();
        const now = new Date().toISOString();

        // Registrar ação
        const actionEvent: UserActionEvent = {
          id: `action_${Date.now()}`,
          type: action,
          timestamp: now,
          metadata,
        };

        // Atualizar missões
        const updateMission = (mission: Mission): Mission => {
          if (mission.status !== 'available' && mission.status !== 'in_progress') return mission;
          if (mission.targetAction !== action) return mission;

          const newCount = Math.min(mission.currentCount + 1, mission.targetCount);
          const progress = Math.round((newCount / mission.targetCount) * 100);
          const isCompleted = newCount >= mission.targetCount;

          return {
            ...mission,
            currentCount: newCount,
            progress,
            status: isCompleted ? 'completed' : 'in_progress',
            completedAt: isCompleted ? now : undefined,
            rewards: mission.rewards.map((r) => ({
              ...r,
              status: isCompleted ? 'available' : r.status,
            })),
          };
        };

        const updatedDaily = state.dailyMissions.map(updateMission);
        const updatedWeekly = state.weeklyMissions.map(updateMission);
        const updatedSpecial = state.specialMissions.map(updateMission);

        // Verificar novas missões completadas
        const allMissions = [...updatedDaily, ...updatedWeekly, ...updatedSpecial];
        const newlyCompleted = allMissions.filter(
          (m) => m.status === 'completed' && !state.completedMissionIds.includes(m.id)
        );

        const newCompletedIds = newlyCompleted.map((m) => m.id);
        const newRewards = newlyCompleted.flatMap((m) =>
          m.rewards.filter((r) => r.status === 'available')
        );

        // Atualizar XP
        const xpGained = newlyCompleted.length * 20;
        const newTotalXp = state.currentXp + (state.level - 1) * XP_PER_LEVEL + xpGained;
        const { level, currentXp, nextLevelXp } = calculateLevel(newTotalXp);

        set({
          dailyMissions: updatedDaily,
          weeklyMissions: updatedWeekly,
          specialMissions: updatedSpecial,
          completedMissionIds: [...state.completedMissionIds, ...newCompletedIds],
          totalMissionsCompleted: state.totalMissionsCompleted + newlyCompleted.length,
          rewards: [...state.rewards, ...newRewards],
          currentXp,
          nextLevelXp,
          level,
        });

        // Verificar streak
        if (action === 'open_app') {
          get().updateStreak();
        }
      },

      completeMission: (missionId) => {
        const state = get();
        const mission = [...state.dailyMissions, ...state.weeklyMissions, ...state.specialMissions]
          .find((m) => m.id === missionId);

        if (!mission || mission.status !== 'completed') return;

        const updatedRewards = mission.rewards.map((r) => ({
          ...r,
          status: 'claimed' as const,
          claimedAt: new Date().toISOString(),
        }));

        const updateMission = (m: Mission): Mission =>
          m.id === missionId
            ? { ...m, status: 'claimed', rewards: updatedRewards }
            : m;

        set({
          dailyMissions: state.dailyMissions.map(updateMission),
          weeklyMissions: state.weeklyMissions.map(updateMission),
          specialMissions: state.specialMissions.map(updateMission),
          totalRewardsClaimed: state.totalRewardsClaimed + mission.rewards.length,
          claimedRewardIds: [...state.claimedRewardIds, ...mission.rewards.map((r) => r.id)],
        });
      },

      claimReward: (rewardId) => {
        const state = get();
        const reward = state.rewards.find((r) => r.id === rewardId);
        if (!reward || reward.status !== 'available') return;

        set({
          rewards: state.rewards.map((r) =>
            r.id === rewardId ? { ...r, status: 'claimed', claimedAt: new Date().toISOString() } : r
          ),
          claimedRewardIds: [...state.claimedRewardIds, rewardId],
          totalRewardsClaimed: state.totalRewardsClaimed + 1,
        });
      },

      updateStreak: () => {
        const state = get();
        const now = new Date();
        const lastActive = new Date(state.lastActiveAt);

        const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = state.streak;
        if (diffDays === 1) {
          newStreak = state.streak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }

        set({
          streak: newStreak,
          lastActiveAt: now.toISOString(),
        });

        // Bônus de streak
        if (newStreak % STREAK_DAYS_FOR_BONUS === 0 && newStreak > 0) {
          const streakReward: Reward = {
            id: generateRewardId(),
            type: 'surprise',
            title: `Bônus de ${newStreak} Dias!`,
            description: 'Você mantém sua consistência!',
            icon: '🔥',
            status: 'available',
          };
          set({ rewards: [...get().rewards, streakReward] });
        }
      },

      refreshDailyMissions: () => {
        const state = get();
        const profile = state.profile;
        const templates = DEFAULT_DAILY_MISSIONS[profile];
        const newMissions = templates.map((t, i) => generateMissionFromTemplate(t, 'daily', profile, i));
        set({ dailyMissions: newMissions });
      },

      refreshWeeklyMissions: () => {
        const state = get();
        const profile = state.profile;
        const templates = DEFAULT_WEEKLY_MISSIONS[profile];
        const newMissions = templates.map((t, i) => generateMissionFromTemplate(t, 'weekly', profile, i));
        set({ weeklyMissions: newMissions });
      },

      calculateProfile: () => {
        const state = get();
        const totalActions = state.totalMissionsCompleted * 2 + state.streak;

        let newProfile: UserProfile = state.profile;
        if (totalActions < 5) {
          newProfile = 'beginner';
        } else if (totalActions < 15) {
          newProfile = 'casual';
        } else if (state.streak >= 5) {
          newProfile = 'engaged';
        } else if (newProfile === 'engaged' && state.streak === 0) {
          newProfile = 'returning';
        }

        if (newProfile !== state.profile) {
          set({ profile: newProfile });
        }
        return newProfile;
      },

      getSummary: () => {
        const state = get();
        const availableDaily = state.dailyMissions.find((m) => m.status === 'available' || m.status === 'in_progress');
        const availableWeekly = state.weeklyMissions.find((m) => m.status === 'available' || m.status === 'in_progress');
        const hasReward = state.rewards.some((r) => r.status === 'available');

        return {
          dailyMission: availableDaily || null,
          weeklyMission: availableWeekly || null,
          currentStreak: state.streak,
          level: state.level,
          xpProgress: Math.round((state.currentXp / state.nextLevelXp) * 100),
          totalXp: (state.level - 1) * XP_PER_LEVEL + state.currentXp,
          nextLevelXp: state.nextLevelXp,
          hasAvailableReward: hasReward,
          profile: state.profile,
          totalMissionsCompleted: state.totalMissionsCompleted,
        };
      },

      getAvailableRewards: () => {
        return get().rewards.filter((r) => r.status === 'available');
      },

      getCompletedMissionsCount: () => {
        return get().completedMissionIds.length;
      },

      addXp: (amount) => {
        const state = get();
        const newTotalXp = (state.level - 1) * XP_PER_LEVEL + state.currentXp + amount;
        const { level, currentXp, nextLevelXp } = calculateLevel(newTotalXp);
        set({ level, currentXp, nextLevelXp });
      },

      checkLevelUp: () => {
        const state = get();
        return state.currentXp >= state.nextLevelXp;
      },
    }),
    {
      name: 'eds-missions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
