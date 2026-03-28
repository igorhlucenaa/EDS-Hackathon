import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUnreadNotificationsCount } from '../../hooks/useNotifications';
import { brandColors } from '../../theme';

interface NotificationBadgeProps {
  size?: 'small' | 'medium';
}

export function NotificationBadge({ size = 'small' }: NotificationBadgeProps) {
  const count = useUnreadNotificationsCount();

  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();
  const isLargeNumber = count > 9;

  return (
    <View style={[styles.badge, size === 'medium' && styles.badgeMedium, isLargeNumber && styles.badgeWide]}>
      <Text style={[styles.text, size === 'medium' && styles.textMedium]}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: brandColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  badgeMedium: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    top: -6,
    right: -6,
  },
  badgeWide: {
    paddingHorizontal: 4,
  },
  text: {
    color: '#0a0a0a',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  textMedium: {
    fontSize: 12,
    lineHeight: 18,
  },
});
