import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBetslipStore } from '../stores/betslipStore';

export function BetslipScreen() {
  const navigation = useNavigation();
  const { selections, stake, totalOdds, potentialReturn, removeSelection, clearSelections, setOpen } = useBetslipStore();

  if (selections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Cupom vazio</Text>
        <Text style={styles.emptySub}>Adicione seleções aos jogos para apostar</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            setOpen(false);
            (navigation as any).goBack();
          }}
        >
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {selections.map((sel) => (
          <View key={sel.id} style={styles.selection}>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionTeams}>
                {sel.event.home.shortName} x {sel.event.away.shortName}
              </Text>
              <Text style={styles.selectionMarket}>
                {sel.outcomeName} @ {sel.odds.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeSelection(sel.id)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={clearSelections} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Limpar cupom</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totals}>
          <Text style={styles.totalLabel}>Odds totais</Text>
          <Text style={styles.totalValue}>{totalOdds().toFixed(2)}</Text>
        </View>
        <View style={styles.totals}>
          <Text style={styles.totalLabel}>Retorno potencial</Text>
          <Text style={styles.totalValue}>R$ {potentialReturn().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeBtn}>
          <Text style={styles.placeBtnText}>Apostar R$ {stake.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#fafafa', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#737373', marginBottom: 24 },
  backBtn: {
    backgroundColor: '#262626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: { color: '#fafafa', fontWeight: '600' },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 24 },
  selection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171717',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  selectionInfo: { flex: 1 },
  selectionTeams: { fontSize: 14, fontWeight: '600', color: '#fafafa' },
  selectionMarket: { fontSize: 12, color: '#737373', marginTop: 4 },
  removeBtn: { padding: 8 },
  removeBtnText: { fontSize: 16, color: '#737373' },
  clearBtn: { marginTop: 8, alignSelf: 'flex-start' },
  clearBtnText: { fontSize: 14, color: '#ef4444' },
  footer: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#171717',
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.5)',
  },
  totals: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14, color: '#737373' },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#fafafa' },
  placeBtn: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  placeBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
