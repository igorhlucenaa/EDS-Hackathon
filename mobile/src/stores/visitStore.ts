import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VisitState {
  lastVisitAt: string | null;
  recentEventIds: string[];
  homeWelcomeDismissed: boolean;
  pushRecentEvent: (eventId: string) => void;
  markVisitComplete: () => void;
  dismissHomeWelcome: () => void;
}

export const useVisitStore = create<VisitState>()(
  persist(
    (set) => ({
      lastVisitAt: null,
      recentEventIds: [],
      homeWelcomeDismissed: false,

      pushRecentEvent: (eventId) =>
        set((s) => {
          const next = [eventId, ...s.recentEventIds.filter((id) => id !== eventId)].slice(0, 12);
          return { recentEventIds: next };
        }),

      markVisitComplete: () => set({ lastVisitAt: new Date().toISOString() }),

      dismissHomeWelcome: () => set({ homeWelcomeDismissed: true }),
    }),
    {
      name: 'eds-visit',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<VisitState> | undefined;
        if (!p || typeof p !== 'object') return current;
        return {
          ...current,
          ...p,
          homeWelcomeDismissed: p.homeWelcomeDismissed ?? Boolean(p.lastVisitAt),
        };
      },
    }
  )
);
