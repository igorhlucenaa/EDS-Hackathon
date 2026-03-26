import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockUser } from '@shared';

const presets = [50, 100, 200, 400];

export function WithdrawScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState(100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Saque para PIX</Text>
        <Text style={styles.subtitle}>
          Saldo disponivel para retirada imediata: R$ {mockUser.balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escolha um valor</Text>
        <View style={styles.grid}>
          {presets.map((preset) => {
            const active = preset === amount;
            return (
              <TouchableOpacity
                key={preset}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setAmount(preset)}
              >
                <Text style={[styles.cardText, active && styles.cardTextActive]}>
                  R$ {preset}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta cadastrada</Text>
        <View style={styles.bankCard}>
          <Text style={styles.bankTitle}>PIX</Text>
          <Text style={styles.bankValue}>lucas.silva@email.com</Text>
          <Text style={styles.bankMeta}>Disponivel para retirada imediata</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Valor solicitado</Text>
        <Text style={styles.summaryValue}>R$ {amount.toFixed(2)}</Text>
        <Text style={styles.summaryHint}>
          Prazo estimado: alguns minutos apos a confirmacao.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.primaryButtonText}>Solicitar saque</Text>
      </TouchableOpacity>
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
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 18,
  },
  title: { color: '#fafafa', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%',
    backgroundColor: '#171717',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  cardActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  cardText: { color: '#fafafa', fontSize: 15, fontWeight: '700' },
  cardTextActive: { color: '#22c55e' },
  bankCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  bankTitle: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  bankValue: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  bankMeta: { color: '#737373', fontSize: 12 },
  summary: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 18,
  },
  summaryLabel: { color: '#737373', fontSize: 12, marginBottom: 6 },
  summaryValue: { color: '#fafafa', fontSize: 28, fontWeight: '800' },
  summaryHint: { color: '#a3a3a3', fontSize: 12, lineHeight: 18, marginTop: 6 },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
