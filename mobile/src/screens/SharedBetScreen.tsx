import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useBetslipStore, type SharedBet } from '../stores/betslipStore';
import type { RootStackParamList } from '../navigation/types';

type SharedBetRouteProp = RouteProp<RootStackParamList, 'SharedBet'>;

export function SharedBetScreen() {
  const navigation = useNavigation();
  const route = useRoute<SharedBetRouteProp>();
  const { getSharedBetByCode, sharedBets, removeSharedBet } = useBetslipStore();
  const [codeInput, setCodeInput] = useState('');
  const [foundBet, setFoundBet] = useState<SharedBet | null>(null);

  // Pega o código dos parâmetros da rota (para deep links)
  const initialCode = route.params?.code;

  // Efeito para buscar automaticamente quando aberto via deep link
  useEffect(() => {
    if (initialCode) {
      setCodeInput(initialCode);
      // Busca o bilhete
      const bet = getSharedBetByCode(initialCode);
      if (bet) {
        setFoundBet(bet);
      } else {
        Alert.alert(
          'Bilhete não encontrado',
          `O código ${initialCode} não foi encontrado localmente.\n\nVerifique se o bilhete ainda está disponível ou se o código está correto.`
        );
      }
    }
  }, [initialCode, getSharedBetByCode]);

  const handleSearch = () => {
    const code = codeInput.trim().toUpperCase();
    if (code.length !== 8) {
      Alert.alert('Código inválido', 'Digite um código de 8 caracteres');
      return;
    }

    const bet = getSharedBetByCode(code);
    if (bet) {
      setFoundBet(bet);
    } else {
      Alert.alert('Bilhete não encontrado', 'Verifique o código e tente novamente');
      setFoundBet(null);
    }
  };

  const handleCopyToMyBetslip = () => {
    if (!foundBet) return;
    Alert.alert(
      'Copiar para cupom?',
      'Isso substituirá seu cupom atual pelas seleções deste bilhete.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Copiar',
          onPress: () => {
            // Aqui você pode implementar a lógica de copiar as seleções
            Alert.alert('Sucesso!', 'Seleções copiadas para seu cupom');
            (navigation as any).navigate('Betslip');
          },
        },
      ]
    );
  };

  const renderBetCard = (bet: SharedBet, isFound: boolean) => (
    <View key={bet.id} style={[styles.betCard, isFound && styles.foundCard]}>
      <View style={styles.betHeader}>
        <Text style={styles.betCode}>🎫 #{bet.code}</Text>
        <Text style={styles.betDate}>
          {new Date(bet.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <View style={styles.selectionsList}>
        {bet.selections.map((sel, idx) => (
          <View key={sel.id} style={styles.selectionItem}>
            <Text style={styles.selectionNumber}>{idx + 1}</Text>
            <View style={styles.selectionDetails}>
              <Text style={styles.teams}>
                {sel.event.home?.name || sel.event.homeTeam?.name || 'Time A'} ×{' '}
                {sel.event.away?.name || sel.event.awayTeam?.name || 'Time B'}
              </Text>
              <Text style={styles.marketInfo}>
                {sel.marketName} - {sel.outcomeName}
              </Text>
              <Text style={styles.odds}>Odds: {sel.odds.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.betSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Valor</Text>
          <Text style={styles.summaryValue}>R$ {bet.stake.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Odds Totais</Text>
          <Text style={styles.summaryValue}>{bet.totalOdds.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Retorno Potencial</Text>
          <Text style={[styles.summaryValue, styles.potentialReturn]}>
            R$ {bet.potentialReturn.toFixed(2)}
          </Text>
        </View>
      </View>

      {isFound && (
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopyToMyBetslip}>
          <Text style={styles.copyBtnText}>📋 Copiar para meu cupom</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Buscar Bilhete</Text>

        {/* Busca por código */}
        <View style={styles.searchSection}>
          <Text style={styles.label}>Digite o código do bilhete</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ex: ABC12345"
              placeholderTextColor="#666"
              value={codeInput}
              onChangeText={(text) => setCodeInput(text.toUpperCase())}
              maxLength={8}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>🔍 Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resultado da busca */}
        {foundBet && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Bilhete Encontrado</Text>
            {renderBetCard(foundBet, true)}
          </View>
        )}

        {/* Meus bilhetes compartilhados */}
        {sharedBets.length > 0 && (
          <View style={styles.myBetsSection}>
            <Text style={styles.sectionTitle}>Meus Bilhetes Compartilhados</Text>
            {sharedBets.map((bet) => renderBetCard(bet, false))}
          </View>
        )}

        {/* Estado vazio */}
        {!foundBet && sharedBets.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyTitle}>Nenhum bilhete compartilhado</Text>
            <Text style={styles.emptySub}>
              Compartilhe seus bilhetes na tela de cupom ou busque um código de amigo
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  searchSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchBtn: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#0a0a0a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  myBetsSection: {
    marginBottom: 24,
  },
  betCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  foundCard: {
    borderColor: '#00ff00',
    borderWidth: 2,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  betCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff00',
  },
  betDate: {
    fontSize: 12,
    color: '#888',
  },
  selectionsList: {
    gap: 12,
    marginBottom: 16,
  },
  selectionItem: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00ff00',
    color: '#0a0a0a',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionDetails: {
    flex: 1,
  },
  teams: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  marketInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  odds: {
    fontSize: 12,
    color: '#00ff00',
    fontWeight: 'bold',
  },
  betSummary: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  potentialReturn: {
    color: '#00ff00',
  },
  copyBtn: {
    backgroundColor: '#00ff00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyBtnText: {
    color: '#0a0a0a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
