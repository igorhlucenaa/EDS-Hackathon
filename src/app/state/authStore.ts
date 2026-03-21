import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  onboardingDone: boolean;
  setAuthenticated: (v: boolean) => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true,
      onboardingDone: true,
      setAuthenticated: (v) => set({ isAuthenticated: v }),
      completeOnboarding: () => set({ onboardingDone: true }),
    }),
    { name: 'eds-auth' }
  )
);
