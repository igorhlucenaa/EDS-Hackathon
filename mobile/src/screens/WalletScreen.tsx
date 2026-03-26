import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockTransactions, mockUser } from '@shared';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WalletScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Saldo disponível</Text>
        <Text style={styles.heroValue}>R$ {mockUser.balance.toFixed(2)}</Text>
        {mockUser.bonusBalance > 0 && <Text style={styles.heroBonus}>Bônus: R$ {mockUser.bonusBalance.toFixed(2)}</Text>}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('WalletDeposit')}>
            <Text style={styles.primaryButtonText}>Depositar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('WalletWithdraw')}>
            <Text style={styles.secondaryButtonText}>Sacar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico</Text>
        <View style={styles.panel}>
          {mockTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.historyRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{transaction.description}</Text>
                <Text style={styles.historyMeta}>
                  {new Date(transaction.createdAt).toLocaleString('pt-BR')} ·{' '}
                  {transaction.status === 'completed'
                    ? 'Concluído'
                    : transaction.status === 'pending'
                      ? 'Pendente'
                      : 'Falhou'}
                </Text>
              </View>
              <Text style={[styles.historyAmount, transaction.amount > 0 && styles.historyAmountPositive]}>
                {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  hero: {
    backgroundColor: '#171717',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
    marginBottom: 18,
  },
  heroLabel: { color: '#737373', fontSize: 12, marginBottom: 4 },
  heroValue: { color: '#fafafa', fontSize: 30, fontWeight: '800' },
  heroBonus: { color: '#22c55e', fontSize: 14, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  primaryButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#262626',
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  secondaryButtonText: { color: '#fafafa', fontSize: 14, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  panel: {
    backgroundColor: '#171717',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.35)',
  },
  historyTitle: { color: '#fafafa', fontSize: 14, fontWeight: '600' },
  historyMeta: { color: '#737373', fontSize: 11, marginTop: 4 },
  historyAmount: { color: '#fafafa', fontSize: 13, fontWeight: '700' },
  historyAmountPositive: { color: '#22c55e' },
});
