import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { MissionSummary, UserProfile } from '../../../../shared/types';

interface MissionSummaryCardProps {
  summary: MissionSummary | null;
  onPress?: () => void;
  loading?: boolean;
}

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

export function MissionSummaryCard({ summary, onPress, loading }: MissionSummaryCardProps) {
  if (loading || !summary) {
    return (
      <View style={styles.loadingCard}>
        <View style={styles.loadingHeader}>
          <View style={styles.loadingIcon} />
          <View style={styles.loadingText} />
        </View>
        <View style={styles.loadingBar} />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{summary.level}</Text>
        </View>
        <View style={styles.profileBadge}>
          <Text style={[styles.profileText, { color: getProfileColor(summary.profile) }]}>
            {getProfileLabel(summary.profile)}
          </Text>
        </View>
        {summary.hasAvailableReward && (
          <View style={styles.rewardIndicator}>
            <Text style={styles.rewardIndicatorText}>🎁</Text>
          </View>
        )}
      </View>

      <View style={styles.streakRow}>
        <Text style={styles.streakText}>🔥 {summary.currentStreak} dias seguidos</Text>
        <Text style={styles.xpText}>{summary.totalXp} XP</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${summary.xpProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{summary.xpProgress}% para Lv.{summary.level + 1}</Text>
      </View>

      {summary.dailyMission && (
        <View style={styles.missionPreview}>
          <Text style={styles.previewLabel}>Missão do Dia:</Text>
          <Text style={styles.previewTitle} numberOfLines={1}>
            {summary.dailyMission.icon} {summary.dailyMission.title}
          </Text>
          <View style={styles.miniProgress}>
            <View
              style={[
                styles.miniProgressFill,
                { width: `${summary.dailyMission.progress}%` },
              ]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  loadingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#00C851',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileBadge: {
    flex: 1,
  },
  profileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rewardIndicator: {
    backgroundColor: '#FF8800',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardIndicatorText: {
    fontSize: 18,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakText: {
    color: '#FF8800',
    fontSize: 14,
    fontWeight: '600',
  },
  xpText: {
    color: '#888',
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C851',
    borderRadius: 4,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
  },
  missionPreview: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#33b5e5',
  },
  previewLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  miniProgress: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#33b5e5',
    borderRadius: 2,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingIcon: {
    width: 50,
    height: 30,
    backgroundColor: '#333',
    borderRadius: 20,
    marginRight: 8,
  },
  loadingText: {
    flex: 1,
    height: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  loadingBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
});
