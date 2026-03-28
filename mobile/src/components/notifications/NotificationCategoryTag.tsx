import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NotificationCategory } from '../../stores/notificationStore';
import { semanticColors, spacing, radius, typography } from '../../theme';

interface NotificationCategoryTagProps {
  category: NotificationCategory;
}

const categoryConfig: Record<NotificationCategory, { label: string; color: string; icon: string }> = {
  live: { label: 'Ao vivo', color: semanticColors.state.live, icon: '🔴' },
  missions: { label: 'Missões', color: semanticColors.state.success, icon: '🎯' },
  suggestions: { label: 'Sugestões', color: semanticColors.state.info, icon: '💡' },
  account: { label: 'Conta', color: '#a855f7', icon: '👤' },
};

export function NotificationCategoryTag({ category }: NotificationCategoryTagProps) {
  const config = categoryConfig[category];

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}20` }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: radius.full,
  },
  icon: {
    fontSize: 10,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
