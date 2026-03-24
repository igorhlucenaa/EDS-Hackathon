import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { MarketOutcome } from '@shared';

interface OddsCellProps {
  outcome: MarketOutcome;
  onSelect: () => void;
  isSelected: boolean;
  compact?: boolean;
}

export function OddsCell({ outcome, onSelect, isSelected, compact }: OddsCellProps) {
  if (outcome.isLocked) {
    return (
      <TouchableOpacity style={[styles.cell, styles.locked]} disabled>
        <Text style={styles.lockedText}>🔒</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.cell, isSelected && styles.selected]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {!compact && (
        <Text style={[styles.label, isSelected && styles.selectedText]}>
          {outcome.name}
        </Text>
      )}
      <Text style={[styles.value, isSelected && styles.selectedText]}>
        {outcome.odds.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(38, 38, 38, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  locked: {
    opacity: 0.5,
  },
  lockedText: {
    fontSize: 12,
    color: '#737373',
  },
  label: {
    fontSize: 10,
    color: '#737373',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
  },
  selectedText: {
    color: 'rgba(255,255,255,0.9)',
  },
});
