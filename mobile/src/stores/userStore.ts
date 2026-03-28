import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  favoriteSports: string[];
  favoriteLeagues: string[];
  favoriteTeams: string[];
  toggleFavoriteSport: (id: string) => void;
  toggleFavoriteLeague: (id: string) => void;
  toggleFavoriteTeam: (id: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      favoriteSports: ['football', 'basketball'],
      favoriteLeagues: ['brasileirao-a', 'champions-league', 'nba'],
      favoriteTeams: ['t-fla', 't-lal'],
      toggleFavoriteSport: (id) => {
        const cur = get().favoriteSports;
        set({ favoriteSports: cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id] });
      },
      toggleFavoriteLeague: (id) => {
        const cur = get().favoriteLeagues;
        set({ favoriteLeagues: cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id] });
      },
      toggleFavoriteTeam: (id) => {
        const cur = get().favoriteTeams;
        set({ favoriteTeams: cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id] });
      },
    }),
    { name: 'eds-user-prefs', storage: createJSONStorage(() => AsyncStorage) }
  )
);
