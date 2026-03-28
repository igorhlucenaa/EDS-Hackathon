import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  onboardingDone: boolean;
  setAuthenticated: (value: boolean) => void;
  completeOnboarding: () => void;
  startOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      onboardingDone: false,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      completeOnboarding: () => set({ onboardingDone: true }),
      startOnboarding: () => set({ onboardingDone: false }),
    }),
    {
      name: 'esportesdasorte-auth-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
