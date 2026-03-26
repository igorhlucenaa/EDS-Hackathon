import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockPromotions } from '@shared';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const categoryLabel: Record<string, string> = {
  welcome: 'Boas-vindas',
  sports: 'Esportes',
  live: 'Ao vivo',
  cashback: 'Cashback',
  special: 'Especial',
};

export function PromotionsScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Promoções</Text>
        <Text style={styles.subtitle}>Regras claras, benefícios objetivos e CTAs diretos.</Text>
      </View>

      <View style={styles.stack}>
        {mockPromotions.map((promotion) => (
          <View key={promotion.id} style={styles.card}>
            <Text style={styles.category}>{categoryLabel[promotion.category] ?? promotion.category}</Text>
            <Text style={styles.cardTitle}>{promotion.title}</Text>
            <Text style={styles.description}>{promotion.description}</Text>
            <Text style={styles.expiration}>
              Válido até {new Date(promotion.expiresAt).toLocaleDateString('pt-BR')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('WalletDeposit')}>
              <Text style={styles.cta}>{promotion.ctaText} →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#fafafa' },
  subtitle: { fontSize: 13, color: '#737373', marginTop: 4 },
  stack: { gap: 12 },
  card: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  category: { color: '#22c55e', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  cardTitle: { color: '#fafafa', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  description: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  expiration: { color: '#737373', fontSize: 11, marginTop: 10 },
  cta: { color: '#22c55e', fontSize: 14, fontWeight: '700', marginTop: 10 },
});
