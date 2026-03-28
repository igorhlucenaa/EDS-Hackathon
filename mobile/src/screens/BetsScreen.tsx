import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { mockBets } from '@shared';

export function BetsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Minhas apostas</Text>
      {mockBets.map((bet) => (
        <View key={bet.id} style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.status, bet.status === 'live' ? styles.statusLive : styles.statusOpen]}>
              <Text style={styles.statusText}>
                {bet.status === 'live' ? 'Ao vivo' : bet.status === 'won' ? 'Ganha' : bet.status === 'lost' ? 'Perdida' : 'Aberta'}
              </Text>
            </View>
            <Text style={styles.type}>{bet.betType === 'accumulator' ? 'Acumulada' : 'Simples'}</Text>
          </View>
          {bet.selections.map((sel) => (
            <Text key={sel.id} style={styles.selection}>
              <Text style={styles.selectionName}>{sel.outcomeName}</Text> — {sel.marketName}
            </Text>
          ))}
          <View style={styles.footer}>
            <Text style={styles.stake}>Stake: R${bet.stake.toFixed(2)}</Text>
            <Text style={styles.return}>R${bet.potentialReturn.toFixed(2)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '700', color: '#fafafa', marginBottom: 16 },
  card: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  status: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  statusLive: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  statusOpen: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
  statusText: { fontSize: 10, fontWeight: '500', color: '#fafafa' },
  type: { fontSize: 12, color: '#737373' },
  selection: { fontSize: 12, color: '#737373', marginBottom: 4 },
  selectionName: { color: '#fafafa', fontWeight: '500' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  stake: { fontSize: 12, color: '#737373' },
  return: { fontSize: 14, fontWeight: '600', color: '#22c55e' },
});
