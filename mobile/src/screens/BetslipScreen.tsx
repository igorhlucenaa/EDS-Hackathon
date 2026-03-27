import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBetslipStore } from '../stores/betslipStore';
import { usePlaceBet, useBetCalculator } from '../hooks';

export function BetslipScreen() {
  const navigation = useNavigation();
  const { selections, removeSelection, clearSelections, setOpen } = useBetslipStore();
  const [stake, setStake] = useState<number>(10);
  const [isPlacing, setIsPlacing] = useState(false);

  // Hook para calcular odds
  const { calculateTotalOdds, calculateReturn } = useBetCalculator();

  // Hook para colocar aposta
  const { placeBet, loading: placingBet } = usePlaceBet();

  // Calcular odds e retorno
  const totalOdds = calculateTotalOdds(selections.map((s) => s.odds));
  const potentialReturn = calculateReturn(stake, totalOdds);

  const handlePlaceBet = async () => {
    if (selections.length === 0) {
      Alert.alert('Cupom vazio', 'Adicione seleções para apostar');
      return;
    }

    if (stake <= 0) {
      Alert.alert('Valor inválido', 'Digite um valor de aposta válido');
      return;
    }

    setIsPlacing(true);
    try {
      const result = await placeBet({
        selections: selections.map((s) => ({
          eventId: s.eventId,
          marketId: s.marketId,
          outcomeId: s.outcomeId,
          odds: s.odds,
        })),
        stake,
        expectedReturn: potentialReturn,
      });

      Alert.alert(
        '✅ Aposta realizada!',
        `Seu cupom #${result.betId} foi registrado.\nRetorno potencial: R$ ${potentialReturn.toFixed(2)}`
      );

      clearSelections();
      setStake(10);
      setOpen(false);
      (navigation as any).navigate('Account');
    } catch (error) {
      Alert.alert('❌ Erro', 'Não conseguimos processar sua aposta. Tente novamente.');
      console.error('Bet placement error:', error);
    } finally {
      setIsPlacing(false);
    }
  };

  if (selections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Cupom vazio</Text>
        <Text style={styles.emptySub}>Adicione seleções aos jogos para apostar</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            setOpen(false);
            (navigation as any).goBack();
          }}
        >
          <Text style={styles.backBtnText}>Voltar aos Jogos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Seu Cupom</Text>
          <Text style={styles.selectionCount}>{selections.length} seleção(ões)</Text>
        </View>

        {/* Seleções */}
        {selections.map((sel) => (
          <View key={sel.id} style={styles.selection}>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionTeams}>
                {sel.event.homeTeam?.name || 'Time A'} × {sel.event.awayTeam?.name || 'Time B'}
              </Text>
              <Text style={styles.selectionMarket}>
                {sel.marketName} - {sel.outcomeName}
              </Text>
              <Text style={styles.selectionOdds}>
                Odds: <Text style={styles.oddsValue}>{sel.odds.toFixed(2)}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeSelection(sel.id)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Apagador de Cupom */}
        <TouchableOpacity onPress={clearSelections} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>🗑️ Limpar cupom</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer com Totais */}
      <View style={styles.footer}>
        {/* Valor da Aposta */}
        <View style={styles.stakeSection}>
          <Text style={styles.stakeLabel}>Valor da aposta</Text>
          <View style={styles.stakeInputContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.stakeInput}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={stake.toString()}
              onChangeText={(val) => setStake(parseFloat(val) || 0)}
            />
          </View>
        </View>

        {/* Totais */}
        <View style={styles.summarySection}>
          <SummaryRow label="Odds totais" value={totalOdds.toFixed(2)} green={false} />
          <View style={styles.divider} />
          <SummaryRow
            label="Retorno potencial"
            value={`R$ ${potentialReturn.toFixed(2)}`}
            green={true}
          />
        </View>

        {/* Botão Colocar Aposta */}
        <TouchableOpacity
          style={[styles.placeBtn, (isPlacing || placingBet) && styles.placeBtnDisabled]}
          onPress={handlePlaceBet}
          disabled={isPlacing || placingBet}
        >
          {isPlacing || placingBet ? (
            <ActivityIndicator color="#0a0a0a" size="small" />
          ) : (
            <Text style={styles.placeBtnText}>
              ✅ Apostar R$ {stake.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, green && styles.summaryValueGreen]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  },
  emptySub: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#0a0a0a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectionCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  selection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff00',
  },
  selectionInfo: {
    flex: 1,
  },
  selectionTeams: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectionMarket: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  selectionOdds: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  oddsValue: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: 8,
    marginLeft: 8,
  },
  removeBtnText: {
    fontSize: 18,
    color: '#ff0000',
    fontWeight: 'bold',
  },
  clearBtn: {
    marginTop: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  clearBtnText: {
    fontSize: 13,
    color: '#ff0000',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  stakeSection: {
    marginBottom: 16,
  },
  stakeLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  stakeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00',
    marginRight: 8,
  },
  stakeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  summarySection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  summaryValueGreen: {
    color: '#00ff00',
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 4,
  },
  placeBtn: {
    backgroundColor: '#00ff00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeBtnDisabled: {
    opacity: 0.6,
  },
  placeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0a0a0a',
  },
});
