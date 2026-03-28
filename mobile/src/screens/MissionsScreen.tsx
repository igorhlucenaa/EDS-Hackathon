import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMissions, useMissionCompletion, useMissionRefresh } from '../hooks/useMissions';
import { useMissionStore } from '../stores/missionStore';
import { MissionCard } from '../components/missions/MissionCard';
import type { Mission, UserProfile } from '../../../shared/types';

const getProfileLabel = (profile: UserProfile): string => {
  const labels: Record<UserProfile, string> = {
    beginner: '🌱 Iniciante',
    casual: '🎯 Casual',
    engaged: '🔥 Engajado',
    returning: '🔄 Retornando',
  };
  return labels[profile];
};

const getProfileColor = (profile: UserProfile): string => {
  const colors: Record<UserProfile, string> = {
    beginner: '#33b5e5',
    casual: '#FF8800',
    engaged: '#00C851',
    returning: '#aa66cc',
  };
  return colors[profile];
};

export function MissionsScreen() {
  const navigation = useNavigation();
  const { missions, summary, loading, refetch } = useMissions();
  const { completeMission, claimReward, loading: claiming } = useMissionCompletion();
  const { refreshDaily, refreshWeekly, refreshing } = useMissionRefresh();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'rewards'>('daily');

  const { rewards, dailyMissions, weeklyMissions, profile } = useMissionStore();

  const handleClaimMission = async (mission: Mission) => {
    const claimed = await completeMission(mission.id);
    if (claimed > 0) {
      Alert.alert(
        '🎉 Missão Completada!',
        `Você resgatou ${claimed} recompensa(s)!`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    const success = await claimReward(rewardId);
    if (success) {
      Alert.alert('🎁 Recompensa Resgatada!', 'Aproveite seu prêmio!', [{ text: 'OK' }]);
    }
  };

  const onRefresh = async () => {
    await refetch();
  };

  const availableRewards = rewards.filter((r) => r.status === 'available');
  const claimedRewards = rewards.filter((r) => r.status === 'claimed');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      >
        {/* Header com Nível e Streak */}
        <View style={styles.header}>
          <View style={styles.levelSection}>
            <View style={styles.levelCircle}>
              <Text style={styles.levelNumber}>{summary?.level || 1}</Text>
              <Text style={styles.levelLabel}>NÍVEL</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.profileLabel}>
                Perfil: <Text style={{ color: getProfileColor(profile) }}>{getProfileLabel(profile)}</Text>
              </Text>
              <View style={styles.xpBar}>
                <View
                  style={[
                    styles.xpFill,
                    { width: `${summary?.xpProgress || 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.xpText}>
                {summary?.totalXp || 0} XP • {summary?.xpProgress || 0}% para próximo
              </Text>
            </View>
          </View>

          <View style={styles.streakSection}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakNumber}>{summary?.currentStreak || 0}</Text>
            <Text style={styles.streakLabel}>dias seguidos</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'daily' && styles.tabActive]}
            onPress={() => setActiveTab('daily')}
          >
            <Text style={[styles.tabText, activeTab === 'daily' && styles.tabTextActive]}>
              📅 Diárias
            </Text>
            {dailyMissions.some((m) => m.status === 'completed') && (
              <View style={styles.badge} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>
              📆 Semanais
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rewards' && styles.tabActive]}
            onPress={() => setActiveTab('rewards')}
          >
            <Text style={[styles.tabText, activeTab === 'rewards' && styles.tabTextActive]}>
              🎁 Recompensas
            </Text>
            {availableRewards.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{availableRewards.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'daily' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Missões Diárias</Text>
                <TouchableOpacity onPress={refreshDaily} disabled={refreshing}>
                  <Text style={styles.refreshText}>🔄 Atualizar</Text>
                </TouchableOpacity>
              </View>
              {dailyMissions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyText}>Nenhuma missão diária</Text>
                </View>
              ) : (
                dailyMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClaim={() => handleClaimMission(mission)}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'weekly' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Missões Semanais</Text>
                <TouchableOpacity onPress={refreshWeekly} disabled={refreshing}>
                  <Text style={styles.refreshText}>🔄 Atualizar</Text>
                </TouchableOpacity>
              </View>
              {weeklyMissions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyText}>Nenhuma missão semanal</Text>
                </View>
              ) : (
                weeklyMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClaim={() => handleClaimMission(mission)}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'rewards' && (
            <>
              {availableRewards.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Recompensas Disponíveis</Text>
                  {availableRewards.map((reward) => (
                    <TouchableOpacity
                      key={reward.id}
                      style={styles.rewardCard}
                      onPress={() => handleClaimReward(reward.id)}
                    >
                      <Text style={styles.rewardIcon}>{reward.icon}</Text>
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        <Text style={styles.rewardDescription}>{reward.description}</Text>
                      </View>
                      <TouchableOpacity style={styles.claimBtn}>
                        <Text style={styles.claimBtnText}>Resgatar</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {claimedRewards.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recompensas Resgatadas</Text>
                  {claimedRewards.map((reward) => (
                    <View key={reward.id} style={[styles.rewardCard, styles.rewardClaimed]}>
                      <Text style={styles.rewardIcon}>{reward.icon}</Text>
                      <View style={styles.rewardInfo}>
                        <Text style={[styles.rewardTitle, { color: '#666' }]}>{reward.title}</Text>
                        <Text style={styles.rewardDescription}>Resgatada ✓</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {availableRewards.length === 0 && claimedRewards.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🎁</Text>
                  <Text style={styles.emptyText}>Nenhuma recompensa ainda</Text>
                  <Text style={styles.emptySub}>Complete missões para ganhar recompensas!</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{summary?.totalMissionsCompleted || 0}</Text>
            <Text style={styles.statLabel}>Missões</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{claimedRewards.length}</Text>
            <Text style={styles.statLabel}>Recompensas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{summary?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  levelSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00C851',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  levelInfo: {
    flex: 1,
  },
  profileLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  xpBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#00C851',
    borderRadius: 4,
  },
  xpText: {
    color: '#888',
    fontSize: 12,
  },
  streakSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#333',
  },
  streakIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8800',
  },
  streakLabel: {
    fontSize: 12,
    color: '#888',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0a0a',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#00C851',
  },
  tabText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF8800',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  refreshText: {
    color: '#33b5e5',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySub: {
    color: '#666',
    fontSize: 13,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  rewardClaimed: {
    opacity: 0.6,
    borderColor: '#444',
  },
  rewardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardDescription: {
    color: '#888',
    fontSize: 13,
  },
  claimBtn: {
    backgroundColor: '#00C851',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  claimBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#1a1a1a',
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C851',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
  },
});
