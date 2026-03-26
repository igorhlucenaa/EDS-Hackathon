import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const amounts = [50, 100, 200, 500, 1000];
const methods = ['PIX instantaneo', 'Cartao de credito', 'Transferencia bancaria'];

export function DepositScreen() {
  const navigation = useNavigation();
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [selectedMethod, setSelectedMethod] = useState(methods[0]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Carteira nativa</Text>
        <Text style={styles.title}>Deposito rapido</Text>
        <Text style={styles.subtitle}>
          Fluxo simplificado para continuar apostando sem sair do app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quanto voce quer depositar?</Text>
        <View style={styles.grid}>
          {amounts.map((amount) => {
            const active = amount === selectedAmount;
            return (
              <TouchableOpacity
                key={amount}
                style={[styles.amountCard, active && styles.amountCardActive]}
                onPress={() => setSelectedAmount(amount)}
              >
                <Text style={[styles.amountLabel, active && styles.amountLabelActive]}>
                  R$ {amount}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Metodo</Text>
        <View style={styles.stack}>
          {methods.map((method) => {
            const active = method === selectedMethod;
            return (
              <TouchableOpacity
                key={method}
                style={[styles.methodCard, active && styles.methodCardActive]}
                onPress={() => setSelectedMethod(method)}
              >
                <View style={styles.methodCopy}>
                  <Text style={styles.methodTitle}>{method}</Text>
                  <Text style={styles.methodSubtitle}>
                    Confirmacao rapida e retorno automatico para a carteira.
                  </Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Resumo</Text>
        <Text style={styles.summaryValue}>R$ {selectedAmount.toFixed(2)}</Text>
        <Text style={styles.summaryMethod}>{selectedMethod}</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.primaryButtonText}>Confirmar deposito</Text>
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
    borderColor: 'rgba(34, 197, 94, 0.25)',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: '#fafafa', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amountCard: {
    width: '31%',
    minWidth: 94,
    backgroundColor: '#171717',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  amountCardActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  amountLabel: { color: '#fafafa', fontSize: 15, fontWeight: '700' },
  amountLabelActive: { color: '#22c55e' },
  stack: { gap: 10 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  methodCardActive: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  methodCopy: { flex: 1 },
  methodTitle: { color: '#fafafa', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  methodSubtitle: { color: '#737373', fontSize: 12, lineHeight: 18 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#525252',
  },
  radioActive: {
    borderColor: '#22c55e',
    backgroundColor: '#22c55e',
  },
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
  summaryMethod: { color: '#22c55e', fontSize: 13, marginTop: 6 },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
