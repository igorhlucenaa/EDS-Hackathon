import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { getGreeting, getContextualSubtitle, type HomeContextState } from '../../hooks/useHomeContext';
import { brandColors, semanticColors, spacing, typography, radius } from '../../theme';

interface HomeHeaderProps {
  context: HomeContextState;
  onMissionPress?: () => void;
}

export function HomeHeader({ context, onMissionPress }: HomeHeaderProps) {
  const experienceMode = useUserStore((s: { experienceMode: string }) => s.experienceMode);
  const greeting = getGreeting();
  const subtitle = getContextualSubtitle(context);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logos/logo-white-s.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.topRow}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        
        {context.hasAlmostCompletedMission && (
          <TouchableOpacity style={styles.statusBadge} onPress={onMissionPress}>
            <Text style={styles.statusIcon}>🎯</Text>
            <Text style={styles.statusText}>Missão quase pronta!</Text>
          </TouchableOpacity>
        )}
        
        {context.hasOpenBets && !context.hasAlmostCompletedMission && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusIcon}>🔥</Text>
            <Text style={styles.statusText}>Aposta ao vivo</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
    paddingHorizontal: spacing[4],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing[5],
    marginTop: spacing[2],
  },
  logo: {
    width: 140,
    height: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.5,
    marginBottom: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  subtitle: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.base,
    lineHeight: 20,
    fontFamily: typography.fontFamily.sans,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${brandColors.green[400]}26`, // 15% opacity
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${brandColors.green[400]}4D`, // 30% opacity
    maxWidth: 140,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    color: brandColors.green[400],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    flexShrink: 1,
    fontFamily: typography.fontFamily.sans,
  },
});
