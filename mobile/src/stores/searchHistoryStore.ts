import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryState {
  recentQueries: string[];
  pushQuery: (query: string) => void;
  clear: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      recentQueries: [],
      pushQuery: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        set({
          recentQueries: [trimmed, ...get().recentQueries.filter((item) => item !== trimmed)].slice(0, 8),
        });
      },
      clear: () => set({ recentQueries: [] }),
    }),
    {
      name: 'eds-search-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
