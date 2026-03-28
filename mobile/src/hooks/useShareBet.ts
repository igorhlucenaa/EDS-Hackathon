import { useCallback } from 'react';
import { Share, Alert } from 'react-native';
import { useBetslipStore, type SharedBet } from '../stores/betslipStore';

export interface ShareBetResult {
  success: boolean;
  code?: string;
  link?: string;
  error?: string;
}

export function useShareBet() {
  const { selections, stake, totalOdds, potentialReturn, saveSharedBet } = useBetslipStore();

  // Link mockado da Esportes da Sorte
  const generateMockedLink = useCallback((code: string): string => {
    // Simula um link da Esportes da Sorte (mockado)
    return `https://www.esportesdasorte.com/bilhete/${code}`;
  }, []);

  const generateBetMessage = useCallback((sharedBet: SharedBet, link: string): string => {
    const selectionsText = sharedBet.selections
      .map((sel, idx) => {
        const homeTeam = sel.event.home?.name || sel.event.homeTeam?.name || 'Time A';
        const awayTeam = sel.event.away?.name || sel.event.awayTeam?.name || 'Time B';
        return `${idx + 1}. ${homeTeam} x ${awayTeam} - ${sel.marketName} (${sel.outcomeName} @${sel.odds.toFixed(2)})`;
      })
      .join('\n');

    return `🎫 Bilhete Esportes da Sorte #${sharedBet.code}\n` +
      `${selectionsText}\n\n` +
      `💰 Aposta: R$${sharedBet.stake.toFixed(2)} | 📊 Odds: ${sharedBet.totalOdds.toFixed(2)} | 🎯 Retorno: R$${sharedBet.potentialReturn.toFixed(2)}\n\n` +
      `� ${link}\n\n` +
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

      const link = generateMockedLink(sharedBet.code);
      const message = generateBetMessage(sharedBet, link);

      const result = await Share.share({
        message,
        title: `Bilhete Esportes da Sorte #${sharedBet.code}`,
      });

      if (result.action === Share.sharedAction) {
        return { 
          success: true, 
          code: sharedBet.code,
          link,
        };
      } else {
        return { success: false, error: 'User cancelled' };
      }
    } catch (error) {
      console.error('Error sharing bet:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o bilhete');
      return { success: false, error: String(error) };
    }
  }, [selections, stake, totalOdds, potentialReturn, saveSharedBet, generateMockedLink, generateBetMessage]);

  const copyBetCode = useCallback((): { code: string; link: string } | null => {
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

    const link = generateMockedLink(sharedBet.code);

    Alert.alert(
      'Código Gerado! 🎫',
      `Seu código: ${sharedBet.code}\n\nLink:\n${link}`,
      [{ text: 'OK' }]
    );

    return { code: sharedBet.code, link };
  }, [selections, stake, totalOdds, potentialReturn, saveSharedBet, generateMockedLink]);

  return {
    shareCurrentBet,
    copyBetCode,
    generateBetMessage,
    generateMockedLink,
  };
}
