import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PreferencesState {
  pushBetResults: boolean;
  pushOddsMoves: boolean;
  pushEventStart: boolean;
  emailWeekly: boolean;
  compactOdds: boolean;
  updatePrefs: (values: Partial<Omit<PreferencesState, 'updatePrefs'>>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pushBetResults: true,
      pushOddsMoves: true,
      pushEventStart: true,
      emailWeekly: false,
      compactOdds: false,
      updatePrefs: (values) => set(values),
    }),
    {
      name: 'eds-prefs',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
