import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationCategory = 'live' | 'missions' | 'suggestions' | 'account';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  createdAt: string;
  isRead: boolean;
  actionType: 'navigate' | 'none';
  actionPayload?: {
    screen: string;
    params?: Record<string, unknown>;
  };
  priority: NotificationPriority;
}

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  refreshUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      unreadCount: 0,

      setNotifications: (notifications) => {
        set({ notifications });
        get().refreshUnreadCount();
      },

      markAsRead: (id) => {
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        set({ notifications: updated });
        get().refreshUnreadCount();
      },

      markAllAsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
        set({ notifications: updated, unreadCount: 0 });
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
        get().refreshUnreadCount();
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      refreshUnreadCount: () => {
        const count = get().notifications.filter((n) => !n.isRead).length;
        set({ unreadCount: count });
      },
    }),
    {
      name: 'eds-notifications',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
