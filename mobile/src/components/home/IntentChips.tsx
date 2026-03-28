import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';

type IntentChip = {
  emoji: string;
  label: string;
  description: string;
  target: 'tab' | 'stack';
  screen: keyof MainTabParamList | keyof RootStackParamList;
  priority: 'high' | 'medium' | 'low';
};

const INTENT_CHIPS: IntentChip[] = [
  {
    emoji: '⚡',
    label: 'Quero emoção',
    description: 'Ao vivo agora',
    target: 'tab',
    screen: 'Live',
    priority: 'high',
  },
  {
    emoji: '🛡️',
    label: 'Quero segurança',
    description: 'Odds mais seguras',
    target: 'stack',
    screen: 'IntentExplore',
    priority: 'medium',
  },
  {
    emoji: '⏰',
    label: 'Quero agilidade',
    description: 'Começando já',
    target: 'tab',
    screen: 'Explore',
    priority: 'high',
  },
  {
    emoji: '📊',
    label: 'Quero múltipla',
    description: 'Combinações rápidas',
    target: 'stack',
    screen: 'MarketExplorer',
    priority: 'medium',
  },
  {
    emoji: '🎯',
    label: 'Quero missão',
    description: 'Ganhar recompensa',
    target: 'stack',
    screen: 'Missions',
    priority: 'high',
  },
  {
    emoji: '⭐',
    label: 'Meus favoritos',
    description: 'Times e ligas',
    target: 'stack',
    screen: 'Favorites',
    priority: 'low',
  },
];

interface IntentChipsProps {
  onNavigate: (target: 'tab' | 'stack', screen: string) => void;
}

export function IntentChips({ onNavigate }: IntentChipsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>O que você quer?</Text>
        <Text style={styles.subtitle}>Atalhos por intenção, não por categoria</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {INTENT_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.label}
            style={[
              styles.chip,
              chip.priority === 'high' && styles.chipHighPriority,
            ]}
            onPress={() => onNavigate(chip.target, chip.screen as string)}
            activeOpacity={0.8}
          >
            <Text style={styles.chipEmoji}>{chip.emoji}</Text>
            <Text style={styles.chipLabel}>{chip.label}</Text>
            <Text style={styles.chipDescription}>{chip.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  subtitle: {
    color: '#525252',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 10,
  },
  chip: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 14,
    minWidth: 110,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  chipHighPriority: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  chipEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  chipLabel: {
    color: '#fafafa',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  chipDescription: {
    color: '#737373',
    fontSize: 11,
  },
});
