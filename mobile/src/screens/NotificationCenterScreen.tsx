import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationListItem } from '../components/notifications/NotificationListItem';
import { EmptyNotificationsState } from '../components/notifications/EmptyNotificationsState';
import { semanticColors, spacing, typography, radius } from '../theme';
import type { NotificationCategory } from '../stores/notificationStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const categories: { key: NotificationCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'live', label: 'Ao vivo' },
  { key: 'missions', label: 'Missões' },
  { key: 'suggestions', label: 'Sugestões' },
  { key: 'account', label: 'Conta' },
];

export function NotificationCenterScreen() {
  const navigation = useNavigation<Nav>();
  const {
    notifications,
    isLoading,
    unreadCount,
    loadNotifications,
    handleNotificationPress,
    markAllAsRead,
  } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications =
    selectedCategory === 'all'
      ? notifications
      : notifications.filter((n) => n.category === selectedCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notificações</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Marcar lidas</Text>
            </TouchableOpacity>
          )}
        </View>
        {unreadCount > 0 && (
          <Text style={styles.subtitle}>
            {unreadCount} {unreadCount === 1 ? 'não lida' : 'não lidas'}
          </Text>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.filterChip, selectedCategory === cat.key && styles.filterChipActive]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === cat.key && styles.filterChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={semanticColors.action.primary} />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </View>
      ) : filteredNotifications.length === 0 ? (
        <EmptyNotificationsState hasFilter={selectedCategory !== 'all'} />
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={semanticColors.action.primary}
            />
          }
        >
          {filteredNotifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.background.primary,
  },
  header: {
    padding: spacing['4'],
    paddingTop: spacing['6'],
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.default,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  title: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  markAllButton: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    backgroundColor: semanticColors.background.elevated,
    borderRadius: radius.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing['2'],
  },
  backIcon: {
    color: semanticColors.text.primary,
    fontSize: 24,
    fontWeight: '600',
  },
  markAllText: {
    color: semanticColors.action.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  filterWrapper: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.default,
  },
  filterContainer: {
    paddingHorizontal: spacing['4'],
    gap: spacing['2'],
    alignItems: 'center',
    height: 50,
  },
  filterChip: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    backgroundColor: semanticColors.background.secondary,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: semanticColors.border.default,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: `${semanticColors.action.primary}20`,
    borderColor: semanticColors.action.primary,
  },
  filterChipText: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: semanticColors.action.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['4'],
  },
  loadingText: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing['4'],
    paddingBottom: spacing['8'],
  },
});
