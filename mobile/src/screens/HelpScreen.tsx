import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const faqs = [
  {
    id: 'kyc',
    title: 'Como deposito e saco no app?',
    description: 'Use a carteira nativa para iniciar um deposito ou solicitar saque via PIX.',
  },
  {
    id: 'betslip',
    title: 'Onde acompanho minhas apostas?',
    description: 'A aba Apostas mostra abertas, ao vivo, ganhos e oportunidades de cashout.',
  },
  {
    id: 'alerts',
    title: 'Como recebo alertas importantes?',
    description: 'Em Preferencias voce define push para resultados, odds e eventos.',
  },
];

export function HelpScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Ajuda</Text>
        <Text style={styles.subtitle}>
          Fluxos principais do app nativo e atalhos para resolver rapido.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perguntas frequentes</Text>
        <View style={styles.stack}>
          {faqs.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atalhos</Text>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Text style={styles.linkText}>Abrir carteira</Text>
          <Text style={styles.linkArrow}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.linkText}>Ver notificacoes</Text>
          <Text style={styles.linkArrow}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.linkText}>Buscar evento</Text>
          <Text style={styles.linkArrow}>{'>'}</Text>
        </TouchableOpacity>
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
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 18,
  },
  title: { color: '#fafafa', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  stack: { gap: 10 },
  card: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  cardTitle: { color: '#fafafa', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  cardDescription: { color: '#a3a3a3', fontSize: 12, lineHeight: 18 },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  linkText: { color: '#fafafa', fontSize: 14, fontWeight: '600' },
  linkArrow: { color: '#737373', fontSize: 16 },
});
