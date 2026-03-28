import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { getGreeting, getContextualSubtitle, type HomeContextState } from '../../hooks/useHomeContext';

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
    marginBottom: 20,
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
    color: '#fafafa',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    maxWidth: 140,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
});
