import { useCallback, useEffect, useState } from 'react';
import { Share, Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { useBetslipStore, type SharedBet } from '../stores/betslipStore';

export interface ShareBetResult {
  success: boolean;
  code?: string;
  deepLink?: string;
  webLink?: string;
  error?: string;
}

export interface SharedBetLink {
  code: string;
  deepLink: string;
  webLink: string;
  fullMessage: string;
}

export function useShareBet() {
  const { selections, stake, totalOdds, potentialReturn, saveSharedBet } = useBetslipStore();

  const generateBetLinks = useCallback((code: string): SharedBetLink => {
    const deepLink = `swiftbet://shared-bet/${code}`;
    const webLink = `https://swiftbet.app/shared-bet/${code}`;
    
    return {
      code,
      deepLink,
      webLink,
      fullMessage: '',
    };
  }, []);

  const generateBetMessage = useCallback((sharedBet: SharedBet, links: SharedBetLink): string => {
    const selectionsText = sharedBet.selections
      .map((sel, idx) => {
        const teams = `${sel.event.homeTeam?.name || 'Time A'} × ${sel.event.awayTeam?.name || 'Time B'}`;
        return `${idx + 1}. ${teams}\n   ${sel.marketName} - ${sel.outcomeName} (@${sel.odds.toFixed(2)})`;
      })
      .join('\n\n');

    const linkText = Platform.select({
      ios: `👉 Abra no app: ${links.deepLink}\n🌐 Ou no navegador: ${links.webLink}`,
      android: `👉 Abra no app: ${links.deepLink}\n🌐 Ou no navegador: ${links.webLink}`,
      default: `👉 ${links.webLink}`,
    });

    return `🎫 Bilhete SwiftBet #${sharedBet.code}\n\n` +
      `${selectionsText}\n\n` +
      `💰 Valor: R$ ${sharedBet.stake.toFixed(2)}\n` +
      `📊 Odds: ${sharedBet.totalOdds.toFixed(2)}\n` +
      `🎯 Retorno Potencial: R$ ${sharedBet.potentialReturn.toFixed(2)}\n\n` +
      `${linkText}\n\n` +
      `Aposte você também! 🍀`;
  }, []);

  const shareCurrentBet = useCallback(async (): Promise<ShareBetResult> => {
    if (selections.length === 0) {
      Alert.alert('Cupom vazio', 'Adicione seleções para compartilhar');
      return { success: false, error: 'No selections' };
    }

    try {
      const currentOdds = totalOdds();
      const currentReturn = potentialReturn();

      const sharedBet = saveSharedBet({
        code: '',
        selections: [...selections],
        stake,
        totalOdds: currentOdds,
        potentialReturn: currentReturn,
      });

      const links = generateBetLinks(sharedBet.code);
      const message = generateBetMessage(sharedBet, links);

      const result = await Share.share({
        message,
        title: `Bilhete SwiftBet #${sharedBet.code}`,
        url: links.deepLink,
      });

      if (result.action === Share.sharedAction) {
        return { 
          success: true, 
          code: sharedBet.code,
          deepLink: links.deepLink,
          webLink: links.webLink,
        };
      } else {
        return { success: false, error: 'User cancelled' };
      }
    } catch (error) {
      console.error('Error sharing bet:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o bilhete');
      return { success: false, error: String(error) };
    }
  }, [selections, stake, totalOdds, potentialReturn, saveSharedBet, generateBetLinks, generateBetMessage]);

  const copyBetCode = useCallback((): SharedBetLink | null => {
    if (selections.length === 0) {
      Alert.alert('Cupom vazio', 'Adicione seleções para gerar código');
      return null;
    }

    const currentOdds = totalOdds();
    const currentReturn = potentialReturn();

    const sharedBet = saveSharedBet({
      code: '',
      selections: [...selections],
      stake,
      totalOdds: currentOdds,
      potentialReturn: currentReturn,
    });

    const links = generateBetLinks(sharedBet.code);

    Alert.alert(
      'Código Gerado! 🎫',
      `Seu código: ${sharedBet.code}\n\nDeep link:\n${links.deepLink}\n\nLink web:\n${links.webLink}`,
      [{ text: 'OK' }]
    );

    return { ...links, fullMessage: generateBetMessage(sharedBet, links) };
  }, [selections, stake, totalOdds, potentialReturn, saveSharedBet, generateBetLinks, generateBetMessage]);

  return {
    shareCurrentBet,
    copyBetCode,
    generateBetMessage,
    generateBetLinks,
  };
}

/**
 * Hook para lidar com deep links de bilhetes compartilhados
 */
export function useSharedBetDeepLink(onDeepLinkReceived?: (code: string) => void) {
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const { getSharedBetByCode } = useBetslipStore();

  useEffect(() => {
    // Handler para deep links
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('🔗 Deep link recebido:', url);

      // Parse swiftbet://shared-bet/CODE ou https://swiftbet.app/shared-bet/CODE
      const patterns = [
        /swiftbet:\/\/shared-bet\/([A-Z0-9]{8})/i,
        /https:\/\/swiftbet\.app\/shared-bet\/([A-Z0-9]{8})/i,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          const code = match[1].toUpperCase();
          console.log('🎫 Código de bilhete encontrado:', code);
          setPendingCode(code);
          
          // Verifica se existe localmente
          const localBet = getSharedBetByCode(code);
          if (localBet) {
            console.log('✅ Bilhete encontrado localmente');
          }
          
          onDeepLinkReceived?.(code);
          break;
        }
      }
    };

    // Listener para deep links quando o app já está aberto
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Verifica se o app foi aberto por um deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [onDeepLinkReceived, getSharedBetByCode]);

  const clearPendingCode = useCallback(() => {
    setPendingCode(null);
  }, []);

  return {
    pendingCode,
    clearPendingCode,
  };
}
