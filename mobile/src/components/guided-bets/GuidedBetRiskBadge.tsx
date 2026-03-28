import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { GuidedBetRiskLevel } from '@shared';

interface GuidedBetRiskBadgeProps {
  level: GuidedBetRiskLevel;
  size?: 'small' | 'medium';
}

const RISK_CONFIG: Record<GuidedBetRiskLevel, { label: string; color: string; bgColor: string; icon: string }> = {
  low: {
    label: 'Baixo Risco',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    icon: '🛡️',
  },
  medium: {
    label: 'Risco Médio',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: '⚖️',
  },
  high: {
    label: 'Alto Risco',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    icon: '🚀',
  },
};

export function GuidedBetRiskBadge({ level, size = 'small' }: GuidedBetRiskBadgeProps) {
  const config = RISK_CONFIG[level];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bgColor },
        size === 'medium' && styles.containerMedium,
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.color }, size === 'medium' && styles.labelMedium]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  containerMedium: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  icon: {
    fontSize: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  labelMedium: {
    fontSize: 12,
  },
});
