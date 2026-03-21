import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PrefsState {
  pushBetResults: boolean;
  pushOddsMoves: boolean;
  pushEventStart: boolean;
  emailWeekly: boolean;
  compactOdds: boolean;
  updatePrefs: (p: Partial<Omit<PrefsState, 'updatePrefs'>>) => void;
}

export const usePreferencesStore = create<PrefsState>()(
  persist(
    (set) => ({
      pushBetResults: true,
      pushOddsMoves: true,
      pushEventStart: true,
      emailWeekly: false,
      compactOdds: false,
      updatePrefs: (p) => set(p),
    }),
    { name: 'eds-prefs' }
  )
);
