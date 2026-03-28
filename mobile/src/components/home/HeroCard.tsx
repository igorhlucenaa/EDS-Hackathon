import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { HomeContextState } from '../../hooks/useHomeContext';

interface HeroCardProps {
  context: HomeContextState;
  onPress: () => void;
}

export function HeroCard({ context, onPress }: HeroCardProps) {
  if (!context.heroType || !context.heroData) return null;

  const getIcon = () => {
    switch (context.heroType) {
      case 'open_bet': return '🔥';
      case 'mission_almost': return '🎯';
      case 'promo_welcome': return '🎁';
      case 'favorite_event': return '⏰';
      case 'live_event': return '⚡';
      default: return '⭐';
    }
  };

  const getBackgroundColor = () => {
    switch (context.heroType) {
      case 'open_bet': return 'rgba(239, 68, 68, 0.15)';
      case 'mission_almost': return 'rgba(34, 197, 94, 0.15)';
      case 'promo_welcome': return 'rgba(168, 85, 247, 0.15)';
      default: return 'rgba(34, 197, 94, 0.1)';
    }
  };

  const getBorderColor = () => {
    switch (context.heroType) {
      case 'open_bet': return 'rgba(239, 68, 68, 0.3)';
      case 'mission_almost': return 'rgba(34, 197, 94, 0.3)';
      case 'promo_welcome': return 'rgba(168, 85, 247, 0.3)';
      default: return 'rgba(34, 197, 94, 0.2)';
    }
  };

  const getAccentColor = () => {
    switch (context.heroType) {
      case 'open_bet': return '#ef4444';
      case 'mission_almost': return '#22c55e';
      case 'promo_welcome': return '#a855f7';
      default: return '#22c55e';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: getAccentColor() }]}>
          {getIcon()} Melhor ação agora
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.title}>{context.heroTitle}</Text>
        <Text style={styles.subtitle}>{context.heroSubtitle}</Text>
        
        <View style={styles.ctaContainer}>
          <View style={[styles.ctaButton, { backgroundColor: getAccentColor() }]}>
            <Text style={styles.ctaText}>{context.heroCta} →</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
  },
  title: {
    color: '#fafafa',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  ctaContainer: {
    flexDirection: 'row',
  },
  ctaButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
