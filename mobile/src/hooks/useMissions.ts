import { useCallback, useEffect, useState } from 'react';
import { requestJson } from '../api/http';
import { buildApiV2Url } from '../api/config';
import { useMissionStore } from '../stores/missionStore';
import type {
  Mission,
  MissionSummary,
  UserActionType,
} from '../../../shared/types';

export interface UseMissionsState {
  missions: Mission[];
  summary: MissionSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook principal para gerenciar missões
 */
export function useMissions(): UseMissionsState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    dailyMissions,
    weeklyMissions,
    specialMissions,
    profile,
    streak,
    level,
    currentXp,
    nextLevelXp,
    rewards,
    loadMissions,
  } = useMissionStore();

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await requestJson<{
        success: boolean;
        data: {
          missions: Mission[];
          summary: MissionSummary;
        };
      }>(buildApiV2Url(`/missions?profile=${profile}`));

      if (response.success && response.data) {
        loadMissions(response.data.missions);
      }
    } catch (err) {
      console.error('Error fetching missions:', err);
      setError('Falha ao carregar missões');
    } finally {
      setLoading(false);
    }
  }, [profile, loadMissions]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const missions = [...dailyMissions, ...weeklyMissions, ...specialMissions];

  const summary: MissionSummary = {
    dailyMission: dailyMissions.find((m) => m.status === 'available' || m.status === 'in_progress') || null,
    weeklyMission: weeklyMissions.find((m) => m.status === 'available' || m.status === 'in_progress') || null,
    currentStreak: streak,
    level,
    xpProgress: Math.round((currentXp / nextLevelXp) * 100),
    totalXp: (level - 1) * 100 + currentXp,
    nextLevelXp,
    hasAvailableReward: rewards.some((r) => r.status === 'available'),
    profile,
    totalMissionsCompleted: useMissionStore.getState().totalMissionsCompleted,
  };

  return {
    missions,
    summary,
    loading,
    error,
    refetch: fetchMissions,
  };
}

/**
 * Hook para resumo de missões (card da home)
 */
export function useMissionSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<MissionSummary | null>(null);

  const { profile, streak, level, currentXp, nextLevelXp, rewards, dailyMissions, weeklyMissions } = useMissionStore();

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await requestJson<{
        success: boolean;
        data: MissionSummary;
      }>(buildApiV2Url(`/missions/summary?profile=${profile}`));

      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      // Fallback para store local
      setSummary({
        dailyMission: dailyMissions.find((m) => m.status === 'available' || m.status === 'in_progress') || null,
        weeklyMission: weeklyMissions.find((m) => m.status === 'available' || m.status === 'in_progress') || null,
        currentStreak: streak,
        level,
        xpProgress: Math.round((currentXp / nextLevelXp) * 100),
        totalXp: (level - 1) * 100 + currentXp,
        nextLevelXp,
        hasAvailableReward: rewards.some((r) => r.status === 'available'),
        profile,
        totalMissionsCompleted: useMissionStore.getState().totalMissionsCompleted,
      });
    } finally {
      setLoading(false);
    }
  }, [profile, dailyMissions, weeklyMissions, streak, level, currentXp, nextLevelXp, rewards]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
}

/**
 * Hook para tracking de ações do usuário
 */
export function useMissionTracking() {
  const { trackAction: storeTrackAction, calculateProfile, updateStreak } = useMissionStore();
  const [tracking, setTracking] = useState(false);

  const trackAction = useCallback(
    async (action: UserActionType, metadata?: Record<string, unknown>) => {
      try {
        setTracking(true);

        // Track local
        storeTrackAction(action, metadata);

        // Sync with mock server
        await requestJson(buildApiV2Url('/missions/track'), {
          method: 'POST',
          body: { action, metadata },
        });

        // Update streak for app open
        if (action === 'open_app') {
          updateStreak();
        }

        // Recalculate profile periodically
        if (Math.random() < 0.3) {
          calculateProfile();
        }
      } catch (err) {
        console.error('Error tracking action:', err);
      } finally {
        setTracking(false);
      }
    },
    [storeTrackAction, calculateProfile, updateStreak]
  );

  const trackAppOpen = useCallback(() => trackAction('open_app'), [trackAction]);
  const trackViewMatch = useCallback((eventId: string) => trackAction('view_match', { eventId }), [trackAction]);
  const trackPlaceBet = useCallback((betType: 'single' | 'multiple' | 'live') => {
    const actionMap: Record<string, UserActionType> = {
      single: 'place_bet_single',
      multiple: 'place_bet_multiple',
      live: 'place_live_bet',
    };
    trackAction(actionMap[betType], { betType });
  }, [trackAction]);
  const trackVisitLive = useCallback(() => trackAction('visit_live_screen'), [trackAction]);
  const trackExploreMarket = useCallback((marketId: string) => trackAction('explore_new_market', { marketId }), [trackAction]);
  const trackClaimReward = useCallback(() => trackAction('claim_reward'), [trackAction]);
  const trackShareBet = useCallback(() => trackAction('share_bet'), [trackAction]);

  return {
    trackAction,
    trackAppOpen,
    trackViewMatch,
    trackPlaceBet,
    trackVisitLive,
    trackExploreMarket,
    trackClaimReward,
    trackShareBet,
    tracking,
  };
}

/**
 * Hook para completar/resgatar missões
 */
export function useMissionCompletion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeMission = useCallback(async (missionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await requestJson<{
        success: boolean;
        data: { claimedRewards: number };
      }>(buildApiV2Url(`/missions/${missionId}/claim`), {
        method: 'POST',
      });

      if (response.success) {
        // Update local store
        useMissionStore.getState().completeMission(missionId);
        return response.data.claimedRewards;
      }
      return 0;
    } catch (err) {
      console.error('Error completing mission:', err);
      setError('Falha ao resgatar missão');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = useCallback(async (rewardId: string) => {
    try {
      setLoading(true);
      setError(null);

      await requestJson(buildApiV2Url(`/rewards/${rewardId}/claim`), {
        method: 'POST',
      });

      useMissionStore.getState().claimReward(rewardId);
      return true;
    } catch (err) {
      console.error('Error claiming reward:', err);
      setError('Falha ao resgatar recompensa');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    completeMission,
    claimReward,
    loading,
    error,
  };
}

/**
 * Hook para refresh de missões
 */
export function useMissionRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const { profile, refreshDailyMissions, refreshWeeklyMissions } = useMissionStore();

  const refreshDaily = useCallback(async () => {
    try {
      setRefreshing(true);
      await requestJson(buildApiV2Url('/missions/refresh'), {
        method: 'POST',
        body: { profile, type: 'daily' },
      });
      refreshDailyMissions();
    } catch (err) {
      console.error('Error refreshing daily missions:', err);
    } finally {
      setRefreshing(false);
    }
  }, [profile, refreshDailyMissions]);

  const refreshWeekly = useCallback(async () => {
    try {
      setRefreshing(true);
      await requestJson(buildApiV2Url('/missions/refresh'), {
        method: 'POST',
        body: { profile, type: 'weekly' },
      });
      refreshWeeklyMissions();
    } catch (err) {
      console.error('Error refreshing weekly missions:', err);
    } finally {
      setRefreshing(false);
    }
  }, [profile, refreshWeeklyMissions]);

  return {
    refreshDaily,
    refreshWeekly,
    refreshing,
  };
}
