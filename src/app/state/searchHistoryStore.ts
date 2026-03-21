import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryState {
  recentQueries: string[];
  pushQuery: (q: string) => void;
  clear: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      recentQueries: [],
      pushQuery: (q) => {
        const t = q.trim();
        if (!t) return;
        set({ recentQueries: [t, ...get().recentQueries.filter((x) => x !== t)].slice(0, 8) });
      },
      clear: () => set({ recentQueries: [] }),
    }),
    { name: 'eds-search-history' }
  )
);
