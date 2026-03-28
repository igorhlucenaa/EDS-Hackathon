import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Notification, NotificationPriority } from '../../stores/notificationStore';
import { NotificationCategoryTag } from './NotificationCategoryTag';
import { semanticColors, spacing, typography, radius } from '../../theme';

interface NotificationListItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

const priorityIndicator: Record<NotificationPriority, string> = {
  low: '',
  medium: '•',
  high: '●',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  return `${diffDays}d`;
}

export function NotificationListItem({ notification, onPress }: NotificationListItemProps) {
  const { title, message, category, createdAt, isRead, priority } = notification;

  return (
    <TouchableOpacity
      style={[styles.container, !isRead && styles.unread]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <NotificationCategoryTag category={category} />
        <View style={styles.meta}>
          {!isRead && (
            <Text style={[styles.priority, priority === 'high' && styles.priorityHigh]}>
              {priorityIndicator[priority]}
            </Text>
          )}
          <Text style={styles.time}>{formatRelativeTime(createdAt)}</Text>
        </View>
      </View>

      <Text style={[styles.title, !isRead && styles.titleUnread]}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {!isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColors.background.elevated,
    borderRadius: radius.lg,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: semanticColors.border.default,
  },
  unread: {
    borderColor: `${semanticColors.action.primary}40`,
    backgroundColor: `${semanticColors.action.primary}08`,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  priority: {
    color: semanticColors.text.muted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  priorityHigh: {
    color: semanticColors.state.error,
  },
  time: {
    color: semanticColors.text.muted,
    fontSize: typography.fontSize.xs,
  },
  title: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing['1'],
  },
  titleUnread: {
    fontWeight: typography.fontWeight.bold,
  },
  message: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing['4'],
    right: spacing['4'],
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semanticColors.action.primary,
  },
});
