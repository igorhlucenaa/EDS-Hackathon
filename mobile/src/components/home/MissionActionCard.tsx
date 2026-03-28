import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { MissionSummary } from '@shared';

interface MissionActionCardProps {
  summary: MissionSummary | null;
  loading?: boolean;
  onPress: () => void;
}

export function MissionActionCard({ summary, loading, onPress }: MissionActionCardProps) {
  if (loading || !summary) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Missão do dia</Text>
        </View>
        <View style={styles.loadingCard}>
          <View style={styles.loadingBar} />
        </View>
      </View>
    );
  }

  const hasReward = summary.hasAvailableReward;
  const mission = summary.dailyMission;
  const progress = summary.xpProgress;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sua jornada</Text>
        {hasReward && (
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardBadgeText}>🎁 Recompensa!</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        {/* Level and streak */}
        <View style={styles.topRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>Lv.{summary.level}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {summary.currentStreak} dias</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{summary.totalXp} XP</Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.nextLevel}>Faltam {summary.nextLevelXp - (summary.totalXp % 100)} XP para Lv.{summary.level + 1}</Text>
        </View>

        {/* Active mission */}
        {mission && (
          <View style={styles.missionSection}>
            <View style={styles.missionHeader}>
              <Text style={styles.missionIcon}>{mission.icon}</Text>
              <Text style={styles.missionTitle} numberOfLines={1}>{mission.title}</Text>
            </View>
            <View style={styles.missionProgressBar}>
              <View style={[styles.missionProgressFill, { width: `${mission.progress}%` }]} />
            </View>
            <Text style={styles.missionProgressText}>{mission.progress}% completo</Text>
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>
            {hasReward ? 'Resgatar recompensa →' : mission && mission.progress >= 60 ? 'Quase lá! Continuar →' : 'Ver missões →'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  rewardBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  rewardBadgeText: {
    color: '#a855f7',
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#171717',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  loadingCard: {
    backgroundColor: '#171717',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  loadingBar: {
    height: 8,
    backgroundColor: '#262626',
    borderRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    color: '#FF8800',
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '500',
  },
  progressPercent: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#262626',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  nextLevel: {
    color: '#737373',
    fontSize: 11,
  },
  missionSection: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  missionTitle: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  missionProgressBar: {
    height: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  missionProgressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  missionProgressText: {
    color: '#737373',
    fontSize: 11,
    textAlign: 'right',
  },
  ctaRow: {
    alignItems: 'flex-end',
  },
  ctaText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '700',
  },
});
