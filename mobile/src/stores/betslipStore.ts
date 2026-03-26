import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BetSelection, BetslipMode, BetType } from '@shared';

interface BetslipStore {
  selections: BetSelection[];
  stake: number;
  mode: BetslipMode;
  betType: BetType;
  isOpen: boolean;

  addSelection: (selection: BetSelection) => void;
  removeSelection: (selectionId: string) => void;
  toggleSelection: (selection: BetSelection) => void;
  clearSelections: () => void;
  setStake: (stake: number) => void;
  setMode: (mode: BetslipMode) => void;
  setBetType: (betType: BetType) => void;
  setOpen: (open: boolean) => void;

  totalOdds: () => number;
  potentialReturn: () => number;
  hasSelection: (outcomeId: string) => boolean;
}

export const useBetslipStore = create<BetslipStore>()(
  persist(
    (set, get) => ({
      selections: [],
      stake: 10,
      mode: 'simple',
      betType: 'single',
      isOpen: false,

      addSelection: (selection) =>
        set((s) => ({ selections: [...s.selections, selection] })),

      removeSelection: (selectionId) =>
        set((s) => ({ selections: s.selections.filter((sel) => sel.id !== selectionId) })),

      toggleSelection: (selection) => {
        const exists = get().selections.find((s) => s.id === selection.id);
        if (exists) {
          get().removeSelection(selection.id);
        } else {
          get().addSelection(selection);
        }
      },

      clearSelections: () => set({ selections: [] }),
      setStake: (stake) => set({ stake }),
      setMode: (mode) => set({ mode }),
      setBetType: (betType) => set({ betType }),
      setOpen: (isOpen) => set({ isOpen }),

      totalOdds: () => {
        const { selections } = get();
        if (selections.length === 0) return 0;
        return selections.reduce((acc, s) => acc * s.odds, 1);
      },

      potentialReturn: () => {
        const { stake } = get();
        return stake * get().totalOdds();
      },

      hasSelection: (outcomeId) =>
        get().selections.some((s) => s.outcomeId === outcomeId),
    }),
    {
      name: 'eds-betslip',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ selections: s.selections, stake: s.stake, mode: s.mode, betType: s.betType }),
    }
  )
);
