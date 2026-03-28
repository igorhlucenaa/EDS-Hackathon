import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

/**
 * Hook para carregar a fonte Inter do Google Fonts via Expo
 * Retorna true quando as fontes estão carregadas
 */
export function useAppFonts(): boolean {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  return fontsLoaded;
}

/**
 * Hook que garante que o app só renderize após as fontes carregarem
 * Mostra um splash simples enquanto carrega
 */
export function useFontsWithSplash(): { fontsLoaded: boolean; isReady: boolean } {
  const fontsLoaded = useAppFonts();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      // Pequeno delay para garantir transição suave
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  return { fontsLoaded, isReady };
}
