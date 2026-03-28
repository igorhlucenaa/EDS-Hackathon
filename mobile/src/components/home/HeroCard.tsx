import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { HomeContextState } from '../../hooks/useHomeContext';
import { brandColors, semanticColors, spacing, typography, radius } from '../../theme';

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
      case 'mission_almost': return `${brandColors.green[400]}26`; // 15% opacity
      case 'promo_welcome': return `${brandColors.blue[500]}26`;
      default: return `${brandColors.green[400]}1A`; // 10% opacity
    }
  };

  const getBorderColor = () => {
    switch (context.heroType) {
      case 'open_bet': return 'rgba(239, 68, 68, 0.3)';
      case 'mission_almost': return `${brandColors.green[400]}4D`; // 30% opacity
      case 'promo_welcome': return `${brandColors.blue[500]}4D`;
      default: return `${brandColors.green[400]}33`; // 20% opacity
    }
  };

  const getAccentColor = () => {
    switch (context.heroType) {
      case 'open_bet': return semanticColors.state.error;
      case 'mission_almost': return brandColors.green[400];
      case 'promo_welcome': return brandColors.blue[400];
      default: return brandColors.green[400];
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
    marginBottom: spacing[6],
    paddingHorizontal: spacing[4],
  },
  labelContainer: {
    marginBottom: spacing[2],
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: typography.fontFamily.sans,
  },
  card: {
    borderRadius: radius['2xl'],
    padding: spacing[5],
    borderWidth: 1.5,
  },
  title: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
    letterSpacing: -0.3,
    fontFamily: typography.fontFamily.sans,
  },
  subtitle: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing[4],
    lineHeight: 22,
    fontFamily: typography.fontFamily.sans,
  },
  ctaContainer: {
    flexDirection: 'row',
  },
  ctaButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
  },
  ctaText: {
    color: semanticColors.background.base,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans,
  },
});
