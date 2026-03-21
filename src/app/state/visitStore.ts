import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VisitState {
  lastVisitAt: string | null;
  recentEventIds: string[];
  pushRecentEvent: (eventId: string) => void;
  markVisitComplete: () => void;
}

export const useVisitStore = create<VisitState>()(
  persist(
    (set, get) => ({
      lastVisitAt: null,
      recentEventIds: [],

      pushRecentEvent: (eventId) =>
        set((s) => {
          const next = [eventId, ...s.recentEventIds.filter((id) => id !== eventId)].slice(0, 12);
          return { recentEventIds: next };
        }),

      markVisitComplete: () => set({ lastVisitAt: new Date().toISOString() }),
    }),
    { name: 'eds-visit' }
  )
);

export function useLastVisitDelta(): { hours: number; isFirstVisit: boolean } {
  const last = useVisitStore((s) => s.lastVisitAt);
  if (!last) return { hours: 0, isFirstVisit: true };
  const hours = (Date.now() - new Date(last).getTime()) / 3600000;
  return { hours, isFirstVisit: false };
}
