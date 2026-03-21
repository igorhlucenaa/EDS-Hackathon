import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VisitState {
  lastVisitAt: string | null;
  recentEventIds: string[];
  /** Oculta o banner de boas-vindas na Home após "Entendi" / CTA. */
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
      merge: (persisted, current) => {
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

export function useLastVisitDelta(): { hours: number; isFirstVisit: boolean } {
  const last = useVisitStore((s) => s.lastVisitAt);
  if (!last) return { hours: 0, isFirstVisit: true };
  const hours = (Date.now() - new Date(last).getTime()) / 3600000;
  return { hours, isFirstVisit: false };
}
