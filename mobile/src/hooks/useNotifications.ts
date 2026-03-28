import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNotificationStore, type Notification, type NotificationCategory } from '../stores/notificationStore';
import { mockNotifications } from '../../../shared/mocks/notifications';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Hook principal para notificações
export function useNotifications() {
  const navigation = useNavigation<Nav>();
  const {
    notifications,
    isLoading,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
    setLoading,
  } = useNotificationStore();

  // Carrega notificações mockadas (simula fetch)
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));
    setNotifications(mockNotifications);
    setLoading(false);
  }, [setLoading, setNotifications]);

  // Marca como lida e navega se tiver ação
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      markAsRead(notification.id);

      if (notification.actionType === 'navigate' && notification.actionPayload) {
        const { screen, params } = notification.actionPayload;
        // Navegação dinâmica baseada no payload
        if (screen === 'Live') {
          navigation.navigate('MainTabs', { screen: 'Live' });
        } else if (screen === 'Explore') {
          navigation.navigate('MainTabs', { screen: 'Explore' });
        } else if (screen === 'Bets') {
          navigation.navigate('MainTabs', { screen: 'Bets' });
        } else if (screen === 'Home') {
          navigation.navigate('MainTabs', { screen: 'Home' });
        } else if (screen === 'Notifications') {
          navigation.navigate('Notifications');
        }
      }
    },
    [markAsRead, navigation]
  );

  // Filtra por categoria
  const getByCategory = useCallback(
    (category: NotificationCategory) => {
      return notifications.filter((n) => n.category === category);
    },
    [notifications]
  );

  // Agrupa por categoria para exibição
  const groupedByCategory = useCallback(() => {
    const groups: Record<NotificationCategory, Notification[]> = {
      live: [],
      missions: [],
      suggestions: [],
      account: [],
    };
    notifications.forEach((n) => {
      groups[n.category].push(n);
    });
    return groups;
  }, [notifications]);

  return {
    notifications,
    isLoading,
    unreadCount,
    loadNotifications,
    handleNotificationPress,
    markAsRead,
    markAllAsRead,
    getByCategory,
    groupedByCategory: groupedByCategory(),
  };
}

// Hook simples para contador de não lidas
export function useUnreadNotificationsCount() {
  return useNotificationStore((state) => state.unreadCount);
}

// Hook para marcar como lida
export function useMarkNotificationAsRead() {
  return useNotificationStore((state) => state.markAsRead);
}
