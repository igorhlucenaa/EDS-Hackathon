import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BetSelection } from '@/app/data/models/types';

export interface BetslipDraft {
  id: string;
  label: string;
  savedAt: string;
  selections: BetSelection[];
  stake: number;
}

interface DraftState {
  drafts: BetslipDraft[];
  saveDraft: (label: string, selections: BetSelection[], stake: number) => string;
  removeDraft: (id: string) => void;
}

export const useBetslipDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: [],

      saveDraft: (label, selections, stake) => {
        const id = `draft-${Date.now()}`;
        set({
          drafts: [
            { id, label, savedAt: new Date().toISOString(), selections: JSON.parse(JSON.stringify(selections)), stake },
            ...get().drafts,
          ].slice(0, 8),
        });
        return id;
      },

      removeDraft: (id) => set({ drafts: get().drafts.filter((d) => d.id !== id) }),
    }),
    { name: 'eds-betslip-drafts' }
  )
);
