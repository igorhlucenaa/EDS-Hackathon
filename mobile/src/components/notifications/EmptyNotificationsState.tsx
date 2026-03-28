import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticColors, spacing, typography, radius } from '../../theme';

interface EmptyNotificationsStateProps {
  hasFilter?: boolean;
}

export function EmptyNotificationsState({ hasFilter }: EmptyNotificationsStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔔</Text>
      </View>
      <Text style={styles.title}>
        {hasFilter ? 'Nenhuma notificação nesta categoria' : 'Nenhuma notificação'}
      </Text>
      <Text style={styles.message}>
        {hasFilter
          ? 'Tente ver outras categorias ou marque todas como lidas.'
          : 'Você está atualizado! Novas notificações aparecerão aqui.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['6'],
    marginTop: spacing['12'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius['2xl'],
    backgroundColor: semanticColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  icon: {
    fontSize: 36,
  },
  title: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  message: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
