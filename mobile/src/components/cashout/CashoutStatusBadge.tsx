import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CashoutStatus } from '@shared';

interface CashoutStatusBadgeProps {
  status: CashoutStatus;
  label?: string;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG: Record<CashoutStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  available: {
    label: 'Disponível agora',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    icon: '✓',
  },
  rising: {
    label: 'Valor em alta',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    icon: '↑',
  },
  fluctuating: {
    label: 'Oscilando',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: '~',
  },
  unavailable: {
    label: 'Indisponível',
    color: '#737373',
    bgColor: 'rgba(115, 115, 115, 0.15)',
    icon: '−',
  },
};

export function CashoutStatusBadge({
  status,
  label,
  size = 'small',
}: CashoutStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label || config.label;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bgColor },
        size === 'medium' && styles.containerMedium,
      ]}
    >
      <Text style={[styles.icon, { color: config.color }]}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.color }, size === 'medium' && styles.labelMedium]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  containerMedium: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  icon: {
    fontSize: 10,
    fontWeight: '600',
    marginRight: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  labelMedium: {
    fontSize: 12,
  },
});
