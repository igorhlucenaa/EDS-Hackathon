import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Mission } from '../../../../shared/types';

interface MissionCardProps {
  mission: Mission;
  onPress?: () => void;
  onClaim?: () => void;
  compact?: boolean;
}

export function MissionCard({ mission, onPress, onClaim, compact = false }: MissionCardProps) {
  const getStatusColor = () => {
    switch (mission.status) {
      case 'completed':
      case 'claimed':
        return '#00C851';
      case 'in_progress':
        return '#FF8800';
      case 'available':
        return '#33b5e5';
      default:
        return '#666';
    }
  };

  const getStatusText = () => {
    switch (mission.status) {
      case 'completed':
        return 'Completada - Resgatar';
      case 'claimed':
        return 'Recompensa Resgatada';
      case 'in_progress':
        return 'Em Progresso';
      case 'available':
        return 'Disponível';
      default:
        return 'Bloqueada';
    }
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={styles.compactHeader}>
          <Text style={styles.icon}>{mission.icon}</Text>
          <View style={styles.compactInfo}>
            <Text style={styles.title} numberOfLines={1}>{mission.title}</Text>
            <Text style={styles.description} numberOfLines={1}>{mission.description}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{mission.progress}%</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${mission.progress}%`, backgroundColor: getStatusColor() }]} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.iconLarge}>{mission.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.description}>{mission.description}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {mission.currentCount} / {mission.targetCount}
          </Text>
          <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${mission.progress}%`, backgroundColor: getStatusColor() }]} />
        </View>
      </View>

      {mission.status === 'completed' && (
        <TouchableOpacity style={styles.claimButton} onPress={onClaim}>
          <Text style={styles.claimButtonText}>🎁 Resgatar Recompensa</Text>
        </TouchableOpacity>
      )}

      {mission.rewards && mission.rewards.length > 0 && (
        <View style={styles.rewardsSection}>
          {mission.rewards.map((reward, index) => (
            <View key={index} style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>{reward.icon}</Text>
              <Text style={styles.rewardTitle} numberOfLines={1}>{reward.title}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  compactCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  iconLarge: {
    fontSize: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  compactInfo: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 13,
    color: '#888',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  claimButton: {
    backgroundColor: '#00C851',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  claimButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rewardsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  rewardTitle: {
    fontSize: 12,
    color: '#aaa',
  },
});
